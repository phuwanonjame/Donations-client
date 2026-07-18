"use client";
import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/lib/utils';
import { createWidgetUrl } from '@/utils/widgetUrls';
import { motion } from 'framer-motion';
import {
  Bell,
  Target,
  Trophy,
  Star,
  Clock,
  Monitor,
  Gift,
  Settings,
  ExternalLink,
  Sparkles,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWidgetPreviews } from '../../components/context/WidgetPreviewsProvider';
import TopDonatePreview from '../TopDonateSettings/components/TopDonatePreview';
import LeaderboardPreview from '../LeaderboardSettings/components/LeaderboardPreview';
import GoalPreview from '../DonateGoalSettings/components/GoalPreview';
import AlertPreview from '../DonateAlertSettings/components/AlertPreview';
import DonatePageRenderer from '@/components/donation/shared/DonatePageRenderer';
import { defaultDonatePageSettings } from '@/components/donation/shared/donatePageConfig';
import { loadDonatePageSettings } from '@/components/donation/shared/donatePageStorage';

const copy = {
  en: {
    languageLabel: 'Language',
    previewAll: 'Preview All',
    settings: 'Settings',
    pro: 'PRO',
    header: {
      title: 'Stream Widgets',
      description: 'Customize widgets for your live streams and donation page',
    },
    widgets: {
      'donate-alert': {
        name: 'Donate Alert',
        description: 'Show animated alerts when you receive donations',
      },
      'donate-goal': {
        name: 'Donate Goal',
        description: 'Display progress towards your donation goal',
      },
      leaderboard: {
        name: 'Leaderboard',
        description: 'Show top supporters ranking',
      },
      'top-donate': {
        name: 'Top Donate',
        description: 'Highlight your highest donation',
      },
      'recent-donate': {
        name: 'Recent Donate',
        description: 'Display recent donation activity',
      },
      'donate-page': {
        name: 'Donate Page',
        description: 'Preview your public donation page',
      },
      'gift-alert': {
        name: 'Gift Alert',
        description: 'Special alerts for gift donations',
      },
    },
    howTo: {
      title: 'How to use widgets',
      steps: [
        {
          title: 'Enable Widget',
          description: 'Toggle on the widgets you want to use',
        },
        {
          title: 'Copy Widget URL',
          description: 'Get the browser source URL for OBS',
        },
        {
          title: 'Add to OBS',
          description: 'Paste as Browser Source in your streaming software',
        },
      ],
    },
  },
  th: {
    languageLabel: '\u0e20\u0e32\u0e29\u0e32',
    previewAll: '\u0e14\u0e39\u0e15\u0e31\u0e27\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14',
    settings: '\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32',
    pro: '\u0e42\u0e1b\u0e23',
    header: {
      title: '\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15\u0e2a\u0e15\u0e23\u0e35\u0e21',
      description: '\u0e1b\u0e23\u0e31\u0e1a\u0e41\u0e15\u0e48\u0e07\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e44\u0e25\u0e1f\u0e4c\u0e2a\u0e15\u0e23\u0e35\u0e21\u0e41\u0e25\u0e30\u0e2b\u0e19\u0e49\u0e32\u0e23\u0e31\u0e1a\u0e42\u0e14\u0e40\u0e19\u0e17\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13',
    },
    widgets: {
      'donate-alert': {
        name: '\u0e41\u0e08\u0e49\u0e07\u0e40\u0e15\u0e37\u0e2d\u0e19\u0e42\u0e14\u0e40\u0e19\u0e17',
        description: '\u0e41\u0e2a\u0e14\u0e07\u0e41\u0e08\u0e49\u0e07\u0e40\u0e15\u0e37\u0e2d\u0e19\u0e41\u0e1a\u0e1a\u0e40\u0e04\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e44\u0e2b\u0e27\u0e40\u0e21\u0e37\u0e48\u0e2d\u0e44\u0e14\u0e49\u0e23\u0e31\u0e1a\u0e42\u0e14\u0e40\u0e19\u0e17',
      },
      'donate-goal': {
        name: '\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e42\u0e14\u0e40\u0e19\u0e17',
        description: '\u0e41\u0e2a\u0e14\u0e07\u0e04\u0e27\u0e32\u0e21\u0e04\u0e37\u0e1a\u0e2b\u0e19\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e01\u0e32\u0e23\u0e23\u0e31\u0e1a\u0e42\u0e14\u0e40\u0e19\u0e17',
      },
      leaderboard: {
        name: '\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e1c\u0e39\u0e49\u0e2a\u0e19\u0e31\u0e1a\u0e2a\u0e19\u0e38\u0e19',
        description: '\u0e41\u0e2a\u0e14\u0e07\u0e23\u0e32\u0e22\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e2a\u0e19\u0e31\u0e1a\u0e2a\u0e19\u0e38\u0e19\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14',
      },
      'top-donate': {
        name: '\u0e42\u0e14\u0e40\u0e19\u0e17\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14',
        description: '\u0e41\u0e2a\u0e14\u0e07\u0e22\u0e2d\u0e14\u0e42\u0e14\u0e40\u0e19\u0e17\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13',
      },
      'recent-donate': {
        name: '\u0e42\u0e14\u0e40\u0e19\u0e17\u0e25\u0e48\u0e32\u0e2a\u0e38\u0e14',
        description: '\u0e41\u0e2a\u0e14\u0e07\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e42\u0e14\u0e40\u0e19\u0e17\u0e25\u0e48\u0e32\u0e2a\u0e38\u0e14',
      },
      'donate-page': {
        name: '\u0e2b\u0e19\u0e49\u0e32\u0e23\u0e31\u0e1a\u0e42\u0e14\u0e40\u0e19\u0e17',
        description: '\u0e14\u0e39\u0e15\u0e31\u0e27\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e2b\u0e19\u0e49\u0e32\u0e23\u0e31\u0e1a\u0e42\u0e14\u0e40\u0e19\u0e17\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e30\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13',
      },
      'gift-alert': {
        name: '\u0e41\u0e08\u0e49\u0e07\u0e40\u0e15\u0e37\u0e2d\u0e19\u0e02\u0e2d\u0e07\u0e02\u0e27\u0e31\u0e0d',
        description: '\u0e41\u0e08\u0e49\u0e07\u0e40\u0e15\u0e37\u0e2d\u0e19\u0e1e\u0e34\u0e40\u0e28\u0e29\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e01\u0e32\u0e23\u0e42\u0e14\u0e40\u0e19\u0e17\u0e02\u0e2d\u0e07\u0e02\u0e27\u0e31\u0e0d',
      },
    },
    howTo: {
      title: '\u0e27\u0e34\u0e18\u0e35\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15',
      steps: [
        {
          title: '\u0e40\u0e1b\u0e34\u0e14\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15',
          description: '\u0e40\u0e1b\u0e34\u0e14\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15\u0e17\u0e35\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e01\u0e32\u0e23\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19',
        },
        {
          title: '\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01 URL \u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15',
          description: '\u0e19\u0e33 URL \u0e44\u0e1b\u0e43\u0e0a\u0e49\u0e40\u0e1b\u0e47\u0e19 Browser Source \u0e43\u0e19 OBS',
        },
        {
          title: '\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e02\u0e49\u0e32 OBS',
          description: '\u0e27\u0e32\u0e07 URL \u0e43\u0e19 Browser Source \u0e02\u0e2d\u0e07\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21\u0e2a\u0e15\u0e23\u0e35\u0e21',
        },
      ],
    },
  },
};

