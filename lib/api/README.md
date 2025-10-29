# Bison360 API Implementation

A comprehensive, enterprise-grade API implementation following MNC (Multi-National Corporation) standards for the Bison360 livestock and meat processing management system.

## 🏗️ Architecture Overview

This API implementation provides a complete solution for:
- **Authentication & Authorization** - Secure user management with JWT tokens
- **User Management** - Complete CRUD operations for users, roles, and permissions
- **Inventory Management** - Meat inventory tracking with barcode processing
- **Livestock Management** - EID tracking and lifecycle event management
- **Orders & Shipping** - Order processing and shipping label generation
- **POS & Retail** - Point-of-sale operations and transaction management
- **Reports & Compliance** - USDA compliance and audit reporting
- **File Management** - Secure file upload and storage
- **System Monitoring** - Health checks and system metrics

## 📁 Project Structure

```
lib/api/
├── config.ts          # API configuration and constants
├── types.ts           # TypeScript interfaces and types
├── client.ts          # HTTP client with interceptors
├── error-handler.ts   # Error handling and logging
├── services.ts        # Business logic service layer
├── hooks.ts           # React Query hooks
├── docs.ts            # API documentation
├── examples.ts        # Usage examples and integration guide
└── index.ts           # Main entry point
```

## 🚀 Quick Start

### 1. Installation

The API implementation is already integrated into the project. No additional installation required.

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.template .env.local
```

Update the following essential variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bison360_dev"
DIRECT_URL="postgresql://username:password@localhost:5432/bison360_dev"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_PATH=""
```

### 3. Basic Usage

#### Using Services Directly

```typescript
import { services } from '@/lib/api';

// Get users
const users = await services.users.getUsers({
  page: 1,
  limit: 10,
  query: 'john'
});

// Create user
const newUser = await services.users.createUser({
  email: 'john@example.com',
  password: 'password123',
  name: 'John Doe',
  roleId: 'role-id'
});
```

#### Using React Query Hooks

```typescript
import { useUsers, useCreateUser } from '@/lib/api';

function UserList() {
  const { data: users, isLoading } = useUsers({
    page: 1,
    limit: 10
  });
  
  const createUserMutation = useCreateUser({
    onSuccess: (user) => {
      console.log('User created:', user);
    }
  });
  
  const handleCreateUser = () => {
    createUserMutation.mutate({
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Doe',
      roleId: 'role-id'
    });
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <button onClick={handleCreateUser}>
        Create User
      </button>
      {users?.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### API Configuration

The API configuration is centralized in `lib/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URLS: {
    DEVELOPMENT: 'http://localhost:3000',
    STAGING: 'https://staging-api.bison360.com',
    PRODUCTION: 'https://api.bison360.com',
  },
  TIMEOUT: {
    DEFAULT: 30000,
    UPLOAD: 120000,
    DOWNLOAD: 60000,
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2,
  },
};
```

### Feature Flags

Control API features through environment variables:

```env
NEXT_PUBLIC_ENABLE_API_CACHING="true"
NEXT_PUBLIC_ENABLE_API_RETRY="true"
NEXT_PUBLIC_ENABLE_API_LOGGING="true"
NEXT_PUBLIC_ENABLE_API_METRICS="true"
```

## 📚 API Services

### Authentication Service

```typescript
import { services } from '@/lib/api';

// Login
const loginData = await services.auth.login({
  email: 'demo@kt.com',
  password: 'demo123',
  rememberMe: false
});

// Logout
await services.auth.logout();

// Register
const user = await services.auth.register({
  email: 'new@example.com',
  password: 'password123',
  name: 'New User',
  roleId: 'role-id'
});
```

### User Management Service

```typescript
// Get users with pagination
const users = await services.users.getUsers({
  page: 1,
  limit: 10,
  query: 'search term',
  sort: 'createdAt',
  dir: 'desc'
});

// Get user by ID
const user = await services.users.getUserById('user-id');

// Update user
const updatedUser = await services.users.updateUser('user-id', {
  name: 'Updated Name',
  status: 'ACTIVE'
});

// Delete user
await services.users.deleteUser('user-id');
```

### Inventory Management Service

```typescript
// Get inventory items
const items = await services.inventory.getInventoryItems({
  filters: { status: 'ACTIVE', category: 'meat' }
});

// Process barcode
const item = await services.inventory.processBarcode('1234567890123');

// Get stock levels
const stockLevels = await services.inventory.getStockLevels({
  filters: { minStock: 10 }
});
```

### Livestock Management Service

```typescript
// Get dashboard
const dashboard = await services.livestock.getDashboard();

// Register livestock
const livestock = await services.livestock.registerLivestock({
  eid: 'EID123456789',
  species: 'Bison',
  gender: 'MALE',
  name: 'Big Bull'
});

