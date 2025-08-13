import { Product } from '@/lib/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { CartItem } from '@/providers/cart-provider';

export function ProductCard({
  product,
  viewMode,
  onAddToCart
}: {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      {viewMode === 'grid' ? (
        <>
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && <Badge className="bg-green-500">Nouveau</Badge>}
              {product.isOnSale && <Badge className="bg-red-500">Promo</Badge>}
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-lg" />
          </div>
          <CardContent className="p-4">
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
                <span className="text-lg font-bold text-blue-600">€{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/products/configurator/${product.id}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                  Personnaliser
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddToCart(
                    { productId: product.id, 
                        name: product.name, 
                        price: product.price, 
                        quantity: 1,
                        image: product.imageUrl,
                        customizations: {}
                })}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="p-6">
          <div className="flex gap-4">
            <img
              src={product.imageUrl}
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
                    <span className="text-lg font-bold text-blue-600">€{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
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
                      onClick={() => onAddToCart({ productId: product.id, 
                        name: product.name, 
                        price: product.price, 
                        quantity: 1,
                        image: product.imageUrl,
                        customizations: {}
                })}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}