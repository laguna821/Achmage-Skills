"""CPU Skia glyph outlines for authored kinetic typography. No GPU context."""
import argparse, json, hashlib
from pathlib import Path
import skia

def glyphs(text, font_path, size):
    face=skia.Typeface.MakeFromFile(str(font_path))
    if face is None: raise ValueError('Font could not be decoded')
    font=skia.Font(face,size)
    ids=font.textToGlyphs(text)
    if 0 in ids: raise ValueError('Font missing requested glyph')
    widths=font.getWidths(ids)
    paths=font.getPaths(ids)
    stream=skia.DynamicMemoryWStream()
    canvas=skia.SVGCanvas.Make(skia.Rect.MakeWH(sum(widths)+20,size*1.4),stream)
    paint=skia.Paint(Color=skia.ColorWHITE,AntiAlias=True)
    x=10
    for shape,w in zip(paths,widths):
        if shape is not None:
            canvas.save();canvas.translate(x,size);canvas.drawPath(shape,paint);canvas.restore()
        x+=w
    del canvas
    raw=bytes(stream.detachAsData()).decode('utf-8')
    return raw, {'text':text,'width':sum(widths)+20,'height':size*1.4,'fontSha256':hashlib.sha256(font_path.read_bytes()).hexdigest(),'renderer':'Skia CPU outline','skiaVersion':skia.__version__}

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--text',required=True);ap.add_argument('--font',type=Path,default=Path(__file__).resolve().parents[1]/'assets/fonts/NotoSerifKR.ttf');ap.add_argument('--size',type=float,default=220);ap.add_argument('--out',required=True,type=Path);a=ap.parse_args()
    svg,metadata=glyphs(a.text,a.font,a.size);a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(svg,encoding='utf-8');a.out.with_suffix('.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(metadata,ensure_ascii=False))