// Add event
const event = await services.livestock.addLivestockEvent({
  livestockId: 'livestock-id',
  eventType: 'VACCINATION',
  eventDate: new Date().toISOString(),
  description: 'Annual vaccination'
});
```

## 🎣 React Query Hooks

### Available Hooks

#### Authentication Hooks
- `useAuthProfile()` - Get current user profile
- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation

#### User Management Hooks
- `useUsers(params)` - Get users list
- `useUser(id)` - Get user by ID
- `useCreateUser()` - Create user mutation
- `useUpdateUser()` - Update user mutation
- `useDeleteUser()` - Delete user mutation
- `useUsersSelect()` - Get users for select dropdown

#### Inventory Hooks
- `useInventoryItems(params)` - Get inventory items
- `useInventoryItem(id)` - Get inventory item by ID
- `useCreateInventoryItem()` - Create inventory item mutation
- `useUpdateInventoryItem()` - Update inventory item mutation
- `useDeleteInventoryItem()` - Delete inventory item mutation
- `useStockLevels(params)` - Get stock levels

#### Livestock Hooks
- `useLivestockDashboard()` - Get livestock dashboard
- `useLivestock(params)` - Get livestock list
- `useLivestockItem(id)` - Get livestock by ID
- `useRegisterLivestock()` - Register livestock mutation

#### Orders Hooks
- `useOrdersDashboard()` - Get orders dashboard
- `useOrders(params)` - Get orders list
- `useOrder(id)` - Get order by ID
- `useCreateOrder()` - Create order mutation
- `useUpdateOrder()` - Update order mutation

#### Reports Hooks
- `useReports(params)` - Get reports list
- `useReport(id)` - Get report by ID
- `useGenerateReport()` - Generate report mutation

#### Settings Hooks
- `useSettings()` - Get system settings
- `useUpdateGeneralSettings()` - Update general settings mutation
- `useUpdateNotificationSettings()` - Update notification settings mutation

#### System Hooks
- `useSystemHealth()` - Get system health status
- `useSystemLogs(params)` - Get system logs
- `useSystemMetrics()` - Get system metrics

#### File Hooks
- `useFileUpload()` - File upload mutation
- `useFileDownload()` - File download mutation
- `useFileDelete()` - File delete mutation

### Custom Hooks Example

```typescript
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/lib/api';

