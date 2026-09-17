import React from 'react';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types/database';
import { getCurrentUserRole, setCurrentUserRole } from '../../services/authService';
import { ShieldCheck, UserCheck, Wrench, Check } from 'lucide-react';

interface AuthRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleChanged: (newRole: UserRole) => void;
}

export const AuthRoleModal: React.FC<AuthRoleModalProps> = ({
  isOpen,
  onClose,
  onRoleChanged,
}) => {
  const currentRole = getCurrentUserRole();

  const handleSelectRole = (role: UserRole) => {
    setCurrentUserRole(role);
    onRoleChanged(role);
    onClose();
  };

  const roles: {
    id: UserRole;
    name: string;
    description: string;
    permissions: string[];
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'OWNER',
      name: 'เจ้าของหอพัก (Owner)',
      description: 'สิทธิ์สูงสุดในการควบคุมระบบ การเงิน การตั้งค่า และการลบข้อมูล',
      permissions: ['เข้าถึงทุกหน้า 100%', 'จัดการตั้งค่าหอพักและค่าน้ำ-ไฟ', 'ลบห้องพัก/สัญญา/การเงินได้', 'สำรองและรีเซ็ตข้อมูลระบบ'],
      icon: ShieldCheck,
      color: 'text-primary bg-primary/10 border-primary',
    },
    {
      id: 'MANAGER',
      name: 'ผู้จัดการหอพัก (Manager)',
      description: 'สิทธิ์บริหารจัดการทั่วไป สัญญาเช่า ผู้เช่า และออกใบแจ้งหนี้',
      permissions: ['จัดการห้องพัก ผู้เช่า และสัญญาเช่า', 'จดมิเตอร์และออกใบแจ้งหนี้', 'บันทึกรับชำระเงินและรายจ่าย', 'ไม่สามารถรีเซ็ตระบบได้'],
      icon: UserCheck,
      color: 'text-tone-blue-solid bg-tone-blue-soft border-tone-blue-solid',
    },
    {
      id: 'STAFF',
      name: 'เจ้าหน้าที่ / แม่บ้าน (Staff)',
      description: 'สิทธิ์หน้างาน จดมิเตอร์น้ำ-ไฟ และดูแลงานแจ้งซ่อมบำรุง',
      permissions: ['จดมิเตอร์น้ำและไฟฟ้าประจำเดือน', 'บันทึกและอัปเดตงานแจ้งซ่อมบำรุง', 'ดูประกาศและส่งข้อความ', 'ซ่อนปุ่มการเงินและปุ่มลบข้อมูลสำคัญ'],
      icon: Wrench,
      color: 'text-tone-amber-solid bg-tone-amber-soft border-tone-amber-solid',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="โหมดความปลอดภัย & สิทธิ์ผู้ใช้งาน (RBAC / RLS)">
      <div className="space-y-4">
        <p className="text-xs text-ink-secondary">
          ระบบความปลอดภัยของ DormPlus เปิดใช้งาน Row Level Security (RLS) คุณสามารถสลับบทบาทด้านล่างเพื่อทดสอบการแสดงผลและสิทธิ์การเข้าถึงปุ่มต่างๆ ได้ทันที:
        </p>

        <div className="space-y-2.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = r.id === currentRole;
            return (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? `${r.color} shadow-xs`
                    : 'bg-surface border-line hover:border-line-dark'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-xs' : 'bg-bg'}`}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">{r.name}</h4>
                      <p className="text-[11px] text-ink-secondary mt-0.5">{r.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex items-center text-xs font-bold text-primary">
                      <Check className="h-4 w-4 mr-1" />
                      สิทธิ์ปัจจุบัน
                    </span>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-line/60 grid grid-cols-2 gap-1.5 text-[10px] text-ink-secondary">
                  {r.permissions.map((p, idx) => (
                    <span key={idx} className="flex items-center">
                      • {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-ink-secondary hover:text-ink transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </Modal>
  );
};

