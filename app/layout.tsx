import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/auth-provider';
import { CartProvider } from '@/providers/cart-provider';
import { Toaster } from '@/components/ui/sonner';
import PaymentStatusWatcher from '@/components/PaymentStatusWatcher';
import Footer from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CustomWorld - Personnalisez vos produits',
  description: 'Créez et personnalisez vos produits préférés avec notre configurateur interactif',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
      <Providers>
        <AuthProvider>
          
          <CartProvider>
            
            {children}
            <Toaster />
            <PaymentStatusWatcher />
          </CartProvider>
          <Footer/>
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}