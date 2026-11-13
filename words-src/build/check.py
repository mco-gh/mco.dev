import json,sys,glob
d=json.load(open('ngsl.json'))
words=[x[1] for x in d]
out=[];
for f in sorted(glob.glob('fr*.txt'), key=lambda s:int(s[2:-4])):
    for ln in open(f,encoding='utf-8'):
        ln=ln.rstrip('\n')
        if ln.strip(): out.append(ln.split('=',1))
bad=0
for i,(pair) in enumerate(out):
    if len(pair)!=2 or i>=len(words) or pair[0]!=words[i]:
        print('MISMATCH at',i+1,pair,'expected',words[i] if i<len(words) else None); bad+=1
        if bad>5: break
print('have',len(out),'of',len(words),'bad',bad)
