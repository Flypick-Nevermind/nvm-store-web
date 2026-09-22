'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
      isAuthenticated: false,

      login: async ({ identifier }) => {
        // Simulated network delay
        await new Promise((r) => setTimeout(r, 400));
        
        const isEmail = identifier.includes('@');
        const user: User = {
          id: `usr_${Date.now()}`,
          name: isEmail ? identifier.split('@')[0] : 'Nevermind Bestie',
          email: isEmail ? identifier : `${identifier}@mail.com`,
          whatsapp_number: isEmail ? '081234567890' : identifier,
          member_tier: 'VIP Club',
          created_at: new Date().toISOString(),
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      register: async ({ name, whatsapp_number, email }) => {
        await new Promise((r) => setTimeout(r, 500));
        const user: User = {
          id: `usr_${Date.now()}`,
          name,
          email,
          whatsapp_number,
          member_tier: 'VIP Club',
          created_at: new Date().toISOString(),
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      loginDemo: () => {
        set({ user: DEMO_USER, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'nvm-auth',
    }
  )
);
