import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { getLocalSettings } from '../../services/settingsService';

export const LandingFooter: React.FC = () => {
  const settings = getLocalSettings();

  return (
    <footer className="bg-ink text-white/80 py-12 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight font-prompt">
                ภัทร์ลดา อพาร์ทเมนท์ (Phatlada Apartment)
              </span>
            </div>
            <p className="text-xs text-white/60 max-w-md leading-relaxed">
              อพาร์ตเมนต์คุณภาพเพื่อการอยู่อาศัยที่สงบ ร่มรื่น และปลอดภัย พร้อมสิ่งอำนวยความสะดวกครบครัน และการบริการที่จริงใจ
            </p>
            <p className="text-[11px] text-white/50">
              {settings.address || 'เลขที่ 516 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.นครราชสีมา'}
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">สำหรับผู้ดูแล & ผู้เช่า</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-1.5 text-primary-soft hover:text-white transition font-medium"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>ระบบจัดการหอพัก (Dashboard)</span>
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="hover:text-white transition">
                  ตรวจสอบบิล & มิเตอร์น้ำไฟ
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition">
                  วิธีใช้งานระบบ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[11px]">
          <p>© 2568 - 2569 ภัทร์ลดา อพาร์ทเมนท์ (Phatlada Apartment). All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by DormPlus</span>
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
};
