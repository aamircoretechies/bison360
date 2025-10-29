import { API_CONFIG, API_MODULES } from './config';
import { ProfileEditRequest, ProfileEditResponse, ProfileEditErrorResponse } from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class ProfileEditService {
  /**
   * Update user profile
   */
  static async updateProfile(profileData: ProfileEditRequest): Promise<ProfileEditResponse> {
    const url = `${BASE_URL}/${API_MODULES.USERS.UPDATE}`;
    const bearerToken = SharedPreferences.getBearerToken();

    if (!bearerToken) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    try {
      const formData = new FormData();
      formData.append('user_id', String(profileData.user_id));
      formData.append('first_name', profileData.first_name);
      formData.append('last_name', profileData.last_name);
      formData.append('user_role', String(profileData.user_role));
      formData.append('status', String(profileData.status));

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned ${response.status}: ${response.statusText}. Expected JSON but got ${contentType || 'unknown content type'}`);
      }

      const data = await response.json();

      if (!response.ok) {
        const errorData: ProfileEditErrorResponse = data;
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return data as ProfileEditResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while updating profile');
    }
  }

  /**
   * Get role options for dropdown
   */
  static getRoleOptions(): Array<{ value: number; label: string }> {
    return [
      { value: 1, label: 'Administrator' },
      { value: 2, label: 'Customer' },
      { value: 3, label: 'Guest' },
      { value: 4, label: 'Manager' },
      { value: 5, label: 'Member' },
      { value: 6, label: 'Owner' },
      { value: 7, label: 'Staff' },
      { value: 8, label: 'Support' },
      { value: 9, label: 'Vendor' },
    ];
  }

  /**
   * Get status options for dropdown
   */
  static getStatusOptions(): Array<{ value: number; label: string }> {
    return [
      { value: 1, label: 'Active' },
      { value: 2, label: 'Inactive' },
      { value: 3, label: 'Blocked' },
    ];
  }
}

export default ProfileEditService;
