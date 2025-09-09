// lib/types/cart.ts
export interface CartItem {
  id:number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imagePath: string;
  customized:boolean;
  customizations?: {
    color?: string;
    pattern?: string;
    font?:string;
    text?: string;
    size?: string;
    customImage?: boolean;
    additionalNotes?:string;
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