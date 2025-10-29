/**
 * React Query Hooks for API Integration
 * Custom hooks for data fetching, caching, and state management
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { services } from './services';
import { SearchParams, User, UserRole, UserPermission, InventoryItem, Order, Livestock, Report, SystemSettings, LoginRequest, LoginResponse } from './types';
import { ErrorFactory } from './error-handler';

// Query Keys Factory
export const queryKeys = {
  // Authentication
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    select: ['users', 'select'] as const,
  },
  
  // Roles
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.roles.lists(), params] as const,
    details: () => [...queryKeys.roles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.roles.details(), id] as const,
    select: ['roles', 'select'] as const,
  },
  
  // Permissions
  permissions: {
    all: ['permissions'] as const,
    lists: () => [...queryKeys.permissions.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.permissions.lists(), params] as const,
    details: () => [...queryKeys.permissions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.permissions.details(), id] as const,
    select: ['permissions', 'select'] as const,
  },
  
  // Inventory
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...queryKeys.inventory.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.inventory.lists(), params] as const,
    details: () => [...queryKeys.inventory.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.inventory.details(), id] as const,
    stocks: ['inventory', 'stocks'] as const,
    batches: ['inventory', 'batches'] as const,
  },
  
  // Livestock
  livestock: {
    all: ['livestock'] as const,
    lists: () => [...queryKeys.livestock.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.livestock.lists(), params] as const,
    details: () => [...queryKeys.livestock.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.livestock.details(), id] as const,
    dashboard: ['livestock', 'dashboard'] as const,
    events: ['livestock', 'events'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.orders.lists(), params] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    dashboard: ['orders', 'dashboard'] as const,
  },
  
  // POS
  pos: {
    dashboard: ['pos', 'dashboard'] as const,
    transactions: ['pos', 'transactions'] as const,
  },
  
  // Reports
  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    list: (params: SearchParams) => [...queryKeys.reports.lists(), params] as const,
    details: () => [...queryKeys.reports.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.reports.details(), id] as const,
  },
  
  // Settings
  settings: {
    all: ['settings'] as const,
  },
  
  // System
  system: {
    health: ['system', 'health'] as const,
    logs: ['system', 'logs'] as const,
    metrics: ['system', 'metrics'] as const,
  },
};

// Authentication Hooks
export const useAuthProfile = (options?: UseQueryOptions<User>) => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => services.auth.getUserProfile(),
    ...options,
  });
};

export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginRequest>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.auth.login,
    onSuccess: (data) => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => services.auth.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    ...options,
  });
};

// User Management Hooks
export const useUsers = (params: SearchParams = {}, options?: UseQueryOptions<{ users: User[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => services.users.getUsers(params),
    ...options,
  });
};

export const useUser = (id: string, options?: UseQueryOptions<User>) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => services.users.getUserById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateUser = (options?: UseMutationOptions<User, Error, Partial<User>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.users.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
    ...options,
  });
};

export const useUpdateUser = (options?: UseMutationOptions<User, Error, { id: string; data: Partial<User> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => services.users.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.setQueryData(queryKeys.users.detail(variables.id), data);
    },
    ...options,
  });
};

export const useDeleteUser = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.users.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
    ...options,
  });
};

export const useUsersSelect = (options?: UseQueryOptions<{ id: string; name: string; email: string }[]>) => {
  return useQuery({
    queryKey: queryKeys.users.select,
    queryFn: () => services.users.getUsersForSelect(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Role Management Hooks
export const useRoles = (params: SearchParams = {}, options?: UseQueryOptions<{ roles: UserRole[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => services.roles.getRoles(params),
    ...options,
  });
};

export const useRole = (id: string, options?: UseQueryOptions<UserRole>) => {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => services.roles.getRoleById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateRole = (options?: UseMutationOptions<UserRole, Error, Partial<UserRole>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.roles.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
    ...options,
  });
};

export const useUpdateRole = (options?: UseMutationOptions<UserRole, Error, { id: string; data: Partial<UserRole> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => services.roles.updateRole(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.setQueryData(queryKeys.roles.detail(variables.id), data);
    },
    ...options,
  });
};

export const useDeleteRole = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.roles.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
    ...options,
  });
};

export const useRolesSelect = (options?: UseQueryOptions<{ id: string; name: string }[]>) => {
  return useQuery({
    queryKey: queryKeys.roles.select,
    queryFn: () => services.roles.getRolesForSelect(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Permission Management Hooks
export const usePermissions = (params: SearchParams = {}, options?: UseQueryOptions<{ permissions: UserPermission[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.permissions.list(params),
    queryFn: () => services.permissions.getPermissions(params),
    ...options,
  });
};

export const usePermission = (id: string, options?: UseQueryOptions<UserPermission>) => {
  return useQuery({
    queryKey: queryKeys.permissions.detail(id),
    queryFn: () => services.permissions.getPermissionById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreatePermission = (options?: UseMutationOptions<UserPermission, Error, Partial<UserPermission>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.permissions.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.lists() });
    },
    ...options,
  });
};

export const useUpdatePermission = (options?: UseMutationOptions<UserPermission, Error, { id: string; data: Partial<UserPermission> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => services.permissions.updatePermission(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.lists() });
      queryClient.setQueryData(queryKeys.permissions.detail(variables.id), data);
    },
    ...options,
  });
};

export const useDeletePermission = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.permissions.deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.lists() });
    },
    ...options,
  });
};

export const usePermissionsSelect = (options?: UseQueryOptions<{ id: string; name: string; slug: string }[]>) => {
  return useQuery({
    queryKey: queryKeys.permissions.select,
    queryFn: () => services.permissions.getPermissionsForSelect(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Inventory Management Hooks
export const useInventoryItems = (params: SearchParams = {}, options?: UseQueryOptions<{ items: InventoryItem[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.inventory.list(params),
    queryFn: () => services.inventory.getInventoryItems(params),
    ...options,
  });
};

export const useInventoryItem = (id: string, options?: UseQueryOptions<InventoryItem>) => {
  return useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => services.inventory.getInventoryItemById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateInventoryItem = (options?: UseMutationOptions<InventoryItem, Error, Partial<InventoryItem>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.inventory.createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.lists() });
    },
    ...options,
  });
};

export const useUpdateInventoryItem = (options?: UseMutationOptions<InventoryItem, Error, { id: string; data: Partial<InventoryItem> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => services.inventory.updateInventoryItem(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.lists() });
      queryClient.setQueryData(queryKeys.inventory.detail(variables.id), data);
    },
    ...options,
  });
};

export const useDeleteInventoryItem = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.inventory.deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.lists() });
    },
    ...options,
  });
};

export const useStockLevels = (params: SearchParams = {}, options?: UseQueryOptions<{ items: InventoryItem[]; meta: any }>) => {
  return useQuery({
    queryKey: [...queryKeys.inventory.stocks, params],
    queryFn: () => services.inventory.getStockLevels(params),
    ...options,
  });
};

// Livestock Management Hooks
export const useLivestockDashboard = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.livestock.dashboard,
    queryFn: () => services.livestock.getDashboard(),
    ...options,
  });
};

export const useLivestock = (params: SearchParams = {}, options?: UseQueryOptions<{ livestock: Livestock[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.livestock.list(params),
    queryFn: () => services.livestock.getLivestock(params),
    ...options,
  });
};

export const useLivestockItem = (id: string, options?: UseQueryOptions<Livestock>) => {
  return useQuery({
    queryKey: queryKeys.livestock.detail(id),
    queryFn: () => services.livestock.getLivestockById(id),
    enabled: !!id,
    ...options,
  });
};

export const useRegisterLivestock = (options?: UseMutationOptions<Livestock, Error, Partial<Livestock>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.livestock.registerLivestock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.livestock.lists() });
    },
    ...options,
  });
};

// Orders Management Hooks
export const useOrdersDashboard = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.orders.dashboard,
    queryFn: () => services.orders.getDashboard(),
    ...options,
  });
};

export const useOrders = (params: SearchParams = {}, options?: UseQueryOptions<{ orders: Order[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => services.orders.getOrders(params),
    ...options,
  });
};

export const useOrder = (id: string, options?: UseQueryOptions<Order>) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => services.orders.getOrderById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateOrder = (options?: UseMutationOptions<Order, Error, Partial<Order>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.orders.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    ...options,
  });
};

export const useUpdateOrder = (options?: UseMutationOptions<Order, Error, { id: string; data: Partial<Order> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => services.orders.updateOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.setQueryData(queryKeys.orders.detail(variables.id), data);
    },
    ...options,
  });
};

// POS Hooks
export const usePOSDashboard = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.pos.dashboard,
    queryFn: () => services.pos.getDashboard(),
    ...options,
  });
};

export const useProcessTransaction = (options?: UseMutationOptions<POSTransaction, Error, Partial<POSTransaction>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.pos.processTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.transactions });
    },
    ...options,
  });
};

// Reports Hooks
export const useReports = (params: SearchParams = {}, options?: UseQueryOptions<{ reports: Report[]; meta: any }>) => {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => services.reports.getReports(params),
    ...options,
  });
};

export const useReport = (id: string, options?: UseQueryOptions<Report>) => {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => services.reports.getReportById(id),
    enabled: !!id,
    ...options,
  });
};

export const useGenerateReport = (options?: UseMutationOptions<Report, Error, { type: string; parameters: Record<string, any> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, parameters }) => services.reports.generateReport(type, parameters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() });
    },
    ...options,
  });
};

// Settings Hooks
export const useSettings = (options?: UseQueryOptions<SystemSettings>) => {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => services.settings.getSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useUpdateGeneralSettings = (options?: UseMutationOptions<SystemSettings, Error, Partial<SystemSettings>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.settings.updateGeneralSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.settings.all, data);
    },
    ...options,
  });
};

export const useUpdateNotificationSettings = (options?: UseMutationOptions<SystemSettings, Error, Partial<SystemSettings>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: services.settings.updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.settings.all, data);
    },
    ...options,
  });
};

// System Hooks
export const useSystemHealth = (options?: UseQueryOptions<HealthCheck>) => {
  return useQuery({
    queryKey: queryKeys.system.health,
    queryFn: () => services.system.healthCheck(),
    refetchInterval: 30000, // 30 seconds
    ...options,
  });
};

export const useSystemLogs = (params: SearchParams = {}, options?: UseQueryOptions<{ logs: any[]; meta: any }>) => {
  return useQuery({
    queryKey: [...queryKeys.system.logs, params],
    queryFn: () => services.system.getLogs(params),
    ...options,
  });
};

export const useSystemMetrics = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: queryKeys.system.metrics,
    queryFn: () => services.system.getMetrics(),
    refetchInterval: 60000, // 1 minute
    ...options,
  });
};

// File Upload Hooks
export const useFileUpload = (options?: UseMutationOptions<FileUpload, Error, FileUploadRequest>) => {
  return useMutation({
    mutationFn: services.files.uploadFile,
    ...options,
  });
};

export const useFileDownload = (options?: UseMutationOptions<Blob, Error, string>) => {
  return useMutation({
    mutationFn: services.files.downloadFile,
    ...options,
  });
};

export const useFileDelete = (options?: UseMutationOptions<void, Error, string>) => {
  return useMutation({
    mutationFn: services.files.deleteFile,
    ...options,
  });
};

// Utility Hooks
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
    invalidateRoles: () => queryClient.invalidateQueries({ queryKey: queryKeys.roles.all }),
    invalidatePermissions: () => queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all }),
    invalidateInventory: () => queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all }),
    invalidateLivestock: () => queryClient.invalidateQueries({ queryKey: queryKeys.livestock.all }),
    invalidateOrders: () => queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
    invalidateReports: () => queryClient.invalidateQueries({ queryKey: queryKeys.reports.all }),
    invalidateSettings: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
  };
};

export default {
  // Authentication
  useAuthProfile,
  useLogin,
  useLogout,
  
  // Users
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUsersSelect,
  
  // Roles
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useRolesSelect,
  
  // Permissions
  usePermissions,
  usePermission,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  usePermissionsSelect,
  
  // Inventory
  useInventoryItems,
  useInventoryItem,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useStockLevels,
  
  // Livestock
  useLivestockDashboard,
  useLivestock,
  useLivestockItem,
  useRegisterLivestock,
  
  // Orders
  useOrdersDashboard,
  useOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrder,
  
  // POS
  usePOSDashboard,
  useProcessTransaction,
  
  // Reports
  useReports,
  useReport,
  useGenerateReport,
  
  // Settings
  useSettings,
  useUpdateGeneralSettings,
  useUpdateNotificationSettings,
  
  // System
  useSystemHealth,
  useSystemLogs,
  useSystemMetrics,
  
  // Files
  useFileUpload,
  useFileDownload,
  useFileDelete,
  
  // Utilities
  useInvalidateQueries,
};
