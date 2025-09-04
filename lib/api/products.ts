// app/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://customworld.onrender.com/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  imagePath: string;
  rating?: number;
  reviews?: number;
  new?: boolean;
  onSale?: boolean;
  color?: string[];
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

export interface Category {
  id: number;
  name: string;
}

// Fonctions pour récupérer les informations utilisateur
const getUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
};

const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Fonction pour obtenir le préfixe d'API basé sur le rôle
const getApiPrefix = (): string => {
  const role = getUserRole();
  switch (role) {
    case 'ADMIN':
      return 'admin';
    case 'VENDOR':
      return 'vendor';
    case 'CUSTOMER':
      return 'customer';
    default:
      return 'customer'; // Par défaut pour les utilisateurs non connectés
  }
};

// Fonction utilitaire pour construire les URLs d'API
const buildApiUrl = (endpoint: string): string => {
  const prefix = getApiPrefix();
  return `${API_URL}/${prefix}/${endpoint}`;
};

// Fonction utilitaire pour les endpoints publics (sans préfixe de rôle)
const buildPublicApiUrl = (prefix:string,endpoint: string): string => {
  return `${API_URL}/${prefix}/${endpoint}`;
};

// STATISTIQUES (uniquement pour ADMIN)
export const fetchStats = async (): Promise<Stats> => {
  try {
    const res = await fetch(buildApiUrl('stats'), {
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

// PRODUITS
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(buildApiUrl('products'), {
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

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await fetch(buildApiUrl(`products/${id}`), {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Produit non trouvé');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching product by id:', error);
    throw new Error('Unable to fetch product.');
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  try {
    const res = await fetch(buildPublicApiUrl('vendor','products'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Failed to create product: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Unable to create product.');
  }
};

export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
  try {
    const res = await fetch(buildPublicApiUrl('admin',`products/${id}`), {
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
    const res = await fetch(buildPublicApiUrl('vendor',`products/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete product: ${res.status} ${res.statusText}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Unable to delete product.');
  }
};

// CATÉGORIES (accessible à tous les rôles, donc on utilise l'endpoint public)
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(buildPublicApiUrl('customer','categories'), {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Unable to fetch categories.');
  }
};

// FONCTIONS SPÉCIFIQUES PAR RÔLE (exemples)

// Fonctions spécifiques pour ADMIN
export const adminFetchAllUsers = async (): Promise<any[]> => {
  if (getUserRole() !== 'ADMIN') {
    throw new Error('Access denied. Admin role required.');
  }
  try {
    const res = await fetch(buildApiUrl('users'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Unable to fetch users.');
  }
};

// Fonctions spécifiques pour VENDOR
export const vendorFetchMyProducts = async (): Promise<Product[]> => {
  if (getUserRole() !== 'VENDOR') {
    throw new Error('Access denied. Vendor role required.');
  }
  try {
    const res = await fetch(buildApiUrl('my-products'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch vendor products: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    throw new Error('Unable to fetch vendor products.');
  }
};

// Fonctions spécifiques pour CUSTOMER
export const customerFetchOrders = async (): Promise<any[]> => {
  if (getUserRole() !== 'CUSTOMER') {
    throw new Error('Access denied. Customer role required.');
  }
  try {
    const res = await fetch(buildApiUrl('orders'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Unable to fetch orders.');
  }
};

// Fonction pour vérifier les permissions (utilitaire)
export const hasRole = (requiredRole: string): boolean => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Fonction pour vérifier plusieurs rôles
export const hasAnyRole = (requiredRoles: string[]): boolean => {
  const userRole = getUserRole();
  return requiredRoles.includes(userRole || '');
};