import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LayoutDashboard } from 'lucide-react';
import { getLocalSettings } from '../../services/settingsService';

export const LandingFooter: React.FC = () => {
  const settings = getLocalSettings();

  return (
    <footer className="bg-ink text-white/80 py-12 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight font-prompt">
                ภัทร์ลดา อพาร์ทเมนท์
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              อพาร์ตเมนต์คุณภาพเพื่อการอยู่อาศัยที่สงบ ร่มรื่น และปลอดภัย พร้อมสิ่งอำนวยความสะดวกครบครัน
            </p>
            <p className="text-[11px] text-white/50">
              {settings.address || '79 หมู่ 7 ต.เวียง อ.เชียงของ จ.เชียงราย 57140'}
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">เมนูหน้าแรก</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <a href="#rooms" className="hover:text-white transition">
                  ประเภทห้องพัก
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition">
                  สิ่งอำนวยความสะดวก
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition">
                  ทำเลที่ตั้ง
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  ติดต่อสอบถาม
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Management */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">ระบบจัดการ</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-1.5 text-primary-soft hover:text-white transition font-semibold"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                  <span>เข้าสู่ระบบ (Login)</span>
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="hover:text-white transition">
                  ตรวจสอบบิล & มิเตอร์
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition">
                  วิธีใช้งานระบบ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & Security (PDPA) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">ความปลอดภัย & กฎหมาย</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition flex items-center gap-1.5">
                  <span>นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition">
                  นโยบายคุกกี้ (Cookie Policy)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  ข้อกำหนดการใช้งาน (Terms of Service)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[11px]">
          <p>© 2568 - 2569 ภัทร์ลดา อพาร์ทเมนท์ (Phatlada Apartment). All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy</Link>
            <span>•</span>
            <Link to="/cookie-policy" className="hover:text-white transition">Cookies</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
