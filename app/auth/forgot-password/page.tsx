// app/forgot-password/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordRequestForm } from '@/components/auth/ResetPasswordRequestForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/auth/login" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à la connexion</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-gray-600 mt-2">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              Nous vous enverrons un lien pour réinitialiser votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordRequestForm />
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