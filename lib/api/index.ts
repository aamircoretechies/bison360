/**
 * API Module Index
 * Main entry point for all API-related functionality
 */

// Configuration and Constants
export * from './config';

// Types and Interfaces
export * from './types';

// API Client
export { default as apiClient } from './client';

// Error Handling
export * from './error-handler';

// Services
export { default as services } from './services';

// React Query Hooks
export * from './hooks';

// Documentation
export * from './docs';

// Re-export commonly used items for convenience
export {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_CODES,
  PAGINATION,
  SORT_DIRECTIONS,
} from './config';

export {
  ApiResponse,
  ApiError,
  User,
  UserRole,
  UserPermission,
  InventoryItem,
  Livestock,
  Order,
  Report,
  SystemSettings,
  SearchParams,
} from './types';

export {
  ErrorFactory,
  AppError,
  ErrorSeverity,
  ErrorCategory,
} from './error-handler';

// Default export for easy importing
export default {
  config: () => import('./config'),
  types: () => import('./types'),
  client: () => import('./client'),
  errorHandler: () => import('./error-handler'),
  services: () => import('./services'),
  hooks: () => import('./hooks'),
  docs: () => import('./docs'),
};
