import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import {
  loginWithEmail,
  isAuthenticated,
} from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Return to intended page or /dashboard
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(fromLocation, { replace: true });
    }
  }, [navigate, fromLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('กรุณากรอกอีเมลผู้ใช้งาน');
      return;
    }
    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        navigate(fromLocation, { replace: true });
      } else {
        setErrorMessage(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-primary selection:text-white">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/5 via-tone-blue-soft/30 to-transparent pointer-events-none -z-10" />

      {/* Top Bar Link Back to Landing */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-ink-muted hover:text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับสู่หน้าแรกเว็บไซต์ (ภัทร์ลดา อพาร์ทเมนท์)</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-tone-blue-solid flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4">
          <Building2 className="h-9 w-9" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          ภัทร์ลดา อพาร์ทเมนท์
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          ระบบบริหารจัดการหอพักและห้องพักอัจฉริยะ (Management Portal)
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface py-8 px-5 sm:px-8 shadow-card rounded-2xl border border-line">
          {errorMessage && (
            <div className="mb-5 flex items-start space-x-2.5 rounded-xl bg-tone-red-soft p-3.5 text-sm text-tone-red-solid animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5"
              >
                อีเมลผู้ใช้งาน (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@phatlada.com"
                  className="w-full rounded-xl border border-line bg-bg pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-ink uppercase tracking-wider"
                >
                  รหัสผ่าน (Password)
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line bg-bg pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-ink focus:outline-none"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-sm text-ink-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
                />
                <span className="text-xs">จดจำการเข้าสู่ระบบในอุปกรณ์นี้</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>กำลังตรวจสอบความถูกต้อง...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>เข้าสู่ระบบจัดการ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice Footer */}
        <div className="mt-6 text-center text-xs text-ink-muted">
          ระบบมีการเข้ารหัสและจำกัดสิทธิ์ข้อมูลตามนโยบายความปลอดภัยของ ภัทร์ลดา อพาร์ทเมนท์
        </div>
      </div>
    </div>
  );
};

