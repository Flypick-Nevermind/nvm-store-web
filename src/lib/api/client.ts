// NEVERMIND — Centralized API Client

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api-backend';

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, ...rest } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: requestHeaders,
      ...rest,
    });
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) {
      throw new Error('Gagal terhubung ke backend (kemungkinan diblokir oleh CORS atau server sedang offline).');
    }
    throw err;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
