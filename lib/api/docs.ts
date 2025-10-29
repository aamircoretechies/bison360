/**
 * API Documentation Structure
 * Comprehensive API documentation following OpenAPI 3.0 standards
 */

export const API_DOCUMENTATION = {
  openapi: '3.0.0',
  info: {
    title: 'Bison360 API',
    description: 'Comprehensive livestock and meat processing management system API',
    version: '1.0.0',
    contact: {
      name: 'Bison360 Development Team',
      email: 'dev@bison360.com',
      url: 'https://bison360.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://staging-api.bison360.com',
      description: 'Staging server',
    },
    {
      url: 'https://api.bison360.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization',
    },
    {
      name: 'Users',
      description: 'User management operations',
    },
    {
      name: 'Roles',
      description: 'Role management operations',
    },
    {
      name: 'Permissions',
      description: 'Permission management operations',
    },
    {
      name: 'Inventory',
      description: 'Meat inventory management',
    },
    {
      name: 'Livestock',
      description: 'Livestock tracking and management',
    },
    {
      name: 'Orders',
      description: 'Order processing and management',
    },
    {
      name: 'POS',
      description: 'Point of sale operations',
    },
    {
      name: 'Reports',
      description: 'Report generation and management',
    },
    {
      name: 'Settings',
      description: 'System settings management',
    },
    {
      name: 'Files',
      description: 'File upload and management',
    },
    {
      name: 'System',
      description: 'System health and monitoring',
    },
  ],
  paths: {
    '/api/auth/signin': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'demo@kt.com',
                  },
                  password: {
                    type: 'string',
                    minLength: 6,
                    example: 'demo123',
                  },
                  rememberMe: {
                    type: 'boolean',
                    default: false,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        tokens: { $ref: '#/components/schemas/AuthTokens' },
                        permissions: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/user-management/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Retrieve paginated list of users with search and filtering',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Number of items per page',
          },
          {
            name: 'query',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search query',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', default: 'createdAt' },
            description: 'Sort field',
          },
          {
            name: 'dir',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            description: 'Sort direction',
          },
        ],
        responses: {
          '200': {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        users: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/User' },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create new user',
        description: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name', 'roleId'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' },
                  roleId: { type: 'string' },
                  status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'] },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/user-management/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'User retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  roleId: { type: 'string' },
                  status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
          },
        ],
        responses: {
          '204': {
            description: 'User deleted successfully',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          roleId: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          lastSignInAt: { type: 'string', format: 'date-time' },
          emailVerifiedAt: { type: 'string', format: 'date-time' },
          avatar: { type: 'string' },
          role: { $ref: '#/components/schemas/UserRole' },
        },
      },
      UserRole: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          isProtected: { type: 'boolean' },
          isDefault: { type: 'boolean' },
          permissions: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserPermission' },
          },
        },
      },
      UserPermission: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresIn: { type: 'integer' },
          tokenType: { type: 'string' },
        },
      },
      InventoryItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          sku: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          unit: { type: 'string' },
          currentStock: { type: 'number' },
          minStock: { type: 'number' },
          maxStock: { type: 'number' },
          costPrice: { type: 'number' },
          sellingPrice: { type: 'number' },
          barcode: { type: 'string' },
          batchNumber: { type: 'string' },
          expiryDate: { type: 'string', format: 'date' },
          supplier: { type: 'string' },
          location: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Livestock: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          eid: { type: 'string' },
          name: { type: 'string' },
          species: { type: 'string' },
          breed: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
          weight: { type: 'number' },
          status: { type: 'string', enum: ['ACTIVE', 'SOLD', 'DECEASED', 'MISSING'] },
          location: { type: 'string' },
          owner: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          orderNumber: { type: 'string' },
          customerId: { type: 'string' },
          customerName: { type: 'string' },
          customerEmail: { type: 'string', format: 'email' },
          customerPhone: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                sku: { type: 'string' },
                name: { type: 'string' },
                quantity: { type: 'number' },
                unitPrice: { type: 'number' },
                totalPrice: { type: 'number' },
              },
            },
          },
          subtotal: { type: 'number' },
          tax: { type: 'number' },
          discount: { type: 'number' },
          total: { type: 'number' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] },
          paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'] },
          shippingAddress: { $ref: '#/components/schemas/Address' },
          billingAddress: { $ref: '#/components/schemas/Address' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          zipCode: { type: 'string' },
          country: { type: 'string' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// API Endpoint Documentation
export const API_ENDPOINTS_DOCS = {
  authentication: {
    login: {
      method: 'POST',
      path: '/api/auth/signin',
      description: 'Authenticate user with email and password',
      parameters: ['email', 'password', 'rememberMe'],
      responses: ['200', '401'],
    },
    logout: {
      method: 'POST',
      path: '/api/auth/signout',
      description: 'Logout current user',
      parameters: [],
      responses: ['200'],
    },
    register: {
      method: 'POST',
      path: '/api/auth/signup',
      description: 'Register new user account',
      parameters: ['email', 'password', 'name', 'roleId'],
      responses: ['201', '400', '409'],
    },
    verifyEmail: {
      method: 'POST',
      path: '/api/auth/verify-email',
      description: 'Verify user email address',
      parameters: ['token'],
      responses: ['200', '400'],
    },
    resetPassword: {
      method: 'POST',
      path: '/api/auth/reset-password',
      description: 'Reset user password',
      parameters: ['email'],
      responses: ['200', '404'],
    },
    changePassword: {
      method: 'POST',
      path: '/api/auth/change-password',
      description: 'Change user password',
      parameters: ['currentPassword', 'newPassword'],
      responses: ['200', '400', '401'],
    },
  },
  users: {
    list: {
      method: 'GET',
      path: '/api/user-management/users',
      description: 'Get paginated list of users',
      parameters: ['page', 'limit', 'query', 'sort', 'dir'],
      responses: ['200', '401', '403'],
    },
    get: {
      method: 'GET',
      path: '/api/user-management/users/{id}',
      description: 'Get user by ID',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    create: {
      method: 'POST',
      path: '/api/user-management/users',
      description: 'Create new user',
      parameters: ['email', 'password', 'name', 'roleId'],
      responses: ['201', '400', '409', '401'],
    },
    update: {
      method: 'PUT',
      path: '/api/user-management/users/{id}',
      description: 'Update user',
      parameters: ['id', 'name', 'email', 'roleId', 'status'],
      responses: ['200', '400', '404', '401'],
    },
    delete: {
      method: 'DELETE',
      path: '/api/user-management/users/{id}',
      description: 'Delete user',
      parameters: ['id'],
      responses: ['204', '404', '401'],
    },
    restore: {
      method: 'POST',
      path: '/api/user-management/users/{id}/restore',
      description: 'Restore deleted user',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    select: {
      method: 'GET',
      path: '/api/user-management/users/select',
      description: 'Get users for select dropdown',
      parameters: [],
      responses: ['200', '401'],
    },
  },
  inventory: {
    list: {
      method: 'GET',
      path: '/api/inventory',
      description: 'Get paginated list of inventory items',
      parameters: ['page', 'limit', 'query', 'sort', 'dir'],
      responses: ['200', '401'],
    },
    get: {
      method: 'GET',
      path: '/api/inventory/{id}',
      description: 'Get inventory item by ID',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    create: {
      method: 'POST',
      path: '/api/inventory',
      description: 'Create new inventory item',
      parameters: ['sku', 'name', 'category', 'unit', 'costPrice', 'sellingPrice'],
      responses: ['201', '400', '409', '401'],
    },
    update: {
      method: 'PUT',
      path: '/api/inventory/{id}',
      description: 'Update inventory item',
      parameters: ['id', 'name', 'description', 'costPrice', 'sellingPrice'],
      responses: ['200', '400', '404', '401'],
    },
    delete: {
      method: 'DELETE',
      path: '/api/inventory/{id}',
      description: 'Delete inventory item',
      parameters: ['id'],
      responses: ['204', '404', '401'],
    },
    processBarcode: {
      method: 'POST',
      path: '/api/inventory/barcodes',
      description: 'Process barcode and return inventory item',
      parameters: ['barcode'],
      responses: ['200', '404', '401'],
    },
    getStockLevels: {
      method: 'GET',
      path: '/api/inventory/stocks',
      description: 'Get current stock levels',
      parameters: ['page', 'limit', 'query'],
      responses: ['200', '401'],
    },
  },
  livestock: {
    dashboard: {
      method: 'GET',
      path: '/api/livestock/dashboard',
      description: 'Get livestock dashboard data',
      parameters: [],
      responses: ['200', '401'],
    },
    list: {
      method: 'GET',
      path: '/api/livestock',
      description: 'Get paginated list of livestock',
      parameters: ['page', 'limit', 'query', 'sort', 'dir'],
      responses: ['200', '401'],
    },
    get: {
      method: 'GET',
      path: '/api/livestock/{id}',
      description: 'Get livestock by ID',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    register: {
      method: 'POST',
      path: '/api/livestock/register',
      description: 'Register new livestock',
      parameters: ['eid', 'species', 'gender', 'name', 'breed'],
      responses: ['201', '400', '409', '401'],
    },
    update: {
      method: 'PUT',
      path: '/api/livestock/{id}',
      description: 'Update livestock information',
      parameters: ['id', 'name', 'weight', 'location', 'status'],
      responses: ['200', '400', '404', '401'],
    },
    getEvents: {
      method: 'GET',
      path: '/api/livestock/events',
      description: 'Get livestock events',
      parameters: ['page', 'limit', 'livestockId'],
      responses: ['200', '401'],
    },
    addEvent: {
      method: 'POST',
      path: '/api/livestock/events',
      description: 'Add livestock event',
      parameters: ['livestockId', 'eventType', 'eventDate', 'description'],
      responses: ['201', '400', '401'],
    },
  },
  orders: {
    dashboard: {
      method: 'GET',
      path: '/api/orders/dashboard',
      description: 'Get orders dashboard data',
      parameters: [],
      responses: ['200', '401'],
    },
    list: {
      method: 'GET',
      path: '/api/orders',
      description: 'Get paginated list of orders',
      parameters: ['page', 'limit', 'query', 'sort', 'dir'],
      responses: ['200', '401'],
    },
    get: {
      method: 'GET',
      path: '/api/orders/{id}',
      description: 'Get order by ID',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    create: {
      method: 'POST',
      path: '/api/orders',
      description: 'Create new order',
      parameters: ['customerName', 'items', 'shippingAddress'],
      responses: ['201', '400', '401'],
    },
    update: {
      method: 'PUT',
      path: '/api/orders/{id}',
      description: 'Update order',
      parameters: ['id', 'status', 'paymentStatus', 'notes'],
      responses: ['200', '400', '404', '401'],
    },
    generateShippingLabel: {
      method: 'POST',
      path: '/api/orders/shipping-label',
      description: 'Generate shipping label for order',
      parameters: ['orderId', 'carrier'],
      responses: ['200', '400', '404', '401'],
    },
  },
  pos: {
    dashboard: {
      method: 'GET',
      path: '/api/pos-retail/sales-dashboard',
      description: 'Get POS sales dashboard data',
      parameters: [],
      responses: ['200', '401'],
    },
    processTransaction: {
      method: 'POST',
      path: '/api/pos-retail/pos-terminal',
      description: 'Process POS transaction',
      parameters: ['items', 'paymentMethod', 'customerId'],
      responses: ['201', '400', '401'],
    },
    getTransactionLog: {
      method: 'GET',
      path: '/api/pos-retail/transactions-log',
      description: 'Get POS transaction log',
      parameters: ['page', 'limit', 'date'],
      responses: ['200', '401'],
    },
    generateZReport: {
      method: 'POST',
      path: '/api/pos-retail/z-report',
      description: 'Generate Z-report',
      parameters: ['date'],
      responses: ['200', '400', '401'],
    },
  },
  reports: {
    list: {
      method: 'GET',
      path: '/api/reports',
      description: 'Get paginated list of reports',
      parameters: ['page', 'limit', 'query', 'type'],
      responses: ['200', '401'],
    },
    get: {
      method: 'GET',
      path: '/api/reports/{id}',
      description: 'Get report by ID',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    generate: {
      method: 'POST',
      path: '/api/reports',
      description: 'Generate new report',
      parameters: ['type', 'parameters'],
      responses: ['201', '400', '401'],
    },
  },
  settings: {
    get: {
      method: 'GET',
      path: '/api/user-management/settings',
      description: 'Get system settings',
      parameters: [],
      responses: ['200', '401'],
    },
    updateGeneral: {
      method: 'PUT',
      path: '/api/user-management/settings/general',
      description: 'Update general settings',
      parameters: ['name', 'logo', 'address', 'websiteURL'],
      responses: ['200', '400', '401'],
    },
    updateNotifications: {
      method: 'PUT',
      path: '/api/user-management/settings/notifications',
      description: 'Update notification settings',
      parameters: ['notifyStockEmail', 'notifyNewOrderEmail'],
      responses: ['200', '400', '401'],
    },
    updateSocial: {
      method: 'PUT',
      path: '/api/user-management/settings/social',
      description: 'Update social media settings',
      parameters: ['socialFacebook', 'socialTwitter', 'socialInstagram'],
      responses: ['200', '400', '401'],
    },
  },
  files: {
    upload: {
      method: 'POST',
      path: '/api/files/upload',
      description: 'Upload file',
      parameters: ['file', 'category', 'metadata'],
      responses: ['201', '400', '401'],
    },
    download: {
      method: 'GET',
      path: '/api/files/download/{id}',
      description: 'Download file',
      parameters: ['id'],
      responses: ['200', '404', '401'],
    },
    delete: {
      method: 'DELETE',
      path: '/api/files/delete/{id}',
      description: 'Delete file',
      parameters: ['id'],
      responses: ['204', '404', '401'],
    },
  },
  system: {
    health: {
      method: 'GET',
      path: '/api/system/health',
      description: 'Get system health status',
      parameters: [],
      responses: ['200'],
    },
    logs: {
      method: 'GET',
      path: '/api/system/logs',
      description: 'Get system logs',
      parameters: ['page', 'limit', 'level', 'date'],
      responses: ['200', '401'],
    },
    metrics: {
      method: 'GET',
      path: '/api/system/metrics',
      description: 'Get system metrics',
      parameters: [],
      responses: ['200', '401'],
    },
  },
};

export default API_DOCUMENTATION;
