// components/AdminSidebar.tsx
import { ActiveSection } from '@/app/vendor/page';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  PieChart,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  LogOutIcon
} from "lucide-react";

interface VendorSidebarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

export default function VendorSidebar({ activeSection, setActiveSection }: VendorSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon:Building2 },
    { id: 'products', label: 'Produits', icon: ShoppingCart },
    
    { id: 'orders', label: 'Commandes', icon: CreditCard },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ] as const;

  return (
    <div className="w-64 bg-orange-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Vendeurs</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id as ActiveSection)}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>
                    {item.icon && <item.icon className="h-4 w-4 text-primary-foreground" />}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          
          <span><LogOutIcon className="h-4 w-4 text-primary-foreground" /></span>
        </button>
      </div>
    </div>
  );
}