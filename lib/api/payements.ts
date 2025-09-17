// lib/api/payments.ts
import { API_URL,getAuthHeaders } from "./config";


export interface NotchPayInitiateRequest {
  amount: number;
  description: string;
  customerName: string;
  customerSurname: string;
  customerPhoneNumber: string;
  customerEmail: string;
  channelOption: string;
  customerAddress: string;
  customerCity: string;
  customerZipCode: string;
}

export interface NotchPayInitiateResponse {
  status: string;
  message: string;
  code: number;
  transaction: {
    amount: number;
    fees: any[];
    amounts: {
      total: number;
      converted: number;
      currency: string;
      rate: number;
    };
    sandbox: boolean;
    description: string;
    reference: string;
    status: string;
    currency: string;
    callback: string;
    customer: string;
    charge: string;
    created_at: string;
    authorization_url?: string;
  };
  authorization_url?: string;
}

export interface PaymentStatusResponse {
  status: string;
  message?: string;
  orderId?: string;
}

// Initier un paiement NotchPay
export const initiateNotchPayPayment = async (paymentData: NotchPayInitiateRequest): Promise<NotchPayInitiateResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/initiate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error initiating NotchPay payment:', error);
    throw new Error('Unable to initiate payment');
  }
};

// Vérifier le statut d'un paiement
export const checkPaymentStatus = async (transactionReference: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/status/${transactionReference}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error('Unable to check payment status');
  }
};

// Traiter une notification de callback (côté serveur)
export const handlePaymentNotification = async (signature: string, data: any): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/payments/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NotchPay-Signature': signature,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error handling payment notification:', error);
    throw new Error('Unable to process payment notification');
  }
};