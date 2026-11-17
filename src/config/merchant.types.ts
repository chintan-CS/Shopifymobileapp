export type MerchantId = 'gymshark' | 'urbanwear' | string;

export interface MerchantColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface MerchantBranding {
  logoUrl?: string;
  colors: MerchantColors;
}

export interface MerchantCurrency {
  code: string;
  symbol: string;
}

export interface MerchantFeatureFlags {
  reviews?: boolean;
  loyalty?: boolean;
  pushNotifications?: boolean;
}

export interface MerchantConfig {
  id: MerchantId;
  storeName: string;
  appDisplayName: string;
  shopifyDomain: string;
  currency: MerchantCurrency;
  branding: MerchantBranding;
  features: MerchantFeatureFlags;
}
