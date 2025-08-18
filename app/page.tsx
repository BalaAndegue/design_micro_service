'use client';
/*
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowRight, Palette, Smartphone, Watch, Coffee, Shirt } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const featuredProducts = [
  {
    id: 1,
    name: 'Coque iPhone Personnalisée',
    category: 'coques',
    price: 24.99,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.8,
    reviews: 156,
    isPopular: true
  },
  {
    id: 2,
    name: 'Montre Connectée Custom',
    category: 'montres',
    price: 199.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.9,
    reviews: 89,
    isPopular: false
  },
  {
    id: 3,
    name: 'T-Shirt Personnalisé',
    category: 'vetements',
    price: 29.99,
    image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.7,
    reviews: 234,
    isPopular: true
  },
  {
    id: 4,
    name: 'Mug Personnalisé',
    category: 'accessoires',
    price: 16.99,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.6,
    reviews: 178,
    isPopular: false
  }
];

const categories = [
  { name: 'Coques Téléphone', icon: Smartphone, count: 120, color: 'bg-blue-500' },
  { name: 'Montres', icon: Watch, count: 45, color: 'bg-green-500' },
  { name: 'Vêtements', icon: Shirt, count: 89, color: 'bg-purple-500' },
  { name: 'Accessoires', icon: Coffee, count: 156, color: 'bg-orange-500' }
];

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      */{/* Hero Section */}/*
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-600/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Personnalisez vos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600"> produits</span>
            </h1>
            <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Créez des produits uniques avec notre configurateur interactif. 
              Choisissez parmi des milliers d'options de personnalisation.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg">
                <Palette className="mr-2 h-5 w-5" />
                Commencer à personnaliser
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2">
                Voir les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      */{/* Categories Section */}/*
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Catégories Populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={category.name} className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} produits</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      */{/* Featured Products */}/*
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produits Populaires
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos créations les plus appréciées
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.isPopular && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      Populaire
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-lg" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">€{product.price}</span>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-2">
                Voir tous les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      */{/* Features Section */}/*
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir CustomCraft ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personnalisation Avancée</h3>
              <p className="text-gray-600">Configurateur interactif avec aperçu en temps réel de vos créations</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Production et expédition sous 48h pour la plupart des produits</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualité Premium</h3>
              <p className="text-gray-600">Matériaux de haute qualité et impression durable</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}*/


import CostumWorldLanding from "@/components/CostumWorldLanding";

// Si vous utilisez App Router: import CostumWorldLanding from './components/CostumWorldLanding';

export default function Home() {
  return (
    <div>
      <CostumWorldLanding />
    </div>
  );
}
