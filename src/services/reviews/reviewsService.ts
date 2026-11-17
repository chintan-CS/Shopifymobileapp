import { ProductReviewsData, ReviewsResponse } from './types';

const MOCK_REVIEWS_MAP: Record<string, ProductReviewsData> = {
  prod_1: {
    averageRating: 4.8,
    reviewCount: 142,
    reviews: [
      {
        id: 'rev_1_1',
        author: 'Marcus K.',
        rating: 5,
        date: '2 days ago',
        title: 'Incredible fit and breathability',
        comment:
          'The seamless taper fits athletic builds perfectly. Stays dry and odor-free even during intense training sessions.',
        verifiedBuyer: true,
      },
      {
        id: 'rev_1_2',
        author: 'Alex D.',
        rating: 5,
        date: '1 week ago',
        title: 'Great quality and durable',
        comment:
          'Holds up great in the wash without pilling or shrinking. Highly recommend picking your true size.',
        verifiedBuyer: true,
      },
    ],
  },
  prod_2: {
    averageRating: 4.9,
    reviewCount: 218,
    reviews: [
      {
        id: 'rev_2_1',
        author: 'Chloe M.',
        rating: 5,
        date: 'Yesterday',
        title: 'Best high-waisted leggings ever',
        comment:
          'Compacts without feeling constrictive. Squat proof and the waistband does not roll down at all.',
        verifiedBuyer: true,
      },
      {
        id: 'rev_2_2',
        author: 'Sarah L.',
        rating: 5,
        date: '4 days ago',
        title: 'Super flattering silhouette',
        comment:
          'Soft ribbed fabric that hugs in all the right places. Buying a second pair right now!',
        verifiedBuyer: true,
      },
    ],
  },
  prod_3: {
    averageRating: 4.7,
    reviewCount: 89,
    reviews: [
      {
        id: 'rev_3_1',
        author: 'David H.',
        rating: 5,
        date: '3 days ago',
        title: 'Heavyweight perfection',
        comment:
          'Substantial 460gsm terry feel. Dropped shoulders give it that luxury streetwear aesthetic.',
        verifiedBuyer: true,
      },
    ],
  },
};

/**
 * Simulates an asynchronous third-party reviews provider API (e.g. Yotpo, Judge.me, Okendo).
 */
export const getProductReviews = async (
  productId: string,
): Promise<ReviewsResponse> => {
  try {
    // Simulate brief network latency
    await new Promise<void>(resolve => setTimeout(resolve, 350));

    const productReviews = MOCK_REVIEWS_MAP[productId] || {
      averageRating: 4.7,
      reviewCount: 46,
      reviews: [
        {
          id: `rev_${productId}_gen_1`,
          author: 'Jordan T.',
          rating: 5,
          date: '5 days ago',
          title: 'Top tier quality & comfort',
          comment:
            'Crafted with premium materials and attention to detail. Fit is exactly as described.',
          verifiedBuyer: true,
        },
        {
          id: `rev_${productId}_gen_2`,
          author: 'Sam R.',
          rating: 4,
          date: '2 weeks ago',
          title: 'Very satisfied with the purchase',
          comment:
            'Feels great on skin and looks sharp for both active sessions and casual outings.',
          verifiedBuyer: true,
        },
      ],
    };

    return {
      status: 'success',
      data: productReviews,
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Failed to fetch reviews from provider.',
    };
  }
};

/**
 * Returns an unavailable reviews response for stores where reviews are disabled.
 */
export const getUnavailableReviewsResponse = (
  storeName: string,
): ReviewsResponse => ({
  status: 'unavailable',
  message: `Customer reviews are currently not enabled for ${storeName}.`,
});
