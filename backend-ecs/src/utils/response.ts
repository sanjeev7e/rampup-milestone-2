import type { Response } from "express";

/**
 * Response utility functions for consistent API responses
 */
export const sendResponse = {
  /**
   * Success response
   */
  success: (res: Response, data: any, statusCode: number = 200) => {
    return res.status(statusCode).json(data);
  },

  /**
   * Error response
   */
  error: (res: Response, message: string, statusCode: number = 500) => {
    return res.status(statusCode).json({
      error: message,
    });
  },

  /**
   * Validation error response
   */
  validationError: (res: Response, errors: string[]) => {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  },
};
