# Shopify Store-to-Mobile App Platform

A modular, multi-merchant React Native mobile application demonstrating an e-commerce shopping experience inspired by modern sportswear brands (such as Gymshark). Built with TypeScript and React Native CLI, this project features a configurable theme system, persistent cart management, simulated third-party integrations, and prepared Shopify Storefront API GraphQL operation documents.

---

## 1. Project Overview

This application serves as a production-ready mobile architectural foundation for merchants seeking to transform their Shopify web stores into native mobile apps. It delivers:

* **Multi-Merchant Architecture**: Switch between distinct merchant profiles (e.g., **Gymshark** and **UrbanWear**) with different branding, color palettes, currencies, and feature flags via a single configuration flag.
* **Sportswear E-Commerce UI**: A visual design featuring editorial hero imagery, 3:4 portrait product cards, 4:5 detail views, size chips, and custom modals with zero emoji dependencies.
* **Offline-First Persistent Cart**: React Context-driven cart state backed by `@react-native-async-storage/async-storage` with cold-start hydration guards.
* **Lifecycle State Handling**: Asynchronous service architectures for the catalog and product reviews covering Loading, Success, Error/Retry, and Empty/Disabled states.
* **Shopify Storefront API Preparation**: Typed GraphQL operation documents for catalog queries and Cart API mutations adhering to the modern `2026-10` Storefront API specification.

> [!NOTE]
> This repository is a client-side mobile architectural implementation and practical assignment demonstration. It does not connect to a live Shopify backend, process real payments, or execute live network calls.

---

## 2. Key Features

* **Branded Welcome & Onboarding**: Dynamic hero lifestyle photography, official store badging, merchant value propositions, and navigation (`Get Started` / `Skip`).
* **Curated Product Catalog**:
  * Horizontal category filtering (`All`, `Men`, `Women`, `Accessories`).
  * Two-column grid with dynamic row-balancing spacers to prevent odd-numbered items from stretching horizontally.
  * Portrait product cards with status tags (`NEW`, `SALE`, `BESTSELLER`, `SOLD OUT`), compare-at pricing, and stock dots.
* **Product Details & Variant Selection**:
  * High-resolution 4:5 portrait hero image matching the catalog card.
  * Synchronized size selector (e.g., XS, S, M, L, XL) enforcing inventory rules: out-of-stock sizes are disabled with strikethrough styling and cannot be added to cart.
  * Detailed specifications and fit section with themed surfaces.
  * Sticky bottom action bar displaying the dynamic variant price and tap feedback (`Added to Cart ✓`).
* **Feature-Flagged Product Reviews**:
  * Simulated third-party reviews provider (e.g., Yotpo, Judge.me, Okendo).
  * Automatically respects merchant configuration: enabled for Gymshark (shows ratings, verified buyer snippets), disabled for UrbanWear (shows themed unavailable state).
* **Persistent Shopping Cart**:
  * Shared global cart state accessible across all screens.
  * Line item separation for distinct variants; quantity aggregation for matching variants.
  * In-line quantity adjustment (`−` / `+`), item removal, and "Clear Bag" capability.
  * Dynamic Order Summary calculating item count, subtotal, and shipping notices.
* **In-App Shopify Hosted Checkout Modal**:
  * Replaces generic OS alerts with a themed in-app modal explaining the production hosted checkout redirect architecture.
* **Adaptive Status Bar & Insets**:
  * Automatically calculates perceptual luminance (ITU-R BT.601) to ensure dark icons on light surfaces across both Gymshark (`#FFFFFF`) and UrbanWear (`#F8F5F0`).
  * Strict safe-area inset handling across notches and Android gesture bars.

---

## 3. Technology Stack

* **Core Framework**: React Native `0.88.1` / React `19.3.0`
* **Language**: TypeScript `6.0.3` (Strict type checking)
* **Navigation**:
  * `@react-navigation/native` `^7.5.2`
  * `@react-navigation/native-stack` `^7.21.1`
  * `react-native-screens` `^4.30.1`
