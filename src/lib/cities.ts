import type { BirthPlace } from './birth';

/** Linha compacta do arquivo: [nome, país, índice do estado, lat, lon, índice do fuso, apelidos?] */
type CityRow = [string, string, number, number, number, number, string?];

type CityData = {
  timezones: string[];
  states: string[];
  cities: CityRow[];
};

type IndexedCity = { row: CityRow; key: string; aliasKey: string };

export type LanguageIndex = 0 | 1 | 2; // pt, en, es

let data: CityData | null = null;
let index: IndexedCity[] | null = null;
let countryNames: Record<string, [string, string, string]> | null = null;

/** Remove acentos e caixa: "São Paulo" → "sao paulo". */
export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// O arquivo de cidades (~1 MB) só é carregado na primeira busca.
function load() {
  if (!data) {
    data = require('@/data/cities.json') as CityData;
    index = data.cities.map((row) => ({
      row,
      key: normalize(row[0]),
      aliasKey: row[6] ? normalize(row[6]) : '',
    }));
  }
  return { data, index: index! };
}

export function countryName(code: string, lang: LanguageIndex) {
  countryNames ??= require('@/data/countries.json');
  return countryNames![code]?.[lang] ?? code;
}

function toPlace(row: CityRow, d: CityData): BirthPlace {
  return {
    name: row[0],
    countryCode: row[1],
    state: d.states[row[2]] ?? '',
    lat: row[3],
    lon: row[4],
    timezone: d.timezones[row[5]],
  };
}

/**
 * Busca cidades pelo começo do nome (ou de uma palavra do nome / apelido).
 * Os resultados já vêm ordenados por população, então as maiores aparecem primeiro.
 * Um texto depois da vírgula filtra por estado ou país: "Campinas, SP" / "Valencia, Venezuela".
 */
export function searchCities(query: string, lang: LanguageIndex, limit = 30): BirthPlace[] {
  const [namePart, ...rest] = query.split(',');
  const q = normalize(namePart);
  const filter = normalize(rest.join(' '));
  if (q.length < 2) return [];
  const { data: d, index: idx } = load();

  const exact: CityRow[] = [];
  const prefix: CityRow[] = [];
  const word: CityRow[] = [];
  for (const c of idx) {
    let bucket: CityRow[] | null = null;
    if (c.key === q) bucket = exact;
    else if (c.key.startsWith(q) || c.aliasKey.startsWith(q)) bucket = prefix;
    else if (c.key.includes(' ' + q) || c.aliasKey.includes(' ' + q)) bucket = word;
    if (!bucket) continue;
    if (filter && !matchesFilter(c.row, filter, d, lang)) continue;
    bucket.push(c.row);
    if (exact.length >= limit) break;
  }
  return [...exact, ...prefix, ...word].slice(0, limit).map((row) => toPlace(row, d));
}

function matchesFilter(row: CityRow, filter: string, d: CityData, lang: LanguageIndex) {
  const state = normalize(d.states[row[2]] ?? '');
  const country = normalize(countryName(row[1], lang));
  return (
    state.startsWith(filter) ||
    country.startsWith(filter) ||
    row[1].toLowerCase() === filter ||
    stateAbbreviation(state) === filter
  );
}

// Siglas dos estados brasileiros, para permitir "Campinas, SP".
const BR_STATES: Record<string, string> = {
  acre: 'ac', alagoas: 'al', amapa: 'ap', amazonas: 'am', bahia: 'ba', ceara: 'ce',
  'distrito federal': 'df', 'espirito santo': 'es', goias: 'go',
  maranhao: 'ma', 'mato grosso': 'mt', 'mato grosso do sul': 'ms', 'minas gerais': 'mg',
  para: 'pa', paraiba: 'pb', parana: 'pr', pernambuco: 'pe', piaui: 'pi',
  'rio de janeiro': 'rj', 'rio grande do norte': 'rn', 'rio grande do sul': 'rs',
  rondonia: 'ro', roraima: 'rr', 'santa catarina': 'sc', 'sao paulo': 'sp', sergipe: 'se',
  tocantins: 'to',
};

function stateAbbreviation(normalizedState: string) {
  return BR_STATES[normalizedState];
}

/** Rótulo de exibição: "Campinas · São Paulo, Brasil". */
export function placeSubtitle(place: BirthPlace, lang: LanguageIndex) {
  const country = countryName(place.countryCode, lang);
  return place.state ? `${place.state}, ${country}` : country;
}
