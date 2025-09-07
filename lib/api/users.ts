// lib/api/users.ts

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  // Ajoutez d'autres rôles si nécessaire
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://customworld.onrender.com/api';
export interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  password: string;
  role: UserRole;
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



/**
 * Met à jour un utilisateur (pour admin)
 * @param userId ID de l'utilisateur à mettre à jour
 * @param userData Données de l'utilisateur à mettre à jour
 */


export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/admin/user/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update user: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(error instanceof Error ? error.message : 'Unable to update user');
  }
};


export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers:getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');
};