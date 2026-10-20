/**
 * 72 anjos cabalísticos (Shem HaMephorash) por período de nascimento — tabela tradicional usada no Brasil.
 * Cada anjo também rege 20 minutos do dia, a partir da meia-noite, na mesma ordem.
 */

export type AngelInfo = {
  number: number;
  name: string;
  /** Primeiro dia do período [mês, dia]. */
  start: [number, number];
  psalm: string;
  choir: string;
};

const CHOIRS = ['Serafins', 'Querubins', 'Tronos', 'Dominações', 'Potestades', 'Virtudes', 'Principados', 'Arcanjos', 'Anjos'];

const RAW: [string, number, number, string][] = [
  ['Vehuiah', 3, 21, '3:3'], ['Jeliel', 3, 26, '22:19'], ['Sitael', 3, 31, '91:2'], ['Elemiah', 4, 5, '6:4'],
  ['Mahasiah', 4, 10, '34:4'], ['Lelahel', 4, 15, '9:11'], ['Achaiah', 4, 21, '103:8'], ['Cahetel', 4, 26, '95:6'],
  ['Haziel', 5, 1, '25:6'], ['Aladiah', 5, 6, '33:22'], ['Lauviah', 5, 11, '18:46'], ['Hahaiah', 5, 16, '10:1'],
  ['Yezalel', 5, 21, '98:4'], ['Mebahel', 5, 26, '9:9'], ['Hariel', 6, 1, '94:22'], ['Hekamiah', 6, 6, '88:1'],
  ['Lauviah II', 6, 11, '8:1'], ['Caliel', 6, 16, '7:8'], ['Leuviah', 6, 22, '40:1'], ['Pahaliah', 6, 27, '120:2'],
  ['Nelchael', 7, 2, '31:14'], ['Yeiayel', 7, 7, '121:5'], ['Melahel', 7, 12, '121:8'], ['Haheuiah', 7, 17, '33:18'],
  ['Nith-Haiah', 7, 23, '9:1'], ['Haaiah', 7, 28, '119:145'], ['Yerathel', 8, 2, '140:1'], ['Seheiah', 8, 7, '71:12'],
  ['Reiyel', 8, 13, '54:4'], ['Omael', 8, 18, '71:5'], ['Lecabel', 8, 23, '71:16'], ['Vasariah', 8, 29, '33:4'],
  ['Yehuiah', 9, 3, '94:11'], ['Lehahiah', 9, 8, '131:3'], ['Chavakhiah', 9, 13, '116:1'], ['Menadel', 9, 18, '26:8'],
  ['Aniel', 9, 24, '80:7'], ['Haamiah', 9, 29, '91:9'], ['Rehael', 10, 4, '30:10'], ['Ieiazel', 10, 9, '88:14'],
  ['Hahahel', 10, 14, '120:2'], ['Mikael', 10, 19, '121:7'], ['Veuliah', 10, 24, '88:13'], ['Yelahiah', 10, 29, '119:108'],
  ['Sealiah', 11, 3, '94:18'], ['Ariel', 11, 8, '145:9'], ['Asaliah', 11, 13, '104:24'], ['Mihael', 11, 18, '98:2'],
  ['Vehuel', 11, 23, '145:3'], ['Daniel', 11, 28, '103:8'], ['Hahasiah', 12, 3, '104:31'], ['Imamiah', 12, 8, '7:17'],
  ['Nanael', 12, 13, '119:75'], ['Nithael', 12, 17, '103:19'], ['Mebahiah', 12, 22, '102:12'], ['Poiel', 12, 27, '145:14'],
  ['Nemamiah', 1, 1, '115:11'], ['Yeialel', 1, 6, '6:3'], ['Harahel', 1, 11, '113:3'], ['Mitzrael', 1, 16, '145:17'],
  ['Umabel', 1, 21, '113:2'], ['Iah-Hel', 1, 26, '119:159'], ['Anauel', 1, 31, '2:11'], ['Mehiel', 2, 5, '33:18'],
  ['Damabiah', 2, 10, '90:13'], ['Manakel', 2, 15, '38:21'], ['Eiael', 2, 20, '37:4'], ['Habuhiah', 2, 25, '106:1'],
  ['Rochel', 3, 1, '16:5'], ['Jabamiah', 3, 6, 'Gn 1:1'], ['Haiaiel', 3, 11, '109:30'], ['Mumiah', 3, 16, '116:7'],
];

export const ANGELS: AngelInfo[] = RAW.map(([name, m, d, psalm], i) => ({
  number: i + 1,
  name,
  start: [m, d],
  psalm: psalm.startsWith('Gn') ? psalm : `Sl ${psalm}`,
  choir: CHOIRS[Math.floor(i / 8)],
}));

/** Posição de (mês, dia) num ano que começa em 21 de março. */
function key(m: number, d: number) {
  const k = m * 100 + d;
  return k >= 321 ? k : k + 1300;
}

export function angelForDate(month: number, day: number): AngelInfo {
  const k = key(month, day);
  let found = ANGELS[0];
  for (const a of ANGELS) if (key(a.start[0], a.start[1]) <= k) found = a;
  return found;
}

export function angelOfBirth(birthDate: string) {
  const [, m, d] = birthDate.split('-').map(Number);
  return angelForDate(m, d);
}

/** Horário de regência: [início, fim] em minutos desde a meia-noite. */
export function regencyMinutes(angel: AngelInfo): [number, number] {
  return [(angel.number - 1) * 20, angel.number * 20];
}

/** Anjo que rege o momento (a cada 20 minutos). */
export function angelOfMoment(date: Date) {
  return ANGELS[Math.floor((date.getHours() * 60 + date.getMinutes()) / 20) % 72];
}
