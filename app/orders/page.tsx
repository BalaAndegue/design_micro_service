'use client';

import { useState, useEffect } from 'react';
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
  MessageCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Header } from '@/components/layout/headerstes';
import { Footer } from '@/components/layout/footer';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import FloatingCart from '@/components/FloatingCart';
import { 
  getOrders, 
  getOrderStatusLabel, 
  getOrderStatusColor,
  type Order
} from '@/lib/api/orders';

const statusIcons = {
  'PENDING': Clock,
  'PROCESSING': Clock,
  'SHIPPED': Truck,
  'DELIVERED': CheckCircle,
  'CANCELLED': AlertCircle
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.items?.some(item => 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    order.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons] || Package;
    return <IconComponent className="h-3 w-3 mr-1" />;
  };

  const getLivraisonLabel = (modeLivraison: number): string => {
    switch (modeLivraison) {
      case 0: return 'Standard';
      case 1: return 'Express';
      case 2: return 'Premium';
      default: return `Mode ${modeLivraison}`;
    }
  };

  const formatAmount = (amount: number | null | undefined, currency: string = 'XAF'): string => {
    if (amount === null || amount === undefined) {
      return `${currency} 0.00`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const getSafeValue = (value: any, defaultValue: any = '') => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Calculer le total d'une commande avec tous ses items
  const calculateOrderTotal = (order: Order): number => {
    if (order.items && order.items.length > 0) {
      return order.items.reduce((total, item) => {
        const itemPrice = item.isCutomized ? (item as any).customizedPrice || item.price : item.price;
        return total + (itemPrice * item.quantity);
      }, 0);
    }
    return order.amount || 0;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-2" />
            <span>Chargement de vos commandes...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Commandes</h1>
          <p className="text-gray-600">Suivez vos commandes et consultez votre historique</p>
        </div>

        {/* Recherche */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par numéro de commande, produit ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="PENDING">En attente</TabsTrigger>
            <TabsTrigger value="PROCESSING">En traitement</TabsTrigger>
            <TabsTrigger value="SHIPPED">Expédiées</TabsTrigger>
            <TabsTrigger value="DELIVERED">Livrées</TabsTrigger>
          </TabsList>

          {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filteredOrders
                .filter(order => tab === 'all' || order.status === tab)
                .map((order) => {
                  const orderTotal = calculateOrderTotal(order);
                  const hasItems = order.items && order.items.length > 0;
                  
                  return (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                            <p className="text-sm text-gray-600">
                              Commandé le {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                            </p>
                            {order.transactionId && (
                              <p className="text-sm text-gray-500">Référence: {order.transactionId}</p>
                            )}
                            {hasItems && (
                              <p className="text-sm text-gray-500">
                                {order.items?.length ?? 0 } article{(order.items?.length ?? 0)> 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge className={getOrderStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              {getOrderStatusLabel(order.status)}
                            </Badge>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              {formatAmount(orderTotal, order.currency)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Articles de la commande */}
                        <div className="space-y-3">
                          {hasItems ? (
                            order.items!.map((item, index) => (
                              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                <img
                                  src={getSafeValue(item.imagePath, '/images/placeholder-product.jpg')}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium">{item.productName}</h4>
                                    <span className="font-medium">
                                      {formatAmount(
                                        (item.isCutomized ? (item as any).customizedPrice || item.price : item.price) * item.quantity,
                                        order.currency
                                      )}
                                    </span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.isCutomized && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Personnalisé
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      Qté: {item.quantity}
                                    </Badge>
                                  </div>

                                  {item.isCutomized && item.customizations && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-gray-700 mb-1">Personnalisation:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {Object.entries(item.customizations).map(([key, value]) => (
                                          <Badge key={key} variant="secondary" className="text-xs">
                                            {key}: {value}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            // Fallback pour les anciennes commandes sans items
                            <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={getSafeValue(order.imagePath, '/images/placeholder-product.jpg')}
                                alt={order.productName || 'Produit'}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{getSafeValue(order.productName, 'Produit')}</h4>
                                  <span className="font-medium">
                                    {formatAmount(order.amount, order.currency)}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs mt-1">
                                  Qté: 1
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Informations de livraison */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Adresse de livraison:</p>
                          <p className="text-sm text-gray-600">{getSafeValue(order.deliveryAddress, 'Adresse non spécifiée')}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Téléphone:</strong> {getSafeValue(order.phone, 'Non spécifié')}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Mode de livraison:</strong> {getLivraisonLabel(getSafeValue(order.modeLivraison, 0))}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" disabled>
                            <Download className="h-4 w-4 mr-2" />
                            Facture (bientôt disponible)
                          </Button>
                          
                          {order.status === 'SHIPPED' && (
                            <Button size="sm" variant="outline">
                              <Truck className="h-4 w-4 mr-2" />
                              Suivre le colis
                            </Button>
                          )}
                          
                          {order.status === 'DELIVERED' && (
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-2" />
                              Laisser un avis
                            </Button>
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
                    {tab === 'all' ? 'Vous n\'avez pas encore passé de commande' : `Aucune commande ${getOrderStatusLabel(tab).toLowerCase()}`}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>     

    
      <FloatingCart/>
    </div>
  );
}