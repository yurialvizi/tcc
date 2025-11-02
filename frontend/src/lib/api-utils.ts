/**
 * Utility functions for API calls with better error handling
 */

export interface ApiError {
  message: string;
  isNetworkError: boolean;
  statusCode?: number;
}

/**
 * Determines if an error is a network error (connection refused, timeout, etc.)
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('network')
    );
  }
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('Network') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timeout')
    );
  }
  return false;
}

/**
 * Formats error messages for user display
 * Logs detailed errors internally only in development mode
 */
export function formatErrorMessage(error: unknown): string {
  // Only log errors in development mode (not visible to production users)
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isNetworkError(error)) {
    if (isDevelopment) {
      console.error('[Backend Connection Error]', error);
    }
    return 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
  }
  
  if (error instanceof Error) {
    // Log the full error for debugging (only in development)
    if (isDevelopment) {
      console.error('[API Error]', error);
    }
    
    // Check if it's an HTTP error with status
    if (error.message.includes('HTTP error! Status:')) {
      const statusMatch = error.message.match(/Status: (\d+)/);
      if (statusMatch) {
        const status = parseInt(statusMatch[1]);
        if (status === 404) {
          return 'Recurso não encontrado. Por favor, tente novamente mais tarde.';
        }
        if (status >= 500) {
          return 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
        if (status === 401 || status === 403) {
          return 'Acesso negado. Por favor, tente novamente mais tarde.';
        }
        // For other 4xx errors, show generic message
        return 'Erro ao processar solicitação. Por favor, tente novamente mais tarde.';
      }
    }
    // For any other error, show generic message
    return 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
  }
  
  return 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
}

/**
 * Checks if an error message (string) represents a network/server error
 * Used to show additional helpful UI elements
 */
export function isNetworkErrorMessage(message: string): boolean {
  return message.includes('Erro interno do servidor') ||
         message.includes('tente novamente mais tarde');
}

/**
 * Fetches data with timeout and better error handling
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('A requisição demorou muito tempo. Verifique sua conexão.');
    }
    throw error;
  }
}

