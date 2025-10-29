/**
 * Shared Preferences Service
 * Handles persistent storage of application data using localStorage
 * Provides a consistent interface for storing and retrieving user preferences
 */

export class SharedPreferences {
  private static readonly PREFIX = 'bison360_';
  
  // Keys for authentication data
  private static readonly KEYS = {
    BEARER_TOKEN: 'bearer_token',
    USER_ID: 'user_id',
    USER_ROLE: 'user_role',
    ACTIVE_BLOCK_STATUS: 'active_block_status',
    REMEMBER_ME: 'remember_me',
    SAVED_EMAIL: 'saved_email',
    SAVED_PASSWORD: 'saved_password',
  } as const;

  /**
   * Store a value in shared preferences
   */
  static setItem(key: string, value: string | number | boolean): void {
    if (typeof window === 'undefined') return;
    
    try {
      const prefixedKey = this.PREFIX + key;
      const stringValue = typeof value === 'string' ? value : String(value);
      localStorage.setItem(prefixedKey, stringValue);
    } catch (error) {
      console.error('Error storing shared preference:', error);
    }
  }

  /**
   * Retrieve a value from shared preferences
   */
  static getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const prefixedKey = this.PREFIX + key;
      return localStorage.getItem(prefixedKey);
    } catch (error) {
      console.error('Error retrieving shared preference:', error);
      return null;
    }
  }

  /**
   * Remove a value from shared preferences
   */
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const prefixedKey = this.PREFIX + key;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Error removing shared preference:', error);
    }
  }

  /**
   * Clear all shared preferences
   */
  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing shared preferences:', error);
    }
  }

  /**
   * Check if a key exists in shared preferences
   */
  static hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  // Authentication-specific methods
  
  /**
   * Store bearer token
   */
  static setBearerToken(token: string): void {
    this.setItem(this.KEYS.BEARER_TOKEN, token);
  }

  /**
   * Get bearer token
   */
  static getBearerToken(): string | null {
    return this.getItem(this.KEYS.BEARER_TOKEN);
  }

  /**
   * Store user ID
   */
  static setUserId(userId: number): void {
    this.setItem(this.KEYS.USER_ID, userId);
  }

  /**
   * Get user ID
   */
  static getUserId(): number | null {
    const value = this.getItem(this.KEYS.USER_ID);
    return value ? parseInt(value, 10) : null;
  }

  /**
   * Store user role
   */
  static setUserRole(userRole: number): void {
    this.setItem(this.KEYS.USER_ROLE, userRole);
  }

  /**
   * Get user role
   */
  static getUserRole(): number | null {
    const value = this.getItem(this.KEYS.USER_ROLE);
    return value ? parseInt(value, 10) : null;
  }

  /**
   * Store active block status
   */
  static setActiveBlockStatus(status: number): void {
    this.setItem(this.KEYS.ACTIVE_BLOCK_STATUS, status);
  }

  /**
   * Get active block status
   */
  static getActiveBlockStatus(): number | null {
    const value = this.getItem(this.KEYS.ACTIVE_BLOCK_STATUS);
    return value ? parseInt(value, 10) : null;
  }

  /**
   * Store remember me preference
   */
  static setRememberMe(remember: boolean): void {
    this.setItem(this.KEYS.REMEMBER_ME, remember);
  }

  /**
   * Get remember me preference
   */
  static getRememberMe(): boolean {
    const value = this.getItem(this.KEYS.REMEMBER_ME);
    return value === 'true';
  }

  /**
   * Store saved email
   */
  static setSavedEmail(email: string): void {
    this.setItem(this.KEYS.SAVED_EMAIL, email);
  }

  /**
   * Get saved email
   */
  static getSavedEmail(): string | null {
    return this.getItem(this.KEYS.SAVED_EMAIL);
  }

  /**
   * Store saved password
   */
  static setSavedPassword(password: string): void {
    this.setItem(this.KEYS.SAVED_PASSWORD, password);
  }

  /**
   * Get saved password
   */
  static getSavedPassword(): string | null {
    return this.getItem(this.KEYS.SAVED_PASSWORD);
  }

  /**
   * Check if user is authenticated (has bearer token)
   */
  static isAuthenticated(): boolean {
    return this.getBearerToken() !== null;
  }

  /**
   * Clear all authentication data
   * Note: Does NOT clear SAVED_EMAIL and SAVED_PASSWORD to preserve them for "Remember me" functionality
   */
  static clearAuthData(): void {
    this.removeItem(this.KEYS.BEARER_TOKEN);
    this.removeItem(this.KEYS.USER_ID);
    this.removeItem(this.KEYS.USER_ROLE);
    this.removeItem(this.KEYS.ACTIVE_BLOCK_STATUS);
    this.removeItem(this.KEYS.REMEMBER_ME);
    // Note: We preserve SAVED_EMAIL and SAVED_PASSWORD to persist login credentials after logout
  }

  /**
   * Clear all data including saved email and password
   */
  static clearAllData(): void {
    this.clearAuthData();
    this.removeItem(this.KEYS.SAVED_EMAIL);
    this.removeItem(this.KEYS.SAVED_PASSWORD);
  }

  /**
   * Get all authentication data
   */
  static getAuthData(): {
    bearer_token: string | null;
    user_id: number | null;
    user_role: number | null;
    active_block_status: number | null;
    remember_me: boolean;
  } {
    return {
      bearer_token: this.getBearerToken(),
      user_id: this.getUserId(),
      user_role: this.getUserRole(),
      active_block_status: this.getActiveBlockStatus(),
      remember_me: this.getRememberMe(),
    };
  }
}

export default SharedPreferences;
