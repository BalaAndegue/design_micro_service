// components/PaymentStatusWatcher.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/cart-provider';
import { checkPaymentStatus } from '@/lib/api/payements';
import { toast } from 'sonner';

export default function PaymentStatusWatcher() {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const checkPendingPayments = async () => {
      const transactionId = localStorage.getItem('currentTransaction');
      if (!transactionId) return;

      try {
        const status = await checkPaymentStatus(transactionId);
        
        if (status.status === 'completed') {
          toast.success('Paiement confirmé !');
          clearCart();
          localStorage.removeItem('currentTransaction');
          router.push(`/order-confirmation?order=${status.orderId || 'CMD-' + Date.now().toString().slice(-6)}`);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    // Vérifier au chargement de la page
    checkPendingPayments();

    // Vérifier périodiquement
    const interval = setInterval(checkPendingPayments, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [clearCart, router]);

  return null;
}