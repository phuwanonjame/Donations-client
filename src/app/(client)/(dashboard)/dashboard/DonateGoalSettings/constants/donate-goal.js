import {
  thaiGoogleFonts,
  fontWeights as alertFontWeights,
} from '../../DonateAlertSettings/components/utils/fontUtils';

export const widgetTypes = [
  { id: 'main', name: 'Main' },
  { id: 'large', name: 'Large' },
];

export const fontFamilies = thaiGoogleFonts.map((font) => ({
  id: font.id,
  name: font.name,
}));

export const fontWeights = alertFontWeights.map((weight) => ({
  id: weight,
  name: weight.charAt(0).toUpperCase() + weight.slice(1),
}));

export const fontSizes = [
  '12px', '14px', '16px', '18px', '20px',
  '24px', '28px', '30px', '32px', '36px', '40px', '48px',
  '56px', '64px', '72px', '80px', '96px', '100px',
];

export const strokeWidths = [
  '0px', '1px', '1.5px', '2px', '2.5px', '3px', '4px',
];

export const templateVariables = {
  progress: ['{{amount}}', '{{percentage}}'],
  large: ['{{amount}}', '{{goal}}', '{{days}}', '{{percentage}}'],
  description: ['{{amount}}', '{{days}}', '{{percentage}}'],
};

export const progressBarSkins = [
  { id: 'solid', name: 'Solid Color' },
  { id: 'custom', name: 'Studio Gradient' },
  { id: 'aurora', name: 'Aurora Flow' },
  { id: 'sunset', name: 'Sunset Pop' },
  { id: 'ocean', name: 'Ocean Glass' },
  { id: 'berry', name: 'Berry Neon' },
  { id: 'mono', name: 'Monochrome Ice' },
];

export const defaultSettings = {
  type: 'main',
  goalName: 'ค่าอาหารหมา',
  goalAmount: 100,
  goalFontFamily: 'kanit',
  goalFontWeight: 'bold',
  goalFontSize: '36px',
  goalColor: '#FFFFFF',
  goalStrokeWidth: '0px',
  goalStrokeColor: '#000000',
  showGoalAmount: true,
  progressText: '{{amount}}฿ ({{percentage}}%)',
  progressColor: '#0EA5E9',
  progressFontFamily: 'kanit',
  progressShine: true,
  progressSkin: 'custom',
  progressGradientFrom: '#38BDF8',
  progressGradientVia: '#818CF8',
  progressGradientTo: '#F472B6',
  progressBarHeight: 32,
  largeTopFontSize: '30px',
  largeBottomFontSize: '20px',
  largeTopRightText: '{{amount}}฿/{{goal}}฿',
  largeBottomLeftText: 'สิ้นสุดใน {{days}} วัน',
  largeBottomRightText: '{{percentage}}%',
  descriptionLeftText: 'จากเป้าหมาย {{amount}}฿',
  descriptionRightText: 'สิ้นสุดใน {{days}} วัน',
  descriptionFontFamily: 'sarabun',
  descriptionFontWeight: 'medium',
  descriptionFontSize: '24px',
  descriptionColor: '#FFFFFF',
  descriptionStrokeWidth: '0px',
  descriptionStrokeColor: '#000000',
  isUseStartAt: true,
  startAt: new Date(Date.now()).toISOString().slice(0, 16),
  isUseEndAt: true,
  endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  currentAmount: 35,
};
