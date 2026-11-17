import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { useCart } from '../cart';
import { ProductCard } from './components/ProductCard';
import {
  CatalogResponseStatus,
  fetchCatalogProducts,
} from './services';
import { Product } from './types';

const CATEGORIES = ['All', 'Men', 'Women', 'Accessories'];

export const HomeScreen: React.FC<RootStackScreenProps<'Home'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { totalCount } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<CatalogResponseStatus | 'loading'>(
    'loading',
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadProducts = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh === true) {
      setIsRefreshing(true);
    } else {
      setStatus('loading');
    }
    setErrorMessage(null);

    const response = await fetchCatalogProducts();

    if (response.status === 'success') {
      setProducts(response.data);
      setStatus('success');
    } else if (response.status === 'empty') {
      setProducts([]);
      setStatus('empty');
    } else {
      setProducts([]);
      setErrorMessage(
        response.errorMessage || 'An error occurred while loading the catalog.',
      );
      setStatus('error');
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(item => item.category === selectedCategory);
  }, [products, selectedCategory]);

  // Prevent the last odd item from stretching across the full screen
  const gridData = useMemo(() => {
    if (filteredProducts.length % 2 === 0) {
      return filteredProducts;
    }
    return [
      ...filteredProducts,
      { id: '__grid_spacer__', isSpacer: true } as unknown as Product,
    ];
  }, [filteredProducts]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Welcoming Collection Heading */}
      <View style={styles.heroBanner}>
        <Text
          style={[
            styles.collectionSubtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.small,
            },
          ]}>
          CURATED ACTIVEWEAR & ESSENTIALS
        </Text>
        <Text
          style={[
            styles.collectionTitle,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.title,
            },
          ]}>
          New Season Drops
        </Text>
      </View>

      {/* Horizontal Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.categoriesContainer,
          { gap: theme.spacing.small },
        ]}>
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${category}`}>
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color: isSelected
                      ? theme.colors.background
                      : theme.colors.text,
                    fontSize: theme.typography.fontSize.small,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderCategoryEmpty = () => (
    <View style={styles.centeredContainer}>
      <Text
        style={[
          styles.stateTitle,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.heading,
          },
        ]}>
        No Products Found
      </Text>
      <Text
        style={[
          styles.stateSubtitle,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.body,
            marginTop: theme.spacing.small,
          },
        ]}>
        No items available under "{selectedCategory}".
      </Text>
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: theme.colors.primary,
            marginTop: theme.spacing.medium,
          },
        ]}
        onPress={() => setSelectedCategory('All')}
        activeOpacity={0.85}>
        <Text
          style={[
            styles.actionButtonText,
            { color: theme.colors.background },
          ]}>
          View All Products
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: theme.colors.background,
          paddingTop: Math.max(insets.top, theme.spacing.small),
        },
      ]}>
      {/* Top Header Bar with Store Branding and Cart Trigger */}
      <View
        style={[
          styles.topBar,
          {
            paddingHorizontal: theme.spacing.medium,
            paddingBottom: theme.spacing.small,
            borderBottomColor: theme.colors.border,
          },
        ]}>
        <View style={styles.brandTitleContainer}>
          <Text
            style={[
              styles.brandTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.heading,
              },
            ]}>
            {activeMerchant.storeName.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.brandSubtext,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.small - 2,
              },
            ]}>
            {activeMerchant.currency.code} STORE
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.cartButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={handleCartPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open shopping cart">
          <Text
            style={[
              styles.cartButtonText,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.small,
              },
            ]}>
            CART
          </Text>
          <View
            style={[
              styles.cartBadge,
              { backgroundColor: theme.colors.primary },
            ]}>
            <Text
              style={[
                styles.cartBadgeText,
                { color: theme.colors.background },
              ]}>
              {totalCount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Catalog Body with Full States */}
      {status === 'loading' && (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.stateSubtitle,
              {
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.medium,
                fontSize: theme.typography.fontSize.body,
              },
            ]}>
            Loading {activeMerchant.storeName} catalog...
          </Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.centeredContainer}>
          <View
            style={[
              styles.stateIconCircle,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.stateIconText,
                { color: theme.colors.text, fontWeight: '900' },
              ]}>
              !
            </Text>
          </View>
          <Text
            style={[
              styles.stateTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.heading,
              },
            ]}>
            Unable to Load Catalog
          </Text>
          <Text
            style={[
              styles.stateSubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.body,
                marginTop: theme.spacing.small,
              },
            ]}>
            {errorMessage ||
              'A connection error occurred while loading products.'}
          </Text>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.primary,
                marginTop: theme.spacing.large,
              },
            ]}
            onPress={() => loadProducts()}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Retry loading catalog">
            <Text
              style={[
                styles.actionButtonText,
                { color: theme.colors.background },
              ]}>
              Retry Connection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'empty' && (
        <View style={styles.centeredContainer}>
          <View
            style={[
              styles.stateIconCircle,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.stateIconText,
                { color: theme.colors.textSecondary, fontWeight: '900' },
              ]}>
              0
            </Text>
          </View>
          <Text
            style={[
              styles.stateTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.heading,
              },
            ]}>
            No Products Available
          </Text>
          <Text
            style={[
              styles.stateSubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.body,
                marginTop: theme.spacing.small,
              },
            ]}>
            Catalog inventory is currently empty for {activeMerchant.storeName}. Please check back later.
          </Text>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 1,
                marginTop: theme.spacing.large,
              },
            ]}
            onPress={() => loadProducts()}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Refresh catalog">
            <Text
              style={[
                styles.actionButtonText,
                { color: theme.colors.text },
              ]}>
              Refresh Catalog
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'success' && (
        <FlatList
          data={gridData}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={[
            styles.columnWrapper,
            { gap: theme.spacing.medium },
          ]}
          contentContainerStyle={[
            styles.gridContent,
            {
              paddingHorizontal: theme.spacing.medium,
              paddingBottom: Math.max(insets.bottom, theme.spacing.large),
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderCategoryEmpty}
          refreshing={isRefreshing}
          onRefresh={() => loadProducts(true)}
          renderItem={({ item }) => {
            if ((item as any).isSpacer) {
              return <View style={styles.cardSpacer} pointerEvents="none" />;
            }
            return (
              <ProductCard
                product={item}
                currencySymbol={activeMerchant.currency.symbol}
                onPress={handleProductPress}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  brandTitleContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandSubtext: {
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 1,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  cartButtonText: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  cartBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  headerContent: {
    paddingVertical: 16,
  },
  heroBanner: {
    marginBottom: 16,
  },
  collectionSubtitle: {
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  collectionTitle: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  categoriesContainer: {
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    letterSpacing: 0.5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardSpacer: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  gridContent: {
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateIconText: {
    fontSize: 32,
  },
  stateTitle: {
    fontWeight: '800',
    textAlign: 'center',
  },
  stateSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    fontWeight: '700',
  },
});
