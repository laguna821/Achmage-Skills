"""Independent encoded-audio clock witness. Periodic windows may be ambiguous."""
import argparse,json,wave
from pathlib import Path
import numpy as np

def pcm(file):
    with wave.open(str(file)) as w:
        rate=w.getframerate()
        if rate!=48000 or w.getsampwidth()!=2: raise ValueError('48kHz PCM16 reference and decoded audio required')
        return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,w.getnchannels()).mean(axis=1)/32768

def compare(reference,decoded,windows,tolerance_samples=16):
    a=pcm(reference);b=pcm(decoded);rows=[]
    for t in windows:
        start=round(t*48000);n=48000
        if start<0 or start+n>min(len(a),len(b)): raise ValueError('comparison window outside audio')
        x=a[start:start+n:4];y=b[start:start+n:4];x=x-x.mean();y=y-y.mean()
        norm=float(np.linalg.norm(x)*np.linalg.norm(y))
        if norm<1e-8: raise ValueError('silent comparison window; select a musical transient')
        size=1<<((len(x)+len(y)-1).bit_length())
        c=np.fft.irfft(np.fft.rfft(y,size)*np.conj(np.fft.rfft(x,size)),size)
        offsets=np.arange(-1600,1601);values=c[offsets%size];index=int(np.argmax(values));lag=int(offsets[index])*4
        # A nearly equal peak more than half a frame away is not unique clock evidence.
        remote=np.abs(offsets-offsets[index])>200
        ambiguity=float(np.max(values[remote])/(values[index]+1e-12))
        similarity=float(np.dot(x,y)/norm)
        ok=abs(lag)<=tolerance_samples and similarity>.95 and ambiguity<.95
        rows.append({'at':t,'lagSamples':lag,'lagMS':lag/48,'zeroLagCorrelation':similarity,'remotePeakRatio':ambiguity,'uniqueWitness':ambiguity<.95,'ok':bool(ok)})
    return {'ok':bool(rows) and all(r['ok'] for r in rows),'windows':rows,'sampleRate':48000,'review':'Waveform clock evidence only. Does not certify selected beat, groove or listening.'}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('reference');p.add_argument('decoded');p.add_argument('--windows',required=True);p.add_argument('--out',required=True);args=p.parse_args()
    r=compare(args.reference,args.decoded,[float(t) for t in args.windows.split(',')])
    with open(args.out,'x',encoding='utf-8') as f:json.dump(r,f,indent=2)
    print(json.dumps(r));raise SystemExit(0 if r['ok'] else 1)
