// lib/validations/auth.ts
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres, espaces, apostrophes et traits d\'union'),
  
  email: z.string()
    .email('Veuillez entrer une adresse email valide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  
  tel: z.string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 caractères')
    .regex(/^[+\d\s\-()]+$/, 'Numéro de téléphone invalide'),
  
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(50, 'Le mot de passe ne peut pas dépasser 50 caractères')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  
  confirmPassword: z.string(),
  
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Vous devez accepter les conditions générales'),
  
  role: z.string().default('CUSTOMER')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;