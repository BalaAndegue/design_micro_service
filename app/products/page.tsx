'use client';
/*
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, Filter, Grid3X3, List, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { useCart } from '@/providers/cart-provider';

const products = [
  {
    id: 1,
    name: 'Coque iPhone 15 Pro',
    category: 'coques',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isOnSale: true,
    colors: ['Noir', 'Blanc', 'Bleu', 'Rouge']
  },
  {
    id: 2,
    name: 'Montre Connectée Sport',
    category: 'montres',
    price: 199.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 89,
    isNew: true,
    isOnSale: false,
    colors: ['Noir', 'Argent', 'Or Rose']
  },
  {
    id: 3,
    name: 'T-Shirt Premium Coton',
    category: 'vetements',
    price: 29.99,
    image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 234,
    isNew: false,
    isOnSale: false,
    colors: ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge']
  },
  {
    id: 4,
    name: 'Mug Céramique Premium',
    category: 'accessoires',
    price: 16.99,
    originalPrice: 19.99,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 178,
    isNew: false,
    isOnSale: true,
    colors: ['Blanc', 'Noir', 'Bleu', 'Rouge']
  },
  {
    id: 5,
    name: 'Coque Samsung Galaxy S24',
    category: 'coques',
    price: 22.99,
    image: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 92,
    isNew: true,
    isOnSale: false,
    colors: ['Transparent', 'Noir', 'Blanc']
  },
  {
    id: 6,
    name: 'Casquette Personnalisée',
    category: 'vetements',
    price: 24.99,
    image: 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 67,
    isNew: false,
    isOnSale: false,
    colors: ['Noir', 'Blanc', 'Bleu Marine', 'Rouge']
  }
];

const categories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'coques', label: 'Coques' },
  {value :'telephones', label: 'Téléphones'},
  {value: 'tablettes', label: 'Tablettes'},
  {value:'ordinateurs', label: 'Ordinateurs'},
  { value: 'montres', label: 'Montres' },
  { value: 'vetements', label: 'Vêtements' },
  { value: 'accessoires', label: 'Accessoires' }
];

const sortOptions = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'rating', label: 'Mieux notés' }
];


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

const sizeOptions = [
  { name: 'iPhone 15', value: 'iphone15', price: 0 },
  { name: 'iPhone 15 Pro', value: 'iphone15pro', price: 0 },
  { name: 'iPhone 15 Pro Max', value: 'iphone15max', price: 2 }
];


export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);

  const { addItem } = useCart();
    
  const [selectedProduct, setSelectedProduct] = useState(products[1]); // par défaut le premier produit

    
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedPattern, setSelectedPattern] = useState(patternOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  
  

  const calculatePrice = () => {
  let price = selectedProduct.price; // utiliser le prix du produit sélectionné
  if (selectedColor.premium) price += selectedColor.price || 0;
  price += selectedPattern.price;
  price += selectedSize.price;
  if (customText.trim()) price += 3;
  if (uploadedImage) price += 5; // Prix supplémentaire pour image personnalisée
  return price;
};

  const handleAddToCart = async () => {
  console.log('message produit ajouté au panier:', selectedProduct.name);
  setIsLoading(true);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  addItem({
    productId: selectedProduct.id,
    name: selectedProduct.name,
    price: calculatePrice(),
    quantity,
    image: uploadedImage || selectedProduct.image,
    customizations: {
      color: selectedColor.name,
      pattern: selectedPattern.name,
      text: customText || undefined,
      size: selectedSize.name,
      customImage: uploadedImage ? true : undefined
    }
  });
  
  setIsLoading(false);
};



  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return b.reviews - a.reviews;
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        */{/* Page Header */}/*
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
          <p className="text-gray-600">Découvrez notre collection complète de produits personnalisables</p>
        </div>

        */{/* Filtres et recherche */}/*
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              */{/* Recherche */}/*
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              */{/* Catégorie */}/*
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              */{/* Tri */}/*
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            */{/* Mode d'affichage */}/*
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </div>

        */{/* Liste des produits */}/*
        <div className={`${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              {viewMode === 'grid' ? (
                <>
                  <div className="relative">
                    <img
                      src={product.image}
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
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
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
                      <Link href={`/configurator/${product.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                          Personnaliser
                        </Button>
                      </Link>
                      <Button
                       size="sm"
                       variant="outline"
                       onClick={handleAddToCart}
                       disabled={isLoading}>
                        <ShoppingCart className="h-4 w-4" />
                        {isLoading ? '...' : ``}
                      </Button>
                      
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={product.image}
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
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
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
                            <Link href={`/configurator/${product.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                                Personnaliser
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces critères</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}*/





import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, Filter, Grid3X3, List, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { useCart } from '@/providers/cart-provider';
import { fetchProducts, Product } from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';

const categories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'coques', label: 'Coques' },
  { value: 'telephones', label: 'Téléphones' },
  { value: 'tablettes', label: 'Tablettes' },
  { value: 'ordinateurs', label: 'Ordinateurs' },
  { value: 'montres', label: 'Montres' },
  { value: 'vetements', label: 'Vêtements' },
  { value: 'accessoires', label: 'Accessoires' }
];

const sortOptions = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'rating', label: 'Mieux notés' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error("erreur survenu lors du chargement des donnees "+err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.reviews || 0) - (a.reviews || 0);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... (le reste de ton JSX existant) ... */}
        */{/* Page Header */}/*
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
          <p className="text-gray-600">Découvrez notre collection complète de produits personnalisables</p>
        </div>

        */{/* Filtres et recherche */}/*
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              */{/* Recherche */}/*
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              */{/* Catégorie */}/*
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              */{/* Tri */}/*
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            */{/* Mode d'affichage */}/*
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Liste des produits */}
        <div className={`${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
              onAddToCart={addItem}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces critères</p>
          </div>
        )}
        {/* ... */}
      </div>

      <Footer />
    </div>
  );
}
