/** Tokens de design: cores, espaçamentos, raios e fontes do app. */

export type ThemeName = 'dark' | 'light';

const shared = {
  gold: '#D9B56A',
  goldSoft: 'rgba(217, 181, 106, 0.18)',
  danger: '#FF6B6B',
  /** Cor própria de cada técnica (ícones, gráficos e cabeçalhos). */
  technique: {
    numerology: '#7FB3FF',
    tarot: '#B48CFF',
    astrology: '#FFB86B',
    humanDesign: '#5FE0B8',
    chinese: '#FF6B6B',
    angel: '#F5E6A8',
    oracles: '#E58FD4',
  },
  element: {
    fire: '#FF7A59',
    earth: '#9CCB6B',
    air: '#8FD3FF',
    water: '#6B8BFF',
  },
} as const;

export const palettes = {
  dark: {
    ...shared,
    background: '#0B0A1A',
    surface: '#16142B',
    surfaceGlass: 'rgba(22, 20, 43, 0.62)',
    border: 'rgba(217, 181, 106, 0.22)',
    text: '#F2EEE6',
    textMuted: 'rgba(242, 238, 230, 0.66)',
    star: '#F2EEE6',
    onGold: '#0B0A1A',
    blurTint: 'dark' as const,
  },
  light: {
    ...shared,
    gold: '#B08A3E',
    background: '#F7F2E8',
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.72)',
    border: 'rgba(28, 26, 46, 0.12)',
    text: '#1C1A2E',
    textMuted: 'rgba(28, 26, 46, 0.62)',
    star: '#1C1A2E',
    onGold: '#FFFFFF',
    blurTint: 'light' as const,
  },
};

export type Palette = (typeof palettes)['dark'];

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { card: 20, pill: 999, sm: 12 } as const;

export const fonts = {
  title: 'CormorantGaramond_600SemiBold',
  titleMedium: 'CormorantGaramond_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

/** Remove o contorno de foco do navegador (só afeta a pré-visualização web). */
export const noOutline = { outlineStyle: 'none' } as object;
