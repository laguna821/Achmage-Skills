"""Absolute-time CPU compositor. Streams one RGBA frame at a time to FFmpeg."""
import argparse, json, math, re, subprocess, sys, time
from pathlib import Path
from functools import lru_cache
from xml.etree import ElementTree as ET
import skia
from fontTools.pens.basePen import BasePen
from fontTools.svgLib.path import parse_path

ROOT=Path(__file__).resolve().parents[1]
DEFAULTS=dict(x=0,y=0,scale=1,rotation=0,opacity=1,draw=1)
def smooth(x):
    x=max(0,min(1,x));return x*x*(3-2*x)
def state(layer,t):
    result={}
    for key,default in DEFAULTS.items():
        value=layer.get(key,default);at=0
        for point in layer.get('keyframes',[]):
            if key not in point:continue
            if t<point['at']:
                u=smooth((t-at)/(point['at']-at)) if point['at']!=at else 1
                value+=u*(point[key]-value);break
            value=point[key];at=point['at']
        result[key]=value
    return result
def color(value):
    value=value.lstrip('#')
    if len(value)==3:value=''.join(c*2 for c in value)
    return skia.ColorSetARGB(255,*[int(value[i:i+2],16) for i in (0,2,4)])
class Pen(BasePen):
    def __init__(self):super().__init__(None);self.path=skia.Path()
    def _moveTo(self,p):self.path.moveTo(*p)
    def _lineTo(self,p):self.path.lineTo(*p)
    def _curveToOne(self,a,b,c):self.path.cubicTo(*a,*b,*c)
    def _qCurveToOne(self,a,b):self.path.quadTo(*a,*b)
    def _closePath(self):self.path.close()
@lru_cache(maxsize=256)
def length(d):
    pen=Pen();parse_path(d,pen);m=skia.PathMeasure(pen.path,False);total=m.getLength()
    while m.nextContour():total+=m.getLength()
    return total
def drawing(markup,amount):
    if amount>=.99999:return markup
    root=ET.fromstring('<svg>'+markup+'</svg>')
    for item in root.iter('path'):
        if item.get('pathLength')=='1':
            n=length(item.attrib['d']);item.attrib.pop('pathLength',None);item.set('stroke-dasharray',str(n));item.set('stroke-dashoffset',str(n*(1-amount)))
    return ''.join(ET.tostring(x,encoding='unicode') for x in root)
@lru_cache(maxsize=128)
def svg_dom(markup,defs,width,height):
    data=f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}"><defs>{defs}</defs>{markup}</svg>'.encode()
    dom=skia.SVGDOM.MakeFromStream(skia.MemoryStream(data))
    if dom is None:raise ValueError('Skia could not decode SVG layer')
    return dom
@lru_cache(maxsize=24)
def font(name,size):
    source=ROOT/('vendor/awesome-ai-motion/lib/fonts/BodoniModa.ttf' if name=='Bodoni' else 'assets/fonts/PretendardVariable.ttf')
    face=skia.Typeface.MakeFromFile(str(source))
    if face is None:raise ValueError('Missing TTF font '+str(source))
    result=skia.Font(face,size);result.setSubpixel(True);return result
def morph(layer,t):
    frames=layer['morph'];a=frames[0]
    for b in frames[1:]:
        if t<b['at']:
            u=smooth((t-a['at'])/(b['at']-a['at']));numbers=iter(float(x) for x in re.findall(r'-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?',b['d'],re.I))
            return re.sub(r'-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?',lambda m:str(float(m[0])+(next(numbers)-float(m[0]))*u),a['d'],flags=re.I)
        a=b
    return a['d']
