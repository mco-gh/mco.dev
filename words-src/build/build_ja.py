"""Build the Japanese data.

    python3 words-src/build/build_ja.py ja        # the Japanese study list
    python3 words-src/build/build_ja.py en        # Japanese explanations for en (or fr, es, de)

Japanese study list: reads words-src/build/ja/ja-words-*.txt, in frequency order:

    word|reading|part of speech|English|French|Spanish|German|Japanese definition

The reading is in kana; it is left out of words.json when the word itself is all kana.
Writes static/words/data/ja/words.json and defs.{en,fr,es,de,ja}.json.

Japanese explanations for another study language: reads
words-src/build/<study>/<study>-ja-*.txt, one line per word, in the same order as
static/words/data/<study>/words.json:

    word|Japanese explanation

and writes static/words/data/<study>/defs.ja.json.
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
study = sys.argv[1] if len(sys.argv) > 1 else sys.exit('usage: build_ja.py <study>')
DATA = os.path.join(HERE, '..', '..', 'static', 'words', 'data', study)
POS = {'noun', 'verb', 'adj', 'adjna', 'adv', 'pron', 'conj', 'det', 'intj', 'num'}
KANA = re.compile(r'^[ぁ-ゟ゠-ヿー・]+$')


def sources(pattern):
    paths = glob.glob(os.path.join(HERE, study, pattern))
    for path in sorted(paths, key=lambda p: int(p.rsplit('-', 1)[1].split('.')[0])):
        for n, line in enumerate(open(path, encoding='utf-8'), 1):
            line = line.rstrip('\n')
            if line.strip():
                yield [p.strip() for p in line.split('|')], f'{os.path.basename(path)}:{n}'


def dump(name, obj):
    with open(os.path.join(DATA, name), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))


cap = lambda s: s[0].upper() + s[1:]
rows, bad = [], 0

if study == 'ja':
    seen = set()
    for parts, where in sources('ja-words-*.txt'):
        if len(parts) != 8 or not all(parts):
            print('BAD FIELDS', where, parts); bad += 1; continue
        word, reading, pos = parts[:3]
        if word in seen:
            print('DUPLICATE', where, word); bad += 1; continue
        if not KANA.match(reading):
            print('BAD READING', where, word, reading); bad += 1; continue
        if not set(pos.split(', ')) <= POS:
            print('BAD POS', where, word, pos); bad += 1; continue
        seen.add(word)
        rows.append(parts)
    if bad:
        sys.exit(f'{bad} problem(s); nothing written')
    os.makedirs(DATA, exist_ok=True)
    dump('words.json', [[w, '' if KANA.match(w) else r, p] for w, r, p, *_ in rows])
    for col, lang, fix in ((3, 'en', cap), (4, 'fr', cap), (5, 'es', cap), (6, 'de', str), (7, 'ja', str)):
        dump(f'defs.{lang}.json', [fix(r[col]) for r in rows])
    print(len(rows), 'Japanese words written')
else:
    words = [w[0] for w in json.load(open(os.path.join(DATA, 'words.json'), encoding='utf-8'))]
    for parts, where in sources(f'{study}-ja-*.txt'):
        if len(parts) != 2 or not all(parts):
            print('BAD FIELDS', where, parts); bad += 1; continue
        rows.append((parts, where))
    for i, ((word, _), where) in enumerate(rows):
        expected = words[i] if i < len(words) else None
        if word != expected:
            print('OUT OF STEP', where, 'got', repr(word), 'expected', repr(expected)); bad += 1
            break
    if len(rows) != len(words):
        print(f'COUNT {len(rows)} lines for {len(words)} words'); bad += 1
    if bad:
        sys.exit(f'{bad} problem(s); nothing written')
    dump('defs.ja.json', [r[0][1] for r in rows])
    print(len(rows), f'Japanese explanations written for {study}')
