import tempfile,wave,sys
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from audio_clock_audit import compare
rate=48000;rng=np.random.default_rng(28);source=(rng.normal(size=rate*4)*2000).astype('<i2')
def write(f,a):
 with wave.open(str(f),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(a.tobytes())
with tempfile.TemporaryDirectory() as folder:
 a=Path(folder)/'a.wav';b=Path(folder)/'b.wav';write(a,source);write(b,source)
 assert compare(a,b,[1])['ok']
 for frames in [-4,-2,-1,1,2,4]:
  write(b,np.roll(source,frames*1600));r=compare(a,b,[1]);assert not r['ok'];assert abs(r['windows'][0]['lagSamples']-frames*1600)<=4
 tone=(np.sin(np.arange(rate*4)*2*np.pi*1000/rate)*4000).astype('<i2');write(a,tone);write(b,tone)
 assert not compare(a,b,[1])['ok'],'periodic tone must not certify a unique clock'
print('audio clock: unchanged noise accepted, six audio-only offsets rejected, periodic ambiguity rejected')
