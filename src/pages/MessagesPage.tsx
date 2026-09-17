import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Megaphone,
  User,
  Home,
  Send,
  MailCheck,
  Mail,
} from 'lucide-react';
import {
  fetchMessages,
  createMessage,
  toggleMessageRead,
  deleteMessage,
} from '../services/messageService';
import { fetchRooms } from '../services/roomService';
import { fetchTenants } from '../services/tenantService';
import { MessageItem, Room, Tenant, MessageRecipientType, MessagePriority } from '../types/database';
import {
  formatThaiDateLong,
  formatThaiTime,
  formatRelativeTh,
} from '../lib/format';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

type TabType = 'ALL' | 'ANNOUNCEMENT' | 'DIRECT' | 'UNREAD';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Message Form State
  const [recipientType, setRecipientType] = useState<MessageRecipientType>('ALL');
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<MessagePriority>('NORMAL');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [msgList, rList, tList] = await Promise.all([
        fetchMessages(),
        fetchRooms(),
        fetchTenants(),
      ]);
      setMessages(msgList);
      setRooms(rList);
      setTenants(tList);
    } catch (err) {
      console.error('Failed to load messages data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistics
  const stats = useMemo(() => {
    const total = messages.length;
    const announcements = messages.filter((m) => m.recipientType === 'ALL').length;
    const direct = messages.filter((m) => m.recipientType !== 'ALL').length;
    const unread = messages.filter((m) => !m.isRead).length;
    return { total, announcements, direct, unread };
  }, [messages]);

  // Filtered list
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Tab filter
      if (activeTab === 'ANNOUNCEMENT' && m.recipientType !== 'ALL') return false;
      if (activeTab === 'DIRECT' && m.recipientType === 'ALL') return false;
      if (activeTab === 'UNREAD' && m.isRead) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchContent = m.content.toLowerCase().includes(q);
        const matchRecipient = (m.recipientName || '').toLowerCase().includes(q);
        const matchSender = m.senderName.toLowerCase().includes(q);
        return matchTitle || matchContent || matchRecipient || matchSender;
      }
      return true;
    });
  }, [messages, activeTab, searchQuery]);

  const handleOpenCreate = () => {
    setRecipientType('ALL');
    setRecipientId('');
    setTitle('');
    setContent('');
    setPriority('NORMAL');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let recipientName: string | null = null;
    if (recipientType === 'ROOM') {
      const targetRoom = rooms.find((r) => r.id === recipientId);
      recipientName = targetRoom ? `ห้อง ${targetRoom.number}` : null;
    } else if (recipientType === 'TENANT') {
      const targetTenant = tenants.find((t) => t.id === recipientId);
      recipientName = targetTenant
        ? `${targetTenant.title}${targetTenant.firstName} ${targetTenant.lastName}`
        : null;
    }

    try {
      setSubmitting(true);
      const created = await createMessage({
        recipientType,
        recipientId: recipientId || null,
        recipientName,
        title,
        content,
        priority,
      });
      setMessages((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await toggleMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: !prev.isRead } : null));
      }
    } catch (err) {
      console.error('Failed to toggle message read:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMessage(deleteConfirmId);
      setMessages((prev) => prev.filter((m) => m.id !== deleteConfirmId));
      if (selectedMessage && selectedMessage.id === deleteConfirmId) {
        setSelectedMessage(null);
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>กล่องข้อความและประกาศ</span>
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            สื่อสารกับผู้เช่า ส่งประกาศทั่วไป หรือแจ้งเตือนข่าวสารประจำหอพัก
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>สร้างข้อความ / ประกาศ</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-primary/5 border-primary shadow-xs'
              : 'bg-surface border-line hover:border-line-dark'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">ข้อความทั้งหมด</span>
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-ink mt-2">{stats.total}</p>
        </div>

        <div
          onClick={() => setActiveTab('ANNOUNCEMENT')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeTab === 'ANNOUNCEMENT'
              ? 'bg-purple-50 border-purple-400 shadow-xs'
              : 'bg-surface border-line hover:border-line-dark'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">ประกาศทั่วไป</span>
            <Megaphone className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-ink mt-2">{stats.announcements}</p>
        </div>

        <div
          onClick={() => setActiveTab('DIRECT')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeTab === 'DIRECT'
              ? 'bg-tone-blue-soft border-tone-blue-solid shadow-xs'
              : 'bg-surface border-line hover:border-line-dark'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">ข้อความถึงผู้เช่า</span>
            <User className="h-4 w-4 text-tone-blue-solid" />
          </div>
          <p className="text-2xl font-bold text-ink mt-2">{stats.direct}</p>
        </div>

        <div
          onClick={() => setActiveTab('UNREAD')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            activeTab === 'UNREAD'
              ? 'bg-tone-red-soft border-tone-red-solid shadow-xs'
              : 'bg-surface border-line hover:border-line-dark'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-secondary">ยังไม่อ่าน</span>
            <Mail className="h-4 w-4 text-tone-red-solid" />
          </div>
          <p className="text-2xl font-bold text-tone-red-solid mt-2">{stats.unread}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-line">
        {/* Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            ทั้งหมด ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('ANNOUNCEMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'ANNOUNCEMENT'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            ประกาศทั่วไป ({stats.announcements})
          </button>
          <button
            onClick={() => setActiveTab('DIRECT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'DIRECT'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            เฉพาะผู้เช่า ({stats.direct})
          </button>
          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === 'UNREAD'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            ยังไม่อ่าน ({stats.unread})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-secondary" />
          <input
            type="text"
            placeholder="ค้นหาข้อความ, ผู้รับ, ผู้ส่ง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-ink"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-12 text-center text-ink-secondary text-sm">กำลังโหลดข้อมูล...</div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={searchQuery ? 'ไม่พบข้อความที่ตรงกับการค้นหา' : 'ยังไม่มีข้อความหรือประกาศ'}
          description={
            searchQuery
              ? 'ลองค้นหาด้วยคำอื่น หรือล้างคำค้นหาเพื่อดูข้อความทั้งหมด'
              : 'เริ่มต้นสร้างประกาศทั่วไป หรือส่งข้อความแจ้งเตือนถึงผู้เช่าได้ที่นี่'
          }
          actionLabel="สร้างข้อความใหม่"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                msg.isRead
                  ? 'bg-surface border-line hover:border-primary/40'
                  : 'bg-primary/[0.03] border-primary/30 shadow-xs hover:border-primary'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0">
                {/* Unread indicator */}
                <div className="pt-1 flex-shrink-0">
                  {msg.isRead ? (
                    <MailCheck className="h-4 w-4 text-ink-secondary opacity-60" />
                  ) : (
                    <div className="relative">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-tone-red-solid" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    {msg.priority === 'URGENT' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-tone-red-soft text-tone-red-solid">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        ด่วน
                      </span>
                    )}
                    {msg.recipientType === 'ALL' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700">
                        <Megaphone className="h-3 w-3 mr-1" />
                        ประกาศทั่วไป
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-tone-blue-soft text-tone-blue-solid">
                        {msg.recipientType === 'ROOM' ? (
                          <Home className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {msg.recipientName || 'ผู้เช่า'}
                      </span>
                    )}
                    <span className="text-[11px] text-ink-secondary">
                      ส่งโดย {msg.senderName}
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <h3 className={`text-sm font-semibold truncate ${msg.isRead ? 'text-ink' : 'text-primary'}`}>
                    {msg.title}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-0.5 line-clamp-1">
                    {msg.content}
                  </p>
                </div>
              </div>

              {/* Date & Actions */}
              <div className="flex items-center justify-between sm:justify-end space-x-3 self-end sm:self-auto flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line/60">
                <span className="text-[11px] text-ink-secondary">
                  {formatRelativeTh(msg.createdAt)}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => handleToggleRead(msg.id, e)}
                    title={msg.isRead ? 'ทำเครื่องหมายว่ายังไม่อ่าน' : 'ทำเครื่องหมายว่าอ่านแล้ว'}
                    className="p-1.5 rounded-lg text-ink-secondary hover:text-primary hover:bg-surface-secondary transition"
                  >
                    <CheckCircle2 className={`h-4 w-4 ${msg.isRead ? 'text-tone-green-solid' : 'text-ink-secondary'}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(msg.id);
                    }}
                    title="ลบข้อความ"
                    className="p-1.5 rounded-lg text-ink-secondary hover:text-tone-red-solid hover:bg-tone-red-soft transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Message / Announcement */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="สร้างข้อความ / ประกาศใหม่"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">ประเภทผู้รับ</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecipientType('ALL');
                  setRecipientId('');
                }}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium transition ${
                  recipientType === 'ALL'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-line text-ink-secondary hover:border-line-dark'
                }`}
              >
                ประกาศทั่วไป
              </button>
              <button
                type="button"
                onClick={() => setRecipientType('ROOM')}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium transition ${
                  recipientType === 'ROOM'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-line text-ink-secondary hover:border-line-dark'
                }`}
              >
                ระบุห้องพัก
              </button>
              <button
                type="button"
                onClick={() => setRecipientType('TENANT')}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium transition ${
                  recipientType === 'TENANT'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-line text-ink-secondary hover:border-line-dark'
                }`}
              >
                ระบุผู้เช่า
              </button>
            </div>
          </div>

          {/* Conditional Dropdown for Room / Tenant */}
          {recipientType === 'ROOM' && (
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">เลือกห้องพัก *</label>
              <select
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">-- กรุณาเลือกห้องพัก --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    ห้อง {r.number} (ชั้น {r.floor})
                  </option>
                ))}
              </select>
            </div>
          )}

          {recipientType === 'TENANT' && (
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">เลือกผู้เช่า *</label>
              <select
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">-- กรุณาเลือกผู้เช่า --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}{t.firstName} {t.lastName} {t.phone ? `(${t.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">ระดับความสำคัญ</label>
            <div className="flex space-x-3">
              <label className="flex items-center space-x-2 text-xs text-ink cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'NORMAL'}
                  onChange={() => setPriority('NORMAL')}
                  className="text-primary focus:ring-primary"
                />
                <span>ปกติ</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-ink cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'URGENT'}
                  onChange={() => setPriority('URGENT')}
                  className="text-tone-red-solid focus:ring-tone-red-solid"
                />
                <span className="text-tone-red-solid font-medium">ด่วน (Urgent)</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">หัวข้อเรื่อง *</label>
            <input
              type="text"
              required
              placeholder="เช่น แจ้งปิดปรับปรุงระบบน้ำประปา, แจ้งค่าเช่าประจำเดือน"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">เนื้อหาข้อความ *</label>
            <textarea
              required
              rows={4}
              placeholder="พิมพ์รายละเอียดข้อความที่ต้องการแจ้ง..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-line bg-surface text-ink focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-ink-secondary hover:text-ink transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Message Detail */}
      {selectedMessage && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMessage(null)}
          title="รายละเอียดข้อความ"
        >
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-bg rounded-lg border border-line">
              <div>
                <div className="flex items-center gap-1.5">
                  {selectedMessage.priority === 'URGENT' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-tone-red-soft text-tone-red-solid">
                      ด่วน
                    </span>
                  )}
                  <span className="text-xs font-semibold text-ink">
                    ผู้รับ:{' '}
                    {selectedMessage.recipientType === 'ALL'
                      ? 'ประกาศทั่วไป (ทุกห้องพัก)'
                      : selectedMessage.recipientName}
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-1">
                  ส่งโดย: {selectedMessage.senderName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-ink-secondary block">
                  {formatThaiDateLong(selectedMessage.createdAt)}
                </span>
                <span className="text-[11px] text-ink-secondary block">
                  เวลา {formatThaiTime(selectedMessage.createdAt)}
                </span>
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="text-base font-bold text-ink mb-2">
                {selectedMessage.title}
              </h3>
              <div className="p-3.5 bg-surface rounded-lg border border-line text-xs leading-relaxed text-ink whitespace-pre-line">
                {selectedMessage.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage.id)}
                className="inline-flex items-center space-x-1.5 text-xs text-ink-secondary hover:text-primary transition"
              >
                <CheckCircle2 className={`h-4 w-4 ${selectedMessage.isRead ? 'text-tone-green-solid' : 'text-ink-secondary'}`} />
                <span>{selectedMessage.isRead ? 'ทำเครื่องหมายว่ายังไม่อ่าน' : 'ทำเครื่องหมายว่าอ่านแล้ว'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmId(selectedMessage.id);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-tone-red-solid hover:bg-tone-red-soft rounded-lg transition"
                >
                  ลบข้อความ
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบข้อความ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้? การดำเนินการนี้ไม่สามารถเรียกคืนได้"
        confirmLabel="ลบข้อความ"
        isDestructive={true}
      />
    </div>
  );
};
