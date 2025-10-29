/**
 * Error Handling and Logging System
 * Comprehensive error management for enterprise applications
 */

import { ERROR_CODES, HTTP_STATUS } from './config';
import { ApiError, ApiResponse } from './types';

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error Categories
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  NETWORK = 'network',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  SYSTEM = 'system',
}

// Error Context
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
  environment: string;
  version: string;
}

// Enhanced Error Class
export class AppError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly statusCode: number;
  public readonly context: ErrorContext;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.SYSTEM,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.category = category;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.context = this.createContext();
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  private createContext(): ErrorContext {
    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    };
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }

  toApiResponse(): ApiResponse {
    return {
      success: false,
      error: this.toApiError(),
      timestamp: this.context.timestamp,
    };
  }
}

// Error Factory Functions
export class ErrorFactory {
  // Authentication Errors
  static authentication(message: string = 'Authentication failed', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      ErrorSeverity.HIGH,
      ErrorCategory.AUTHENTICATION,
      HTTP_STATUS.UNAUTHORIZED,
      details
    );
  }

  static tokenExpired(message: string = 'Token has expired', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.AUTH_TOKEN_EXPIRED,
      ErrorSeverity.MEDIUM,
      ErrorCategory.AUTHENTICATION,
      HTTP_STATUS.UNAUTHORIZED,
      details
    );
  }

  static insufficientPermissions(message: string = 'Insufficient permissions', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS,
      ErrorSeverity.HIGH,
      ErrorCategory.AUTHORIZATION,
      HTTP_STATUS.FORBIDDEN,
      details
    );
  }

  // Validation Errors
  static validation(message: string = 'Validation failed', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.VALIDATION_FAILED,
      ErrorSeverity.MEDIUM,
      ErrorCategory.VALIDATION,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details
    );
  }

  static requiredField(field: string): AppError {
    return new AppError(
      `Required field '${field}' is missing`,
      ERROR_CODES.REQUIRED_FIELD_MISSING,
      ErrorSeverity.MEDIUM,
      ErrorCategory.VALIDATION,
      HTTP_STATUS.BAD_REQUEST,
      { field }
    );
  }

  static invalidFormat(field: string, format: string): AppError {
    return new AppError(
      `Field '${field}' has invalid format. Expected: ${format}`,
      ERROR_CODES.INVALID_FORMAT,
      ErrorSeverity.MEDIUM,
      ErrorCategory.VALIDATION,
      HTTP_STATUS.BAD_REQUEST,
      { field, format }
    );
  }

  // Business Logic Errors
  static notFound(resource: string, id?: string): AppError {
    return new AppError(
      `${resource} not found${id ? ` with ID: ${id}` : ''}`,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      ErrorSeverity.MEDIUM,
      ErrorCategory.BUSINESS_LOGIC,
      HTTP_STATUS.NOT_FOUND,
      { resource, id }
    );
  }

  static alreadyExists(resource: string, field?: string, value?: string): AppError {
    return new AppError(
      `${resource} already exists${field && value ? ` with ${field}: ${value}` : ''}`,
      ERROR_CODES.RESOURCE_ALREADY_EXISTS,
      ErrorSeverity.MEDIUM,
      ErrorCategory.BUSINESS_LOGIC,
      HTTP_STATUS.CONFLICT,
      { resource, field, value }
    );
  }

  static operationNotAllowed(operation: string, reason?: string): AppError {
    return new AppError(
      `Operation '${operation}' is not allowed${reason ? `: ${reason}` : ''}`,
      ERROR_CODES.OPERATION_NOT_ALLOWED,
      ErrorSeverity.HIGH,
      ErrorCategory.BUSINESS_LOGIC,
      HTTP_STATUS.FORBIDDEN,
      { operation, reason }
    );
  }

  static quotaExceeded(resource: string, limit: number): AppError {
    return new AppError(
      `Quota exceeded for ${resource}. Limit: ${limit}`,
      ERROR_CODES.QUOTA_EXCEEDED,
      ErrorSeverity.HIGH,
      ErrorCategory.BUSINESS_LOGIC,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      { resource, limit }
    );
  }

  // System Errors
  static internal(message: string = 'Internal server error', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.INTERNAL_ERROR,
      ErrorSeverity.CRITICAL,
      ErrorCategory.SYSTEM,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details,
      false
    );
  }

  static serviceUnavailable(service: string, details?: Record<string, any>): AppError {
    return new AppError(
      `Service '${service}' is unavailable`,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      ErrorSeverity.HIGH,
      ErrorCategory.EXTERNAL_SERVICE,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      { service, ...details }
    );
  }

  static database(message: string = 'Database error', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.DATABASE_ERROR,
      ErrorSeverity.CRITICAL,
      ErrorCategory.DATABASE,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details,
      false
    );
  }

  static network(message: string = 'Network error', details?: Record<string, any>): AppError {
    return new AppError(
      message,
      ERROR_CODES.NETWORK_ERROR,
      ErrorSeverity.HIGH,
      ErrorCategory.NETWORK,
      HTTP_STATUS.BAD_GATEWAY,
      details
    );
  }

  // File Upload Errors
  static fileTooLarge(maxSize: number): AppError {
    return new AppError(
      `File size exceeds maximum allowed size of ${maxSize} bytes`,
      ERROR_CODES.FILE_TOO_LARGE,
      ErrorSeverity.MEDIUM,
      ErrorCategory.VALIDATION,
      HTTP_STATUS.BAD_REQUEST,
      { maxSize }
    );
  }

  static invalidFileType(allowedTypes: string[]): AppError {
    return new AppError(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      ERROR_CODES.INVALID_FILE_TYPE,
      ErrorSeverity.MEDIUM,
      ErrorCategory.VALIDATION,
      HTTP_STATUS.BAD_REQUEST,
      { allowedTypes }
    );
  }

  static fileUploadFailed(reason?: string): AppError {
    return new AppError(
      `File upload failed${reason ? `: ${reason}` : ''}`,
      ERROR_CODES.FILE_UPLOAD_FAILED,
      ErrorSeverity.HIGH,
      ErrorCategory.SYSTEM,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      { reason }
    );
  }
}

