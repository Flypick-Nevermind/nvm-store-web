// NEVERMIND — Auth API Service

import { apiClient } from './client';
import type { User } from '@/types/auth';

export interface BackendLoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    token: string;
    user?: {
      user_id?: string;
      id?: string;
      user_name?: string;
      name?: string;
      user_email?: string;
      email?: string;
      user_phone?: string;
      whatsapp_number?: string;
      member_tier?: 'Standard' | 'VIP Club' | 'Trendsetter';
    };
  };
}

export interface BackendRegisterResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    user_id: string;
  };
}
/** Reads the real user id from the JWT payload (login response only returns a token). */
export function getUserIdFromToken(token: string | null | undefined): string | null {
  if (!token) return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const p = JSON.parse(json) as Record<string, unknown>;
    const id = p.user_id ?? p.userId ?? p.id ?? p.sub;
    return typeof id === 'string' ? id : null;
  } catch {
    return null;
  }
}

export async function loginApi(credentials: {
  identifier: string;
  password?: string;
}): Promise<{ token: string; user: User }> {
  const res = await apiClient<BackendLoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify({
      user_email: credentials.identifier.trim().toLowerCase(),
      user_password: credentials.password || '',
    }),
  });

  const rawUser = res.data?.user;
  const isEmail = credentials.identifier.includes('@');

  const user: User = {
    id: rawUser?.user_id || rawUser?.id || getUserIdFromToken(res.data.token) || `usr_${Date.now()}`,
    name: rawUser?.user_name || rawUser?.name || (isEmail ? credentials.identifier.split('@')[0] : 'Nevermind Bestie'),
    email: rawUser?.user_email || rawUser?.email || (isEmail ? credentials.identifier : ''),
    whatsapp_number: rawUser?.user_phone || rawUser?.whatsapp_number || (!isEmail ? credentials.identifier : '081234567890'),
    member_tier: rawUser?.member_tier || 'VIP Club',
    created_at: new Date().toISOString(),
  };

  return {
    token: res.data.token,
    user,
  };
}

export async function registerApi(data: {
  name: string;
  whatsapp_number: string;
  email: string;
  password?: string;
}): Promise<{ user_id: string }> {
  const res = await apiClient<BackendRegisterResponse>('/users', {
    method: 'POST',
    body: JSON.stringify({
      user_name: data.name.trim(),
      user_email: data.email.trim().toLowerCase(),
      user_phone: data.whatsapp_number.trim(),
      user_password: data.password || '',
    }),
  });

  return {
    user_id: res.data.user_id,
  };
}

export interface BackendOtpValidateResponse {
  success: boolean;
  status: number;
  message: string;
  data: unknown;
}

export async function validateOtpApi(data: {
  user_id: string;
  auth_otp: string;
}): Promise<boolean> {
  const res = await apiClient<BackendOtpValidateResponse>('/users/otp-validate', {
    method: 'POST',
    body: JSON.stringify({
      user_id: data.user_id,
      auth_otp: data.auth_otp.trim(),
    }),
  });

  return res.success;
}
