"""Build static/words/data/<lang>/*.json from words-src/build/<lang>/<lang>-words-*.txt.

Each line: word|IPA|part of speech|English meaning|French meaning
Lines are in frequency order (most frequent first).

    python3 words-src/build/build.py fr      # or es, de
"""
import glob, json, os, sys

POS = {'nm', 'nf', 'nn', 'nmf', 'npl', 'noun', 'verb', 'adj', 'adv', 'prep', 'pron', 'conj', 'det', 'intj', 'num'}
# Characters allowed in pronunciations: IPA letters used for these languages, stress and length marks.
IPA = set('abcdefhijklmnoprstuvwxyzæçðøŋœɐɑɔəɛɡɣɪɲɾʁʃʊʋʎʏʒʝʔθβχɥ' 'ˈˌː' ' ̯̩̃' '.')

HERE = os.path.dirname(os.path.abspath(__file__))
lang = sys.argv[1] if len(sys.argv) > 1 else sys.exit('usage: build.py <lang>')
SRC = os.path.join(HERE, lang)
OUT = os.path.join(HERE, '..', '..', 'static', 'words', 'data', lang)

rows, seen, bad = [], set(), 0
for path in sorted(glob.glob(os.path.join(SRC, f'{lang}-words-*.txt'))):
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
        odd = sorted(set(ipa) - IPA)
        if odd:
            print('BAD IPA', where, word, ipa, odd); bad += 1; continue
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
