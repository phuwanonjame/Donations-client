// constants/donate-goal.js
import { thaiGoogleFonts, fontWeights as alertFontWeights } from '../../DonateAlertSettings/components/utils/fontUtils';

export const widgetTypes = [
  { id: 'main', name: 'Main' },
  { id: 'large', name: 'Large' },
];

// ใช้รายการฟอนต์จาก Donate Alert
export const fontFamilies = thaiGoogleFonts.map(f => ({
  id: f.id,
  name: f.name,
}));

// ใช้รายการน้ำหนักฟอนต์จาก Donate Alert
export const fontWeights = alertFontWeights.map(weight => ({
  id: weight,
  name: weight.charAt(0).toUpperCase() + weight.slice(1),
}));

// เพิ่มขนาดฟอนต์ให้ถึง 100px ตามที่ต้องการ
export const fontSizes = [
  '12px', '14px', '16px', '18px', '20px', 
  '24px', '28px', '30px', '32px', '36px', '40px', '48px',
  '56px', '64px', '72px', '80px', '96px', '100px'
];

export const strokeWidths = [
  '0px', '1px', '1.5px', '2px', '2.5px', '3px', '4px'
];

export const templateVariables = {
  progress: ['{{amount}}', '{{percentage}}'],
  large: ['{{amount}}', '{{goal}}', '{{days}}', '{{percentage}}'],
  description: ['{{amount}}', '{{days}}', '{{percentage}}'],
};

export const defaultSettings = {
  type: 'main',
  // goal section
  goalName: 'ค่าอาหารหมา',
  goalAmount: 100,
  goalFontFamily: 'kanit',               // เปลี่ยนเป็น id จาก thaiGoogleFonts
  goalFontWeight: 'bold',                // เปลี่ยนเป็น 'bold' (จากเดิม '700')
  goalFontSize: '36px',                  // ยังคงอยู่ในช่วงใหม่
  goalColor: '#FFFFFF',
  goalStrokeWidth: '0px',
  goalStrokeColor: '#000000',
  // progress section
  progressText: '{{amount}}฿ ({{percentage}}%)',
  progressColor: '#0EA5E9',
  progressFontFamily: 'kanit',
  progressShine: true,
  largeTopFontSize: '30px',
  largeBottomFontSize: '20px',
  largeTopRightText: '{{amount}}฿/{{goal}}฿',
  largeBottomLeftText: 'สิ้นสุดใน {{days}} วัน',
  largeBottomRightText: '{{percentage}}%',
  // description section
  descriptionLeftText: 'จากเป้าหมาย {{amount}}฿',
  descriptionRightText: 'สิ้นสุดใน {{days}} วัน',
  descriptionFontFamily: 'sarabun',      // เปลี่ยนเป็น id จาก thaiGoogleFonts
  descriptionFontWeight: 'medium',       // เปลี่ยนเป็น 'medium' (จากเดิม '500')
  descriptionFontSize: '24px',
  descriptionColor: '#FFFFFF',
  descriptionStrokeWidth: '0px',
  descriptionStrokeColor: '#000000',
  // date range
  isUseStartAt: true,
  startAt: new Date(Date.now()).toISOString().slice(0, 16),
  isUseEndAt: true,
  endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  // simulated current for preview
  currentAmount: 35,
};