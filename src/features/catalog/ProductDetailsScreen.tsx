import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { activeMerchant } from '../../config';
import { RootStackScreenProps } from '../../navigation/types';
import { theme } from '../../theme';
import {
  getProductReviews,
  getUnavailableReviewsResponse,
  ReviewsResponse,
} from '../../services/reviews';
import { useCart } from '../cart';
import { SAMPLE_PRODUCTS } from './data/products';
import { ProductVariant } from './types';

export const ProductDetailsScreen: React.FC<
  RootStackScreenProps<'ProductDetails'>
> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { productId } = route.params;

  const product = useMemo(
    () => SAMPLE_PRODUCTS.find(p => p.id === productId),
    [productId],
  );

  // Default to the first available variant, or first variant in list
  const initialVariant = useMemo(() => {
    if (!product || product.variants.length === 0) {
      return undefined;
    }
    return product.variants.find(v => v.availableForSale) || product.variants[0];
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(initialVariant);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const { addToCart } = useCart();
  const currencySymbol = activeMerchant.currency.symbol;

  const [reviewsResponse, setReviewsResponse] = useState<ReviewsResponse>({
    status: 'loading',
  });

  useEffect(() => {
    let isMounted = true;

    // Feature flag check: If merchant disabled reviews, do not call mock service
    if (!activeMerchant.features.reviews) {
      setReviewsResponse(
        getUnavailableReviewsResponse(activeMerchant.storeName),
      );
      return;
    }

    setReviewsResponse({ status: 'loading' });
    getProductReviews(productId).then(res => {
      if (isMounted) {
        setReviewsResponse(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Consolidate available images (localImage or remote images array)
  const productImages: any[] = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images.map(uri => ({ uri }));
    }
    if (product.localImage) {
      return [product.localImage];
    }
    return [];
  }, [product]);

  // Handle product not found state
  if (!product) {
    return (
      <View
        style={[
          styles.notFoundContainer,
          {
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}>
        <Text
          style={[
            styles.notFoundTitle,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.heading,
            },
          ]}>
          Product Not Found
        </Text>
        <Text
          style={[
            styles.notFoundSubtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.body,
              marginTop: theme.spacing.small,
            },
          ]}>
          The requested item is no longer available in the catalog.
        </Text>
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: theme.colors.primary,
              marginTop: theme.spacing.large,
            },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}>
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.background },
            ]}>
            Return to Shop
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAtPrice = selectedVariant
    ? selectedVariant.compareAtPrice ?? product.compareAtPrice
    : product.compareAtPrice;

  const discountPercent =
    currentCompareAtPrice && currentCompareAtPrice > currentPrice
      ? Math.round(
          ((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100,
        )
      : null;

  const isCurrentSelectionAvailable =
    product.availableForSale && (selectedVariant?.availableForSale ?? false);

  const handleSelectVariant = (variant: ProductVariant) => {
    if (variant.availableForSale) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant && isCurrentSelectionAvailable) {
      const success = addToCart(product, selectedVariant);
      if (success) {
        setIsAddedFeedback(true);
        setTimeout(() => setIsAddedFeedback(false), 2000);
        navigation.navigate('Cart');
      }
    }
  };

  const activeImageSource =
    productImages.length > 0 ? productImages[activeImageIndex] : null;

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.medium,
            paddingTop: theme.spacing.medium,
            paddingBottom: insets.bottom + 90,
          },
        ]}>
        {/* 1. Large Fashion Hero Visual Container with 4:5 Aspect Ratio */}
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          {activeImageSource && !imageError ? (
            <Image
              source={activeImageSource}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.imageGlyphWrapper}>
              <Text
                style={[
                  styles.imageMonogram,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: 72,
                  },
                ]}>
                {product.category.charAt(0)}
              </Text>
              <Text
                style={[
                  styles.imageCategoryTag,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small,
                  },
                ]}>
                {product.category.toUpperCase()} COLLECTION
              </Text>
            </View>
          )}

          {/* Top Badges Overlay */}
          <View style={styles.badgeRow}>
            {!product.availableForSale ? (
              <View style={[styles.badge, { backgroundColor: '#111111' }]}>
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
                        : product.tag === 'NEW'
                        ? '#1B5E20'
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

            {discountPercent ? (
              <View style={[styles.badge, { backgroundColor: '#B3261E' }]}>
                <Text style={styles.badgeText}>SAVE {discountPercent}%</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Optional Multi-Image Thumbnail Row */}
        {productImages.length > 1 && (
          <View style={styles.galleryRow}>
            {productImages.map((src, idx) => {
              const isSelected = idx === activeImageIndex;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  style={[
                    styles.galleryThumbnail,
                    {
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                  activeOpacity={0.8}>
                  <Image
                    source={src}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 2. Product Details Section */}
        <View style={styles.detailsSection}>
          <Text
            style={[
              styles.categoryLabel,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.small - 1,
              },
            ]}>
            {product.category.toUpperCase()} • {activeMerchant.storeName.toUpperCase()}
          </Text>

          <Text
            style={[
              styles.productTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.title - 2,
              },
            ]}>
            {product.title}
          </Text>

          {/* Pricing Block */}
          <View style={styles.pricingRow}>
            <Text
              style={[
                styles.currentPrice,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.heading + 2,
                },
              ]}>
              {currencySymbol}
              {currentPrice.toFixed(2)}
            </Text>

            {currentCompareAtPrice && currentCompareAtPrice > currentPrice ? (
              <Text
                style={[
                  styles.comparePrice,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.body,
                  },
                ]}>
                {currencySymbol}
                {currentCompareAtPrice.toFixed(2)}
              </Text>
            ) : null}

            <View
              style={[
                styles.stockPill,
                {
                  backgroundColor: isCurrentSelectionAvailable
                    ? '#E6F4EA'
                    : '#FCE8E6',
                },
              ]}>
              <Text
                style={[
                  styles.stockPillText,
                  {
                    color: isCurrentSelectionAvailable ? '#137333' : '#C5221F',
                    fontSize: theme.typography.fontSize.small - 1,
                  },
                ]}>
                {isCurrentSelectionAvailable ? '● In Stock' : '● Unavailable'}
              </Text>
            </View>
          </View>

          {/* 3. Size / Variant Selector */}
          <View style={styles.selectorSection}>
            <View style={styles.selectorHeader}>
              <Text
                style={[
                  styles.selectorTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.body,
                  },
                ]}>
                SELECT SIZE
              </Text>
              {selectedVariant && (
                <Text
                  style={[
                    styles.selectedSizeLabel,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.small,
                    },
                  ]}>
                  Selected: {selectedVariant.title} ({selectedVariant.size})
                </Text>
              )}
            </View>

            <View style={styles.variantsRow}>
              {product.variants.map(variant => {
                const isSelected = selectedVariant?.id === variant.id;
                const isAvailable = variant.availableForSale;

                return (
                  <TouchableOpacity
                    key={variant.id}
                    disabled={!isAvailable}
                    onPress={() => handleSelectVariant(variant)}
                    style={[
                      styles.sizeChip,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.surface,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                        opacity: isAvailable ? 1 : 0.4,
                      },
                    ]}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                      disabled: !isAvailable,
                    }}
                    accessibilityLabel={`Size ${variant.size}, ${
                      isAvailable ? 'available' : 'unavailable'
                    }`}>
                    <Text
                      style={[
                        styles.sizeChipText,
                        {
                          color: isSelected
                            ? theme.colors.background
                            : isAvailable
                            ? theme.colors.text
                            : theme.colors.textSecondary,
                          textDecorationLine: isAvailable
                            ? 'none'
                            : 'line-through',
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: theme.typography.fontSize.body - 1,
                        },
                      ]}>
                      {variant.size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Product Description */}
          <View style={styles.descriptionSection}>
            <Text
              style={[
                styles.descriptionHeading,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.small,
                },
              ]}>
              DESCRIPTION
            </Text>
            <Text
              style={[
                styles.descriptionBody,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.body - 1,
                },
              ]}>
              {product.description}
            </Text>
          </View>

          {/* 5. Product Highlights / Specifications */}
          <View
            style={[
              styles.highlightsCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.highlightTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.small - 1,
                },
              ]}>
              SPECIFICATIONS & FIT
            </Text>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightBullet, { color: theme.colors.primary }]}>
                —
              </Text>
              <Text
                style={[
                  styles.highlightItem,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small,
                  },
                ]}>
                Athletic tapered silhouette designed for mobility
              </Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightBullet, { color: theme.colors.primary }]}>
                —
              </Text>
              <Text
                style={[
                  styles.highlightItem,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small,
                  },
                ]}>
                Breathable heat-regulation fabric blend
              </Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={[styles.highlightBullet, { color: theme.colors.primary }]}>
                —
              </Text>
              <Text
                style={[
                  styles.highlightItem,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.small,
                  },
                ]}>
                Standard {activeMerchant.storeName} warranty & easy 30-day returns
              </Text>
            </View>
          </View>

          {/* 6. Customer Reviews Section */}
          <View style={styles.reviewsSection}>
            <Text
              style={[
                styles.reviewsSectionTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.small,
                },
              ]}>
              CUSTOMER REVIEWS
            </Text>

            {reviewsResponse.status === 'loading' && (
              <View
                style={[
                  styles.reviewsLoadingCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text
                  style={[
                    styles.reviewsLoadingText,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.small,
                    },
                  ]}>
                  Loading customer reviews...
                </Text>
              </View>
            )}

            {reviewsResponse.status === 'unavailable' && (
              <View
                style={[
                  styles.reviewsUnavailableCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.unavailableBadge,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.small,
                    },
                  ]}>
                  Reviews Unavailable
                </Text>
                <Text
                  style={[
                    styles.unavailableMessage,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.small,
                    },
                  ]}>
                  {reviewsResponse.message ||
                    `Customer reviews are currently disabled for ${activeMerchant.storeName}.`}
                </Text>
              </View>
            )}

            {reviewsResponse.status === 'success' && reviewsResponse.data && (
              <View
                style={[
                  styles.reviewsCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                {/* Score & Summary */}
                <View
                  style={[
                    styles.reviewScoreBlock,
                    { borderBottomColor: theme.colors.border },
                  ]}>
                  <Text
                    style={[
                      styles.averageScoreText,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.title,
                      },
                    ]}>
                    {reviewsResponse.data.averageRating.toFixed(1)}
                  </Text>
                  <Text style={styles.starsGold}>★★★★★</Text>
                  <Text
                    style={[
                      styles.reviewCountLabel,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.small,
                      },
                    ]}>
                    Based on {reviewsResponse.data.reviewCount} verified reviews
                  </Text>
                </View>

                {/* Review Snippets */}
                {reviewsResponse.data.reviews.map((snippet, idx) => (
                  <View
                    key={snippet.id}
                    style={[
                      styles.snippetContainer,
                      idx > 0 && [
                        styles.snippetDivider,
                        { borderTopColor: theme.colors.border },
                      ],
                    ]}>
                    <View style={styles.snippetHeaderRow}>
                      <View style={styles.authorBadgeRow}>
                        <Text
                          style={[
                            styles.snippetAuthor,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.fontSize.small,
                            },
                          ]}>
                          {snippet.author}
                        </Text>
                        {snippet.verifiedBuyer && (
                          <View
                            style={[
                              styles.verifiedBadge,
                              { backgroundColor: theme.colors.primary },
                            ]}>
                            <Text
                              style={[
                                styles.verifiedBadgeText,
                                { color: theme.colors.background },
                              ]}>
                              VERIFIED
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.snippetDate,
                          {
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.fontSize.small - 2,
                          },
                        ]}>
                        {snippet.date}
                      </Text>
                    </View>

                    <Text style={styles.snippetRatingStars}>
                      {'★'.repeat(snippet.rating)}
                    </Text>

                    <Text
                      style={[
                        styles.snippetTitle,
                        {
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.body - 1,
                        },
                      ]}>
                      {snippet.title}
                    </Text>

                    <Text
                      style={[
                        styles.snippetComment,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.fontSize.small,
                        },
                      ]}>
                      {snippet.comment}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 7. Sticky Bottom Add To Cart Bar */}
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
            styles.addToCartButton,
            {
              backgroundColor: isCurrentSelectionAvailable
                ? theme.colors.primary
                : theme.colors.border,
            },
          ]}
          onPress={handleAddToCart}
          disabled={!isCurrentSelectionAvailable}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isCurrentSelectionAvailable }}
          accessibilityLabel={
            isCurrentSelectionAvailable
              ? `Add to Cart, ${currencySymbol}${currentPrice.toFixed(2)}`
              : 'Product Sold Out'
          }>
          <Text
            style={[
              styles.addToCartText,
              {
                color: isCurrentSelectionAvailable
                  ? theme.colors.background
                  : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.body,
              },
            ]}>
            {isAddedFeedback
              ? 'Added to Cart ✓'
              : isCurrentSelectionAvailable
              ? `Add to Cart • ${currencySymbol}${currentPrice.toFixed(2)}`
              : 'Sold Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 14,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGlyphWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageMonogram: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  imageCategoryTag: {
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 6,
  },
  badgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
    zIndex: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  galleryThumbnail: {
    width: 60,
    height: 75,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    marginTop: 18,
  },
  categoryLabel: {
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  productTitle: {
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  currentPrice: {
    fontWeight: '900',
  },
  comparePrice: {
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  stockPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockPillText: {
    fontWeight: '700',
  },
  selectorSection: {
    marginTop: 24,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectorTitle: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  selectedSizeLabel: {
    fontWeight: '600',
  },
  variantsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeChip: {
    minWidth: 56,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipText: {
    letterSpacing: 0.5,
  },
  descriptionSection: {
    marginTop: 24,
  },
  descriptionHeading: {
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  descriptionBody: {
    lineHeight: 22,
    fontWeight: '400',
  },
  highlightsCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  highlightTitle: {
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  highlightBullet: {
    fontWeight: '700',
    lineHeight: 18,
  },
  highlightItem: {
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  addToCartButton: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontWeight: '800',
  },
  notFoundSubtitle: {
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    fontWeight: '700',
  },
  reviewsSection: {
    marginTop: 26,
    marginBottom: 8,
  },
  reviewsSectionTitle: {
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  reviewsLoadingCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reviewsLoadingText: {
    fontWeight: '500',
  },
  reviewsUnavailableCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  unavailableBadge: {
    fontWeight: '700',
  },
  unavailableMessage: {
    lineHeight: 18,
  },
  reviewsCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  reviewScoreBlock: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 12,
    gap: 4,
  },
  averageScoreText: {
    fontWeight: '900',
  },
  starsGold: {
    color: '#E5A93C',
    fontSize: 18,
    letterSpacing: 2,
  },
  reviewCountLabel: {
    fontWeight: '500',
  },
  snippetContainer: {
    paddingVertical: 8,
  },
  snippetDivider: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  snippetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  snippetAuthor: {
    fontWeight: '700',
  },
  verifiedBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  snippetDate: {
    fontWeight: '500',
  },
  snippetRatingStars: {
    color: '#E5A93C',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 4,
  },
  snippetTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  snippetComment: {
    lineHeight: 18,
    fontWeight: '400',
  },
});
