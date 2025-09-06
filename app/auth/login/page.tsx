'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      // Appel à l'API Spring Boot
      const response = await fetch('https://customworld.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      console.log('les donnees recus '+data)

      if (response.ok) {
        // on recupere le role de celui qui s'est connecter
        const userRole = data.user.role;
        // Stockage du token JWT et des informations utilisateur
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Connexion réussie !');
        if (userRole === 'ADMIN') {
          router.push('/admin');
          return;
        } else if (userRole === 'VENDOR') {
          router.push('/vendor');
          return;
        }

        router.push('/');
      } else {
        toast.error(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Image de background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/image.jpg" // Chemin depuis le dossier public
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-200 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Connexion</h1>
          <p className="text-gray-200 mt-2">Accédez à votre compte CustomWorld</p>
        </div>

        <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Se connecter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6">
              <Separator />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                    Créer un compte
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Mot de passe oublie ?{' '}
                  <Link href="/auth/forgot-password" className="text-blue-600 hover:underline font-medium">
                    changer de mot de passe
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}