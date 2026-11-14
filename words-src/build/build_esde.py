"""Build the Spanish and German explanations for one study language.

Reads words-src/build/<study>/<study>-esde-*.txt, one line per word, in the same
order as static/words/data/<study>/words.json:

    word|Spanish explanation|German explanation

and writes static/words/data/<study>/defs.es.json and defs.de.json.
When the study language is Spanish (or German), that column is a short definition
in the same language rather than a translation.

    python3 words-src/build/build_esde.py en      # or fr, es, de
"""
import glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
study = sys.argv[1] if len(sys.argv) > 1 else sys.exit('usage: build_esde.py <study>')
DATA = os.path.join(HERE, '..', '..', 'static', 'words', 'data', study)
words = [w[0] for w in json.load(open(os.path.join(DATA, 'words.json'), encoding='utf-8'))]

rows, bad = [], 0
for path in sorted(glob.glob(os.path.join(HERE, study, f'{study}-esde-*.txt')),
                   key=lambda p: int(p.rsplit('-', 1)[1].split('.')[0])):
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip():
            continue
        parts = [p.strip() for p in line.split('|')]
        if len(parts) != 3 or not all(parts):
            print('BAD FIELDS', f'{os.path.basename(path)}:{n}', line); bad += 1; continue
        rows.append((parts, f'{os.path.basename(path)}:{n}'))

for i, ((word, _, _), where) in enumerate(rows):
    expected = words[i] if i < len(words) else None
    if word != expected:
        print('OUT OF STEP', where, 'got', repr(word), 'expected', repr(expected)); bad += 1
        break
if len(rows) != len(words):
    print(f'COUNT {len(rows)} lines for {len(words)} words'); bad += 1
if bad:
    sys.exit(f'{bad} problem(s); nothing written')

# German keeps its own casing: a capital letter there marks a noun.
cap = {"es": lambda s: s[0].upper() + s[1:], "de": lambda s: s}
for col, lang in ((1, 'es'), (2, 'de')):
    with open(os.path.join(DATA, f'defs.{lang}.json'), 'w', encoding='utf-8') as f:
        json.dump([cap[lang](r[0][col]) for r in rows], f, ensure_ascii=False, separators=(',', ':'))
print(len(rows), f'Spanish and German explanations written for {study}')
