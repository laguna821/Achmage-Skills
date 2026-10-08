"""Bounded CPU spectral-flux candidates. No instrument or perceptual approval claim."""
import argparse,json,wave
import numpy as np

def analyze(file,bpm_hint):
    with wave.open(file,'rb') as w:
        rate=w.getframerate()
        if w.getnchannels()!=1 or w.getsampwidth()!=2: raise ValueError('mono PCM16 required')
        y=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
    hop=256;n=1024;win=np.hanning(n);last=np.zeros(n//2+1)
    flux=[];energy=[]
    freq=np.fft.rfftfreq(n,1/rate)
    masks={name:(freq>=lo)&(freq<hi) for name,lo,hi in [('low',35,180),('mid',180,2000),('high',2000,10000)]}
    bands={name:[] for name in masks}
    for i in range(0,max(1,len(y)-n+1),hop):
        v=np.pad(y[i:i+n],(0,max(0,n-len(y[i:i+n]))))*win
        mag=np.log1p(np.abs(np.fft.rfft(v))*10)
        delta=np.maximum(0,mag-last)
        flux.append(float(delta.sum()));energy.append(float(np.sqrt(np.mean(v*v))))
        for name,mask in masks.items():bands[name].append(float(delta[mask].sum()))
        last=mag
    f=np.asarray(flux); med=float(np.median(f));scale=float(np.percentile(f,95)) or 1
    candidates=[];lastidx=-100
    for i in range(2,len(f)-2):
        if f[i]>max(med*1.25,scale*.12) and f[i]>=max(f[i-2:i+3]) and i-lastidx>=5:
            candidates.append({'seconds':round((i*hop+n/2)/rate,6),'strength':round(float(f[i]/scale),4)});lastidx=i
    # Search phase/tempo near supplied metadata; report hypothesis, not measured beat truth.
    best=(-1,bpm_hint,0)
    for bpm in np.arange(bpm_hint-2,bpm_hint+2.001,.02):
        step=60/bpm
        for phase in np.arange(0,step,.006):
            ts=np.arange(phase,len(y)/rate,step);ix=np.rint((ts*rate-n/2)/hop).astype(int);ix=ix[(ix>=2)&(ix<len(f)-2)]
            score=float(np.mean(np.maximum.reduce([f[ix+j] for j in [-1,0,1]]))) if len(ix) else 0
            if score>best[0]:best=(score,float(bpm),float(phase))
    _,bpm,phase=best
    grid=[round(float(t),6) for t in np.arange(phase,len(y)/rate,60/bpm)]
    band_events={}
    for name,values in bands.items():
        a=np.asarray(values);q=float(np.percentile(a,95)) or 1;threshold=max(float(np.median(a))*1.25,q*.12)
        band_events[name]=[{'seconds':round((i*hop+n/2)/rate,6),'strength':round(float(a[i]/q),4)} for i in range(2,len(a)-2) if a[i]>threshold and a[i]>=max(a[i-2:i+3])]
    density=[{'start':i,'end':min(i+2,len(y)/rate),'count':sum(i<=c['seconds']<i+2 for c in candidates)} for i in range(0,int(np.ceil(len(y)/rate)),2)]
    return {'version':'spectral-flux-v2','sample_rate':rate,'hop':hop,'window':n,'duration':len(y)/rate,'bpm_hint':bpm_hint,'estimated_bpm':round(bpm,4),'phase_seconds':phase,'pulse_candidates':grid,'onset_candidates':candidates,'band_onsets':band_events,'band_ranges_hz':{'low':[35,180],'mid':[180,2000],'high':[2000,10000]},'onset_density_2s':density,'energy_1s':[round(float(np.sqrt(np.mean(y[i:i+rate]**2))),6) for i in range(0,len(y),rate)],'review':'unreviewed; bands are frequency ranges, not instrument/downbeat/chorus labels'}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('file');p.add_argument('--bpm',type=float,required=True);p.add_argument('--out',required=True);a=p.parse_args()
    with open(a.out,'x',encoding='utf-8') as f:json.dump(analyze(a.file,a.bpm),f,ensure_ascii=False,indent=2)
