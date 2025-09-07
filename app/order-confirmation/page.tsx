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
  Share2
} from 'lucide-react';
import { Header } from '@/components/layout/headerstes';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'CMD-123456';
  const [isLoaded, setIsLoaded] = useState(false);

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

    return () => clearTimeout(timer);
  }, []);

  const orderDetails = {
    orderNumber,
    date: new Date().toLocaleDateString('fr-FR'),
    total: 54.98,
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    items: [
      {
        name: 'Coque iPhone 15 Pro Personnalisée',
        quantity: 2,
        price: 24.99,
        customizations: { color: 'Bleu', text: 'Mon iPhone' }
      }
    ],
    shippingAddress: '123 Rue de la Paix, 75001 Paris, France',
    email: 'client@example.com'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animation de confirmation */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-lg text-gray-600">
            Merci pour votre commande. Vous recevrez bientôt un email de confirmation.
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
                    {orderDetails.orderNumber}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Date de commande:</span>
                  <span>{orderDetails.date}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Livraison estimée:</span>
                  <span className="text-green-600 font-medium">{orderDetails.estimatedDelivery}</span>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-3">Articles commandés:</h3>
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="font-medium">XAF {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-blue-600">XAF {orderDetails.total}</span>
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
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Adresse de livraison:</span>
                    <p className="text-gray-600 mt-1">{orderDetails.shippingAddress}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Email de confirmation:</span>
                    <p className="text-gray-600 mt-1">{orderDetails.email}</p>
                  </div>
                </div>
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
                <Button className="w-full" variant="outline">
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

      <Footer />
    </div>
  );
}