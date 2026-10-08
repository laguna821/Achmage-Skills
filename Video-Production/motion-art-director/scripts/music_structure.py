"""CPU recurrence candidates. Periodicity never establishes a musical first beat."""
import argparse, json, wave
import numpy as np

def analyze(file):
    with wave.open(file, 'rb') as w:
        if w.getnchannels()!=1 or w.getsampwidth()!=2: raise ValueError('mono PCM16 required')
        sr=w.getframerate(); y=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32768
    if not 1 <= len(y)/sr <= 600: raise ValueError('Require 1..600 seconds')
    n=4096; hop=512; freq=np.fft.rfftfreq(n,1/sr)
    valid=(freq>=55)&(freq<5000); midi=np.zeros(len(freq),int)
    midi[valid]=np.rint(69+12*np.log2(freq[valid]/440)).astype(int)%12
    chroma=[]; flux=[]; prev=np.zeros(n//2+1)
    for i in range(0,len(y)-n+1,hop):
        mag=np.abs(np.fft.rfft(y[i:i+n]*np.hanning(n)))
        v=np.array([np.log1p(mag[valid&(midi==k)]).sum() for k in range(12)])
        v-=v.mean(); v/=max(np.linalg.norm(v),1e-12); chroma.append(v)
        flux.append(np.maximum(np.log1p(mag)-prev,0).sum());prev=np.log1p(mag)
    x=np.asarray(chroma); flux=np.asarray(flux); dt=hop/sr
    windows=[]
    jobs=[(tier,float(start),span,lo,hi) for tier,span,stride,lo,hi in [('local',24,12,.35,12),('long',72,36,12,36)] for start in np.arange(0,max(1,len(y)/sr-4),stride)]
    for tier,start,span,lo,hi in jobs:
        end=min(start+span,len(y)/sr); a=int(start/dt);b=min(len(x),int(end/dt));z=x[a:b]
        if len(z)<50:continue
        values=[]
        for lag in range(max(1,round(lo/dt)),min(round(hi/dt),len(z)//2)):
            values.append((lag,float(np.mean(np.sum(z[:-lag]*z[lag:],axis=1)))))
        peaks=[v for k,v in enumerate(values[1:-1],1) if v[1]>=values[k-1][1] and v[1]>=values[k+1][1]]
        peaks=sorted(peaks,key=lambda v:v[1],reverse=True)
        chosen=[]
        for lag,score in peaks:
            if score<.15 or any(abs(lag*dt-c['period_seconds'])<.15 for c in chosen):continue
            # Candidate phase anchors are observed local changes, not a downbeat assertion.
            change=np.r_[0,np.maximum(0,1-np.sum(z[1:]*z[:-1],axis=1))]
            strength=change+flux[a:b]/max(float(np.percentile(flux[a:b],95)),1e-9)*.1
            ix=sorted(range(2,min(len(z)-2,lag+2)),key=lambda j:strength[j],reverse=True)
            anchors=[]
            for j in ix:
                t=(a+j)*dt+n/(2*sr)
                if all(abs(t-v['seconds'])>.16 for v in anchors):anchors.append({'seconds':round(t,6),'change_strength':round(float(strength[j]),4)})
                if len(anchors)==4:break
            chosen.append({'period_seconds':round(lag*dt,6),'similarity':round(score,4),'phase_candidates':anchors})
            if len(chosen)==6:break
        windows.append({'tier':tier,'start':float(start),'end':float(end),'recurrence_candidates':chosen,'interpretation':'Long lags can be multiples of a short motif; not proof of a separate instrument' if tier=='long' else 'Short recurrence candidates'})
    return {'version':'musical-recurrence-candidates-v1','duration':len(y)/sr,'sample_rate':sr,'resolution_seconds':dt,'windows':windows,'listening':'pending','limitations':['Recurrence is not phrase/downbeat identification','Phase alternatives require listening; no periodic grid is approved','Local windows can disagree; do not propagate one phase through the track','Frequency features do not identify instruments']}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('file');p.add_argument('--out',required=True);a=p.parse_args()
    with open(a.out,'x',encoding='utf-8') as f:json.dump(analyze(a.file),f,ensure_ascii=False,indent=2)
