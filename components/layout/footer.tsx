import Link from 'next/link';
import { Palette, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-orange-600 p-2 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CustomCraft</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Personnalisez vos produits préférés avec notre configurateur interactif. 
              Qualité premium, livraison rapide, satisfaction garantie.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                contact@customcraft.com
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/configurator" className="text-gray-300 hover:text-white transition-colors">Configurateur</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Centre d'aide</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Livraison</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Retours</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 CustomCraft. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}