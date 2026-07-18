import { createWidgetUrl } from "@/utils/widgetUrls";
import {
  thaiGoogleFonts,
  fontWeights as alertFontWeights,
} from '../../DonateAlertSettings/components/utils/fontUtils';

export const timeRanges = [
  { id: 'today',  name: 'Today' },
  { id: 'week',   name: 'This Week' },
  { id: 'month',  name: 'This Month' },
  { id: 'stream', name: 'This Stream' },
  { id: 'all',    name: 'All Time' },
];

export const animationStyles = [
  { id: 'glow',   name: 'Glow' },
  { id: 'pulse',  name: 'Pulse' },
  { id: 'bounce', name: 'Bounce' },
];

export const layoutAlignments = [
  { id: 'stack-center', name: 'Stack Center' },
  { id: 'stack-left', name: 'Stack Left' },
  { id: 'stack-right', name: 'Stack Right' },
  { id: 'row-center', name: 'Row Center' },
  { id: 'row-left', name: 'Row Left' },
  { id: 'row-right', name: 'Row Right' },
  { id: 'row-reverse-center', name: 'Row Reverse Center' },
  { id: 'row-reverse-left', name: 'Row Reverse Left' },
  { id: 'row-reverse-right', name: 'Row Reverse Right' },
  { id: 'stack-reverse-center', name: 'Stack Reverse Center' },
  { id: 'stack-reverse-left', name: 'Stack Reverse Left' },
  { id: 'stack-reverse-right', name: 'Stack Reverse Right' },
];

export const textAlignments = [
  { id: 'left', name: 'Left' },
  { id: 'center', name: 'Center' },
  { id: 'right', name: 'Right' },
];

export const fontFamilies = thaiGoogleFonts.map((font) => ({ id: font.id, name: font.name }));
export const fontWeights = alertFontWeights.map((weight) => ({
  id: weight,
  name: weight.charAt(0).toUpperCase() + weight.slice(1),
}));

export function generateWidgetUrl(widgetId = 'preview') {
  return createWidgetUrl('top', widgetId);
}

export const celebrationEffects = [
  { id: 'burst', name: 'Burst' },
  { id: 'confetti', name: 'Confetti' },
  { id: 'shake', name: 'Shake' },
  { id: 'none', name: 'None' },
];

export const templateVariants = [
  { id: 'classic',          name: 'Classic' },
  { id: 'hero-center',      name: 'Hero Center Card' },
  { id: 'neon-glass',       name: 'Neon Glass Spotlight' },
  { id: 'minimal-banner',   name: 'Minimal Premium Banner' },
  { id: 'trophy-podium',    name: 'Trophy Podium Style' },
  { id: 'circular-profile', name: 'Circular Profile Focus' },
  { id: 'compact-strip',    name: 'Compact Overlay Strip' },
];

export function getDefaultSettings() {
  return {
    // ── Widget toggle ──
    enabled:          true,
    templateVariant:  'classic',      // one of templateVariants ids
    celebrationEffect: 'burst',       // one of celebrationEffects ids

    // ── Configuration ──
    title:            'Top Donation',
    timeRange:        'stream',       // 'today'|'week'|'month'|'stream'|'all'
    showName:         true,
    showAmount:       true,
    showMessage:      true,
    showIcon:         true,

    // ── Icon source ──
    iconType:         'sparkles',     // 'sparkles'|'crown'|'star'|'heart'|'zap'|'trophy'|'flame'|'diamond'|'custom'
    iconCustomUrl:    null,           // base64 string หรือ URL (null = ใช้ preset)

    // ── Container shape ──
    iconShape:        'circle',       // 'none'|'circle'|'rounded'|'squircle'|'square'|'diamond'
    iconRadius:       [16],           // px — ใช้เมื่อ shape = rounded/squircle/square

    // ── Sizing ──
    iconSize:         [80],           // container size px (32–160)
    iconImageSize:    [70],           // icon size inside container % (40–100)

    // ── Background fill ──
    iconBgMode:       'gradient',     // 'gradient'|'solid'|'outline'|'none'
    iconBgColor:      '#a855f7',      // solid color หรือ gradient start
    iconBgColor2:     '#ec4899',      // gradient end (ใช้เมื่อ mode = gradient)

    // ── Border ──
    iconBorderWidth:  [0],            // px (0–8)
    iconBorderColor:  '#ffffff',

    // ── Effects ──
    iconGlow:         true,
    iconGlowIntensity:'medium',       // 'low'|'medium'|'high'
    iconAnimate:      false,
    iconAnimateStyle: 'pulse',        // 'pulse'|'bounce'|'spin'

    // ── Appearance ──
    accentColor:      '#a855f7',
    backgroundColor:  'transparent',
    textColor:        '#ffffff',
    fontSize:         [18],           // px (12–32)
    titleFontSize:    [14],
    messageFontSize:  [18],
    alignment:        'stack-center',
    isUseStartAt:     false,
    startAt:          new Date(Date.now()).toISOString().slice(0, 16),
    isUseEndAt:       false,
    endAt:            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),

    amountColor: '#FFFFFF',
    amountFontSize: [36],
    amountAlignment: 'center',
    amountFontFamily: 'ibmplex',
    amountFontWeight: 'bold',
    amountStrokeColor: '#000000',
    amountStrokeWidth: [2.5],

    topDonatorColor: '#FFFFFF',
    topDonatorFontSize: [36],
    topDonatorAlignment: 'center',
    topDonatorFontFamily: 'ibmplex',
    topDonatorFontWeight: 'bold',
    topDonatorStrokeColor: '#000000',
    topDonatorStrokeWidth: [2.5],

    // ── (legacy) ──
    animationStyle:   'glow',
  };
}
