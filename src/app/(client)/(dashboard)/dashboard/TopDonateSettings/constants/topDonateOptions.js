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

    // ── (legacy) ──
    animationStyle:   'glow',
  };
}