import { API_CONFIG, API_MODULES } from './config';
import { UserData } from './types';
import SharedPreferences from '@/lib/shared-preferences';

const BASE_URL = API_CONFIG.BASE_URLS.DEVELOPMENT;

export class UserDetailsService {
  /**
   * Get user details by ID
   */
  static async getUserDetails(userId: string): Promise<UserData> {
    const url = `${BASE_URL}/${API_MODULES.USERS.BASE}/${userId}`;
    const bearerToken = SharedPreferences.getBearerToken();

    if (!bearerToken) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned ${response.status}: ${response.statusText}. Expected JSON but got ${contentType || 'unknown content type'}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user details');
      }

      return data as UserData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching user details');
    }
  }

  /**
   * Get user initials for avatar
   */
  static getUserInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    if (!dateString) return '-';
    try {
      const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
      const date = new Date(utcString);
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString;
    }
  }

  /**
   * Format last login date
   */
  static formatLastLogin(dateString: string): string {
    if (!dateString) return 'Never';
    try {
      const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
      const date = new Date(utcString);
      
      if (isNaN(date.getTime())) {
        return 'Never';
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
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting last login:', dateString, error);
      return 'Never';
    }
  }

  /**
   * Get status variant for badge
   */
  static getStatusVariant(status: number): 'secondary' | 'success' | 'warning' | 'destructive' {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  /**
   * Get status description
   */
  static getStatusDescription(status: number): string {
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
}

export default UserDetailsService;
