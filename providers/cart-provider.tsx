// providers/cart-provider.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/lib/types/cart';
import { addToCart, updateCartItem, removeFromCart, clearCart as apiClearCart, fetchCart, AuthenticationError, addToCartcustomized } from '@/lib/api/card';



interface CartContextType {
  id?: number;
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  addItemcustom: (item: CartItem) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  authError:boolean;
  resetAuthError : () => void;
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);




export function CartProvider({ children }: { children: React.ReactNode }) {


  const [cardId , setCardId] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

// Calculate the total price
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [authError, setAuthError] = useState<boolean>(false); // Nouvel état pour les erreurs d'authentification


  // Charger le panier au démarrage
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cart = await fetchCart();
      setItems(cart.items);
      setCardId(cart.id)
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du panier');
      console.error('Error loading cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (items : CartItem) => {
    try {
      setIsLoading(true);
      const updatedCart = await addToCart(items.id, items.quantity,false);
      setItems(updatedCart.items);
      setCardId(updatedCart.id)
      setError(null);
    } catch (err) {
       if (err instanceof AuthenticationError) {
        setAuthError(true); // Définir l'état d'erreur d'authentification
        setError('Veuillez vous connecter pour ajouter des articles au panier');
      } else {
        setError('Erreur lors de l\'ajout au panier');
      }
      console.error('Error adding item:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  const addItemcustom = async (items : CartItem) => {
    try {
      setIsLoading(true);
      const updatedCart = await addToCartcustomized(items.id, items.quantity,true);
      setItems(updatedCart.items);
      setCardId(updatedCart.id)
      setError(null);
    } catch (err) {
       if (err instanceof AuthenticationError) {
        setAuthError(true); // Définir l'état d'erreur d'authentification
        setError('Veuillez vous connecter pour ajouter des articles au panier');
      } else {
        setError('Erreur lors de l\'ajout au panier');
      }
      console.error('Error adding item:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await updateCartItem(cartItemId, quantity);
      setItems(updatedCart.items);
      setCardId(updatedCart.id)
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour de la quantité');
      console.error('Error updating quantity:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await removeFromCart(cartItemId);
      setItems(updatedCart.items);
      setCardId(updatedCart.id)
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'article');
      console.error('Error removing item:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCartHandler = async () => {
    try {
      setIsLoading(true);
      await apiClearCart();
      setItems([]);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du panier');
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      addItemcustom,
      updateItemQuantity,
      id: cardId,
      removeItem,
      clearCart : clearCartHandler,
      totalPrice,    // Added
      totalItems,    // Adde
      isLoading,
      error,
      authError,
      resetAuthError : () =>setAuthError(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};