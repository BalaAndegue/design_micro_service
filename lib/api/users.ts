// lib/api/users.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://customworld.onrender.com/api';
export interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  password: string;
  role: 'CUSTOMER' | 'ADMIN' |'VENDOR';
  createdAt: string;
}
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};
export const fetchUsers = async (): Promise<User[]> => {
  // Implémentation pour récupérer les utilisateurs
  const response = await fetch(`${API_URL}/admin/users`,{
    method: 'GET',
    headers: getAuthHeaders(),  
  });
  if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
  return response.json();
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
  return response.json();
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');
};