import React, { useEffect, useState, useMemo } from 'react';
import { BedDouble, Plus, Trash2, Edit2, CheckCircle2, CircleDashed } from 'lucide-react';
import { Room, RoomStatus } from '../types/database';
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../services/roomService';
import { formatRent, satangToBaht } from '../lib/format';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | RoomStatus>('ALL');
  const [filterFloor, setFilterFloor] = useState<number | 'ALL'>('ALL');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  // Form states
  const [formNumber, setFormNumber] = useState('');
  const [formFloor, setFormFloor] = useState(1);
  const [formRentBaht, setFormRentBaht] = useState(3500);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchRooms();
      setRooms(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setFormNumber('');
    setFormFloor(1);
    setFormRentBaht(3500);
    setIsAddModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormNumber(room.number);
    setFormFloor(room.floor);
    setFormRentBaht(satangToBaht(room.monthlyRent));
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNumber.trim()) return;

    if (editingRoom) {
      await updateRoom(editingRoom.id, {
        number: formNumber.trim(),
        floor: formFloor,
        monthlyRent: formRentBaht * 100, // satang
      });
      setEditingRoom(null);
    } else {
      await createRoom({
        number: formNumber.trim(),
        floor: formFloor,
        monthlyRent: formRentBaht * 100,
        status: 'VACANT',
      });
      setIsAddModalOpen(false);
    }
    await loadData();
  };

  const handleToggleStatus = async (room: Room) => {
    const nextStatus: RoomStatus = room.status === 'OCCUPIED' ? 'VACANT' : 'OCCUPIED';
    await updateRoom(room.id, { status: nextStatus });
    await loadData();
  };

  const handleDelete = async () => {
    if (!deletingRoomId) return;
    await deleteRoom(deletingRoomId);
    setDeletingRoomId(null);
    await loadData();
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
      const matchFloor = filterFloor === 'ALL' || r.floor === filterFloor;
      return matchStatus && matchFloor;
    });
  }, [rooms, filterStatus, filterFloor]);

  const uniqueFloors = useMemo(() => {
    return Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);
  }, [rooms]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">จัดการห้องพัก</h1>
          <p className="text-xs text-ink-secondary mt-1">
            รายการห้องพักทั้งหมด {rooms.length} ห้อง
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มห้องพักใหม่</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      {rooms.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-surface p-3.5 rounded-lg border border-line shadow-card">
          <span className="text-xs font-medium text-ink-secondary">ตัวกรอง:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'ALL' | RoomStatus)}
            className="h-8 rounded-md border border-line bg-bg px-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="VACANT">ห้องว่าง</option>
            <option value="OCCUPIED">มีผู้เช่า</option>
          </select>

          {uniqueFloors.length > 1 && (
            <select
              value={filterFloor}
              onChange={(e) =>
                setFilterFloor(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))
              }
              className="h-8 rounded-md border border-line bg-bg px-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">ทุกชั้น</option>
              {uniqueFloors.map((f) => (
                <option key={f} value={f}>
                  ชั้น {f}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="h-48 rounded-lg bg-surface animate-pulse border border-line" />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="ยังไม่มีข้อมูลห้องพัก"
          description="เริ่มต้นสร้างห้องพักในหอพักของคุณ เพื่อเริ่มทำสัญญาเช่าและจัดเก็บข้อมูล"
          actionLabel="เพิ่มห้องพักแรกของคุณ"
          onAction={openAddModal}
        />
      ) : filteredRooms.length === 0 ? (
        <div className="p-8 text-center text-xs text-ink-muted bg-surface rounded-lg border border-line">
          ไม่พบห้องพักตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const isOccupied = room.status === 'OCCUPIED';
            return (
              <div
                key={room.id}
                className="group relative rounded-lg bg-surface p-4 border border-line shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-lg font-bold text-ink leading-none">
                      ห้อง {room.number}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(room)}
                      className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition ${
                        isOccupied
                          ? 'bg-tone-green-soft text-tone-green-solid hover:opacity-80'
                          : 'bg-tone-blue-soft text-tone-blue-solid hover:opacity-80'
                      }`}
                      title="คลิกเพื่อเปลี่ยนสถานะ"
                    >
                      {isOccupied ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>มีผู้เช่า</span>
                        </>
                      ) : (
                        <>
                          <CircleDashed className="h-3 w-3" />
                          <span>ว่าง</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-ink-muted">
                    ชั้น {room.floor} · {formatRent(satangToBaht(room.monthlyRent))}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(room)}
                    className="p-1.5 text-ink-muted hover:text-primary transition rounded-md hover:bg-bg"
                    title="แก้ไข"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingRoomId(room.id)}
                    className="p-1.5 text-ink-muted hover:text-tone-red-solid transition rounded-md hover:bg-bg"
                    title="ลบ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || editingRoom !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRoom(null);
        }}
        title={editingRoom ? `แก้ไขห้อง ${editingRoom.number}` : 'เพิ่มห้องพักใหม่'}
      >
        <form onSubmit={handleSaveRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              เลขห้อง <span className="text-tone-red-solid">*</span>
            </label>
            <input
              type="text"
              required
              value={formNumber}
              onChange={(e) => setFormNumber(e.target.value)}
              placeholder="เช่น 101, 202"
              className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                ชั้น
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={formFloor}
                onChange={(e) => setFormFloor(parseInt(e.target.value, 10) || 1)}
                className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                ค่าเช่า (บาท/เดือน)
              </label>
              <input
                type="number"
                step="any"
                min={0}
                required
                value={formRentBaht}
                onChange={(e) => setFormRentBaht(parseFloat(e.target.value) || 0)}
                className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoom(null);
              }}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-ink hover:bg-bg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              บันทึก
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingRoomId !== null}
        onClose={() => setDeletingRoomId(null)}
        onConfirm={handleDelete}
        title="ลบห้องพัก"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบห้องพักนี้? การดำเนินการนี้ไม่สามารถเรียกคืนได้"
        confirmLabel="ยืนยันการลบ"
      />
    </div>
  );
};