* **Safe Area Handling**: `react-native-safe-area-context` `^5.5.2`
* **Persistence**: `@react-native-async-storage/async-storage` `^3.1.1`
* **Build System**: React Native Community CLI `20.2.0` with Metro bundler

---

## 4. Project Structure

```
ShopifyMobileApp/
├── App.tsx                          # Application root: providers, baseline StatusBar, NavigationContainer
├── package.json                     # Dependencies, scripts, and engine constraints
├── docs/
│   └── shopify-storefront-integration.md # Architecture documentation for Storefront API integration
└── src/
    ├── assets/
    │   └── products/                # Bundled local high-resolution sportswear photography
    │       ├── cap.jpg
    │       ├── croptop.jpg
    │       ├── duffle.jpg
    │       ├── hoodie.jpg
    │       ├── leggings.jpg
    │       ├── tshirt.jpg
    │       ├── windbreaker.jpg
    │       └── index.ts             # Static require() map (PRODUCT_IMAGES)
    ├── config/
    │   ├── activeMerchant.ts        # ACTIVE_MERCHANT_ID switcher ('gymshark' | 'urbanwear')
    │   ├── index.ts                 # Config exports
    │   ├── merchant.types.ts        # MerchantConfig, Branding, Currency, and FeatureFlag types
    │   └── merchants/
    │       ├── gymshark.ts          # Gymshark merchant profile (Monochrome, reviews enabled)
    │       ├── index.ts             # Registry mapping (MERCHANTS)
    │       └── urbanwear.ts         # UrbanWear merchant profile (Beige/brown, reviews disabled)
    ├── features/
    │   ├── cart/
    │   │   ├── CartScreen.tsx       # Shopping cart view, order summary, and checkout modal
    │   │   ├── context/
    │   │   │   └── CartContext.tsx  # CartProvider: persistence, hydration guards, item reducers
    │   │   ├── index.ts
    │   │   └── types.ts             # CartItem and CartContextType interfaces
    │   ├── catalog/
    │   │   ├── HomeScreen.tsx       # Product grid, category filters, empty/error/loading states
    │   │   ├── ProductDetailsScreen.tsx # Hero visual, size selection, specifications, reviews
    │   │   ├── components/
    │   │   │   └── ProductCard.tsx  # 3:4 portrait product card component
    │   │   ├── data/
    │   │   │   └── products.ts      # Sample catalog dataset (SAMPLE_PRODUCTS)
    │   │   ├── services/
    │   │   │   ├── catalogService.ts# Async catalog service with mock mode controls
    │   │   │   ├── index.ts
    │   │   │   └── types.ts         # Catalog response types
    │   │   ├── index.ts
    │   │   └── types.ts             # Product and ProductVariant models
    │   └── welcome/
    │       ├── WelcomeScreen.tsx    # Onboarding view with editorial photography and Skip
    │       └── index.ts
    ├── navigation/
    │   ├── index.ts
    │   ├── navigationTheme.ts       # React Navigation Theme mapped from activeMerchant
    │   ├── RootNavigator.tsx        # NativeStack navigator with status bar style options
    │   └── types.ts                 # RootStackParamList and screen prop types
    ├── services/
    │   ├── reviews/
    │   │   ├── index.ts
    │   │   ├── reviewsService.ts    # Async third-party review provider simulation
    │   │   └── types.ts             # Review, ProductReviewData, and ReviewsResponse types
    │   └── shopify/
    │       └── operations/          # Prepared Storefront API GraphQL operation documents
    │           ├── cart.ts          # cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove
    │           ├── fragments.ts     # Core product, image, and variant GraphQL fragments
    │           ├── index.ts
    │           └── products.ts      # Paginated product queries and handle lookups
    └── theme/
        ├── index.ts
        ├── theme.ts                 # Dynamic createTheme(), luminance checker (isColorDark)
        └── theme.types.ts           # AppTheme, ThemeColors, ThemeSpacing, ThemeTypography
```

---

## 5. Prerequisites

Before running the application, ensure the development environment meets the following requirements:

