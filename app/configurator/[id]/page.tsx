'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchProductById, Product } from '@/lib/api/products';
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
  Star,
  Upload,
  Smartphone,
  Shirt,
  Watch,
  Laptop
} from 'lucide-react';
import { Header } from '@/components/layout/headerstes';
import { useCart } from '@/providers/cart-provider';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import FloatingCart from '@/components/FloatingCart';

// Modèles de produits par catégorie
const productModels = {
  smartphone: {
    name: "Smartphone",
    icon: Smartphone,
    preview: <div className="w-64 h-80 rounded-3xl bg-black border-8 border-gray-800 relative overflow-hidden" />,
    aspect: "aspect-[9:19]"
  },
  tshirt: {
    name: "T-Shirt",
    icon: Shirt,
    preview: <div className="w-64 h-80 bg-white border-2 border-gray-200 relative" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)" }} />,
    aspect: "aspect-[3:4]"
  },
  case: {
    name: "Coque",
    icon: Smartphone,
    preview: <div className="w-64 h-80 rounded-2xl bg-transparent border-4 border-gray-300 relative overflow-hidden" />,
    aspect: "aspect-[9:19]"
  },
  watch: {
    name: "Montre",
    icon: Watch,
    preview: <div className="w-64 h-64 rounded-full bg-black border-4 border-gray-700 relative overflow-hidden" />,
    aspect: "aspect-square"
  },
  laptop: {
    name: "Ordinateur",
    icon: Laptop,
    preview: <div className="w-80 h-64 bg-gray-300 rounded-lg relative">
      <div className="absolute bottom-0 w-full h-1 bg-gray-400" />
    </div>,
    aspect: "aspect-[16:10]"
  }
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
  { name: 'Aucun', value: 'none', price: 0, image: null },
  { name: 'Rayures', value: 'stripes', price: 3, image: '/patterns/stripes.png' },
  { name: 'Points', value: 'dots', price: 3, image: '/patterns/dots.png' },
  { name: 'Géométrique', value: 'geometric', price: 5, image: '/patterns/geometric.png' },
  { name: 'Floral', value: 'floral', price: 5, image: '/patterns/floral.png' },
  { name: 'Abstrait', value: 'abstract', price: 7, image: '/patterns/abstract.png' }
];

const fontOptions = [
  { name: 'Classique', value: 'font-sans' },
  { name: 'Moderne', value: 'font-mono' },
  { name: 'Élégant', value: 'font-serif' },
  { name: 'Manuscrit', value: 'font-handwriting' }
];

