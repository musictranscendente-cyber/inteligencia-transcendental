import * as MediaLibrary from 'expo-media-library/legacy';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/app-text';
import { SignGlyph } from '@/components/astro-glyphs';
import { Button } from '@/components/button';
import { Bodygraph } from '@/components/charts/bodygraph';
import { MoonPhase } from '@/components/charts/moon-phase';
import { Wings } from '@/components/charts/wings';
import { Radar } from '@/components/charts/misc-charts';
import { ShareCard, SHARE_W, type ShareFormat } from '@/components/share-card';
import { TarotFace } from '@/components/tarot-face';
import { NumberRing, Pill, ScoreBars } from '@/components/ui/bits';
import { Screen } from '@/components/ui/screen';
import { ANGEL_ATTRIBUTES } from '@/content/angels';
import { SIGNS_TEXT } from '@/content/astrology';
import { MOON_PHASES } from '@/content/daily';
import { HD_TYPES } from '@/content/humanDesign';
import { TRAITS_TEXT } from '@/content/misc';
import { NUMBERS, PERSONAL_YEAR } from '@/content/numbers';
import { joinList } from '@/content/synthesis';
import { cardInfo } from '@/content/tarot';
import { MOON_PHASE_DEEP, PERSONAL_DAY } from '@/content/today';
import { MAJOR_ARCANA } from '@/content/tarot-major';
import { useLang } from '@/content/types';
import { pointOf } from '@/engines/astro/chart';
import { RADAR_AXES } from '@/engines/compatibility';
import { buildReading, firstName } from '@/engines/reading';
import { convergences } from '@/engines/traits';
import { compareReadings } from '@/features/relations/compat';
import { describeTransit } from '@/features/today/describe';
import { buildToday } from '@/features/today/use-today';
import { formatWeekday } from '@/lib/format';
import { toPersonInput, useReading } from '@/hooks/use-reading';
import { CONFIG } from '@/services/config';
import { peopleStore, prefsStore } from '@/storage/app-data';
import { radius, spacing, useTheme } from '@/theme';

/** Cards da aba Hoje: na tela de compartilhar dá para alternar entre eles. */
const DAILY = [
  ['day', 'today.detail.energy'],
  ['card', 'today.cardOfDay'],
  ['angel', 'today.angelOfDay'],
  ['moon', 'today.moonToday'],
  ['numbers', 'today.numbersOfDay'],
  ['sky', 'today.sky'],
] as const;

type CardData = { color: string; art: ReactNode; kicker: string; title: string; phrase: string; date?: string; extra?: ReactNode };

