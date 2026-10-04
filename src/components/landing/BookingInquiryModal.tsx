import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { ThaiDatePicker } from '../common/ThaiDatePicker';
import { createMessage } from '../../services/messageService';
import { createNotification } from '../../services/notificationService';
import { getLocalSettings, fetchSettings, DormSettings } from '../../services/settingsService';
import { sanitizeInput } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { Send, CheckCircle2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface BookingInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoomType?: string;
}

const LAST_INQUIRY_TIMESTAMP_KEY = 'phatlada_inquiry_cooldown';
const COOLDOWN_SECONDS = 45;

export const BookingInquiryModal: React.FC<BookingInquiryModalProps> = ({
  isOpen,
  onClose,
  defaultRoomType = '',
}) => {
  const [settings, setSettings] = useState<DormSettings>(getLocalSettings);
  const { t } = useLanguage();

  const monthlyPriceFormatted = Number(settings.landingStartingPrice || 3800).toLocaleString();
  const dailyPriceFormatted = Number(settings.landingDailyPrice || 500).toLocaleString();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomType, setRoomType] = useState(defaultRoomType || `${t.bookingModal.monthlyOption} - ${monthlyPriceFormatted} ฿`);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [botTrap, setBotTrap] = useState(''); // Anti-Bot Honeypot Field
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Measure form interaction time to block instant automated bot submissions
  const openTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    fetchSettings().then((s) => setSettings(s)).catch(() => {});

    const handleUpdate = () => {
      setSettings(getLocalSettings());
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'phatlada_system_settings' || e.key === 'dormplus_system_settings') {
        setSettings(getLocalSettings());
      }
    };

    window.addEventListener('phatlada_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('phatlada_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
      setCooldownMessage(null);
      setBotTrap('');
      if (defaultRoomType) {
        setRoomType(defaultRoomType);
      } else {
        setRoomType(`${t.bookingModal.monthlyOption} - ${monthlyPriceFormatted} ฿`);
      }
    }
  }, [defaultRoomType, monthlyPriceFormatted, isOpen, t.bookingModal.monthlyOption]);

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
    setCooldownMessage(null);

    // 1. Anti-Bot Honeypot check: If the hidden honeypot field has a value, it's a bot!
    if (botTrap.trim().length > 0) {
      // Fake success silently without creating database records
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
      return;
    }

    // 2. Anti-Bot Fast Submit check: Humans take at least 2 seconds to fill the form
    const durationSinceOpen = Date.now() - openTimeRef.current;
    if (durationSinceOpen < 1800) {
      // Automated bot submission blocked
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
      return;
    }

    // 3. Anti-Spam Rate Limit check: Prevent repeated submissions within 45 seconds
    if (typeof window !== 'undefined') {
      const lastSubmitStr = sessionStorage.getItem(LAST_INQUIRY_TIMESTAMP_KEY);
      if (lastSubmitStr) {
        const lastSubmitTime = parseInt(lastSubmitStr, 10);
        const elapsedSeconds = Math.floor((Date.now() - lastSubmitTime) / 1000);
        if (elapsedSeconds < COOLDOWN_SECONDS) {
          const remaining = COOLDOWN_SECONDS - elapsedSeconds;
          setCooldownMessage(t.bookingModal.cooldownNotice.replace('{sec}', remaining.toString()));
          return;
        }
      }
    }

    const cleanName = sanitizeInput(name.trim(), 15);
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
    const cleanNotes = sanitizeInput(notes.trim(), 100);

    if (!cleanName || !cleanPhone || cleanPhone.length < 9) {
      setCooldownMessage('Please enter a valid phone number (9-10 digits) / กรุณากรอกเบอร์โทรศัพท์ (9-10 หลัก)');
      return;
    }

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

      // Also create a system notification for the owner/manager
      await createNotification({
        type: 'ROOM_AVAILABLE',
        title: `มีผู้สนใจนัดดูห้องพัก: ${cleanName}`,
        body: `ห้อง: ${roomType} (เบอร์โทร: ${cleanPhone}) เข้าชม: ${visitDate}`,
        href: '/messages',
      });

      // Record last submit timestamp to throttle repeated spam
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(LAST_INQUIRY_TIMESTAMP_KEY, Date.now().toString());
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setPhone('');
        setNotes('');
        setBotTrap('');
      }, 2500);
    } catch (err) {
      console.error('Failed to submit booking inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.bookingModal.title}>
      {success ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-tone-green-solid mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-ink font-prompt">{t.bookingModal.successTitle}</h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">
            {t.bookingModal.successMessage}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anti-Bot Honeypot field (hidden from human users, bots fill it) */}
          <div className="hidden absolute -left-[9999px] pointer-events-none opacity-0 select-none" aria-hidden="true">
            <label htmlFor="company_verify_hp">Do not fill this field</label>
            <input
              id="company_verify_hp"
              type="text"
              name="company_verify_hp"
              tabIndex={-1}
              autoComplete="off"
              value={botTrap}
              onChange={(e) => setBotTrap(e.target.value)}
            />
          </div>

          {/* Anti-Spam Cooldown Warning Alert */}
          {cooldownMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{cooldownMessage}</span>
            </div>
          )}

          <p className="text-xs text-ink-secondary">
            {t.bookingModal.subtitle}
          </p>

          {/* Name Field: Max 15 chars & Sanitized */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink">
                {t.bookingModal.nameLabel} *
              </label>
              <span className="text-[10px] text-ink-muted">
                {name.length}/15
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={15}
              value={name}
              onChange={handleNameChange}
              placeholder={t.bookingModal.namePlaceholder}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Phone Field: Digits only & Max 10 digits */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink">
                {t.bookingModal.phoneLabel} *
              </label>
              <span className="text-[10px] text-ink-muted">
                Max 10 digits
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
              placeholder={t.bookingModal.phonePlaceholder}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary font-mono tracking-wider"
            />
          </div>

          {/* Room Type Field */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">{t.bookingModal.roomTypeLabel}</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={`${t.bookingModal.monthlyOption} - ฿${monthlyPriceFormatted}`}>
                {t.bookingModal.monthlyOption} - ฿{monthlyPriceFormatted}
              </option>
              <option value={`${t.bookingModal.dailyOption} - ฿${dailyPriceFormatted}`}>
                {t.bookingModal.dailyOption} - ฿{dailyPriceFormatted}
              </option>
            </select>
          </div>

          {/* Visit Date */}
          <div>
            <ThaiDatePicker
              label={t.bookingModal.visitDateLabel}
              value={visitDate}
              onChange={setVisitDate}
            />
          </div>

          {/* Notes: Max 100 chars & Anti-XSS Sanitized */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink">
                {t.bookingModal.notesLabel}
              </label>
              <span className={`text-[10px] ${notes.length >= 100 ? 'text-tone-red-solid font-bold' : 'text-ink-muted'}`}>
                {notes.length}/100
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={100}
              value={notes}
              onChange={handleNotesChange}
              placeholder={t.bookingModal.notesPlaceholder}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Privacy & Security Note */}
          <div className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="block">
                {t.bookingModal.privacyNotice}{' '}
                <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline hover:text-primary-dark">
                  {t.bookingModal.pdpaLink}
                </Link>
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600 inline" />
                Anti-XSS & Honeypot Secured
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-ink-secondary hover:text-ink transition"
            >
              {t.bookingModal.closeBtn}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? t.bookingModal.submitting : t.bookingModal.submitBtn}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
