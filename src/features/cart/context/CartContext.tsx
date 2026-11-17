import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductVariant } from '../../catalog/types';
import { CartContextType, CartItem } from '../types';

export const CART_STORAGE_KEY = '@shopify_mobile_app/cart';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);

  // Hydrate cart from AsyncStorage on initial mount
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      try {
        const storedJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedJson && isMounted) {
          const parsed = JSON.parse(storedJson);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (error) {
        console.warn('Failed to load cart from persistent storage:', error);
      } finally {
        if (isMounted) {
          setIsCartLoaded(true);
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  // Automatically persist cart items to AsyncStorage whenever items change after hydration
  useEffect(() => {
    // Prevent overwriting stored cart data with empty state before hydration completes
    if (!isCartLoaded) {
      return;
    }

    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.warn('Failed to save cart to persistent storage:', error);
      }
    };

    saveCart();
  }, [items, isCartLoaded]);

  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity: number = 1): boolean => {
      // Guard against adding items before storage hydration completes
      if (!isCartLoaded) {
        return false;
      }

      // Guard against adding out-of-stock products or variants
      if (!product.availableForSale || !variant.availableForSale) {
        return false;
      }

      setItems(prevItems => {
        const existingIndex = prevItems.findIndex(
          item => item.variantId === variant.id,
        );

        if (existingIndex > -1) {
          // Increment quantity of existing variant item
          const updated = [...prevItems];
          const existingItem = updated[existingIndex];
          updated[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          };
          return updated;
        }

        // Add as a new distinct variant line item
        const newItem: CartItem = {
          productId: product.id,
          variantId: variant.id,
          productTitle: product.title,
          selectedSize: variant.size,
          unitPrice: variant.price,
          quantity: Math.max(1, quantity),
          category: product.category,
        };

        return [...prevItems, newItem];
      });

      return true;
    },
    [isCartLoaded],
  );

  const increaseQuantity = useCallback(
    (variantId: string) => {
      if (!isCartLoaded) {
        return;
      }

      setItems(prevItems =>
        prevItems.map(item =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    },
    [isCartLoaded],
  );

  const decreaseQuantity = useCallback(
    (variantId: string) => {
      if (!isCartLoaded) {
        return;
      }

      setItems(prevItems => {
        return prevItems
          .map(item => {
            if (item.variantId === variantId) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter(item => item.quantity > 0);
      });
    },
    [isCartLoaded],
  );

  const removeFromCart = useCallback(
    (variantId: string) => {
      if (!isCartLoaded) {
        return;
      }

      setItems(prevItems =>
        prevItems.filter(item => item.variantId !== variantId),
      );
    },
    [isCartLoaded],
  );

  const clearCart = useCallback(() => {
    if (!isCartLoaded) {
      return;
    }

    setItems([]);
  }, [isCartLoaded]);

  // Derived calculations: strictly not persisted in storage
  const totalCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      totalCount,
      subtotal,
      isCartLoaded,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      items,
      totalCount,
      subtotal,
      isCartLoaded,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
