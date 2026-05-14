export interface Product {
  id: string;
  name: string;
  brand: string;
  sport: string;    // e.g., "football", "swimming", "indoor"
  price: number;
  currency: string;
  imageUrl: string | null;
  slug: string;
  sizes?: string | null;
  description?: string | null;
  sku?: string | null;
  color?: string | null;
  isFeatured?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category?: Category | any; // To allow includes
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  brand?: string | null;
}
