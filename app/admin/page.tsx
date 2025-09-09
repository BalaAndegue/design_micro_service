'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchStats, fetchProducts, createProduct, deleteProduct, Product, updateProduct } from '@/lib/api/products';
import { fetchUsers, createUser, updateUser, deleteUser, User, UserRole } from '@/lib/api/users';
import { isAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import ProductsManagement from '@/components/ProductsManagement';
import UsersManagement from '@/components/UsersManagement';
import DashboardStats from '@/components/DashboardStats';
import Link from 'next/link';
import { Home, Menu, Bell, X } from 'lucide-react';
import { toast } from 'sonner';

export interface Stats {
  totalProducts: number;
  totalUsers: number;
  categories: Array<{ category: string; count: number }>;
  onSaleProducts: number;
  newUsersThisMonth: number;
}

export type ActiveSection = 'dashboard' | 'products' | 'users' | 'orders' | 'settings';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  // Fonctions pour gérer l'état mobile
  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/auth/login');
      setError('Accès réservé aux administrateurs');
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

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const created = await createUser(userData);
      setUsers([...users, created]);
      return { success: true };
    } catch (err) {
      setError('Échec de la création de l\'utilisateur');
      return { success: false, error: 'Échec de la création de l\'utilisateur' };
    }
  };

  const handleUpdateUser = async (id: number, newRole: UserRole) => {
    try {
      const updateData: Partial<User> = { role: newRole };
      const updated = await updateUser(id, updateData);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      toast.success('Rôle utilisateur mis à jour');
      return { success: true };
    } catch (err) {
      setError('Échec de la mise à jour de l\'utilisateur');
      toast.error('Erreur lors de la mise à jour du rôle');
      return { success: false, error: 'Échec de la mise à jour de l\'utilisateur' };
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      return { success: true };
    } catch (err) {
      setError('Échec de la suppression de l\'utilisateur');
      return { success: false, error: 'Échec de la suppression de l\'utilisateur' };
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
      case 'users':
        return (
          <UsersManagement
            users={users}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'orders':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Gestion des commandes</h2>
            <p className="text-gray-500">Cette section sera bientôt disponible.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
            <p className="text-gray-500">Cette section sera bientôt disponible.</p>
          </div>
        );
      default:
        return <DashboardStats stats={stats} products={products} users={users} />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Tableau de Bord';
      case 'products': return 'Gestion des Produits';
      case 'users': return 'Gestion des Utilisateurs';
      case 'orders': return 'Gestion des Commandes';
      case 'settings': return 'Paramètres';
      default: return 'Tableau de Bord';
    }
  };

  if (error && !isAdmin()) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg font-medium">{error}</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline mt-4 inline-block">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar avec gestion mobile unifiée */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobileOpen={isMobileOpen}
          onToggle={handleToggleMobile}
          onClose={handleCloseMobile}
        />
        
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="px-4 py-3 sm:px-6 flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={handleToggleMobile}
                  className="lg:hidden p-2 mr-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {getSectionTitle()}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link href="/">
                  <button className="flex items-center bg-blue-500 text-white space-x-1 sm:space-x-2 px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Accueil</span>
                  </button>
                </Link>
                
                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="relative">
                  <button className="flex items-center space-x-2">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                      A
                    </div>
                    <span className="hidden sm:inline text-gray-700">Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Contenu */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 sm:mb-6" role="alert">
                <span className="block sm:inline">{error}</span>
                <button 
                  onClick={() => setError(null)} 
                  className="absolute top-0 right-0 p-3"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <div className="min-h-[calc(100vh-200px)]">
              {renderActiveSection()}
            </div>
          </main>

          {/* Footer mobile simplifié */}
          <footer className="lg:hidden bg-white border-t p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>© 2025 CostumWorld</span>
              <span>Admin Panel</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}