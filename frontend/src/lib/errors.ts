import type { AxiosError } from "axios";

/**
 * Standard API error response from the backend
 */
export interface ApiErrorResponse {
  message: string;
  errors?: string[];
  statusCode?: number;
}

/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];
  public originalError: AxiosError | null;

  constructor(
    message: string,
    statusCode: number = 500,
    errors: string[] = [],
    originalError: AxiosError | null = null
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (
      "captureStackTrace" in Error &&
      typeof Error.captureStackTrace === "function"
    ) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a validation error (400)
   */
  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  /**
   * Check if error is unauthorized (401)
   */
  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is forbidden (403)
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if error is not found (404)
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (this.errors.length > 0) {
      return this.errors.join(", ");
    }
    return this.message;
  }
}

/**
 * Parse axios error into ApiError
 */
export function parseApiError(error: unknown): ApiError {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Axios error with response
  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response) {
    const { status, data } = axiosError.response;
    const message = data?.message || getDefaultErrorMessage(status);
    const errors = data?.errors || [];

    return new ApiError(message, status, errors, axiosError);
  }

  // Network error (no response)
  if (axiosError.request) {
    return new ApiError(
      "Network error. Please check your connection.",
      0,
      [],
      axiosError
    );
  }

  // Other errors
  if (error instanceof Error) {
    return new ApiError(error.message, 500, [], null);
  }

  return new ApiError("An unexpected error occurred", 500, [], null);
}

/**
 * Get default error message based on status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "You are not authorized. Please log in.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. The resource may already exist.";
    case 422:
      return "Validation failed. Please check your input.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
      return "Service temporarily unavailable. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
}
