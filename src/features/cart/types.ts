import { Product, ProductVariant } from '../catalog/types';

export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  selectedSize: string;
  unitPrice: number;
  quantity: number;
  category: string;
  imageRef?: string;
}

export interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isCartLoaded: boolean;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  increaseQuantity: (variantId: string) => void;
  decreaseQuantity: (variantId: string) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
}
