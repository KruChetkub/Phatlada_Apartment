import React, { useEffect, useState } from 'react';
import { Wrench, Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  MaintenanceWithRoom,
  fetchMaintenance,
  createMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
} from '../services/maintenanceService';
import { fetchRooms } from '../services/roomService';
import { Room, MaintenanceStatus } from '../types/database';
import { formatThaiDateShort, formatThaiTime } from '../lib/format';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

const STATUS_LABELS: Record<
  MaintenanceStatus,
  { label: string; bg: string; text: string }
> = {
  PENDING: { label: 'รอรับเรื่อง', bg: 'bg-tone-orange-soft', text: 'text-tone-orange-solid' },
  IN_PROGRESS: { label: 'กำลังดำเนินการ', bg: 'bg-tone-blue-soft', text: 'text-tone-blue-solid' },
  DONE: { label: 'เสร็จสิ้น', bg: 'bg-tone-green-soft', text: 'text-tone-green-solid' },
  CANCELLED: { label: 'ยกเลิก', bg: 'bg-tone-gray-soft', text: 'text-tone-gray-solid' },
};

export const MaintenancePage: React.FC = () => {
  const [tickets, setTickets] = useState<MaintenanceWithRoom[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [mList, rList] = await Promise.all([fetchMaintenance(), fetchRooms()]);
      setTickets(mList);
      setRooms(rList);
      if (rList.length > 0 && !selectedRoomId) {
        setSelectedRoomId(rList[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !ticketTitle.trim()) return;

    const room = rooms.find((r) => r.id === selectedRoomId);

    await createMaintenance({
      roomId: selectedRoomId,
      title: ticketTitle.trim(),
      roomNumber: room?.number,
    });

    setIsAddModalOpen(false);
    setTicketTitle('');
    await loadData();
  };

  const handleStatusChange = async (id: string, status: MaintenanceStatus) => {
    await updateMaintenanceStatus(id, status);
    await loadData();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMaintenance(deletingId);
    setDeletingId(null);
    await loadData();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">แจ้งซ่อมและบำรุงรักษา</h1>
          <p className="text-xs text-ink-secondary mt-1">
            รายการแจ้งซ่อมทั้งหมด {tickets.length} รายการ
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-1.5 rounded-md bg-tone-purple-solid px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>แจ้งซ่อมใหม่</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-48 rounded-lg bg-surface animate-pulse border border-line" />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="ยังไม่มีรายการแจ้งซ่อม"
          description="เมื่อมีอุปกรณ์หรือส่วนชำรุด สามารถสร้างรายการแจ้งซ่อมเพื่อติดตามการดำเนินงานได้"
          actionLabel="สร้างรายการแจ้งซ่อมแรก"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t) => {
            const statusConfig = STATUS_LABELS[t.status] || STATUS_LABELS.PENDING;

            return (
              <div
                key={t.id}
                className="rounded-lg bg-surface p-4 border border-line shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold text-ink">
                      ห้อง {t.roomNumber || 'ห้องพัก'}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-ink leading-snug">
                    {t.title}
                  </h3>

                  <div className="mt-3 flex items-center space-x-1 text-xs text-ink-muted">
                    <Clock className="h-3 w-3" />
                    <span>
                      แจ้งเมื่อ {formatThaiDateShort(t.createdAt)}{' '}
                      {formatThaiTime(t.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                  {/* Status update buttons */}
                  <div className="flex items-center space-x-1">
                    {t.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusChange(t.id, 'IN_PROGRESS')}
                        className="rounded bg-tone-blue-soft px-2 py-1 text-[11px] font-semibold text-tone-blue-solid hover:opacity-80"
                      >
                        รับเรื่อง
                      </button>
                    )}
                    {t.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleStatusChange(t.id, 'DONE')}
                        className="rounded bg-tone-green-soft px-2 py-1 text-[11px] font-semibold text-tone-green-solid hover:opacity-80 flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>เสร็จสิ้น</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setDeletingId(t.id)}
                    className="p-1.5 text-ink-muted hover:text-tone-red-solid transition rounded-md hover:bg-bg"
                    title="ลบรายการ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="สร้างรายการแจ้งซ่อมใหม่"
      >
        {rooms.length === 0 ? (
          <div className="text-center py-4 space-y-2">
            <AlertCircle className="h-7 w-7 text-tone-orange-solid mx-auto" />
            <p className="text-xs text-ink-secondary">
              กรุณาเพิ่มห้องพักก่อนสร้างรายการแจ้งซ่อม
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                เลือกห้องพัก <span className="text-tone-red-solid">*</span>
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                required
                className="w-full h-9 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    ห้อง {r.number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                รายละเอียดปัญหา <span className="text-tone-red-solid">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                placeholder="เช่น น้ำรั่วในห้องน้ำ, เครื่องปรับอากาศไม่เย็น"
                className="w-full rounded-md border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md border border-line px-3 py-1.5 text-xs text-ink hover:bg-bg"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="rounded-md bg-tone-purple-solid px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                บันทึกการแจ้งซ่อม
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="ลบรายการแจ้งซ่อม"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการแจ้งซ่อมนี้?"
      />
    </div>
  );
};
