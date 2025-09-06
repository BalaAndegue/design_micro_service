'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard,
  Truck,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { Header } from '@/components/layout/headerstes';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/providers/cart-provider';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const shippingCost = totalPrice > 50 ? 0 : 4.99;
  const finalTotal = totalPrice - discount + shippingCost;

  const handlePromoCode = async () => {
    setIsCheckingPromo(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Codes promo simulés
    const promoCodes = {
      'WELCOME10': 0.1,
      'SAVE20': 0.2,
      'FIRST15': 0.15
    };

    if (promoCodes[promoCode as keyof typeof promoCodes]) {
      const discountAmount = totalPrice * promoCodes[promoCode as keyof typeof promoCodes];
      setDiscount(discountAmount);
      toast.success(`Code promo appliqué ! -€${discountAmount.toFixed(2)}`);
    } else {
      toast.error('Code promo invalide');
    }
    setIsCheckingPromo(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">Découvrez nos produits et commencez à personnaliser !</p>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
                Voir les produits
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panier</h1>
            <p className="text-gray-600">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuer les achats
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles du panier */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.imagePath}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Personnalisations */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.customizations && (
                          <>
                            {item.customizations.color && (
                              <Badge variant="secondary">Couleur: {item.customizations.color}</Badge>
                            )}
                            {item.customizations.pattern && (
                              <Badge variant="secondary">Motif: {item.customizations.pattern}</Badge>
                            )}
                            {item.customizations.size && (
                              <Badge variant="secondary">Taille: {item.customizations.size}</Badge>
                            )}
                            {item.customizations.text && (
                              <Badge variant="secondary">Texte: "{item.customizations.text}"</Badge>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold text-blue-600">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="space-y-6">
            {/* Code promo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Code promo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Entrez votre code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <Button 
                    onClick={handlePromoCode}
                    disabled={!promoCode || isCheckingPromo}
                    variant="outline"
                  >
                    {isCheckingPromo ? 'Vérification...' : 'Appliquer'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Essayez: WELCOME10, SAVE20, FIRST15
                </p>
              </CardContent>
            </Card>

            {/* Récapitulatif commande */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total ({totalItems} articles)</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <span>-XAF{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratuite</span>
                      ) : (
                        `€${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {totalPrice < 50 && (
                    <p className="text-xs text-blue-600">
                      Livraison gratuite dès XAF 50 d'achat !
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">€{finalTotal.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Procéder au paiement
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    clearCart();
                    toast.success('Panier vidé');
                  }}
                >
                  Vider le panier
                </Button>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Livraison rapide 2-3 jours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowLeft className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Retour gratuit 30 jours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}