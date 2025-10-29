import { API_CONFIG, API_MODULES } from './config';
import { AddUserRequest, AddUserResponse, AddUserErrorResponse } from './types';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class AddUserService {
  /**
   * Add a new user via direct registration
   */
  static async addUser(userData: AddUserRequest): Promise<AddUserResponse> {
    const url = `${BASE_URL}/${API_MODULES.USERS.ADD_USER}`;

    try {
      const formData = new FormData();
      formData.append('first_name', userData.first_name);
      formData.append('last_name', userData.last_name);
      formData.append('email', userData.email);
      formData.append('user_role', String(userData.user_role));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
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
        const errorData: AddUserErrorResponse = data;
        throw new Error(errorData.message || 'Failed to add user');
      }

      return data as AddUserResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while adding user');
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
}

export default AddUserService;
