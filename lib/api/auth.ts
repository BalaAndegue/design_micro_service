
import { API_URL ,getAuthHeaders} from "./config";

export interface ResetPasswordRequest {
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}




// lib/api/auth.ts
export interface ResetPasswordData {
  token: string;
  password: string;
}

export const resetPassword = async (data: ResetPasswordData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(responseData.message || 'Token invalide ou expiré');
      } else if (response.status === 404) {
        throw new Error(responseData.message || 'Utilisateur non trouvé');
      } else {
        throw new Error(responseData.message || 'Une erreur est survenue');
      }
    }

    return responseData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Une erreur est survenue');
  }
};




// Version améliorée de resetPasswordRequest dans lib/api/auth.ts
export const resetPasswordRequest = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Gestion spécifique des codes d'erreur
      if (response.status === 400) {
        throw new Error(data.message || 'Email invalide');
      } else if (response.status === 404) {
        throw new Error(data.message || 'Utilisateur non trouvé');
      } else {
        throw new Error(data.message || 'Une erreur est survenue');
      }
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Une erreur est survenue');
  }
};