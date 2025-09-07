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