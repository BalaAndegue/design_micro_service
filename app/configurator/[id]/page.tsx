'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  RotateCcw, 
  ShoppingCart,
  Download,
  Share2,
  Heart,
  Star
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useCart } from '@/providers/cart-provider';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

const mockProduct = {
  id: 1,
  name: 'Coque iPhone 15 Pro',
  category: 'coques',
  basePrice: 24.99,
  description: 'Coque de protection premium pour iPhone 15 Pro',
  image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
  rating: 4.8,
  reviews: 156
};

const colorOptions = [
  { name: 'Noir', value: '#000000', premium: false },
  { name: 'Blanc', value: '#FFFFFF', premium: false },
  { name: 'Bleu', value: '#3B82F6', premium: false },
  { name: 'Rouge', value: '#EF4444', premium: false },
  { name: 'Vert', value: '#10B981', premium: false },
  { name: 'Violet', value: '#8B5CF6', premium: false },
  { name: 'Or Rose', value: '#F59E0B', premium: true, price: 5 },
  { name: 'Chromé', value: '#C0C0C0', premium: true, price: 8 }
];

const patternOptions = [
  { name: 'Aucun', value: 'none', price: 0 },
  { name: 'Rayures', value: 'stripes', price: 3 },
  { name: 'Points', value: 'dots', price: 3 },
  { name: 'Géométrique', value: 'geometric', price: 5 },
  { name: 'Floral', value: 'floral', price: 5 },
  { name: 'Abstrait', value: 'abstract', price: 7 }
];

const sizeOptions = [
  { name: 'iPhone 15', value: 'iphone15', price: 0 },
  { name: 'iPhone 15 Pro', value: 'iphone15pro', price: 0 },
  { name: 'iPhone 15 Pro Max', value: 'iphone15max', price: 2 }
];

export default function ConfiguratorPage() {
  const params = useParams();
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedPattern, setSelectedPattern] = useState(patternOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePrice = () => {
    let price = mockProduct.basePrice;
    if (selectedColor.premium) price += selectedColor.price || 0;
    price += selectedPattern.price;
    price += selectedSize.price;
    if (customText.trim()) price += 3; // Prix pour texte personnalisé
    return price;
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    // Simulation d'ajout au panier
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addItem({
      productId: mockProduct.id,
      name: mockProduct.name,
      price: calculatePrice(),
      quantity,
      image: mockProduct.image,
      customizations: {
        color: selectedColor.name,
        pattern: selectedPattern.name,
        text: customText || undefined,
        size: selectedSize.name
      }
    });

    toast.success('Produit ajouté au panier !', {
      description: `${quantity} x ${mockProduct.name} personnalisé`
    });
    
    setIsLoading(false);
  };

  const resetConfiguration = () => {
    setSelectedColor(colorOptions[0]);
    setSelectedPattern(patternOptions[0]);
    setSelectedSize(sizeOptions[0]);
    setCustomText('');
    setQuantity(1);
    toast.info('Configuration réinitialisée');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Aperçu du produit */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div 
                  className="w-64 h-80 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105"
                  style={{ 
                    backgroundColor: selectedColor.value,
                    backgroundImage: selectedPattern.value !== 'none' ? `url('/patterns/${selectedPattern.value}.png')` : 'none'
                  }}
                >
                  {customText && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="font-bold text-lg px-4 py-2 rounded"
                        style={{ 
                          color: selectedColor.value === '#FFFFFF' ? '#000000' : '#FFFFFF',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {customText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Informations produit */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{mockProduct.name}</h1>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(mockProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({mockProduct.reviews} avis)</span>
                </div>

                <p className="text-gray-600 mb-6">{mockProduct.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">€{calculatePrice().toFixed(2)}</span>
                    <span className="text-sm text-gray-500 ml-2">par unité</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configurateur */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Personnalisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="color" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="color">Couleur</TabsTrigger>
                    <TabsTrigger value="pattern">Motif</TabsTrigger>
                    <TabsTrigger value="text">Texte</TabsTrigger>
                    <TabsTrigger value="size">Taille</TabsTrigger>
                  </TabsList>

                  <TabsContent value="color" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Choisissez une couleur</Label>
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        {colorOptions.map((color) => (
                          <div
                            key={color.name}
                            className={`relative cursor-pointer p-2 rounded-lg border-2 transition-all ${
                              selectedColor.value === color.value 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedColor(color)}
                          >
                            <div
                              className="w-full h-12 rounded-md shadow-sm"
                              style={{ backgroundColor: color.value }}
                            />
                            <p className="text-xs text-center mt-1 font-medium">{color.name}</p>
                            {color.premium && (
                              <Badge className="absolute -top-1 -right-1 text-xs bg-orange-500">
                                +€{color.price}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pattern" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Motifs disponibles</Label>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {patternOptions.map((pattern) => (
                          <div
                            key={pattern.name}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                              selectedPattern.value === pattern.value 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedPattern(pattern)}
                          >
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm font-medium">{pattern.name}</p>
                              {pattern.price > 0 && (
                                <p className="text-xs text-blue-600">+€{pattern.price}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="custom-text" className="text-base font-medium">
                        Texte personnalisé (optionnel)
                      </Label>
                      <Input
                        id="custom-text"
                        type="text"
                        placeholder="Votre texte ici..."
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        maxLength={20}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{customText.length}/20 caractères</span>
                        {customText.trim() && <span className="text-blue-600">+€3.00</span>}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="size" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Taille</Label>
                      <div className="grid grid-cols-1 gap-3 mt-3">
                        {sizeOptions.map((size) => (
                          <div
                            key={size.name}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                              selectedSize.value === size.value 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{size.name}</span>
                              {size.price > 0 && (
                                <span className="text-blue-600">+€{size.price}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Récapitulatif et achat */}
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Produit de base</span>
                    <span>€{mockProduct.basePrice}</span>
                  </div>
                  
                  {selectedColor.premium && (
                    <div className="flex justify-between">
                      <span>Couleur premium ({selectedColor.name})</span>
                      <span>+€{selectedColor.price}</span>
                    </div>
                  )}
                  
                  {selectedPattern.price > 0 && (
                    <div className="flex justify-between">
                      <span>Motif ({selectedPattern.name})</span>
                      <span>+€{selectedPattern.price}</span>
                    </div>
                  )}
                  
                  {selectedSize.price > 0 && (
                    <div className="flex justify-between">
                      <span>Taille ({selectedSize.name})</span>
                      <span>+€{selectedSize.price}</span>
                    </div>
                  )}
                  
                  {customText.trim() && (
                    <div className="flex justify-between">
                      <span>Texte personnalisé</span>
                      <span>+€3.00</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">€{calculatePrice().toFixed(2)}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Label htmlFor="quantity">Quantité:</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isLoading ? 'Ajout en cours...' : `Ajouter au panier - €${(calculatePrice() * quantity).toFixed(2)}`}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetConfiguration}
                    className="w-full"
                    size="lg"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}