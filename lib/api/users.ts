// lib/api/users.ts
export interface User {
  id: number;
  name: string | null;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  // Implémentation pour récupérer les utilisateurs
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
  return response.json();
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
  return response.json();
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');
};