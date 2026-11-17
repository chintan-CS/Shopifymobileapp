import { MerchantColors } from '../config/merchant.types';

export interface ThemeColors extends MerchantColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
}

export interface ThemeSpacing {
  small: number;
  medium: number;
  large: number;
}

export interface ThemeTypography {
  fontSize: {
    small: number;
    body: number;
    heading: number;
    title: number;
  };
}

export interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
}
