'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Download,
  ArrowRight,
  Home,
  Share2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';
import { Order, getOrderDetails } from '@/lib/api/orders';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const source = searchParams.get('source');
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Animation confetti
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);

    // Vider le panier après une commande réussie
    if (orderNumber) {
      clearCart();
    }

    // Charger les détails de la commande si un numéro est fourni
    if (orderNumber && !isNaN(Number(orderNumber))) {
      fetchOrderDetails(Number(orderNumber));
    } else {
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [orderNumber, clearCart]);

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoading(true);
      // Note: Vous devrez peut-être adapter cette fonction selon votre API
      const orderData = await getOrderDetails(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error('Erreur lors du chargement des détails de la commande:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusIcons = {
      'PENDING': Clock,
      'PROCESSING': Clock,
      'SHIPPED': Truck,
      'DELIVERED': CheckCircle,
      'CANCELLED': AlertCircle
    };
    return statusIcons[status as keyof typeof statusIcons] || Package;
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'PENDING': 'En attente',
      'PROCESSING': 'En traitement',
      'SHIPPED': 'Expédié',
      'DELIVERED': 'Livré',
      'CANCELLED': 'Annulé'
    };
    return statusMap[status] || status;
  };

  const getLivraisonLabel = (modeLivraison: number): string => {
    switch (modeLivraison) {
      case 0: return 'Standard';
      case 1: return 'Express';
      case 2: return 'Premium';
      default: return `Mode ${modeLivraison}`;
    }
  };

  const formatAmount = (amount: number | null | undefined, currency: string = 'XAF'): string => {
    if (amount === null || amount === undefined) {
      return `${currency} 0.00`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const getSafeValue = (value: any, defaultValue: any = '') => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Clock className="h-8 w-8 animate-spin text-blue-600 mr-2" />
            <span>Chargement de votre commande...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/orders">
              <Button>
                Voir mes commandes
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Données par défaut si aucune commande n'est chargée
  const orderDetails = order || {
    id: Number(orderNumber) || Math.floor(Math.random() * 10000),
    customerId: user?.id || 0,
    productId: 0,
    productName: 'Produit personnalisé',
    deliveryAddress: 'Adresse non spécifiée',
    status: 'PENDING',
    orderDate: new Date().toISOString(),
    amount: 0,
    currency: 'XAF',
    transactionId: orderNumber || `CMD-${Date.now().toString().slice(-6)}`,
    modeLivraison: 0,
    phone: 'Non spécifié',
    imagePath: 'https://i.pinimg.com/736x/12/c4/e5/12c4e57a1e38ff65aa4137de5636ec93.jpg'
  };

  const StatusIcon = getStatusIcon(orderDetails.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animation de confirmation */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {source === 'whatsapp' ? 'Commande envoyée !' : 'Commande confirmée !'}
          </h1>
          <p className="text-lg text-gray-600">
            {source === 'whatsapp' 
              ? 'Votre commande a été envoyée via WhatsApp. Notre équipe vous contactera rapidement.'
              : 'Merci pour votre commande. Vous recevrez bientôt un email de confirmation.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la commande */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Détails de la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Numéro de commande:</span>
                  <Badge variant="outline" className="font-mono">
                    #{orderDetails.id}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Date de commande:</span>
                  <span>{new Date(orderDetails.orderDate).toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Statut:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {getStatusLabel(orderDetails.status)}
                  </Badge>
                </div>

                {orderDetails.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Référence:</span>
                    <span className="text-sm text-gray-500">{orderDetails.transactionId}</span>
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="font-medium mb-3">Article commandé:</h3>
                  <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getSafeValue(orderDetails.imagePath, '/images/placeholder-product.jpg')}
                        alt={orderDetails.productName}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{getSafeValue(orderDetails.productName, 'Produit personnalisé')}</h4>
                        <p className="text-sm text-gray-600">Produit ID: {orderDetails.productId}</p>
                      </div>
                    </div>
                    <span className="font-medium">{formatAmount(orderDetails.amount, orderDetails.currency)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatAmount(orderDetails.amount, orderDetails.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Adresse de livraison:</span>
                  <p className="text-gray-600 mt-1">{getSafeValue(orderDetails.deliveryAddress, 'Adresse non spécifiée')}</p>
                </div>
                
                <div>
                  <span className="font-medium">Téléphone:</span>
                  <p className="text-gray-600 mt-1">{getSafeValue(orderDetails.phone, 'Non spécifié')}</p>
                </div>
                
                <div>
                  <span className="font-medium">Mode de livraison:</span>
                  <p className="text-gray-600 mt-1">{getLivraisonLabel(getSafeValue(orderDetails.modeLivraison, 0))}</p>
                </div>

                {user?.email && (
                  <div>
                    <span className="font-medium">Email de confirmation:</span>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email de confirmation</h3>
                    <p className="text-sm text-gray-600">Envoyé dans les prochaines minutes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Préparation</h3>
                    <p className="text-sm text-gray-600">1-2 jours ouvrés</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Expédition</h3>
                    <p className="text-sm text-gray-600">Suivi par email</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la facture
                </Button>
                
                <Link href="/orders" className="block">
                  <Button className="w-full" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Voir mes commandes
                  </Button>
                </Link>
                
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager ma création
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium mb-2">Continuer vos achats</h3>
                <div className="space-y-2">
                  <Link href="/products" className="block">
                    <Button className="w-full" variant="outline">
                      Voir les produits
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  
                  <Link href="/" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                      <Home className="h-4 w-4 mr-2" />
                      Retour à l'accueil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section satisfaction */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Merci de faire confiance à CustomWorld !
            </h2>
            <p className="text-gray-600 mb-4">
              Votre commande sera traitée avec le plus grand soin. 
              Une question ? Notre équipe support est là pour vous aider.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Contacter le support
              </Button>
              <Button variant="outline">
                Centre d'aide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}