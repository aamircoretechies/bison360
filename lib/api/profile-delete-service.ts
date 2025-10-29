import { API_CONFIG, API_MODULES } from './config';
import { ProfileDeleteRequest, ProfileDeleteResponse, ProfileDeleteErrorResponse } from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class ProfileDeleteService {
  /**
   * Delete user profile
   */
  static async deleteProfile(deleteData: ProfileDeleteRequest): Promise<ProfileDeleteResponse> {
    const url = `${BASE_URL}/${API_MODULES.USERS.DELETE}`;
    const bearerToken = SharedPreferences.getBearerToken();

    if (!bearerToken) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    try {
      const formData = new FormData();
      formData.append('user_id', String(deleteData.user_id));

      const response = await fetch(url, {
        method: 'DELETE',
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
        const errorData: ProfileDeleteErrorResponse = data;
        throw new Error(errorData.message || 'Failed to delete profile');
      }

      return data as ProfileDeleteResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while deleting profile');
    }
  }
}

export default ProfileDeleteService;
