'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginApi, registerApi, validateOtpApi } from '@/lib/api/auth';
import type { AuthState, User } from '@/types/auth';

const DEMO_USER: User = {
  id: 'usr_demo_nevermind_99',
  name: 'Nadine Nevermind',
  email: 'nadine@nevermind.id',
  whatsapp_number: '081298765432',
  member_tier: 'Trendsetter',
  created_at: '2026-01-15T00:00:00.000Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async ({ identifier, password }) => {
        try {
          const res = await loginApi({ identifier, password });
          set({ user: res.user, token: res.token, isAuthenticated: true });
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Login gagal';
          throw new Error(message);
        }
      },

      register: async ({ name, whatsapp_number, email, password }) => {
        try {
          const res = await registerApi({ name, whatsapp_number, email, password });
          return { user_id: res.user_id };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Registrasi gagal';
          throw new Error(message);
        }
      },

      verifyOtp: async ({ user_id, auth_otp, email, password }) => {
        try {
          await validateOtpApi({ user_id, auth_otp });
          // If password is provided, automatically log the user in!
          if (password) {
            const res = await loginApi({ identifier: email, password });
            set({ user: res.user, token: res.token, isAuthenticated: true });
          }
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Verifikasi OTP gagal';
          throw new Error(message);
        }
      },

      loginDemo: () => {
        set({ user: DEMO_USER, token: 'demo_jwt_token', isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'nvm-auth',
    }
  )
);
