/**
 * API Client Implementation
 * Enterprise-grade HTTP client with interceptors, retry logic, and error handling
 */

import { API_CONFIG, HTTP_STATUS, ERROR_CODES, FEATURE_FLAGS } from './config';
import {
  ApiResponse,
  ApiError,
  RequestConfig,
  ApiClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  AuthTokens,
} from './types';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private authTokens: AuthTokens | null = null;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || API_CONFIG.TIMEOUT.DEFAULT;
    this.retries = config.retries || API_CONFIG.RETRY.MAX_ATTEMPTS;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };

    // Add interceptors if provided
    if (config.interceptors?.request) {
      this.requestInterceptors.push(...config.interceptors.request);
    }
    if (config.interceptors?.response) {
      this.responseInterceptors.push(...config.interceptors.response);
    }

    // Add default interceptors
    this.addDefaultInterceptors();
  }

  /**
   * Add default interceptors for authentication and error handling
   */
  private addDefaultInterceptors(): void {
    // Request interceptor for authentication
    this.requestInterceptors.push({
      onFulfilled: (config) => {
        if (this.authTokens?.accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.authTokens.accessToken}`,
          };
        }
        return config;
      },
    });

    // Response interceptor for error handling
    this.responseInterceptors.push({
      onRejected: async (error) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          // Try to refresh token
          if (this.authTokens?.refreshToken) {
            try {
              await this.refreshAuthToken();
              // Retry the original request
              return this.request(error.config);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              this.handleAuthFailure();
            }
          } else {
            this.handleAuthFailure();
          }
        }
        return Promise.reject(error);
      },
    });
  }

  /**
   * Set authentication tokens
   */
  setAuthTokens(tokens: AuthTokens | null): void {
    this.authTokens = tokens;
  }

  /**
   * Get authentication tokens
   */
  getAuthTokens(): AuthTokens | null {
    return this.authTokens;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Execute request interceptors
   */
  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onFulfilled) {
        processedConfig = await interceptor.onFulfilled(processedConfig);
      }
    }
    
    return processedConfig;
  }

  /**
   * Execute response interceptors
   */
  private async executeResponseInterceptors(response: ApiResponse): Promise<ApiResponse> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse);
      }
    }
    
    return processedResponse;
  }

  /**
   * Handle authentication failure
   */
  private handleAuthFailure(): void {
    this.authTokens = null;
    // Clear tokens from storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens');
      sessionStorage.removeItem('auth_tokens');
    }
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }

  /**
   * Refresh authentication token
   */
  private async refreshAuthToken(): Promise<void> {
    if (!this.authTokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: this.authTokens.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.authTokens = data.tokens;
    
    // Save to storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_tokens', JSON.stringify(this.authTokens));
    }
  }

  /**
   * Create AbortController with timeout
   */
  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  /**
   * Retry request with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      if (attempt < this.retries && this.shouldRetry(error)) {
        const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    if (!FEATURE_FLAGS.ENABLE_RETRY) return false;
    
    const status = error.response?.status;
    return (
      !status || // Network error
      status >= 500 || // Server errors
      status === HTTP_STATUS.TOO_MANY_REQUESTS // Rate limiting
    );
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    config: RequestConfig & { method: string; url: string; body?: any }
  ): Promise<ApiResponse<T>> {
    const processedConfig = await this.executeRequestInterceptors(config);
    
    const url = this.buildURL(processedConfig.url || '', processedConfig.params);
    const controller = this.createAbortController(processedConfig.timeout || this.timeout);
    
    const requestInit: RequestInit = {
      method: processedConfig.method,
      headers: {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      },
      signal: processedConfig.signal || controller.signal,
    };

    if (processedConfig.body && processedConfig.method !== 'GET') {
      if (processedConfig.body instanceof FormData) {
        requestInit.body = processedConfig.body;
        // Remove Content-Type header for FormData (browser will set it with boundary)
        delete (requestInit.headers as any)['Content-Type'];
      } else {
        requestInit.body = JSON.stringify(processedConfig.body);
      }
    }

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const response = await fetch(url, requestInit);
      
      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      if (!response.ok) {
        const error: ApiError = {
          code: data?.code || ERROR_CODES.INTERNAL_ERROR,
          message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
          details: data?.details,
        };
        
        throw { response, error };
      }

      const apiResponse: ApiResponse<T> = {
        success: true,
        data: data?.data || data,
        message: data?.message,
        meta: data?.meta,
        timestamp: new Date().toISOString(),
        requestId: response.headers.get('x-request-id') || undefined,
      };

      return this.executeResponseInterceptors(apiResponse);
    };

    return this.retryRequest(makeRequest);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url: endpoint,
      ...config,
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url: endpoint,
      body: data,
      ...config,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url: endpoint,
      body: data,
      ...config,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url: endpoint,
      body: data,
      ...config,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url: endpoint,
      ...config,
    });
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<T>({
      method: 'POST',
      url: endpoint,
      body: formData,
      timeout: API_CONFIG.TIMEOUT.UPLOAD,
      ...config,
    });
  }

  /**
   * Download file
   */
  async download(endpoint: string, config?: RequestConfig): Promise<Blob> {
    const response = await this.request<Blob>({
      method: 'GET',
      url: endpoint,
      timeout: API_CONFIG.TIMEOUT.DOWNLOAD,
      ...config,
    });
    
    return response.data as Blob;
  }
}

// Create default API client instance
const getBaseURL = (): string => {
  if (typeof window === 'undefined') {
    return API_CONFIG.BASE_URLS.DEVELOPMENT;
  }
  
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'production':
      return API_CONFIG.BASE_URLS.PRODUCTION;
    case 'development':
    default:
      return API_CONFIG.BASE_URLS.DEVELOPMENT;
  }
};

export const apiClient = new ApiClient({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.TIMEOUT.DEFAULT,
  retries: API_CONFIG.RETRY.MAX_ATTEMPTS,
});

// Initialize auth tokens from storage
if (typeof window !== 'undefined') {
  const storedTokens = localStorage.getItem('auth_tokens');
  if (storedTokens) {
    try {
      apiClient.setAuthTokens(JSON.parse(storedTokens));
    } catch (error) {
      console.warn('Failed to parse stored auth tokens:', error);
    }
  }
}

export default apiClient;
