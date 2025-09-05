'use client';



import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid3X3, List } from 'lucide-react';
import { Header } from '@/components/layout/headerstes';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/providers/cart-provider';
import { fetchProducts ,Product, fetchCategories, Category} from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { useRouter , useSearchParams} from 'next/navigation';

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

export default function ProductsPage(
) {
  const searchParams  = new URLSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get('search') || ''
  );
  //const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState( 
    searchParams?.get('category') || 'all'
  );

  const { addItem } = useCart();
  const router = useRouter();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams();
    if (term) params.set('search', term);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    router.push(`/products?${params.toString()}`);
  };

  // Modifiez le handler de catégorie
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (value !== 'all') params.set('category', value);
    router.push(`/products?${params.toString()}`);
  };


  useEffect(() => {
      fetchCategories().then(setCategories).catch(err => {
        console.error("Erreur lors du chargement des catégories:", err);
        setError("Erreur lors du chargement des catégories");
      });
    }, []);
  

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des produits');
        console.error("Erreur lors du chargement des données:", err);
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
          return a.originalPrice || 0 - b.originalPrice ;
        case 'price-high':
          return b.originalPrice || 0 - a.originalPrice;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.new ? 1 : 0) - (a.new ? 1 : 0);
        default:
          return (b.reviews || 0) - (a.reviews || 0);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
          <p className="text-gray-600">Découvrez notre collection complète de produits personnalisables</p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)} 
                  className="pl-10"
                />
              </div>

              {/* Catégorie */}
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tri */}
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

            {/* Mode d'affichage */}
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

          {!isLoading && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Gestion des erreurs */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        <div className={`${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }`}>
          {isLoading ? (
            // Afficher des squelettes pendant le chargement
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <ProductCardSkeleton viewMode={viewMode} />
                </CardContent>
              </Card>
            ))
          ) : (
            // Afficher les produits une fois chargés
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
                
              />
            ))
          )}
        </div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces critères</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
