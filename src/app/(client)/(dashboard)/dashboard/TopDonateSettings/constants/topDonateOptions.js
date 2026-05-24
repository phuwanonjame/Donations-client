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

export const fontFamilies = [
  { id: 'IBM Plex Sans Thai', name: 'IBM Plex Sans Thai' },
  { id: 'Kanit', name: 'Kanit' },
  { id: 'Prompt', name: 'Prompt' },
  { id: 'Sarabun', name: 'Sarabun' },
  { id: 'Noto Sans Thai', name: 'Noto Sans Thai' },
  { id: 'Inter', name: 'Inter' },
  { id: 'Poppins', name: 'Poppins' },
  { id: 'Montserrat', name: 'Montserrat' },
];

export const fontWeights = [
  { id: '400', name: '400' },
  { id: '500', name: '500' },
  { id: '600', name: '600' },
  { id: '700', name: '700' },
  { id: '800', name: '800' },
  { id: '900', name: '900' },
];

export function generateWidgetUrl(widgetId = 'abc123') {
  return `https://easydonate.app/w/top/${widgetId}`;
}

export function getDefaultSettings() {
  return {
    // ── Widget toggle ──
    enabled:          true,

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
    backgroundColor:  '#1e293b',
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
    amountFontFamily: 'IBM Plex Sans Thai',
    amountFontWeight: '700',
    amountStrokeColor: '#000000',
    amountStrokeWidth: [2.5],

    topDonatorColor: '#FFFFFF',
    topDonatorFontSize: [36],
    topDonatorAlignment: 'center',
    topDonatorFontFamily: 'IBM Plex Sans Thai',
    topDonatorFontWeight: '700',
    topDonatorStrokeColor: '#000000',
    topDonatorStrokeWidth: [2.5],

    // ── (legacy) ──
    animationStyle:   'glow',
  };
}
