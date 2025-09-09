import { API_URL ,getAuthHeaders} from "./config";

export interface Order {
  id: number;
  customerId: number;
  productId: number;
  deliveryAddress: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  amount: number;
  currency: string;
  transactionId: string;
}

export interface OrderRequest {
  customerId: number |string;
  productId: number;
  deliveryAddress: string;
  imagePath: string;
  modeLivraison: number;
  phone: string;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  productId: number;
  deliveryAddress: string;
  status: string;
  orderDate: string;
  amount: number;
  currency: string;
  transactionId: string;
  modeLivraison: number;
  phone: string;
}

export const createOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
  const response = await fetch(`${API_URL}/customer/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la commande');
  }

  return response.json();
};

export const createWhatsAppOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
  // Cette fonction peut avoir une logique spécifique pour les commandes WhatsApp
  return createOrder(orderData);
};



export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/customer/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Unable to fetch orders');
  }
};