import React from 'react';
import { Modal } from '../common/Modal';
import { Invoice } from '../../types/billing';
import { formatSatang, formatThaiDateLong } from '../../lib/format';
import { getLocalSettings } from '../../services/settingsService';
import { Printer, CheckCircle2, Building } from 'lucide-react';

interface ReceiptPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  if (!invoice) return null;
  const settings = getLocalSettings();

  const handlePrint = () => {
    window.print();
  };

  const receiptNumber = invoice.invoiceNumber.replace('INV-', 'REC-');
  const paymentDate = invoice.paidAt ? formatThaiDateLong(invoice.paidAt) : formatThaiDateLong(new Date());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ใบเสร็จรับเงิน (Official Receipt)">
      <div className="space-y-4">
        {/* Printable Receipt Paper Container */}
        <div className="p-6 bg-white border border-line rounded-xl shadow-xs text-ink space-y-4 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-primary/20 pb-4">
            <div>
              <h2 className="text-base font-bold text-primary flex items-center gap-1.5">
                <Building className="h-5 w-5" />
                <span>{settings.dormitoryName}</span>
              </h2>
              <p className="text-[11px] text-ink-secondary mt-0.5 max-w-sm">{settings.address || 'หอพักมาตรฐาน'}</p>
              {settings.phone && (
                <p className="text-[11px] text-ink-secondary">โทรศัพท์: {settings.phone}</p>
              )}
              {settings.taxId && (
                <p className="text-[11px] text-ink-secondary">เลขประจำตัวผู้เสียภาษี: {settings.taxId}</p>
              )}
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-ink block">ใบเสร็จรับเงิน</span>
              <span className="text-[11px] text-ink-secondary block font-mono">
                เลขที่: {receiptNumber}
              </span>
              <span className="text-[11px] text-ink-secondary block">
                วันที่: {paymentDate}
              </span>
            </div>
          </div>

          {/* Customer / Room Info */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-bg rounded-lg text-xs">
            <div>
              <span className="text-ink-secondary block text-[11px]">ได้รับเงินจาก (ผู้เช่า):</span>
              <span className="font-bold text-ink text-sm">{invoice.tenantName}</span>
              {invoice.tenantPhone && (
                <span className="text-ink-secondary block text-[11px] mt-0.5">เบอร์โทร: {invoice.tenantPhone}</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-ink-secondary block text-[11px]">ห้องพักเลขที่:</span>
              <span className="font-bold text-primary text-base">ห้อง {invoice.roomNumber}</span>
              <span className="text-ink-secondary block text-[11px] mt-0.5">ประจำงวดเดือน: {invoice.period}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-line rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-bg text-ink-secondary border-b border-line font-medium">
                <tr>
                  <th className="p-2.5">รายการ</th>
                  <th className="p-2.5 text-center">จำนวนหน่วย</th>
                  <th className="p-2.5 text-right">จำนวนเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="p-2.5 font-medium">ค่าเช่าห้องพัก</td>
                  <td className="p-2.5 text-center text-ink-secondary">1 เดือน</td>
                  <td className="p-2.5 text-right font-semibold">{formatSatang(invoice.rentAmount)}</td>
                </tr>
                {invoice.waterAmount > 0 && (
                  <tr>
                    <td className="p-2.5">ค่าน้ำประปา ({invoice.waterUnits} หน่วย)</td>
                    <td className="p-2.5 text-center text-ink-secondary">{invoice.waterUnits}</td>
                    <td className="p-2.5 text-right font-semibold">{formatSatang(invoice.waterAmount)}</td>
                  </tr>
                )}
                {invoice.electricAmount > 0 && (
                  <tr>
                    <td className="p-2.5">ค่าไฟฟ้า ({invoice.electricUnits} หน่วย)</td>
                    <td className="p-2.5 text-center text-ink-secondary">{invoice.electricUnits}</td>
                    <td className="p-2.5 text-right font-semibold">{formatSatang(invoice.electricAmount)}</td>
                  </tr>
                )}
                {invoice.commonFee > 0 && (
                  <tr>
                    <td className="p-2.5">ค่าส่วนกลาง</td>
                    <td className="p-2.5 text-center text-ink-secondary">-</td>
                    <td className="p-2.5 text-right font-semibold">{formatSatang(invoice.commonFee)}</td>
                  </tr>
                )}
                {invoice.otherFee > 0 && (
                  <tr>
                    <td className="p-2.5">ค่าบริการอื่นๆ</td>
                    <td className="p-2.5 text-center text-ink-secondary">-</td>
                    <td className="p-2.5 text-right font-semibold">{formatSatang(invoice.otherFee)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-primary/5 font-bold border-t border-line">
                <tr>
                  <td colSpan={2} className="p-3 text-ink">ยอดเงินสุทธิที่ได้รับชำระแล้ว:</td>
                  <td className="p-3 text-right text-base text-primary font-bold">
                    {formatSatang(invoice.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Paid Stamp & Signatures */}
          <div className="pt-4 flex justify-between items-end">
            <div className="flex items-center space-x-2 text-tone-green-solid border-2 border-tone-green-solid px-3 py-1.5 rounded-lg rotate-[-3deg] font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>ชำระเงินเรียบร้อยแล้ว (PAID)</span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b border-line pb-4"></div>
              <span className="text-[11px] text-ink-secondary block">
                ( {settings.userDisplayName || 'ผู้รับเงิน / ผู้ดูแลหอพัก'} )
              </span>
              <span className="text-[10px] text-ink-secondary block">ผู้รับเงิน</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-ink-secondary hover:text-ink transition"
          >
            ปิด
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>สั่งพิมพ์ใบเสร็จ (Print / PDF)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
