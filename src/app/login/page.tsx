'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { Logo } from '@/components/atoms/Logo';
import { PageShell } from '@/components/layouts/PageShell';
import {
  type LoginFormData,
  loginSchema,
  type RegisterFormData,
  registerSchema,
} from '@/lib/schemas/auth.schema';
import { useAuthStore } from '@/store/authStore';

type AuthStep = 'login' | 'register' | 'otp';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const fromCart = searchParams.get('from') === 'cart';

  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // OTP State
  const [pendingRegister, setPendingRegister] = useState<{
    userId: string;
    email: string;
    password?: string;
  } | null>(null);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const registerUser = useAuthStore((s) => s.register);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const loginDemo = useAuthStore((s) => s.loginDemo);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Redirect away if already logged in (e.g. via browser back button or direct access)
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [mounted, isAuthenticated, redirectPath, router]);

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
      router.replace(redirectPath);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali email/nomor dan kata sandimu.';
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await registerUser({
        name: data.name,
        whatsapp_number: data.whatsapp_number,
        email: data.email,
        password: data.password,
      });
      setPendingRegister({
        userId: res.user_id,
        email: data.email,
        password: data.password,
      });
      setOtp(['', '', '', '', '', '']);
      setAuthStep('otp');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pendaftaran gagal. Silakan coba lagi.';
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    const nextOtp = [...otp];

    if (!cleaned) {
      nextOtp[index] = '';
      setOtp(nextOtp);
      return;
    }

    nextOtp[index] = cleaned[cleaned.length - 1];
    setOtp(nextOtp);

    // Auto focus next box
    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const nextOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      nextOtp[i] = pasted[i];
    }
    setOtp(nextOtp);

    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRegister) return;
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setAuthError('Harap masukkan 6 digit kode OTP secara lengkap.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    try {
      await verifyOtp({
        user_id: pendingRegister.userId,
        auth_otp: fullOtp,
        email: pendingRegister.email,
        password: pendingRegister.password,
      });
      router.replace(redirectPath);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kode OTP salah atau kedaluwarsa.';
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.replace(redirectPath);
  };

  if (mounted && isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-8 h-8 border-3 border-[#9E1A59] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#8A7880]">Kamu sudah masuk. Mengalihkan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 md:py-14 flex flex-col gap-6">
      {/* Brand Logo */}
      <div className="flex justify-center pb-2">
        <Logo size="lg" />
      </div>

      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <Badge variant="primary">
          {authStep === 'otp' ? '🔐 Verifikasi Akun' : '✨ NEVERMIND Club'}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1A1A1A]">
          {authStep === 'otp'
            ? 'Masukkan Kode OTP'
            : authStep === 'login'
              ? 'Selamat Datang Kembali!'
              : 'Gabung Komunitas Kami'}
        </h1>
        <p className="text-xs sm:text-sm text-[#8A7880]">
          {authStep === 'otp' ? (
            <>
              Kami telah mengirimkan 6 digit kode verifikasi ke{' '}
              <strong className="text-[#1A1A1A]">{pendingRegister?.email}</strong>
            </>
          ) : authStep === 'login' ? (
            'Masuk untuk pantau pesanan dan nikmati diskon eksklusif.'
          ) : (
            'Daftar sekarang untuk akses kurasi tas China paling update.'
          )}
        </p>
      </div>

      {/* From Cart Notification Banner */}
      {fromCart && authStep !== 'otp' && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-2xl bg-[#F2EEEB] border border-[#E8D5C0] p-4 flex items-center gap-3.5 shadow-xs"
        >
          <span className="text-2xl shrink-0" aria-hidden="true">
            🛍️
          </span>
          <div>
            <p className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
              Produk tersimpan di keranjangmu!
            </p>
            <p className="text-[11px] sm:text-xs text-[#8E1744] mt-0.5 leading-snug">
              Silakan masuk atau daftar terlebih dahulu agar keranjang dan pesananmu dapat diproses.
            </p>
          </div>
        </motion.div>
      )}

      {/* 1-Click Demo Login Banner */}
      {authStep !== 'otp' && (
        <div className="rounded-2xl bg-gradient-to-r from-[#D8FFF7] to-[#F2EEEB] border border-[#9DDED1] p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden="true">
              ⚡
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1A6B5C] truncate">Coba Mode Demo Instan</p>
              <p className="text-[11px] text-[#2D8A76] truncate">Masuk sebagai Nadine Nevermind</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#9E1A59] hover:bg-[#7A1244] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Masuk Demo →
          </button>
        </div>
      )}

      {/* Card Form */}
      <div className="rounded-3xl bg-white border border-[#E8D5C0] p-6 sm:p-8 shadow-xs">
        {/* Tab Switcher (Only on login/register steps) */}
        {authStep !== 'otp' && (
          <div className="flex bg-[#F2EEEB] rounded-2xl p-1 border border-[#E8D5C0] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthStep('login');
                setAuthError(null);
              }}
              className={[
                'flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                authStep === 'login'
                  ? 'bg-white text-[#9E1A59] shadow-xs'
                  : 'text-[#8A7880] hover:text-[#1A1A1A]',
              ].join(' ')}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthStep('register');
                setAuthError(null);
              }}
              className={[
                'flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                authStep === 'register'
                  ? 'bg-white text-[#9E1A59] shadow-xs'
                  : 'text-[#8A7880] hover:text-[#1A1A1A]',
              ].join(' ')}
            >
              Daftar Akun
            </button>
          </div>
        )}

        {authError && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs p-3 mb-4 flex items-start gap-2">
            <span className="shrink-0" aria-hidden="true">⚠️</span>
            <div className="flex-1">{authError}</div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {authStep === 'login' ? (
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
                type={showLoginPassword ? 'text' : 'password'}
                label="Kata Sandi"
                placeholder="••••••••"
                required
                error={loginForm.formState.errors.password?.message}
                rightAdornment={
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="p-1 rounded-lg text-[#8A7880] hover:text-[#9E1A59] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#9E1A59]/40"
                    title={showLoginPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-label={showLoginPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showLoginPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                }
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
                  onClick={() =>
                    alert('Fitur lupa kata sandi bisa langsung chat admin WhatsApp kami ya!')
                  }
                  className="text-xs text-[#9E1A59] hover:underline font-semibold cursor-pointer"
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
          ) : authStep === 'register' ? (
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
                type={showRegisterPassword ? 'text' : 'password'}
                label="Buat Kata Sandi"
                placeholder="Minimal 8 karakter"
                required
                error={registerForm.formState.errors.password?.message}
                rightAdornment={
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    className="p-1 rounded-lg text-[#8A7880] hover:text-[#9E1A59] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#9E1A59]/40"
                    title={showRegisterPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-label={showRegisterPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showRegisterPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                }
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
          ) : (
            /* ── OTP Verification Step ── */
            <motion.form
              key="otp"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onSubmit={onOtpSubmit}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col items-center gap-2 text-center pb-1">
                <div className="w-14 h-14 rounded-2xl bg-[#F2EEEB] border border-[#E8D5C0] flex items-center justify-center text-2xl shadow-xs">
                  ✉️
                </div>
                <p className="text-xs text-[#8A7880]">
                  Masukkan 6 digit kode yang dikirim ke email kamu.
                </p>
                {pendingRegister?.userId && (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#F4EDE5] text-[#8A7880]">
                    ID: {pendingRegister.userId}
                  </span>
                )}
              </div>

              {/* 6 Digit Segmented Inputs */}
              <div
                className="flex items-center justify-center gap-2 sm:gap-2.5 my-1"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={`otp-box-${idx}`}
                    ref={(el) => {
                      otpRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={[
                      'w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border bg-white transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-[#9E1A59]/40 focus:border-[#9E1A59]',
                      digit
                        ? 'border-[#9E1A59] text-[#1A1A1A] bg-[#F2EEEB]/30'
                        : 'border-[#E8D5C0] text-[#1A1A1A]',
                    ].join(' ')}
                  />
                ))}
              </div>

              {/* Helper Hint */}
              <div className="rounded-2xl bg-[#F2EEEB] border border-[#E8D5C0] p-3 text-[11px] text-[#8A7880] flex items-start gap-2">
                <span className="shrink-0 text-sm">💡</span>
                <div>
                  <span className="font-bold text-[#1A1A1A]">Tips Pengembang:</span> Jika email belum diterima, kode OTP tersimpan di tabel database PostgreSQL backend Anda.
                </div>
              </div>

              <Button
                id="otp-submit-btn"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || otp.join('').length < 6}
              >
                {isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk Sekarang →'}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('register');
                    setAuthError(null);
                  }}
                  className="text-[#8A7880] hover:text-[#1A1A1A] font-semibold cursor-pointer transition-colors"
                >
                  ← Ubah Data Pendaftaran
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert('Jika belum menerima kode OTP, silakan periksa inbox / spam email atau cek tabel database PostgreSQL.')
                  }
                  className="text-[#9E1A59] hover:underline font-semibold cursor-pointer"
                >
                  Bantuan OTP?
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Back to Home Link */}
      <div className="text-center">
        <Link href="/" className="text-xs text-[#8A7880] hover:text-[#9E1A59] transition-colors">
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