export default function ConfiguratorPage() {
  const params = useParams();
  const { addItemcustom, authError } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: 'Chargement...',
    rating: 0,
    price: 0,
    category: '',
    originalPrice: 0,
    description: '',
    imagePath: '/placeholder.jpg',
    reviews: 0
  });
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedPattern, setSelectedPattern] = useState(patternOptions[0]);
  const [customText, setCustomText] = useState('');
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Déterminer le modèle de produit basé sur la catégorie
  const getProductModel = (category: string) => {
    if (category.includes('phone') || category.includes('smartphone')) return productModels.smartphone;
    if (category.includes('tshirt') || category.includes('shirt')) return productModels.tshirt;
    if (category.includes('case') || category.includes('coque')) return productModels.case;
    if (category.includes('watch') || category.includes('montre')) return productModels.watch;
    if (category.includes('laptop') || category.includes('ordinateur')) return productModels.laptop;
    return productModels.smartphone; // Par défaut
  };

  const productModel = getProductModel(product.category);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoadingProduct(true);
        //const productId = params.id as string;
        const data = await fetchProductById("6");
        setProduct(data);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error(err);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [params.id]);

  // Écouter les changements d'erreur d'authentification du panier
  useEffect(() => {
    if (authError) {
      setShowLoginDialog(true);
    }
  }, [authError]);

  const calculatePrice = (): number => {
    return [
      product?.originalPrice ?? 0,
      selectedColor.premium ? (selectedColor.price ?? 0) : 0,
      selectedPattern.price ?? 0,
      customText.trim() ? 3 : 0,
      uploadedImage ? 5 : 0
    ].reduce((sum, price) => sum + price, 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 5MB)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    // Si l'utilisateur n'est pas connecté, afficher le dialogue de connexion
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setIsAdding(true);
      
      await addItemcustom({
        id: product.id,
        productId: product.id,
        productName: product.name,
        price: calculatePrice(),
        quantity: quantity,
        imagePath: uploadedImage || product.imagePath || '',
        customized: true,
        customizations: {
          color: selectedColor.name,
          pattern: selectedPattern.name,
          text: customText || undefined,
          font: selectedFont.name,
          customImage: uploadedImage ? true : undefined,
          additionalNotes: additionalNotes || undefined
        }
      });
      
      toast.success('Produit ajouté au panier !', {
        description: `${quantity} x ${product.name} personnalisé`
      });
      
      // Ouvrir WhatsApp après l'ajout au panier
      handleWhatsAppOrder();
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Si l'erreur est une erreur d'authentification, afficher le dialogue
      if (error instanceof Error && error.message.includes('authentification')) {
        setShowLoginDialog(true);
      } else {
        toast.error('Erreur lors de l\'ajout au panier');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleWhatsAppOrder = () => {
  const totalPrice = calculatePrice() * quantity;
  const productInfo = `
*Nouvelle Commande Personnalisée*
-----------------------------
*Produit:* ${product.name}
*Quantité:* ${quantity}
*Prix Unitaire:* XAF ${calculatePrice().toFixed(2)}
*Prix Total:* XAF ${totalPrice.toFixed(2)}

*Personnalisation:*
- Couleur: ${selectedColor.name}
- Motif: ${selectedPattern.name}
${customText ? `- Texte: "${customText}" (Style: ${selectedFont.name})\n` : ''}
${uploadedImage ? '- Image personnalisée incluse\n' : ''}
${additionalNotes ? `\n*Notes supplémentaires:*\n${additionalNotes}` : ''}
  `.trim();

  // Nettoyer le numéro de téléphone
  const cleanPhoneNumber = '+237655287884'.replace(/\D/g, '');
  
  // Encoder le message pour URL
  const encodedMessage = encodeURIComponent(productInfo);
  
  // Déterminer l'URL à utiliser en fonction de l'appareil
  let whatsappUrl;
  
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Mobile - utiliser le schéma d'application
    whatsappUrl = `whatsapp://send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
  } else {
    // Desktop - utiliser le site web
    whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;
  }
  
  // Ouvrir WhatsApp
  window.location.href = whatsappUrl;
};

  const handleLogin = () => {
    setShowLoginDialog(false);
    router.push('/auth/login');
  };

  const handleRegister = () => {
    setShowLoginDialog(false);
    router.push('/auth/register');
  };

  const resetConfiguration = () => {
    setSelectedColor(colorOptions[0]);
    setSelectedPattern(patternOptions[0]);
    setSelectedFont(fontOptions[0]);
    setCustomText('');
    setQuantity(1);
    setUploadedImage(null);
    setAdditionalNotes('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Configuration réinitialisée');
  };

  const downloadPreview = () => {
    setIsGeneratingPreview(true);
    // Simulation de génération d'aperçu
    setTimeout(() => {
      toast.success('Aperçu téléchargé!');
      setIsGeneratingPreview(false);
    }, 1500);
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full" />
            <div className="space-y-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || 'Produit non trouvé'}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Aperçu du produit */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <productModel.icon className="h-5 w-5 mr-2" />
                  Aperçu {productModel.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center justify-center ${productModel.aspect} relative`}>
                  <div className="relative" style={{ transform: 'scale(0.9)' }}>
                    {/* Modèle de produit */}
                    {productModel.preview}
                    
                    {/* Zone de personnalisation */}
                    <div 
                      className="absolute inset-4 rounded-lg overflow-hidden"
                      style={{ backgroundColor: selectedColor.value }}
                    >
                      {/* Image uploadée ou image par défaut */}
                      {uploadedImage ? (
                        <img 
                          src={uploadedImage} 
                          alt="Custom upload" 
                          className="w-full h-full object-cover"
                        />
                      ) : product.imagePath ? (
                        <img 
                          src={product.imagePath} 
                          alt={product.name} 
                          className="w-full h-full object-cover opacity-70"
                        />
                      ) : null}
                      
                      {/* Motif */}
                      {selectedPattern.value !== 'none' && selectedPattern.image && (
                        <div 
                          className="absolute inset-0 w-full h-full opacity-50"
                          style={{ 
                            backgroundImage: `url(${selectedPattern.image})`,
                            backgroundSize: 'cover',
                            mixBlendMode: 'overlay'
                          }}
                        />
                      )}
                      
                      {/* Texte personnalisé */}
                      {customText && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <span 
                            className={`font-bold text-center max-w-full break-words px-4 py-2 rounded ${selectedFont.value}`}
                            style={{ 
                              color: selectedColor.value === '#FFFFFF' ? '#000000' : '#FFFFFF',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                              fontSize: '1.2rem'
                            }}
                          >
                            {customText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section d'upload d'image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Image personnalisée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-image" className="text-base font-medium">
                      Ajouter votre propre image
                    </Label>
                    {uploadedImage && (
                      <Badge className="bg-blue-600">+XAF 5.00</Badge>
                    )}
                  </div>
                  
                  <input
                    id="custom-image"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadedImage ? 'Changer l\'image' : 'Téléverser une image'}
                  </Button>
                  
                  {uploadedImage && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedImage(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes supplémentaires */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Instructions supplémentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Ajoutez des instructions spécifiques pour votre personnalisation..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Configurateur */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Palette className="h-5 w-5 mr-2" />
                  Personnalisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="color" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="color">Couleur</TabsTrigger>
                    <TabsTrigger value="pattern">Motif</TabsTrigger>
                    <TabsTrigger value="text">Texte</TabsTrigger>
                  </TabsList>

                  <TabsContent value="color" className="space-y-4 pt-4">
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
                              +XAF {color.price}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="pattern" className="space-y-4 pt-4">
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
                            {pattern.image ? (
                              <div className="h-20 mb-2 relative">
                                <img 
                                  src={pattern.image} 
                                  alt={pattern.name}
                                  className="h-full w-full object-cover rounded"
                                />
                              </div>
                            ) : (
                              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            )}
                            <p className="text-sm font-medium">{pattern.name}</p>
                            {pattern.price > 0 && (
                              <p className="text-xs text-blue-600">+XAF {pattern.price}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4 pt-4">
                    <div className="space-y-4">
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
                          {customText.trim() && <span className="text-blue-600">+XAF 3.00</span>}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium">Style de police</Label>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {fontOptions.map((font) => (
                            <div
                              key={font.name}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center ${
                                selectedFont.value === font.value 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-gray-200 hover:border-gray-300'
                              } ${font.value}`}
                              onClick={() => setSelectedFont(font)}
                            >
                              <p className="text-sm font-medium">{font.name}</p>
                              <p className="text-xs">AaBbCc</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Récapitulatif et commande */}
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Produit de base</span>
                    <span>XAF {product.originalPrice}</span>
                  </div>
                  
                  {selectedColor.premium && (
                    <div className="flex justify-between">
                      <span>Couleur premium ({selectedColor.name})</span>
                      <span>+XAF {selectedColor.price}</span>
                    </div>
                  )}
                  
                  {selectedPattern.price > 0 && (
                    <div className="flex justify-between">
                      <span>Motif ({selectedPattern.name})</span>
                      <span>+XAF {selectedPattern.price}</span>
                    </div>
                  )}
                  
                  {customText.trim() && (
                    <div className="flex justify-between">
                      <span>Texte personnalisé</span>
                      <span>+XAF 3.00</span>
                    </div>
                  )}
                  
                  {uploadedImage && (
                    <div className="flex justify-between">
                      <span>Image personnalisée</span>
                      <span>+XAF 5.00</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">XAF {calculatePrice().toFixed(2)}</span>
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
                    disabled={isAdding}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAdding ? 'Ajout en cours...' : `Ajouter au panier - XAF ${(calculatePrice() * quantity).toFixed(2)}`}
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={downloadPreview}
                      disabled={isGeneratingPreview}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGeneratingPreview ? 'Génération...' : 'Aperçu'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetConfiguration}
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogue de connexion */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
            <DialogDescription>
              Vous devez être connecté pour ajouter des articles au panier.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3 mt-4">
            <Button onClick={handleLogin} className="w-full">
              Se connecter
            </Button>
            
            <Button onClick={handleRegister} variant="outline" className="w-full">
              Créer un compte
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setShowLoginDialog(false)}
            >
              Continuer sans se connecter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <FloatingCart/>
    </div>
  );
}