import { createWidgetUrl } from "@/utils/widgetUrls";

export function generateWidgetUrl(widgetId = 'preview') {
  return createWidgetUrl('recent', widgetId);
}

export const RECENT_DONATE_THEME_PRESETS = [
  {
    id: 'streamflow-night',
    label: 'Streamflow Night',
    colors: ['#22D3EE', '#E879F9'],
    settings: {
      accentColor: '#22D3EE',
      amountColor: '#E879F9',
      backgroundColor: '#050827',
      textColor: '#F8FAFC',
      borderColor: '#7C3AED',
      cardStyle: 'glass',
      shadowBlur: 28,
      backgroundBlurAmount: 14,
    },
    imageUrl: '/imgs/recent-donate-streamflow-night.png',
    background:
      'radial-gradient(circle at 84% 16%, rgba(232,121,249,.62), transparent 12%), radial-gradient(circle at 72% 46%, rgba(34,211,238,.24), transparent 20%), radial-gradient(circle at 30% 72%, rgba(217,70,239,.34), transparent 34%), linear-gradient(180deg,#030621 0%,#0A1150 42%,#160A55 68%,#020617 100%)',
    preview: 'linear-gradient(135deg,#050827 0%,#17206F 42%,#C026D3 72%,#06B6D4 100%)',
  },
  {
    id: 'neon-gaming',
    label: 'Neon Gaming',
    colors: ['#8B5CF6', '#38BDF8'],
    settings: {
      accentColor: '#8B5CF6',
      amountColor: '#38BDF8',
      backgroundColor: '#1e293b',
      textColor: '#ffffff',
      borderColor: '#2D204A',
      cardStyle: 'glass',
      shadowBlur: 20,
      backgroundBlurAmount: 10,
    },
    background:
      'radial-gradient(circle at 20% 20%, rgba(139,92,246,.35), transparent 30%), radial-gradient(circle at 80% 60%, rgba(236,72,153,.22), transparent 34%), linear-gradient(135deg,#0b1020,#131729 48%,#09111f)',
  },
  {
    id: 'minimal-clean',
    label: 'Minimal Clean',
    colors: ['#E5E7EB', '#64748B'],
    settings: {
      accentColor: '#94A3B8',
      amountColor: '#E5E7EB',
      backgroundColor: '#111827',
      textColor: '#F8FAFC',
      borderColor: '#334155',
      cardStyle: 'minimal',
      shadowBlur: 8,
      backgroundBlurAmount: 4,
    },
    background: 'linear-gradient(135deg,#111827,#1f2937)',
  },
  {
    id: 'twitch-purple',
    label: 'Twitch Purple',
    colors: ['#A855F7', '#6D28D9'],
    settings: {
      accentColor: '#A855F7',
      amountColor: '#C084FC',
      backgroundColor: '#120b24',
      textColor: '#ffffff',
      borderColor: '#7E22CE',
      cardStyle: 'neon',
      shadowBlur: 24,
      backgroundBlurAmount: 10,
    },
    background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,.42), transparent 38%), linear-gradient(135deg,#120b24,#24113f)',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    colors: ['#06B6D4', '#F43F5E'],
    settings: {
      accentColor: '#06B6D4',
      amountColor: '#F43F5E',
      backgroundColor: '#07111f',
      textColor: '#F8FAFC',
      borderColor: '#0891B2',
      cardStyle: 'gradient',
      shadowBlur: 26,
      backgroundBlurAmount: 12,
    },
    background:
      'radial-gradient(circle at 20% 10%, rgba(6,182,212,.34), transparent 32%), radial-gradient(circle at 80% 70%, rgba(244,63,94,.26), transparent 34%), linear-gradient(135deg,#07111f,#171428)',
  },
];

export const RECENT_DONATE_THEME_BACKGROUNDS = RECENT_DONATE_THEME_PRESETS.reduce((themes, preset) => {
  themes[preset.id] = preset.background;
  return themes;
}, {});

export function getDefaultSettings() {
  return {
    enabled: true,
    title: 'Recent Donations',
    maxEntries: [5],
    showName: true,
    showAmount: true,
    showTime: true,
    showMessage: false,
    autoScroll: true,
    scrollSpeed: [3],
    accentColor: '#22D3EE',
    backgroundColor: '#050827',
    textColor: '#ffffff',
    fontSize: [14],
    alignment: 'flex-row',
    layoutStyle: 'list',
    themePreset: 'streamflow-night',
    cardStyle: 'glass',
    borderRadius: [16],
    messagePlaceholder: 'Thanks for your support!',
    animationType: 'fade',
    animationSpeed: [50],
    animationDuration: [700],
    itemSpacing: [12],
    widgetWidth: [320],
    widgetHeight: [420],
    padding: [16],
    position: 'center',
    borderEnabled: true,
    borderColor: '#7C3AED',
    borderWidth: [1],
    shadowEnabled: true,
    shadowBlur: [20],
    backgroundBlur: true,
    backgroundBlurAmount: [10],
    alertSoundEnabled: true,
    alertSound: 'chime-1',
    customCss: '.donation-item {\n  font-family: Kanit, sans-serif;\n  letter-spacing: 0.5px;\n}',
    isUseStartAt: false,
    startAt: new Date(Date.now()).toISOString().slice(0, 16),
    isUseEndAt: false,
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    amountColor: '#E879F9',
    amountFontSize: [36],
    amountAlignment: 'center',
    amountFontFamily: 'IBM Plex Sans Thai',
    amountFontWeight: '700',
    amountStrokeColor: '#000000',
    amountStrokeWidth: [2.5],
    lastDonatorColor: '#FFFFFF',
    lastDonatorFontSize: [36],
    lastDonatorAlignment: 'center',
    lastDonatorFontFamily: 'IBM Plex Sans Thai',
    lastDonatorFontWeight: '700',
    lastDonatorStrokeColor: '#000000',
    lastDonatorStrokeWidth: [2.5],
  };
}

export function getDefaultRecentDonations() {
  return [
    { name: 'Viewer123', amount: '฿100', time: '2 min ago', message: 'Great stream!' },
    { name: 'SupporterX', amount: '฿50', time: '5 min ago', message: '' },
    { name: 'FanGirl', amount: '฿200', time: '8 min ago', message: 'Love your content' },
  ];
}
