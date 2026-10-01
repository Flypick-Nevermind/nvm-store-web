export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp_number: string;
  avatar_url?: string;
  member_tier?: 'Standard' | 'VIP Club' | 'Trendsetter';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { identifier: string; password?: string }) => Promise<boolean>;
  register: (data: {
    name: string;
    whatsapp_number: string;
    email: string;
    password?: string;
  }) => Promise<{ user_id: string }>;
  verifyOtp: (data: {
    user_id: string;
    auth_otp: string;
    email: string;
    password?: string;
  }) => Promise<boolean>;
  loginDemo: () => void;
  logout: () => void;
}
