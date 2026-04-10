'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { timeRanges as TIME_RANGES } from '../constants/donate-leaderboard';

const RANK_STYLES = {
  1: { color: '#FFD700', glow: 'rgba(255,215,0,0.5)', bg: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))', border: 'rgba(255,215,0,0.6)' },
  2: { color: '#C0C0C0', glow: 'rgba(192,192,192,0.4)', bg: 'linear-gradient(135deg, rgba(192,192,192,0.15), rgba(192,192,192,0.05))', border: 'rgba(192,192,192,0.5)' },
  3: { color: '#CD7F32', glow: 'rgba(205,127,50,0.4)', bg: 'linear-gradient(135deg, rgba(205,127,50,0.15), rgba(205,127,50,0.05))', border: 'rgba(205,127,50,0.5)' },
};

const SAMPLE_LEADERBOARD = [
  { rank: 1, name: 'SuperFan123', amount: 5000 },
  { rank: 2, name: 'BigSupporter', amount: 3500 },
  { rank: 3, name: 'GoldenDonor', amount: 2000 },
  { rank: 4, name: 'CoolViewer', amount: 1500 },
  { rank: 5, name: 'NicePerson', amount: 1000 },
];

const getStrokeStyle = (strokeWidth, strokeColor) =>
  strokeWidth && strokeWidth !== '0px' && strokeColor && strokeColor !== '#00000000'
    ? { WebkitTextStroke: `${strokeWidth} ${strokeColor}`, textStroke: `${strokeWidth} ${strokeColor}` }
    : {};

const normalizeFontWeight = (weight) => {
  if (typeof weight === 'number') return `${weight}`;
  const normalized = String(weight || '').trim().toLowerCase();
  const weightMap = {
    thin: '100',
    extralight: '200',
    'extra-light': '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    'semi-bold': '600',
    bold: '700',
    extrabold: '800',
    'extra-bold': '800',
    black: '900',
  };
  return weightMap[normalized] || weight || '400';
};

const getTimeRangeLabel = (timeRange) =>
  TIME_RANGES.find(item => item.id === timeRange)?.name || '';

const useHighlight = (highlightKey, targetKeys) => {
  const [isActive, setIsActive] = React.useState(false);
  React.useEffect(() => {
    if (highlightKey && targetKeys.includes(highlightKey)) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 900);
      return () => clearTimeout(timer);
    }
  }, [highlightKey, targetKeys]);
  return isActive;
};

const Avatar = memo(({ name, rank, size = 42, accentColor }) => {
  const rs = RANK_STYLES[rank];
  const gradientBg = rs
    ? rs.bg
    : `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`;

  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold select-none relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: gradientBg,
        border: `2px solid ${rs ? rs.border : `${accentColor}50`}`,
        color: rs ? rs.color : accentColor,
        fontSize: size * 0.4,
        boxShadow: rs ? `0 0 20px ${rs.glow}, inset 0 0 20px rgba(255,255,255,0.1)` : `0 0 15px ${accentColor}50, inset 0 0 15px rgba(255,255,255,0.1)`,
      }}
    >
      {name[0]?.toUpperCase()}
      <div
        className="absolute inset-0 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%)' }}
      />
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{ background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)' }}
      />
    </div>
  );
});
Avatar.displayName = 'Avatar';

