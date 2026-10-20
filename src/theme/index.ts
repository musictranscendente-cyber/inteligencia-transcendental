import { useColorScheme } from 'react-native';

import { useSettings } from '@/storage/settings';
import { palettes, type ThemeName } from './tokens';

export * from './tokens';

/** Tema ativo, respeitando a preferência salva (escuro, claro ou igual ao celular). */
export function useThemeName(): ThemeName {
  const { theme } = useSettings();
  const system = useColorScheme();
  if (theme === 'system') return system === 'light' ? 'light' : 'dark';
  return theme;
}

export function useTheme() {
  const name = useThemeName();
  return { name, colors: palettes[name] };
}
