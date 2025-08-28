export interface User {
  id: number;
  name: string | null;
  email: string ;
  phone: string | null;
  password: string;
  role: 'CUSTOMER' | 'ADMIN' |'VENDOR';
  createdAt: string;
}