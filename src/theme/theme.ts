import { activeMerchant } from '../config/activeMerchant';
import { MerchantConfig } from '../config/merchant.types';
import { AppTheme, ThemeSpacing, ThemeTypography } from './theme.types';

export const defaultSpacing: ThemeSpacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const defaultTypography: ThemeTypography = {
  fontSize: {
    small: 12,
    body: 16,
    heading: 20,
    title: 28,
  },
};

/**
 * Creates an AppTheme instance from a given MerchantConfig.
 */
export const createTheme = (merchant: MerchantConfig): AppTheme => ({
  colors: {
    ...merchant.branding.colors,
  },
  spacing: defaultSpacing,
  typography: defaultTypography,
});

/**
 * Determines whether a given hex color is perceptually dark or light based on relative luminance (ITU-R BT.601).
 */
export const isColorDark = (hexColor: string): boolean => {
  if (!hexColor) {
    return false;
  }
  const cleanHex = hexColor.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

/**
 * Returns the status bar content style ('dark-content' or 'light-content')
 * appropriate for a given background color in React Native StatusBar.
 */
export const getStatusBarStyle = (
  backgroundColor: string,
): 'dark-content' | 'light-content' => {
  return isColorDark(backgroundColor) ? 'light-content' : 'dark-content';
};

/**
 * Returns the status bar content style ('dark' or 'light')
 * appropriate for a given background color in React Navigation native-stack.
 */
export const getNavigationStatusBarStyle = (
  backgroundColor: string,
): 'dark' | 'light' => {
  return isColorDark(backgroundColor) ? 'light' : 'dark';
};

/**
 * Active application theme derived directly from the active merchant configuration.
 */
export const theme: AppTheme = createTheme(activeMerchant);

export const activeTheme: AppTheme = theme;
