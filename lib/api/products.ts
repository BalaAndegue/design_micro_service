const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  colors?: string[];
  sizes?: string[];
  patterns?: string[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return res.json();
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error(`Failed to update product ${id}`);
  return res.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete product ${id}`);
};