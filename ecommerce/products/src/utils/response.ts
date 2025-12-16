export const response = {
  /**
   * Success response
   */
  success: (data: any, statusCode: number = 200) => {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data),
    };
  },

  /**
   * Error response
   */
  error: (message: string, statusCode: number = 500) => {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: message,
      }),
    };
  },

  /**
   * Validation error response
   */
  validationError: (errors: string[]) => {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: "Validation failed",
        details: errors,
      }),
    };
  },
};