def render(project,frame,width,height,portrait=False):
    scene=next(s for s in project['scenes'] if s['start']<=frame<s['end']);t=(frame-scene['start'])/30
    composition=scene.get('portrait_composition',scene['composition']) if portrait else scene['composition']
    bw,bh=composition.get('width',1920),composition.get('height',1080)
    surface=skia.Surface(width,height);canvas=surface.getCanvas();canvas.clear(color(composition.get('background','#ede8dc')))
    fit=min(width/bw,height/bh);canvas.translate((width-bw*fit)/2,(height-bh*fit)/2);canvas.scale(fit,fit)
    units={c['content_id']:c['display_text'] for c in project['content_units']}
    for layer in composition['layers']:
        v=state(layer,t)
        if v['opacity']<=0 or v['draw']<=0:continue
        canvas.save();canvas.saveLayerAlpha(None,round(max(0,min(1,v['opacity']))*255))
        px,py=layer.get('pivot',[bw/2,bh/2]);canvas.translate(v['x'],v['y']);canvas.translate(px,py);canvas.rotate(v['rotation']);canvas.scale(v['scale'],v['scale']);canvas.translate(-px,-py)
        if layer['kind']=='text':
            value=units[layer['content_id']] if layer.get('content_id') else layer.get('text','');f=font(layer.get('font','Pretendard'),layer.get('size',48));ids=f.textToGlyphs(value)
            if 0 in ids:raise ValueError('Missing glyph in '+value)
            widths=f.getWidths(ids);tracking=layer.get('tracking',0);full=sum(widths)+max(0,len(widths)-1)*tracking;x,y=layer.get('position',[bw/2,bh/2]);align=layer.get('align','middle');x-=full/2 if align=='middle' else full if align=='end' else 0
            paint=skia.Paint(Color=color(layer.get('color','#173d48')),AntiAlias=True)
            for char,w in zip(value,widths):canvas.drawString(char,x,y,f,paint);x+=w+tracking
        elif layer['kind']=='svg':
            markup=layer.get('svg','')
            if layer.get('morph'):markup=f'<path d="{morph(layer,t)}" fill="{layer.get("fill","none")}" stroke="{layer.get("stroke","#173d48")}" stroke-width="{layer.get("stroke_width",3)}" pathLength="1"/>'
            markup=drawing(markup,v['draw'])
            if layer.get('clip'):markup=f'<g clip-path="url(#{layer["clip"]})">{markup}</g>'
            svg_dom(markup,composition.get('defs',''),bw,bh).render(canvas)
        else:raise ValueError('Skia compositor currently accepts svg/text layers only')
        canvas.restore();canvas.restore()
    return surface.makeImageSnapshot()
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--project',type=Path,required=True);ap.add_argument('--width',type=int,default=1920);ap.add_argument('--height',type=int,default=1080);ap.add_argument('--start',type=int,default=0);ap.add_argument('--end',type=int);ap.add_argument('--frame',type=int);ap.add_argument('--out',type=Path,required=True);ap.add_argument('--ffmpeg');ap.add_argument('--crf',default='18');ap.add_argument('--portrait',action='store_true');ap.add_argument('--stop-after',type=int);a=ap.parse_args();p=json.loads(a.project.read_text(encoding='utf-8-sig'));a.out.parent.mkdir(parents=True,exist_ok=True)
    if a.frame is not None:
        render(p,a.frame,a.width,a.height,a.portrait).save(str(a.out),skia.kPNG);return
    if not a.ffmpeg or a.end is None:raise ValueError('Video needs --ffmpeg and --end')
    cmd=[a.ffmpeg,'-y','-v','error','-f','rawvideo','-pixel_format','rgba','-video_size',f'{a.width}x{a.height}','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-threads','2','-preset','veryfast','-crf',a.crf,'-pix_fmt','yuv420p','-movflags','+faststart',str(a.out)]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.PIPE);started=time.perf_counter()
    try:
        for index,frame in enumerate(range(a.start,a.end)):
            if a.stop_after is not None and index>=a.stop_after:raise RuntimeError('Test interruption requested')
            image=render(p,frame,a.width,a.height,a.portrait);process.stdin.write(image.toarray(colorType=skia.kRGBA_8888_ColorType,alphaType=skia.kPremul_AlphaType).tobytes())
        process.stdin.close();error=process.stderr.read();code=process.wait()
        if code:raise RuntimeError(error.decode(errors='replace'))
    finally:
        if process.poll() is None:process.kill();process.wait()
    print(json.dumps({'renderer':'Skia CPU','frames':a.end-a.start,'seconds':time.perf_counter()-started,'gpu':False}))
if __name__=='__main__':main()