// Error Logger Interface
export interface ErrorLogger {
  log(error: AppError): void;
  logError(error: Error, context?: Partial<ErrorContext>): void;
  logWarning(message: string, context?: Partial<ErrorContext>): void;
  logInfo(message: string, context?: Partial<ErrorContext>): void;
}

// Console Error Logger Implementation
export class ConsoleErrorLogger implements ErrorLogger {
  log(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logData = {
      name: error.name,
      message: error.message,
      code: error.code,
      severity: error.severity,
      category: error.category,
      statusCode: error.statusCode,
      context: error.context,
      details: error.details,
      stack: error.stack,
    };

    switch (logLevel) {
      case 'error':
        console.error('🚨 Error:', logData);
        break;
      case 'warn':
        console.warn('⚠️ Warning:', logData);
        break;
      case 'info':
        console.info('ℹ️ Info:', logData);
        break;
      default:
        console.log('📝 Log:', logData);
    }
  }

  logError(error: Error, context?: Partial<ErrorContext>): void {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(error.message, ERROR_CODES.INTERNAL_ERROR, ErrorSeverity.HIGH);
    
    if (context) {
      Object.assign(appError.context, context);
    }
    
    this.log(appError);
  }

  logWarning(message: string, context?: Partial<ErrorContext>): void {
    const error = new AppError(message, 'WARNING', ErrorSeverity.MEDIUM);
    if (context) {
      Object.assign(error.context, context);
    }
    this.log(error);
  }

  logInfo(message: string, context?: Partial<ErrorContext>): void {
    const error = new AppError(message, 'INFO', ErrorSeverity.LOW);
    if (context) {
      Object.assign(error.context, context);
    }
    this.log(error);
  }

  private getLogLevel(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'log';
    }
  }
}

// Error Handler Class
export class ErrorHandler {
  private logger: ErrorLogger;

  constructor(logger: ErrorLogger = new ConsoleErrorLogger()) {
    this.logger = logger;
  }

  /**
   * Handle and process errors
   */
  handle(error: Error | AppError, context?: Partial<ErrorContext>): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else {
      appError = new AppError(
        error.message,
        ERROR_CODES.INTERNAL_ERROR,
        ErrorSeverity.HIGH,
        ErrorCategory.SYSTEM,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        { originalError: error.name },
        false
      );
    }

    // Add context if provided
    if (context) {
      Object.assign(appError.context, context);
    }

    // Log the error
    this.logger.log(appError);

    // Handle critical errors
    if (appError.severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(appError);
    }

    return appError;
  }

  /**
   * Handle critical errors (e.g., send alerts, notifications)
   */
  private handleCriticalError(error: AppError): void {
    // In a real application, you might:
    // - Send alerts to monitoring services
    // - Notify administrators
    // - Trigger incident response procedures
    console.error('🚨 CRITICAL ERROR:', error);
  }

  /**
   * Create a safe error response for API endpoints
   */
  createSafeErrorResponse(error: AppError, includeStack: boolean = false): ApiResponse {
    const response: ApiResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: error.context.timestamp,
    };

    // Include stack trace only in development
    if (includeStack && process.env.NODE_ENV === 'development') {
      response.error!.stack = error.stack;
    }

    return response;
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Global error handlers
export const setupGlobalErrorHandlers = (): void => {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    errorHandler.handle(error, {
      requestId: 'unhandled-rejection',
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    errorHandler.handle(error, {
      requestId: 'uncaught-exception',
    });
    
    // Exit process for uncaught exceptions
    process.exit(1);
  });

  // Handle client-side errors (if running in browser)
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      const error = new Error(event.message);
      error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
      
      errorHandler.handle(error, {
        requestId: 'client-error',
        endpoint: window.location.pathname,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      errorHandler.handle(error, {
        requestId: 'client-unhandled-rejection',
        endpoint: window.location.pathname,
      });
    });
  }
};

// Initialize global error handlers
setupGlobalErrorHandlers();

export default errorHandler;
