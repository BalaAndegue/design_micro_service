export interface User {
  id: number;
  name: string | null;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}