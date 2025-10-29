/**
 * API Service Layer
 * Business logic layer for API operations with caching and optimization
 */

import apiClient from './client';
import { API_MODULES, PAGINATION } from './config';
import {
  ApiResponse,
  SearchParams,
  User,
  UserRole,
  UserPermission,
  InventoryItem,
  InventoryBatch,
  Livestock,
  LivestockEvent,
  Order,
  POSTransaction,
  Report,
  SystemSettings,
  FileUpload,
  FileUploadRequest,
  HealthCheck,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from './types';
import { ErrorFactory } from './error-handler';

// Base Service Class
abstract class BaseService {
  protected client = apiClient;

  /**
   * Handle API response and throw appropriate errors
   */
  protected handleResponse<T>(response: ApiResponse<T>): T {
    if (!response.success || response.error) {
      throw ErrorFactory.internal(response.error?.message || 'API request failed', response.error?.details);
    }
    return response.data as T;
  }

  /**
   * Build search parameters for API requests
   */
  protected buildSearchParams(params: SearchParams): Record<string, any> {
    return {
      page: params.page || PAGINATION.DEFAULT_PAGE,
      limit: params.limit || PAGINATION.DEFAULT_LIMIT,
      query: params.query || '',
      sort: params.sort || 'createdAt',
      dir: params.dir || 'desc',
      ...params.filters,
    };
  }
}

// Authentication Service
export class AuthService extends BaseService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>(
      API_MODULES.AUTH.LOGIN,
      credentials
    );
    
    const data = this.handleResponse(response);
    
    // Store tokens in client
    this.client.setAuthTokens(data.tokens);
    
    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_tokens', JSON.stringify(data.tokens));
    }
    
    return data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.client.post(API_MODULES.AUTH.LOGOUT);
    } finally {
      // Clear tokens regardless of API response
      this.client.setAuthTokens(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_tokens');
        sessionStorage.removeItem('auth_tokens');
      }
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<User> {
    const response = await this.client.post<User>(
      API_MODULES.AUTH.REGISTER,
      userData
    );
    return this.handleResponse(response);
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await this.client.post(
      API_MODULES.AUTH.VERIFY_EMAIL,
      { token }
    );
    this.handleResponse(response);
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    const response = await this.client.post(
      API_MODULES.AUTH.RESET_PASSWORD,
      { email }
    );
    this.handleResponse(response);
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await this.client.post(
      API_MODULES.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    this.handleResponse(response);
  }
}

// User Management Service
export class UserService extends BaseService {
  /**
   * Get all users with pagination and search
   */
  async getUsers(params: SearchParams = {}): Promise<{ users: User[]; meta: any }> {
    const response = await this.client.get<{ users: User[]; meta: any }>(
      API_MODULES.USERS.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await this.client.get<User>(
      `${API_MODULES.USERS.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Create new user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const response = await this.client.post<User>(
      API_MODULES.USERS.BASE,
      userData
    );
    return this.handleResponse(response);
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.client.put<User>(
      `${API_MODULES.USERS.BASE}/${id}`,
      userData
    );
    return this.handleResponse(response);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const response = await this.client.delete(
      `${API_MODULES.USERS.BASE}/${id}`
    );
    this.handleResponse(response);
  }

  /**
   * Restore user
   */
  async restoreUser(id: string): Promise<User> {
    const response = await this.client.post<User>(
      `${API_MODULES.USERS.BASE}/${id}/${API_MODULES.USERS.RESTORE}`
    );
    return this.handleResponse(response);
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<User> {
    const response = await this.client.get<User>(
      API_MODULES.USERS.PROFILE
    );
    return this.handleResponse(response);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    const response = await this.client.put<User>(
      API_MODULES.USERS.PROFILE,
      profileData
    );
    return this.handleResponse(response);
  }

  /**
   * Get users for select dropdown
   */
  async getUsersForSelect(): Promise<{ id: string; name: string; email: string }[]> {
    const response = await this.client.get<{ id: string; name: string; email: string }[]>(
      API_MODULES.USERS.SELECT
    );
    return this.handleResponse(response);
  }
}

// Role Management Service
export class RoleService extends BaseService {
  /**
   * Get all roles
   */
  async getRoles(params: SearchParams = {}): Promise<{ roles: UserRole[]; meta: any }> {
    const response = await this.client.get<{ roles: UserRole[]; meta: any }>(
      API_MODULES.ROLES.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<UserRole> {
    const response = await this.client.get<UserRole>(
      `${API_MODULES.ROLES.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Create new role
   */
  async createRole(roleData: Partial<UserRole>): Promise<UserRole> {
    const response = await this.client.post<UserRole>(
      API_MODULES.ROLES.BASE,
      roleData
    );
    return this.handleResponse(response);
  }

  /**
   * Update role
   */
  async updateRole(id: string, roleData: Partial<UserRole>): Promise<UserRole> {
    const response = await this.client.put<UserRole>(
      `${API_MODULES.ROLES.BASE}/${id}`,
      roleData
    );
    return this.handleResponse(response);
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<void> {
    const response = await this.client.delete(
      `${API_MODULES.ROLES.BASE}/${id}`
    );
    this.handleResponse(response);
  }

  /**
   * Set default role
   */
  async setDefaultRole(id: string): Promise<UserRole> {
    const response = await this.client.post<UserRole>(
      `${API_MODULES.ROLES.BASE}/${id}/${API_MODULES.ROLES.DEFAULT}`
    );
    return this.handleResponse(response);
  }

  /**
   * Get roles for select dropdown
   */
  async getRolesForSelect(): Promise<{ id: string; name: string }[]> {
    const response = await this.client.get<{ id: string; name: string }[]>(
      API_MODULES.ROLES.SELECT
    );
    return this.handleResponse(response);
  }
}

// Permission Management Service
export class PermissionService extends BaseService {
  /**
   * Get all permissions
   */
  async getPermissions(params: SearchParams = {}): Promise<{ permissions: UserPermission[]; meta: any }> {
    const response = await this.client.get<{ permissions: UserPermission[]; meta: any }>(
      API_MODULES.PERMISSIONS.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id: string): Promise<UserPermission> {
    const response = await this.client.get<UserPermission>(
      `${API_MODULES.PERMISSIONS.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Create new permission
   */
  async createPermission(permissionData: Partial<UserPermission>): Promise<UserPermission> {
    const response = await this.client.post<UserPermission>(
      API_MODULES.PERMISSIONS.BASE,
      permissionData
    );
    return this.handleResponse(response);
  }

  /**
   * Update permission
   */
  async updatePermission(id: string, permissionData: Partial<UserPermission>): Promise<UserPermission> {
    const response = await this.client.put<UserPermission>(
      `${API_MODULES.PERMISSIONS.BASE}/${id}`,
      permissionData
    );
    return this.handleResponse(response);
  }

  /**
   * Delete permission
   */
  async deletePermission(id: string): Promise<void> {
    const response = await this.client.delete(
      `${API_MODULES.PERMISSIONS.BASE}/${id}`
    );
    this.handleResponse(response);
  }

  /**
   * Get permissions for select dropdown
   */
  async getPermissionsForSelect(): Promise<{ id: string; name: string; slug: string }[]> {
    const response = await this.client.get<{ id: string; name: string; slug: string }[]>(
      API_MODULES.PERMISSIONS.SELECT
    );
    return this.handleResponse(response);
  }
}

// Inventory Management Service
export class InventoryService extends BaseService {
  /**
   * Get inventory items
   */
  async getInventoryItems(params: SearchParams = {}): Promise<{ items: InventoryItem[]; meta: any }> {
    const response = await this.client.get<{ items: InventoryItem[]; meta: any }>(
      API_MODULES.INVENTORY.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get inventory item by ID
   */
  async getInventoryItemById(id: string): Promise<InventoryItem> {
    const response = await this.client.get<InventoryItem>(
      `${API_MODULES.INVENTORY.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Create inventory item
   */
  async createInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await this.client.post<InventoryItem>(
      API_MODULES.INVENTORY.BASE,
      itemData
    );
    return this.handleResponse(response);
  }

  /**
   * Update inventory item
   */
  async updateInventoryItem(id: string, itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await this.client.put<InventoryItem>(
      `${API_MODULES.INVENTORY.BASE}/${id}`,
      itemData
    );
    return this.handleResponse(response);
  }

  /**
   * Delete inventory item
   */
  async deleteInventoryItem(id: string): Promise<void> {
    const response = await this.client.delete(
      `${API_MODULES.INVENTORY.BASE}/${id}`
    );
    this.handleResponse(response);
  }

  /**
   * Get inventory batches
   */
  async getInventoryBatches(params: SearchParams = {}): Promise<{ batches: InventoryBatch[]; meta: any }> {
    const response = await this.client.get<{ batches: InventoryBatch[]; meta: any }>(
      `${API_MODULES.INVENTORY.BASE}/batches`,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Process barcode
   */
  async processBarcode(barcode: string): Promise<InventoryItem> {
    const response = await this.client.post<InventoryItem>(
      API_MODULES.INVENTORY.BARCODES,
      { barcode }
    );
    return this.handleResponse(response);
  }

  /**
   * Get stock levels
   */
  async getStockLevels(params: SearchParams = {}): Promise<{ items: InventoryItem[]; meta: any }> {
    const response = await this.client.get<{ items: InventoryItem[]; meta: any }>(
      API_MODULES.INVENTORY.STOCKS,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }
}

// Livestock Management Service
export class LivestockService extends BaseService {
  /**
   * Get livestock dashboard data
   */
  async getDashboard(): Promise<any> {
    const response = await this.client.get<any>(
      API_MODULES.LIVESTOCK.DASHBOARD
    );
    return this.handleResponse(response);
  }

  /**
   * Get all livestock
   */
  async getLivestock(params: SearchParams = {}): Promise<{ livestock: Livestock[]; meta: any }> {
    const response = await this.client.get<{ livestock: Livestock[]; meta: any }>(
      API_MODULES.LIVESTOCK.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get livestock by ID
   */
  async getLivestockById(id: string): Promise<Livestock> {
    const response = await this.client.get<Livestock>(
      `${API_MODULES.LIVESTOCK.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Register new livestock
   */
  async registerLivestock(livestockData: Partial<Livestock>): Promise<Livestock> {
    const response = await this.client.post<Livestock>(
      API_MODULES.LIVESTOCK.REGISTER,
      livestockData
    );
    return this.handleResponse(response);
  }

  /**
   * Update livestock
   */
  async updateLivestock(id: string, livestockData: Partial<Livestock>): Promise<Livestock> {
    const response = await this.client.put<Livestock>(
      `${API_MODULES.LIVESTOCK.BASE}/${id}`,
      livestockData
    );
    return this.handleResponse(response);
  }

  /**
   * Get livestock events
   */
  async getLivestockEvents(params: SearchParams = {}): Promise<{ events: LivestockEvent[]; meta: any }> {
    const response = await this.client.get<{ events: LivestockEvent[]; meta: any }>(
      API_MODULES.LIVESTOCK.EVENTS,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Add livestock event
   */
  async addLivestockEvent(eventData: Partial<LivestockEvent>): Promise<LivestockEvent> {
    const response = await this.client.post<LivestockEvent>(
      API_MODULES.LIVESTOCK.EVENTS,
      eventData
    );
    return this.handleResponse(response);
  }
}

// Orders Management Service
export class OrderService extends BaseService {
  /**
   * Get orders dashboard
   */
  async getDashboard(): Promise<any> {
    const response = await this.client.get<any>(
      API_MODULES.ORDERS.DASHBOARD
    );
    return this.handleResponse(response);
  }

  /**
   * Get all orders
   */
  async getOrders(params: SearchParams = {}): Promise<{ orders: Order[]; meta: any }> {
    const response = await this.client.get<{ orders: Order[]; meta: any }>(
      API_MODULES.ORDERS.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await this.client.get<Order>(
      `${API_MODULES.ORDERS.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Create new order
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await this.client.post<Order>(
      API_MODULES.ORDERS.BASE,
      orderData
    );
    return this.handleResponse(response);
  }

  /**
   * Update order
   */
  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const response = await this.client.put<Order>(
      `${API_MODULES.ORDERS.BASE}/${id}`,
      orderData
    );
    return this.handleResponse(response);
  }

  /**
   * Generate shipping label
   */
  async generateShippingLabel(orderId: string, carrier: string): Promise<{ labelUrl: string; trackingNumber: string }> {
    const response = await this.client.post<{ labelUrl: string; trackingNumber: string }>(
      API_MODULES.ORDERS.SHIPPING_LABEL,
      { orderId, carrier }
    );
    return this.handleResponse(response);
  }
}

// POS & Retail Service
export class POSService extends BaseService {
  /**
   * Get POS dashboard
   */
  async getDashboard(): Promise<any> {
    const response = await this.client.get<any>(
      API_MODULES.POS_RETAIL.SALES_DASHBOARD
    );
    return this.handleResponse(response);
  }

  /**
   * Process POS transaction
   */
  async processTransaction(transactionData: Partial<POSTransaction>): Promise<POSTransaction> {
    const response = await this.client.post<POSTransaction>(
      API_MODULES.POS_RETAIL.TERMINAL,
      transactionData
    );
    return this.handleResponse(response);
  }

  /**
   * Get transaction log
   */
  async getTransactionLog(params: SearchParams = {}): Promise<{ transactions: POSTransaction[]; meta: any }> {
    const response = await this.client.get<{ transactions: POSTransaction[]; meta: any }>(
      API_MODULES.POS_RETAIL.TRANSACTIONS_LOG,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Generate Z-report
   */
  async generateZReport(date: string): Promise<{ reportUrl: string }> {
    const response = await this.client.post<{ reportUrl: string }>(
      API_MODULES.POS_RETAIL.Z_REPORT,
      { date }
    );
    return this.handleResponse(response);
  }
}

// Reports Service
export class ReportService extends BaseService {
  /**
   * Generate report
   */
  async generateReport(reportType: string, parameters: Record<string, any>): Promise<Report> {
    const response = await this.client.post<Report>(
      API_MODULES.REPORTS.BASE,
      { type: reportType, parameters }
    );
    return this.handleResponse(response);
  }

  /**
   * Get report by ID
   */
  async getReportById(id: string): Promise<Report> {
    const response = await this.client.get<Report>(
      `${API_MODULES.REPORTS.BASE}/${id}`
    );
    return this.handleResponse(response);
  }

  /**
   * Get all reports
   */
  async getReports(params: SearchParams = {}): Promise<{ reports: Report[]; meta: any }> {
    const response = await this.client.get<{ reports: Report[]; meta: any }>(
      API_MODULES.REPORTS.BASE,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }
}

// Settings Service
export class SettingsService extends BaseService {
  /**
   * Get system settings
   */
  async getSettings(): Promise<SystemSettings> {
    const response = await this.client.get<SystemSettings>(
      API_MODULES.SETTINGS.BASE
    );
    return this.handleResponse(response);
  }

  /**
   * Update general settings
   */
  async updateGeneralSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await this.client.put<SystemSettings>(
      API_MODULES.SETTINGS.GENERAL,
      settings
    );
    return this.handleResponse(response);
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await this.client.put<SystemSettings>(
      API_MODULES.SETTINGS.NOTIFICATIONS,
      settings
    );
    return this.handleResponse(response);
  }

  /**
   * Update social settings
   */
  async updateSocialSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await this.client.put<SystemSettings>(
      API_MODULES.SETTINGS.SOCIAL,
      settings
    );
    return this.handleResponse(response);
  }
}

// File Upload Service
export class FileService extends BaseService {
  /**
   * Upload file
   */
  async uploadFile(fileUpload: FileUploadRequest): Promise<FileUpload> {
    const response = await this.client.upload<FileUpload>(
      API_MODULES.FILES.UPLOAD,
      fileUpload.file,
      {
        headers: {
          'X-Category': fileUpload.category || 'general',
          'X-Metadata': JSON.stringify(fileUpload.metadata || {}),
        },
      }
    );
    return this.handleResponse(response);
  }

  /**
   * Download file
   */
  async downloadFile(fileId: string): Promise<Blob> {
    return this.client.download(`${API_MODULES.FILES.DOWNLOAD}/${fileId}`);
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<void> {
    const response = await this.client.delete(
      `${API_MODULES.FILES.DELETE}/${fileId}`
    );
    this.handleResponse(response);
  }
}

// System Service
export class SystemService extends BaseService {
  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheck> {
    const response = await this.client.get<HealthCheck>(
      API_MODULES.SYSTEM.HEALTH
    );
    return this.handleResponse(response);
  }

  /**
   * Get system logs
   */
  async getLogs(params: SearchParams = {}): Promise<{ logs: any[]; meta: any }> {
    const response = await this.client.get<{ logs: any[]; meta: any }>(
      API_MODULES.SYSTEM.LOGS,
      { params: this.buildSearchParams(params) }
    );
    return this.handleResponse(response);
  }

  /**
   * Get system metrics
   */
  async getMetrics(): Promise<any> {
    const response = await this.client.get<any>(
      API_MODULES.SYSTEM.METRICS
    );
    return this.handleResponse(response);
  }
}

// Export all services
export const services = {
  auth: new AuthService(),
  users: new UserService(),
  roles: new RoleService(),
  permissions: new PermissionService(),
  inventory: new InventoryService(),
  livestock: new LivestockService(),
  orders: new OrderService(),
  pos: new POSService(),
  reports: new ReportService(),
  settings: new SettingsService(),
  files: new FileService(),
  system: new SystemService(),
};

export default services;
