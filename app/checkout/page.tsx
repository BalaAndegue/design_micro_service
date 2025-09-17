'use client';

// app/checkout/page.tsx (extrait modifié)

import { useState, useEffect } from 'react';
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
  CheckCircle,
  Smartphone
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  initiateNotchPayPayment, 
  checkPaymentStatus,
  type NotchPayInitiateRequest 
} from '@/lib/api/payements';
import { createWhatsAppOrder } from '@/lib/api/orders';

const shippingMethods = [
  {
    id: 'standard',
    name: 'Sans livraison',
    description: 'selon votre disponibilite',
    price: 0,
    icon: Truck
  },
  {
    id: 'express',
    name: 'Livraison Express',
    description: '2-3 jours ouvrés',
    price: 1500,
    icon: Truck
  },
  {
    id: 'premium',
    name: 'Livraison Premium',
    description: '24-48h',
    price: 3000,
    icon: Truck
  }
];

const notchPayChannels = [
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'mtn_mobile_money', label: 'MTN Mobile Money' },
  { value: 'express_union', label: 'Express Union Mobile Money' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'notchpay'>('card');
  const [selectedChannel, setSelectedChannel] = useState(notchPayChannels[0].value);
  const [currentTransaction, setCurrentTransaction] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Cameroun',
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

  const initiateNotchPay = async () => {
    setIsProcessing(true);
    
    try {
      const paymentData: NotchPayInitiateRequest = {
        amount: totalWithShipping,
        description: `Commande CustomWorld - ${items.length} article(s)`,
        customerName: formData.firstName,
        customerSurname: formData.lastName,
        customerPhoneNumber: formData.phone.replace(/\s+/g, ''),
        customerEmail: formData.email,
        channelOption: selectedChannel,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerZipCode: formData.postalCode
      };

      const result = await initiateNotchPayPayment(paymentData);
      
      const authorizationUrl = result.authorization_url || result.transaction?.authorization_url;
      
      if (!authorizationUrl) {
        throw new Error('URL de paiement non reçue');
      }

      // Sauvegarder la référence de transaction pour vérification ultérieure
      if (result.transaction?.reference) {
        setCurrentTransaction(result.transaction.reference);
        localStorage.setItem('currentTransaction', result.transaction.reference);
      }

      // Ouvrir dans un nouvel onglet
      const newWindow = window.open(authorizationUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        newWindow.focus();
        
        toast.success('Paiement en cours', {
          description: 'Complétez le paiement dans le nouvel onglet',
          duration: 5000
        });

        // Démarrer la surveillance du statut
        startPaymentStatusCheck(result.transaction?.reference);
        
      } else {
        // Fallback si les popups sont bloqués
        toast.warning('Ouvrir manuellement', {
          description: 'Veuillez cliquer pour ouvrir la page de paiement',
          action: {
            label: 'Ouvrir',
            onClick: () => window.location.href = authorizationUrl
          },
          duration: 10000
        });
      }

    } catch (error) {
      console.error('Erreur NotchPay:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du lancement du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const startPaymentStatusCheck = (transactionReference: string | undefined) => {
    if (!transactionReference) return;

    // Vérifier périodiquement le statut
    const interval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(transactionReference);
        
        if (status.status === 'completed' || status.status === 'success') {
          clearInterval(interval);
          completeOrder(status.orderId);
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          clearInterval(interval);
          toast.error('Paiement échoué ou annulé');
        }
      } catch (error) {
        console.error('Erreur vérification statut:', error);
      }
    }, 30000); // Vérifier toutes les 5 secondes

    // Arrêter après 10 minutes
    setTimeout(() => clearInterval(interval), 600000);
  };

  const processCardPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulation de traitement de carte bancaire
      await new Promise(resolve => setTimeout(resolve, 3000));
      completeOrder();
      
    } catch (error) {
      console.error('Erreur paiement carte:', error);
      toast.error('Erreur lors du traitement du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const completeOrder = (orderId?: string) => {
    const orderNumber = orderId || `CMD-${Date.now().toString().slice(-6)}`;
    
    toast.success('Paiement confirmé !', {
      description: `Numéro de commande: ${orderNumber}`
    });
    
    clearCart();
    localStorage.removeItem('currentTransaction');
    setCurrentTransaction(null);
    
    router.push(`/order-confirmation?order=${orderNumber}`);
  };

  const handlePayment = async () => {
    if (!acceptTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    if (paymentMethod === 'notchpay') {
      await initiateNotchPay();
    } else {
      await processCardPayment();
    }
  };




  const handleWhatsAppOrder = async () => {
  if (!acceptTerms) {
    toast.error('Veuillez accepter les conditions générales');
    return;
  }

  setIsProcessing(true);
  
  try {
    // Préparer les détails de la commande pour WhatsApp
    const orderDetails = items.map(item => 
      `• ${item.productName} (x${item.quantity}) - XAF ${(item.price * item.quantity).toFixed(2)}`
    ).join('%0A');
    
    const customizations = items.map(item => 
      item.customizations ? 
        `Personnalisation: ${JSON.stringify(item.customizations)}` : 
        ''
    ).filter(Boolean).join('%0A');
    
    const message = `Nouvelle commande CustomWorld%0A%0A` +
      `Client: ${formData.firstName} ${formData.lastName}%0A` +
      `Email: ${formData.email}%0A` +
      `Téléphone: ${formData.phone}%0A` +
      `Adresse: ${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}%0A%0A` +
      `Articles:%0A${orderDetails}%0A%0A` +
      `${customizations ? `${customizations}%0A%0A` : ''}` +
      `Livraison: ${selectedShipping.name}%0A` +
      `Total: XAF ${totalWithShipping.toFixed(2)}%0A%0A` +
      `Date: ${new Date().toLocaleString()}`;
    
    // Ouvrir WhatsApp avec le message pré-rempli
    // Remplacez VOTENUMERO par votre numéro WhatsApp (format international sans +)
    window.open(`https://wa.me/237655287884?text=${message}`, '_blank');
    
    // Enregistrer chaque produit de la commande via l'API
    for (const item of items) {
      const orderData = {
      
       
     
        deliveryAddress: `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}`,
     
        modeLivraison: selectedShipping.id === 'standard' ? 0 : 
                      selectedShipping.id === 'express' ? 1 : 2,
        phone: formData.phone
      };
      
      // Utilisation du service API
      const order = await createWhatsAppOrder(orderData);
      console.log('Commande enregistrée:', order);
    }
    
    toast.success('Commande envoyée avec succès!', {
      description: 'Notre équipe vous contactera rapidement sur WhatsApp'
    });
    
    clearCart();
    router.push('/order-confirmation?source=whatsapp');
    
  } catch (error) {
    console.error('Erreur commande WhatsApp:', error);
    toast.error('Une erreur est survenue lors de l\'envoi de la commande');
  } finally {
    setIsProcessing(false);
  }
};
  // Vérifier les transactions en cours au chargement
  useEffect(() => {
    const savedTransaction = localStorage.getItem('currentTransaction');
    if (savedTransaction) {
      setCurrentTransaction(savedTransaction);
      startPaymentStatusCheck(savedTransaction);
    }
  }, []);

  // ... le reste du code reste inchangé ...

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
        <div className="mb-8 mt-12">
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
                      placeholder="+237 6XXXXXXXX"
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
                        placeholder="ex : 0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Pays *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cameroun">Cameroun</SelectItem>
                          <SelectItem value="Gabon">Gabon</SelectItem>
                          <SelectItem value="Cote d'ivoire">Cote d'ivoire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={saveInfo}
                      onCheckedChange={checked => setSaveInfo(checked === true)}
                    />
                    <Label htmlFor="saveInfo" className="text-sm">
                      Sauvegarder ces informations pour une prochaine commande
                    </Label>
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.phone}
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
                        <span className="font-bold text-blue-600">XAF {method.price}</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continuer 
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
        Méthode de paiement
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Message d'indisponibilité des paiements en ligne */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Service de paiement temporairement indisponible
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Notre service de paiement en ligne est momentanément indisponible.
                Vous pouvez finaliser votre commande via WhatsApp et nous vous contacterons
                pour organiser le paiement et la livraison.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sélection de la méthode de paiement */}
      <div className="space-y-4">
        <Label>Choisissez votre méthode de paiement</Label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'card' 
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5" />
              <span>Carte bancaire</span>
            </div>
          </div>
          <div
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
              paymentMethod === 'notchpay' 
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('notchpay')}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5" />
              <span>Mobile Money</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de paiement selon la méthode choisie */}
      {paymentMethod === 'card' ? (
        <>
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
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <Label>Opérateur Mobile Money *</Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notchPayChannels.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Vous serez redirigé vers la plateforme de paiement sécurisée NotchPay pour finaliser votre transaction Mobile Money.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={checked => setAcceptTerms(checked === true)}
        />
        <Label htmlFor="acceptTerms" className="text-sm">
          J'accepte les <Link href="/terms" className="text-blue-600 hover:underline">conditions générales</Link> *
        </Label>
      </div>

      <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-2">
        <Lock className="h-5 w-5 text-green-600" />
        <span className="text-sm text-green-800">Paiement 100% sécurisé</span>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button
          onClick={handlePayment}
          disabled={true} // Bouton désactivé
          className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
        >
          Service indisponible
        </Button>
      </div>

      {/* Séparateur */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Ou</span>
        </div>
      </div>

      {/* Bouton de validation WhatsApp */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-medium text-lg mb-2">Finaliser via WhatsApp</h3>
        <p className="text-sm text-gray-600 mb-4">
          Cliquez ci-dessous pour nous envoyer les détails de votre commande via WhatsApp.
          Notre équipe vous contactera dans les plus brefs délais.
        </p>
        
        <Button 
          onClick={handleWhatsAppOrder}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isProcessing || !acceptTerms}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
          </svg>
          {isProcessing ? 'Traitement...' : 'Valider la commande via WhatsApp'}
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
                      src={item.imagePath}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.productName}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.customizations && 
                          Object.entries(item.customizations).map(([key, value]) => 
                            value && (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {value}
                              </Badge>
                            )
                          )
                        }
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Qté: {item.quantity}</span>
                        <span className="font-medium">XAF {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>XAF {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison ({selectedShipping.name})</span>
                    <span>XAF {selectedShipping.price.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">XAF {totalWithShipping.toFixed(2)}</span>
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