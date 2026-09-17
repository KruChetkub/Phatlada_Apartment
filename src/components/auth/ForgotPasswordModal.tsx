import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('กรุณากรอกอีเมลที่ถูกต้อง');
      return;
    }

    setLoading(true);
    try {
      const res = await sendPasswordReset(email.trim());
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'ไม่สามารถส่งคำขอได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-line">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-ink">รีเซ็ตรหัสผ่าน</h3>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-ink-muted hover:bg-bg-subtle hover:text-ink transition"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tone-green-soft text-tone-green-solid">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-ink">ส่งคำขอสำเร็จแล้ว</h4>
            <p className="mt-2 text-sm text-ink-muted">{successMessage}</p>
            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition"
            >
              รับทราบและปิดหน้าต่าง
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-sm text-ink-muted">
              กรอกอีเมลที่ลงทะเบียนไว้ในระบบ ทางเราจะส่งคำแนะนำและลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังกล่องจดหมายของคุณ
            </p>

            {errorMessage && (
              <div className="flex items-start space-x-2 rounded-xl bg-tone-red-soft p-3 text-xs text-tone-red-solid">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-ink-secondary mb-1">
                อีเมลที่ใช้งาน (Email Address)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@phatlada.com"
                  className="w-full rounded-xl border border-line bg-bg pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-secondary hover:bg-bg-subtle transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>กำลังส่ง...</span>
                  </>
                ) : (
                  <span>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

