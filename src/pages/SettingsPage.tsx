import React, { useEffect, useState, useRef } from 'react';
import {
  Settings,
  Building2,
  Zap,
  CreditCard,
  User,
  Bell,
  Save,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  Tag,
  ShieldCheck,
  LogOut,
  Clock,
  Lock,
} from 'lucide-react';
import {
  fetchSettings,
  saveSettings,
  DormSettings,
  defaultSettings,
  exportBackupJson,
  importBackupJson,
  resetAllData,
} from '../services/settingsService';
import { logout } from '../services/authService';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

type SettingsTab = 'DORMITORY' | 'PRICING' | 'BILLING' | 'BANK' | 'PROFILE' | 'SYSTEM' | 'SECURITY';

const THAI_BANKS = [
  'ธนาคารกสิกรไทย',
  'ธนาคารไทยพาณิชย์',
  'ธนาคารกรุงเทพ',
  'ธนาคารกรุงไทย',
  'ธนาคารกรุงศรีอยุธยา',
  'ธนาคารทหารไทยธนชาต (ttb)',
  'ธนาคารออมสิน',
  'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)',
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('DORMITORY');
  const [settings, setSettings] = useState<DormSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchSettings();
        if (mounted) setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = <K extends keyof DormSettings>(field: K, value: DormSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await saveSettings(settings);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phatlada-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupJson(content);
        if (success) {
          const fresh = await fetchSettings();
          setSettings(fresh);
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3500);
          alert('นำเข้าข้อมูลสำเร็จ ระบบได้ปรับปรุงข้อมูลเรียบร้อยแล้ว');
        } else {
          alert('ไฟล์ข้อมูลไม่ถูกต้อง กรุณาเลือกไฟล์ Backup JSON ของ Phatlada');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmReset = () => {
    resetAllData();
    setSettings(defaultSettings);
    setIsResetDialogOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
    alert('รีเซ็ตระบบเรียบร้อยแล้ว ข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้น');
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-secondary text-sm">กำลังโหลดการตั้งค่า...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 bg-tone-green-solid text-white px-4 py-3 rounded-xl shadow-lg transition-all animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">บันทึกการตั้งค่าระบบเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <span>ตั้งค่าระบบ</span>
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            จัดการข้อมูลหอพัก อัตราค่าน้ำค่าไฟ บัญชีธนาคาร และการสำรองข้อมูล
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-line overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('DORMITORY')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'DORMITORY'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>ข้อมูลหอพัก</span>
        </button>

        <button
          onClick={() => setActiveTab('PRICING')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'PRICING'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>ราคา</span>
        </button>

        <button
          onClick={() => setActiveTab('BILLING')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'BILLING'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>ค่าน้ำ-ไฟ & การออกบิล</span>
        </button>

        <button
          onClick={() => setActiveTab('BANK')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'BANK'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>บัญชีรับเงิน / พร้อมเพย์</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'PROFILE'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <User className="h-4 w-4" />
          <span>บัญชีผู้ใช้งาน</span>
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'SYSTEM'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>การแจ้งเตือน & ข้อมูล</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-t-lg text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'SECURITY'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>ความปลอดภัย & เซสชัน</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-surface border border-line rounded-xl p-5 shadow-xs">
        {/* Tab 1: Dormitory Info */}
        {activeTab === 'DORMITORY' && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>ข้อมูลพื้นฐานของหอพัก</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">ชื่อหอพัก / อพาร์ตเมนต์ *</label>
              <input
                type="text"
                required
                value={settings.dormitoryName}
                onChange={(e) => handleChange('dormitoryName', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="เช่น หอพักสุขสบาย แมนชั่น"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">ที่อยู่หอพัก</label>
              <textarea
                rows={3}
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="เช่น 123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  เบอร์โทรศัพท์ติดต่อหอพัก (เบอร์ที่ 1) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="087 188 9122"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  เบอร์โทรศัพท์ติดต่อหอพัก (เบอร์ที่ 2)
                </label>
                <input
                  type="text"
                  value={settings.phone2 || ''}
                  onChange={(e) => handleChange('phone2', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="0918517221"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">เลขประจำตัวผู้เสียภาษี / นิติบุคคล</label>
              <input
                type="text"
                value={settings.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
                className="w-full sm:w-1/2 text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="0105559999999"
              />
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between mt-4">
              <div>
                <span className="text-xs font-bold text-primary block">แพ็กเกจการใช้งานปัจจุบัน</span>
                <span className="text-[11px] text-ink-secondary">
                  Phatlada Premium — ใช้งานฟีเจอร์ครบทุกส่วนโดยไม่มีข้อจำกัด
                </span>
              </div>
              <span className="px-3 py-1 bg-primary text-white text-[11px] font-bold rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
        )}

        {/* Tab: Pricing & Promo Rates */}
        {activeTab === 'PRICING' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span>กำหนดราคาและโปรโมชั่นหน้าเว็บไซต์</span>
              </h2>
              <p className="text-xs text-ink-secondary mt-1">
                กำหนดราคาเริ่มต้น ส่วนลด และข้อความโปรโมชั่นที่แสดงบนหน้าแรก (Landing Page)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  ราคาห้องพักแอร์ รายเดือน (บาท / เดือน) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-ink-secondary">฿</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.landingStartingPrice ?? 3800}
                    onChange={(e) => handleChange('landingStartingPrice', Number(e.target.value))}
                    className="w-full text-xs pl-7 pr-3 py-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none font-semibold"
                    placeholder="3800"
                  />
                </div>
                <span className="text-[11px] text-ink-muted mt-1 block">ราคาห้องพักแอร์มาตรฐาน แบบรายเดือน</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  ราคาห้องพักแอร์ รายวัน (บาท / คืน) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-ink-secondary">฿</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={settings.landingDailyPrice ?? 500}
                    onChange={(e) => handleChange('landingDailyPrice', Number(e.target.value))}
                    className="w-full text-xs pl-7 pr-3 py-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none font-semibold"
                    placeholder="500"
                  />
                </div>
                <span className="text-[11px] text-ink-muted mt-1 block">ราคาห้องพักแอร์มาตรฐาน แบบรายวัน</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  ราคาปกติก่อนส่วนลดรายเดือน (บาท / เดือน)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-ink-secondary">฿</span>
                  <input
                    type="number"
                    min="0"
                    value={settings.landingOriginalPrice ?? 4500}
                    onChange={(e) => handleChange('landingOriginalPrice', Number(e.target.value))}
                    className="w-full text-xs pl-7 pr-3 py-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="4500"
                  />
                </div>
                <span className="text-[11px] text-ink-muted mt-1 block">ราคาขีดฆ่าเพื่อแสดงส่วนลด (เว้น 0 หากไม่ใช้)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                ข้อความโปรโมชั่น / สิทธิพิเศษ
              </label>
              <textarea
                rows={2}
                value={settings.landingPromoText ?? ''}
                onChange={(e) => handleChange('landingPromoText', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="เช่น โปรโมชั่นห้องใหม่: จองวันนี้รับส่วนลดค่าประกันและฟรี Wi-Fi ทันที"
              />
              <span className="text-[11px] text-ink-muted mt-1 block">
                จะแสดงพร้อมจุดไฟกระพริบสีเขียวใต้ราคาบนหน้า Landing Page
              </span>
            </div>

            {/* Live Preview of Price Cards */}
            <div className="p-4 bg-bg border border-line rounded-xl space-y-3 mt-4">
              <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider block">
                ตัวอย่างที่จะปรากฏบนหน้าแรก:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-surface rounded-lg border border-line">
                  <span className="text-[11px] text-ink-secondary block font-medium">ห้องแอร์มาตรฐาน (รายเดือน)</span>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-lg font-black text-ink font-prompt">
                      ฿{Number(settings.landingStartingPrice || 0).toLocaleString()}
                    </span>
                    {Number(settings.landingOriginalPrice) > 0 && (
                      <span className="text-xs text-ink-muted line-through">
                        ฿{Number(settings.landingOriginalPrice).toLocaleString()}
                      </span>
                    )}
                    <span className="text-[11px] text-ink-secondary">/ เดือน</span>
                  </div>
                </div>
                <div className="p-3 bg-surface rounded-lg border border-line">
                  <span className="text-[11px] text-ink-secondary block font-medium">ห้องแอร์มาตรฐาน (รายวัน)</span>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-lg font-black text-ink font-prompt">
                      ฿{Number(settings.landingDailyPrice || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-ink-secondary">/ วัน</span>
                  </div>
                </div>
              </div>
              {settings.landingPromoText && (
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-tone-green-solid">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tone-green-solid opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-tone-green-solid" />
                  </span>
                  <span>{settings.landingPromoText}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Billing & Utilities */}
        {activeTab === 'BILLING' && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>กำหนดอัตราค่าสาธารณูปโภคและรอบบิล</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">ค่าน้ำประปา (บาท / หน่วย) *</label>
                <input
                  type="number"
                  min="0"
                  value={settings.waterRatePerUnit}
                  onChange={(e) => handleChange('waterRatePerUnit', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">ค่าไฟฟ้า (บาท / หน่วย) *</label>
                <input
                  type="number"
                  min="0"
                  value={settings.electricRatePerUnit}
                  onChange={(e) => handleChange('electricRatePerUnit', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">ค่าส่วนกลาง (บาท / เดือน)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.commonFeeMonthly}
                  onChange={(e) => handleChange('commonFeeMonthly', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">วันที่ตัดรอบบิล (ทุกวันที่)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={settings.billingCycleDay}
                  onChange={(e) => handleChange('billingCycleDay', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">ครบกำหนดชำระ (ภายในวันที่)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={settings.dueDay}
                  onChange={(e) => handleChange('dueDay', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">ค่าปรับชำระล่าช้า (บาท / วัน)</label>
              <input
                type="number"
                min="0"
                value={settings.lateFeePerDay}
                onChange={(e) => handleChange('lateFeePerDay', Number(e.target.value))}
                className="w-full sm:w-1/2 text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Bank & Payment */}
        {activeTab === 'BANK' && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>ข้อมูลบัญชีรับชำระเงินค่าเช่า</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">ธนาคาร *</label>
              <select
                value={settings.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {THAI_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">เลขที่บัญชีธนาคาร</label>
                <input
                  type="text"
                  value={settings.bankAccountNumber}
                  onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="xxx-x-xxxxx-x"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">ชื่อเจ้าของบัญชี</label>
                <input
                  type="text"
                  value={settings.bankAccountName}
                  onChange={(e) => handleChange('bankAccountName', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="เช่น นายสมชาย ใจดี"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                หมายเลขพร้อมเพย์ (PromptPay ID)
              </label>
              <input
                type="text"
                value={settings.promptPayId}
                onChange={(e) => handleChange('promptPayId', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="เบอร์โทรศัพท์มือถือ หรือ เลขบัตรประจำตัวประชาชน"
              />
            </div>
          </div>
        )}

        {/* Tab 4: User Profile */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>ข้อมูลโปรไฟล์ผู้ใช้งาน</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">ชื่อที่แสดงในระบบ *</label>
              <input
                type="text"
                required
                value={settings.userDisplayName}
                onChange={(e) => handleChange('userDisplayName', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">อีเมลติดต่อ</label>
                <input
                  type="email"
                  value={settings.userEmail}
                  onChange={(e) => handleChange('userEmail', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="admin@phatlada.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">เบอร์โทรศัพท์ผู้ดูแล</label>
                <input
                  type="text"
                  value={settings.userPhone}
                  onChange={(e) => handleChange('userPhone', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="089-xxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">บทบาท / สิทธิ์การใช้งาน</label>
              <select
                value={settings.userRole}
                onChange={(e) =>
                  handleChange('userRole', e.target.value as 'OWNER' | 'MANAGER' | 'STAFF')
                }
                className="w-full sm:w-1/2 text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="OWNER">เจ้าของหอพัก (Owner) — สิทธิ์เต็มทุกส่วน</option>
                <option value="MANAGER">ผู้จัดการหอพัก (Manager)</option>
                <option value="STAFF">เจ้าหน้าที่ประจำหอพัก (Staff)</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 5: System, Notifications & Backup */}
        {activeTab === 'SYSTEM' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span>การตั้งค่าการแจ้งเตือน</span>
              </h2>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifyNewMaintenance}
                    onChange={(e) => handleChange('notifyNewMaintenance', e.target.checked)}
                    className="rounded border-line text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-semibold text-ink block">
                      แจ้งเตือนเมื่อมีรายการแจ้งซ่อมใหม่
                    </span>
                    <span className="text-[11px] text-ink-secondary">
                      แสดงการแจ้งเตือนบนแผงควบคุมเมื่อมีผู้เช่าแจ้งซ่อมอุปกรณ์
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifyPaymentReceived}
                    onChange={(e) => handleChange('notifyPaymentReceived', e.target.checked)}
                    className="rounded border-line text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-semibold text-ink block">
                      แจ้งเตือนเมื่อได้รับยอดชำระเงิน
                    </span>
                    <span className="text-[11px] text-ink-secondary">
                      แสดงการแจ้งเตือนเมื่อมีการบันทึกการชำระเงินค่าเช่า
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Backup & Data Management */}
            <div className="pt-4 border-t border-line space-y-4">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                <span>การสำรองและกู้คืนข้อมูล (Backup & Restore)</span>
              </h3>
              <p className="text-xs text-ink-secondary">
                คุณสามารถดาวน์โหลดไฟล์สำรองข้อมูล (JSON) เพื่อเก็บไว้ หรือนำเข้าไฟล์ที่สำรองไว้กลับคืนสู่ระบบได้ตลอดเวลา
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-ink bg-surface border border-line rounded-lg hover:border-line-dark shadow-xs transition"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>ดาวน์โหลดไฟล์สำรองข้อมูล (.JSON)</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-ink bg-surface border border-line rounded-lg hover:border-line-dark shadow-xs transition"
                >
                  <Upload className="h-3.5 w-3.5 text-primary" />
                  <span>นำเข้าไฟล์สำรองข้อมูล</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Reset Data */}
            <div className="pt-4 border-t border-line space-y-3">
              <h3 className="text-sm font-bold text-tone-red-solid flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>พื้นที่จัดการข้อมูลระบบ (Danger Zone)</span>
              </h3>
              <p className="text-xs text-ink-secondary">
                การรีเซ็ตระบบจะล้างข้อมูลห้องพัก ผู้เช่า สัญญาเช่า การชำระเงิน และข้อความทั้งหมดออกจากเครื่องของคุณ
              </p>

              <button
                type="button"
                onClick={() => setIsResetDialogOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-tone-red-solid bg-tone-red-soft hover:bg-tone-red-soft/80 rounded-lg transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>รีเซ็ตระบบและล้างข้อมูลทั้งหมด</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 7: Security & Session */}
        {activeTab === 'SECURITY' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-sm font-bold text-ink mb-1 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>ความปลอดภัยของระบบและการออกจากระบบอัตโนมัติ (Security & Session)</span>
              </h2>
              <p className="text-xs text-ink-secondary">
                จัดการมาตรการความปลอดภัยสำหรับเจ้าของหอพัก ตั้งเวลาออกจากระบบเมื่อไม่ได้ใช้งาน และป้องกันการสวมรอยเซสชัน/คุกกี้
              </p>
            </div>

            {/* Section 1: Auto Logout on Inactivity */}
            <div className="p-4 rounded-xl bg-surface border border-line space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-ink flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>ออกจากระบบอัตโนมัติเมื่อไม่มีการใช้งาน (Auto-Logout on Inactivity)</span>
                  </span>
                  <p className="text-xs text-ink-secondary">
                    เมื่อเปิดใช้งาน ระบบจะทำการตัดการเชื่อมต่อและออกจากระบบอัตโนมัติหากไม่มีการขยับเมาส์ คลิก หรือพิมพ์แป้นพิมพ์ภายในเวลาที่กำหนด
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={settings.autoLogoutEnabled}
                    onChange={(e) => handleChange('autoLogoutEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings.autoLogoutEnabled && (
                <div className="pt-3 border-t border-line/60 space-y-2">
                  <label className="block text-xs font-semibold text-ink">
                    เลือกระยะเวลาไม่มีการใช้งานก่อนออกจากระบบ:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { minutes: 15, label: '15 นาที', desc: 'ปลอดภัยสูงสุด' },
                      { minutes: 30, label: '30 นาที', desc: 'แนะนำทั่วไป' },
                      { minutes: 60, label: '1 ชั่วโมง', desc: 'ทำงานต่อเนื่อง' },
                      { minutes: 120, label: '2 ชั่วโมง', desc: 'ใช้งานบ่อย' },
                      { minutes: 240, label: '4 ชั่วโมง', desc: 'อยู่หน้าจอตลอด' },
                    ].map((opt) => (
                      <button
                        key={opt.minutes}
                        type="button"
                        onClick={() => handleChange('autoLogoutMinutes', opt.minutes)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          settings.autoLogoutMinutes === opt.minutes
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                            : 'border-line hover:border-line-dark text-ink bg-bg'
                        }`}
                      >
                        <span className="text-xs font-bold">{opt.label}</span>
                        <span className="text-[10px] text-ink-muted mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Session & Cookie Protection */}
            <div className="p-4 rounded-xl bg-surface border border-line space-y-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-ink flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>การป้องกันเซสชันและคุกกี้ (Anti-Session Hijacking & Cookie Protection)</span>
                </span>
                <p className="text-xs text-ink-secondary">
                  ป้องกันไม่ให้ผู้อื่นหรือผู้ไม่ประสงค์ดีคัดลอก Cookie หรือ Access Token ไปสวมรอยใช้งานต่อได้
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-line/60">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.clearCookiesOnLogout}
                    onChange={(e) => handleChange('clearCookiesOnLogout', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-line text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block">
                      ล้างคุกกี้และเพิกถอนเซสชันฝั่งเซิร์ฟเวอร์ทันทีเมื่อออกจากระบบ (แนะนำ)
                    </span>
                    <span className="text-[11px] text-ink-muted block mt-0.5">
                      เมื่อออกจากระบบ (ทั้งแบบกดเองหรือหมดเวลา) ระบบจะส่งคำสั่งไปยัง Supabase Auth เพื่อเพิกถอน Token ทันที และกวาดล้าง Cookie กับ Web Storage ทั้งหมดออกจากเครื่อง ทำให้ Token หรือ Cookie เดิมไม่สามารถนำมาใช้อนุมัติสิทธิ์ได้อีก
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-3 rounded-lg bg-tone-blue-soft/40 border border-tone-blue-solid/20 text-ink text-xs space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-tone-blue-solid">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>มาตรฐานความปลอดภัยที่เปิดใช้งานอยู่:</span>
                </span>
                <ul className="list-disc list-inside text-[11px] text-ink-secondary space-y-1 pl-1">
                  <li><strong>Server-Side Revocation:</strong> เพิกถอน Refresh Token บน Supabase ทันทีเมื่อ Logout</li>
                  <li><strong>Sanitize Web Storage:</strong> เคลียร์ LocalStorage, SessionStorage และ SecureStorage ทั้งหมด</li>
                  <li><strong>Zero-Trust Cookie Wipe:</strong> ล้างคุกกี้ทุก Path และทุก Domain ในบราวเซอร์</li>
                  <li><strong>Multi-Tab Sync:</strong> เมื่อออกจากระบบ แท็บอื่นทั้งหมดจะปิดเซสชันตามทันที</li>
                </ul>
              </div>
            </div>

            {/* Section 3: Force Sign Out All Devices */}
            <div className="pt-4 border-t border-line space-y-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <LogOut className="h-4 w-4 text-ink-secondary" />
                <span>จัดการเซสชันที่กำลังใช้งาน (Active Sessions)</span>
              </h3>
              <p className="text-xs text-ink-secondary">
                หากสงสัยว่ามีผู้อื่นเข้าใช้งานบัญชีของคุณ หรือต้องการออกจากระบบทันทีทุกเครื่อง สามารถตัดการเชื่อมต่อได้ทันที
              </p>

              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('คุณต้องการตัดการเชื่อมต่อและออกจากระบบทันทีใช่หรือไม่?')) {
                    await logout();
                    window.location.href = '/login';
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-tone-red-solid bg-tone-red-soft hover:bg-tone-red-soft/80 rounded-lg transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>ออกจากระบบทันทีและล้างคุกกี้ทั้งหมด (Force Sign Out)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleConfirmReset}
        title="ยืนยันการรีเซ็ตระบบ"
        message="คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตระบบและล้างข้อมูลทั้งหมด? การดำเนินการนี้จะลบข้อมูลที่บันทึกไว้ในเครื่องทั้งหมดและไม่สามารถเรียกคืนได้"
        confirmLabel="รีเซ็ตระบบ"
        isDestructive={true}
      />
    </div>
  );
};

