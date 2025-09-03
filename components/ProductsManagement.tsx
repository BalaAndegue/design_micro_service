// components/ProductsManagement.tsx
'use client';
import { useState, useEffect } from 'react';
import { Product, Category, fetchCategories } from '@/lib/api/products';
import { useCart } from '@/providers/cart-provider';
import { Search, Grid3X3, List, Filter, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sortOptions = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'date-added', label: 'Date d\'ajout' }
];

interface ProductsManagementProps {
  products: Product[];
  onCreateProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  onUpdateProduct: (id: number, product: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  onDeleteProduct: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export default function ProductsManagement({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductsManagementProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    originalPrice: 0,
    imagePath: '',
    new: false,
    onSale: false,
    color: [],
    sizes: [],
    patterns: [],
    rating: 0,
    reviews: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { addItem } = useCart();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onCreateProduct(newProduct);
    if (result.success) {
      setIsCreateModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: 0,
        originalPrice: 0,
        imagePath: '',
        new: false,
        onSale: false,
        color: [],
        sizes: [],
        patterns: [],
        rating: 0,
        reviews: 0,
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    const result = await onUpdateProduct(editingProduct.id, {
      name: editingProduct.name,
      description: editingProduct.description,
      category: editingProduct.category,
      price: editingProduct.price,
      originalPrice: editingProduct.originalPrice,
      imagePath: editingProduct.imagePath,
      new: editingProduct.new,
      onSale: editingProduct.onSale,
      color: editingProduct.color,
      sizes: editingProduct.sizes,
      patterns: editingProduct.patterns,
    });
    
    if (result.success) {
      setEditingProduct(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await onDeleteProduct(id);
    }
  };

  const handleArrayInput = (field: 'color' | 'sizes' | 'patterns', value: string, isEditing: boolean) => {
    const values = value.split(',').map((v) => v.trim()).filter((v) => v);
    if (isEditing && editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: values });
    } else {
      setNewProduct({ ...newProduct, [field]: values });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
  };

  useEffect(() => {
    fetchCategories().then(setCategories).catch(err => {
      console.error("Erreur lors du chargement des catégories:", err);
      setError("Erreur lors du chargement des catégories");
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    try {
      let filtered = products.filter(product => {
        const matchesSearch = searchTerm === '' || 
                             product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        
        // Filtre par date (ici on utilise createdAt comme exemple)
        let matchesDate = true;
        if (dateFilter !== 'all' && product.createdAt) {
          const productDate = new Date(product.createdAt);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - productDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (dateFilter === 'today' && diffDays > 1) matchesDate = false;
          if (dateFilter === 'week' && diffDays > 7) matchesDate = false;
          if (dateFilter === 'month' && diffDays > 30) matchesDate = false;
        }
        
        return matchesSearch && matchesCategory && matchesDate;
      });

      // Tri
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.originalPrice || a.price) - (b.originalPrice || b.price);
          case 'price-high':
            return (b.originalPrice || b.price) - (a.originalPrice || a.price);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'newest':
            return (b.new ? 1 : 0) - (a.new ? 1 : 0);
          case 'date-added':
            // Trier par date de création (les plus récents d'abord)
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
          default:
            return (b.reviews || 0) - (a.reviews || 0);
        }
      });

      setFilteredProducts(filtered);
      setError(null);
    } catch (err) {
      setError("Erreur lors du filtrage des produits");
      console.error("Erreur de filtrage:", err);
    } finally {
      setIsLoading(false);
    }
  }, [products, searchTerm, selectedCategory, sortBy, dateFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Produits</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter un Produit
        </button>
      </div>

      {/* Filtres et recherche améliorés */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
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

            {/* Bouton pour afficher/masquer les filtres */}
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </Button>

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

          {/* Filtres avancés (affichés conditionnellement) */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'ajout</label>
                <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les dates</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
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
            </div>
          )}
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

      {/* Tableau des produits */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'ajout
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {product.imagePath ? (
                        <img className="h-10 w-10 rounded-md object-cover" src={product.imagePath} alt={product.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <span>🛍️</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price}€
                  {product.originalPrice > product.price && (
                    <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice}€</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.onSale ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.onSale ? 'En promo' : 'Standard'}
                    {product.new && ' • Nouveau'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Ajouter un nouveau produit</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix original</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                  <input
                    type="text"
                    value={newProduct.imagePath}
                    onChange={(e) => setNewProduct({ ...newProduct, imagePath: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleurs (séparées par des virgules)</label>
                  <input
                    type="text"
                    onChange={(e) => handleArrayInput('color', e.target.value, false)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tailles (séparées par des virgules)</label>
                  <input
                    type="text"
                    onChange={(e) => handleArrayInput('sizes', e.target.value, false)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motifs (séparés par des virgules)</label>
                  <input
                    type="text"
                    onChange={(e) => handleArrayInput('patterns', e.target.value, false)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={newProduct.new}
                      onChange={(e) => setNewProduct({ ...newProduct, new: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Nouveau produit</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={newProduct.onSale}
                      onChange={(e) => setNewProduct({ ...newProduct, onSale: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">En promotion</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Modifier le produit</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix original</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                  <input
                    type="text"
                    value={editingProduct.imagePath}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imagePath: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleurs (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={editingProduct.color?.join(', ') || ''}
                    onChange={(e) => handleArrayInput('color', e.target.value, true)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tailles (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={editingProduct.sizes?.join(', ') || ''}
                    onChange={(e) => handleArrayInput('sizes', e.target.value, true)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motifs (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={editingProduct.patterns?.join(', ') || ''}
                    onChange={(e) => handleArrayInput('patterns', e.target.value, true)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={editingProduct.new}
                      onChange={(e) => setEditingProduct({ ...editingProduct, new: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Nouveau produit</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={editingProduct.onSale}
                      onChange={(e) => setEditingProduct({ ...editingProduct, onSale: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">En promotion</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}