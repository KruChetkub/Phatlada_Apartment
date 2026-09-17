import { Check, Phone, Sparkles } from 'lucide-react';

interface LandingRoomsProps {
  onSelectRoom: (roomTitle: string) => void;
}

const ROOM_TYPES = [
  {
    id: 'standard-air',
    name: 'ห้องแอร์มาตรฐาน (Standard Air)',
    size: '26 ตร.ม.',
    price: '3,800',
    popular: true,
    description: 'ห้องพักปรับอากาศพร้อมเฟอร์นิเจอร์ครบชุด ตกแต่งสไตล์มินิมอล โปร่งสบาย เหมาะสำหรับ 1-2 ท่าน',
    amenities: [
      'เครื่องปรับอากาศประหยัดไฟเบอร์ 5',
      'เตียงนอนขนาด 5 ฟุต พร้อมฟูกหนานุ่ม',
      'ตู้เสื้อผ้าขนาดใหญ่ & โต๊ะเครื่องแป้ง',
      'โต๊ะทำงาน / ทำการบ้าน พร้อมเก้าอี้',
      'เครื่องทำน้ำอุ่น & ห้องน้ำแยกส่วนเปียก-แห้ง',
      'ระเบียงส่วนตัวด้านหลังพร้อมซิงค์ล้างจาน',
      'ฟรีอินเทอร์เน็ต Wi-Fi ความเร็วสูง',
    ],
  },
  {
    id: 'studio-balcony',
    name: 'ห้องสตูดิโอวิวสวน (Deluxe Studio)',
    size: '30 ตร.ม.',
    price: '4,500',
    popular: false,
    description: 'ห้องพักขนาดกว้างพิเศษ วิวโล่งโปร่ง แสงธรรมชาติเข้าถึง พร้อมโซนพักผ่อนและมุมทำอาหาร',
    amenities: [
      'เครื่องปรับอากาศ Inverter เสียงเงียบ',
      'เตียงนอน King Size 6 ฟุต',
      'โซฟาพักผ่อน & โต๊ะกลาง',
      'ตู้เย็น & สมาร์ททีวีรองรับสตรีมมิ่ง',
      'เครื่องทำน้ำอุ่นระบบดิจิทัล',
      'ระเบียงกว้างพิเศษ วิวสวนสงบเงียบ',
      'สุขภัณฑ์และชุดห้องน้ำพรีเมียม',
    ],
  },
  {
    id: 'eco-fan',
    name: 'ห้องพัดลมประหยัด (Eco Fan)',
    size: '24 ตร.ม.',
    price: '2,800',
    popular: false,
    description: 'ห้องพักราคาประหยัด อากาศถ่ายเทสะดวก ลมพัดเย็นสบายตลอดทั้งวัน คุ้มค่าและเป็นส่วนตัว',
    amenities: [
      'พัดลมติดเพดาน & ช่องระบายอากาศอย่างดี',
      'เตียงนอน 5 ฟุต พร้อมที่นอนคุณภาพ',
      'ตู้เสื้อผ้าไม้ & โต๊ะอ่านหนังสือ',
      'ห้องน้ำส่วนตัวในห้องพัก',
      'ระเบียงซักล้างด้านหลัง',
      'ฟรีอินเทอร์เน็ต Wi-Fi',
      'ปลอดภัยด้วยคีย์การ์ดเข้าอาคาร',
    ],
  },
];

export const LandingRooms: React.FC<LandingRoomsProps> = ({ onSelectRoom }) => {
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
            ทุกห้องตกแต่งพร้อมเข้าอยู่ ออกแบบเพื่อการพักผ่อนอย่างแท้จริงในราคาที่เป็นธรรม
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ROOM_TYPES.map((room) => (
            <div
              key={room.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between ${
                room.popular
                  ? 'border-primary bg-white shadow-card-hover relative ring-2 ring-primary/20'
                  : 'border-line bg-white hover:border-line-dark shadow-card'
              }`}
            >
              {room.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  ยอดนิยมที่สุด
                </span>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {room.size}
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-extrabold text-ink font-mono">{room.price}</span>
                    <span className="text-xs text-ink-secondary">บาท/เดือน</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-ink mb-2">{room.name}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed mb-5">{room.description}</p>

                <div className="space-y-2.5 pt-4 border-t border-line">
                  <span className="text-xs font-bold text-ink block mb-2">สิ่งอำนวยความสะดวกในห้อง:</span>
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-ink-secondary">
                      <Check className="h-4 w-4 text-tone-green-solid flex-shrink-0 mt-0.5" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectRoom(room.name)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 ${
                    room.popular
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-sm'
                      : 'bg-bg hover:bg-surface-secondary text-ink border border-line'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>สนใจนัดดูห้องนี้</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Note */}
        <div className="mt-8 p-4 rounded-xl bg-bg border border-line max-w-2xl mx-auto text-center text-xs text-ink-secondary">
          💡 <span className="font-semibold text-ink">ข้อกำหนดและสัญญาเช่า:</span> สัญญาเช่าขั้นต่ำ 6 เดือน | เงินประกัน 1 เดือน + ค่าเช่าล่วงหน้า 1 เดือน พร้อมเข้าอยู่ได้ทันที
        </div>
      </div>
    </section>
  );
};
