// app/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from '@/lib/api/auth';

// Schéma de validation avec Zod
const formSchema = z.object({
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Vérifier la validité du token au chargement de la page
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setMessage({
        type: 'error',
        text: 'Token de réinitialisation manquant. Veuillez vérifier votre lien.',
      });
      return;
    }

    setIsTokenValid(true);
  }, [token]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await resetPassword({
        token,
        password: values.password,
      });

      setMessage({
        type: 'success',
        text: response.message || 'Votre mot de passe a été réinitialisé avec succès.',
      });

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la réinitialisation',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/auth/login" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à la connexion</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Lien invalide</h1>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <Link href="/auth/forgot-password">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Demander un nouveau lien
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/auth/login" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à la connexion</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Réinitialisation</h1>
          <p className="text-gray-600 mt-2">Entrez votre nouveau mot de passe</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Nouveau mot de passe</CardTitle>
            <CardDescription>
              Veuillez entrer votre nouveau mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input 
                            placeholder="Entrez votre nouveau mot de passe" 
                            type={showPassword ? 'text' : 'password'} 
                            className="pl-10 pr-10"
                            {...field} 
                            disabled={isLoading}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input 
                            placeholder="Confirmez votre nouveau mot de passe" 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            className="pl-10 pr-10"
                            {...field} 
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {message && (
                  <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  disabled={isLoading || !isTokenValid}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Réinitialiser le mot de passe
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous souvenez de votre mot de passe ?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}