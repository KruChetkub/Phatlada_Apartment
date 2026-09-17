import React from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl border border-line animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center space-x-2 text-tone-red-solid">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tone-red-soft">
              <LogOut className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-ink">ออกจากระบบ</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink-muted hover:bg-bg-subtle hover:text-ink transition"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-sm text-ink-muted">
            คุณต้องการออกจากระบบการจัดการของ{' '}
            <span className="font-semibold text-ink">ภัทร์ลดา อพาร์ทเมนท์</span> ใช่หรือไม่?
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink-secondary hover:bg-bg-subtle transition"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center space-x-2 rounded-xl bg-tone-red-solid px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-tone-red-solid/90 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>ยืนยันออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

