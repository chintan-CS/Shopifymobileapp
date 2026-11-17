import { MerchantConfig } from '../merchant.types';

export const gymsharkConfig: MerchantConfig = {
  id: 'gymshark',
  storeName: 'Gymshark',
  appDisplayName: 'Gymshark Mobile',
  shopifyDomain: 'gymshark-sample.myshopify.com',
  currency: {
    code: 'USD',
    symbol: '$',
  },
  branding: {
    logoUrl: 'https://cdn.shopify.com/s/files/1/0156/6146/files/Gymshark_Logo.png',
    colors: {
      primary: '#000000',
      secondary: '#4A4A4A',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#111111',
      textSecondary: '#666666',
      border: '#E0E0E0',
    },
  },
  features: {
    reviews: true,
    loyalty: false,
    pushNotifications: true,
  },
};
