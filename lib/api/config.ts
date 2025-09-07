// lib/api/config.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://customworld.onrender.com/api';


export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Fonction pour récupérer le token (à adapter selon votre système d'authentification)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Essayer de récupérer le token depuis localStorage
  const token = localStorage.getItem('authToken');
  
  // Ou depuis les cookies
  // const token = document.cookie
  //   .split('; ')
  //   .find(row => row.startsWith('authToken='))
  //   ?.split('=')[1];
  
  return token || null;
};

// Optionnel : Fonction pour gérer les erreurs d'authentification
export const handleAuthError = (error: any) => {
  console.error('Authentication error:', error);
  // Rediriger vers la page de login ou rafraîchir le token
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

// Optionnel : Fonction pour rafraîchir le token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      const newToken = data.token;
      
      // Stocker le nouveau token
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', newToken);
      }
      
      return newToken;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    handleAuthError(error);
  }
  
  return null;
};