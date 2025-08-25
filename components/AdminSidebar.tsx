// components/AdminSidebar.tsx
import { ActiveSection } from '@/app/admin/page';

interface AdminSidebarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

export default function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: '📊' },
    { id: 'products', label: 'Produits', icon: '🛍️' },
    { id: 'users', label: 'Utilisateurs', icon: '👥' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
  ] as const;

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Administration</h2>
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
          <span>🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}