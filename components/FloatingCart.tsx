// components/FloatingCart.tsx (version améliorée)
'use client';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/providers/cart-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FloatingCart() {
  const { items, isLoading } = useCart();
  const router = useRouter();
  const [isBouncing, setIsBouncing] = useState(false);

  // Calculer le total des articles
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Animation lorsque le panier change
  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const handleClick = () => {
    router.push('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed relative"
        aria-label={`Panier (${totalItems} articles)`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isBouncing ? { 
          scale: [1, 1.2, 1],
          transition: { duration: 0.6 }
        } : {}}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ShoppingBag className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="hidden sm:inline-block font-medium">
          {isLoading ? 'Chargement...' : `Panier${totalItems > 0 ? ` (${totalItems})` : ''}`}
        </span>
        
        {/* Badge avec le nombre d'articles */}
        <AnimatePresence>
          {totalItems > 0 && !isLoading && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              key={totalItems}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}