// components/AdminSidebar.tsx
import { ActiveSection } from '@/app/admin/page';
import {
  Building2,
  CreditCard,
  Settings,
  ShoppingCart,
  Users,
  LogOutIcon,
  X,
  Menu
} from "lucide-react";
import { useState } from 'react';

interface AdminSidebarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection, 
  isMobileOpen = false, 
  onClose 
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Building2 },
    { id: 'products', label: 'Produits', icon: ShoppingCart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'orders', label: 'Commandes', icon: CreditCard },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ] as const;

  const handleItemClick = (section: ActiveSection) => {
    setActiveSection(section);
    if (onClose) onClose(); // Fermer le sidebar mobile après clic
  };

  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion');
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-blue-700 text-white z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:w-64
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        
        {/* Header du sidebar */}
        <div className="p-4 border-b border-blue-600 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold">Administration</h2>
          )}
          
          {/* Boutons de contrôle */}
          <div className="flex items-center space-x-2">
            {/* Bouton toggle pour desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1 rounded hover:bg-blue-600 transition-colors"
              title={isCollapsed ? "Agrandir" : "Réduire"}
            >
              <Menu className="h-4 w-4" />
            </button>
            
            {/* Bouton fermer pour mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-blue-600 transition-colors"
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id as ActiveSection)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${activeSection === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              text-blue-100 hover:bg-blue-600 hover:text-white
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            title={isCollapsed ? "Déconnexion" : ""}
          >
            <LogOutIcon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="whitespace-nowrap">Déconnexion</span>
            )}
          </button>
        </div>

        {/* Indicateur de version réduite pour desktop */}
        {isCollapsed && (
          <div className="absolute inset-y-0 -right-1 w-2 flex items-center justify-center lg:flex hidden">
            <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Bouton pour ouvrir le sidebar sur mobile quand il est fermé */}
      {!isMobileOpen && (
        <button
          onClick={onClose}
          className="fixed bottom-4 left-4 bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 lg:hidden"
          title="Ouvrir le menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
    </>
  );
}