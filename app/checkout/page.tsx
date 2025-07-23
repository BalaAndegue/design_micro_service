'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Truck,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const shippingMethods = [
  {
    id: 'standard',
    name: 'Livraison Standard',
    description: '5-7 jours ouvrés',
    price: 4.99,
    icon: Truck
  },
  {
    id: 'express',
    name: 'Livraison Express',
    description: '2-3 jours ouvrés',
    price: 9.99,
    icon: Truck
  },
  {
    id: 'premium',
    name: 'Livraison Premium',
    description: '24-48h',
    price: 14.99,
    icon: Truck
  }
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  const totalWithShipping = totalPrice + selectedShipping.price;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleOrder = async () => {
    if (!acceptTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    setIsProcessing(true);
    
    // Simulation du traitement de commande
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Génération d'un numéro de commande
    const orderNumber = `CMD-${Date.now().toString().slice(-6)}`;
    
    toast.success('Commande confirmée !', {
      description: `Numéro de commande: ${orderNumber}`
    });
    
    clearCart();
    router.push(`/order-confirmation?order=${orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des produits avant de procéder au paiement</p>
            <Link href="/products">
              <Button size="lg">Voir les produits</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600">
              {step === 1 && 'Informations de livraison'}
              {step === 2 && 'Mode de livraison'}
              {step === 3 && 'Paiement'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Belgique">Belgique</SelectItem>
                          <SelectItem value="Suisse">Suisse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={saveInfo}
                      onCheckedChange={setSaveInfo}
                    />
                    <Label htmlFor="saveInfo" className="text-sm">
                      Sauvegarder ces informations pour une prochaine commande
                    </Label>
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.address}
                  >
                    Continuer vers la livraison
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Mode de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                        selectedShipping.id === method.id 
                          ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedShipping(method)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <method.icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        <span className="font-bold text-blue-600">€{method.price}</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continuer vers le paiement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Informations de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Nom sur la carte *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Date d'expiration *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/AA"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={setAcceptTerms}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      J'accepte les <Link href="/terms" className="text-blue-600 hover:underline">conditions générales</Link> et la <Link href="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</Link> *
                    </Label>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">Paiement 100% sécurisé SSL</span>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={handleOrder}
                      disabled={isProcessing || !acceptTerms}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
                    >
                      {isProcessing ? 'Traitement...' : `Finaliser la commande €${totalWithShipping.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Récapitulatif de commande */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.customizations).map(([key, value]) => 
                          value && (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Qté: {item.quantity}</span>
                        <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison ({selectedShipping.name})</span>
                    <span>€{selectedShipping.price.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">€{totalWithShipping.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Informations sécurité */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Livraison suivie</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowLeft className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Retour gratuit 30 jours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}