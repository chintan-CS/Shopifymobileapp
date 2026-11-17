import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { activeMerchant } from '../../config';
import { RootStackScreenProps } from '../../navigation/types';
import { theme } from '../../theme';
import { SAMPLE_PRODUCTS } from '../catalog/data/products';
import { useCart } from './context/CartContext';
import { CartItem } from './types';

interface CartItemRowProps {
  item: CartItem;
  currencySymbol: string;
  onIncrease: (variantId: string) => void;
  onDecrease: (variantId: string) => void;
  onRemove: (variantId: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  currencySymbol,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const [imageError, setImageError] = useState(false);
  const product = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
  const imageSource =
    product?.localImage ||
    (product?.images && product.images.length > 0
      ? { uri: product.images[0] }
      : null);
  const itemTotal = item.unitPrice * item.quantity;

  return (
    <View
      style={[
        styles.cartCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      {/* 1. Product Thumbnail with 4:5 Portrait Ratio */}
      <View
        style={[
          styles.thumbnailContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}>
        {imageSource && !imageError ? (
          <Image
            source={imageSource}
            style={styles.thumbnailImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.thumbnailFallbackWrapper}>
            <Text
              style={[
                styles.thumbnailFallbackText,
                { color: theme.colors.textSecondary },
              ]}>
              {item.category.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* 2. Item Meta & Controls */}
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text
            numberOfLines={1}
            style={[
              styles.itemTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.body - 1,
              },
            ]}>
            {item.productTitle}
          </Text>
          <TouchableOpacity
            onPress={() => onRemove(item.variantId)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.productTitle} from cart`}>
            <Text
              style={[
                styles.removeText,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.small - 1,
                },
              ]}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Size Badge */}
        <View style={styles.variantBadge}>
          <Text
            style={[
              styles.variantText,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.small - 1,
              },
            ]}>
            SIZE: {item.selectedSize}
          </Text>
        </View>

        {/* Pricing and Stepper Controls */}
        <View style={styles.actionRow}>
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.unitPrice,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.body,
                },
              ]}>
              {currencySymbol}
              {itemTotal.toFixed(2)}
            </Text>
            {item.quantity > 1 && (
              <Text
                style={[
                  styles.perUnitText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small - 2,
                  },
                ]}>
                ({currencySymbol}
                {item.unitPrice.toFixed(2)} each)
              </Text>
            )}
          </View>

          {/* Stepper Buttons */}
          <View
            style={[
              styles.stepperContainer,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              },
            ]}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onDecrease(item.variantId)}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.stepperSymbol,
                  { color: theme.colors.text },
                ]}>
                −
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.quantityText,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.small,
                },
              ]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onIncrease(item.variantId)}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.stepperSymbol,
                  { color: theme.colors.text },
                ]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export const CartScreen: React.FC<RootStackScreenProps<'Cart'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const {
    items,
    totalCount,
    subtotal,
    isCartLoaded,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] =
    useState<boolean>(false);

  const currencySymbol = activeMerchant.currency.symbol;

  const handleCheckoutPress = () => {
    setIsCheckoutModalVisible(true);
  };

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  const renderEmptyCart = () => {
    if (!isCartLoaded) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.body,
                marginTop: theme.spacing.medium,
              },
            ]}>
            Loading your cart...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        {/* Minimalist geometric bag badge */}
        <View
          style={[
            styles.emptyIconCircle,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.emptyBagMonogram,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.small,
              },
            ]}>
            BAG
          </Text>
        </View>

        <Text
          style={[
            styles.emptyTitle,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.heading,
            },
          ]}>
          YOUR BAG IS EMPTY
        </Text>
        <Text
          style={[
            styles.emptySubtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.body - 1,
              marginTop: theme.spacing.small,
            },
          ]}>
          Explore our curated collection of activewear and add your favorite pieces.
        </Text>

        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: theme.colors.primary,
              marginTop: theme.spacing.large,
            },
          ]}
          onPress={handleContinueShopping}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue Shopping">
          <Text
            style={[
              styles.continueButtonText,
              { color: theme.colors.background },
            ]}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    if (items.length === 0) {
      return null;
    }

    return (
      <View style={styles.summaryContainer}>
        {/* Order Breakdown Card */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.summaryHeader,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.small - 1,
              },
            ]}>
            ORDER SUMMARY
          </Text>

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.small,
                },
              ]}>
              Items Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'})
            </Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.small + 1,
                },
              ]}>
              {currencySymbol}
              {subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.small,
                },
              ]}>
              Estimated Shipping
            </Text>
            <Text
              style={[
                styles.summaryMuted,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.small - 1,
                },
              ]}>
              Calculated at checkout
            </Text>
          </View>

          <View
            style={[
              styles.summaryDivider,
              { backgroundColor: theme.colors.border },
            ]}
          />

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.totalLabel,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.body,
                },
              ]}>
              Total
            </Text>
            <Text
              style={[
                styles.totalValue,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.heading + 2,
                },
              ]}>
              {currencySymbol}
              {subtotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Clear Cart Option */}
        <TouchableOpacity
          style={styles.clearCartBtn}
          onPress={clearCart}
          accessibilityRole="button"
          accessibilityLabel="Clear entire cart">
          <Text
            style={[
              styles.clearCartText,
              { color: theme.colors.textSecondary },
            ]}>
            Clear Bag
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={item => item.variantId}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            currencySymbol={currencySymbol}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
          />
        )}
        ListEmptyComponent={renderEmptyCart}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: theme.spacing.medium,
            paddingTop: theme.spacing.medium,
            paddingBottom: items.length > 0 ? insets.bottom + 90 : insets.bottom + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Sticky Bottom Checkout Bar (Visible when items > 0) */}
      {items.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 16),
              paddingHorizontal: theme.spacing.medium,
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleCheckoutPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Proceed to Checkout, total ${currencySymbol}${subtotal.toFixed(2)}`}>
            <Text
              style={[
                styles.checkoutButtonText,
                {
                  color: theme.colors.background,
                  fontSize: theme.typography.fontSize.body,
                },
              ]}>
              Checkout • {currencySymbol}
              {subtotal.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Polished In-App Shopify Hosted Checkout Modal */}
      <Modal
        visible={isCheckoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCheckoutModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsCheckoutModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            {/* Modal Micro Tag */}
            <View
              style={[
                styles.modalTag,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.modalTagText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small - 2,
                  },
                ]}>
                CHECKOUT INTEGRATION PREVIEW
              </Text>
            </View>

            {/* Modal Heading */}
            <Text
              style={[
                styles.modalTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.heading,
                },
              ]}>
              Shopify Hosted Checkout
            </Text>

            {/* Modal Body */}
            <Text
              style={[
                styles.modalMessage,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.body - 2,
                },
              ]}>
              Production checkout connects to the Shopify Storefront API to create a secure checkout session. Customers are redirected to Shopify's hosted checkout to complete their purchase.
            </Text>

            {/* Store Information Note */}
            <View
              style={[
                styles.modalInfoBox,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.modalInfoText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small - 1,
                  },
                ]}>
                Store: {activeMerchant.storeName} ({activeMerchant.shopifyDomain})
              </Text>
            </View>

            {/* Close / Action Button */}
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setIsCheckoutModalVisible(false)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Close checkout modal">
              <Text
                style={[
                  styles.modalCloseButtonText,
                  { color: theme.colors.background },
                ]}>
                Understood
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  cartCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  thumbnailContainer: {
    width: 72,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallbackWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailFallbackText: {
    fontWeight: '800',
    fontSize: 22,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  removeText: {
    fontWeight: '600',
  },
  variantBadge: {
    marginTop: 2,
  },
  variantText: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  unitPrice: {
    fontWeight: '800',
  },
  perUnitText: {
    fontWeight: '500',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSymbol: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  quantityText: {
    paddingHorizontal: 8,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyBagMonogram: {
    fontWeight: '800',
    letterSpacing: 2,
  },
  emptyTitle: {
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  continueButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  continueButtonText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  summaryHeader: {
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: '700',
  },
  summaryMuted: {
    fontStyle: 'italic',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontWeight: '800',
  },
  totalValue: {
    fontWeight: '900',
  },
  clearCartBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  clearCartText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  checkoutButton: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalTagText: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  modalTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  modalInfoBox: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalInfoText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCloseButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButtonText: {
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 15,
  },
});
