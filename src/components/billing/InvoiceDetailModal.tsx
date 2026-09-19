import React from 'react';
import { Modal } from '../common/Modal';
import { Invoice } from '../../types/billing';
import { formatSatang, formatThaiDateLong } from '../../lib/format';
import { getLocalSettings } from '../../services/settingsService';
import { Printer, CheckCircle, QrCode, Building, Phone } from 'lucide-react';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onMarkPaid: (id: string) => void;
  onOpenReceipt: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onMarkPaid,
  onOpenReceipt,
}) => {
  if (!invoice) return null;
  const settings = getLocalSettings();

  const handlePrint = () => {
    window.print();
  };

  const qrImageUrl = invoice.promptpayPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        invoice.promptpayPayload
      )}`
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`ใบแจ้งหนี้ #${invoice.invoiceNumber}`}>
      <div className="space-y-4">
        {/* Dormitory & Tenant Header */}
        <div className="p-4 bg-bg rounded-xl border border-line flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Building className="h-4 w-4" />
              <span>{settings.dormitoryName}</span>
            </span>
            <p className="text-[11px] text-ink-secondary mt-0.5">{settings.address || 'หอพักมาตรฐาน'}</p>
            {settings.phone && (
              <p className="text-[11px] text-ink-secondary flex items-center gap-1 mt-0.5">
                <Phone className="h-3 w-3" />
                <span>{settings.phone}</span>
              </p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-ink block">ห้องพัก {invoice.roomNumber}</span>
            <p className="text-xs text-ink-secondary">ผู้เช่า: {invoice.tenantName}</p>
            <p className="text-[11px] text-ink-secondary mt-1">
              กำหนดชำระ: <span className="font-semibold text-tone-red-solid">{formatThaiDateLong(invoice.dueDate)}</span>
            </p>
          </div>
        </div>

        {/* Invoice Item Breakdown */}
        <div className="border border-line rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg text-ink-secondary border-b border-line font-medium">
              <tr>
                <th className="p-2.5">รายการ</th>
                <th className="p-2.5 text-center">หน่วยที่ใช้</th>
                <th className="p-2.5 text-right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="p-2.5 font-medium text-ink">ค่าเช่าห้องพักประจำเดือน ({invoice.period})</td>
                <td className="p-2.5 text-center text-ink-secondary">-</td>
                <td className="p-2.5 text-right font-semibold text-ink">{formatSatang(invoice.rentAmount)}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-ink">
                  ค่าน้ำประปา ({invoice.waterPrev} → {invoice.waterCurr})
                </td>
                <td className="p-2.5 text-center text-ink-secondary">{invoice.waterUnits} หน่วย</td>
                <td className="p-2.5 text-right font-semibold text-ink">{formatSatang(invoice.waterAmount)}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-ink">
                  ค่าไฟฟ้า ({invoice.electricPrev} → {invoice.electricCurr})
                </td>
                <td className="p-2.5 text-center text-ink-secondary">{invoice.electricUnits} หน่วย</td>
                <td className="p-2.5 text-right font-semibold text-ink">{formatSatang(invoice.electricAmount)}</td>
              </tr>
              {invoice.commonFee > 0 && (
                <tr>
                  <td className="p-2.5 text-ink">ค่าส่วนกลาง</td>
                  <td className="p-2.5 text-center text-ink-secondary">-</td>
                  <td className="p-2.5 text-right font-semibold text-ink">{formatSatang(invoice.commonFee)}</td>
                </tr>
              )}
              {invoice.otherFee > 0 && (
                <tr>
                  <td className="p-2.5 text-ink">ค่าบริการอื่นๆ</td>
                  <td className="p-2.5 text-center text-ink-secondary">-</td>
                  <td className="p-2.5 text-right font-semibold text-ink">{formatSatang(invoice.otherFee)}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-primary/5 border-t border-line font-bold">
              <tr>
                <td colSpan={2} className="p-3 text-ink">ยอดรวมทั้งสิ้น (Total Amount)</td>
                <td className="p-3 text-right text-base text-primary font-bold">
                  {formatSatang(invoice.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* PromptPay & Bank Details Card */}
        <div className="p-4 bg-bg rounded-xl border border-line flex flex-col sm:flex-row items-center gap-4">
          {qrImageUrl ? (
            <div className="flex flex-col items-center flex-shrink-0 bg-white p-2.5 rounded-lg border border-line shadow-xs">
              <img src={qrImageUrl} alt="PromptPay QR" className="h-32 w-32 object-contain" />
              <span className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1">
                <QrCode className="h-3 w-3" />
                <span>พร้อมเพย์ QR Code</span>
              </span>
            </div>
          ) : null}

          <div className="flex-1 text-xs space-y-1 text-center sm:text-left">
            <span className="font-bold text-ink block">ช่องทางการชำระเงิน</span>
            <p className="text-ink-secondary">
              ธนาคาร: <span className="font-medium text-ink">{settings.bankName}</span>
            </p>
            {settings.bankAccountNumber && (
              <p className="text-ink-secondary">
                เลขที่บัญชี: <span className="font-mono font-bold text-ink">{settings.bankAccountNumber}</span>
              </p>
            )}
            {settings.bankAccountName && (
              <p className="text-ink-secondary">
                ชื่อบัญชี: <span className="font-medium text-ink">{settings.bankAccountName}</span>
              </p>
            )}
            {settings.promptPayId && (
              <p className="text-ink-secondary">
                พร้อมเพย์: <span className="font-mono font-bold text-primary">{settings.promptPayId}</span>
              </p>
            )}
            <p className="text-[11px] text-tone-amber-solid pt-1 font-medium">
              * เมื่อชำระแล้วกรุณาส่งสลิปยืนยัน หรือแจ้งผู้ดูแลหอพัก
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-line">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-ink bg-surface border border-line rounded-lg hover:border-line-dark shadow-xs transition"
            >
              <Printer className="h-3.5 w-3.5 text-primary" />
              <span>พิมพ์ใบแจ้งหนี้</span>
            </button>

            {invoice.status === 'PAID' && (
              <button
                type="button"
                onClick={() => onOpenReceipt(invoice)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-tone-green-solid bg-tone-green-soft rounded-lg transition"
              >
                <span>พิมพ์ใบเสร็จรับเงิน</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {invoice.status !== 'PAID' && (
              <button
                type="button"
                onClick={() => {
                  onMarkPaid(invoice.id);
                  onClose();
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-tone-green-solid hover:bg-tone-green-solid/90 rounded-lg shadow-sm transition"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>บันทึกชำระเงินแล้ว</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-ink-secondary hover:text-ink transition"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
