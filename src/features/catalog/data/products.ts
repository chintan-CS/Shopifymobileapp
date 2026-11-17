import { PRODUCT_IMAGES } from '../../../assets/products';
import { Product } from '../types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Apex Seamless T-Shirt',
    description:
      'Engineered with sweat-wicking lightweight seamless fabric for maximum mobility, heat regulation, and athletic comfort.',
    category: 'Men',
    price: 42.0,
    compareAtPrice: 50.0,
    tag: 'BESTSELLER',
    availableForSale: true,
    localImage: PRODUCT_IMAGES.prod_1,
    variants: [
      { id: 'var_1_s', title: 'Small', size: 'S', price: 42.0, availableForSale: true },
      { id: 'var_1_m', title: 'Medium', size: 'M', price: 42.0, availableForSale: true },
      { id: 'var_1_l', title: 'Large', size: 'L', price: 42.0, availableForSale: true },
      { id: 'var_1_xl', title: 'Extra Large', size: 'XL', price: 42.0, availableForSale: false },
    ],
  },
  {
    id: 'prod_2',
    title: 'Vital High-Waisted Leggings',
    description:
      'Flattering supportive compressive waistband and contouring ribbed texture crafted for every training session.',
    category: 'Women',
    price: 54.0,
    tag: 'NEW',
    availableForSale: true,
    localImage: PRODUCT_IMAGES.prod_2,
    variants: [
      { id: 'var_2_xs', title: 'X-Small', size: 'XS', price: 54.0, availableForSale: true },
      { id: 'var_2_s', title: 'Small', size: 'S', price: 54.0, availableForSale: true },
      { id: 'var_2_m', title: 'Medium', size: 'M', price: 54.0, availableForSale: true },
      { id: 'var_2_l', title: 'Large', size: 'L', price: 54.0, availableForSale: true },
    ],
  },
  {
    id: 'prod_3',
    title: 'Oversized Heavyweight Hoodie',
    description:
      'Premium 460gsm brushed French terry cotton with dropped shoulders, deep double-lined hood, and relaxed drape.',
    category: 'Men',
    price: 68.0,
    compareAtPrice: 85.0,
    tag: 'SALE',
    availableForSale: true,
    localImage: PRODUCT_IMAGES.prod_3,
    variants: [
      { id: 'var_3_s', title: 'Small', size: 'S', price: 68.0, availableForSale: true },
      { id: 'var_3_m', title: 'Medium', size: 'M', price: 68.0, availableForSale: true },
      { id: 'var_3_l', title: 'Large', size: 'L', price: 68.0, availableForSale: true },
    ],
  },
  {
    id: 'prod_4',
    title: 'Ribbed Seamless Crop Top',
    description:
      'Minimalist racerback silhouette with micro-perforated breathability zones and a secure non-slip bottom band.',
    category: 'Women',
    price: 36.0,
    tag: 'TRENDING',
    availableForSale: true,
    localImage: PRODUCT_IMAGES.prod_4,
    variants: [
      { id: 'var_4_s', title: 'Small', size: 'S', price: 36.0, availableForSale: true },
      { id: 'var_4_m', title: 'Medium', size: 'M', price: 36.0, availableForSale: true },
      { id: 'var_4_l', title: 'Large', size: 'L', price: 36.0, availableForSale: false },
    ],
  },
  {
    id: 'prod_5',
    title: 'Everyday Structured Cap',
    description:
      'Clean low-profile 6-panel athletic cap with moisture-wicking internal sweatband and custom matte buckle closure.',
    category: 'Accessories',
    price: 24.0,
    availableForSale: true,
    localImage: PRODUCT_IMAGES.prod_5,
    variants: [
      { id: 'var_5_os', title: 'One Size', size: 'OS', price: 24.0, availableForSale: true },
    ],
  },
  {
    id: 'prod_6',
    title: 'Heavy-Duty Gym Duffle 38L',
    description:
      'Waterproof ballistic nylon shell with isolated ventilated shoe compartment and detachable ergonomic shoulder strap.',
    category: 'Accessories',
    price: 60.0,
    compareAtPrice: 75.0,
    tag: 'SALE',
    availableForSale: true,
    localImage: PRODUCT_IMAGES.prod_6,
    variants: [
      { id: 'var_6_os', title: 'One Size', size: 'OS', price: 60.0, availableForSale: true },
    ],
  },
  {
    id: 'prod_7',
    title: 'Technical Utility Windbreaker',
    description:
      'Featherweight ripstop windbreaker with durable water repellent (DWR) finish and hidden zippered utility chest pocket.',
    category: 'Men',
    price: 88.0,
    availableForSale: false,
    localImage: PRODUCT_IMAGES.prod_7,
    variants: [
      { id: 'var_7_s', title: 'Small', size: 'S', price: 88.0, availableForSale: false },
      { id: 'var_7_m', title: 'Medium', size: 'M', price: 88.0, availableForSale: false },
    ],
  },
];
