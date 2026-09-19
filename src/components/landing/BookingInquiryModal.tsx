import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { ThaiDatePicker } from '../common/ThaiDatePicker';
import { createMessage } from '../../services/messageService';
import { getLocalSettings } from '../../services/settingsService';
import { sanitizeInput } from '../../lib/utils';
import { Send, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

interface BookingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoomType?: string;
}

export const BookingInquiryModal: React.FC<BookingInquiryModalProps> = ({
  isOpen,
  onClose,
  defaultRoomType = '',
}) => {
  const settings = getLocalSettings();
  const monthlyPriceFormatted = Number(settings.landingStartingPrice || 3800).toLocaleString();
  const dailyPriceFormatted = Number(settings.landingDailyPrice || 500).toLocaleString();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomType, setRoomType] = useState(defaultRoomType || `ห้องแอร์มาตรฐาน (พักรายเดือน) - ${monthlyPriceFormatted} บ./เดือน`);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (defaultRoomType) {
      setRoomType(defaultRoomType);
    } else {
      setRoomType(`ห้องแอร์มาตรฐาน (พักรายเดือน) - ${monthlyPriceFormatted} บ./เดือน`);
    }
  }, [defaultRoomType, monthlyPriceFormatted, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize and limit to 15 characters
    const cleaned = sanitizeInput(e.target.value, 15);
    setName(cleaned);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric digits up to 10 characters
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Limit to 100 characters
    const val = e.target.value.slice(0, 100);
    setNotes(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeInput(name.trim(), 15);
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
    const cleanNotes = sanitizeInput(notes.trim(), 100);

    if (!cleanName || !cleanPhone) return;

    try {
      setSubmitting(true);
      // Create message for owner in the system
      await createMessage({
        recipientType: 'ALL',
        senderName: `${cleanName} (ผู้สนใจเข้าพัก)`,
        title: `มีผู้สนใจนัดดูห้องพัก: ${roomType}`,
        content: `ชื่อผู้ติดต่อ: ${cleanName}\nเบอร์โทรศัพท์: ${cleanPhone}\nประเภทห้องที่สนใจ: ${roomType}\nวันที่สะดวกเข้าชม: ${visitDate}\nหมายเหตุเพิ่มเติม: ${cleanNotes || '-'}`,
        priority: 'NORMAL',
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setPhone('');
        setNotes('');
      }, 2500);
    } catch (err) {
      console.error('Failed to submit booking inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="นัดหมายชมห้องพักจริง / สอบถามข้อมูล">
      {success ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-tone-green-solid mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-ink font-prompt">ส่งข้อมูลนัดหมายเรียบร้อยแล้ว!</h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">
            เจ้าหน้าที่ผู้ดูแล ภัทร์ลดา อพาร์ทเมนท์ ได้รับข้อความของคุณแล้ว และจะติดต่อกลับทางเบอร์โทรศัพท์โดยเร็วที่สุด
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-ink-secondary">
            กรอกข้อมูลด้านล่างเพื่อทำการนัดหมายเข้าชมสถานที่จริง หรือสอบถามความพร้อมของห้องพักล่วงหน้า
          </p>

          {/* Name Field: Max 15 chars & Sanitized */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink">
                ชื่อ - นามสกุล *
              </label>
              <span className="text-[10px] text-ink-muted">
                {name.length}/15 ตัวอักษร
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={15}
              value={name}
              onChange={handleNameChange}
              placeholder="เช่น คุณสมชาย (ไม่เกิน 15 ตัว)"
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Phone Field: Digits only & Max 10 digits */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink">
                เบอร์โทรศัพท์ติดต่อ *
              </label>
              <span className="text-[10px] text-ink-muted">
                เฉพาะตัวเลข 10 หลัก
              </span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={10}
              value={phone}
              onChange={handlePhoneChange}
              placeholder="เช่น 0871889122"
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary font-mono tracking-wider"
            />
          </div>

          {/* Room Type Field */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">ประเภทห้องพักที่สนใจ</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={`ห้องแอร์มาตรฐาน (พักรายเดือน) - ${monthlyPriceFormatted} บ./เดือน`}>
                ห้องแอร์มาตรฐาน (พักรายเดือน) - {monthlyPriceFormatted} บ./เดือน
              </option>
              <option value={`ห้องแอร์มาตรฐาน (พักรายวัน) - ${dailyPriceFormatted} บ./วัน`}>
                ห้องแอร์มาตรฐาน (พักรายวัน) - {dailyPriceFormatted} บ./วัน
              </option>
              <option value="สอบถามห้องว่าง / ปรึกษาข้อมูลทั่วไป">
                สอบถามห้องว่าง / ปรึกษาข้อมูลทั่วไป
              </option>
            </select>
          </div>

          {/* Visit Date */}
          <div>
            <ThaiDatePicker
              label="วันที่สะดวกเข้ามาดูห้องพัก (พ.ศ.)"
              value={visitDate}
              onChange={setVisitDate}
            />
          </div>

          {/* Notes: Max 100 chars & Anti-XSS Sanitized */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink">
                ข้อความเพิ่มเติม / สอบถาม
              </label>
              <span className={`text-[10px] ${notes.length >= 100 ? 'text-tone-red-solid font-bold' : 'text-ink-muted'}`}>
                {notes.length}/100 ตัวอักษร
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={100}
              value={notes}
              onChange={handleNotesChange}
              placeholder="เช่น ต้องการเข้าพักต้นเดือนหน้า, มีที่จอดรถยนต์หรือไม่ (ไม่เกิน 100 ตัวอักษร)"
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Privacy & Security Note */}
          <div className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="block">
                ข้อมูลปลอดภัย: ระบบเข้ารหัสและส่งตรงถึงผู้ดูแลหอพัก ไม่บันทึกค้างบนเครื่องผู้ใช้ ตาม{' '}
                <Link to="/privacy-policy" target="_blank" className="text-primary font-medium underline hover:text-primary-dark">
                  นโยบาย PDPA
                </Link>
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600 inline" />
                ระบบมีตัวกรองความปลอดภัย ป้องกันคำสั่งสคริปต์อันตราย (Anti-XSS Protection)
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-ink-secondary hover:text-ink transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการนัดหมาย'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