const widgets = [
  {
    id: 'donate-alert',
    icon: Bell,
    gradient: 'from-cyan-500 to-blue-500',
    enabled: true,
    hasSettings: true,
    settingsPage: 'widgets/donate-alert-settings',
  },
  {
    id: 'donate-goal',
    icon: Target,
    gradient: 'from-emerald-500 to-teal-500',
    enabled: false,
    hasSettings: true,
    settingsPage: 'widgets/donate-goal-settings',
  },
  {
    id: 'leaderboard',
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-500',
    enabled: false,
    hasSettings: true,
    settingsPage: 'widgets/leaderboard-settings',
  },
  {
    id: 'top-donate',
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    enabled: true,
    hasSettings: true,
    settingsPage: 'widgets/top-donate-settings',
  },
  {
    id: 'recent-donate',
    icon: Clock,
    gradient: 'from-blue-500 to-indigo-500',
    enabled: true,
    hasSettings: true,
    settingsPage: 'widgets/recent-donate-settings',
  },
  {
    id: 'donate-page',
    icon: Monitor,
    gradient: 'from-sky-500 to-cyan-500',
    enabled: true,
    hasToggle: false,
    hasSettings: true,
    settingsPage: 'DonatePageSettings',
  },
  {
    id: 'gift-alert',
    icon: Gift,
    gradient: 'from-rose-500 to-pink-500',
    enabled: false,
    hasSettings: true,
    settingsPage: 'GiftAlertSettings',
    isPro: true,
  },
];

