// lib/api/cart.ts
import { Cart, CartItem } from "../types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://customworld.onrender.com/api';

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};



export class AuthenticationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Récupérer le panier de l'utilisateur
export const fetchCart = async (): Promise<Cart> => {
  try {
    const res = await fetch(`${API_URL}/customer/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Unable to fetch cart.');
  }
};

// Ajouter un article au panier
export const addToCart = async (productId: number, quantity: number,isCutomized :boolean): Promise<Cart> => {
  try {
    // 1. Construire l'URL avec les paramètres de requête
    const url = `${API_URL}/customer/cart/add?productId=${productId}&quantity=${quantity}&isCustomized=${isCutomized}`;

    // 2. Faire la requête POST avec une URL modifiée
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });



    // Vérifier spécifiquement le statut 401
    if (res.status === 401) {
      const errorData = await res.json();
      throw new AuthenticationError(
        errorData.message || 'Accès refusé : authentification requise.',
        res.status
      );
    }

    if (!res.ok) {
      throw new Error(`Failed to add item to cart: ${res.status} ${res.statusText}`);
    }

    
    // 3. Retourner la réponse du panier mis à jour
    return res.json();

  } catch (error) {
    console.error('Error adding item to cart:', error);
    // Si c'est une erreur d'authentification, relancez-la spécifiquement
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    throw new Error('Unable to add item to cart.');
  }
};




// Ajouter un article au panier
export const addToCartcustomized = async (productId: number, quantity: number,isCutomized :boolean): Promise<Cart> => {
  try {
    // 1. Construire l'URL avec les paramètres de requête
    const url = `${API_URL}/customer/cart/add?productId=${productId}&quantity=${quantity}&isCustomized=${isCutomized}`;

    // 2. Faire la requête POST avec une URL modifiée
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
    });



    // Vérifier spécifiquement le statut 401
    if (res.status === 401) {
      const errorData = await res.json();
      throw new AuthenticationError(
        errorData.message || 'Accès refusé : authentification requise.',
        res.status
      );
    }

    if (!res.ok) {
      throw new Error(`Failed to add item to cart: ${res.status} ${res.statusText}`);
    }

    
    // 3. Retourner la réponse du panier mis à jour
    return res.json();

  } catch (error) {
    console.error('Error adding item to cart:', error);
    // Si c'est une erreur d'authentification, relancez-la spécifiquement
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    throw new Error('Unable to add item to cart.');
  }
};
// Mettre à jour la quantité d'un article     `${API_URL}/customer/cart/update/${cartItemId}?quantity=${newQuantity}

export const updateCartItem = async (cartItemId: number, quantity: number): Promise<Cart> => {
  try {
    const res = await fetch( `${API_URL}/customer/cart/update/${cartItemId}?quantity=${quantity}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      //body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error(`Failed to update cart item: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error('Unable to update cart item.');
  }
};

// Supprimer un article du panier
export const removeFromCart = async (cartItemId: number): Promise<Cart> => {
  try {
    const res = await fetch(`${API_URL}/customer/cart/remove/${cartItemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to remove item from cart: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw new Error('Unable to remove item from cart.');
  }
};

// Vider le panier
export const clearCart = async (): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/customer/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to clear cart: ${res.status} ${res.statusText}`);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Unable to clear cart.');
  }
};