* **Node.js**: `>= 22.11.0` (as defined in `package.json`)
* **Package Manager**: `npm` (v10+)
* **Java Development Kit (JDK)**: JDK 17 (recommended for React Native 0.88 / Android Gradle Plugin 8.x)
* **Android Development**:
  * Android Studio with Android SDK Platform 34 or 35
  * Android SDK Build-Tools and Command-line Tools installed
  * `ANDROID_HOME` configured in environment variables
  * Android Virtual Device (AVD) or physical device with USB debugging enabled
* **iOS Development** (macOS only):
  * macOS with Xcode 16+
  * CocoaPods (`gem install cocoapods` or `bundle install`)

---

## 6. Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ShopifyMobileApp
   ```

2. **Install JavaScript dependencies**:
   ```bash
   npm install
   ```

3. **Verify Metro configuration**:
   Ensure Metro starts cleanly:
   ```bash
   npm start
   ```

---

## 7. Running on Android

1. **Start an Android Emulator** via Android Studio AVD Manager, or connect a physical Android device via USB.
2. **Start the Metro bundler** in a dedicated terminal:
   ```bash
   npm start
   ```
3. **Build and launch the Android application**:
   ```bash
   npm run android
   ```
   *Alternative CLI command*:
   ```bash
   npx react-native run-android
   ```

---

## 8. Running on iOS

> [!IMPORTANT]
> Running the application on iOS requires **macOS** and **Xcode**. It cannot be built on Windows.

1. **Install CocoaPods dependencies**:
   ```bash
   cd ios
   pod install
   cd ..
   ```
   *(Or using Bundler if configured: `bundle exec pod install`)*

2. **Start the Metro bundler**:
   ```bash
   npm start
   ```

3. **Build and launch on iOS Simulator**:
   ```bash
   npm run ios
   ```
   *Alternative CLI command*:
   ```bash
   npx react-native run-ios
   ```

---

## 9. Merchant Configuration

The project features a decoupled configuration architecture where all branding, typography, currencies, and feature flags are separated from UI components.

### Available Merchant Profiles

| Configuration Property | Gymshark (`gymshark`) | UrbanWear (`urbanwear`) |
| :--- | :--- | :--- |
| **Store Name** | `Gymshark` | `UrbanWear` |
| **App Display Name** | `Gymshark Mobile` | `UrbanWear Fashion` |
| **Shopify Domain** | `gymshark-sample.myshopify.com` | `urbanwear-sample.myshopify.com` |
| **Currency** | `USD` (`$`) | `USD` (`$`) |
| **Primary Color** | `#000000` (Monochrome Black) | `#2D2825` (Deep Espresso Brown) |
| **Background Color** | `#FFFFFF` (Pure White) | `#F8F5F0` (Warm Sand Beige) |
| **Surface Color** | `#F5F5F5` (Light Gray) | `#EDE8E0` (Subtle Beige Surface) |
| **Text Primary** | `#111111` (Deep Charcoal) | `#211D1A` (Dark Warm Charcoal) |
| **Border Color** | `#E0E0E0` | `#DED8CE` |
| **Feature: Reviews** | `true` (Enabled) | `false` (Disabled) |
| **Feature: Loyalty** | `false` | `true` |

### How to Switch the Active Merchant

