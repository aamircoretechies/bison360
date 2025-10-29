/**
 * Login Service
 * Simple service for handling login API calls with shared preferences
 */

import { API_CONFIG, API_MODULES } from './config';
import { LoginRequest, LoginResponse, LoginErrorResponse, LogoutRequest, LogoutResponse, LogoutErrorResponse } from './types';
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
      
      // Store email and password if "Remember me" is checked
      if (credentials.rememberMe) {
        SharedPreferences.setSavedEmail(credentials.email);
        SharedPreferences.setSavedPassword(credentials.password);
        console.log('Email and password saved for future logins');
      } else {
        // Clear saved email and password if "Remember me" is unchecked
        SharedPreferences.removeItem('bison360_saved_email');
        SharedPreferences.removeItem('bison360_saved_password');
        console.log('Saved email and password cleared');
      }

      return data as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Logout user by calling API and clearing local data
   */
  static async logout(): Promise<void> {
    const bearerToken = SharedPreferences.getBearerToken();
    
    if (!bearerToken) {
      // No token to logout, just clear local data
      SharedPreferences.clearAuthData();
      return;
    }

    try {
      const url = `${BASE_URL}/${API_MODULES.AUTH.LOGOUT}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received during logout:', textResponse);
        // Even if API fails, we should clear local data
        SharedPreferences.clearAuthData();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        const errorData: LogoutErrorResponse = data;
        console.error('Logout API error:', errorData.message);
        // Even if API fails, we should clear local data
        SharedPreferences.clearAuthData();
        return;
      }

      // Logout successful
      console.log('Logout successful:', data.message);
      
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Even if API fails, we should clear local data
    } finally {
      // Clear authentication data but preserve saved email and password for "Remember me" functionality
      SharedPreferences.clearAuthData();
    }
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
