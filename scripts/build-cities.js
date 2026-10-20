/**
 * Gera a base offline de cidades usada no cadastro (src/data/cities.json)
 * e os nomes de países em PT/EN/ES (src/data/countries.json).
 *
 * Fonte: GeoNames (CC BY 4.0), via pacotes npm:
 *   - all-the-cities            → cidades, população e coordenadas
 *   - browser-geocoder-geonames → estado/província de cada cidade
 *   - geo-tz                    → fuso horário IANA a partir da coordenada
 *   - i18n-iso-countries        → nomes de países traduzidos
 *
 * Esses pacotes NÃO fazem parte do app. Para regenerar a base:
 *   npm i --no-save all-the-cities browser-geocoder-geonames geo-tz i18n-iso-countries
 *   node scripts/build-cities.js
 *
 * Critério: cidades com 15 mil+ habitantes no mundo (equivalente ao cities15000)
 * e 1 mil+ habitantes no Brasil e em Portugal.
 */
const fs = require('fs');
const path = require('path');
const { find: findTimezone } = require('geo-tz');
const allCities = require('all-the-cities');
const countries = require('i18n-iso-countries');

const MIN_POPULATION = 15000;
const MIN_POPULATION_LOCAL = 1000;
const LOCAL_COUNTRIES = new Set(['BR', 'PT']);

// Nomes em português/espanhol de cidades que o GeoNames guarda só em inglês.
const ALIASES = {
  'Lisbon|PT': 'Lisboa',
  'Rome|IT': 'Roma',
  'London|GB': 'Londres',
  'New York City|US': 'Nova York, Nueva York',
  'Munich|DE': 'Munique, Múnich',
  'Moscow|RU': 'Moscou, Moscú',
  'Beijing|CN': 'Pequim, Pekín',
  'Tokyo|JP': 'Tóquio, Tokio',
  'Florence|IT': 'Florença, Florencia',
  'Seville|ES': 'Sevilha, Sevilla',
  'Warsaw|PL': 'Varsóvia, Varsovia',
  'Cologne|DE': 'Colônia, Colonia',
  'Mexico City|MX': 'Cidade do México, Ciudad de México',
  'Geneva|CH': 'Genebra, Ginebra',
  'Vienna|AT': 'Viena',
  'Athens|GR': 'Atenas',
  'Berlin|DE': 'Berlim, Berlín',
  'Copenhagen|DK': 'Copenhague',
  'Stockholm|SE': 'Estocolmo',
  'Brussels|BE': 'Bruxelas, Bruselas',
  'Milan|IT': 'Milão, Milán',
  'Venice|IT': 'Veneza, Venecia',
  'Naples|IT': 'Nápoles',
  'Turin|IT': 'Turim, Turín',
  'Philadelphia|US': 'Filadélfia, Filadelfia',
  'Cairo|EG': 'Cairo, El Cairo',
  'Johannesburg|ZA': 'Joanesburgo, Johannesburgo',
  'Cape Town|ZA': 'Cidade do Cabo, Ciudad del Cabo',
  'Shanghai|CN': 'Xangai, Shanghái',
  'New Delhi|IN': 'Nova Délhi, Nueva Delhi',
  'Mumbai|IN': 'Bombaim, Bombay',
  'Istanbul|TR': 'Istambul, Estambul',
  'Edinburgh|GB': 'Edimburgo',
  'Prague|CZ': 'Praga',
  'Budapest|HU': 'Budapeste',
  'Zurich|CH': 'Zurique, Zúrich',
  'Hamburg|DE': 'Hamburgo',
  'Antwerpen|BE': 'Antuérpia, Amberes',
  'Amsterdam|NL': 'Amsterdã, Ámsterdam',
  'The Hague|NL': 'Haia, La Haya',
  'Marseille|FR': 'Marselha, Marsella',
  'Bordeaux|FR': 'Bordéus, Burdeos',
  'Luanda|AO': 'Luanda',
  'Havana|CU': 'Havana, La Habana',
  'Bogotá|CO': 'Bogotá, Bogota',
  'Jerusalem|IL': 'Jerusalém, Jerusalén',
  'Tel Aviv|IL': 'Tel Aviv-Yafo',
  'Montreal|CA': 'Montréal',
  'Quebec|CA': 'Québec',
  'Dublin|IE': 'Dublim, Dublín',
  'Bucharest|RO': 'Bucareste, Bucarest',
  'Saint Petersburg|RU': 'São Petersburgo, San Petersburgo',
  'Kyiv|UA': 'Kiev',
  'Seoul|KR': 'Seul',
  'Bangkok|TH': 'Banguecoque',
  'Washington|US': 'Washington D.C.',
  'Saint-Denis|RE': 'Saint-Denis',
};

