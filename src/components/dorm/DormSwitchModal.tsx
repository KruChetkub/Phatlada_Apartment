import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Dormitory } from '../../types/database';
import {
  fetchDormitories,
  createDormitory,
  getActiveDormitoryId,
  setActiveDormitoryId,
} from '../../services/dormService';
import { Building2, Check, Plus } from 'lucide-react';

interface DormSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitched: (dorm: Dormitory) => void;
}

export const DormSwitchModal: React.FC<DormSwitchModalProps> = ({
  isOpen,
  onClose,
  onSwitched,
}) => {
  const [dorms, setDorms] = useState<Dormitory[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [newDormName, setNewDormName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDormitories().then((list) => {
        setDorms(list);
        setActiveId(getActiveDormitoryId());
      });
      setIsCreating(false);
      setNewDormName('');
    }
  }, [isOpen]);

  const handleSelect = (dorm: Dormitory) => {
    setActiveDormitoryId(dorm.id);
    setActiveId(dorm.id);
    onSwitched(dorm);
    onClose();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDormName.trim()) return;
    try {
      setSaving(true);
      const created = await createDormitory({ name: newDormName });
      setDorms((prev) => [...prev, created]);
      setActiveId(created.id);
      onSwitched(created);
      onClose();
    } catch (err) {
      console.error('Failed to create dormitory:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="สลับการจัดการหอพัก (Multi-Dormitory)">
      <div className="space-y-4">
        <p className="text-xs text-ink-secondary">
          เลือกหอพักที่คุณต้องการดูข้อมูลและจัดการ หรือสร้างหอพักแห่งใหม่ในระบบ
        </p>

        {/* Dormitory List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {dorms.map((d) => {
            const isActive = d.id === activeId;
            return (
              <div
                key={d.id}
                onClick={() => handleSelect(d)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-line bg-surface hover:border-line-dark'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-primary text-white' : 'bg-bg text-ink-secondary'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink block">{d.name}</span>
                    <span className="text-[10px] text-ink-secondary">
                      แพ็กเกจ: <span className="text-primary font-semibold">{d.plan}</span>
                    </span>
                  </div>
                </div>

                {isActive && (
                  <span className="flex items-center text-xs font-semibold text-primary">
                    <Check className="h-4 w-4 mr-1" />
                    กำลังใช้งาน
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Dormitory Section */}
        {!isCreating ? (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 px-3 border border-dashed border-primary text-primary hover:bg-primary/5 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>เพิ่มหอพักแห่งใหม่</span>
          </button>
        ) : (
          <form onSubmit={handleCreateSubmit} className="p-3.5 bg-bg rounded-xl border border-line space-y-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">ชื่อหอพักใหม่ *</label>
              <input
                type="text"
                required
                value={newDormName}
                onChange={(e) => setNewDormName(e.target.value)}
                placeholder="เช่น หอพักสุขสบาย สาขา 2"
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-ink-secondary hover:text-ink transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saving || !newDormName.trim()}
                className="px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {saving ? 'กำลังบันทึก...' : 'สร้างหอพัก'}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-end pt-2 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-ink-secondary hover:text-ink transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </Modal>
  );
};

