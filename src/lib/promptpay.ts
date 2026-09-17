/**
 * PromptPay EMVCo QR Code Payload Generator (Pure TypeScript)
 * Supports Mobile Numbers (08x...), National IDs / Tax IDs (13 digits)
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  const hex = crc.toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

function formatTag(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export function formatPromptPayTarget(target: string): { type: 'PHONE' | 'NAT_ID'; value: string } {
  const cleaned = target.replace(/[^0-9]/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    // Mobile: 0812345678 -> 0066812345678 (13 digits padded)
    const formatted = `0066${cleaned.substring(1)}`.padStart(13, '0');
    return { type: 'PHONE', value: formatted };
  }
  // Citizen ID / Tax ID: 13 digits
  return { type: 'NAT_ID', value: cleaned.padStart(13, '0') };
}

export function generatePromptPayPayload(target: string, amount?: number): string {
  if (!target) return '';
  const { type, value } = formatPromptPayTarget(target);

  const targetTag = type === 'PHONE' ? formatTag('01', value) : formatTag('02', value);
  const aidTag = formatTag('00', 'A000000677010111');
  const merchantInfo = formatTag('29', aidTag + targetTag);

  let payload =
    formatTag('00', '01') + // Version
    formatTag('01', amount ? '12' : '11') + // Initiation (12 = Dynamic with amount, 11 = Static)
    merchantInfo +
    formatTag('53', '764') + // Currency THB (764)
    formatTag('58', 'TH'); // Country TH

  if (amount && amount > 0) {
    payload += formatTag('54', amount.toFixed(2));
  }

  const checksumBase = payload + '6304';
  const checksum = crc16(checksumBase);

  return checksumBase + checksum;
}