const PREVIEW_CARD_HEIGHT = 220;
const DEFAULT_ALERT_TEST_MESSAGE = '\u0e02\u0e2d\u0e1a\u0e04\u0e38\u0e13\u0e21\u0e32\u0e01 \u0e46 \u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e01\u0e33\u0e25\u0e31\u0e07\u0e43\u0e08\u0e19\u0e30 {{user}}!';
const WIDGET_URL_TYPES = {
  'donate-alert': 'alert',
  'donate-goal': 'goal',
  leaderboard: 'leaderboard',
  'top-donate': 'top',
  'recent-donate': 'recent',
  'gift-alert': 'gift',
};

const DEFAULT_GIFT_ALERT_PREVIEW_SETTINGS = {
  enabled: false,
  accentColor: '#ec4899',
  backgroundColor: 'transparent',
  textColor: '#ffffff',
  showSenderName: true,
  showGiftValue: true,
};

function getProfileSlug(user) {
  const rawValue =
    user?.slug ||
    user?.username ||
    user?.displayName ||
    user?.name ||
    user?.email?.split('@')[0] ||
    '';

  return String(rawValue)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

function getPreviewNumber(value, fallback = 0) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getGoalPreviewCurrentAmount(settings) {
  const goalAmount = Number(settings?.goalAmount || 100);
  return Math.max(1, Math.round(goalAmount * 0.62));
}

function WidgetPreviewFrame({ children }) {
  return (
    <div
      className="relative mb-4 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/70"
      style={{ height: PREVIEW_CARD_HEIGHT }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))]" />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

function ScaledWidgetViewport({
  naturalWidth,
  naturalHeight,
  children,
  className = '',
  contentClassName = '',
}) {
  const containerRef = React.useRef(null);
  const [viewport, setViewport] = React.useState({ width: naturalWidth, height: naturalHeight });

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    const updateViewport = () => {
      setViewport({
        width: element.clientWidth || naturalWidth,
        height: element.clientHeight || naturalHeight,
      });
    };

    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(element);
    return () => observer.disconnect();
  }, [naturalHeight, naturalWidth]);

  const scale = Math.min(
    viewport.width / naturalWidth,
    viewport.height / naturalHeight,
    1,
  );

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div
        className={`absolute left-1/2 top-1/2 ${contentClassName}`}
        style={{
          width: naturalWidth,
          height: naturalHeight,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CompactRecentDonateCard({ settings, donations = [] }) {
  const maxEntries = Math.min(3, getPreviewNumber(settings?.maxEntries, 3));
  const visibleDonations = donations.slice(0, maxEntries);
  const titleSize = getPreviewNumber(settings?.fontSize, 16);
  const nameSize = getPreviewNumber(settings?.lastDonatorFontSize, 18);
  const amountSize = getPreviewNumber(settings?.amountFontSize, 20);
  const borderRadius = getPreviewNumber(settings?.borderRadius, 18);
  const borderWidth = settings?.borderEnabled ? getPreviewNumber(settings?.borderWidth, 1) : 0;
  const shadowBlur = settings?.shadowEnabled ? getPreviewNumber(settings?.shadowBlur, 12) : 0;
  const cardStyle = settings?.cardStyle || 'minimal';
  const isPlain = cardStyle === 'plain';
  const styleMap = {
    minimal: 'border-slate-800 bg-slate-900/55',
    soft: 'border-slate-800/70 bg-slate-900/40',
    outline: 'border-slate-700/70 bg-transparent',
    plain: 'border-transparent bg-transparent',
  };

  return (
    <div className="flex h-full items-start justify-center overflow-hidden p-3">
      <div className="w-full max-w-[360px] overflow-hidden px-3 py-2">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Recent</span>
          <span
            className="truncate text-right"
            style={{
              color: settings?.textColor || '#F8FAFC',
              fontSize: `${titleSize}px`,
              fontWeight: settings?.titleFontWeight || '700',
              fontFamily: settings?.titleFontFamily || 'inherit',
            }}
          >
            {settings?.title || 'Recent Donations'}
          </span>
        </div>
        <div className="space-y-2">
          {visibleDonations.map((donation, index) => (
            <div
              key={donation.id || `${donation.name}-${index}`}
              className={isPlain ? 'py-1.5' : `rounded-lg border px-3 py-2 ${styleMap[cardStyle] || styleMap.minimal}`}
              style={isPlain ? undefined : {
                borderRadius,
                borderColor: settings?.borderEnabled ? settings?.borderColor : 'transparent',
                borderWidth,
                boxShadow: shadowBlur ? `0 8px ${shadowBlur}px rgba(15,23,42,.12)` : 'none',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {settings?.showName && (
                    <p
                      className="truncate"
                      style={{
                        color: settings?.lastDonatorColor || '#FFFFFF',
                        fontSize: `${nameSize}px`,
                        fontWeight: settings?.lastDonatorFontWeight || '700',
                        fontFamily: settings?.lastDonatorFontFamily || 'inherit',
                      }}
                    >
                      {donation.name}
                    </p>
                  )}
                  {settings?.showMessage && (
                    <p className="mt-1 truncate text-[11px] text-slate-400">{donation.message || settings?.messagePlaceholder}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {settings?.showAmount && (
                    <p
                      style={{
                        color: settings?.amountColor || '#38BDF8',
                        fontSize: `${amountSize}px`,
                        fontWeight: settings?.amountFontWeight || '700',
                        fontFamily: settings?.amountFontFamily || 'inherit',
                      }}
                    >
                      {donation.amount}
                    </p>
                  )}
                  {settings?.showTime && <p className="mt-1 text-[11px] text-slate-500">{donation.time}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GiftAlertCardPreview({ settings }) {
  const accentColor = settings?.accentColor || '#ec4899';
  const textColor = settings?.textColor || '#ffffff';
  const backgroundColor = settings?.backgroundColor && settings.backgroundColor !== 'transparent'
    ? settings.backgroundColor
    : 'rgba(15,23,42,0.78)';

  return (
    <div className="flex h-full items-center justify-center p-5">
      <div
        className="w-full max-w-[360px] rounded-2xl border px-4 py-4 shadow-xl"
        style={{
          borderColor: `${accentColor}55`,
          background: `linear-gradient(180deg, ${backgroundColor}, rgba(2,6,23,0.92))`,
          boxShadow: `0 18px 40px ${accentColor}22`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: `${accentColor}22`, color: accentColor }}
          >
            <Gift className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Gift Alert</p>
            <p className="truncate text-sm font-semibold" style={{ color: textColor }}>
              Premium gift support preview
            </p>
          </div>
        </div>

        <div
          className="mt-4 rounded-xl border px-4 py-3"
          style={{ borderColor: `${accentColor}33`, background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              {settings?.showSenderName && (
                <p className="truncate text-sm font-semibold" style={{ color: textColor }}>
                  SuperFan123 sent a gift
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">Special alert for premium interactions</p>
            </div>
            {settings?.showGiftValue && (
              <div
                className="rounded-full px-3 py-1 text-sm font-bold"
                style={{ background: `${accentColor}22`, color: accentColor }}
              >
                THB 100
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetCardPreview({ widgetId, preview }) {
  if (!preview) {
    return (
      <WidgetPreviewFrame>
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
          Preview will appear here after widget data loads.
        </div>
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'leaderboard') {
    return (
      <WidgetPreviewFrame>
        <ScaledWidgetViewport naturalWidth={820} naturalHeight={500} className="px-3 py-4" contentClassName="pointer-events-none">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[620px]">
              <LeaderboardPreview settings={preview.settings} />
            </div>
          </div>
        </ScaledWidgetViewport>
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'top-donate') {
    return (
      <WidgetPreviewFrame>
        <ScaledWidgetViewport naturalWidth={820} naturalHeight={500} className="px-3 py-4" contentClassName="pointer-events-none">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[420px]">
              <TopDonatePreview settings={preview.settings} donorData={preview.donorData} />
            </div>
          </div>
        </ScaledWidgetViewport>
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'recent-donate') {
    return (
      <WidgetPreviewFrame>
        <ScaledWidgetViewport naturalWidth={820} naturalHeight={500} className="px-3 py-4" contentClassName="pointer-events-none">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[360px]">
              <CompactRecentDonateCard settings={preview.settings} donations={preview.donations} />
            </div>
          </div>
        </ScaledWidgetViewport>
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'donate-goal') {
    return (
      <WidgetPreviewFrame>
        <ScaledWidgetViewport naturalWidth={820} naturalHeight={500} className="px-3 py-4" contentClassName="pointer-events-none">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[620px] rounded-xl border border-white/8 bg-slate-950/60 p-6">
              <GoalPreview settings={preview.settings} currentAmount={preview.currentAmount} />
            </div>
          </div>
        </ScaledWidgetViewport>
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'donate-page') {
    return (
      <WidgetPreviewFrame>
        <ScaledWidgetViewport naturalWidth={1320} naturalHeight={860} className="px-3 py-4" contentClassName="pointer-events-none">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-[720px]">
              <DonatePageRenderer settings={preview.settings} preview optimizeForEditor />
            </div>
          </div>
        </ScaledWidgetViewport>
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'gift-alert') {
    return (
      <WidgetPreviewFrame>
        <GiftAlertCardPreview settings={preview.settings} />
      </WidgetPreviewFrame>
    );
  }

  if (widgetId === 'donate-alert') {
    return (
      <WidgetPreviewFrame>
        <ScaledWidgetViewport naturalWidth={820} naturalHeight={500} className="px-3 py-4" contentClassName="pointer-events-none">
          <AlertPreview
            settings={{
              ...preview.settings,
              messageText: preview.settings?.messageText || DEFAULT_ALERT_TEST_MESSAGE,
            }}
            isPlaying={false}
            externalAnimationStep="display"
            externalIsVisible={true}
          />
        </ScaledWidgetViewport>
      </WidgetPreviewFrame>
    );
  }

  return (
    <WidgetPreviewFrame>
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
        This widget does not have a reusable preview component yet.
      </div>
    </WidgetPreviewFrame>
  );
}

function WidgetUrlCardField({ widgetId, preview }) {
  const { user } = useAuth();
  const isDonatePage = widgetId === 'donate-page';
  const type = WIDGET_URL_TYPES[widgetId];
  const widgetUrl = isDonatePage
    ? preview?.publicUrl || ''
    : type ? createWidgetUrl(type, user?.id, user?.widgetToken) : '';
  const hasRealWidget = isDonatePage ? Boolean(preview?.publicUrl) : Boolean(widgetUrl);

  const handleCopy = async () => {
    if (!widgetUrl) return;
    await navigator.clipboard?.writeText(widgetUrl);
  };

  const handleOpen = () => {
    if (!widgetUrl) return;
    window.open(widgetUrl, '_blank', 'noopener,noreferrer');
  };

  if (!type && !isDonatePage) return null;

  return (
    <div className="mb-4 rounded-xl border border-slate-700/60 bg-slate-950/70 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {isDonatePage ? 'Donate Page URL' : 'Widget URL'}
        </span>
        {!hasRealWidget && (
          <span className="text-[10px] text-slate-500">{isDonatePage ? 'Public Page' : 'Preview URL'}</span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 font-mono text-[11px] text-cyan-200 sm:text-xs">
          <span className="block truncate">{widgetUrl}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 border-slate-700/80 bg-slate-900/70 text-slate-200 shadow-none hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-100"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 border-slate-700/80 bg-slate-900/70 text-slate-200 shadow-none hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-100"
          onClick={handleOpen}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Widgets() {
  const { language } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [donatePageSettings, setDonatePageSettings] = React.useState(defaultDonatePageSettings);
  const {
    widgetPreviews,
    widgetStates,
    ensureWidgetPreviewsLoaded,
    setWidgetState,
    loadedUserId,
    isWidgetPreviewsLoading,
  } = useWidgetPreviews();
  const text = copy[language] || copy.en;

  React.useEffect(() => {
    setDonatePageSettings(loadDonatePageSettings(defaultDonatePageSettings));
  }, []);

  React.useEffect(() => {
    if (isAuthLoading) return;
    ensureWidgetPreviewsLoaded(user?.id ?? null);
  }, [ensureWidgetPreviewsLoaded, isAuthLoading, user?.id]);

  const toggleWidget = (id) => {
    setWidgetState(id, (previous) => !previous);
  };

  const outlineButtonClass =
    'border-slate-700/80 bg-slate-900/70 text-slate-200 shadow-none hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-100';
  const isUsingFreshPreviewData = !user?.id || loadedUserId === user.id;
  const previewLoading = Boolean(user?.id) && (!isUsingFreshPreviewData || isWidgetPreviewsLoading);

  const donatePageUrl = React.useMemo(() => {
    const profileSlug = getProfileSlug(user);

    if (!profileSlug || typeof window === 'undefined') {
      return '';
    }

    return `${window.location.origin}/${profileSlug}`;
  }, [user]);

  const donatePagePreview = React.useMemo(() => ({
    kind: 'donate-page',
    widgetId: null,
    settings: donatePageSettings,
    publicUrl: donatePageUrl,
  }), [donatePageSettings, donatePageUrl]);

  return (
    <div className="w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{text.header.title}</h2>
              <p className="text-slate-400">{text.header.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              {text.previewAll}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border backdrop-blur-xl overflow-hidden transition-all duration-300 ${
              (widget.hasToggle === false || widgetStates[widget.id])
                ? 'border-cyan-500/30'
                : 'border-slate-700/50'
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${widget.gradient} ${(widget.hasToggle === false || widgetStates[widget.id]) ? 'opacity-100' : 'opacity-30'}`} />

            {widget.isPro && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  {text.pro}
                </Badge>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.gradient} ${(widget.hasToggle === false || widgetStates[widget.id]) ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
                  <widget.icon className="w-6 h-6 text-white" />
                </div>
                {widget.hasToggle === false ? (
                  <Badge className="border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
                    {language === 'th' ? 'หน้าสาธารณะ' : 'Public Page'}
                  </Badge>
                ) : (
                  <Switch
                    checked={widgetStates[widget.id]}
                    onCheckedChange={() => toggleWidget(widget.id)}
                    disabled={widget.isPro}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                  />
                )}
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${(widget.hasToggle === false || widgetStates[widget.id]) ? 'text-white' : 'text-slate-400'} transition-colors`}>
                {text.widgets[widget.id].name}
              </h3>
              <p className="text-slate-500 text-sm mb-4">{text.widgets[widget.id].description}</p>

              <WidgetCardPreview
                widgetId={widget.id}
                preview={
                  widget.id === 'donate-page'
                    ? donatePagePreview
                    : widget.id === 'gift-alert'
                      ? (widgetPreviews[widget.id] || { kind: 'gift-alert', widgetId: null, settings: DEFAULT_GIFT_ALERT_PREVIEW_SETTINGS })
                      : previewLoading ? null : widgetPreviews[widget.id]
                }
              />
              <WidgetUrlCardField
                widgetId={widget.id}
                preview={
                  widget.id === 'donate-page'
                    ? donatePagePreview
                    : widget.id === 'gift-alert'
                      ? (widgetPreviews[widget.id] || { kind: 'gift-alert', widgetId: null, settings: DEFAULT_GIFT_ALERT_PREVIEW_SETTINGS })
                      : previewLoading ? null : widgetPreviews[widget.id]
                }
              />

              <div className="flex gap-2">
                {widget.hasSettings && widget.settingsPage && (
                  <Link href={createPageUrl(widget.settingsPage)} className="flex-1">
                    <Button
                      variant="outline"
                      className={`w-full ${outlineButtonClass}`}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {text.settings}
                    </Button>
                  </Link>
                )}
                {widget.hasSettings && !widget.settingsPage && (
                  <Button
                    variant="outline"
                    className={`flex-1 ${outlineButtonClass}`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {text.settings}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">{text.howTo.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {text.howTo.steps.map((step, index) => (
            <div key={step.title} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
                <span className="text-cyan-400 font-bold">{index + 1}</span>
              </div>
              <h4 className="text-white font-medium mb-1">{step.title}</h4>
              <p className="text-slate-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

