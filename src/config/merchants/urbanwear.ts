import { MerchantConfig } from '../merchant.types';

export const urbanwearConfig: MerchantConfig = {
  id: 'urbanwear',
  storeName: 'UrbanWear',
  appDisplayName: 'UrbanWear Fashion',
  shopifyDomain: 'urbanwear-sample.myshopify.com',
  currency: {
    code: 'USD',
    symbol: '$',
  },
  branding: {
    logoUrl: 'https://cdn.shopify.com/s/files/1/0533/2089/files/UrbanWear_Logo.png',
    colors: {
      primary: '#2D2825',
      secondary: '#8B7D77',
      background: '#F8F5F0', // warm beige background
      surface: '#EDE8E0', // subtle beige surface
      text: '#211D1A', // deep dark brown/charcoal
      textSecondary: '#6E6661',
      border: '#DED8CE',
    },
  },
  features: {
    reviews: false,
    loyalty: true,
    pushNotifications: false,
  },
};
