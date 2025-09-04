// lib/types/cart.ts
export interface CartItem {
  id:number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: {
    color?: string;
    pattern?: string;
    text?: string;
    size?: string;
    customImage?: boolean;
  };
}

export interface CartItems {
  productId: number;
  
  quantity: number;
 
}


export interface Cart {
  id?: number;
  userId: number;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}