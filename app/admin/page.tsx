// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchStats, fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api/products';
import { isAdmin } from '@/lib/auth';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  colors?: string[];
  sizes?: string[];
  patterns?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Stats {
  totalProducts: number;
  categories: Array<{ category: string; count: number }>;
  onSaleProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    imageUrl: '',
    isNew: false,
    isOnSale: false,
    colors: [],
    sizes: [],
    patterns: [],
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('auth/login');
      setError('Accès réservé aux administrateurs');
      return;
    }

    const loadData = async () => {
      try {
        const [statsData, productsData] = await Promise.all([fetchStats(), fetchProducts()]);
        setStats(statsData);
        setProducts(productsData);
      } catch (err) {
        setError('Échec du chargement des données');
      }
    };
    loadData();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createProduct(newProduct);
      setProducts([...products, created]);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: 0,
        imageUrl: '',
        isNew: false,
        isOnSale: false,
        colors: [],
        sizes: [],
        patterns: [],
      });
    } catch (err) {
      setError('Échec de la création du produit');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const updated = await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice,
        imageUrl: editingProduct.imageUrl,
        isNew: editingProduct.isNew,
        isOnSale: editingProduct.isOnSale,
        colors: editingProduct.colors,
        sizes: editingProduct.sizes,
        patterns: editingProduct.patterns,
      });
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
    } catch (err) {
      setError('Échec de la mise à jour du produit');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError('Échec de la suppression du produit');
    }
  };

  const handleArrayInput = (
    field: 'colors' | 'sizes' | 'patterns',
    value: string,
    isEditing: boolean,
  ) => {
    const values = value.split(',').map((v) => v.trim()).filter((v) => v);
    if (isEditing && editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: values });
    } else {
      setNewProduct({ ...newProduct, [field]: values });
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Admin</h1>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Total Produits</h2>
            <p className="text-2xl">{stats.totalProducts}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Produits en Promotion</h2>
            <p className="text-2xl">{stats.onSaleProducts}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Catégories</h2>
            <ul>
              {stats.categories.map((cat) => (
                <li key={cat.category}>
                  {cat.category}: {cat.count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Formulaire de Création */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un Produit</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Prix"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Prix original (optionnel)"
            value={newProduct.originalPrice || ''}
            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) || undefined })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="URL de l'image"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Couleurs (séparées par des virgules)"
            onChange={(e) => handleArrayInput('colors', e.target.value, false)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Tailles (séparées par des virgules)"
            onChange={(e) => handleArrayInput('sizes', e.target.value, false)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Motifs (séparés par des virgules)"
            onChange={(e) => handleArrayInput('patterns', e.target.value, false)}
            className="border p-2 rounded"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newProduct.isNew}
              onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
              className="mr-2"
            />
            Nouveau
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newProduct.isOnSale}
              onChange={(e) => setNewProduct({ ...newProduct, isOnSale: e.target.checked })}
              className="mr-2"
            />
            En promotion
          </label>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Ajouter
          </button>
        </form>
      </div>

      {/* Liste des Produits */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Produits</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nom</th>
              <th className="border p-2">Catégorie</th>
              <th className="border p-2">Prix</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">{product.price}€</td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulaire de Modification */}
      {editingProduct && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Modifier le Produit</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Prix"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Prix original (optionnel)"
              value={editingProduct.originalPrice || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) || undefined })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="URL de l'image"
              value={editingProduct.imageUrl}
              onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Couleurs (séparées par des virgules)"
              value={editingProduct.colors?.join(', ') || ''}
              onChange={(e) => handleArrayInput('colors', e.target.value, true)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Tailles (séparées par des virgules)"
              value={editingProduct.sizes?.join(', ') || ''}
              onChange={(e) => handleArrayInput('sizes', e.target.value, true)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Motifs (séparés par des virgules)"
              value={editingProduct.patterns?.join(', ') || ''}
              onChange={(e) => handleArrayInput('patterns', e.target.value, true)}
              className="border p-2 rounded"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editingProduct.isNew}
                onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                className="mr-2"
              />
              Nouveau
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editingProduct.isOnSale}
                onChange={(e) => setEditingProduct({ ...editingProduct, isOnSale: e.target.checked })}
                className="mr-2"
              />
              En promotion
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Mettre à jour
            </button>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
}