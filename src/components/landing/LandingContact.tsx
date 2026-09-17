import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ArrowUpRight,
  Navigation,
} from 'lucide-react';
import { getLocalSettings, DormSettings } from '../../services/settingsService';

interface LandingContactProps {
  onOpenBooking: () => void;
}

export const LandingContact: React.FC<LandingContactProps> = ({ onOpenBooking }) => {
  const [settings, setSettings] = useState<DormSettings>(() => getLocalSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getLocalSettings());
    };
    window.addEventListener('dormplus_settings_updated', handleUpdate);
    return () => window.removeEventListener('dormplus_settings_updated', handleUpdate);
  }, []);

  const fullAddress = settings.address || '79 หมู่ 7 เวียง อำเภอ เชียงของ เชียงราย 57140';
  const phoneNumber = settings.phone || '087 188 9122';
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            ติดต่อเรา & แผนที่การเดินทาง
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            ยินดีต้อนรับสู่ ภัทร์ลดา อพาร์ทเมนท์
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            สอบถามข้อมูลห้องพัก นัดหมายชมสถานที่จริง หรือปรึกษาเรื่องการเข้าพักได้ทุกวัน
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Details Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-1 font-prompt">ภัทร์ลดา อพาร์ทเมนท์ (Phatlada Apartment)</h3>
                <p className="text-xs text-ink-secondary">อพาร์ตเมนต์คุณภาพ บรรยากาศอบอุ่น สะอาด ปลอดภัย</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">ที่อยู่</span>
                    <p className="text-ink-secondary leading-relaxed font-medium">
                      {fullAddress}
                    </p>
                    <p className="text-[11px] text-primary font-mono mt-0.5">
                      Plus Code: 7C27+44 ตำบล เวียง อำเภอ เชียงของ เชียงราย
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-green-soft text-tone-green-solid flex-shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">เบอร์โทรศัพท์ติดต่อ</span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-primary font-mono text-base font-bold hover:underline"
                    >
                      {phoneNumber}
                    </a>
                    <span className="text-[11px] text-ink-secondary block mt-0.5">
                      โทรติดต่อสอบถามห้องว่าง หรือนัดหมายเข้าชมห้องได้ทุกวัน
                    </span>
                  </div>
                </div>

                {/* LINE Official */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-blue-soft text-tone-blue-solid flex-shrink-0 mt-0.5">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">LINE Official</span>
                    <p className="text-ink font-mono font-bold text-sm text-primary">
                      @phatlada
                    </p>
                    <span className="text-[11px] text-ink-secondary">แชตสอบถามข้อมูลห้องว่างและส่งข้อความได้ตลอด 24 ชม.</span>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-amber-soft text-tone-amber-solid flex-shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">เวลาทำการสำนักงาน</span>
                    <p className="text-ink-secondary">เปิดทำการทุกวัน: 08:00 น. - 19:00 น.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>ส่งข้อความนัดหมายชมห้องพักล่วงหน้า</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Interactive Google Map Section */}
          <div id="location" className="p-6 sm:p-8 rounded-2xl bg-bg border border-line flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-ink flex items-center space-x-2 font-prompt">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span>แผนที่ตั้ง ภัทร์ลดา อพาร์ทเมนท์</span>
                </h3>
                <a
                  href="https://maps.google.com/?q=20.250335765634254,100.40798988063878"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-primary font-semibold hover:underline"
                >
                  <span>เปิด Google Maps</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Embedded Google Maps iFrame */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-line shadow-sm bg-surface relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.2048873555455!2d100.40798988063878!3d20.250335765634254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d63108ba856d7f%3A0xf925c4fdd3ab8fb1!2z4Lig4Lix4LiX4Lij4LmM4Lil4LiU4Liy4Lit4Lie4Liy4Lij4LmM4LiX4LmA4Lih4LiZ4LiX4LmM!5e0!3m2!1sth!2sth!4v1789656955480!5m2!1sth!2sth"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="แผนที่ ภัทร์ลดา อพาร์ทเมนท์ เชียงของ เชียงราย"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary bg-surface p-3.5 rounded-xl border border-line">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>พิกัด: 79 หมู่ 7 เวียง อ.เชียงของ จ.เชียงราย</span>
              </div>
              <a
                href="https://maps.google.com/?q=20.250335765634254,100.40798988063878"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary font-bold hover:underline shrink-0"
              >
                นำทางด้วย GPS &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