const RankBadge = memo(({ rank, accentColor }) => {
  const rs = RANK_STYLES[rank];
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold relative overflow-hidden"
      style={{
        width: 32,
        height: 32,
        background: rs ? rs.bg : `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
        border: `2px solid ${rs ? rs.border : `${accentColor}50`}`,
        color: rs ? rs.color : accentColor,
        fontSize: 14,
        boxShadow: rs ? `0 0 15px ${rs.glow}, inset 0 0 10px rgba(255,255,255,0.2)` : `0 0 10px ${accentColor}50, inset 0 0 10px rgba(255,255,255,0.2)`,
      }}
    >
      {rank}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6), transparent)' }}
      />
    </div>
  );
});
RankBadge.displayName = 'RankBadge';

const TitleBlock = memo(({ settings, highlightKey }) => {
  const isHighlight = useHighlight(highlightKey, [
    'titleText',
    'titleColor',
    'titleFontFamily',
    'titleFontWeight',
    'titleFontSize',
    'titleAlignment',
    'titleStrokeWidth',
    'titleStrokeColor',
  ]);

  const timeRangeLabel = getTimeRangeLabel(settings?.timeRange);

  return (
    <div className={`relative mb-6 ${isHighlight ? 'shadow-[0_0_40px_rgba(245,158,11,0.3)]' : ''}`}>
      <motion.div
        className="relative inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-2xl border border-white/20"
        whileHover={{ scale: 1.02 }}
        style={{
          color: settings?.titleColor,
          fontSize: settings?.titleFontSize,
          fontFamily: settings?.titleFontFamily,
          fontWeight: normalizeFontWeight(settings?.titleFontWeight),
          textAlign: settings?.titleAlignment,
          ...getStrokeStyle(settings?.titleStrokeWidth, settings?.titleStrokeColor),
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 32px rgba(255,255,255,0.1)',
        }}
      >
        {settings?.titleText}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 animate-pulse" />
      </motion.div>
      {timeRangeLabel && (
        <div className="mt-3 text-sm text-slate-300 font-medium">{timeRangeLabel}</div>
      )}
    </div>
  );
});
TitleBlock.displayName = 'TitleBlock';

const PodiumSlot = memo(({
  entry,
  avatarSize,
  barHeight,
  paddingBottom = 0,
  config,
  rank,
  settings,
  highlightKey,
  animateEntries,
}) => {
  if (!entry) return <div className="flex-1" />;
  const rs = RANK_STYLES[entry.rank];

  const highlightKeys =
    rank === 1
      ? [
          'podiumFirstFontFamily',
          'podiumFirstFontWeight',
          'podiumFirstUsernameFontSize',
          'podiumFirstUsernameColor',
          'podiumFirstAmountFontSize',
          'podiumFirstAmountColor',
          'podiumFirstStrokeWidth',
          'podiumFirstStrokeColor',
          'podiumFirstShine',
        ]
      : rank === 2
      ? [
          'podiumSecondFontFamily',
          'podiumSecondFontWeight',
          'podiumSecondUsernameFontSize',
          'podiumSecondUsernameColor',
          'podiumSecondAmountFontSize',
          'podiumSecondAmountColor',
          'podiumSecondStrokeWidth',
          'podiumSecondStrokeColor',
        ]
      : [
          'podiumThirdFontFamily',
          'podiumThirdFontWeight',
          'podiumThirdUsernameFontSize',
          'podiumThirdUsernameColor',
          'podiumThirdAmountFontSize',
          'podiumThirdAmountColor',
          'podiumThirdStrokeWidth',
          'podiumThirdStrokeColor',
        ];

  const isHighlight = useHighlight(highlightKey, highlightKeys);

  return (
    <motion.div
      layout
      initial={animateEntries ? { opacity: 0, y: 20, scale: 0.9 } : false}
      animate={animateEntries ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      layoutId={`podium-${entry.rank}`}
      className={`flex flex-col items-center relative rounded-3xl overflow-hidden border border-white/20 ${isHighlight ? 'shadow-[0_0_40px_rgba(245,158,11,0.3)]' : ''}`}
      style={{
        paddingBottom,
        background: rs ? rs.bg : `linear-gradient(135deg, ${settings?.accentColor || '#f59e0b'}20, rgba(15,23,42,0.9))`,
        boxShadow: rs ? `0 20px 60px ${rs.glow}, inset 0 0 60px rgba(255,255,255,0.1)` : `0 15px 50px ${settings?.accentColor || '#f59e0b'}40, inset 0 0 50px rgba(255,255,255,0.1)`,
      }}
    >
      {entry.rank === 1 && settings?.podiumFirstShine && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[-40px] left-1/2 -translate-x-1/2 rounded-full blur-3xl"
          style={{ width: avatarSize * 2.2, height: avatarSize * 2.2, background: rs?.glow, zIndex: 0 }}
        />
      )}
      <div className="relative z-10 mt-6 mb-4">
        <Avatar name={entry.name} rank={entry.rank} size={avatarSize} accentColor={settings?.accentColor || '#f59e0b'} />
      </div>
      <div
        className="w-full flex flex-col items-center justify-end px-5 pb-5 rounded-t-3xl border-b border-white/20"
        style={{
          minHeight: barHeight,
          background: `linear-gradient(180deg, ${rs?.color || settings?.accentColor}20, transparent)`,
        }}
      >
        <div
          className="truncate w-full text-center mb-2 text-base font-semibold"
          style={{
            color: config?.usernameColor,
            fontSize: config?.usernameFontSize,
            fontFamily: config?.fontFamily,
            fontWeight: normalizeFontWeight(config?.fontWeight),
            ...getStrokeStyle(config?.strokeWidth, config?.strokeColor),
          }}
        >
          {entry.name}
        </div>
        {settings?.showAmount && (
          <div
            className="text-lg font-bold"
            style={{
              color: config?.amountColor,
              fontSize: config?.amountFontSize,
              fontWeight: normalizeFontWeight(config?.fontWeight),
              ...getStrokeStyle(config?.strokeWidth, config?.strokeColor),
            }}
          >
            ฿{entry.amount.toLocaleString()}
          </div>
        )}
      </div>
      <div className="w-full text-center text-sm font-bold py-4" style={{ background: `linear-gradient(135deg, ${rs?.color || settings?.accentColor}30, ${rs?.color || settings?.accentColor}10)`, color: rs?.color || settings?.accentColor }}>
        Rank {entry.rank}
      </div>
    </motion.div>
  );
});
PodiumSlot.displayName = 'PodiumSlot';

const ListItem = memo(({ entry, settings, highlightKey, isTop3, rs, animateEntries }) => {
  const isHighlight = useHighlight(highlightKey, [
    'listFontFamily',
    'listFontWeight',
    'listFontSize',
    'listColor',
    'listAmountColor',
    'listStrokeWidth',
    'listStrokeColor',
    'showRank',
    'showAvatar',
    'showAmount',
  ]);

  return (
    <motion.div
      layout
      initial={animateEntries ? { opacity: 0, y: 18, scale: 0.95 } : false}
      animate={animateEntries ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      layoutId={`list-${entry.rank}`}
      className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.25)] transition-all ${isHighlight ? 'ring-2 ring-amber-400/50' : ''}`}
      style={{
        background: isTop3 ? rs.bg : 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))',
        border: `1px solid ${isTop3 ? rs.border : 'rgba(255,255,255,0.1)'}`,
        boxShadow: isTop3 ? `0 15px 50px ${rs.glow}, inset 0 0 50px rgba(255,255,255,0.1)` : '0 10px 40px rgba(0,0,0,0.3), inset 0 0 40px rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        {settings?.showRank && <RankBadge rank={entry.rank} accentColor={settings?.accentColor || '#f59e0b'} />}
        {settings?.showAvatar && <Avatar name={entry.name} rank={entry.rank} size={36} accentColor={settings?.accentColor || '#f59e0b'} />}
        <span
          className="truncate text-base font-medium"
          style={{
            color: settings?.listColor,
            fontSize: settings?.listFontSize,
            fontFamily: settings?.listFontFamily,
            fontWeight: normalizeFontWeight(settings?.listFontWeight),
            ...getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor),
          }}
        >
          {entry.name}
        </span>
      </div>
      {settings?.showAmount && (
        <span
          className="whitespace-nowrap font-bold text-lg"
          style={{
            color: isTop3 ? rs.color : settings?.listAmountColor,
            fontSize: settings?.listFontSize,
            fontWeight: normalizeFontWeight(settings?.listFontWeight),
            textShadow: isTop3 ? `0 0 15px ${rs.glow}` : 'none',
            ...getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor),
          }}
        >
          ฿{entry.amount.toLocaleString()}
        </span>
      )}
    </motion.div>
  );
});
ListItem.displayName = 'ListItem';

