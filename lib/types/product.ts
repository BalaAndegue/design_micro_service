export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  
  price?: number;
  originalPrice?: number;
  imagePath: string;
  rating?: number;
  reviews?: number;
  New?: boolean;
  isOnSale?: boolean;
  color?: string[];
  sizes?: string[];
  patterns?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
  imageFile?: File;
}

export interface ProductColorOption {
  name: string;
  value: string;
  premium?: boolean;
  price?: number;
}

export interface ProductPatternOption {
  name: string;
  value: string;
  price: number;
  image?: string;
}

export interface ProductSizeOption {
  name: string;
  value: string;
  price?: number;
}