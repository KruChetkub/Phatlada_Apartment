import React from 'react';
import {
  ShieldCheck,
  Wifi,
  Car,
  Waves,
} from 'lucide-react';

const FACILITIES = [
  {
    icon: ShieldCheck,
    title: 'กล้องวงจรปิด CCTV 24 ชม.',
    desc: 'ระบบกล้องวงจรปิดครอบคลุมทุกทางเดิน ทางเข้า-ออก และพื้นที่จอดรถ เพื่อความปลอดภัยสูงสุดตลอดเวลา',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Wifi,
    title: 'อินเทอร์เน็ต Wi-Fi ความเร็วสูง',
    desc: 'สัญญาณครอบคลุมทั่วถึงทุกชั้น รองรับการทำงาน Work from Home การเรียนออนไลน์ และรับชมสตรีมมิ่งลื่นไหล',
    color: 'text-tone-blue-solid bg-tone-blue-soft',
  },
  {
    icon: Car,
    title: 'ที่จอดรถยนต์ & จักรยานยนต์ในร่ม',
    desc: 'พื้นที่จอดรถกว้างขวาง เป็นสัดส่วน ในร่ม ไม่ตากแดดตากฝน พร้อมระบบไฟส่องสว่างตลอดคืน',
    color: 'text-tone-green-solid bg-tone-green-soft',
  },
  {
    icon: Waves,
    title: 'เครื่องซักผ้า & ตู้น้ำดื่มหยอดเหรียญ',
    desc: 'จุดบริการซักผ้า ตู้อบผ้า และตู้น้ำดื่ม RO บริสุทธิ์ เปิดให้บริการอำนวยความสะดวกตลอด 24 ชั่วโมง',
    color: 'text-tone-amber-solid bg-tone-amber-soft',
  },
];

export const LandingFacilities: React.FC = () => {
  return (
    <section id="facilities" className="py-16 sm:py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            สิ่งอำนวยความสะดวก & คุณภาพชีวิต
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            ครบครันทุกความสะดวก สบายใจในทุกการอยู่อาศัย
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            เราใส่ใจทุกรายละเอียดเพื่อมอบสภาพแวดล้อมที่สะดวกสบาย ปลอดภัย และอบอุ่นแก่ผู้พักอาศัยทุกท่าน
          </p>
        </div>

        {/* Balanced 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FACILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface border border-line hover:border-line-dark shadow-xs hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 rounded-xl w-fit mb-4 ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 font-prompt">{item.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
