import React, { useState, useEffect } from 'react';
import { Check, Phone, Sparkles, Calendar, Moon } from 'lucide-react';
import { getLocalSettings, DormSettings } from '../../services/settingsService';

interface LandingRoomsProps {
  onSelectRoom: (roomTitle: string) => void;
}

export const LandingRooms: React.FC<LandingRoomsProps> = ({ onSelectRoom }) => {
  const [settings, setSettings] = useState<DormSettings>(getLocalSettings);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getLocalSettings());
    };
    window.addEventListener('dormplus_settings_updated', handleUpdate);
    return () => window.removeEventListener('dormplus_settings_updated', handleUpdate);
  }, []);

  const monthlyPriceFormatted = Number(settings.landingStartingPrice || 3800).toLocaleString();
  const dailyPriceFormatted = Number(settings.landingDailyPrice || 500).toLocaleString();
  const originalPriceFormatted = Number(settings.landingOriginalPrice || 0).toLocaleString();

  // Shared standard air amenities (without study desk and without sink)
  const sharedAmenities = [
    'เครื่องปรับอากาศประหยัดไฟเบอร์ 5',
    'เตียงนอนขนาด 5 ฟุต พร้อมฟูกหนานุ่ม',
    'ตู้เสื้อผ้าขนาดใหญ่ & โต๊ะเครื่องแป้ง',
    'เครื่องทำน้ำอุ่น & ห้องน้ำแยกส่วนเปียก-แห้ง',
    'ระเบียงส่วนตัวด้านหลัง',
    'ฟรีอินเทอร์เน็ต Wi-Fi ความเร็วสูง',
  ];

  return (
    <section id="rooms" className="py-16 sm:py-24 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            ประเภทห้องพักและอัตราค่าเช่า
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            เลือกห้องพักที่เหมาะกับไลฟ์สไตล์ของคุณ
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            ห้องแอร์มาตรฐานพร้อมเข้าอยู่ ออกแบบเพื่อการพักผ่อนอย่างแท้จริง ทั้งแบบรายเดือนและรายวัน
          </p>
        </div>

        {/* 2 Comparison Cards (Monthly vs Daily) Centered and Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: ห้องแอร์มาตรฐาน (รายเดือน) */}
          <div className="rounded-3xl border-2 border-primary bg-white shadow-card-hover relative ring-4 ring-primary/10 flex flex-col justify-between transition-all hover:scale-[1.01]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="h-3.5 w-3.5" />
              <span>แนะนำ • สัญญารายเดือน</span>
            </span>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>26 ตร.ม. • รายเดือน</span>
                </span>
                <div className="flex items-baseline space-x-1.5">
                  {Number(settings.landingOriginalPrice) > 0 && (
                    <span className="text-xs sm:text-sm text-ink-muted line-through">
                      ฿{originalPriceFormatted}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-ink font-prompt">
                    ฿{monthlyPriceFormatted}
                  </span>
                  <span className="text-xs text-ink-secondary font-medium">/ เดือน</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink mb-2 font-prompt">
                ห้องแอร์มาตรฐาน (พักรายเดือน)
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">
                ห้องพักปรับอากาศพร้อมเฟอร์นิเจอร์ครบชุด โปร่งสบาย สไตล์มินิมอล เหมาะสำหรับการอยู่อาศัยระยะยาว คุ้มค่าและเป็นส่วนตัว
              </p>

              <div className="space-y-2.5 pt-5 border-t border-line">
                <span className="text-xs font-bold text-ink block mb-3">
                  สิ่งอำนวยความสะดวกในห้อง:
                </span>
                {sharedAmenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-ink-secondary">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{amenity}</span>
                  </div>
                ))}
                <div className="flex items-start space-x-2.5 text-xs text-tone-green-solid font-medium pt-1">
                  <Check className="h-4 w-4 text-tone-green-solid flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">สัญญาเช่ารายเดือน คุ้มค่าระยะยาว</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={() => onSelectRoom('ห้องแอร์มาตรฐาน (พักรายเดือน)')}
                className="w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>สนใจนัดดูห้องพัก (รายเดือน)</span>
              </button>
            </div>
          </div>

          {/* Card 2: ห้องแอร์มาตรฐาน (รายวัน) */}
          <div className="rounded-3xl border border-line bg-white shadow-card hover:border-line-dark hover:shadow-card-hover relative flex flex-col justify-between transition-all hover:scale-[1.01]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-surface-secondary text-ink border border-line text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap">
              <Moon className="h-3.5 w-3.5 text-tone-blue-solid" />
              <span>พักค้างคืน • พักรายวัน</span>
            </span>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-tone-blue-solid bg-tone-blue-soft px-3 py-1 rounded-full flex items-center gap-1">
                  <Moon className="h-3.5 w-3.5" />
                  <span>26 ตร.ม. • รายวัน</span>
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-ink font-prompt">
                    ฿{dailyPriceFormatted}
                  </span>
                  <span className="text-xs text-ink-secondary font-medium">/ วัน</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink mb-2 font-prompt">
                ห้องแอร์มาตรฐาน (พักรายวัน)
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">
                ห้องพักปรับอากาศมาตรฐาน สะอาด โปร่งสบาย เงียบสงบ เหมาะสำหรับนักเดินทาง ผู้มาติดต่อธุรกิจ หรือพักผ่อนชั่วคราว
              </p>

              <div className="space-y-2.5 pt-5 border-t border-line">
                <span className="text-xs font-bold text-ink block mb-3">
                  สิ่งอำนวยความสะดวกในห้อง:
                </span>
                {sharedAmenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-ink-secondary">
                    <Check className="h-4 w-4 text-tone-blue-solid flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{amenity}</span>
                  </div>
                ))}
                <div className="flex items-start space-x-2.5 text-xs text-tone-blue-solid font-medium pt-1">
                  <Check className="h-4 w-4 text-tone-blue-solid flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">พร้อมเข้าพักได้ทันที สะอาด ปลอดภัย</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={() => onSelectRoom('ห้องแอร์มาตรฐาน (พักรายวัน)')}
                className="w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold bg-surface hover:bg-bg text-ink border border-line hover:border-line-dark shadow-xs hover:shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>สอบถามห้องว่าง (รายวัน)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Informative Terms Note */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-bg border border-line max-w-3xl mx-auto text-center text-xs text-ink-secondary leading-relaxed">
          💡 <span className="font-bold text-ink">ข้อกำหนดการเข้าพัก:</span> แบบรายเดือนสัญญาเช่าขั้นต่ำ 6 เดือน (เงินประกัน 1 เดือน + ค่าเช่าล่วงหน้า 1 เดือน) | แบบรายวันโปรดติดต่อสอบถามห้องว่างล่วงหน้า
        </div>
      </div>
    </section>
  );
};
