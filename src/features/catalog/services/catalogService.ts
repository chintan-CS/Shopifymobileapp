import { SAMPLE_PRODUCTS } from '../data/products';
import { CatalogResponse, CatalogServiceMode } from './types';

/**
 * Global mock mode controller for demonstrating catalog lifecycle states.
 * Options: 'success' | 'empty' | 'error'
 * Defaults to 'success' for seamless everyday prototype usage.
 */
export let CATALOG_MOCK_MODE: CatalogServiceMode = 'success';

export const setCatalogMockMode = (mode: CatalogServiceMode) => {
  CATALOG_MOCK_MODE = mode;
};

/**
 * Asynchronous service simulating Shopify Storefront API product query.
 */
export const fetchCatalogProducts = async (
  mode: CatalogServiceMode = CATALOG_MOCK_MODE,
  latencyMs: number = 450,
): Promise<CatalogResponse> => {
  try {
    // Simulate realistic async roundtrip network latency
    await new Promise(resolve => setTimeout(resolve, latencyMs));

    switch (mode) {
      case 'error':
        return {
          status: 'error',
          data: [],
          errorMessage:
            'Unable to connect to Shopify Storefront API. Please verify your connection and try again.',
        };

      case 'empty':
        return {
          status: 'empty',
          data: [],
        };

      case 'success':
      default:
        return {
          status: 'success',
          data: [...SAMPLE_PRODUCTS],
        };
    }
  } catch (error) {
    return {
      status: 'error',
      data: [],
      errorMessage: 'An unexpected network error occurred while loading the catalog.',
    };
  }
};
