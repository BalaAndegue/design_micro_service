import { API_URL ,getAuthHeaders} from "./config"

export interface ProfileData {
  name: string;
  email: string;
  tel?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export const updateProfile = async (profileData: ProfileData): Promise<ProfileData> => {
  try {
    const response = await fetch(`${API_URL}/customer/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Unable to update profile');
  }
};