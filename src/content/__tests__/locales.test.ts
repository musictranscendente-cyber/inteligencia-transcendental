/** Garante que FR, DE e IT cobrem todo o conteúdo, no mesmo formato do inglês. */
import { describe, expect, it } from '@jest/globals';

import * as angels from '../angels';
import * as astrology from '../astrology';
import * as chinese from '../chinese';
import * as daily from '../daily';
import * as humanDesign from '../humanDesign';
import * as legal from '../legal';
import * as library from '../library';
import * as misc from '../misc';
import * as numbers from '../numbers';
import * as oracles from '../oracles';
import * as tarotMajor from '../tarot-major';
import * as tarotMinor from '../tarot-minor';
import * as today from '../today';
import deDict from '../locales/de.json';
import frDict from '../locales/fr.json';
import itDict from '../locales/it.json';
import { walkL } from '../types';

const shape = (v: unknown): string =>
  Array.isArray(v) ? `[${v.map(shape).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).sort().map((k) => `${k}:${shape((v as Record<string, unknown>)[k])}`).join(',')}}` : typeof v;
const placeholders = (v: unknown) => (JSON.stringify(v).match(/\{\w+\}/g) ?? []).sort().join('');

const modules = { angels, astrology, chinese, daily, humanDesign, legal, library, misc, numbers, oracles, tarotMajor, tarotMinor, today };

const dicts: [string, Record<string, unknown>][] = [['fr', frDict], ['de', deDict], ['it', itDict]];

describe.each(dicts)('%s', (_lang, dict) => {
  const problems: string[] = [];
  for (const mod of Object.values(modules)) {
    for (const [name, value] of Object.entries(mod)) {
      walkL(value, name, (l, path) => {
        if (!(path in dict)) problems.push(`falta ${path}`);
        else if (shape(dict[path]) !== shape(l.en)) problems.push(`formato ${path}`);
        else if (placeholders(dict[path]) !== placeholders(l.en)) problems.push(`marcador ${path}`);
      });
    }
  }
  it('traduz todo o conteúdo no formato certo', () => expect(problems).toEqual([]));
});
