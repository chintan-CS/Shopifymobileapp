# Shopify Storefront API Integration & Production Checkout Guide

This document outlines how the **Shopify Store-to-Mobile App Platform** integrates with Shopify's Storefront API (GraphQL) in production, transitioning from the working local prototype to a live Shopify store.

---

## 1. Storefront API Endpoint & Versioning

All Storefront API operations use standard HTTP POST requests sending JSON-encoded GraphQL queries and mutations to the store's endpoint:

```
POST https://{store_domain}/api/2026-10/graphql.json
```

* **`store_domain`**: Sourced directly from `activeMerchant.shopifyDomain` (e.g. `gymshark-sample.myshopify.com` or `urbanwear-sample.myshopify.com`).
* **`api_version`**: Shopify releases quarterly API versions (e.g. `2026-10`). Always lock requests to a supported stable version.

### Required Request Headers

```http
Content-Type: application/json
X-Shopify-Storefront-Access-Token: {public_storefront_access_token}
```

---

## 2. Security & Credential Architecture

> [!IMPORTANT]
> **Zero Private Credentials in the Mobile Client**
> * **Private Storefront API Tokens & Admin API Keys**: Must **NEVER** be hardcoded, bundled, or committed into mobile app source code or client-side binaries. If admin capabilities or private app features are required, requests must route through a secure merchant backend or serverless gateway.
> * **Public Storefront Access Token**: Designed by Shopify specifically for client-side applications (mobile and web) to query public catalog data and manage buyer carts. It must only possess unauthenticated public read/cart write scopes.
> * **PCI-DSS Compliance**: The mobile application **never** captures, inputs, processes, or stores raw payment card numbers. All sensitive transaction details are processed within Shopify's Level 1 PCI-compliant checkout infrastructure.

---

## 3. Data Mapping: Shopify GraphQL to React Native Models

The GraphQL operations defined in `src/services/shopify/operations/` map cleanly to the app's existing TypeScript models in `src/features/catalog/types.ts`:

| Existing App Field | Shopify Storefront API Field | Transformation / Source |
| :--- | :--- | :--- |
| `Product.id` | `Product.id` | Global ID (GID), e.g. `gid://shopify/Product/12345` |
| `Product.title` | `Product.title` | Direct string |
| `Product.description` | `Product.description` | Sanitized plain-text description |
| `Product.category` | `Product.productType` | e.g. `Men`, `Women`, `Accessories` |
| `Product.price` | `priceRange.minVariantPrice.amount` | `parseFloat(amount)` |
| `Product.compareAtPrice` | `compareAtPriceRange.minVariantPrice.amount` | Optional `parseFloat(amount)` |
| `Product.availableForSale` | `Product.availableForSale` | Boolean |
| `ProductVariant.id` | `ProductVariant.id` | Variant GID, e.g. `gid://shopify/ProductVariant/67890` |
| `ProductVariant.title` | `ProductVariant.title` | e.g. `Medium` |
| `ProductVariant.size` | `selectedOptions[name="Size"].value` | Size option value |
| `ProductVariant.price` | `ProductVariant.price.amount` | `parseFloat(amount)` |
| `ProductVariant.availableForSale`| `ProductVariant.availableForSale` | Boolean inventory availability |

---

## 4. Production Cart Synchronization

In production, local in-memory cart operations transition to server-synchronized Storefront API Cart mutations:

```
User Action (Add to Cart)
           │
           ├─ First Item Added?
           │     ├─► Execute `cartCreate(input: { lines: [...] })`
           │     └─► Store returned `cart.id` and `cart.checkoutUrl` in AsyncStorage
           │
           └─ Subsequent Add / Update / Remove?
                 ├─► Add: `cartLinesAdd(cartId, lines)`
                 ├─► Update: `cartLinesUpdate(cartId, lines)`
                 └─► Remove: `cartLinesRemove(cartId, lineIds)`
```

### Guest Cart Persistence Strategy
1. **Cart ID Storage**: The Shopify `cartId` is stored in `@react-native-async-storage/async-storage` under a key such as `@shopify_mobile_app/shopify_cart_id`.
2. **Session Rehydration**: On application cold start, the app queries `cart(id: $cartId)` via `GET_CART_QUERY`.
3. **Stale/Expired Cart Recovery**: If the query returns `null` or an expired cart error, the app gracefully purges the stored `cartId` and generates a fresh cart on the next user action without blocking the buyer.
4. **Buyer Identity**: For logged-in customers, the cart is linked using the `cartBuyerIdentityUpdate` mutation with a customer access token.

---

## 5. Production Checkout Workflow

Shopify Storefront API implements hosted web checkout to provide optimal security, compliance, localization, and high-converting payment options:

```
Mobile App (CartScreen)
      │
      ├─ 1. User taps "Checkout"
      │
      ├─ 2. App retrieves `checkoutUrl` from current active Shopify Cart
      │
      ├─ 3. App launches URL in an In-App Browser or System Browser:
      │      Linking.openURL(checkoutUrl) or InAppBrowser.open(checkoutUrl)
      │
      ├─ 4. Hosted Shopify Checkout handles:
      │      • Address auto-completion & shipping rate calculation
      │      • Localized taxes & currency conversion
      │      • Payment methods (Shop Pay, Apple Pay, Google Pay, Credit/Debit)
      │      • Fraud analysis & order confirmation
      │
      └─ 5. Buyer Completes Purchase:
             Redirect back to mobile app via registered Universal Link / Deep Link
             (e.g. `shopifymobileapp://order-complete?order_id=...`)
```

---

## 6. Official Shopify Storefront API Documentation

* [Shopify Storefront API Overview](https://shopify.dev/docs/api/storefront/latest)
* [Products Query Reference](https://shopify.dev/docs/api/storefront/latest/queries/products)
* [cartCreate Mutation Reference](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)
* [cartLinesAdd Mutation Reference](https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesAdd)
* [cartLinesUpdate Mutation Reference](https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesUpdate)
* [cartLinesRemove Mutation Reference](https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesRemove)
