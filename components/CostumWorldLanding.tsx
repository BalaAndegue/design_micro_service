'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ShoppingBag, Star, Search, Menu, X, ArrowRight, ArrowLeft, ShieldCheck, Truck, CreditCard, RefreshCw, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './layout/header';
import { Product, fetchProducts } from '@/lib/api/products';
import { Footer } from '@/components/layout/footer';
import FloatingCart from './FloatingCart';

type ProductWithImage = Product & {
  image: string;
};

interface ProductCardProps {
  product: ProductWithImage;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="relative pt-[100%] overflow-hidden">
        <img 
          src={product.imagePath || '/placeholder-image.jpg'} 
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.new && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </div>
        )}
        {product.onSale && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PROMO
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2">
          <ShoppingBag className="w-4 h-4 text-gray-800" />
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <div className="flex flex-col items-end">
            <div className="text-sm font-bold text-blue-600">XAF {product.price}</div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-gray-500 line-through">XAF {product.originalPrice}</div>
            )}
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-3">{product.category}</p>
        <div className="flex items-center mt-auto">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-1">({product.reviews || 0})</span>
        </div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const CostumWorldLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports'
  ];

  const heroSlides = [
    {
      title: "Summer Collection 2025",
      subtitle: "Discover our new arrivals",
      image: "https://i.pinimg.com/736x/1c/1d/da/1c1dda857ad89a1ce9a66a4466dd4097.jpg",
      cta: "Design Now"
    },
    {
      title: "Premium Membership",
      subtitle: "Up to 40% off on selected items",
      image: "https://i.pinimg.com/1200x/c2/ec/cb/c2eccbb2b785a6f4884d2bbe184e9ee2.jpg",
      cta: "Design Now"
    },
    {
      title: "Summer Collection 2025",
      subtitle: "Get exclusive benefits & early access",
      image: "https://i.pinimg.com/1200x/0c/43/19/0c43195c7cf2a0aedb9f8ef83d2c0b1c.jpg",
      cta: "Design Now"
    },
    {
      title: "Premium Membership",
      subtitle: "Get exclusive benefits & early access",
      image: "https://i.pinimg.com/736x/74/fb/e2/74fbe2c3dcbf1221b00865c277c70cf2.jpg",
      cta: "Design Now"
    },
    {
      title: "Summer Collection",
      subtitle: "Get exclusive benefits & early access",
      image: "https://i.pinimg.com/1200x/bf/ce/a3/bfcea34421fbaa0c8b1663762c6ee670.jpg",
      cta: "Design Now"
    }
  ];

  // Récupérer les produits depuis le backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Filtrer les produits pour Featured Products (3 premiers avec New = true)
  const featuredProducts = products
    .filter(product => product.new)
    .slice(0, 3);

  // Filtrer les produits pour New Arrivals (produits avec onSlae = true)
  const newArrivalProducts = products
    .filter(product => product.onSale)
    .slice(0,3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 bg-white z-40 pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6 py-6">
              {['Home', 'Shop', 'Categories', 'Deals', 'About'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-xl font-medium text-gray-700 hover:text-blue-600 border-b border-gray-100 pb-4"
                >
                  {item}
                </a>
              ))}
              <div className="flex space-x-4 pt-4">
                <button className="flex-1 py-3 text-blue-600 border border-blue-600 rounded-lg">
                  LOGIN
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                  SIGN UP
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Slider */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gray-900"
          >
            <img 
              src={heroSlides[currentSlide].image} 
              alt=""
              className="w-full h-full object-cover opacity-70"
            />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {heroSlides[currentSlide].subtitle}
              </p>
              <Link href="/conufigurator/1"> 
              <button className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 right-8 flex space-x-3 z-10">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <a href="/products?category=Ordinateur" className="text-blue-600 hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={index}
                className="bg-gray-100 rounded-xl p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900">{category}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <a href="/products?category=Pochette" className="text-blue-600 hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={{...product, image: product.imagePath}} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucun produit vedette disponible pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <a href="/products?category=T-shirt" className="text-blue-600 hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : newArrivalProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivalProducts.map((product, index) => (
                <ProductCard key={product.id} product={{...product, image: product.imagePath}} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune nouvelle arrivée en promotion pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Truck className="w-6 h-6" />}
              title="Free Shipping"
              description="On all orders over XAF50000"
            />
            <FeatureCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Easy Returns"
              description="30-day return policy"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Secure Payment"
              description="100% secure checkout"
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6" />}
              title="Flexible Payment"
              description="Pay with multiple options"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shopping Experience?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who shop with confidence on CostumWorld.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

     

      {/* Floating CTA */}
      <FloatingCart/>
    </div>
  );
};
   
export default CostumWorldLanding;