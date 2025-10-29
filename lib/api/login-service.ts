/**
 * Login Service
 * Simple service for handling login API calls with shared preferences
 */

import { API_CONFIG, API_MODULES } from './config';
import { LoginRequest, LoginResponse, LoginErrorResponse } from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class LoginService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const url = `${BASE_URL}/${API_MODULES.AUTH.LOGIN}`;
    
        try {
          // Use FormData as expected by the API (like Postman form-data)
          const formData = new FormData();
          formData.append('email', credentials.email);
          formData.append('password', credentials.password);

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
            },
            body: formData,
          });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned ${response.status}: ${response.statusText}. Expected JSON but got ${contentType || 'unknown content type'}`);
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        const errorData: LoginErrorResponse = data;
        throw new Error(errorData.message || 'Login failed');
      }

      // Store authentication data in shared preferences
      SharedPreferences.setBearerToken(data.bearer_token);
      SharedPreferences.setUserId(data.user_id);
      SharedPreferences.setUserRole(data.user_role);
      SharedPreferences.setActiveBlockStatus(data.active_block_status);
      SharedPreferences.setRememberMe(credentials.rememberMe || false);

      return data as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    SharedPreferences.clearAuthData();
  }

  /**
   * Get stored user data
   */
  static getUserData(): {
    bearer_token: string | null;
    user_id: number | null;
    user_role: number | null;
    active_block_status: number | null;
  } {
    return SharedPreferences.getAuthData();
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    return SharedPreferences.isAuthenticated();
  }
}

export default LoginService;