const OtherListItem = memo(({ entry, settings, highlightKey, animateEntries }) => {
  const isHighlight = useHighlight(highlightKey, [
    'listFontFamily',
    'listFontWeight',
    'listFontSize',
    'listColor',
    'listAmountColor',
    'listStrokeWidth',
    'listStrokeColor',
  ]);

  return (
    <motion.div
      layout
      initial={animateEntries ? { opacity: 0, y: 18, scale: 0.95 } : false}
      animate={animateEntries ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      layoutId={`other-${entry.rank}`}
      className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-all ${isHighlight ? 'ring-2 ring-amber-400/50' : ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 40px rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        {settings?.showRank && <RankBadge rank={entry.rank} accentColor={settings?.accentColor || '#f59e0b'} />}
        <span
          className="truncate text-base font-medium"
          style={{
            color: settings?.listColor,
            fontFamily: settings?.listFontFamily,
            fontSize: settings?.listFontSize,
            fontWeight: normalizeFontWeight(settings?.listFontWeight),
            ...getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor),
          }}
        >
          {entry.name}
        </span>
      </div>
      {settings?.showAmount && (
        <span
          className="whitespace-nowrap font-bold text-lg"
          style={{
            color: settings?.listAmountColor,
            fontSize: settings?.listFontSize,
            fontWeight: normalizeFontWeight(settings?.listFontWeight),
            ...getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor),
          }}
        >
          ฿{entry.amount.toLocaleString()}
        </span>
      )}
    </motion.div>
  );
});
OtherListItem.displayName = 'OtherListItem';

