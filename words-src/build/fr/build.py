"""Build static/words/data/fr/*.json from fr-words-*.txt.

Each line: word|IPA|part of speech|English meaning|French definition
Lines are in frequency order (Éduscol list, most frequent first).
Run from the repo root:  python3 words-src/build/fr/build.py
"""
import glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '..', 'static', 'words', 'data', 'fr')
POS = {'nm', 'nf', 'nmf', 'verb', 'adj', 'adv', 'prep', 'pron', 'conj', 'det', 'intj', 'num'}

rows, seen, bad = [], set(), 0
for path in sorted(glob.glob(os.path.join(HERE, 'fr-words-*.txt'))):
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        parts = line.split('|')
        where = f'{os.path.basename(path)}:{n}'
        if len(parts) != 5 or not all(p.strip() for p in parts):
            print('BAD FIELDS', where, line); bad += 1; continue
        word, ipa, pos, en, fr = (p.strip() for p in parts)
        if word in seen:
            print('DUPLICATE', where, word); bad += 1; continue
        if not set(pos.split(', ')) <= POS:
            print('BAD POS', where, word, pos); bad += 1; continue
        seen.add(word)
        rows.append((word, ipa, pos, en, fr))

if bad:
    sys.exit(f'{bad} problem(s); nothing written')

cap = lambda s: s[0].upper() + s[1:]
os.makedirs(OUT, exist_ok=True)
def dump(name, obj):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))

dump('words.json', [[w, f'/{ipa}/', pos] for w, ipa, pos, _, _ in rows])
dump('defs.en.json', [cap(en) for *_, en, _ in rows])
dump('defs.fr.json', [cap(fr) for *_, fr in rows])
print(len(rows), 'words written to', os.path.normpath(OUT))
