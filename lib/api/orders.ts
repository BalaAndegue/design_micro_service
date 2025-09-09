import { API_URL ,getAuthHeaders} from "./config";





export interface OrderRequest {

  deliveryAddress: string;

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
  transactionId?: string;
  modeLivraison: number;
  phone: string;
}



export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  customizations?: Record<string, string>;
  imagePath: string;
}



export interface Order {
  id: number;
  customerId: number;
  productId: number;
  imagePath: string;
  productName:string;
  deliveryAddress: string;
  status:'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  amount: number;
  currency: string;
  transactionId: string;
  modeLivraison: number;
  phone: string;
  // Ajouter les propriétés pour les items si elles sont incluses dans la réponse
  items?: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price?:number;
    isCutomized: boolean;
    customizations?: Record<string, string>;
    imagePath: string;
  }>;
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/customer/orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Non authentifié');
    }
    throw new Error('Erreur lors de la récupération des commandes');
  }

  return response.json();
};




export const createOrder = async (orderData: Omit<OrderRequest,"customerId" | "productId" | "imagePath">): Promise<OrderResponse> => {
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



export const fetchOrder = async (): Promise<Order[]> => {
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

export const getOrderDetails = async (id : Number) : Promise<Order> =>{
  try{
    const response = await fetch(`${API_URL}/customer/${id}`,{
      method : 'GET',
      headers : getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok){
      throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }catch (error){
    console.error('Error fetching order details:', error);
    throw new Error('Unable to fetch order details');
  }
}



export const getOrderStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'En attente',
    'PROCESSING': 'En traitement',
    'SHIPPED': 'Expédié',
    'DELIVERED': 'Livré',
    'CANCELLED': 'Annulé'
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'PENDING': 'bg-yellow-500',
    'PROCESSING': 'bg-orange-500',
    'SHIPPED': 'bg-blue-500',
    'DELIVERED': 'bg-green-500',
    'CANCELLED': 'bg-red-500'
  };
  return colorMap[status] || 'bg-gray-500';
};