Open [src/config/activeMerchant.ts](file:///c:/Users/chint/OneDrive/Desktop/ShopifyMobileApp/src/config/activeMerchant.ts#L8) and change `ACTIVE_MERCHANT_ID`:

```typescript
// To activate Gymshark:
export const ACTIVE_MERCHANT_ID: MerchantId = 'gymshark';

// To activate UrbanWear:
// export const ACTIVE_MERCHANT_ID: MerchantId = 'urbanwear';
```

Save the file and reload the application (`r` in Metro console). The entire theme, status bar brightness, header copy, currency formatting, and reviews visibility will update immediately without modifying any screen files.

---

## 10. Mock Services

### Catalog Service (`catalogService.ts`)

Located in `src/features/catalog/services/catalogService.ts`, this asynchronous service simulates network requests to Shopify's catalog API with simulated network latency (450ms).

It supports three test modes via `CATALOG_MOCK_MODE`:

1. **`success`** (Default): Returns all 7 sample sportswear products with complete variant trees and local image assets.
2. **`empty`**: Returns an empty array (`[]`). The Home screen renders the "No Products Available" empty state with a "Refresh Catalog" button.
3. **`error`**: Simulates a network failure. The Home screen renders the "Unable to Load Catalog" error view with a "Retry Connection" button.

#### Changing the Catalog Mode Programmatically
```typescript
import { setCatalogMockMode } from './src/features/catalog/services';

// Test empty state:
setCatalogMockMode('empty');

// Test error/retry state:
setCatalogMockMode('error');

// Restore normal catalog:
setCatalogMockMode('success');
```

### Reviews Service (`reviewsService.ts`)

Located in `src/services/reviews/reviewsService.ts`, this service simulates a third-party product reviews integration (such as Yotpo or Okendo).

1. **Loading State**: When `ProductDetailsScreen` mounts, an `ActivityIndicator` displays while simulated network latency (350ms) resolves.
2. **Success State**: When active for Gymshark (`activeMerchant.features.reviews = true`), returns an average rating, total review count, and verified buyer review snippets.
3. **Unavailable State**: When active for UrbanWear (`activeMerchant.features.reviews = false`), the screen skips the API call and immediately displays a themed "Reviews Unavailable" card communicating that reviews are disabled for this store.

---

## 11. Cart Persistence

The shopping cart is implemented using React Context (`src/features/cart/context/CartContext.tsx`) and backed by `@react-native-async-storage/async-storage` under storage key `@shopify_mobile_app/cart`.

### Persistence Lifecycle & Protection

1. **Cold-Start Hydration**: On mount, an asynchronous effect reads stored JSON from storage. While loading, `isCartLoaded` remains `false`.
2. **Hydration Protection Guard**:
   ```typescript
   if (!isCartLoaded) {
     return; // Prevents writing initial empty state [] over stored items
   }
   ```
   This guard ensures stored cart items are never accidentally wiped on app startup.
3. **Automatic Serialization**: Whenever cart items change after hydration, they are serialized to storage.
4. **Distinct Variant Grouping**:
   * Adding the same product with the same size/variant increments the existing line item's `quantity`.
   * Adding the same product with a different size creates a distinct line item.
5. **Inventory Protection**: Items cannot be added to cart if either `product.availableForSale` or `variant.availableForSale` is `false`.

---

## 12. Shopify Storefront GraphQL Operations

The project includes structured GraphQL operation documents in `src/services/shopify/operations/` aligned with the modern Shopify Storefront API (`2026-10` release).

> [!IMPORTANT]
> These GraphQL documents are prepared architectural assets ready for production integration. They are **not connected to a live Shopify store** in this prototype.

### Included Operations

* **Fragments** (`fragments.ts`):
  * `IMAGE_FRAGMENT`: Featured image URL, width, height, and alt text.
  * `VARIANT_FRAGMENT`: Variant ID, title, SKU, price, compareAtPrice, availability, and selected options (`Size`).
  * `PRODUCT_FRAGMENT`: Product ID, title, description, handle, tags, price ranges, and variants.
* **Catalog Queries** (`products.ts`):
  * `GET_PRODUCTS_QUERY`: Paginated product query (`products(first: $first, after: $after)`).
  * `GET_PRODUCT_BY_HANDLE_QUERY`: Individual product query by handle for details navigation.
* **Cart API Mutations** (`cart.ts`):
  * `CART_CREATE_MUTATION`: Initializes a cart with lines and buyer identity.
  * `CART_LINES_ADD_MUTATION`: Adds merchandise lines using variant IDs.
  * `CART_LINES_UPDATE_MUTATION`: Updates quantities on existing cart lines.
  * `CART_LINES_REMOVE_MUTATION`: Removes specific lines by line ID.

For complete field mappings and architecture details, see [docs/shopify-storefront-integration.md](file:///c:/Users/chint/OneDrive/Desktop/ShopifyMobileApp/docs/shopify-storefront-integration.md).

---

## 13. Checkout Implementation

### Current Prototype State
In this practical assignment, tapping the **Checkout** button in `CartScreen` triggers an in-app custom `Modal` designed with the merchant theme. It clearly communicates:

> *"Production checkout connects to the Shopify Storefront API to create a secure checkout session. Customers are redirected to Shopify's hosted checkout to complete their purchase."*

### Proposed Production Architecture (Shopify Hosted Checkout)

In a live production deployment, checkout executes via Shopify's hosted web checkout flow:

```
[Mobile App: CartScreen]
       │
       ▼ (1) Executes CART_CREATE_MUTATION or CART_LINES_ADD_MUTATION via Storefront API
[Shopify Storefront API]
       │
       ▼ (2) Returns Cart object containing secure `checkoutUrl`
[Mobile Client]
       │
       ▼ (3) Opens `checkoutUrl` via In-App Browser (Chrome Custom Tabs / ASWebAuthenticationSession)
[Shopify Hosted Checkout Webview]
       │  • Handles Shipping Address, Rate Calculation, Taxes, Discounts
       │  • PCI-DSS Compliant Payment (Shop Pay, Credit Cards, Apple Pay, Google Pay)
       │  • Order Processing & Confirmation
       ▼ (4) Redirects to custom completion deep link: `shopifymobileapp://checkout/complete?order_id=...`
[Mobile Client: Deep Link Handler]
       │
       ▼ (5) Clears local AsyncStorage cart and displays native Order Confirmation screen
```

* **PCI Compliance**: The mobile app never handles, processes, or stores raw payment card numbers. All payments are executed within Shopify's Level 1 PCI-compliant web checkout.
* **No `checkoutCreate`**: The implementation uses the modern `Cart API` (`cartCreate`, `checkoutUrl`) rather than deprecated Checkout APIs.

---

## 14. Testing Notes and Limitations

* **Platform Coverage**: Developed and verified on Android (API 34/35). iOS-compatible code and dependencies are in place, but iOS builds require macOS and Xcode.
* **Mock Data**: Catalog items are read from `SAMPLE_PRODUCTS` (`src/features/catalog/data/products.ts`) with bundled local images (`src/assets/products/`).
* **No Live Backend**: No live network traffic is sent to Shopify endpoints.
* **Authentication**: Customer login, register, and Multipass SSO are not implemented in this client-side prototype.
* **Manual Verification Checklist**:
  1. *Theme Switching*: Change `ACTIVE_MERCHANT_ID` in `activeMerchant.ts` and verify colors and reviews toggle.
  2. *Grid Stability*: Verify that the 7th item in the Home catalog renders at standard half-width without stretching across the row.
  3. *Size Selection*: Open `Apex Seamless T-Shirt`, verify size `XL` is marked out of stock and cannot be added to cart.
  4. *Cart Persistence*: Add an item to the cart, adjust quantity, reload the app (`r`), and verify items persist.
  5. *Checkout Modal*: Tap `Checkout` in Cart, verify the in-app modal opens, and dismiss via backdrop tap, button, or Android back button.

---

## 15. Production Integration Roadmap

To transition this mobile platform into a live store application, follow these next implementation phases:

1. **Live Storefront API Connection**:
   * Add public Storefront access tokens to `MerchantConfig`.
   * Create an Apollo Client or lightweight `fetch` client executing the prepared operations in `src/services/shopify/operations/`.
2. **In-App Browser Checkout**:
   * Install `react-native-inappbrowser-reborn`.
   * Integrate deep link scheme (`shopifymobileapp://`) in `AndroidManifest.xml` and iOS `Info.plist` to capture the return redirect from `checkoutUrl`.
3. **Customer Accounts API**:
   * Implement Shopify Customer Account API (OAuth / Multipass) for order history, saved addresses, and profile management.
4. **Live Reviews Integration**:
   * Connect actual REST or GraphQL endpoints for third-party review platforms (Yotpo / Judge.me / Okendo) using the existing `ReviewsResponse` interface.
5. **Push Notifications**:
   * Integrate Firebase Cloud Messaging (FCM) / Apple Push Notification Service (APNs) for order tracking updates and new season drop alerts.
