"""Mescla um JSON de traduções {pt-BR: {...}, en: {...}, es: {...}} nos arquivos de idioma.
Uso: python3 scripts/i18n-merge.py arquivo.json"""
import json, sys

def merge(a, b):
    for k, v in b.items():
        if isinstance(v, dict) and isinstance(a.get(k), dict):
            merge(a[k], v)
        else:
            a[k] = v

data = json.load(open(sys.argv[1], encoding='utf-8'))
for lang, values in data.items():
    path = f'src/i18n/locales/{lang}.json'
    cur = json.load(open(path, encoding='utf-8'))
    merge(cur, values)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(cur, f, ensure_ascii=False, indent=2)
        f.write('\n')
print('ok')
