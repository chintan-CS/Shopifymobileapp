import { MerchantConfig, MerchantId } from './merchant.types';
import { MERCHANTS } from './merchants';

/**
 * Configure the active merchant ID here.
 * Set to 'gymshark' or 'urbanwear' to switch stores without touching any UI code.
 */
//export const ACTIVE_MERCHANT_ID: MerchantId = 'urbanwear';
export const ACTIVE_MERCHANT_ID: MerchantId = 'urbanwear';
/**
 * Returns the resolved merchant configuration.
 * Defaults to the configured ACTIVE_MERCHANT_ID, or can accept a specific ID.
 */
export const getActiveMerchant = (
  merchantId: MerchantId = ACTIVE_MERCHANT_ID,
): MerchantConfig => {
  const config = MERCHANTS[merchantId];
  if (!config) {
    throw new Error(
      `Merchant "${merchantId}" not found. Available merchants: ${Object.keys(
        MERCHANTS,
      ).join(', ')}`,
    );
  }
  return config;
};

/**
 * Exported active merchant config singleton.
 */
export const activeMerchant: MerchantConfig = getActiveMerchant();
