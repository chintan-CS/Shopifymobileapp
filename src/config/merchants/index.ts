import { MerchantConfig } from '../merchant.types';
import { gymsharkConfig } from './gymshark';
import { urbanwearConfig } from './urbanwear';

export const MERCHANTS: Record<string, MerchantConfig> = {
  gymshark: gymsharkConfig,
  urbanwear: urbanwearConfig,
};

export { gymsharkConfig, urbanwearConfig };
