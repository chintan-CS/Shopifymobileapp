export interface ReviewSnippet {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface ProductReviewsData {
  averageRating: number;
  reviewCount: number;
  reviews: ReviewSnippet[];
}

export type ReviewsResponseStatus = 'loading' | 'success' | 'unavailable' | 'error';

export interface ReviewsResponse {
  status: ReviewsResponseStatus;
  data?: ProductReviewsData;
  message?: string;
}
