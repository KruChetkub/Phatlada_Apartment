import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { UserRole } from '../../types/database';
import { isAuthenticated, getCurrentUserRole } from '../../services/authService';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ROLE_NAMES: Record<UserRole, string> = {
  OWNER: 'เจ้าของหอพัก (Owner)',
  MANAGER: 'ผู้จัดการ (Manager)',
  STAFF: 'เจ้าหน้าที่หน้างาน (Staff)',
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const userRole = getCurrentUserRole();

  // If not authenticated, redirect to login page with return state
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is restricted and user does not have permission
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const allowedText = allowedRoles.map((r) => ROLE_NAMES[r]).join(' หรือ ');

    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tone-red-soft text-tone-red-solid shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">
          ไม่มีสิทธิ์เข้าถึงหน้านี้ (403 Forbidden)
        </h2>

        <p className="mt-2 max-w-md text-sm text-ink-muted">
          ส่วนการทำงานนี้จำกัดสิทธิ์เฉพาะ{' '}
          <span className="font-semibold text-ink">{allowedText}</span>
          <br />
          บทบาทปัจจุบันของคุณคือ{' '}
          <span className="font-semibold text-primary">{ROLE_NAMES[userRole]}</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>กลับสู่แดชบอร์ดหลัก</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-secondary hover:bg-bg-subtle transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ย้อนกลับ</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

