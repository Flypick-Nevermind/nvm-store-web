'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PageShell } from '@/components/layouts/PageShell';
import { Logo } from '@/components/atoms/Logo';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useAuthStore } from '@/store/authStore';
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '@/lib/schemas/auth.schema';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const fromCart = searchParams.get('from') === 'cart';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);
  const registerUser = useAuthStore((s) => s.register);
  const loginDemo = useAuthStore((s) => s.loginDemo);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      remember_me: true,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      whatsapp_number: '',
      email: '',
      password: '',
      terms: true,
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await login({ identifier: data.identifier, password: data.password });
      router.push(redirectPath);
    } catch {
      setAuthError('Gagal masuk. Periksa kembali email/nomor dan kata sandimu.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await registerUser({
        name: data.name,
        whatsapp_number: data.whatsapp_number,
        email: data.email,
        password: data.password,
      });
      router.push(redirectPath);
    } catch {
      setAuthError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.push(redirectPath);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 md:py-14 flex flex-col gap-6">
      {/* Brand Logo */}
      <div className="flex justify-center pb-2">
        <Logo size="lg" />
      </div>

      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <Badge variant="yellow">✨ NEVERMIND Club</Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A]">
          {activeTab === 'login' ? 'Selamat Datang Kembali!' : 'Gabung Komunitas Kami'}
        </h1>
        <p className="text-xs sm:text-sm text-[#888]">
          {activeTab === 'login'
            ? 'Masuk untuk pantau pesanan dan nikmati diskon eksklusif.'
            : 'Daftar sekarang untuk akses kurasi tas China paling update.'}
        </p>
      </div>

      {/* From Cart Notification Banner */}
      {fromCart && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-2xl bg-[#FFF8E1] border border-[#FDFD96] p-4 flex items-center gap-3.5 shadow-xs"
        >
          <span className="text-2xl shrink-0" aria-hidden="true">🛍️</span>
          <div>
            <p className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
              Produk tersimpan di keranjangmu!
            </p>
            <p className="text-[11px] sm:text-xs text-[#7A6830] mt-0.5 leading-snug">
              Silakan masuk atau daftar terlebih dahulu agar keranjang dan pesananmu dapat diproses.
            </p>
          </div>
        </motion.div>
      )}

      {/* 1-Click Demo Login Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#D8FFF7] to-[#FFF8E1] border border-[#9DDED1] p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden="true">⚡</span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1A6B5C] truncate">Coba Mode Demo Instan</p>
            <p className="text-[11px] text-[#2D8A76] truncate">Masuk sebagai Nadine Nevermind</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="shrink-0 px-3 py-1.5 rounded-xl bg-[#C74375] hover:bg-[#A33360] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Masuk Demo →
        </button>
      </div>

      {/* Card Form */}
      <div className="rounded-3xl bg-white border border-[#C8C8C8]/50 p-6 sm:p-8 shadow-xs">
        {/* Tab Switcher */}
        <div className="flex bg-[#FFF8E1] rounded-2xl p-1 border border-[#C8C8C8]/40 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setAuthError(null);
            }}
            className={[
              'flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeTab === 'login'
                ? 'bg-white text-[#C74375] shadow-xs'
                : 'text-[#888] hover:text-[#1A1A1A]',
            ].join(' ')}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setAuthError(null);
            }}
            className={[
              'flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeTab === 'register'
                ? 'bg-white text-[#C74375] shadow-xs'
                : 'text-[#888] hover:text-[#1A1A1A]',
            ].join(' ')}
          >
            Daftar Akun
          </button>
        </div>

        {authError && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs p-3 mb-4">
            {authError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            /* ── Login Form ── */
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18 }}
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <Input
                id="login-identifier"
                label="Email atau Nomor WhatsApp"
                placeholder="nama@email.com / 08123456789"
                required
                error={loginForm.formState.errors.identifier?.message}
                {...loginForm.register('identifier')}
              />

              <Input
                id="login-password"
                type="password"
                label="Kata Sandi"
                placeholder="••••••••"
                required
                error={loginForm.formState.errors.password?.message}
                {...loginForm.register('password')}
              />

              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  id="remember-me"
                  label="Ingat saya"
                  {...loginForm.register('remember_me')}
                />
                <button
                  type="button"
                  onClick={() => alert('Fitur lupa kata sandi bisa langsung chat admin WhatsApp kami ya!')}
                  className="text-xs text-[#C74375] hover:underline font-semibold cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>

              <Button
                id="login-submit-btn"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk Sekarang →'}
              </Button>
            </motion.form>
          ) : (
            /* ── Register Form ── */
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <Input
                id="reg-name"
                label="Nama Lengkap"
                placeholder="e.g. Nadine Aurelia"
                required
                error={registerForm.formState.errors.name?.message}
                {...registerForm.register('name')}
              />

              <Input
                id="reg-whatsapp"
                label="Nomor WhatsApp Aktif"
                placeholder="081234567890"
                type="tel"
                inputMode="numeric"
                required
                hint="Digunakan untuk konfirmasi pesanan & update resi"
                error={registerForm.formState.errors.whatsapp_number?.message}
                {...registerForm.register('whatsapp_number')}
              />

              <Input
                id="reg-email"
                type="email"
                label="Email"
                placeholder="nadine@gmail.com"
                required
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register('email')}
              />

              <Input
                id="reg-password"
                type="password"
                label="Buat Kata Sandi"
                placeholder="Minimal 6 karakter"
                required
                error={registerForm.formState.errors.password?.message}
                {...registerForm.register('password')}
              />

              <Checkbox
                id="reg-terms"
                label="Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi NEVERMIND"
                error={registerForm.formState.errors.terms?.message}
                {...registerForm.register('terms')}
              />

              <Button
                id="register-submit-btn"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Mendaftarkan...' : 'Buat Akun Baru ✨'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Back to Home Link */}
      <div className="text-center">
        <Link href="/" className="text-xs text-[#888] hover:text-[#C74375] transition-colors">
          ← Kembali ke Katalog Produk
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell showNavbar={false} showFooter={false}>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#888]">Memuat...</div>}>
        <LoginFormContent />
      </Suspense>
    </PageShell>
  );
}
