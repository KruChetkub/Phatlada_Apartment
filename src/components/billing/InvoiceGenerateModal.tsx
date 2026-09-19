import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { ThaiDatePicker } from '../common/ThaiDatePicker';
import { Room, Lease, Tenant } from '../../types/database';
import { UtilityReading } from '../../types/billing';
import { createInvoice } from '../../services/billingService';
import { getLocalSettings } from '../../services/settingsService';
import { formatSatang } from '../../lib/format';
import { Receipt, FileText } from 'lucide-react';

interface InvoiceGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  leases: Lease[];
  tenants: Tenant[];
  readings: UtilityReading[];
  currentPeriod: string; // "YYYY-MM"
  onGenerated: () => void;
}

export const InvoiceGenerateModal: React.FC<InvoiceGenerateModalProps> = ({
  isOpen,
  onClose,
  rooms,
  leases,
  tenants,
  readings,
  currentPeriod,
  onGenerated,
}) => {
  const settings = useMemo(() => getLocalSettings(), []);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [otherFeeBaht, setOtherFeeBaht] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  // Compute default due date (next month at settings.dueDay)
  const computeDefaultDueDate = (period: string, dueDay: number) => {
    const [yearStr, monthStr] = period.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`;
  };

  const [dueDate, setDueDate] = useState<string>(() =>
    computeDefaultDueDate(currentPeriod, settings.dueDay || 5)
  );

  useEffect(() => {
    setDueDate(computeDefaultDueDate(currentPeriod, settings.dueDay || 5));
  }, [currentPeriod, settings.dueDay]);

  // Active leases map
  const activeLeases = useMemo(() => {
    return leases.filter((l) => l.status === 'ACTIVE');
  }, [leases]);

  // Occupied rooms or rooms with active leases
  const billableRooms = useMemo(() => {
    return rooms.filter((r) => activeLeases.some((l) => l.roomId === r.id));
  }, [rooms, activeLeases]);

  useEffect(() => {
    if (!selectedRoomId && billableRooms.length > 0) {
      setSelectedRoomId(billableRooms[0].id);
    }
  }, [selectedRoomId, billableRooms]);

  const currentRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

  const currentLease = useMemo(() => {
    return activeLeases.find((l) => l.roomId === selectedRoomId);
  }, [activeLeases, selectedRoomId]);

  const currentTenant = useMemo(() => {
    if (!currentLease) return null;
    return tenants.find((t) => t.id === currentLease.tenantId);
  }, [tenants, currentLease]);

  const currentReading = useMemo(() => {
    return readings.find((r) => r.roomId === selectedRoomId && r.period === currentPeriod);
  }, [readings, selectedRoomId, currentPeriod]);

  // Calculate bill amounts
  const rentSatang = currentLease?.rent ?? currentRoom?.monthlyRent ?? 0;

  const waterUnits = currentReading?.waterUnits ?? 0;
  const waterSatang = Math.round(waterUnits * settings.waterRatePerUnit * 100);

  const electricUnits = currentReading?.electricUnits ?? 0;
  const electricSatang = Math.round(electricUnits * settings.electricRatePerUnit * 100);

  const commonFeeSatang = Math.round(settings.commonFeeMonthly * 100);

  const totalSatang = rentSatang + waterSatang + electricSatang + commonFeeSatang + otherFeeBaht * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !currentRoom) return;

    const tenantName = currentTenant
      ? `${currentTenant.title}${currentTenant.firstName} ${currentTenant.lastName}`
      : 'ผู้เช่าห้องพัก';

    try {
      setSaving(true);
      await createInvoice({
        roomId: selectedRoomId,
        roomNumber: currentRoom.number,
        tenantId: currentTenant?.id || null,
        tenantName,
        tenantPhone: currentTenant?.phone || null,
        period: currentPeriod,
        rentSatang,
        waterPrev: currentReading?.prevWater ?? 0,
        waterCurr: currentReading?.currWater ?? 0,
        electricPrev: currentReading?.prevElectric ?? 0,
        electricCurr: currentReading?.currElectric ?? 0,
        commonFeeSatang,
        otherFeeSatang: otherFeeBaht * 100,
        dueDate,
      });
      onGenerated();
      onClose();
    } catch (err) {
      console.error('Failed to generate invoice:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ออกใบแจ้งหนี้ประจำเดือน (Invoice)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">เลือกห้องพักที่มีสัญญาเช่า *</label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            required
            className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {billableRooms.length === 0 ? (
              <option value="">-- ยังไม่มีห้องที่มีสัญญาเช่าที่เปิดใช้งาน --</option>
            ) : (
              billableRooms.map((r) => {
                const lease = activeLeases.find((l) => l.roomId === r.id);
                const tenant = tenants.find((t) => t.id === lease?.tenantId);
                return (
                  <option key={r.id} value={r.id}>
                    ห้อง {r.number} — {tenant ? `${tenant.title}${tenant.firstName} ${tenant.lastName}` : 'ผู้เช่า'}
                  </option>
                );
              })
            )}
          </select>
        </div>

        <div>
          <ThaiDatePicker
            label="กำหนดชำระเงินภายในวันที่ (พ.ศ.)"
            value={dueDate}
            onChange={setDueDate}
            required
          />
          <span className="text-[11px] text-ink-secondary mt-1 block">
            (ค่าเริ่มต้น: วันที่ {settings.dueDay || 5} ของเดือนถัดไป หรือปรับเปลี่ยนตามต้องการได้)
          </span>
        </div>

        {/* Calculation Breakdown Preview */}
        <div className="p-4 bg-bg rounded-xl border border-line space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Receipt className="h-4 w-4 text-primary" />
              <span>สรุปรายการเรียกเก็บประจำเดือน ({currentPeriod})</span>
            </span>
            <span className="text-xs font-semibold text-primary">
              ห้อง {currentRoom?.number || '-'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-secondary">
              <span>ค่าเช่าห้องพัก:</span>
              <span className="font-semibold text-ink">{formatSatang(rentSatang)}</span>
            </div>

            <div className="flex justify-between text-ink-secondary">
              <span>
                ค่าน้ำ ({waterUnits} หน่วย @ {settings.waterRatePerUnit} บ.):
              </span>
              <span className="font-semibold text-ink">{formatSatang(waterSatang)}</span>
            </div>

            <div className="flex justify-between text-ink-secondary">
              <span>
                ค่าไฟฟ้า ({electricUnits} หน่วย @ {settings.electricRatePerUnit} บ.):
              </span>
              <span className="font-semibold text-ink">{formatSatang(electricSatang)}</span>
            </div>

            <div className="flex justify-between text-ink-secondary">
              <span>ค่าบริการส่วนกลาง:</span>
              <span className="font-semibold text-ink">{formatSatang(commonFeeSatang)}</span>
            </div>

            <div className="flex items-center justify-between text-ink-secondary pt-1">
              <span>ค่าบริการอื่นๆ / ปรับยอด (บาท):</span>
              <input
                type="number"
                value={otherFeeBaht}
                onChange={(e) => setOtherFeeBaht(Number(e.target.value))}
                className="w-24 text-right text-xs p-1 rounded border border-line bg-surface text-ink"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-line flex justify-between items-center text-sm font-bold text-ink">
            <span>ยอดรวมทั้งสิ้น:</span>
            <span className="text-primary text-base font-bold">{formatSatang(totalSatang)}</span>
          </div>
        </div>

        {!currentReading && (
          <p className="text-[11px] text-tone-amber-solid bg-tone-amber-soft p-2.5 rounded-lg">
            ⚠️ ยังไม่ได้บันทึกมิเตอร์น้ำ-ไฟประจำเดือนนี้สำหรับห้องนี้ (ค่าน้ำ-ไฟจะเป็น 0 บาท)
          </p>
        )}

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
            disabled={saving || billableRooms.length === 0}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span>{saving ? 'กำลังออกบิล...' : 'สร้างใบแจ้งหนี้'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
