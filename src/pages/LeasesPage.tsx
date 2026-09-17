import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Calendar, User, Home, AlertCircle } from 'lucide-react';
import { LeaseWithDetails, fetchLeases, createLease, updateLeaseStatus, deleteLease } from '../services/leaseService';
import { fetchRooms } from '../services/roomService';
import { fetchTenants } from '../services/tenantService';
import { Room, Tenant, LeaseStatus } from '../types/database';
import { formatRent, formatBaht, formatThaiDateShort, satangToBaht } from '../lib/format';
import { ThaiDatePicker } from '../components/common/ThaiDatePicker';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const LeasesPage: React.FC = () => {
  const [leases, setLeases] = useState<LeaseWithDetails[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().slice(0, 10);
  });
  const [rentBaht, setRentBaht] = useState(3500);
  const [depositBaht, setDepositBaht] = useState(7000);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lData, rData, tData] = await Promise.all([
        fetchLeases(),
        fetchRooms(),
        fetchTenants(),
      ]);
      setLeases(lData);
      setRooms(rData);
      setTenants(tData);

      if (rData.length > 0 && !selectedRoomId) {
        setSelectedRoomId(rData[0].id);
        setRentBaht(satangToBaht(rData[0].monthlyRent));
      }
      if (tData.length > 0 && !selectedTenantId) {
        setSelectedTenantId(tData[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    const found = rooms.find((r) => r.id === roomId);
    if (found) {
      setRentBaht(satangToBaht(found.monthlyRent));
      setDepositBaht(satangToBaht(found.monthlyRent) * 2);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !selectedTenantId) return;

    const room = rooms.find((r) => r.id === selectedRoomId);
    const tenant = tenants.find((t) => t.id === selectedTenantId);

    await createLease({
      roomId: selectedRoomId,
      tenantId: selectedTenantId,
      startDate,
      endDate,
      rent: rentBaht * 100, // satang
      deposit: depositBaht * 100, // satang
      roomNumber: room?.number,
      tenantName: tenant ? `${tenant.title}${tenant.firstName} ${tenant.lastName}` : undefined,
    });

    setIsAddModalOpen(false);
    await loadData();
  };

  const handleStatusChange = async (lease: LeaseWithDetails, nextStatus: LeaseStatus) => {
    await updateLeaseStatus(lease.id, lease.roomId, nextStatus);
    await loadData();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const lease = leases.find((l) => l.id === deletingId);
    await deleteLease(deletingId, lease?.roomId);
    setDeletingId(null);
    await loadData();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">จัดการสัญญาเช่า</h1>
          <p className="text-xs text-ink-secondary mt-1">
            สัญญาเช่าทั้งหมด {leases.length} ฉบับ
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>สร้างสัญญาเช่าใหม่</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-48 rounded-lg bg-surface animate-pulse border border-line" />
      ) : leases.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="ยังไม่มีสัญญาเช่า"
          description="สร้างสัญญาเช่าโดยจับคู่ห้องพักกับผู้เช่า กำหนดระยะเวลาสัญญาและค่าเช่า"
          actionLabel="สร้างสัญญาเช่าแรก"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leases.map((lease) => {
            const isActive = lease.status === 'ACTIVE';
            return (
              <div
                key={lease.id}
                className="rounded-lg bg-surface p-4 border border-line shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-tone-orange-soft text-tone-orange-solid">
                        <Home className="h-4 w-4" />
                      </div>
                      <span className="text-base font-bold text-ink">
                        ห้อง {lease.roomNumber || 'ห้องพัก'}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? 'bg-tone-green-soft text-tone-green-solid'
                          : 'bg-tone-gray-soft text-tone-gray-solid'
                      }`}
                    >
                      {isActive ? 'ใช้งานอยู่' : 'สิ้นสุดแล้ว'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-ink-secondary">
                    <div className="flex items-center space-x-1.5">
                      <User className="h-3.5 w-3.5 text-ink-muted" />
                      <span>{lease.tenantName || 'ผู้เช่า'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-ink-muted" />
                      <span>
                        {formatThaiDateShort(lease.startDate)} – {formatThaiDateShort(lease.endDate)}
                      </span>
                    </div>
                    <div className="pt-2 text-ink font-semibold">
                      ค่าเช่า: {formatRent(satangToBaht(lease.rent))} | เงินประกัน:{' '}
                      {formatBaht(satangToBaht(lease.deposit))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                  <button
                    onClick={() =>
                      handleStatusChange(lease, isActive ? 'ENDED' : 'ACTIVE')
                    }
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    {isActive ? 'สิ้นสุดสัญญา' : 'เปิดใช้งานอีกครั้ง'}
                  </button>

                  <button
                    onClick={() => setDeletingId(lease.id)}
                    className="p-1.5 text-ink-muted hover:text-tone-red-solid transition rounded-md hover:bg-bg"
                    title="ลบสัญญา"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Lease Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="สร้างสัญญาเช่าใหม่"
        maxWidth="max-w-lg"
      >
        {rooms.length === 0 || tenants.length === 0 ? (
          <div className="space-y-4 text-center py-4">
            <AlertCircle className="h-8 w-8 text-tone-orange-solid mx-auto" />
            <p className="text-xs text-ink-secondary">
              จำเป็นต้องมี <strong>ห้องพัก</strong> และ <strong>ผู้เช่า</strong> อย่างน้อย 1 รายการก่อนสร้างสัญญาเช่า
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  เลือกห้องพัก <span className="text-tone-red-solid">*</span>
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => handleRoomSelect(e.target.value)}
                  required
                  className="w-full h-9 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      ห้อง {r.number} ({r.status === 'OCCUPIED' ? 'มีผู้เช่า' : 'ว่าง'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  เลือกผู้เช่า <span className="text-tone-red-solid">*</span>
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  required
                  className="w-full h-9 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Thai Date Pickers */}
            <ThaiDatePicker
              label="วันเริ่มต้นสัญญา (พ.ศ.)"
              value={startDate}
              onChange={setStartDate}
              required
            />

            <ThaiDatePicker
              label="วันสิ้นสุดสัญญา (พ.ศ.)"
              value={endDate}
              onChange={setEndDate}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  ค่าเช่าต่อเดือน (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  required
                  value={rentBaht}
                  onChange={(e) => setRentBaht(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  เงินประกัน (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  required
                  value={depositBaht}
                  onChange={(e) => setDepositBaht(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>
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
                className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                สร้างสัญญา
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
        title="ลบสัญญาเช่า"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบสัญญาเช่านี้? ห้องพักจะถูกปรับสถานะเป็นห้องว่างโดยอัตโนมัติ"
      />
    </div>
  );
};
