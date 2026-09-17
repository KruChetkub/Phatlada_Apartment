import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ThaiDatePicker } from '../common/ThaiDatePicker';
import { createMessage } from '../../services/messageService';
import { Send, CheckCircle2 } from 'lucide-react';

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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomType, setRoomType] = useState(defaultRoomType || 'ห้องแอร์มาตรฐาน (Standard Air)');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      setSubmitting(true);
      // Create message for owner in the system
      await createMessage({
        recipientType: 'ALL',
        senderName: `${name} (ผู้สนใจเข้าพัก)`,
        title: `มีผู้สนใจนัดดูห้องพัก: ${roomType}`,
        content: `ชื่อผู้ติดต่อ: ${name}\nเบอร์โทรศัพท์: ${phone}\nประเภทห้องที่สนใจ: ${roomType}\nวันที่สะดวกเข้าชม: ${visitDate}\nหมายเหตุเพิ่มเติม: ${notes || '-'}`,
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
          <h3 className="text-base font-bold text-ink">ส่งข้อมูลนัดหมายเรียบร้อยแล้ว!</h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">
            เจ้าหน้าที่ผู้ดูแล ภัทร์ลดา อพาร์ทเมนท์ ได้รับข้อความของคุณแล้ว และจะติดต่อกลับทางเบอร์โทรศัพท์โดยเร็วที่สุด
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-ink-secondary">
            กรอกข้อมูลด้านล่างเพื่อทำการนัดหมายเข้าชมสถานที่จริง หรือสอบถามความพร้อมของห้องพักล่วงหน้า
          </p>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">ชื่อ - นามสกุล *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น คุณสมชาย ใจดี"
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081-xxx-xxxx"
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">ประเภทห้องพักที่สนใจ</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ห้องแอร์มาตรฐาน (Standard Air)">ห้องแอร์มาตรฐาน (Standard Air) - 3,800 บ./ด.</option>
              <option value="ห้องสตูดิโอวิวสวน (Deluxe Studio)">ห้องสตูดิโอวิวสวน (Deluxe Studio) - 4,500 บ./ด.</option>
              <option value="ห้องพัดลมประหยัด (Eco Fan)">ห้องพัดลมประหยัด (Eco Fan) - 2,800 บ./ด.</option>
            </select>
          </div>

          <div>
            <ThaiDatePicker
              label="วันที่สะดวกเข้ามาดูห้องพัก (พ.ศ.)"
              value={visitDate}
              onChange={setVisitDate}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">ข้อความเพิ่มเติม / สอบถาม</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ต้องการเข้าพักช่วงต้นเดือนหน้า, มีที่จอดรถยนต์หรือไม่"
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            />
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
