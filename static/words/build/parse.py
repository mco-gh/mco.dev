import re, html, json, sys
s = open(sys.argv[1], encoding='utf-8', errors='replace').read()
rows = re.findall(r'<tr><td>(\d+)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*</tr>', s, re.S)
strip = lambda t: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', t))).strip()
out = []
for r, w, ipa, pos, d in rows:
    out.append([int(r), strip(w), strip(ipa), strip(pos), strip(d)])
out.sort(key=lambda x: x[0])
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False)
print(len(out), out[:3], out[-2:])
ranks = [o[0] for o in out]
print('dups', len(ranks) - len(set(ranks)), 'max', max(ranks), 'emptydef', sum(1 for o in out if not o[4]), 'emptyipa', sum(1 for o in out if not o[2]))
from collections import Counter
print(Counter(o[3] for o in out).most_common(30))
print('maxdeflen', max(len(o[4]) for o in out))
