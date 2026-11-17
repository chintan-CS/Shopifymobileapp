import { DefaultTheme, Theme } from '@react-navigation/native';
import { isColorDark, theme } from '../theme';

/**
 * Custom navigation theme mapped directly from the active merchant theme.
 */
export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: isColorDark(theme.colors.background),
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
  },
};
