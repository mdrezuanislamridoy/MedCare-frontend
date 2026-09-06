const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('medcare.accessToken')
      : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // Handle 401 Unauthorized: token expired or invalid
      if (
        response.status === 401 &&
        typeof window !== 'undefined' &&
        !cleanEndpoint.includes('/auth/login') &&
        !cleanEndpoint.includes('/auth/register') &&
        !cleanEndpoint.includes('/auth/google') &&
        !cleanEndpoint.includes('/auth/forgot-password') &&
        !cleanEndpoint.includes('/auth/reset-password')
      ) {
        localStorage.removeItem('medcare.accessToken');
        localStorage.removeItem('medcare.user');
        localStorage.removeItem('medcare-auth-storage');
        window.dispatchEvent(new CustomEvent('medcare:unauthorized'));
      }

      const errorMessage =
        typeof data === 'object' && data !== null && (data.message || data.error)
          ? Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || data.error
          : `Request failed with status ${response.status}`;

      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error?.message || 'Network error: Failed to connect to server',
      0,
    );
  }
}
