export interface Dekk {
  id: number;
  seller: string;
  manufacturer: string;
  product_name: string;
  width: number;
  aspect_ratio: number;
  rim_size: number;
  price: number;
  stock: string;
  inventory_count: number;
  picture: string | null;
}

export interface DekkFilter {
  width?: number;
  aspect_ratio?: number;
  rim_size?: number;
  manufacturer?: string;
  seller?: string;
  product_name?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  id?: number;
  sortBy?: 'price' | 'manufacturer' | 'seller';
  sortOrder?: 'asc' | 'desc';
}

export interface DekkStaerd {
  width: number;
  aspect_ratio: number;
  rim_size: number;
}
