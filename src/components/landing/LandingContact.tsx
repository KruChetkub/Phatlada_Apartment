import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { getLocalSettings } from '../../services/settingsService';

interface LandingContactProps {
  onOpenBooking: () => void;
}

export const LandingContact: React.FC<LandingContactProps> = ({ onOpenBooking }) => {
  const settings = getLocalSettings();

  return (
    <section id="contact" className="py-16 sm:py-24 bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            ทำเลที่ตั้ง & การติดต่อ
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            สะดวกทุกการเดินทาง ใกล้แหล่งชุมชน
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            เข้ามาชมห้องพักจริงหรือสอบถามข้อมูลเพิ่มเติมกับผู้ดูแลได้ทุกวัน
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-line shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-1">ภัทร์ลดาอพาร์ทเมนท์ (Phatlada Apartment)</h3>
                <p className="text-xs text-ink-secondary">ยินดีต้อนรับผู้พักอาศัยทุกท่านด้วยความอบอุ่นและเป็นมิตร</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">ที่อยู่</span>
                    <p className="text-ink-secondary leading-relaxed">
                      {settings.address || 'เลขที่ 516 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.นครราชสีมา'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-green-soft text-tone-green-solid flex-shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">เบอร์โทรศัพท์ติดต่อ</span>
                    <p className="text-ink-secondary font-mono text-sm font-semibold">
                      {settings.phone || '081-234-5678, 089-876-5432'}
                    </p>
                    <span className="text-[11px] text-ink-secondary">ติดต่อสอบถาม หรือนัดหมายเข้าชมห้อง</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-blue-soft text-tone-blue-solid flex-shrink-0 mt-0.5">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">LINE Official</span>
                    <p className="text-ink-secondary font-mono font-semibold text-primary">
                      @phatlada_apt
                    </p>
                    <span className="text-[11px] text-ink-secondary">แชตสอบถามข้อมูลห้องว่างได้ 24 ชั่วโมง</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-amber-soft text-tone-amber-solid flex-shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">เวลาทำการสำนักงาน</span>
                    <p className="text-ink-secondary">จันทร์ - อาทิตย์: 08:30 น. - 19:00 น.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>ส่งข้อความนัดหมายชมห้องพักล่วงหน้า</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Map Representation / Highlights */}
          <div id="location" className="p-6 sm:p-8 rounded-2xl bg-bg border border-line flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-ink">จุดเด่นของทำเล & สถานที่ใกล้เคียง</h3>
              <ul className="space-y-3 text-xs text-ink-secondary">
                <li className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>ใกล้ถนนสายหลัก เดินทางสะดวก มีรถประจำทางและวินมอเตอร์ไซค์ผ่านตลอดวัน</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>ใกล้ 7-Eleven, ร้านสะดวกซื้อ, ตลาดนัด และร้านอาหารตามสั่งเพียง 150 เมตร</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>ใกล้สถานศึกษา / มหาวิทยาลัย และศูนย์การค้าชั้นนำ เดินทางเพียง 5-10 นาที</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>ตั้งอยู่ในซอยเงียบสงบ ไม่พลุกพล่าน ปลอดเสียงรบกวนจากถนนใหญ่</span>
                </li>
              </ul>
            </div>

            {/* Map visual block */}
            <div className="h-56 rounded-xl border border-line bg-surface overflow-hidden relative flex items-center justify-center text-center p-4">
              <div className="space-y-2">
                <MapPin className="h-8 w-8 text-primary mx-auto animate-bounce" />
                <span className="text-xs font-bold text-ink block">พิกัด ภัทร์ลดาอพาร์ทเมนท์</span>
                <p className="text-[11px] text-ink-secondary max-w-xs">
                  สามารถค้นหาคำว่า &quot;ภัทร์ลดาอพาร์ทเมนท์&quot; บน Google Maps หรือนำทางผ่าน GPS ได้ทันที
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent('ภัทร์ลดาอพาร์ทเมนท์')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-primary font-semibold hover:underline pt-1"
                >
                  <span>เปิดดูใน Google Maps</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
