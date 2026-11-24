/**
 * Junta um bloco de traduções ao dicionário de conteúdo do idioma.
 * Uso: node scripts/merge-locale.js fr bloco.json
 */
const fs = require('fs');
const [lang, file] = process.argv.slice(2);
const target = `${__dirname}/../src/content/locales/${lang}.json`;
const dict = JSON.parse(fs.readFileSync(target, 'utf8'));
const part = JSON.parse(fs.readFileSync(file, 'utf8'));
Object.assign(dict, part);
const sorted = Object.fromEntries(Object.keys(dict).sort().map((k) => [k, dict[k]]));
fs.writeFileSync(target, JSON.stringify(sorted, null, 1) + '\n');
console.log(`${lang}: +${Object.keys(part).length} (total ${Object.keys(sorted).length})`);
