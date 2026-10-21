"""CPU video-container adapter. Sequential RGBA, one source frame and output frame.

The JS adapter authors/validates absolute-time geometry for both snapshots and film.
FFmpeg owns source frame-rate/rotation normalization; Pillow owns crop and round mask.
"""
import argparse, json, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps, ImageChops

def read_frame(stream, size):
    chunks=[]; left=size
    while left:
        b=stream.read(left)
        if not b: raise RuntimeError("Source ended before requested container frame")
        chunks.append(b); left-=len(b)
    return b"".join(chunks)

def render(p):
    if p['version']!='media-container-render-v1' or len(p['geometry'])!=p['frames']:
        raise ValueError('Validated container plan required')
    w,h=p['width'],p['height'];dw,dh=p['decode_width'],p['decode_height']
    vf=f"trim=start={p['source_in']}:duration={(p['frames']+p['start_frame'])/30*p['speed']},setpts=(PTS-STARTPTS)/{p['speed']},fps=30"
    if p['start_frame']: vf+=f",trim=start_frame={p['start_frame']},setpts=PTS-STARTPTS"
    if p.get('crop'):
        x,y,cw,ch=p['crop'];vf+=f",crop=iw*{cw}:ih*{ch}:iw*{x}:ih*{y}"
    vf+=f",scale={dw}:{dh},setsar=1,format=rgba"
    decode=[p['ffmpeg'],'-nostdin','-v','error','-threads','2','-i',p['source'],'-vf',vf,'-an','-frames:v',str(p['frames']),'-threads','2','-pix_fmt','rgba','-f','rawvideo','pipe:1']
    encode=[p['ffmpeg'],'-nostdin','-y','-v','error','-f','rawvideo','-pixel_format','rgba','-video_size',f'{w}x{h}','-framerate','30','-i','pipe:0','-an','-frames:v',str(p['frames']),'-c:v','ffv1','-level','3','-threads','2','-pix_fmt','bgra',p['output']]
    dec=enc=None
    with tempfile.TemporaryFile() as derr, tempfile.TemporaryFile() as eerr:
        try:
            dec=subprocess.Popen(decode,stdout=subprocess.PIPE,stderr=derr)
            enc=subprocess.Popen(encode,stdin=subprocess.PIPE,stderr=eerr)
            for g in p['geometry']:
                src=Image.frombytes('RGBA',(dw,dh),read_frame(dec.stdout,dw*dh*4))
                size=(g['width'],g['height'])
                if p['fit']=='contain':
                    tile=Image.new('RGBA',size)
                    inside=ImageOps.contain(src,size,Image.Resampling.BICUBIC)
                    tile.paste(inside,((size[0]-inside.width)//2,(size[1]-inside.height)//2))
                else:
                    tile=ImageOps.fit(src,size,Image.Resampling.BICUBIC)
                if g['radius']>0:
                    # Supersample only the mask, not the full video frame.
                    mask=Image.new('L',(size[0]*2,size[1]*2),0)
                    ImageDraw.Draw(mask).rounded_rectangle((0,0,size[0]*2-1,size[1]*2-1),radius=g['radius']*2,fill=255)
                    mask=mask.resize(size,Image.Resampling.LANCZOS)
                    tile.putalpha(ImageChops.multiply(tile.getchannel('A'),mask))
                canvas=Image.new('RGBA',(w,h))
                canvas.paste(tile,(g['x'],g['y']))
                enc.stdin.write(canvas.tobytes())
            enc.stdin.close();dec.stdout.close()
            dc=dec.wait(timeout=30);ec=enc.wait(timeout=60)
            if dc or ec:
                derr.seek(0);eerr.seek(0)
                raise RuntimeError(f'Container FFmpeg failed {dc}/{ec}: '+derr.read().decode(errors='replace')+eerr.read().decode(errors='replace'))
        finally:
            for child in (dec,enc):
                if child and child.poll() is None:
                    child.terminate()
                    child.wait(timeout=10)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--plan',required=True);args=ap.parse_args()
    render(json.loads(Path(args.plan).read_text(encoding='utf-8')))
