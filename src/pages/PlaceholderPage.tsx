import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title?: string;
}

const ROUTE_NAMES: Record<string, string> = {
  '/rooms': 'ห้องพัก',
  '/tenants': 'ผู้เช่า',
  '/tenants/new': 'เพิ่มผู้เช่าใหม่',
  '/leases': 'สัญญาเช่า',
  '/leases/new': 'สร้างสัญญาเช่าใหม่',
  '/finance': 'การเงิน',
  '/finance/payments/new': 'บันทึกค่าเช่าใหม่',
  '/maintenance': 'แจ้งซ่อม / บำรุงรักษา',
  '/maintenance/new': 'สร้างรายการแจ้งซ่อมใหม่',
  '/reports': 'รายงาน',
  '/messages': 'ข้อความ',
  '/settings': 'ตั้งค่าระบบ',
  '/notifications': 'การแจ้งเตือนทั้งหมด',
  '/help': 'วิธีใช้งาน Phatlada',
};

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const location = useLocation();
  const pageTitle = title || ROUTE_NAMES[location.pathname] || 'หน้าระบบ';

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tone-orange-soft text-tone-orange-solid shadow-card">
        <Construction className="h-8 w-8" />
      </div>

      <h1 className="mt-4 text-2xl font-bold text-ink">{pageTitle}</h1>
      <p className="mt-2 max-w-md text-sm text-ink-secondary">
        ฟังก์ชันนี้อยู่ในแผนพัฒนา <strong>Phase 2 (CRUD)</strong> ตามข้อกำหนดใน SPEC.md ขณะนี้หน้าหลัก (Dashboard) พร้อมใช้งานแล้ว
      </p>

      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับสู่หน้าหลัก (Dashboard)</span>
        </Link>
      </div>
    </div>
  );
};

