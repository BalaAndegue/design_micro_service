'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ShoppingBag, Star, Search, Menu, X, ArrowRight, ArrowLeft, ShieldCheck, Truck, CreditCard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './layout/headerstes';
//import { Header } from './layout/header';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  isNew?: boolean;
};

interface ProductCardProps {
  product: Product;
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
          src={product.image} 
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2">
          <ShoppingBag className="w-4 h-4 text-gray-800" />
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <div className="text-sm font-bold text-blue-600">${product.price}</div>
        </div>
        <p className="text-gray-500 text-sm mb-3">{product.category}</p>
        <div className="flex items-center mt-auto">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
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

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 199.99,
      category: 'Audio',
      rating: 4,
      reviews: 124,
      image: 'https://i.pinimg.com/1200x/71/61/f0/7161f0a9b3e3ee2de590d2e6999bef50.jpg',
      isNew: true
    },
    {
      id: 2,
      name: 'Ultra HD Smart TV',
      price: 899.99,
      category: 'Electronics',
      rating: 5,
      reviews: 89,
      image: 'https://i.pinimg.com/736x/80/01/d1/8001d1878aba9f9411a19b9dd241679f.jpg'
    },
    {
      id: 3,
      name: 'Ergonomic Office Chair',
      price: 249.99,
      category: 'Furniture',
      rating: 4,
      reviews: 56,
      image: 'https://i.pinimg.com/736x/8f/ef/69/8fef694a8c62105312124e56800cdd46.jpg',
      isNew: true
    },
    {
      id: 4,
      name: 'Smart Fitness Watch',
      price: 159.99,
      category: 'Wearables',
      rating: 3,
      reviews: 201,
      image: 'https://i.pinimg.com/736x/64/68/2f/64682f6549b1451c257ada436dc3b68a.jpg'
    },
    {
      id: 5,
      name: 'Wireless Charging Pad',
      price: 39.99,
      category: 'Accessories',
      rating: 4,
      reviews: 312,
      image: 'https://i.pinimg.com/736x/5c/0f/05/5c0f056b2cf4fe6b7e386ff24f0827fa.jpg'
    },
    {
      id: 6,
      name: 'Bluetooth Speaker',
      price: 129.99,
      category: 'Audio',
      rating: 5,
      reviews: 178,
      image: 'https://i.pinimg.com/1200x/52/96/db/5296db3a11fe3d91731680553e6646f6.jpg'
    }
  ];

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Toys'
  ];

  const heroSlides = [
    {
      title: "Summer Collection 2025",
      subtitle: "Discover our new arrivals",
      image: "https://i.pinimg.com/736x/76/4d/73/764d73cb49c3dac16cce4794d914a1f4.jpg",
      cta: "Shop Now"
    },
    {
      title: "Tech Gadgets Sale",
      subtitle: "Up to 40% off on selected items",
      image: "https://i.pinimg.com/736x/49/a6/d2/49a6d288b894d7fd815e1dfa3862e508.jpg",
      cta: "Explore Deals"
    },
    {
      title: "Premium Membership",
      subtitle: "Get exclusive benefits & early access",
      image: "https://i.pinimg.com/1200x/73/23/00/732300c26e3c0d2a7048fd605da7be4e.jpg",
      cta: "Join Now"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}{/*}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-transparent'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                costum<span className="text-blue-600">world</span>
              </h1>
            </div>
            
            */}{/* Desktop Navigation */}{/*
            <nav className="hidden md:flex space-x-8">
              {['Home', 'Shop', 'Categories', 'Deals', 'About'].map((item) => (
                <a key={item} href="#" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-blue-600">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-blue-600 relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button 
                className="md:hidden p-2 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden md:flex space-x-3">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  LOGIN
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>*/}
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
              <button className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
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
            <a href="products" className="text-blue-600 hover:underline flex items-center">
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
            <a href="/products?category=coques" className="text-blue-600 hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <a href="products" className="text-blue-600 hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
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
              description="On all orders over $50"
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

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  costum<span className="text-blue-400">world</span>
                </h3>
              </div>
              <p className="mb-4">
                Your one-stop shop for all the latest products and trends in 2025.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Shop</h4>
              <ul className="space-y-2">
                {['All Products', 'New Arrivals', 'Featured', 'Discounts'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2">
                {['Contact Us', 'FAQs', 'Shipping Policy', 'Returns & Exchanges'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Newsletter</h4>
              <p className="mb-4">
                Subscribe to get updates on new arrivals and special offers.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 CostumWorld. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 group">
          <ShoppingBag className="w-6 h-6" />
          <span className="hidden sm:inline-block font-medium">Cart (3)</span>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            3
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default CostumWorldLanding;