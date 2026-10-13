import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, Sparkles, Check, Eye } from 'lucide-react';

export interface RoomPhotoItem {
  id: number;
  src: string;
  title: string;
  titleEn: string;
  badge: string;
  description: string;
  highlights: string[];
}

export const ROOM_PHOTOS: RoomPhotoItem[] = [
  {
    id: 1,
    src: '/rooms/room-1.jpg',
    title: 'ห้องพักสไตล์ฟ้าคราม โปร่งสบาย',
    titleEn: 'Sky Blue Deluxe Room',
    badge: 'สไตล์ยอดนิยม • สดใส สบายตา',
    description: 'เตียงใหญ่ 5 ฟุต พร้อมฟูกหนานุ่ม โต๊ะทำงานริมระเบียงส่วนตัว บานเลื่อนกระจกรับแสงธรรมชาติ อากาศถ่ายเทดีเยี่ยม',
    highlights: ['เตียง 5 ฟุต พร้อมฟูกหนานุ่ม', 'โต๊ะทำงานและเก้าอี้ส่วนตัว', 'ประตูกระจกบานเลื่อนออกสู่ระเบียง'],
  },
  {
    id: 2,
    src: '/rooms/room-2.jpg',
    title: 'ห้องพักสไตล์วอร์มมอคค่า อบอุ่น มินิมอล',
    titleEn: 'Warm Mocha Cozy Room',
    badge: 'สไตล์อบอุ่น • เรียบหรู มินิมอล',
    description: 'บรรยากาศอบอุ่นผ่อนคลาย แอร์ประหยัดไฟเบอร์ 5 ผ้าม่านทึบแสง 100% กันความร้อน พร้อมโต๊ะเครื่องแป้งและกระจกส่องเต็มตัว',
    highlights: ['เครื่องปรับอากาศประหยัดไฟเบอร์ 5', 'ผ้าม่านทึบแสงกันความร้อน 100%', 'โต๊ะเครื่องแป้งและกระจกแต่งหน้า'],
  },
  {
    id: 3,
    src: '/rooms/room-3.jpg',
    title: 'ห้องพักสไตล์เซจกรีน ธรรมชาติ ร่มรื่น',
    titleEn: 'Sage Green Relax Room',
    badge: 'สไตล์ธรรมชาติ • สดชื่น ผ่อนคลาย',
    description: 'โทนสีเขียวละมุนตา ให้ความรู้สึกสงบสุขเหมือนพักผ่อนอยู่บ้าน เฟอร์นิเจอร์ครบครัน สะอาด ปลอดโปร่ง ปลอดภัย 24 ชั่วโมง',
    highlights: ['โทนสีธรรมชาติสบายตา', 'สุขภัณฑ์และเครื่องทำน้ำอุ่นพร้อมใช้', 'ฟรี Wi-Fi ความเร็วสูงถึงเตียง'],
  },
];

interface RoomGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  onOpenBooking?: (roomStyle?: string) => void;
}

export const RoomGalleryModal: React.FC<RoomGalleryModalProps> = ({
  isOpen,
  onClose,
  initialIndex = 0,
  onOpenBooking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? ROOM_PHOTOS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === ROOM_PHOTOS.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation & ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPhoto = ROOM_PHOTOS[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Background backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-line bg-surface/90 backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-ink font-prompt flex items-center gap-2">
                <span>ภาพถ่ายห้องพักจริง (100% Real Photos)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary hidden sm:inline">
                  {currentIndex + 1} / {ROOM_PHOTOS.length}
                </span>
              </h3>
              <p className="text-[11px] text-ink-secondary">
                ภัทร์ลดา อพาร์ทเมนท์ • เชียงของ เชียงราย
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-secondary hover:text-ink hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Image Viewport + Info */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Photo Area */}
          <div className="relative bg-black flex items-center justify-center min-h-[280px] sm:min-h-[420px] max-h-[58vh]">
            <img
              src={currentPhoto.src}
              alt={currentPhoto.title}
              width={1448}
              height={1086}
              className="max-h-[58vh] w-auto max-w-full object-contain select-none"
            />

            {/* Left Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/20"
              aria-label="ภาพก่อนหน้า"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Right Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/20"
              aria-label="ภาพถัดไป"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Mobile counter indicator overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold sm:hidden border border-white/20">
              {currentIndex + 1} / {ROOM_PHOTOS.length}
            </div>
          </div>

          {/* Details & Thumbnail Navigation */}
          <div className="p-5 sm:p-7 space-y-5 bg-surface">
            {/* Title & Badge & Booking CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-tone-green-soft text-tone-green-solid text-xs font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>{currentPhoto.badge}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-ink font-prompt">
                  {currentPhoto.title}
                </h4>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-2xl">
                  {currentPhoto.description}
                </p>
              </div>

              {onOpenBooking && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking(currentPhoto.title);
                  }}
                  className="shrink-0 inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-tone-blue-solid hover:from-primary/90 hover:to-tone-blue-solid/90 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  <span>สนใจจองห้องพักสไตล์นี้</span>
                </button>
              )}
            </div>

            {/* Highlights pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-line/60">
              {currentPhoto.highlights.map((h, i) => (
                <div
                  key={i}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-bg border border-line text-xs font-medium text-ink"
                >
                  <Check className="h-3.5 w-3.5 text-tone-green-solid" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Thumbnail Strip */}
            <div className="pt-3 border-t border-line/60">
              <p className="text-xs font-bold text-ink-secondary mb-3">
                เลือกดูห้องพักแบบอื่น ๆ (3 โทนสีตกแต่ง):
              </p>
              <div className="grid grid-cols-3 gap-3">
                {ROOM_PHOTOS.map((item, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`group relative rounded-2xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-primary ring-4 ring-primary/20 shadow-md scale-[1.02]'
                          : 'border-line hover:border-primary/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        width={1448}
                        height={1086}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <span className="text-[10px] sm:text-xs font-bold text-white block truncate">
                          {item.title.split('สไตล์')[1] || item.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

