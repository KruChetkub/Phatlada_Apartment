import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Room } from '../../types/database';
import { saveUtilityReading, getLatestReadingForRoom } from '../../services/billingService';
import { Droplets, Zap, Check } from 'lucide-react';

interface MeterRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  currentPeriod: string; // "YYYY-MM"
  onSaved: () => void;
}

export const MeterRecordModal: React.FC<MeterRecordModalProps> = ({
  isOpen,
  onClose,
  rooms,
  currentPeriod,
  onSaved,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [prevWater, setPrevWater] = useState<number>(0);
  const [currWater, setCurrWater] = useState<number>(0);
  const [prevElectric, setPrevElectric] = useState<number>(0);
  const [currElectric, setCurrElectric] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  // Auto-fill previous readings when room changes
  useEffect(() => {
    if (!selectedRoomId) {
      if (rooms.length > 0) setSelectedRoomId(rooms[0].id);
      return;
    }
    async function loadPrev() {
      const latest = await getLatestReadingForRoom(selectedRoomId);
      if (latest) {
        setPrevWater(latest.currWater);
        setCurrWater(latest.currWater);
        setPrevElectric(latest.currElectric);
        setCurrElectric(latest.currElectric);
      } else {
        setPrevWater(0);
        setCurrWater(0);
        setPrevElectric(0);
        setCurrElectric(0);
      }
    }
    loadPrev();
  }, [selectedRoomId, rooms]);

  const waterUnits = Math.max(0, currWater - prevWater);
  const electricUnits = Math.max(0, currElectric - prevElectric);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    const targetRoom = rooms.find((r) => r.id === selectedRoomId);
    try {
      setSaving(true);
      await saveUtilityReading({
        roomId: selectedRoomId,
        roomNumber: targetRoom?.number,
        period: currentPeriod,
        prevWater,
        currWater,
        prevElectric,
        currElectric,
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error('Failed to save meter reading:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="จดมิเตอร์น้ำ - ไฟฟ้าประจำเดือน">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">เลือกห้องพัก *</label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            required
            className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                ห้อง {r.number} (ชั้น {r.floor}) — {r.status === 'OCCUPIED' ? 'มีผู้เช่า' : 'ห้องว่าง'}
              </option>
            ))}
          </select>
        </div>

        {/* Water Meter Section */}
        <div className="p-3.5 bg-tone-blue-soft/30 rounded-xl border border-tone-blue-solid/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tone-blue-solid flex items-center gap-1.5">
              <Droplets className="h-4 w-4" />
              <span>มิเตอร์น้ำประปา</span>
            </span>
            <span className="text-xs font-semibold text-tone-blue-solid bg-tone-blue-soft px-2 py-0.5 rounded-md">
              ใช้ไป {waterUnits} หน่วย
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-ink-secondary mb-1">เลขมิเตอร์ครั้งก่อน</label>
              <input
                type="number"
                step="any"
                min="0"
                value={prevWater}
                onChange={(e) => setPrevWater(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-ink-secondary mb-1">เลขมิเตอร์ครั้งนี้ *</label>
              <input
                type="number"
                step="any"
                min={prevWater}
                value={currWater}
                onChange={(e) => setCurrWater(Number(e.target.value))}
                required
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Electricity Meter Section */}
        <div className="p-3.5 bg-tone-amber-soft/30 rounded-xl border border-tone-amber-solid/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tone-amber-solid flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>มิเตอร์ไฟฟ้า</span>
            </span>
            <span className="text-xs font-semibold text-tone-amber-solid bg-tone-amber-soft px-2 py-0.5 rounded-md">
              ใช้ไป {electricUnits} หน่วย
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-ink-secondary mb-1">เลขมิเตอร์ครั้งก่อน</label>
              <input
                type="number"
                step="any"
                min="0"
                value={prevElectric}
                onChange={(e) => setPrevElectric(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-ink-secondary mb-1">เลขมิเตอร์ครั้งนี้ *</label>
              <input
                type="number"
                step="any"
                min={prevElectric}
                value={currElectric}
                onChange={(e) => setCurrElectric(Number(e.target.value))}
                required
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>{saving ? 'กำลังบันทึก...' : 'บันทึกมิเตอร์'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
