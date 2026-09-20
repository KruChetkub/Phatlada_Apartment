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
  Compass,
  Home,
  BedDouble,
  CircleDollarSign,
  Wrench,
  FileBarChart,
  Bell,
  Settings,
  Lightbulb,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { useSystemTour } from '../contexts/SystemTourContext';

export const HelpPage: React.FC = () => {
  const { startTour } = useSystemTour();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 4 ขั้นตอนเริ่มต้นใช้งานด่วน (Core Foundation)
  const onboardingSteps = [
    {
      step: '1',
      title: 'ตั้งค่าข้อมูลหอพักและอัตราค่าน้ำ-ไฟ',
      desc: 'ไปที่เมนู "ตั้งค่า" เพื่อกำหนดชื่อหอพัก เลขผู้เสียภาษี อัตราค่าน้ำต่อหน่วย ค่าไฟฟ้าต่อหน่วย และผูกบัญชีธนาคาร/พร้อมเพย์สำหรับรับเงินค่าเช่า',
      icon: ShieldCheck,
      badge: 'การตั้งค่าระบบ',
    },
    {
      step: '2',
      title: 'สร้างผังและเพิ่มข้อมูลห้องพัก',
      desc: 'ไปที่เมนู "ห้องพัก" เพื่อสร้างห้องพักตามชั้น กำหนดประเภทห้อง (ห้องพัดลม/แอร์) และกำหนดค่าเช่ารายเดือน ระบบจะเริ่มสถานะเป็น "ห้องว่าง"',
      icon: BedDouble,
      badge: 'จัดการห้องพัก',
    },
    {
      step: '3',
      title: 'ลงทะเบียนผู้เช่า & ทำสัญญาเช่า',
      desc: 'บันทึกประวัติผู้เช่าในเมนู "ผู้เช่า" จากนั้นไปที่ "สัญญาเช่า" เพื่อทำสัญญาจับคู่ห้องพัก กำหนดเงินประกัน ค่าเช่าล่วงหน้า และระยะเวลาสัญญา (พ.ศ.)',
      icon: Users,
      badge: 'สัญญา & ผู้เช่า',
    },
    {
      step: '4',
      title: 'จดมิเตอร์น้ำไฟ & ออกบิลพร้อม QR Code',
      desc: 'เมื่อถึงรอบบิล เข้าเมนู "บิล & มิเตอร์น้ำไฟ" บันทึกเลขมิเตอร์ล่าสุด ระบบคำนวณเงินให้อัตโนมัติ พร้อมส่งพิมพ์ใบแจ้งหนี้ที่มี PromptPay QR Code ให้ผู้เช่าสแกนจ่ายได้ทันที',
      icon: Gauge,
      badge: 'การเงิน & มิเตอร์',
    },
  ];

  // คู่มือขั้นตอนการทำงานตามโมดูลใหม่ทั้ง 11 ระบบ (Complete Workflow)
  const systemModules = [
    {
      id: 'dashboard',
      name: 'หน้าหลักระบบจัดการ (Dashboard)',
      icon: Home,
      category: 'overview',
      highlight: 'ศูนย์รวมข้อมูลภาพรวมแบบ Real-time',
      steps: [
        'ตรวจสอบ Occupancy Rate (อัตราการเข้าพัก) ว่าห้องว่างกี่ห้อง มีผู้เช่ากี่ห้อง',
        'ดูสรุปยอดรายรับ-รายจ่ายประจำเดือน และประมาณการกระแสเงินสด',
        'ตรวจสอบแถบแจ้งเตือนด่วน เช่น บิลที่เกินกำหนดชำระ สัญญาเช่าใกล้หมดอายุ',
        'คลิก Quick Actions ทางลัดเพื่อเข้าสู่ฟังก์ชันการทำงานที่ใช้บ่อยได้ทันที',
      ],
      tip: 'แนะนำให้เปิดหน้า Dashboard เช็คเป็นประจำทุกเช้าเพื่อตรวจรายการเงินโอนเข้าและงานซ่อมด่วน',
    },
    {
      id: 'rooms',
      name: 'ห้องพัก (Rooms)',
      icon: BedDouble,
      category: 'operation',
      highlight: 'จัดการผังห้องพักและสถานะความพร้อม',
      steps: [
        'สร้างห้องพักใหม่ กำหนดหมายเลขห้อง ชั้น และประเภทห้อง (แอร์/พัดลม)',
        'ตั้งราคาค่าเช่ามาตรฐานประจำห้อง เพื่อดึงไปใช้เวลาทำสัญญาอัตโนมัติ',
        'ตรวจเช็คสถานะห้อง: ห้องว่าง (สีเขียว), มีผู้เช่า (สีน้ำเงิน), หรือแจ้งซ่อม/ปิดปรับปรุง (สีส้ม)',
        'คลิกที่การ์ดห้องพักเพื่อดูประวัติการเช่าและมิเตอร์ย้อนหลังได้ทันที',
      ],
      tip: 'หากมีห้องที่ต้องซ่อมแซม ให้เปลี่ยนสถานะเป็น "ปิดปรับปรุง" เพื่อป้องกันไม่ให้ถูกเลือกทำสัญญาเช่าใหม่',
    },
    {
      id: 'tenants',
      name: 'ผู้เช่า (Tenants)',
      icon: Users,
      category: 'operation',
      highlight: 'ทะเบียนประวัติผู้เช่าตามมาตรฐานความปลอดภัย PDPA',
      steps: [
        'บันทึกชื่อ-นามสกุล เบอร์โทรศัพท์ อีเมล และเลขบัตรประชาชนของผู้เช่า',
        'บันทึกข้อมูลผู้ติดต่อกรณีฉุกเฉิน (Emergency Contact) เพื่อความปลอดภัย',
        'แนบเอกสารหรือสำเนาบัตรประชาชนไว้ในประวัติผู้เช่าอย่างปลอดภัย',
        'ดูรายการห้องที่ผู้เช่ากำลังพักอาศัยและประวัติการชำระเงินย้อนหลัง',
      ],
      tip: 'เบอร์โทรศัพท์ที่บันทึกถูกต้องจะช่วยให้ระบบสามารถส่งบิลหรือข้อความติดต่อผู้เช่าได้อย่างแม่นยำ',
    },
    {
      id: 'leases',
      name: 'สัญญาเช่า (Leases)',
      icon: FileText,
      category: 'operation',
      highlight: 'การทำสัญญา ผูกห้องพัก และเงินประกัน',
      steps: [
        'กด "สร้างสัญญาเช่าใหม่" แล้วเลือกห้องพักและผู้เช่าจากทะเบียน',
        'ระบุวันเริ่มต้นสัญญาและวันสิ้นสุดสัญญา (แสดงเป็นปี พ.ศ. ตามมาตรฐานไทย)',
        'บันทึกยอดเงินประกันความเสียหาย (Deposit) และค่าเช่าล่วงหน้า',
        'เมื่อครบกำหนดสัญญา สามารถเลือก "ต่ออายุสัญญา" หรือ "แจ้งย้ายออก/คืนเงินประกัน"',
      ],
      tip: 'ระบบจะแจ้งเตือนล่วงหน้า 30 วันก่อนสัญญาหมดอายุ ช่วยให้ผู้ดูแลสามารถสอบถามการต่อสัญญากับผู้เช่าได้ทันเวลา',
    },
    {
      id: 'invoices',
      name: 'บิล & มิเตอร์น้ำไฟ (Invoices & Meters)',
      icon: Gauge,
      category: 'finance',
      highlight: 'จดมิเตอร์ ออกบิลอัตโนมัติ พร้อม PromptPay QR Code',
      steps: [
        'กด "บันทึกมิเตอร์" กรอกเลขมิเตอร์น้ำและไฟฟ้าครั้งล่าสุด ระบบจะนำไปหักลบกับครั้งก่อนหน้าและคำนวณจำนวนหน่วยอัตโนมัติ',
        'ระบบสร้างใบแจ้งหนี้ที่มี PromptPay QR Code มาตรฐาน EMVCo พร้อมระบุยอดเงินตรงตามบิล ป้องกันโอนเงินผิด',
        'กดพิมพ์ใบแจ้งหนี้ (A4/Slip) หรือส่งภาพบิลให้ผู้เช่าผ่านระบบข้อความ',
        'เมื่อผู้เช่าโอนเงินชำระแล้ว กด "บันทึกชำระเงิน" และสั่งพิมพ์ "ใบเสร็จรับเงิน (Official Receipt)" พร้อมตราประทับชำระแล้ว (PAID)',
      ],
      tip: 'สามารถกดบันทึกมิเตอร์เป็นรายชั้นหรือกด Generate บิลทั้งหอพักได้ในคลิกเดียว ช่วยลดเวลาปิดรอบบิลจากเดิมหลายชั่วโมงเหลือเพียงไม่กี่นาที',
    },
    {
      id: 'finance',
      name: 'การเงิน & บัญชี (Finance)',
      icon: CircleDollarSign,
      category: 'finance',
      highlight: 'ตรวจสลิป ตรวจสอบรายรับ-รายจ่าย และกระแสเงินสด',
      steps: [
        'ดูรายการเงินโอนเข้าทั้งหมด ตรวจสอบสลิปหลักฐานการโอนและเวลาชำระเงิน',
        'บันทึกรายการ "รายจ่ายหอพัก" เช่น ค่าน้ำ-ไฟส่วนกลาง, ค่าแม่บ้าน, ค่าอุปกรณ์ซ่อมแซม',
        'เลือกหมวดหมู่รายรับ-รายจ่ายเพื่อความแม่นยำในการจัดทำบัญชี',
        'ตรวจสอบยอดเงินคงเหลือสุทธิและกระทบยอดเงินในบัญชีธนาคารหอพัก',
      ],
      tip: 'แนะนำให้บันทึกรายจ่ายส่วนกลางทันทีที่มีใบเสร็จ เพื่อให้รายงานกำไร-ขาดทุนสะท้อนผลการดำเนินงานจริงมากที่สุด',
    },
    {
      id: 'maintenance',
      name: 'แจ้งซ่อม & บำรุงรักษา (Maintenance)',
      icon: Wrench,
      category: 'operation',
      highlight: 'จัดการคำร้องแจ้งซ่อม มอบหมายงาน และคุมค่าใช้จ่าย',
      steps: [
        'รับเรื่องแจ้งซ่อมจากผู้เช่า พร้อมระบุเลขห้อง หัวข้อปัญหา และระดับความเร่งด่วน',
        'มอบหมายช่างผู้รับผิดชอบ และเปลี่ยนสถานะเป็น "กำลังดำเนินการ (In Progress)"',
        'เมื่อช่างเข้าซ่อมเสร็จ บันทึกรายละเอียดการแก้ไขและแนบค่าใช้จ่ายค่าอะไหล่/ค่าแรง',
        'ปรับสถานะเป็น "เสร็จสิ้น (Resolved)" เพื่อเก็บบันทึกประวัติอุปกรณ์ในห้องพัก',
      ],
      tip: 'การบันทึกประวัติงานซ่อมจะช่วยให้ทราบว่าแอร์หรือสุขภัณฑ์ห้องใดชำรุดบ่อย เพื่อวางแผนเปลี่ยนอุปกรณ์ใหม่แทนการซ่อมซ้ำซาก',
    },
    {
      id: 'reports',
      name: 'รายงานสรุป (Reports)',
      icon: FileBarChart,
      category: 'reporting',
      highlight: 'สถิติผลประกอบการและวิเคราะห์ข้อมูลเชิงลึก',
      steps: [
        'เลือกช่วงเวลาที่ต้องการดูรายงาน (รายเดือน / รายไตรมาส / รายปี)',
        'ดูรายงานยอดรายรับแยกตามหมวดหมู่: ค่าเช่า, ค่าน้ำ, ค่าไฟ, ค่าบริการอื่น ๆ',
        'ดูรายงานลูกหนี้ค้างชำระ (Aging Balance) เพื่อติดตามยอดเงินที่ยังค้างจ่าย',
        'Export ข้อมูลเป็นไฟล์เอกสารหรือพิมพ์รายงานเพื่อใช้ยื่นภาษีและประชุมบริหาร',
      ],
      tip: 'รายงานลูกหนี้ค้างชำระมีระบบคัดกรองตามจำนวนวันที่เกินกำหนด ช่วยให้บริหารการทวงถามได้ตรงจุด',
    },
    {
      id: 'messages',
      name: 'ข้อความ & การติดต่อ (Messages)',
      icon: MessageSquare,
      category: 'communication',
      highlight: 'ช่องทางสื่อสาร แจ้งประกาศ และส่งบิลถึงผู้เช่า',
      steps: [
        'เลือกส่งข้อความหาผู้เช่ารายห้อง หรือส่งประกาศรวมถึงผู้เช่าทุกห้องพร้อมกัน',
        'แนบรายละเอียดบิลค่าเช่า หรือประกาศงานบำรุงรักษาอาคาร เช่น แจ้งล้างถังพักน้ำ',
        'ตรวจสอบประวัติการส่งข้อความและเวลาที่ส่งถึงผู้เช่า',
      ],
      tip: 'ใช้สำหรับส่งแจ้งเตือนก่อนวันตัดรอบบิล 2-3 วัน เพื่อให้ผู้เช่าเตรียมพร้อมชำระเงิน',
    },
    {
      id: 'notifications',
      name: 'การแจ้งเตือน (Notifications)',
      icon: Bell,
      category: 'communication',
      highlight: 'ไม่พลาดทุกเหตุการณ์สำคัญของหอพัก',
      steps: [
        'แจ้งเตือนอัตโนมัติเมื่อมีบิลที่เกินกำหนดชำระ (Overdue Invoices)',
        'แจ้งเตือนล่วงหน้าเมื่อสัญญาเช่าใกล้หมดอายุ (Expiring Leases)',
        'แจ้งเตือนเมื่อมีรายการแจ้งซ่อมใหม่ที่ต้องการการอนุมัติหรือมอบหมายช่าง',
        'กดคลิกที่การแจ้งเตือนเพื่อลิงก์ไปยังรายการนั้น ๆ ได้ทันทีโดยไม่ต้องค้นหาเอง',
      ],
      tip: 'สัญลักษณ์กระดิ่งบนแถบด้านบน (Topbar) จะแสดงตัวเลขแจ้งเตือนใหม่เสมอ',
    },
    {
      id: 'settings',
      name: 'ตั้งค่าระบบ (Settings)',
      icon: Settings,
      category: 'system',
      highlight: 'กำหนดค่าพื้นฐาน ข้อมูลทางการเงิน และสิทธิ์ผู้ใช้',
      steps: [
        'ข้อมูลหอพัก: กำหนดชื่อหอพัก ที่อยู่ เบอร์ติดต่อ และโลโก้ที่จะปรากฏบนหัวบิล',
        'อัตราค่าสาธารณูปโภค: กำหนดค่าน้ำต่อหน่วย (หรือราคาเหมาจ่าย) และค่าไฟฟ้าต่อหน่วย',
        'บัญชีรับเงิน: ตั้งค่าเลขพร้อมเพย์ (PromptPay ID) หรือเลขบัญชีธนาคารสำหรับสร้าง QR Code',
        'กำหนดสิทธิ์การใช้งาน (RBAC): กำหนดบทบาท Owner, Manager, Staff ให้พนักงานอย่างเหมาะสม',
      ],
      tip: 'ควรตรวจสอบอัตราค่าน้ำ-ไฟต่อหน่วยให้ถูกต้องก่อนเริ่มออกบิลแรกของเดือน',
    },
  ];

  // คำถามที่พบบ่อย (FAQs)
  const faqs = [
    {
      category: 'บิล & มิเตอร์น้ำไฟ',
      q: 'การบันทึกค่าน้ำ-ค่าไฟคิดคำนวณอย่างไร?',
      a: 'ระบบจะนำ "เลขมิเตอร์ครั้งนี้" ลบด้วย "เลขมิเตอร์ครั้งก่อนหน้า" เพื่อให้ได้จำนวนหน่วยที่ใช้จริง จากนั้นนำไปคูณกับอัตราต่อหน่วยที่คุณกำหนดไว้ในหน้า "ตั้งค่า" โดยอัตโนมัติ หากมีการกำหนดค่าน้ำขั้นต่ำ ระบบจะนำยอดขั้นต่ำมาเปรียบเทียบและคิดยอดที่ถูกต้องให้ทันที',
    },
    {
      category: 'การชำระเงิน & QR Code',
      q: 'ทำไม PromptPay QR Code ของ Phatlada จึงสะดวกและปลอดภัยกว่า?',
      a: 'ใบแจ้งหนี้ของระบบ Phatlada สร้าง QR Code ตามมาตรฐาน EMVCo PromptPay สากล โดยฝังยอดเงินที่ต้องชำระตรงตามบิลลงใน QR Code เมื่อผู้เช่าใช้แอปพลิเคชันของธนาคารใดก็ได้สแกน ยอดเงินและเลขพร้อมเพย์ของหอพักจะแสดงขึ้นมาโดยอัตโนมัติ ผู้เช่าไม่ต้องกรอกตัวเลขเอง ป้องกันปัญหาโอนเงินขาดหรือโอนเกินได้อย่างสมบูรณ์',
    },
    {
      category: 'เอกสาร & ใบเสร็จ',
      q: 'สามารถสั่งพิมพ์ใบเสร็จรับเงิน (Receipt) ได้เมื่อใด?',
      a: 'เมื่อผู้เช่าชำระเงินแล้ว และผู้ดูแลกด "บันทึกการชำระเงิน" ในหน้ารายการบิล ระบบจะมีปุ่ม "พิมพ์ใบเสร็จรับเงิน" ปรากฏขึ้นมาทันที เอกสารได้รับการจัดหน้าขนาด A4 มีหัวบิลชื่อหอพัก เลขที่ใบเสร็จ ตราประทับชำระเงิน (PAID) และช่องลงลายมือชื่อผู้รับเงินอย่างเป็นทางการ',
    },
    {
      category: 'สัญญาเช่า',
      q: 'เมื่อสัญญาเช่าใกล้หมดอายุ ระบบจะแจ้งเตือนอย่างไร และควรทำอย่างไร?',
      a: 'ระบบจะเริ่มแจ้งเตือนบนหน้า Dashboard และเมนู Notifications ล่วงหน้า 30 วันก่อนถึงวันหมดสัญญา ผู้ดูแลสามารถเข้าไปที่เมนู "สัญญาเช่า" เพื่อกดเลือก "ต่ออายุสัญญา" พร้อมปรับอัตราค่าเช่าใหม่ หรือหากผู้เช่าประสงค์จะย้ายออก สามารถกด "ทำรายการย้ายออก" เพื่อคำนวณหักลบค่าเสียหายและคืนเงินมัดจำได้',
    },
    {
      category: 'ความปลอดภัย & สิทธิ์',
      q: 'ระบบรักษาความปลอดภัยและการแบ่งสิทธิ์ (RBAC / RLS) ทำงานอย่างไร?',
      a: 'ฐานข้อมูลระบบทำงานบน Supabase พร้อมเปิดใช้งาน Row Level Security (RLS) โดยแบ่งสิทธิ์ออกเป็น 3 ระดับ: เจ้าของหอพัก (Owner) เข้าถึงได้ทุกฟังก์ชัน, ผู้จัดการ (Manager) จัดการห้อง ผู้เช่า สัญญา และบิลได้ แต่ไม่สามารถลบหอพักหรือแก้ไขสิทธิ์เจ้าของได้, เจ้าหน้าที่ (Staff) จดมิเตอร์และดูแลงานแจ้งซ่อมทั่วไป ช่วยป้องกันการเข้าถึงข้อมูลการเงินโดยไม่ได้รับอนุญาต',
    },
    {
      category: 'จัดการหลายหอพัก',
      q: 'หากมีหอพักหรืออาคารมากกว่า 1 แห่ง สามารถจัดการในระบบเดียวได้หรือไม่?',
      a: 'สามารถทำได้ครับ คลิกที่ปุ่มการ์ดหอพักบริเวณมุมล่างของเมนู Sidebar หรือกดปุ่มสลับหอพัก จะมีหน้าต่างขึ้นมาให้คุณเลือกสลับไปยังหอพักอื่น หรือกดสร้างหอพักใหม่ได้ทันที ข้อมูลห้องพัก ผู้เช่า บิล และการเงินของแต่ละหอพักจะแยกจากกันอย่างเด็ดขาด',
    },
  ];

  // เทคนิคการบริหารหอพักอย่างมืออาชีพ (Pro Tips & Best Practices)
  const proTips = [
    {
      title: 'เทคนิคการปิดรอบบิลและกระทบยอดเงินใน 1 วัน',
      desc: 'กำหนดวันจดมิเตอร์ที่แน่นอนในแต่ละเดือน (เช่น ทุกวันที่ 25) แล้วใช้ระบบจดมิเตอร์บนมือถือหรือแท็บเล็ตเดินตรวจตามห้อง บิลจะถูกคำนวณทันทีพร้อมสร้าง QR ส่งให้ผู้เช่าได้ภายในวันเดียวกัน ลดเวลาการออกบิลลงกว่า 80%',
      icon: Gauge,
    },
    {
      title: 'ตรวจจับท่อน้ำรั่วซึมได้ล่วงหน้าจากหน่วยมิเตอร์',
      desc: 'สังเกตจำนวนหน่วยน้ำที่ระบบแสดงผล หากห้องใดมีหน่วยน้ำสูงกว่าปกติเกิน 2-3 เท่า ให้รีบส่งช่างเข้าตรวจสอบชักโครกหรือก๊อกน้ำรั่วซึมทันที ก่อนที่จะกลายเป็นปัญหาน้ำท่วมห้องหรือค่าน้ำสูงผิดปกติ',
      icon: Wrench,
    },
    {
      title: 'ลดปัญหาหนี้ค้างชำระด้วยการแจ้งเตือนล่วงหน้า',
      desc: 'ใช้เมนู "ข้อความ" ส่งข้อความแจ้งเตือนผู้เช่าล่วงหน้า 2 วันก่อนถึงกำหนดชำระเงิน พร้อมแนบภาพบิลที่มี QR Code ผู้เช่าสามารถกดบันทึกรูปและเปิดสแกนจ่ายผ่านแอปธนาคารได้ทันที ช่วยลดอัตราการจ่ายล่าช้าได้อย่างเห็นผล',
      icon: Bell,
    },
    {
      title: 'การบันทึกภาพถ่ายสภาพห้องก่อนเข้าพักและก่อนย้ายออก',
      desc: 'ในขั้นตอนการทำสัญญาเช่า ควรถ่ายภาพอุปกรณ์ภายในห้องพัก (เช่น ผนัง เครื่องปรับอากาศ สุขภัณฑ์) บันทึกเก็บไว้เป็นหลักฐาน เมื่อผู้เช่าย้ายออกจะสามารถตรวจเช็คความเสียหายและหักเงินมัดจำได้อย่างโปร่งใส เป็นธรรมต่อทั้งสองฝ่าย',
      icon: FileText,
    },
  ];

  // กรองโมดูลตามคำค้นหาและหมวดหมู่
  const filteredModules = systemModules.filter((mod) => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* 1. Header Banner & Quick Tour Action */}
      <div className="bg-gradient-to-r from-primary to-sidebar-active text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
          <HelpCircle className="h-64 w-64" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phatlada Knowledge Base & System Tour</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ศูนย์ช่วยเหลือ & วิธีใช้งานระบบ
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            คู่มือแนะนำขั้นตอนการทำงาน คำถามที่พบบ่อย และเทคนิคการบริหารหอพักด้วย Phatlada
            เรียนรู้การจัดการครบวงจรตั้งแต่การสร้างห้องพัก จดมิเตอร์ จนถึงการเงินและการออกรายงาน
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={startTour}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-primary text-xs font-bold rounded-xl shadow-md hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="h-4 w-4" />
              <span>เริ่มทัวร์แนะนำระบบใหม่อีกครั้ง (Interactive Tour)</span>
            </button>
            <a
              href="#workflows"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/15 text-white text-xs font-medium rounded-xl hover:bg-white/20 backdrop-blur-xs transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>ดูคู่มือทั้ง 11 โมดูล</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Quick Onboarding Steps (4 Steps) */}
      <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>ขั้นตอนเริ่มต้นใช้งานระบบ 4 สเต็ป (Quick Onboarding)</span>
          </h2>
          <span className="text-[11px] text-ink-muted hidden sm:inline">
            สำหรับผู้เริ่มต้นใช้งานครั้งแรก
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {onboardingSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-4 rounded-xl bg-bg border border-line space-y-2 hover:border-primary/40 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold shadow-xs">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-bold text-ink group-hover:text-primary transition">
                      {item.step}. {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed pl-9">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Complete Workflow Modules (11 Modules) */}
      <div id="workflows" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>คู่มือขั้นตอนการทำงานตามโมดูลระบบใหม่ (11 ระบบหลัก)</span>
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              เจาะลึกขั้นตอนการใช้งานในแต่ละแถบเมนู ตั้งแต่หน้าหลักระบบจัดการถึงตั้งค่า
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="ค้นหาขั้นตอนการทำงาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: 'all', label: 'ทั้งหมด (11)' },
            { id: 'overview', label: 'ภาพรวม' },
            { id: 'operation', label: 'งานปฏิบัติการ (ห้อง/ผู้เช่า/สัญญา/ซ่อม)' },
            { id: 'finance', label: 'การเงิน & บิลมิเตอร์' },
            { id: 'communication', label: 'การสื่อสาร & แจ้งเตือน' },
            { id: 'system', label: 'ตั้งค่าระบบ' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface border border-line text-ink-secondary hover:text-ink hover:bg-bg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-surface border border-line rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-primary/30 transition"
              >
                <div className="space-y-3">
                  {/* Module Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-primary block">
                          ระบบที่ {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-ink">{mod.name}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-bg rounded-xl border border-line/60 text-xs font-medium text-ink-secondary">
                    📌 {mod.highlight}
                  </div>

                  {/* Steps List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-ink block">ขั้นตอนการใช้งาน:</span>
                    <ul className="space-y-1.5">
                      {mod.steps.map((step, sIdx) => (
                        <li key={sIdx} className="text-xs text-ink-secondary flex items-start space-x-2 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pro Tip Callout */}
                <div className="pt-3 border-t border-line/60 flex items-start space-x-2 text-[11px] text-amber-700 bg-amber-500/10 p-2.5 rounded-xl">
                  <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{mod.tip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Pro Tips & Dormitory Management Techniques */}
      <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <span>เทคนิคการบริหารหอพักอย่างมืออาชีพด้วย Phatlada (Pro Tips)</span>
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            แนวทางปฏิบัติที่ดีที่สุดเพื่อลดเวลาการทำงาน ลดหนี้ค้างชำระ และสร้างความประทับใจให้ผู้เช่า
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {proTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-bg border border-line space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-ink">{tip.title}</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed pl-9">
                  {tip.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FAQs Accordion */}
      <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>คำถามที่พบบ่อย (Frequently Asked Questions)</span>
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            คำตอบสำหรับข้อสงสัยที่พบบ่อยเกี่ยวกับการออกบิล สัญญา การเงิน และการตั้งค่า
          </p>
        </div>

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
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-ink hover:text-primary transition gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {faq.category}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-ink-secondary flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-ink-secondary leading-relaxed border-t border-line/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Support & Helpdesk Footer */}
      <div className="p-5 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <span className="text-xs sm:text-sm font-bold text-primary block">
            ต้องการความช่วยเหลือเพิ่มเติม หรือแจ้งปัญหาการใช้งาน?
          </span>
          <span className="text-xs text-ink-secondary">
            ทีมงาน Phatlada พร้อมให้คำแนะนำด้านเทคนิคและการตั้งค่าระบบตลอดเวลา
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={startTour}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-surface text-ink text-xs font-semibold rounded-xl border border-line shadow-xs hover:bg-bg transition"
          >
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>ทัวร์ระบบอีกครั้ง</span>
          </button>
          <a
            href="mailto:support@phatlada.com"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-primary/90 transition hover:scale-105"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>ติดต่อฝ่ายซัพพอร์ต</span>
          </a>
        </div>
      </div>
    </div>
  );
};
