import React, { memo } from 'react';
import { motion } from 'framer-motion';

// --- Constants (คงเดิม) ---
const RANK_STYLES = {
  1: { color: '#FFD700', glow: 'rgba(255,215,0,0.6)', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.4)' },
  2: { color: '#C0C0C0', glow: 'rgba(192,192,192,0.5)', bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.3)' },
  3: { color: '#CD7F32', glow: 'rgba(205,127,50,0.5)', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.3)' },
};

const SAMPLE_LEADERBOARD = [
  { rank: 1, name: 'SuperFan123',   amount: 5000 },
  { rank: 2, name: 'BigSupporter',  amount: 3500 },
  { rank: 3, name: 'GoldenDonor',   amount: 2000 },
  { rank: 4, name: 'CoolViewer',    amount: 1500 },
  { rank: 5, name: 'NicePerson',    amount: 1000 },
];

// --- Helpers (คงเดิม) ---
const getStrokeStyle = (strokeWidth, strokeColor) =>
  strokeWidth && strokeWidth !== '0px' && strokeColor && strokeColor !== '#00000000'
    ? { WebkitTextStroke: `${strokeWidth} ${strokeColor}`, textStroke: `${strokeWidth} ${strokeColor}` }
    : {};

// --- Sub-components (memoized) (คงเดิม) ---
const Avatar = memo(({ name, rank, size = 40, accentColor }) => {
  const rs = RANK_STYLES[rank];
  const gradientBg = rs
    ? `radial-gradient(circle at 30% 30%, ${rs.color}40, ${rs.color}10)`
    : `radial-gradient(circle at 30% 30%, ${accentColor}30, ${accentColor}05)`;
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold shrink-0 select-none relative"
      style={{
        width: size, height: size,
        background: gradientBg,
        border: `2px solid ${rs ? rs.border : accentColor + '40'}`,
        color: rs ? rs.color : accentColor,
        fontSize: size * 0.38,
        boxShadow: rs ? `0 0 15px ${rs.glow}, inset 0 0 5px ${rs.glow}` : `0 0 8px ${accentColor}40`,
        backdropFilter: 'blur(4px)',
      }}
    >
      {name[0].toUpperCase()}
      <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'radial-gradient(circle at 20% 20%, white, transparent)' }} />
    </div>
  );
});

const RankBadge = memo(({ rank, accentColor }) => {
  const rs = RANK_STYLES[rank];
  return (
    <div
      className="flex items-center justify-center rounded-lg font-black shrink-0 backdrop-blur-sm"
      style={{
        width: 26, height: 26,
        background: rs ? `linear-gradient(145deg, ${rs.color}20, ${rs.color}05)` : `${accentColor}15`,
        border: `1px solid ${rs ? rs.border : accentColor + '30'}`,
        color: rs ? rs.color : accentColor,
        fontSize: 11,
        boxShadow: rs ? `0 0 8px ${rs.glow}` : 'none',
      }}
    >
      {rank}
    </div>
  );
});

