// lib/api/users.ts
import { API_URL,getAuthHeaders } from "./config";
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  // Ajoutez d'autres rôles si nécessaire
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  password: string;
  role: UserRole;
  createdAt: string;
}

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


export const deleteUser = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Vérifier si c'est une erreur de contrainte de clé étrangère
      if (response.status === 409 || 
          (errorData.message && errorData.message.includes('foreign key constraint'))) {
        // Retourner un objet au lieu de lancer une erreur
        return { 
          success: false, 
          message: 'Impossible de supprimer cet utilisateur car il a un panier actif. Veuillez d\'abord supprimer ou transférer le panier.' 
        };
      }
      
      // Pour les autres erreurs
      return { 
        success: false, 
        message: errorData.message || 'Erreur lors de la suppression de l\'utilisateur' 
      };
    }

    return { 
      success: true, 
      message: 'Utilisateur supprimé avec succès' 
    };
    
  } catch (error) {
    console.error('Error deleting user:', error);
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression' 
    };
  }
};