// Estados que o GeoNames guarda em inglês.
const STATE_FIXES = {
  'Federal District|BR': 'Distrito Federal',
  'Lisbon|PT': 'Lisboa',
  'Azores|PT': 'Açores',
};

function decodeGeohash(hash) {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  const lat = [-90, 90];
  const lon = [-180, 180];
  let even = true;
  for (const ch of hash) {
    const v = BASE32.indexOf(ch);
    for (let b = 4; b >= 0; b--) {
      const range = even ? lon : lat;
      const mid = (range[0] + range[1]) / 2;
      if ((v >> b) & 1) range[0] = mid;
      else range[1] = mid;
      even = !even;
    }
  }
  return [(lat[0] + lat[1]) / 2, (lon[0] + lon[1]) / 2];
}

// Estados: o dataset do browser-geocoder-geonames tem a 1ª linha em JSON (países, estados)
// e depois uma linha por lugar: nome \t população(base36) \t país \t estado \t geohash
const geoPath = require.resolve('browser-geocoder-geonames/geonames.txt');
const raw = fs.readFileSync(geoPath, 'utf8');
const headerEnd = raw.indexOf('\n');
const meta = JSON.parse(raw.slice(0, headerEnd));
const byNameCountry = new Map();
const byCountry = new Map();
for (const line of raw.slice(headerEnd + 1).split('\n')) {
  const [name, , ci, si, hash] = line.split('\t');
  if (!hash || si === '' || si === undefined) continue;
  const cc = meta.countries[+ci];
  const state = meta.states[+si] || '';
  const [la, lo] = decodeGeohash(hash);
  const key = `${name}|${cc}`;
  if (!byNameCountry.has(key)) byNameCountry.set(key, []);
  byNameCountry.get(key).push([la, lo, state]);
  if (!byCountry.has(cc)) byCountry.set(cc, []);
  byCountry.get(cc).push([la, lo, state, name]);
}

function findState(name, cc, la, lo) {
  let best = 0.25;
  let state = '';
  for (const [a, b, s] of byNameCountry.get(`${name}|${cc}`) || []) {
    const d = (a - la) ** 2 + (b - lo) ** 2;
    if (d < best) [best, state] = [d, s];
  }
  if (state) return state;
  best = 0.09;
  for (const [a, b, s, n] of byCountry.get(cc) || []) {
    if (n === s) continue; // ignora o próprio estado listado como lugar
    const d = (a - la) ** 2 + (b - lo) ** 2;
    if (d < best) [best, state] = [d, s];
  }
  return state;
}

const timezones = [];
const tzIndex = {};
const rows = [];
const seen = new Set();
for (const c of allCities) {
  const minPop = LOCAL_COUNTRIES.has(c.country) ? MIN_POPULATION_LOCAL : MIN_POPULATION;
  if (c.population < minPop) continue;
  const [lo, la] = c.loc.coordinates;
  const found = findState(c.name, c.country, la, lo);
  const state = STATE_FIXES[`${found}|${c.country}`] ?? found;
  const key = `${c.name}|${c.country}|${state}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const tz = findTimezone(la, lo)[0];
  if (!tz) continue;
  if (!(tz in tzIndex)) {
    tzIndex[tz] = timezones.length;
    timezones.push(tz);
  }
  rows.push({ name: c.name, cc: c.country, state, la, lo, tz: tzIndex[tz], pop: c.population });
}
rows.sort((a, b) => b.pop - a.pop);

const states = [...new Set(rows.map((r) => r.state))];
const stateIndex = Object.fromEntries(states.map((s, i) => [s, i]));
const cities = rows.map((r) => {
  const row = [r.name, r.cc, stateIndex[r.state], +r.la.toFixed(3), +r.lo.toFixed(3), r.tz];
  const alias = ALIASES[`${r.name}|${r.cc}`];
  if (alias) row.push(alias);
  return row;
});

const outDir = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'cities.json'),
  JSON.stringify({ attribution: 'GeoNames (CC BY 4.0) https://www.geonames.org', timezones, states, cities })
);

for (const lang of ['pt', 'en', 'es']) countries.registerLocale(require(`i18n-iso-countries/langs/${lang}.json`));
const countryNames = {};
for (const code of Object.keys(countries.getAlpha2Codes())) {
  countryNames[code] = [countries.getName(code, 'pt'), countries.getName(code, 'en'), countries.getName(code, 'es')];
}
fs.writeFileSync(path.join(outDir, 'countries.json'), JSON.stringify(countryNames));

console.log(`${cities.length} cidades, ${timezones.length} fusos, ${states.length} estados`);