// --- Main Component (ปรับปรุงใหม่) ---
function LeaderboardPreview({ settings, entries = SAMPLE_LEADERBOARD }) {
  const displayedEntries = entries.slice(0, settings.maxEntries);

  const backgroundPattern = {
    backgroundImage: `linear-gradient(${settings.accentColor}08 1px, transparent 1px), linear-gradient(to right, ${settings.accentColor}08 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
  };

  const TitleBlock = () => (
    <div
      className="relative mb-8"
      style={{
        color: settings.titleColor,
        fontSize: settings.titleFontSize,
        fontFamily: settings.titleFontFamily,
        fontWeight: settings.titleFontWeight,
        textAlign: settings.titleAlignment,
        ...getStrokeStyle(settings.titleStrokeWidth, settings.titleStrokeColor),
      }}
    >
      <span className="relative z-10 drop-shadow-md">{settings.titleText}</span>
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-0.5 w-1/2 opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${settings.accentColor}, transparent)`,
          boxShadow: `0 0 10px ${settings.accentColor}`,
        }}
      />
    </div>
  );

  // --- Podium Layout (ปรับให้ใช้ layout animation) ---
  if (settings.layoutStyle === 'podium') {
    const podiumMap = Object.fromEntries(displayedEntries.map(e => [e.rank, e]));
    const others = displayedEntries.filter(e => e.rank > 3);

    const PodiumSlot = ({ entry, avatarSize, barHeight, paddingBottom = 0, config, delay }) => {
      if (!entry) return <div className="flex-1" />;
      const rs = RANK_STYLES[entry.rank];
      return (
        <motion.div
          layout
          layoutId={`podium-${entry.rank}`} // สำคัญ: ทำให้ animation ต่อเนื่องเมื่อตำแหน่งเปลี่ยน
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex flex-col items-center relative flex-1"
          style={{ paddingBottom }}
        >
          {entry.rank === 1 && settings.podiumFirstShine && (
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 blur-2xl rounded-full"
              style={{ width: avatarSize * 1.5, height: avatarSize * 1.5, background: rs.glow, zIndex: 0 }}
            />
          )}
          <div className="relative z-10 mb-3">
            <Avatar name={entry.name} rank={entry.rank} size={avatarSize} accentColor={settings.accentColor} />
          </div>
          <div
            className="w-full flex flex-col items-center justify-end rounded-t-2xl p-2 relative overflow-hidden backdrop-blur-md"
            style={{
              height: barHeight,
              background: `linear-gradient(180deg, ${rs.color}20, ${rs.color}05)`,
              border: `1.5px solid ${rs.color}30`,
              borderBottom: 'none',
            }}
          >
            <div
              className="truncate w-full text-center font-bold"
              style={{
                color: config.usernameColor,
                fontSize: config.usernameFontSize,
                fontFamily: config.fontFamily,
                fontWeight: config.fontWeight,
                ...getStrokeStyle(config.strokeWidth, config.strokeColor),
              }}
            >
              {entry.name}
            </div>
            {settings.showAmount && (
              <div className="font-bold mt-1" style={{ color: config.amountColor, fontSize: config.amountFontSize }}>
                ฿{entry.amount.toLocaleString()}
              </div>
            )}
          </div>
          <div className="w-full text-center text-[10px] font-bold py-1 rounded-b-xl" style={{ background: `${rs.color}20`, color: rs.color }}>
            #{entry.rank}
          </div>
        </motion.div>
      );
    };

    return (
      <div className="rounded-3xl p-6 transition-all duration-500" style={{ backgroundColor: settings.backgroundColor, ...backgroundPattern }}>
        <TitleBlock />
        <motion.div layout className="flex justify-center items-end gap-3 mb-6">
          <PodiumSlot
            entry={podiumMap[2]} avatarSize={48} barHeight={80} delay={0.2}
            config={{
              fontFamily: settings.podiumSecondFontFamily,
              fontWeight: settings.podiumSecondFontWeight,
              usernameFontSize: settings.podiumSecondUsernameFontSize,
              usernameColor: settings.podiumSecondUsernameColor,
              amountFontSize: settings.podiumSecondAmountFontSize,
              amountColor: settings.podiumSecondAmountColor,
              strokeWidth: settings.podiumSecondStrokeWidth,
              strokeColor: settings.podiumSecondStrokeColor,
            }}
          />
          <PodiumSlot
            entry={podiumMap[1]} avatarSize={64} barHeight={110} paddingBottom="1.5rem" delay={0.1}
            config={{
              fontFamily: settings.podiumFirstFontFamily,
              fontWeight: settings.podiumFirstFontWeight,
              usernameFontSize: settings.podiumFirstUsernameFontSize,
              usernameColor: settings.podiumFirstUsernameColor,
              amountFontSize: settings.podiumFirstAmountFontSize,
              amountColor: settings.podiumFirstAmountColor,
              strokeWidth: settings.podiumFirstStrokeWidth,
              strokeColor: settings.podiumFirstStrokeColor,
            }}
          />
          <PodiumSlot
            entry={podiumMap[3]} avatarSize={40} barHeight={60} delay={0.3}
            config={{
              fontFamily: settings.listFontFamily,
              fontWeight: settings.listFontWeight,
              usernameFontSize: settings.listFontSize,
              usernameColor: settings.listColor,
              amountFontSize: settings.listFontSize,
              amountColor: settings.listAmountColor,
              strokeWidth: settings.listStrokeWidth,
              strokeColor: settings.listStrokeColor,
            }}
          />
        </motion.div>
        <motion.div layout className="space-y-2">
          {others.map(entry => (
            <motion.div
              key={entry.rank}
              layout
              layoutId={`other-${entry.rank}`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                {settings.showRank && <RankBadge rank={entry.rank} accentColor={settings.accentColor} />}
                <span style={{ color: settings.listColor, fontFamily: settings.listFontFamily, fontSize: settings.listFontSize }}>
                  {entry.name}
                </span>
              </div>
              {settings.showAmount && (
                <span className="font-bold" style={{ color: settings.listAmountColor, fontSize: settings.listFontSize }}>
                  ฿{entry.amount.toLocaleString()}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  // --- Vertical Layout (ปรับให้ใช้ layout animation) ---
  return (
    <div className="rounded-3xl p-6 transition-all duration-500" style={{ backgroundColor: settings.backgroundColor, ...backgroundPattern }}>
      <TitleBlock />
      <motion.div layout className="space-y-3">
        {displayedEntries.map((entry) => {
          const rs = RANK_STYLES[entry.rank];
          const isTop3 = !!rs;
          return (
            <motion.div
              key={entry.rank}
              layout
              layoutId={`list-${entry.rank}`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center justify-between px-4 py-3 rounded-2xl backdrop-blur-md group relative overflow-hidden"
              style={{
                background: isTop3 ? `linear-gradient(90deg, ${rs.color}15, transparent)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isTop3 ? rs.color + '40' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <div className="flex items-center gap-4 relative z-10">
                {settings.showRank && <RankBadge rank={entry.rank} accentColor={settings.accentColor} />}
                {settings.showAvatar && <Avatar name={entry.name} rank={entry.rank} size={36} accentColor={settings.accentColor} />}
                <span
                  className="truncate font-semibold"
                  style={{
                    color: settings.listColor,
                    fontSize: settings.listFontSize,
                    fontFamily: settings.listFontFamily,
                    fontWeight: settings.listFontWeight,
                    ...getStrokeStyle(settings.listStrokeWidth, settings.listStrokeColor),
                  }}
                >
                  {entry.name}
                </span>
              </div>
              {settings.showAmount && (
                <span
                  className="font-bold relative z-10"
                  style={{
                    color: isTop3 ? rs.color : settings.listAmountColor,
                    fontSize: settings.listFontSize,
                    textShadow: isTop3 ? `0 0 10px ${rs.glow}` : 'none',
                  }}
                >
                  ฿{entry.amount.toLocaleString()}
                </span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default memo(LeaderboardPreview);