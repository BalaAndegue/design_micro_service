// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchStats, fetchProducts, createProduct,  deleteProduct, Product, updateProduct } from '@/lib/api/products';
import { fetchUsers,  User } from '@/lib/api/users';
import { isAdmin, isvendor } from '@/lib/auth';

import VendorSidebar from '@/components/VendorSidebar';
import ProductsManagement from '@/components/ProductsManagement';
import DashboardStats from '@/components/DashboardStats';

export interface Stats {
  totalProducts: number;
  totalUsers: number;
  categories: Array<{ category: string; count: number }>;
  onSaleProducts: number;
  newUsersThisMonth: number;
}


export type ActiveSection = 'dashboard' | 'products' | 'orders' | 'settings';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isvendor()) {
      router.push('/auth/login');
      setError('Accès réservé aux vendeurs');
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setProductsLoading(true);

        const ProductsData = await fetchProducts();
        setProducts(ProductsData);
        setProductsLoading(false);

        setUsersLoading(true);
        const usersData = await fetchUsers();
        setUsers(usersData);
        setUsersLoading(false);
        // Chargement des statistiques, produits et utilisateurs en parallèle
        const [statsData] = await Promise.all([
          fetchStats(),
    
          
        ]);
        setStats(statsData);
        
        
      } catch (err) {
        setError('Échec du chargement des données');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createProduct(productData);
      setProducts([...products, created]);
      return { success: true };
    } catch (err) {
      setError('Échec de la création du produit');
      return { success: false, error: 'Échec de la création du produit' };
    }
  };

 const handleUpdateProduct = async (id: number, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const updated = await updateProduct(id, productData);
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    return { success: true };
  } catch (err) {
    setError('Échec de la mise à jour du produit');
    return { success: false, error: 'Échec de la mise à jour du produit' };
  }
};

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      setError('Échec de la suppression du produit');
      return { success: false, error: 'Échec de la suppression du produit' };
    }
  };

  
  const renderActiveSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats stats={stats} products={products} users={users} />;
      case 'products':
        return (
          <ProductsManagement
            products={products}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
     
      case 'orders':
        return <div className="p-6">Gestion des commandes - À implémenter</div>;
      case 'settings':
        return <div className="p-6">Paramètres - À implémenter</div>;
      default:
        return <DashboardStats stats={stats} products={products} users={users} />;
    }
  };

  if (error && !isAdmin()) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h- , screen bg-gray-100">
      <VendorSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeSection === 'dashboard' && 'Tableau de Bord'}
              {activeSection === 'products' && 'Gestion des Produits'}
              
              {activeSection === 'orders' && 'Gestion des Commandes'}
              {activeSection === 'settings' && 'Paramètres'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    V
                  </div>
                  <span className="text-gray-700">Vendeur</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
              <button onClick={() => setError(null)} className="absolute top-0 right-0 p-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}
          
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}