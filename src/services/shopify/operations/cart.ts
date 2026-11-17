import { CART_FRAGMENT, CART_USER_ERROR_FRAGMENT } from './fragments';

/**
 * Mutation to create a new Shopify Cart with optional initial line items.
 */
export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
      warnings {
        code
        message
        target
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_USER_ERROR_FRAGMENT}
`;

/**
 * Mutation to add merchandise lines to an existing Shopify Cart.
 */
export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
      warnings {
        code
        message
        target
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_USER_ERROR_FRAGMENT}
`;

/**
 * Mutation to update quantities of lines in an existing Shopify Cart.
 */
export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
      warnings {
        code
        message
        target
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_USER_ERROR_FRAGMENT}
`;

/**
 * Mutation to remove lines from an existing Shopify Cart.
 */
export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
      warnings {
        code
        message
        target
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_USER_ERROR_FRAGMENT}
`;

/**
 * Query to retrieve an existing Shopify Cart by its GID.
 */
export const GET_CART_QUERY = /* GraphQL */ `
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;