export const useUserManagement = () => {
  const { data: users, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  
  const createUser = async (userData) => {
    const newUser = await createUserMutation.mutateAsync(userData);
    await refetch();
    return newUser;
  };
  
  const updateUser = async (id, userData) => {
    const updatedUser = await updateUserMutation.mutateAsync({ id, data: userData });
    await refetch();
    return updatedUser;
  };
  
  const deleteUser = async (id) => {
    await deleteUserMutation.mutateAsync(id);
    await refetch();
  };
  
  return {
    users: users?.users || [],
    meta: users?.meta,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
```

## 🛡️ Error Handling

### Error Types

The API uses a comprehensive error handling system with different error categories:

```typescript
import { ErrorFactory, ErrorSeverity, ErrorCategory } from '@/lib/api';

// Authentication errors
const authError = ErrorFactory.authentication('Invalid credentials');

// Validation errors
const validationError = ErrorFactory.validation('Required field missing');

// Business logic errors
const notFoundError = ErrorFactory.notFound('User', 'user-id');

// System errors
const systemError = ErrorFactory.internal('Database connection failed');
```

### Error Handling in Components

```typescript
import { ErrorFactory } from '@/lib/api';

const MyComponent = () => {
  const { data, error, isLoading } = useUsers();
  
  if (error) {
    // Handle different error types
    if (error.code === 'AUTH_INSUFFICIENT_PERMISSIONS') {
      return <div>You don't have permission to view users</div>;
    }
    
    if (error.code === 'RESOURCE_NOT_FOUND') {
      return <div>No users found</div>;
    }
    
    return <div>Error: {error.message}</div>;
  }
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* Render users */}</div>;
};
```

## 📊 Caching Strategy

The API uses React Query for intelligent caching:

```typescript
// Configure cache settings
const { data } = useUsers(params, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

// Invalidate cache when needed
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['users'] });
```

## 🔐 Authentication Flow

### Login Process

```typescript
import { useLogin } from '@/lib/api';

const LoginForm = () => {
  const loginMutation = useLogin({
    onSuccess: (data) => {
      // Tokens are automatically stored
      console.log('Login successful:', data.user);
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    }
  });
  
  const handleSubmit = (formData) => {
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Token Management

Tokens are automatically managed by the API client:

- **Access Token**: Automatically included in requests
- **Refresh Token**: Automatically used when access token expires
- **Storage**: Tokens stored in localStorage (or sessionStorage for rememberMe: false)
- **Cleanup**: Tokens cleared on logout or auth failure

## 📁 File Upload

### Upload Files

```typescript
import { useFileUpload } from '@/lib/api';

const FileUploadComponent = () => {
  const uploadMutation = useFileUpload({
    onSuccess: (file) => {
      console.log('File uploaded:', file.url);
    },
    onError: (error) => {
      console.error('Upload failed:', error.message);
    }
  });
  
  const handleFileUpload = (file: File) => {
    uploadMutation.mutate({
      file,
      category: 'user-avatars',
      metadata: {
        userId: 'user-id',
        description: 'Profile picture'
      }
    });
  };
  
  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
      }}
    />
  );
};
```

## 🔍 Search and Filtering

### Advanced Search

```typescript
const { data } = useUsers({
  page: 1,
  limit: 20,
  query: 'john',
  sort: 'createdAt',
  dir: 'desc',
  filters: {
    status: 'ACTIVE',
    roleId: 'admin-role-id',
    createdAt: {
      from: '2024-01-01',
      to: '2024-12-31'
    }
  }
});
```

### Filter Operators

```typescript
// Available filter operators
const filters = {
  // Exact match
  status: 'ACTIVE',
  
  // Array contains
  roleIds: ['admin', 'manager'],
  
  // Date range
  createdAt: {
    from: '2024-01-01',
    to: '2024-12-31'
  },
  
  // Numeric range
  age: {
    min: 18,
    max: 65
  },
  
  // Text search
  name: {
    contains: 'john',
    startsWith: 'j',
    endsWith: 'n'
  }
};
```

## 📈 Performance Optimization

### Optimized Data Fetching

```typescript
// Debounced search
const debouncedQuery = useDebounce(searchQuery, 500);

const { data } = useUsers({
  query: debouncedQuery
}, {
  // Optimize caching
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  
  // Only refetch when query changes
  enabled: !!debouncedQuery
});
```

### Pagination

```typescript
const { data, isLoading } = useUsers({
  page: currentPage,
  limit: 20
});

// Load more data
const loadMore = () => {
  setCurrentPage(prev => prev + 1);
};
```

## 🧪 Testing

### Mock Services

```typescript
import { createMockAPIResponse } from '@/lib/api/examples';

const mockUserService = {
  getUsers: jest.fn().mockResolvedValue(
    createMockAPIResponse({
      users: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ],
      meta: { page: 1, limit: 10, total: 2 }
    })
  )
};
```

### Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '@/lib/api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('should fetch users', async () => {
  const { result } = renderHook(() => useUsers(), {
    wrapper: createWrapper()
  });
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data?.users).toHaveLength(2);
});
```

## 📖 API Documentation

The API documentation follows OpenAPI 3.0 standards and is available in `lib/api/docs.ts`. It includes:

- **Complete endpoint documentation**
- **Request/response schemas**
- **Authentication requirements**
- **Error codes and messages**
- **Example requests and responses**

### Viewing Documentation

```typescript
import { API_DOCUMENTATION } from '@/lib/api/docs';

// Access the OpenAPI specification
console.log(API_DOCUMENTATION);
```

## 🔧 Customization

### Custom Interceptors

```typescript
import { apiClient } from '@/lib/api';

// Add request interceptor
apiClient.addRequestInterceptor({
  onFulfilled: (config) => {
    // Add custom headers
    config.headers = {
      ...config.headers,
      'X-Custom-Header': 'value'
    };
    return config;
  }
});

// Add response interceptor
apiClient.addResponseInterceptor({
  onFulfilled: (response) => {
    // Log successful responses
    console.log('API Response:', response);
    return response;
  },
  onRejected: (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return error;
  }
});
```

### Custom Error Handling

```typescript
import { ErrorFactory, errorHandler } from '@/lib/api';

// Create custom error
const customError = ErrorFactory.internal('Custom error message', {
  customField: 'value'
});

// Handle error
errorHandler.handle(customError, {
  userId: 'user-id',
  requestId: 'req-123'
});
```

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set for your deployment environment:

```bash
# Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.bison360.com
DATABASE_URL=postgresql://user:pass@prod-db:5432/bison360
NEXTAUTH_URL=https://bison360.com
NEXTAUTH_SECRET=your-production-secret
```

### Build Configuration

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📞 Support

For questions, issues, or contributions:

1. **Documentation**: Check the examples in `lib/api/examples.ts`
2. **Issues**: Create an issue in the project repository
3. **Discussions**: Use the project's discussion forum
4. **Email**: Contact the development team

## 📄 License

This API implementation is part of the Bison360 project and follows the same licensing terms.

---

**Built with ❤️ for the Bison360 livestock management system**
