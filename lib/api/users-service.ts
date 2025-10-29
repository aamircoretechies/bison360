/**
 * Users Service
 * Service for handling users API calls
 */

import { API_CONFIG, API_MODULES } from './config';
import { UsersRequest, UsersResponse, UsersErrorResponse } from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class UsersService {
  /**
   * Get all users with optional filters
   */
  static async getUsers(params: UsersRequest = {}): Promise<UsersResponse> {
    const url = `${BASE_URL}/${API_MODULES.USERS.GET_ALL}`;
    const bearerToken = SharedPreferences.getBearerToken();
    
    if (!bearerToken) {
      throw new Error('No authentication token found. Please log in again.');
    }

    try {
      // Prepare form data for POST request
      const formData = new FormData();
      
      if (params.page !== undefined) {
        formData.append('page', params.page.toString());
      }
      if (params.size !== undefined) {
        formData.append('size', params.size.toString());
      }
      if (params.search) {
        formData.append('search', params.search);
      }
      if (params.user_role !== undefined) {
        formData.append('user_role', params.user_role.toString());
      }
      if (params.user_status !== undefined) {
        formData.append('user_status', params.user_status.toString());
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
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
        const errorData: UsersErrorResponse = data;
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      return data as UsersResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching users');
    }
  }

  /**
   * Get user initials from first and last name
   */
  static getUserInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  }

  /**
   * Get user status description based on status code
   */
  static getUserStatusDescription(status: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Inactive';
      case 3:
        return 'Blocked';
      default:
        return 'Unknown';
    }
  }

  /**
   * Format date for display (handles UTC timestamps)
   */
  static formatDate(dateString: string): string {
    try {
      // Parse the UTC timestamp correctly
      // If the string doesn't end with 'Z', we assume it's UTC and add it
      const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
      const date = new Date(utcString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  /**
   * Format last login date (handles UTC timestamps)
   */
  static formatLastLogin(dateString: string): string {
    try {
      // Parse the UTC timestamp correctly
      // If the string doesn't end with 'Z', we assume it's UTC and add it
      const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
      const date = new Date(utcString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return '-';
      }
      
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInHours < 168) { // 7 days
        const days = Math.floor(diffInHours / 24);
        return `${days}d ago`;
      } else {
        // For older dates, show the actual date in local timezone
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting last login:', error);
      return '-';
    }
  }
}

export default UsersService;
