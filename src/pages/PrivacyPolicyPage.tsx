import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Building2, Lock, UserCheck, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
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
          {/* Header Banner */}
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-prompt">
                นโยบายคุ้มครองข้อมูลส่วนบุคคล (Privacy Policy)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                มีผลบังคับใช้ตั้งแต่วันที่ 19 กันยายน 2569 | ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-700">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. บทนำและความมุ่งมั่น
              </h2>
              <p>
                หอพักภัทร์ลดา อพาร์ตเมนต์ (“หอพัก” หรือ “เรา”) ตระหนักและให้ความสำคัญอย่างยิ่งต่อการคุ้มครองข้อมูลส่วนบุคคลของผู้เช่า ผู้พักอาศัย ผู้ติดต่อสอบถาม และผู้ใช้งานเว็บไซต์ (“ท่าน”) นโยบายนี้จัดทำขึ้นเพื่อชี้แจงให้ทราบถึงวิธีการเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของท่าน รวมถึงสิทธิที่ท่านพึงได้รับตามกฎหมาย PDPA
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม
              </h2>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <strong className="text-slate-900">2.1 ข้อมูลระบุตัวตนและสัญญาเช่า:</strong>
                  <p className="text-xs text-slate-600 mt-1">คำนำหน้าชื่อ, ชื่อ-นามสกุล, เพศ, หมายเลขโทรศัพท์, หมายเลขห้องพัก, วันที่เริ่มทำสัญญา และยอดเงินประกัน</p>
                </div>
                <div>
                  <strong className="text-slate-900">2.2 ข้อมูลการเงินและสาธารณูปโภค:</strong>
                  <p className="text-xs text-slate-600 mt-1">ประวัติการจดเลขมิเตอร์ค่าน้ำ-ค่าไฟ, ใบแจ้งหนี้ประจำเดือน, ประวัติการชำระเงิน และสลิปหลักฐานการโอนเงิน</p>
                </div>
                <div>
                  <strong className="text-slate-900">2.3 ข้อมูลการติดต่อและแจ้งซ่อม:</strong>
                  <p className="text-xs text-slate-600 mt-1">รายละเอียดการแจ้งซ่อมแซมห้องพัก, บันทึกข้อความการติดต่อสื่อสาร</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                3. วัตถุประสงค์และฐานทางกฎหมายในการประมวลผล
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 pl-2">
                <li><strong className="text-slate-900">ฐานสัญญา (Contract):</strong> เพื่อจัดทำสัญญาเช่า, ออกบิลค่าน้ำไฟ, รับชำระค่าเช่า และอำนวยความสะดวกตลอดการพักอาศัย</li>
                <li><strong className="text-slate-900">ฐานหน้าที่ตามกฎหมาย (Legal Obligation):</strong> เพื่อการจัดทำบัญชีและภาษีอากรตามกฎหมายไทย</li>
                <li><strong className="text-slate-900">ฐานประโยชน์อันชอบธรรม (Legitimate Interest):</strong> เพื่อการรักษาความปลอดภัยของระบบและการจัดการหอพัก</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. มาตรการรักษาความปลอดภัยของข้อมูล</h2>
              <p>
                เราใช้มาตรฐานความปลอดภัยระดับสากล ได้แก่ การเข้ารหัสข้อมูลขณะรับส่งด้วย <strong>HTTPS/TLS</strong>, การเข้ารหัสข้อมูลระบุตัวตนในเบราว์เซอร์ด้วย <strong>Secure Storage</strong>, การจำกัดสิทธิ์การเข้าถึงตามบทบาท (RBAC) และการใช้ <strong>Row Level Security (RLS)</strong> ในระดับฐานข้อมูล
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. ระยะเวลาการเก็บรักษาข้อมูล</h2>
              <p>
                ข้อมูลระหว่างสัญญาเช่าจะจัดเก็บตลอดอายุการเช่า และจะจัดเก็บเอกสารสัญญา/การเงินต่อเนื่องเป็นเวลา <strong>5 – 10 ปี</strong> นับจากสิ้นสุดสัญญาเพื่อประโยชน์ทางภาษีและบัญชีตามที่กฎหมายกำหนด
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
              <p className="mb-2">ตามกฎหมาย PDPA ท่านมีสิทธิขอเข้าถึง, ขอรับสำเนา, ขอแก้ไข, ขอลบหรือทำลาย, ระงับการใช้ หรือถอนความยินยอมข้อมูลส่วนบุคคลของท่าน</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
                <strong>การใช้สิทธิหรือสอบถามเพิ่มเติม:</strong> กรุณาติดต่อผู้ควบคุมข้อมูลส่วนบุคคล หอพักภัทร์ลดา อพาร์ตเมนต์ ผ่านอีเมล: <code className="font-mono bg-white px-1.5 py-0.5 rounded border">privacy@phatlada.com</code> หรือโทรศัพท์ 081-xxx-xxxx
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2568 - 2569 ภัทร์ลดา อพาร์ทเมนท์ (Phatlada Apartment)</p>
          <div className="flex items-center space-x-4">
            <Link to="/cookie-policy" className="hover:text-primary transition">นโยบายคุกกี้</Link>
            <Link to="/terms" className="hover:text-primary transition">ข้อกำหนดการใช้งาน</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
