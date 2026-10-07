import tempfile,wave,json,sys
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from rhythm_refine import refine
r=22050;n=r*4;y=np.zeros(n);rng=np.random.default_rng(9)
truth=[.5,1.317,2.641]
for t in truth:
 i=round(t*r);d=int(.12*r);q=np.arange(d)/r
 y[i:i+d]+=.4*rng.normal(size=d)*np.exp(-q*55)
 # Add lower-frequency body; measured high attack still has known onset.
 y[i:i+d]+=.3*np.sin(2*np.pi*82*q)*np.exp(-q*20)
with tempfile.TemporaryDirectory() as folder:
 f=Path(folder)/'fixture.wav'
 with wave.open(str(f),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(r);w.writeframes((np.clip(y,-1,1)*32767).astype('<i2').tobytes())
 out=refine(f,[{'seconds':t+.012} for t in truth]+[{'seconds':3.5}])
 for t,e in zip(truth,out):
  assert e['accepted'] and abs(t-e['seconds'])<.012,(t,e)
  assert e['listening']=='pending'
 assert not out[-1]['accepted'] and out[-1]['seconds']==3.5
 try:refine(f,[{'seconds':4.1}]);raise AssertionError('out-of-range accepted')
 except ValueError:pass
print('fine-transient: three known noisy attacks, silent non-attack, out-of-range rejected; no listening claim')
