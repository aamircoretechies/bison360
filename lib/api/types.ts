/**
 * API Types and Interfaces
 * Comprehensive type definitions for enterprise-level API implementation
 */

import { HTTP_STATUS, API_RESPONSE_TYPES, ERROR_CODES, SORT_DIRECTIONS } from './config';

// Base API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: ApiMeta;
  timestamp: string;
  requestId?: string;
}

// API Error Interface
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  stack?: string;
}

// API Meta Information
export interface ApiMeta {
  pagination?: PaginationMeta;
  filters?: Record<string, any>;
  sort?: SortMeta;
  total?: number;
  version?: string;
}

// Pagination Meta
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Sort Meta
export interface SortMeta {
  field: string;
  direction: keyof typeof SORT_DIRECTIONS;
}

// Request Configuration
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
  method?: string;
  url?: string;
  body?: any;
}

// API Client Configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
}

// Request Interceptor
export interface RequestInterceptor {
  onFulfilled?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRejected?: (error: any) => any;
}

// Response Interceptor
export interface ResponseInterceptor {
  onFulfilled?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onRejected?: (error: any) => any;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user_role: number;
  bearer_token: string;
  user_id: number;
  message: string;
  active_block_status: number;
  status: number;
}

export interface LoginErrorResponse {
  message: string;
  status: number;
}

// Logout API Types
export interface LogoutRequest {
  // No body required for logout
}

export interface LogoutResponse {
  message: string;
  status: number;
}

export interface LogoutErrorResponse {
  message: string;
  status: number;
}

// Users API Types
export interface UsersRequest {
  page?: number;
  size?: number;
  search?: string;
  user_role?: number;
  user_status?: number;
}

export interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_status: number;
  mobile_number: string | null;
  mobile_number_country_code: string | null;
  status: number;
  created: string;
  updated: string | null;
  deleted: number;
  profile_image: string | null;
  address1: string | null;
  address2: string | null;
  user_role: number;
  user_role_description: string;
  user_active_inactive_blocked_status: number;
  user_active_inactive_blocked_status_description: string;
  is2_fa_enabled: number;
  last_login_updated: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface UsersData {
  content: UserData[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface UsersResponse {
  data: UsersData;
  message: string;
  status: number;
}

export interface UsersErrorResponse {
  message: string;
  status: number;
}

// Add User API Types
export interface AddUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  user_role: number;
}

export interface AddUserResponse {
  data: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_status: number;
    mobile_number: string | null;
    mobile_number_country_code: string | null;
    status: number;
    created: string;
    updated: string | null;
    deleted: number;
    profile_image: string | null;
    address1: string | null;
    address2: string | null;
    user_role: number;
    user_role_description: string;
    user_active_inactive_blocked_status: number;
    user_active_inactive_blocked_status_description: string;
    is2_fa_enabled: number;
    last_login_updated: string | null;
  };
  message: string;
  status: number;
}

export interface AddUserErrorResponse {
  message: string;
  status: number;
}

// Profile Edit API Types
export interface ProfileEditRequest {
  user_id: number;
  first_name: string;
  last_name: string;
  user_role: number;
  status: number;
}

export interface ProfileEditResponse {
  data: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_status: number;
    mobile_number: string | null;
    mobile_number_country_code: string | null;
    status: number;
    created: string;
    updated: string | null;
    deleted: number;
    profile_image: string | null;
    address1: string | null;
    address2: string | null;
    user_role: number;
    user_role_description: string;
    user_active_inactive_blocked_status: number;
    user_active_inactive_blocked_status_description: string;
    is2_fa_enabled: number;
    last_login_updated: string | null;
  };
  message: string;
  status: number;
}

export interface ProfileEditErrorResponse {
  message: string;
  status: number;
}

// Profile Delete API Types
export interface ProfileDeleteRequest {
  user_id: number;
}

export interface ProfileDeleteResponse {
  message: string;
  status: number;
}

export interface ProfileDeleteErrorResponse {
  message: string;
  status: number;
}

// SKU Batches API Types
export interface SkuBatchItem {
  sku_batch_id: number;
  sku_code: string;
  product_name: string;
  batch_number: string;
  quantity: number;
  shelf: string;
  expiry_date: string; // dd/mm/yyyy
  status: number; // 1 Active, 2 Expiring Soon, 3 Out of Stock, 4 Low Stock
  created: string;
  updated: string | null;
  deleted: number;
}

export interface SkuBatchesRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: number; // optional filter
  sort_by?: 'latest' | 'oldest';
}

