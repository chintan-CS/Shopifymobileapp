export interface ProductVariant {
  id: string;
  title: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'Men' | 'Women' | 'Accessories' | string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  localImage?: any;
  variants: ProductVariant[];
  availableForSale: boolean;
  tag?: string;
}