function LeaderboardPreview({ settings = {}, entries = SAMPLE_LEADERBOARD, highlightKey }) {
  const displayedEntries = useMemo(() => entries.slice(0, settings.maxEntries || 5), [entries, settings.maxEntries]);
  const isHorizontal = settings.layoutStyle === 'horizontal';
  const isPodium = settings.layoutStyle === 'podium';
  const animateEntries = settings.animateEntries;
  const enabled = settings.enabled !== false;
  const accentColor = settings.accentColor || '#f59e0b';
  const backgroundColor = settings.backgroundColor || '#0f172a';
  const maxAmount = Math.max(...displayedEntries.map(entry => entry.amount), 1);

  useEffect(() => {
    if (!document.getElementById('leaderboard-preview-style')) {
      const style = document.createElement('style');
      style.id = 'leaderboard-preview-style';
      style.innerHTML = `
        @keyframes gentlePulse {
          0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 0 15px rgba(245,158,11,0.1); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        .leaderboard-preview-highlight {
          animation: gentlePulse 1s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const wrapperStyle = {
    backgroundColor: 'transparent',
  };

  const renderHorizontal = () => (
    <div className="space-y-5">
      {displayedEntries.map((entry) => {
        const rs = RANK_STYLES[entry.rank];
        const barWidth = Math.max(15, (entry.amount / maxAmount) * 100);

        return (
          <motion.div
            key={entry.rank}
            initial={animateEntries ? { opacity: 0, x: -25, scale: 0.95 } : false}
            animate={animateEntries ? { opacity: 1, x: 0, scale: 1 } : undefined}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-2xl bg-gradient-to-r from-slate-950/90 to-slate-900/80 border border-white/15 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            style={{ boxShadow: '0 15px 50px rgba(0,0,0,0.3), inset 0 0 50px rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-4">
              {settings?.showRank && <RankBadge rank={entry.rank} accentColor={accentColor} />}
              {settings?.showAvatar && <Avatar name={entry.name} rank={entry.rank} size={36} accentColor={accentColor} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span
                    className="truncate font-semibold text-lg"
                    style={{
                      color: settings?.listColor,
                      fontFamily: settings?.listFontFamily,
                      fontSize: settings?.listFontSize,
                      fontWeight: normalizeFontWeight(settings?.listFontWeight),
                      ...getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor),
                    }}
                  >
                    {entry.name}
                  </span>
                  {settings?.showAmount && (
                    <span
                      className="whitespace-nowrap font-bold text-xl"
                      style={{
                        color: settings?.listAmountColor,
                        fontSize: settings?.listFontSize,
                        fontWeight: normalizeFontWeight(settings?.listFontWeight),
                        ...getStrokeStyle(settings?.listStrokeWidth, settings?.listStrokeColor),
                      }}
                    >
                      ฿{entry.amount.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="h-3 rounded-full bg-white/15 overflow-hidden" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)` }}
                    initial={animateEntries ? { width: 0 } : false}
                    animate={animateEntries ? { width: `${barWidth}%` } : undefined}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderClassic = () => (
    <div className="space-y-4">
      {displayedEntries.map((entry) => {
        const rs = RANK_STYLES[entry.rank];
        const isTop3 = !!rs;
        return (
          <ListItem
            key={entry.rank}
            entry={entry}
            settings={settings}
            highlightKey={highlightKey}
            isTop3={isTop3}
            rs={rs || { color: accentColor, glow: `${accentColor}50`, bg: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`, border: `${accentColor}50` }}
            animateEntries={animateEntries}
          />
        );
      })}
    </div>
  );

  const renderPodium = () => {
    const podiumMap = Object.fromEntries(displayedEntries.map(e => [e.rank, e]));
    const others = displayedEntries.filter(e => e.rank > 3);

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-center gap-6">
          <PodiumSlot
            entry={podiumMap[2]}
            avatarSize={48}
            barHeight={95}
            rank={2}
            settings={settings}
            highlightKey={highlightKey}
            animateEntries={animateEntries}
            config={{
              fontFamily: settings?.podiumSecondFontFamily,
              fontWeight: settings?.podiumSecondFontWeight,
              usernameFontSize: settings?.podiumSecondUsernameFontSize,
              usernameColor: settings?.podiumSecondUsernameColor,
              amountFontSize: settings?.podiumSecondAmountFontSize,
              amountColor: settings?.podiumSecondAmountColor,
              strokeWidth: settings?.podiumSecondStrokeWidth,
              strokeColor: settings?.podiumSecondStrokeColor,
            }}
          />
          <PodiumSlot
            entry={podiumMap[1]}
            avatarSize={68}
            barHeight={125}
            paddingBottom="2rem"
            rank={1}
            settings={settings}
            highlightKey={highlightKey}
            animateEntries={animateEntries}
            config={{
              fontFamily: settings?.podiumFirstFontFamily,
              fontWeight: settings?.podiumFirstFontWeight,
              usernameFontSize: settings?.podiumFirstUsernameFontSize,
              usernameColor: settings?.podiumFirstUsernameColor,
              amountFontSize: settings?.podiumFirstAmountFontSize,
              amountColor: settings?.podiumFirstAmountColor,
              strokeWidth: settings?.podiumFirstStrokeWidth,
              strokeColor: settings?.podiumFirstStrokeColor,
            }}
          />
          <PodiumSlot
            entry={podiumMap[3]}
            avatarSize={46}
            barHeight={85}
            rank={3}
            settings={settings}
            highlightKey={highlightKey}
            animateEntries={animateEntries}
            config={{
              fontFamily: settings?.podiumThirdFontFamily,
              fontWeight: settings?.podiumThirdFontWeight,
              usernameFontSize: settings?.podiumThirdUsernameFontSize,
              usernameColor: settings?.podiumThirdUsernameColor,
              amountFontSize: settings?.podiumThirdAmountFontSize,
              amountColor: settings?.podiumThirdAmountColor,
              strokeWidth: settings?.podiumThirdStrokeWidth,
              strokeColor: settings?.podiumThirdStrokeColor,
            }}
          />
        </div>
        <div className="space-y-4">
          {others.map(entry => (
            <OtherListItem
              key={entry.rank}
              entry={entry}
              settings={settings}
              highlightKey={highlightKey}
              animateEntries={animateEntries}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative overflow-hidden"
      style={wrapperStyle}
    >
      <div className="relative z-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/10 text-white shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider text-amber-300 font-semibold">Leaderboard Preview</p>
                  <h2 className="text-2xl font-bold text-white">Top Supporters</h2>
                </div>
              </div>
              <span className="rounded-full border border-white/20 bg-slate-900/90 px-5 py-3 text-sm uppercase tracking-wider text-slate-200 font-medium">
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-white/10 px-4 py-2 border border-white/10">Layout: {settings.layoutStyle || 'podium'}</span>
              <span className="rounded-full bg-white/10 px-4 py-2 border border-white/10">Entries: {displayedEntries.length}</span>
              <span className="rounded-full bg-white/10 px-4 py-2 border border-white/10">Accent: {accentColor}</span>
            </div>
          </div>

          {!enabled ? (
            <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-950/95 p-10 text-center">
              <p className="text-xl font-bold text-white">Leaderboard is disabled</p>
              <p className="mt-3 text-base text-slate-400">เปิดใช้งานเพื่อดูตัวอย่างการปรับแต่งทั้งหมด</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-6 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
              <TitleBlock settings={settings} highlightKey={highlightKey} />

              {isHorizontal && renderHorizontal()}
              {!isHorizontal && !isPodium && renderClassic()}
              {isPodium && renderPodium()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MemoizedLeaderboardPreview = memo(LeaderboardPreview);
MemoizedLeaderboardPreview.displayName = 'LeaderboardPreview';

export default MemoizedLeaderboardPreview;