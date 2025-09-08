'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Search,
  Download,
  RefreshCw,
  Star,
  MessageCircle
} from 'lucide-react';
import { Header } from '@/components/layout/headerstes';
import { Footer } from '@/components/layout/footer';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import FloatingCart from '@/components/FloatingCart';

const mockOrders = [
  {
    id: 'CMD-123456',
    date: '2025-01-15',
    status: 'delivered',
    total: 54.98,
    items: [
      {
        name: 'Coque iPhone 15 Pro',
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=150',
        customizations: { color: 'Bleu', text: 'Mon iPhone' },
        quantity: 2,
        price: 24.99
      }
    ],
    tracking: 'FR123456789',
    shippingAddress: '123 Rue de la Paix, 75001 Paris'
  },
  {
    id: 'CMD-123455',
    date: '2025-01-10',
    status: 'shipped',
    total: 29.99,
    items: [
      {
        name: 'T-Shirt Personnalisé',
        image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=150',
        customizations: { color: 'Noir', text: 'CustomCraft' },
        quantity: 1,
        price: 29.99
      }
    ],
    tracking: 'FR123456788',
    shippingAddress: '456 Avenue des Champs, 69000 Lyon'
  },
  {
    id: 'CMD-123454',
    date: '2025-01-05',
    status: 'processing',
    total: 199.99,
    items: [
      {
        name: 'Montre Connectée',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=150',
        customizations: { color: 'Or Rose' },
        quantity: 1,
        price: 199.99
      }
    ],
    shippingAddress: '789 Boulevard Saint-Germain, 33000 Bordeaux'
  }
];

const statusConfig = {
  processing: {
    label: 'En cours de traitement',
    color: 'bg-orange-500',
    icon: Clock
  },
  shipped: {
    label: 'Expédié',
    color: 'bg-blue-500',
    icon: Truck
  },
  delivered: {
    label: 'Livré',
    color: 'bg-green-500',
    icon: CheckCircle
  }
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connectez-vous pour voir vos commandes</h1>
            <p className="text-gray-600 mb-8">Accédez à votre historique de commandes et suivez vos livraisons</p>
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Commandes</h1>
          <p className="text-gray-600">Suivez vos commandes et téléchargez vos factures</p>
        </div>

        {/* Recherche */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher par numéro de commande ou produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="processing">En cours</TabsTrigger>
            <TabsTrigger value="shipped">Expédiées</TabsTrigger>
            <TabsTrigger value="delivered">Livrées</TabsTrigger>
          </TabsList>

          {['all', 'processing', 'shipped', 'delivered'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filteredOrders
                .filter(order => tab === 'all' || order.status === tab)
                .map((order) => {
                  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                  
                  return (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Commande {order.id}</CardTitle>
                            <p className="text-sm text-gray-600">Commandé le {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[order.status as keyof typeof statusConfig].label}
                            </Badge>
                            <p className="text-lg font-bold text-blue-600 mt-1">XAF {order.total}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Produits */}
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(item.customizations).map(([key, value]) => (
                                    <Badge key={key} variant="outline" className="text-xs">
                                      {key}: {value}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm text-gray-600">Quantité: {item.quantity}</span>
                                  <span className="font-medium">XAF {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Informations de livraison */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Adresse de livraison:</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                          {order.tracking && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Suivi:</strong> {order.tracking}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Facture
                          </Button>
                          
                          {order.status === 'shipped' && (
                            <Button size="sm" variant="outline">
                              <Truck className="h-4 w-4 mr-2" />
                              Suivre le colis
                            </Button>
                          )}
                          
                          {order.status === 'delivered' && (
                            <>
                              <Button size="sm" variant="outline">
                                <Star className="h-4 w-4 mr-2" />
                                Laisser un avis
                              </Button>
                              <Button size="sm" variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Recommander
                              </Button>
                            </>
                          )}
                          
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Support
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              
              {filteredOrders.filter(order => tab === 'all' || order.status === tab).length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune commande trouvée
                  </h3>
                  <p className="text-gray-600">
                    {tab === 'all' ? 'Vous n\'avez pas encore passé de commande' : `Aucune commande ${statusConfig[tab as keyof typeof statusConfig]?.label.toLowerCase()}`}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
      <FloatingCart/>
    </div>
  );
}