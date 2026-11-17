import { Product } from '../types';

export type CatalogServiceMode = 'success' | 'empty' | 'error';

export type CatalogResponseStatus = 'success' | 'empty' | 'error';

export interface CatalogResponse {
  status: CatalogResponseStatus;
  data: Product[];
  errorMessage?: string;
}
