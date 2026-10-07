"""Bounded fine transient candidates; no instrument or listening approval."""
import argparse, json, wave
import numpy as np
def refine(wav, candidates, radius=.04):
    with wave.open(str(wav), 'rb') as w:
        rate=w.getframerate()
        if w.getnchannels()!=1 or w.getsampwidth()!=2: raise ValueError('mono PCM16 required')
        y=np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64)/32768
    n=256; hop=32; win=np.hanning(n); last=np.zeros(n//2+1); flux=[]
    mask=np.fft.rfftfreq(n,1/rate)>=700
    for i in range(0,max(1,len(y)-n+1),hop):
        v=np.pad(y[i:i+n],(0,max(0,n-len(y[i:i+n]))))*win
        mag=np.log1p(np.abs(np.fft.rfft(v))*10)
        flux.append(float(np.maximum(0,mag-last)[mask].sum()));last=mag
    f=np.convolve(flux,np.ones(3)/3,mode='same')
    result=[]
    for c in candidates:
        center=float(c['seconds'])
        if not 0<=center<len(y)/rate: raise ValueError('onset outside decoded PCM')
        ix=(center*rate-n/2)/hop; lo=max(1,int(ix-radius*rate/hop));hi=min(len(f)-1,int(ix+radius*rate/hop)+1)
        if hi<=lo: raise ValueError('no bounded refinement window')
        k=lo+int(np.argmax(f[lo:hi])); peak=float(f[k])
        contrast=peak/(float(np.median(f[lo:hi]))+1e-9)
        accepted=peak>.01 and contrast>=1.5 and lo<k<hi-1
        t=(k*hop+n/2)/rate if accepted else center
        result.append({**c,'coarse_seconds':center,'seconds':round(t,6),'refinement_ms':round((t-center)*1000,3),'contrast':round(contrast,3),'accepted':bool(accepted),'refinement':'high-band-fine-flux' if accepted else 'coarse-retained','listening':'pending'})
    return result
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('wav');p.add_argument('features');p.add_argument('--out',required=True);a=p.parse_args()
    with open(a.features,encoding='utf-8') as f: features=json.load(f)
    candidates=refine(a.wav,features['onset_candidates'])
    with open(a.out,'x',encoding='utf-8') as f:json.dump({'version':'fine-transient-v1','window':256,'hop':32,'min_frequency_hz':700,'onsets':candidates,'review':'Measured high-frequency attacks; not beat, instrument or listening approval'},f,indent=2)

