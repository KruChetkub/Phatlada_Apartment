import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, Building2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-prompt">
                ข้อกำหนดและเงื่อนไขการใช้บริการ (Terms of Service)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                มีผลบังคับใช้ตั้งแต่วันที่ 19 กันยายน 2569 | Phatlada Apartment
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-700">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. การยอมรับข้อกำหนด</h2>
              <p>
                การเข้าถึงและการใช้งานเว็บไซต์หรือระบบบริหารจัดการหอพักภัทร์ลดา อพาร์ตเมนต์ ถือว่าท่านได้อ่าน ทำความเข้าใจ และยอมรับข้อกำหนดและเงื่อนไขฉบับนี้โดยสมบูรณ์
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. การใช้งานระบบและบัญชีผู้ใช้</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 pl-2">
                <li>ผู้ใช้งานต้องให้ข้อมูลที่เป็นความจริงและถูกต้องในการใช้งานระบบ</li>
                <li>ผู้ใช้งานมีหน้าที่เก็บรักษาชื่อผู้ใช้และรหัสผ่านเป็นความลับ และไม่อนุญาตให้ผู้อื่นสวมสิทธิ์</li>
                <li>ห้ามกระทำการใดๆ ที่เป็นการละเมิดความปลอดภัย การเจาะระบบ หรือก่อความเสียหายต่อโครงสร้างพื้นฐานของระบบ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. ทรัพย์สินทางปัญญา</h2>
              <p>
                องค์ประกอบทั้งหมดบนเว็บไซต์นี้ รวมถึงซอฟต์แวร์ โลโก้ ข้อความ กราฟิก และการออกแบบ เป็นทรัพย์สินทางปัญญาของภัทร์ลดา อพาร์ตเมนต์ ห้ามทำซ้ำ ดัดแปลง หรือเผยแพร่เพื่อการค้าโดยไม่ได้รับอนุญาต
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. กฎหมายที่ใช้บังคับ</h2>
              <p>
                ข้อกำหนดและเงื่อนไขนี้อยู่ภายใต้บังคับและการตีความตามกฎหมายแห่งราชอาณาจักรไทย
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
            <Link to="/cookie-policy" className="hover:text-primary transition">นโยบายคุกกี้</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
