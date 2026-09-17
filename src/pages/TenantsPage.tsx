import React, { useEffect, useState } from 'react';
import { Users, Plus, Trash2, Edit2, Phone } from 'lucide-react';
import { Tenant, Gender } from '../types/database';
import { fetchTenants, createTenant, updateTenant, deleteTenant } from '../services/tenantService';
import { getAvatarInitial, formatThaiDateShort } from '../lib/format';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Edit state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('นาย');
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formGender, setFormGender] = useState<Gender>('MALE');
  const [formPhone, setFormPhone] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchTenants();
      setTenants(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setFormTitle('นาย');
    setFormFirstName('');
    setFormLastName('');
    setFormGender('MALE');
    setFormPhone('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (t: Tenant) => {
    setEditingTenant(t);
    setFormTitle(t.title);
    setFormFirstName(t.firstName);
    setFormLastName(t.lastName);
    setFormGender(t.gender);
    setFormPhone(t.phone || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName.trim() || !formLastName.trim()) return;

    if (editingTenant) {
      await updateTenant(editingTenant.id, {
        title: formTitle,
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        gender: formGender,
        phone: formPhone.trim() || undefined,
      });
      setEditingTenant(null);
    } else {
      await createTenant({
        title: formTitle,
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        gender: formGender,
        phone: formPhone.trim() || undefined,
      });
      setIsAddModalOpen(false);
    }
    await loadData();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteTenant(deletingId);
    setDeletingId(null);
    await loadData();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">จัดการผู้เช่า</h1>
          <p className="text-xs text-ink-secondary mt-1">
            ผู้เช่าทั้งหมด {tenants.length} คน
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มผู้เช่าใหม่</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-48 rounded-lg bg-surface animate-pulse border border-line" />
      ) : tenants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="ยังไม่มีข้อมูลผู้เช่า"
          description="บันทึกข้อมูลผู้เช่าเพื่อเริ่มต้นทำสัญญาเช่าและติดตามการชำระเงิน"
          actionLabel="เพิ่มผู้เช่าคนแรก"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => {
            const initial = getAvatarInitial(`${tenant.title}${tenant.firstName}`);
            return (
              <div
                key={tenant.id}
                className="rounded-lg bg-surface p-4 border border-line shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tone-blue-soft text-tone-blue-solid font-semibold text-sm">
                    {initial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-ink truncate">
                      {tenant.title}
                      {tenant.firstName} {tenant.lastName}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-ink-muted">
                      <span className="rounded bg-bg px-1.5 py-0.5 text-[10px]">
                        {tenant.gender === 'MALE'
                          ? 'ชาย'
                          : tenant.gender === 'FEMALE'
                          ? 'หญิง'
                          : 'ไม่ระบุ'}
                      </span>
                      <span>ลงทะเบียนเมื่อ {formatThaiDateShort(tenant.createdAt)}</span>
                    </div>

                    {tenant.phone && (
                      <div className="mt-2 flex items-center space-x-1.5 text-xs text-ink-secondary">
                        <Phone className="h-3 w-3 text-ink-muted" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(tenant)}
                    className="p-1.5 text-ink-muted hover:text-primary transition rounded-md hover:bg-bg"
                    title="แก้ไขข้อมูล"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(tenant.id)}
                    className="p-1.5 text-ink-muted hover:text-tone-red-solid transition rounded-md hover:bg-bg"
                    title="ลบข้อมูล"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || editingTenant !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTenant(null);
        }}
        title={editingTenant ? 'แก้ไขข้อมูลผู้เช่า' : 'เพิ่มผู้เช่าใหม่'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                คำนำหน้า
              </label>
              <select
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full h-9 rounded-md border border-line bg-surface px-2 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="นาย">นาย</option>
                <option value="น.ส.">น.ส.</option>
                <option value="นาง">นาง</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                ชื่อจริง <span className="text-tone-red-solid">*</span>
              </label>
              <input
                type="text"
                required
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
                className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              นามสกุล <span className="text-tone-red-solid">*</span>
            </label>
            <input
              type="text"
              required
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
              className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                เพศ
              </label>
              <select
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as Gender)}
                className="w-full h-9 rounded-md border border-line bg-surface px-2 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="MALE">ชาย</option>
                <option value="FEMALE">หญิง</option>
                <option value="UNSPECIFIED">ไม่ระบุ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="08x-xxx-xxxx"
                className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingTenant(null);
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
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="ลบข้อมูลผู้เช่า"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้เช่าคนนี้?"
      />
    </div>
  );
};
