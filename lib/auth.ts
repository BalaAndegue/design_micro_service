// app/lib/auth.ts
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};


// app/lib/auth.ts
export const isAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;
  return role === 'ADMIN';
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};