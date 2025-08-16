import { 
  ApiResponse, 
  PaginatedApiResponse, 
  OperationResponse, 
  NestJSErrorResponse,
  isApiResponse,
  isPaginatedApiResponse,
  isOperationResponse,
  isNestJSError
} from '../types/api-response';

// Frontend API Response Utilities
// Helper functions for handling API responses consistently

/**
 * Extracts data from ApiResponse or throws error if response is invalid
 */
export function extractApiData<T>(response: unknown): T {
  if (isApiResponse<T>(response)) {
    return response.data;
  }
  throw new Error('Invalid API response format');
}

/**
 * Extracts data array from PaginatedApiResponse or throws error if response is invalid
 */
export function extractPaginatedData<T>(response: unknown): T[] {
  if (isPaginatedApiResponse<T>(response)) {
    return response.data;
  }
  throw new Error('Invalid paginated API response format');
}

/**
 * Extracts pagination metadata from PaginatedApiResponse
 */
export function extractPaginationMeta(response: unknown) {
  if (isPaginatedApiResponse(response)) {
    return response.pagination;
  }
  throw new Error('Invalid paginated API response format');
}

/**
 * Extracts operation result from OperationResponse
 */
export function extractOperationResult(response: unknown): OperationResponse {
  if (isOperationResponse(response)) {
    return {
      success: response.success,
      message: response.message,
      timestamp: response.timestamp,
      id: response.id
    };
  }
  throw new Error('Invalid operation response format');
}

/**
 * Checks if operation was successful
 */
export function isOperationSuccessful(response: unknown): boolean {
  if (isOperationResponse(response)) {
    return response.success === true;
  }
  return false;
}

/**
 * Extracts error message from NestJS error response
 */
export function extractErrorMessage(error: unknown): string {
  if (isNestJSError(error)) {
    if (Array.isArray(error.message)) {
      return error.message.join(', ');
    }
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Unknown error occurred';
}

/**
 * Extracts status code from NestJS error response
 */
export function extractErrorStatusCode(error: unknown): number {
  if (isNestJSError(error)) {
    return error.statusCode;
  }
  return 500; // Default to internal server error
}

/**
 * Generic API response handler - determines response type and processes accordingly
 */
export function handleApiResponse<T>(response: unknown) {
  if (isApiResponse<T>(response)) {
    return {
      type: 'api' as const,
      success: response.success,
      message: response.message,
      data: response.data,
      timestamp: response.timestamp
    };
  }
  
  if (isPaginatedApiResponse<T>(response)) {
    return {
      type: 'paginated' as const,
      success: response.success,
      message: response.message,
      data: response.data,
      pagination: response.pagination,
      timestamp: response.timestamp
    };
  }
  
  if (isOperationResponse(response)) {
    return {
      type: 'operation' as const,
      success: response.success,
      message: response.message,
      id: response.id,
      timestamp: response.timestamp
    };
  }
  
  throw new Error('Unknown API response format');
}

/**
 * HTTP status code helpers
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Common error types based on HTTP status codes
 */
export function getErrorType(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'Validation Error';
    case HttpStatus.UNAUTHORIZED:
      return 'Authentication Error';
    case HttpStatus.FORBIDDEN:
      return 'Authorization Error';
    case HttpStatus.NOT_FOUND:
      return 'Resource Not Found';
    case HttpStatus.CONFLICT:
      return 'Conflict Error';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'Server Error';
    default:
      return 'Unknown Error';
  }
}
