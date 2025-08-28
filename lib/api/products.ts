// app/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.43.11:8081/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  //basePrice: number;
  price: number;
  originalPrice: number;
  imagePath: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  colors?: string[];
  sizes?: string[];
  patterns?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Stats {
  totalProducts: number;
  categories: Array<{ category: string; count: number }>;
  onSaleProducts: number;
  newUsersThisMonth: number;
  totalUsers: number;
}
const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const userid = user ? JSON.parse(user).id : null;
const userrole = user ?JSON.parse(user).role : null;
//console.log('le user id est '+userid)
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const fetchStats = async (): Promise<Stats> => {
  try {
    const res = await fetch(`${API_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error('Unable to fetch stats.');
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Unable to fetch products.');
  }
};


export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/vendor/products/${id}`,{
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Produit non trouvé');
  }
  return response.json();
}

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  try {
    const res = await fetch(`${API_URL}/vendor/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product,userid),
    });
    if (!res.ok) throw new Error(`Failed to create product: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Unable to create product.');
  }
};

export const patchProduct = async (
  id: number, 
  updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour partielle du produit');
  return response.json();
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
  try {
    const res = await fetch(`${API_URL}/vendor/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Failed to update product: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Unable to update product.');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/vendor/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete product: ${res.status} ${res.statusText}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Unable to delete product.');
  }
};