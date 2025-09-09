'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, Phone, MessageCircle, Users, Target, Heart, Shield, Clock, Truck, 
  Award, Globe, Sparkles, ArrowRight, CheckCircle, Star, Zap, 
  TrendingUp, Palette, Gift, Headphones, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/headerstes';
import Footer from '@/components/layout/footer';
import { getAuthHeaders } from '@/lib/api/card';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);

  const adminWhatsApp = '+237656616751';
  const adminEmail = 'customworld25@gmail.com';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Animation on scroll
    const handleScrollVisibility = () => {
      setIsVisible(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScrollVisibility);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollVisibility);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://customworld.onrender.com/api/notifications/send-email', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message envoyé avec succès !');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Bonjour, je souhaite vous contacter à propos de CustomWorld...');
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Qualité Premium",
      description: "Matériaux haut de gamme sélectionnés avec soin pour une durabilité exceptionnelle",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Livraison Express",
      description: "Expédition sous 24h partout au Cameroun avec suivi en temps réel",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Personnalisation Illimitée",
      description: "Plus de 1000 options de personnalisation pour créer votre produit unique",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Support Dédié",
      description: "Équipe d'experts disponible 7j/7 pour vous accompagner",
      color: "from-orange-500 to-red-500"
    }
  ];

  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Innovation Continue",
      description: "Nous investissons constamment dans les dernières technologies de personnalisation"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passion du Détail",
      description: "Chaque produit est conçu avec amour et attention aux moindres détails"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Communauté Forte",
      description: "Plus de 10 000 créateurs nous font confiance pour leurs projets"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Impact Durable",
      description: "Production éco-responsable et matériaux recyclables"
    }
  ];

  const achievements = [
    { number: "15K+", label: "Clients Satisfaits", icon: <Users className="h-8 w-8" /> },
    { number: "25K+", label: "Produits Créés", icon: <Gift className="h-8 w-8" /> },
    { number: "99.8%", label: "Taux de Satisfaction", icon: <Star className="h-8 w-8" /> },
    { number: "48h", label: "Délai Moyen", icon: <Clock className="h-8 w-8" /> }
  ];

  const timeline = [
    {
      year: "2020",
      title: "Création de CustomWorld",
      description: "Lancement avec une vision simple : rendre la personnalisation accessible à tous"
    },
    {
      year: "2021",
      title: "Expansion Nationale",
      description: "Ouverture de notre réseau de distribution dans toutes les régions du Cameroun"
    },
    {
      year: "2023",
      title: "Innovation Technologique",
      description: "Lancement de notre plateforme de design 3D en temps réel"
    },
   
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <Header />
      
      {/* Hero Section avec animation parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-indigo-900">
          <div 
            className="absolute inset-0 opacity-20 transition-transform duration-300"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(5, 147, 241, 0.93) 0%, transparent 50%), 
                               radial-gradient(circle at 80% 20%, rgba(100, 255, 229, 0.41) 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, rgba(120, 246, 255, 0.66) 0%, transparent 50%)`,
              transform: `translateY(${scrollY * 0.1}px)`
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                CustomWorld
              </h1>
              <div className="flex items-center justify-center mb-8 space-x-4">
                <div className="h-1 w-10 sm:w-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 animate-spin-slow" />
                <div className="h-1 w-10 sm:w-20 bg-gradient-to-l from-purple-400 to-pink-400 rounded-full animate-pulse" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl mb-8 font-light opacity-90">
                L'art de la personnalisation à portée de main
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-80">
                Transformez vos idées en créations uniques avec notre technologie de pointe et notre savoir-faire artisanal
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up animation-delay-300">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
              >
                Découvrir nos services
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg backdrop-blur-sm transition-all duration-300"
              >
                Voir notre portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Section Stats avec animation au scroll */}
      <section className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {achievements.map((stat, index) => (
              <div 
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-white/20">
                  <div className="flex justify-center mb-2 sm:mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl text-white transform group-hover:rotate-12 transition-transform duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Mission avec onglets interactifs */}
      <section className="py-16 sm:py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
                Notre <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mission</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Révolutionner le monde de la personnalisation en combinant créativité, technologie et excellence artisanale
              </p>
            </div>

            {/* Onglets */}
            <div className="flex flex-wrap justify-center mb-8 sm:mb-12 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-xl">
              {['mission', 'vision', 'valeurs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'mission' && 'Notre Mission'}
                  {tab === 'vision' && 'Notre Vision'}
                  {tab === 'valeurs' && 'Nos Valeurs'}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl sm:shadow-2xl">
              {activeTab === 'mission' && (
                <div className="animate-fade-in text-center">
                  <Target className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto mb-4 sm:mb-6 md:mb-8 text-blue-600" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Créer l'Extraordinaire</h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto">
                    Nous nous engageons à transformer chaque idée en une création unique et mémorable. 
                    Notre mission est de démocratiser la personnalisation haut de gamme en alliant 
                    innovation technologique et savoir-faire artisanal traditionnel.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                    <div className="text-center">
                      <Zap className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-4 text-yellow-500" />
                      <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Innovation</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Technologies de pointe</p>
                    </div>
                    <div className="text-center">
                      <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-4 text-green-500" />
                      <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Excellence</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Qualité irréprochable</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-4 text-red-500" />
                      <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Passion</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Amour du détail</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="animate-fade-in text-center">
                  <Globe className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto mb-4 sm:mb-6 md:mb-8 text-purple-600" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Vision d'Avenir</h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto">
                    Devenir la référence africaine en matière de personnalisation premium, 
                    en inspirant une nouvelle génération de créateurs et en révolutionnant 
                    l'expérience client grâce à l'innovation continue.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                      <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-2 sm:mb-4 text-blue-600" />
                      <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Croissance Durable</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Expansion responsable en Afrique</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                      <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-2 sm:mb-4 text-green-600" />
                      <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Innovation Continue</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Recherche et développement constant</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'valeurs' && (
                <div className="animate-fade-in">
                  <div className="text-center mb-8 sm:mb-12">
                    <Heart className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto mb-4 sm:mb-6 md:mb-8 text-red-600" />
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Nos Valeurs Fondamentales</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {values.map((value, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 sm:p-3 rounded-lg sm:rounded-xl text-white flex-shrink-0">
                            {value.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{value.title}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{value.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section Caractéristiques avec animations */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
              Pourquoi Nous <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Choisir</span> ?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
              Une expérience unique qui dépasse toutes les attentes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 h-full hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:shadow-xl sm:hover:shadow-2xl">
                  <div className={`bg-gradient-to-r ${feature.color} p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl inline-block mb-4 sm:mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Notre <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Histoire</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">Un parcours d'innovation et de croissance</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center mb-8 sm:mb-12 last:mb-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl shadow-xl mb-4 sm:mb-0">
                  {item.year}
                </div>
                <div className="sm:ml-6 md:ml-8 bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1">
                  <h3 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact améliorée */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
              Contactez <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Nous</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/80">Prêt à concrétiser votre projet ? Parlons-en !</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Formulaire de contact */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 animate-fade-in-up">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <Mail className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Envoyez-nous un message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white/80 text-sm sm:text-base">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white/80 text-sm sm:text-base">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white/80 text-sm sm:text-base">Sujet</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white/80 text-sm sm:text-base">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Informations de contact */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in-up animation-delay-300">
              {/* Contact rapide */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Contact Rapide</h3>
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={openWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    WhatsApp - Réponse Immédiate
                  </Button>

                  <Button
                    onClick={() => window.location.href = `mailto:${adminEmail}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    Email Professionnel
                  </Button>

                  <Button
                    onClick={() => window.location.href = `tel:${adminWhatsApp}`}
                    className="w-full md:hidden bg-indigo-600 hover:bg-indigo-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    Appel Direct
                  </Button>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Nos Coordonnées</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center text-white/80 hover:text-white transition-colors group">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:rotate-12 transition-transform">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Email</div>
                      <div className="text-white/60 text-xs sm:text-sm">{adminEmail}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/80 hover:text-white transition-colors group">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:rotate-12 transition-transform">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Téléphone</div>
                      <div className="text-white/60 text-xs sm:text-sm">{adminWhatsApp}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/80 hover:text-white transition-colors group">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:rotate-12 transition-transform">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Adresse</div>
                      <div className="text-white/60 text-xs sm:text-sm">Yaoundé, Cameroun</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/80 hover:text-white transition-colors group">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4 group-hover:rotate-12 transition-transform">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Horaires</div>
                      <div className="text-white/60 text-xs sm:text-sm">Lun-Ven: 8h-19h | Sam: 9h-17h</div>
                      <div className="text-white/60 text-xs sm:text-sm">Dim: Support d'urgence</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Garanties et certifications */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Nos Garanties</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="bg-green-500 p-2 sm:p-3 rounded-full inline-block mb-1 sm:mb-2">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">Qualité Garantie</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500 p-2 sm:p-3 rounded-full inline-block mb-1 sm:mb-2">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">SAV 2 ans</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 p-2 sm:p-3 rounded-full inline-block mb-1 sm:mb-2">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">Certifié ISO</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-500 p-2 sm:p-3 rounded-full inline-block mb-1 sm:mb-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">5★ Client</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages avec carousel */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Ce Que Disent Nos <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clients</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">Des témoignages authentiques de satisfaction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Bala Andegue",
                role: "Entrepreneuse",
                content: "CustomWorld a transformé mon entreprise ! La qualité des produits personnalisés dépasse toutes mes attentes. L'équipe est réactive et professionnelle.",
                rating: 5,
                avatar: "M"
              },
              {
                name: "Azangue Leonel",
                role: "Designer",
                content: "En tant que designer, j'apprécie particulièrement la précision des finitions et les possibilités créatives infinies offertes par CustomWorld.",
                rating: 5,
                avatar: "J"
              },
              {
                name: "Abat Marcel",
                role: "Chef d'entreprise",
                content: "Service client exceptionnel ! Ils ont su comprendre ma vision et la concrétiser parfaitement. Je recommande vivement leurs services.",
                rating: 5,
                avatar: "F"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mr-3 sm:mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic text-xs sm:text-sm">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section FAQ Interactive */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Questions <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fréquentes</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">Trouvez rapidement les réponses à vos questions</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {[
              {
                question: "Quels types de produits pouvez-vous personnaliser ?",
                answer: "Nous personnalisons une large gamme de produits : textiles, objets promotionnels, accessoires, décoration, électronique et bien plus. Notre catalogue compte plus de 1000 références personnalisables."
              },
              {
                question: "Quel est le délai de livraison ?",
                answer: "Le délai standard est de 48h à 72h pour les produits en stock. Pour les créations sur mesure, comptez 5 à 10 jours ouvrés selon la complexité du projet."
              },
              {
                question: "Proposez-vous des échantillons gratuits ?",
                answer: "Oui ! Nous offrons jusqu'à 3 échantillons gratuits par mois pour vous permettre de vérifier la qualité avant de passer commande."
              },
              {
                question: "Quelles sont vos options de paiement ?",
                answer: "Nous acceptons les virements bancaires, Mobile Money (MTN/Orange), cartes de crédit et paiement à la livraison pour Yaoundé et Douala."
              },
              {
                question: "Offrez-vous une garantie sur vos produits ?",
                answer: "Absolument ! Tous nos produits bénéficient d'une garantie qualité de 2 ans et d'un service après-vente réactif."
              }
            ].map((faq, index) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-4 sm:p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">{faq.question}</h3>
                    <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 rotate-90" />
                    </div>
                  </button>
                  <div className={`px-4 sm:px-6 pb-4 sm:pb-6 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call-to-Action Final */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Effets visuels */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 sm:right-20 w-24 h-24 sm:w-48 sm:h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse animation-delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              Prêt à Créer Quelque Chose d'
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Extraordinaire</span> ?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto">
              Rejoignez plus de 15 000 clients satisfaits et transformez vos idées en réalité
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
              <Button 
                onClick={openWhatsApp}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-6 rounded-full font-bold text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
              >
                <MessageCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                Commencer Maintenant
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-6 rounded-full font-bold text-base sm:text-lg md:text-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                Découvrir le Catalogue
              </Button>
            </div>

            {/* Badges de confiance */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-white/60 text-xs sm:text-sm">
              <div className="flex items-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>Paiement Sécurisé</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>Livraison Garantie</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>Qualité Certifiée</span>
              </div>
              <div className="flex items-center">
                <Headphones className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}