export default function ShareScreen() {
  const params = useLocalSearchParams<{ template?: string; id?: string; slide?: string }>();
  const { id, slide } = params;
  const [template, setTemplate] = useState(params.template ?? 'arcana');
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const r = useReading();
  const people = peopleStore.useValue();
  const prefs = prefsStore.useValue();
  const [format, setFormat] = useState<ShareFormat>('story');
  const [message, setMessage] = useState<string | null>(null);
  const ref = useRef<ComponentRef<typeof View>>(null);
  if (!r) return null;
  const tc = colors.technique;
  const name = firstName(r.person.fullName);
  const story = format === 'story';
  const dateLabel = formatWeekday(new Date(), i18n.language);
  let cached: ReturnType<typeof buildToday> | null = null;
  const today = () => (cached ??= buildToday(r, prefs.reversals, lang));

  const build = (): CardData => {
    switch (template) {
      case 'destiny': {
        const e = NUMBERS[r.numerology.destiny][lang];
        return { color: tc.numerology, kicker: t('share.myDestiny'), title: e.title, phrase: e.summary, art: <NumberRing value={r.numerology.destiny} color={tc.numerology} size={150} /> };
      }
      case 'big3': {
        const sun = pointOf(r.chart, 'sun')!;
        const moon = pointOf(r.chart, 'moon')!;
        const asc = pointOf(r.chart, 'asc');
        const list = [sun, moon, ...(asc ? [asc] : [])];
        return {
          color: tc.astrology,
          kicker: t('share.myBig3'),
          title: list.map((p) => SIGNS_TEXT[p.sign][lang].name).join(' · '),
          phrase: SIGNS_TEXT[sun.sign][lang].summary,
          art: <View style={styles.row}>{list.map((p, i) => <SignGlyph key={i} sign={p.sign} size={70} color={tc.astrology} />)}</View>,
        };
      }
      case 'day': {
        const { energy: e, line, card } = today();
        return {
          color: colors.gold,
          kicker: t('share.myDay'),
          date: dateLabel,
          title: line.title,
          phrase: line.phrase,
          art: <TarotFace id={card.id} width={story ? 120 : 70} color={tc.tarot} reversed={card.reversed} />,
          extra: (
            <View style={[styles.row, styles.bars]}>
              <ScoreBars label={t('today.love')} value={e.scores.love} color={tc.oracles} />
              <ScoreBars label={t('today.work')} value={e.scores.work} color={tc.astrology} />
              <ScoreBars label={t('today.energy')} value={e.scores.energy} color={tc.humanDesign} />
            </View>
          ),
        };
      }
      case 'card': {
        const { card } = today();
        const info = cardInfo(card.id, lang);
        return {
          color: tc.tarot,
          kicker: t('share.myCard'),
          date: dateLabel,
          title: card.reversed ? `${info.name} · ${t('today.reversed')}` : info.name,
          phrase: card.reversed ? info.reversed : info.upright,
          art: <TarotFace id={card.id} width={story ? 170 : 96} color={tc.tarot} reversed={card.reversed} />,
        };
      }
      case 'angel': {
        const { angel } = today();
        return {
          color: tc.angel,
          kicker: t('share.myAngel'),
          date: dateLabel,
          title: angel.name,
          phrase: `${ANGEL_ATTRIBUTES[angel.number - 1][lang]} · ${angel.psalm}`,
          art: <Wings width={story ? 240 : 150} color={tc.angel} />,
        };
      }
      case 'moon': {
        const { energy, southern } = today();
        const phase = MOON_PHASES[lang][energy.moon.phaseIndex];
        return {
          color: tc.astrology,
          kicker: t('share.myMoon'),
          date: dateLabel,
          title: phase.name,
          phrase: `${t('today.moonIn', { sign: SIGNS_TEXT[energy.moon.sign][lang].name })} · ${phase.tip} ${story ? MOON_PHASE_DEEP[lang][energy.moon.phaseIndex].ritual : ''}`.trim(),
          art: <MoonPhase phase={energy.moon.phase} size={story ? 180 : 96} southern={southern} />,
        };
      }
      case 'numbers': {
        const { energy: e } = today();
        const day = PERSONAL_DAY[e.personalDay][lang];
        const size = story ? 86 : 56;
        return {
          color: tc.numerology,
          kicker: t('share.myNumbers'),
          date: dateLabel,
          title: day.title,
          phrase: story ? day.text : day.favors,
          art: (
            <View style={styles.row}>
              <NumberRing value={e.personalDay} label={t('today.personalDay')} color={tc.numerology} size={size} />
              <NumberRing value={e.personalMonth} label={t('today.personalMonth')} color={tc.numerology} size={size} />
              <NumberRing value={e.personalYear} label={t('today.personalYear')} color={tc.numerology} size={size} />
            </View>
          ),
        };
      }
      case 'sky': {
        const list = today().sky.slice(0, story ? 3 : 1).map((tr) => describeTransit(tr, lang, t));
        return {
          color: tc.astrology,
          kicker: t('share.mySky'),
          date: dateLabel,
          title: list[0]?.pair ?? t('today.sky'),
          phrase: list[0]?.text ?? t('today.skyEmpty'),
          art: <SignGlyph sign={pointOf(r.chart, 'sun')!.sign} size={story ? 110 : 64} color={tc.astrology} />,
          extra: list.length > 1 ? (
            <View style={styles.list}>
              {list.slice(1).map((d) => <AppText key={d.title} variant="caption" muted center>{d.title}</AppText>)}
            </View>
          ) : null,
        };
      }
      case 'compat': {
        const p = people.find((x) => x.id === id);
        if (p) {
          const c = compareReadings(r, buildReading(toPersonInput(p)));
          return {
            color: tc.oracles,
            kicker: t('share.ourCompat'),
            title: `${name} & ${firstName(p.fullName)}`,
            phrase: `${t('rel.overall')}: ${c.overall}%`,
            art: <Radar values={RADAR_AXES.map((k) => c.radar[k])} labels={RADAR_AXES.map((k) => t(`rel.radar.${k}`))} color={tc.oracles} size={230} />,
          };
        }
        break;
      }
      case 'bodygraph': {
        const hd = r.humanDesign;
        if (hd) {
          return { color: tc.humanDesign, kicker: t('share.myBodygraph'), title: `${HD_TYPES[hd.type][lang].name} ${hd.profile.join('/')}`, phrase: HD_TYPES[hd.type][lang].summary, art: <Bodygraph defined={hd.defined} gates={hd.gates} channels={hd.channels} color={tc.humanDesign} width={180} /> };
        }
        break;
      }
      case 'synthesis': {
        const conv = convergences(r).slice(0, 3);
        return {
          color: colors.gold,
          kicker: t('share.mySynthesis'),
          title: joinList(conv.map((c) => TRAITS_TEXT[c.trait][lang].label), lang),
          phrase: conv[0] ? t('syn.convergenceLine', { count: conv[0].techniques.length, trait: TRAITS_TEXT[conv[0].trait][lang].label }) : '',
          art: <TarotFace id={`M${r.arcana}`} width={120} color={colors.gold} />,
        };
      }
      case 'wrapped': {
        const py = r.personal.year;
        return { color: tc.numerology, kicker: t('cyc.wrapped'), title: PERSONAL_YEAR[py][lang].title, phrase: `${t('wrap.arcTitle')} ${MAJOR_ARCANA[r.yearArcana][lang].name}${slide ? '' : ''}`, art: <NumberRing value={py} color={tc.numerology} size={150} /> };
      }
    }
    const a = MAJOR_ARCANA[r.arcana][lang];
    return { color: tc.tarot, kicker: t('share.myArcana'), title: a.name, phrase: a.summary, art: <TarotFace id={`M${r.arcana}`} width={story ? 170 : 120} color={tc.tarot} /> };
  };

  const data = build();
  const scale = Math.min(1, (width - 2 * spacing.lg) / SHARE_W);

  const capture = async () => {
    const h = format === 'story' ? 1920 : 1080;
    return captureRef(ref as Parameters<typeof captureRef>[0], { format: 'png', quality: 1, result: 'tmpfile', width: 1080, height: h });
  };

  const send = async () => {
    try {
      const uri = await capture();
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('share.title') });
    } catch (e) {
      setMessage(String(e));
    }
  };

  const save = async () => {
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (!perm.granted) return setMessage(t('share.noPermission'));
      const uri = await capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      setMessage(t('share.saved'));
    } catch (e) {
      setMessage(String(e));
    }
  };

  return (
    <Screen title={t('share.title')}>
      {DAILY.some(([k]) => k === template) ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daily}>
          {DAILY.map(([k, label]) => (
            <Pill key={k} label={t(label)} active={template === k} onPress={() => setTemplate(k)} />
          ))}
        </ScrollView>
      ) : null}
      <View style={styles.pills}>
        <Pill label={t('share.story')} active={format === 'story'} onPress={() => setFormat('story')} />
        <Pill label={t('share.feed')} active={format === 'feed'} onPress={() => setFormat('feed')} />
      </View>
      <ScrollView horizontal={false} contentContainerStyle={styles.center}>
        <View style={[styles.preview, { width: SHARE_W * scale, height: (story ? SHARE_W * (16 / 9) : SHARE_W) * scale, borderColor: colors.border }]}>
          <View style={{ width: SHARE_W, transform: [{ scale }], transformOrigin: 'top left' }}>
            <ShareCard ref={ref} format={format} footer={`${t('share.download')} · ${CONFIG.shareUrl}`} appName={t('app.name')} {...data} />
          </View>
        </View>
      </ScrollView>
      {Platform.OS !== 'web' ? (
        <View style={styles.gap}>
          <Button title={t('share.send')} onPress={send} />
          <Button variant="secondary" title={t('share.save')} onPress={save} />
        </View>
      ) : null}
      {message ? <AppText variant="caption" muted center>{message}</AppText> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  center: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  bars: { alignSelf: 'stretch', marginTop: 4 },
  list: { gap: 4 },
  preview: { borderRadius: radius.card, overflow: 'hidden', borderWidth: 1 },
  daily: { gap: spacing.sm, paddingHorizontal: 2 },
  pills: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
});
