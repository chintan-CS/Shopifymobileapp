import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../theme';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currencySymbol: string;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol,
  onPress,
}) => {
  const isAvailable = product.availableForSale;
  const [imageError, setImageError] = useState(false);

  const imageSource =
    product.localImage ||
    (product.images && product.images.length > 0
      ? { uri: product.images[0] }
      : null);

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => onPress(product)}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${currencySymbol}${product.price.toFixed(
        2,
      )}`}>
      {/* 1. Product Image with 3:4 Portrait Ratio */}
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}>
        {imageSource && !imageError ? (
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.fallbackGlyphWrapper}>
            <Text
              style={[
                styles.fallbackGlyph,
                { color: theme.colors.textSecondary },
              ]}>
              {product.category.charAt(0)}
            </Text>
            <Text
              style={[
                styles.fallbackCategory,
                { color: theme.colors.textSecondary },
              ]}>
              {product.category.toUpperCase()}
            </Text>
          </View>
        )}

        {/* Badges: SOLD OUT, SALE, or Brand Tag */}
        <View style={styles.badgeContainer}>
          {!isAvailable ? (
            <View style={[styles.badge, { backgroundColor: '#6E6661' }]}>
              <Text style={styles.badgeText}>SOLD OUT</Text>
            </View>
          ) : product.tag ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    product.tag === 'SALE'
                      ? '#B3261E'
                      : theme.colors.primary,
                },
              ]}>
              <Text
                style={[
                  styles.badgeText,
                  { color: theme.colors.background },
                ]}>
                {product.tag}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* 2. Product Information */}
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.categoryLabel,
            { color: theme.colors.textSecondary },
          ]}>
          {product.category.toUpperCase()}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.title,
            { color: theme.colors.text },
          ]}>
          {product.title}
        </Text>

        {/* Pricing Row */}
        <View style={styles.priceRow}>
          <Text
            style={[
              styles.price,
              { color: theme.colors.text },
            ]}>
            {currencySymbol}
            {product.price.toFixed(2)}
          </Text>

          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <Text
              style={[
                styles.compareAtPrice,
                { color: theme.colors.textSecondary },
              ]}>
              {currencySymbol}
              {product.compareAtPrice.toFixed(2)}
            </Text>
          ) : null}
        </View>

        {/* Stock / Availability Status */}
        <View style={styles.stockRow}>
          <View
            style={[
              styles.stockDot,
              { backgroundColor: isAvailable ? '#1E8E3E' : '#B3261E' },
            ]}
          />
          <Text
            style={[
              styles.stockText,
              { color: isAvailable ? '#1E8E3E' : '#B3261E' },
            ]}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  fallbackGlyphWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackGlyph: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
  },
  fallbackCategory: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
  },
  badge: {
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 3.5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 8.5,
    letterSpacing: 0.6,
  },
  infoContainer: {
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
  },
  compareAtPrice: {
    fontSize: 11.5,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    marginTop: 6,
  },
  stockDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
