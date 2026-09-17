import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  FileText,
  Users,
  Gauge,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const onboardingSteps = [
    {
      step: '1',
      title: 'ตั้งค่าข้อมูลหอพักและอัตราค่าน้ำ-ไฟ',
      desc: 'ไปที่เมนู "ตั้งค่าระบบ" เพื่อกำหนดชื่อหอพัก อัตราค่าน้ำต่อหน่วย ค่าไฟฟ้าต่อหน่วย และบัญชีธนาคาร/พร้อมเพย์สำหรับรับเงิน',
      icon: ShieldCheck,
    },
    {
      step: '2',
      title: 'เพิ่มข้อมูลห้องพัก',
      desc: 'ไปที่เมนู "ห้องพัก" เพื่อสร้างห้องพักตามชั้น กำหนดค่าเช่ารายเดือน ระบบจะจัดสถานะเป็นห้องว่างโดยอัตโนมัติ',
      icon: FileText,
    },
    {
      step: '3',
      title: 'บันทึกข้อมูลผู้เช่า & ทำสัญญาเช่า',
      desc: 'บันทึกประวัติผู้เช่าในเมนู "ผู้เช่า" จากนั้นไปที่ "สัญญาเช่า" เพื่อผูกห้องพักกับผู้เช่า กำหนดวันเริ่ม-สิ้นสุดสัญญา (พ.ศ.) และเงินประกัน',
      icon: Users,
    },
    {
      step: '4',
      title: 'จดมิเตอร์น้ำ-ไฟ & ออกใบแจ้งหนี้ประจำเดือน',
      desc: 'เมื่อถึงรอบบิล เข้าเมนู "บิล & มิเตอร์น้ำไฟ" เพื่อบันทึกเลขมิเตอร์ล่าสุด ระบบจะคำนวณบิลและสร้าง QR Code พร้อมเพย์พร้อมสั่งพิมพ์ใบแจ้งหนี้ได้ทันที',
      icon: Gauge,
    },
  ];

  const faqs = [
    {
      q: 'การบันทึกค่าน้ำ-ค่าไฟคิดคำนวณอย่างไร?',
      a: 'ระบบจะนำ "เลขมิเตอร์ครั้งนี้" ลบด้วย "เลขมิเตอร์ครั้งก่อน" เพื่อให้ได้หน่วยที่ใช้จริง แล้วนำไปคูณกับอัตราต่อหน่วยที่คุณกำหนดไว้ในหน้า "ตั้งค่าระบบ" โดยอัตโนมัติ',
    },
    {
      q: 'ทำไมถึงควรใช้ QR Code พร้อมเพย์ในใบแจ้งหนี้?',
      a: 'ใบแจ้งหนี้ของ DormPlus สร้าง Payload ตามมาตรฐาน EMVCo PromptPay พร้อมระบุยอดเงินที่ต้องชำระตรงตามบิล ทำให้ผู้เช่าสามารถเปิดแอปธนาคารใดก็ได้แล้วสแกนจ่ายได้ทันทียอดเงินไม่คลาดเคลื่อน',
    },
    {
      q: 'ระบบรักษาความปลอดภัยและการแบ่งสิทธิ์ (RBAC / RLS) ทำงานอย่างไร?',
      a: 'ฐานข้อมูล Supabase เปิดใช้งาน Row Level Security (RLS) โดยแบ่งบทบาทเป็น เจ้าของ (Owner), ผู้จัดการ (Manager) และ เจ้าหน้าที่ (Staff) พนักงานหน้างานจะไม่สามารถเข้าถึงงบการเงินส่วนตัวหรือกดลบห้องพักได้',
    },
    {
      q: 'สามารถพิมพ์ใบเสร็จรับเงินให้ผู้เช่าได้หรือไม่?',
      a: 'ได้ครับ เมื่อบันทึกว่าผู้เช่าชำระเงินเรียบร้อยแล้ว ในหน้าใบแจ้งหนี้จะมีปุ่ม "พิมพ์ใบเสร็จรับเงิน" จัดรูปแบบเอกสาร A4 พร้อมตราประทับชำระเงิน (PAID) และช่องเซ็นชื่อเรียบร้อย',
    },
    {
      q: 'หากต้องการจัดการหลายหอพักพร้อมกันทำได้หรือไม่?',
      a: 'สามารถคลิกที่ปุ่มสลับหอพักบริเวณมุมบน เพื่อเปลี่ยนหอพักที่กำลังดูแล หรือสร้างหอพักใหม่ได้ทันที ข้อมูลห้องและบัญชีจะแยกจากกันอย่างชัดเจน',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <span>ศูนย์ช่วยเหลือ & วิธีใช้งานระบบ (Help & Guide)</span>
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          คู่มือแนะนำขั้นตอนการทำงาน คำถามที่พบบ่อย และเทคนิคการบริหารหอพักด้วย DormPlus
        </p>
      </div>

      {/* Onboarding Guide Cards */}
      <div className="bg-surface border border-line rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>ขั้นตอนการเริ่มต้นใช้งานระบบ (Quick Onboarding)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {onboardingSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-3.5 rounded-xl bg-bg border border-line space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-bold text-ink">{item.title}</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed pl-8">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-surface border border-line rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>คำถามที่พบบ่อย (Frequently Asked Questions)</span>
        </h2>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-line rounded-xl overflow-hidden bg-bg transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-ink hover:text-primary transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-ink-secondary flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-ink-secondary leading-relaxed border-t border-line/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Box */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-xs font-bold text-primary block">ต้องการความช่วยเหลือเพิ่มเติม?</span>
          <span className="text-[11px] text-ink-secondary">
            ทีมงานและระบบผู้ช่วยพร้อมดูแลการตั้งค่าและตอบข้อซักถามตลอดเวลา
          </span>
        </div>
        <a
          href="mailto:support@dormplus.com"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>ติดต่อฝ่ายซัพพอร์ต</span>
        </a>
      </div>
    </div>
  );
};
