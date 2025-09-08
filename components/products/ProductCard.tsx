import { Product } from '@/lib/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/providers/cart-provider';
import { useState ,useEffect} from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ProductCard({
  product,
  viewMode
}: {
  product: Product;
  viewMode: 'grid' | 'list';
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { addItem, authError } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    // Si l'utilisateur n'est pas connecté, afficher le dialogue de connexion
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setIsAdding(true);
      
      await addItem({
        id: product.id,
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        imagePath: product.imagePath,
        isCustomized:true,
        customizations: {}
      });
      
      toast.success('Produit ajouté au panier !');
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

  // Écouter les changements d'erreur d'authentification du panier
  useEffect(() => {
    if (authError) {
      setShowLoginDialog(true);
    }
  }, [authError]);

  const handleLogin = () => {
    setShowLoginDialog(false);
    router.push('/auth/login');
  };

  const handleRegister = () => {
    setShowLoginDialog(false);
    router.push('/auth/register');
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {viewMode === 'grid' ? (
          <>
            <div className="relative flex-shrink-0">
              <img
                src={product.imagePath}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.new && <Badge className="bg-green-500">Nouveau</Badge>}
                {product.onSale && <Badge className="bg-red-500">Promo</Badge>}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-lg" />
            </div>
            <CardContent className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">({product.reviews || 0})</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">XAF {product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price  && (
                    <span className="text-sm text-gray-500 line-through">XAF {product.originalPrice}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link href={`/products/configurator/${product.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                    Personnaliser
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isAdding ? '...' : ''}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="p-6">
            <div className="flex gap-4">
              <img
                src={product.imagePath}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({product.reviews || 0})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-blue-600">XAF {product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">XAF {product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/configurator/${product.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                          Personnaliser
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {isAdding ? '...' : ''}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

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
    </>
  );
}