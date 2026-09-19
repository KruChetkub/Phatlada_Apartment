import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft, Building2, CheckCircle2, Shield } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 text-slate-800 hover:text-primary transition">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight font-prompt">
              ภัทร์ลดา อพาร์ทเมนท์
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับสู่หน้าแรก</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Cookie className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-prompt">
                นโยบายคุกกี้ (Cookie Policy)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                มีผลบังคับใช้ตั้งแต่วันที่ 19 กันยายน 2569 | Phatlada Apartment
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-700">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. คุกกี้และเทคโนโลยีจัดเก็บข้อมูลคืออะไร?</h2>
              <p>
                คุกกี้ (Cookies) และเทคโนโลยีการจัดเก็บข้อมูลบนเบราว์เซอร์ (Web Storage) คือไฟล์หรือพื้นที่จัดเก็บข้อมูลขนาดเล็กบนอุปกรณ์ของท่าน เพื่อช่วยให้ระบบจดจำสถานะการล็อกอิน การตั้งค่าภาษา และอำนวยความสะดวกในการใช้งานอย่างปลอดภัย
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. ประเภทของคุกกี้และข้อมูลที่เราจัดเก็บ</h2>
              
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    คุกกี้และ Storage ที่จำเป็นอย่างยิ่ง (Strictly Necessary)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    จำเป็นสำหรับการเข้าสู่ระบบ (Authentication), การจัดการเซสชัน, การจำแนกสิทธิ์ผู้ดูแลหอพัก และการรักษาความปลอดภัยของระบบ ข้อมูลกลุ่มนี้ถูกเข้ารหัสด้วย Secure Storage
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <Shield className="h-4 w-4 text-primary" />
                    คุกกี้เพื่อการทำงานของระบบ (Functional Storage)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ใช้จดจำการตั้งค่าการแสดงผล เช่น การเปิด-ปิดเมนูด้านข้าง การเลือกแสดงผลวันที่รูปแบบ วัน เดือน ปี พ.ศ. และการสลับดูข้อมูลหอพัก
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. การจัดการคุกกี้ผ่านเบราว์เซอร์</h2>
              <p>
                ท่านสามารถเลือกยอมรับหรือลบคุกกี้ได้ตลอดเวลาผ่านการตั้งค่าในเว็บเบราว์เซอร์ของท่าน (Chrome, Safari, Edge, Firefox) อย่างไรก็ตาม หากท่านปิดการทำงานของคุกกี้ที่จำเป็น ท่านจะไม่สามารถเข้าสู่ระบบจัดการหอพักได้
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2568 - 2569 ภัทร์ลดา อพาร์ทเมนท์ (Phatlada Apartment)</p>
          <div className="flex items-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-primary transition">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms" className="hover:text-primary transition">ข้อกำหนดการใช้งาน</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
