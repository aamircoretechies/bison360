/**
 * API Configuration Constants
 * Following MNC standards for enterprise-level API management
 */

// API Base Configuration
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URLS: {
    DEVELOPMENT: process.env.NEXT_PUBLIC_API_URL || 'https://jaap.live/bison-apis',
    STAGING: process.env.NEXT_PUBLIC_API_URL_STAGING || 'https://staging-api.bison360.com',
    PRODUCTION: process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.bison360.com',
  },
  
  // API Versioning
  VERSION: 'v1',
  
  // Request Configuration
  TIMEOUT: {
    DEFAULT: 30000, // 30 seconds
    UPLOAD: 120000, // 2 minutes for file uploads
    DOWNLOAD: 60000, // 1 minute for downloads
  },
  
  // Retry Configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second base delay
    BACKOFF_MULTIPLIER: 2,
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },
  
  // Cache Configuration
  CACHE: {
    DEFAULT_TTL: 300000, // 5 minutes
    LONG_TTL: 1800000, // 30 minutes
    SHORT_TTL: 60000, // 1 minute
  },
} as const;

// API Modules Configuration
export const API_MODULES = {
  // Authentication
  AUTH: {
    LOGIN: 'users/login',
    LOGOUT: 'logout',
    REGISTER: 'register',
    REFRESH: 'refresh',
    VERIFY_EMAIL: 'verify-email',
    RESET_PASSWORD: 'reset-password',
    CHANGE_PASSWORD: 'change-password',
  },
  
  // User Management
  USERS: {
    BASE: 'users',
    PROFILE: 'profile',
    SELECT: 'select',
    RESTORE: 'restore',
    GET_ALL: 'users/get-all',
    ADD_USER: 'users/direct-registration',
    UPDATE: 'users/update',
    DELETE: 'users/delete',
  },
  
  // Roles Management
  ROLES: {
    BASE: 'roles',
    SELECT: 'select',
    DEFAULT: 'default',
  },
  
  // Permissions Management
  PERMISSIONS: {
    BASE: 'permissions',
    SELECT: 'select',
    DELETE: 'delete',
  },
  
  // Settings Management
  SETTINGS: {
    BASE: 'settings',
    GENERAL: 'general',
    NOTIFICATIONS: 'notifications',
    SOCIAL: 'social',
  },
  
  // Inventory Management
  INVENTORY: {
    BASE: 'inventory',
    BARCODES: 'barcodes',
    SKUS: 'skus',
    STOCKS: 'stocks',
    REPORTS: 'reports',
  },

  // SKU Batches
  SKU_BATCHES: {
    BASE: 'sku-batches',
    GET_ALL: 'sku-batches/get-all',
    CREATE: 'sku-batches/create',
    UPDATE: 'sku-batches/update',
    DELETE: 'sku-batches/delete',
  },

  // Stock Level
  STOCK_LEVEL: {
    BASE: 'stock-level',
    GET_ALL: 'stock-level/get-all',
    CREATE: 'stock-level/create',
    UPDATE: 'stock-level/update',
    DELETE: 'stock-level/delete',
  },
  
  // Livestock Management
  LIVESTOCK: {
    BASE: 'livestock',
    DASHBOARD: 'dashboard',
    REGISTER: 'register',
    PROFILES: 'profiles',
    EVENTS: 'events',
    REPORTS: 'reports',
  },
  
  // Orders Management
  ORDERS: {
    BASE: 'orders',
    DASHBOARD: 'dashboard',
    POS: 'pos',
    SHIPPING_LABEL: 'shipping-label',
    REPORTS: 'reports',
  },
  
  // POS & Retail
  POS_RETAIL: {
    BASE: 'pos-retail',
    TERMINAL: 'pos-terminal',
    SALES_DASHBOARD: 'sales-dashboard',
    TRANSACTIONS_LOG: 'transactions-log',
    Z_REPORT: 'z-report',
    RETAIL_PRODUCTS: 'retail-products',
    CUSTOMER_MANAGEMENT: 'customer-management',
    REFUNDS_CANCELLATIONS: 'refunds-cancellations',
    AUDIT_LOGS: 'audit-logs',
  },
  
  // Reports & Compliance
  REPORTS: {
    BASE: 'reports',
    USDA_REPORTS: 'usda-reports',
    MEAT_MOVEMENT_SHRINKAGE: 'meat-movement-shrinkage',
    SALES_REPORTS: 'sales-reports',
    AUDIT_LOGS: 'audit-logs',
  },
  
  // Integrations
  INTEGRATIONS: {
    BASE: 'integrations',
    GROWNBY_WEBHOOK: 'grownby-webhook',
    SHIPPING_GENERATE_LABEL: 'shipping-generate-label',
  },
  
  // File Management
  FILES: {
    UPLOAD: 'upload',
    DOWNLOAD: 'download',
    DELETE: 'delete',
  },
  
  // System
  SYSTEM: {
    HEALTH: 'health',
    LOGS: 'logs',
    METRICS: 'metrics',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// API Response Types
export const API_RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  CSV: 'text/csv',
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Validation Errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business Logic Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // System Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // File Upload Errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
} as const;

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Sort Configuration
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Environment Detection
export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

// API Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_CACHING: process.env.NEXT_PUBLIC_ENABLE_API_CACHING === 'true',
  ENABLE_RETRY: process.env.NEXT_PUBLIC_ENABLE_API_RETRY === 'true',
  ENABLE_LOGGING: process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === 'true',
  ENABLE_METRICS: process.env.NEXT_PUBLIC_ENABLE_API_METRICS === 'true',
} as const;
