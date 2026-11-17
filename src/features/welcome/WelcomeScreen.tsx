import React from 'react';
import {
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

// High-resolution sportswear lifestyle editorial photography per merchant
const MERCHANT_HERO_IMAGES: Record<string, string> = {
  gymshark:
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
  urbanwear:
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
};

export const WelcomeScreen: React.FC<RootStackScreenProps<'Welcome'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    navigation.replace('Home');
  };

  const handleSkip = () => {
    navigation.replace('Home');
  };

  const heroImageUri =
    MERCHANT_HERO_IMAGES[activeMerchant.id] || MERCHANT_HERO_IMAGES.gymshark;

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop: Math.max(insets.top, 16) + 10,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            paddingHorizontal: 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* 1. Centered Header Bar without Skip Button */}
        <View style={styles.topBar}>
          <View style={styles.brandContainer}>
            <Text
              style={[
                styles.brandName,
                {
                  color: theme.colors.text,
                  fontSize: 18,
                },
              ]}>
              {activeMerchant.storeName.toUpperCase()}
            </Text>
            <View
              style={[
                styles.brandBadge,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.brandBadgeText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: 9,
                  },
                ]}>
                OFFICIAL STORE
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Expanded Hero Section */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Image
            source={{ uri: heroImageUri }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Editorial Overlay & Micro-copy */}
          <View style={styles.heroScrim}>
            <View style={styles.heroBadgeRow}>
              <View
                style={[
                  styles.collectionBadge,
                  { backgroundColor: theme.colors.primary },
                ]}>
                <Text
                  style={[
                    styles.collectionBadgeText,
                    { color: theme.colors.background },
                  ]}>
                  {activeMerchant.id === 'gymshark' ? 'CONDITIONING' : 'STREETWEAR'}
                </Text>
              </View>
              <Text style={styles.collectionYear}>
                SS26 • {activeMerchant.currency.code}
              </Text>
            </View>
            <Text style={styles.heroTagline}>
              {activeMerchant.id === 'gymshark'
                ? 'BUILT FOR PERFORMANCE'
                : 'ELEVATED EVERYDAY SILHOUETTES'}
            </Text>
          </View>
        </View>

        {/* 3. Introduction & Copy with Balanced Spacing */}
        <View style={styles.contentSection}>
          <Text
            style={[
              styles.welcomeHeadline,
              {
                color: theme.colors.text,
              },
            ]}>
            Step into {activeMerchant.storeName}
          </Text>
          <Text
            style={[
              styles.welcomeSubtitle,
              {
                color: theme.colors.textSecondary,
              },
            ]}>
            Discover performance activewear, seamless silhouettes, and an elevated mobile shopping experience crafted for your lifestyle.
          </Text>
        </View>

        {/* 4. Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={handleGetStarted}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Get Started">
            <Text
              style={[
                styles.primaryButtonText,
                {
                  color: theme.colors.background,
                },
              ]}>
              GET STARTED
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkip}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Explore catalog as guest">
            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              Explore as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  brandBadgeText: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroCard: {
    width: '100%',
    aspectRatio: 0.9,
    maxHeight: 460,
    minHeight: 280,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 6,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  collectionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
  },
  collectionBadgeText: {
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  collectionYear: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTagline: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14.5,
    letterSpacing: 1.2,
  },
  contentSection: {
    marginTop: 8,
    marginBottom: 10,
  },
  welcomeHeadline: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 33,
  },
  welcomeSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    marginTop: 6,
  },
  actionSection: {
    width: '100%',
    marginTop: 6,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 14,
  },
  secondaryButton: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  secondaryButtonText: {
    fontWeight: '600',
    letterSpacing: 0.3,
    fontSize: 13,
  },
});
