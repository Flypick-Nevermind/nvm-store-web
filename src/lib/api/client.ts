// NEVERMIND — Centralized API Client

const BACKEND_BASE = process.env.BACKEND_API_URL || 'https://service-nvm-production.up.railway.app/api';
const CLIENT_BASE = process.env.NEXT_PUBLIC_API_URL || '/api-backend';

function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return BACKEND_BASE;
  }
  return CLIENT_BASE;
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('nvm-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, ...rest } = options;

  const base = getBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`;

  // Automatically inject token from localStorage if not explicitly passed
  const activeToken = token === undefined ? getStoredToken() : token;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (activeToken) {
    requestHeaders['Authorization'] = `Bearer ${activeToken}`;
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