export interface SkuBatchesData {
  sku_batches: {
    content: SkuBatchItem[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
  status_counts: Record<string, number>;
}

export interface SkuBatchesResponse {
  data: SkuBatchesData;
  message: string;
  status: number;
}

export interface SkuCreateRequest {
  product_name: string;
  batch_number: string;
  quantity: number;
  shelf: string;
  expiry_date: string; // dd/mm/yyyy
  status: number; // 1..4
  sku_code: string;
}

export interface SkuCreateResponse {
  data: SkuBatchItem;
  message: string;
  status: number;
}

export interface SkuUpdateRequest {
  sku_batch_id: number;
  product_name?: string;
  batch_number?: string;
  quantity?: number;
  shelf?: string;
  expiry_date?: string;
  status?: number;
  sku_code?: string;
}

export interface SkuUpdateResponse {
  data: SkuBatchItem;
  message: string;
  status: number;
}

export interface SkuDeleteRequest {
  sku_batch_ids: string; // comma separated ids
}

export interface SkuDeleteResponse {
  message: string;
  status: number;
}

// Stock Level API Types
export interface StockLevelItem {
  stock_level_id: number;
  sku_code: string;
  product_name: string;
  batch_number: string;
  quantity: number;
  location: string;
  expiry_date: string; // dd/mm/yyyy
  status: number; // 1 Active, 2 Expiring Soon, 3 Out of Stock, 4 Low Stock
  created: string;
  updated: string | null;
  deleted: number;
}

export interface StockLevelRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: number;
  sort_by?: 'latest' | 'oldest';
}

export interface StockLevelData {
  stock_levels: {
    content: StockLevelItem[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: { sorted: boolean; empty: boolean; unsorted: boolean };
    numberOfElements: number;
    empty: boolean;
  };
  status_counts: Record<string, number>;
}

export interface StockLevelResponse {
  data: StockLevelData;
  message: string;
  status: number;
}

export interface StockCreateRequest {
  sku_code: string;
  product_name: string;
  batch_number: string;
  quantity: number;
  location: string;
  expiry_date: string;
  status: number;
}

export interface StockCreateResponse {
  data: StockLevelItem;
  message: string;
  status: number;
}

export interface StockUpdateRequest {
  stock_level_id: number;
  sku_code?: string;
  product_name?: string;
  batch_number?: string;
  quantity?: number;
  location?: string;
  expiry_date?: string;
  status?: number;
}

export interface StockUpdateResponse {
  data: StockLevelItem;
  message: string;
  status: number;
}

export interface StockDeleteRequest {
  stock_level_ids: string; // comma-separated ids
}

export interface StockDeleteResponse {
  message: string;
  status: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  roleId: string;
}

// User Management Types
export interface User {
  id: string;
  email: string;
  name?: string;
  roleId: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastSignInAt?: string;
  emailVerifiedAt?: string;
  avatar?: string;
  role?: UserRole;
}

export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface UserRole {
  id: string;
  slug: string;
  name: string;
  description?: string;
  isProtected: boolean;
  isDefault: boolean;
  permissions?: UserPermission[];
}

export interface UserPermission {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

// Inventory Management Types
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  barcode?: string;
  batchNumber?: string;
  expiryDate?: string;
  supplier?: string;
  location?: string;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}

export enum InventoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export interface InventoryBatch {
  id: string;
  sku: string;
  batchNumber: string;
  quantity: number;
  receivedDate: string;
  expiryDate?: string;
  supplier: string;
  costPrice: number;
  status: BatchStatus;
}

export enum BatchStatus {
  RECEIVED = 'RECEIVED',
  IN_STOCK = 'IN_STOCK',
  EXPIRED = 'EXPIRED',
  SOLD_OUT = 'SOLD_OUT',
}

// Livestock Management Types
export interface Livestock {
  id: string;
  eid: string;
  name?: string;
  species: string;
  breed?: string;
  birthDate?: string;
  gender: Gender;
  weight?: number;
  status: LivestockStatus;
  location?: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum LivestockStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DECEASED = 'DECEASED',
  MISSING = 'MISSING',
}

export interface LivestockEvent {
  id: string;
  livestockId: string;
  eventType: EventType;
  eventDate: string;
  description?: string;
  location?: string;
  performedBy?: string;
  notes?: string;
}

export enum EventType {
  BIRTH = 'BIRTH',
  VACCINATION = 'VACCINATION',
  MEDICATION = 'MEDICATION',
  WEIGHING = 'WEIGHING',
  MOVEMENT = 'MOVEMENT',
  SALE = 'SALE',
  DEATH = 'DEATH',
}

// Orders Management Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// POS & Retail Types
export interface POSTransaction {
  id: string;
  transactionNumber: string;
  cashierId: string;
  items: POSItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerId?: string;
  createdAt: string;
}

export interface POSItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE = 'MOBILE',
  CHECK = 'CHECK',
}

// Reports Types
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  parameters: Record<string, any>;
  status: ReportStatus;
  generatedAt?: string;
  fileUrl?: string;
  createdBy: string;
  createdAt: string;
}

export enum ReportType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  LIVESTOCK = 'LIVESTOCK',
  USDA_COMPLIANCE = 'USDA_COMPLIANCE',
  AUDIT = 'AUDIT',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// System Settings Types
export interface SystemSettings {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  websiteURL?: string;
  supportEmail?: string;
  supportPhone?: string;
  language: string;
  timezone: string;
  currency: string;
  currencyFormat: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedIn?: string;
  socialPinterest?: string;
  socialYoutube?: string;
  notifyStockEmail: boolean;
  notifyStockWeb: boolean;
  notifyStockThreshold: number;
  notifyStockRoleIds: string[];
  notifyNewOrderEmail: boolean;
  notifyNewOrderWeb: boolean;
  notifyNewOrderRoleIds: string[];
  notifyOrderStatusUpdateEmail: boolean;
  notifyOrderStatusUpdateWeb: boolean;
  notifyOrderStatusUpdateRoleIds: string[];
  notifyPaymentFailureEmail: boolean;
  notifyPaymentFailureWeb: boolean;
  notifyPaymentFailureRoleIds: string[];
  notifySystemErrorFailureEmail: boolean;
  notifySystemErrorWeb: boolean;
  notifySystemErrorRoleIds: string[];
}

// File Upload Types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface FileUploadRequest {
  file: File;
  category?: string;
  metadata?: Record<string, any>;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
  dir?: keyof typeof SORT_DIRECTIONS;
  filters?: Record<string, any>;
}

export interface FilterOption {
  field: string;
  operator: FilterOperator;
  value: any;
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  BETWEEN = 'between',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
}

// API Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  details?: Record<string, any>;
}
