/**
 * Lista os textos de conteúdo que ainda faltam traduzir para FR, DE ou IT.
 * Uso: npx tsx scripts/content-strings.ts fr > faltando.json
 * Cada chave é o caminho usado por `localized()`; o valor é o texto em inglês, para traduzir.
 */
import * as angels from '../src/content/angels';
import * as astrology from '../src/content/astrology';
import * as chinese from '../src/content/chinese';
import * as daily from '../src/content/daily';
import * as humanDesign from '../src/content/humanDesign';
import * as legal from '../src/content/legal';
import * as library from '../src/content/library';
import * as misc from '../src/content/misc';
import * as numbers from '../src/content/numbers';
import * as oracles from '../src/content/oracles';
import * as tarotMajor from '../src/content/tarot-major';
import * as tarotMinor from '../src/content/tarot-minor';
import * as today from '../src/content/today';
import { walkL } from '../src/content/types';
import de from '../src/content/locales/de.json';
import fr from '../src/content/locales/fr.json';
import it from '../src/content/locales/it.json';

const dicts: Record<string, Record<string, unknown>> = { fr, de, it };
const lang = process.argv[2] ?? 'fr';
const done = dicts[lang] ?? {};
const out: Record<string, unknown> = {};

// RANKS não é exportado: os nomes das cartas menores aparecem pelo caminho do próprio módulo.
for (const mod of [angels, astrology, chinese, daily, humanDesign, legal, library, misc, numbers, oracles, tarotMajor, tarotMinor, today]) {
  for (const [name, value] of Object.entries(mod)) {
    walkL(value, name, (l, path) => {
      if (!(path in done)) out[path] = l.en;
    });
  }
}
process.stdout.write(JSON.stringify(out, null, 1));
