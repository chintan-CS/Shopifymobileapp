import { PRODUCT_CARD_FRAGMENT, PRODUCT_VARIANT_FRAGMENT } from './fragments';

/**
 * GraphQL query to fetch a paginated list of products for the catalog.
 */
export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...ProductCardFragment
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

/**
 * GraphQL query to fetch product details using its unique Shopify product handle.
 */
export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      productType
      tags
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 50) {
        edges {
          node {
            ...ProductVariantFragment
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

/**
 * GraphQL query to fetch product details using its unique Shopify GID.
 */
export const GET_PRODUCT_BY_ID_QUERY = /* GraphQL */ `
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      availableForSale
      productType
      featuredImage {
        url
        altText
      }
      variants(first: 50) {
        edges {
          node {
            ...ProductVariantFragment
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;
