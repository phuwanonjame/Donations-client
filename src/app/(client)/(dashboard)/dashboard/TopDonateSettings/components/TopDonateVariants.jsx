// TopDonateVariants.jsx
"use client";
import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { getLayoutStyle } from './TopDonateShared';
import {
  AmountLine,
  CelebrationBurst,
  getCelebrationShakeStyle,
  IconBlock,
  MessageLine,
  NameLine,
  PREVIEW_RANK2,
  PREVIEW_RANK3,
  TitleLine,
} from './TopDonateShared';

// ── Shared bits ───────────────────────────────────────────────────────────
function LaurelWreath({ flip }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/topdonate/laurel-wreath.webp"
      alt=""
      style={{ width: 34, height: 90, objectFit: 'contain', transform: flip ? 'scaleX(-1)' : undefined, flexShrink: 0 }}
    />
  );
}

function CardShell({ settings, isCelebrating, children, style }) {
  return (
    <div
      className="relative rounded-xl p-6 transition-colors duration-200"
      style={{ backgroundColor: settings.backgroundColor, ...style, ...getCelebrationShakeStyle(settings, isCelebrating) }}
    >
      <CelebrationBurst settings={settings} isCelebrating={isCelebrating} />
      {children}
    </div>
  );
}

// ── 1. Classic (original layout) ────────────────────────────────────────────
export function ClassicVariant({ settings, donorName, donorAmount, donorMessage, resolvedTitle, isCelebrating }) {
  const layout = getLayoutStyle(settings.alignment);
  return (
    <CardShell settings={settings} isCelebrating={isCelebrating}>
      <TitleLine settings={settings} resolvedTitle={resolvedTitle} />
      <div style={layout.container}>
        {settings.showIcon && (
          <div className="flex justify-center">
            <IconBlock settings={settings} />
          </div>
        )}
        <div style={layout.textGroup}>
          <NameLine settings={settings} donorName={donorName} />
          <AmountLine settings={settings} donorAmount={donorAmount} />
          <MessageLine settings={settings} donorMessage={donorMessage} />
        </div>
      </div>
    </CardShell>
  );
}

// ── 2. Hero Center Card ──────────────────────────────────────────────────────
export function HeroCenterVariant({ settings, donorName, donorAmount, donorMessage, resolvedTitle, isCelebrating }) {
  const accent = settings.accentColor || '#a855f7';
  return (
    <CardShell settings={settings} isCelebrating={isCelebrating} style={{ textAlign: 'center', paddingTop: 28, paddingBottom: 24 }}>
      <TitleLine settings={settings} resolvedTitle={resolvedTitle} />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: -6 }}>
        <Crown style={{ width: 22, height: 22, color: '#FFD700', animation: 'topDonateCrownFloat 2.2s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <LaurelWreath />
        {settings.showIcon && <IconBlock settings={settings} size={Math.max(getSize(settings), 96)} showCrown={false} />}
        <LaurelWreath flip />
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <NameLine settings={settings} donorName={donorName} align="center" />
        <AmountLine settings={settings} donorAmount={donorAmount} align="center" />
        <div style={{
          marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 16px', borderRadius: 999,
          background: `linear-gradient(90deg, ${accent}, ${settings.iconBgColor2 || '#ec4899'})`,
          color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
          boxShadow: `0 4px 14px ${accent}55`,
        }}>
          #1 Top Donor
        </div>
        <MessageLine settings={settings} donorMessage={donorMessage} />
      </div>
    </CardShell>
  );
}

function getSize(settings) {
  return Array.isArray(settings.iconSize) ? settings.iconSize[0] : (settings.iconSize ?? 80);
}

// ── 3. Neon Glass Spotlight ──────────────────────────────────────────────────
export function NeonGlassVariant({ settings, donorName, donorAmount, donorMessage, isCelebrating }) {
  const accent = settings.accentColor || '#a855f7';
  return (
    <div
      className="relative rounded-2xl p-6 pt-8 text-center transition-colors duration-200"
      style={{
        marginTop: 16,
        backgroundColor: settings.backgroundColor,
        border: `1px solid ${accent}66`,
        boxShadow: `0 0 0 1px ${accent}22, 0 0 30px ${accent}33, inset 0 0 40px ${accent}11`,
        ...getCelebrationShakeStyle(settings, isCelebrating),
      }}
    >
      {/* beams clip to the rounded card shape; kept in their own layer so the
          badge/celebration ribbon below (which must poke above the border) aren't clipped too */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute pointer-events-none" style={{
          top: -40, left: '10%', width: 60, height: 140,
          background: `linear-gradient(180deg, ${accent}55, transparent 80%)`,
          filter: 'blur(6px)',
          animation: 'topDonateSpotlightSweep 4s ease-in-out infinite',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: -40, right: '10%', width: 60, height: 140,
          background: `linear-gradient(180deg, ${accent}55, transparent 80%)`,
          filter: 'blur(6px)',
          animation: 'topDonateSpotlightSweep 4s ease-in-out infinite reverse',
        }} />
      </div>
      <CelebrationBurst settings={settings} isCelebrating={isCelebrating} />
      <div style={{
        position: 'absolute', top: -1, left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 14px', borderRadius: 999,
        background: settings.backgroundColor,
        border: `1px solid ${accent}`,
        color: accent, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
        boxShadow: `0 0 14px ${accent}88`,
        whiteSpace: 'nowrap',
      }}>
        <Sparkles style={{ width: 12, height: 12 }} />
        Top Donation
      </div>
      <div style={{ position: 'relative', zIndex: 2, marginTop: 8 }}>
        {settings.showIcon && (
          <div className="flex justify-center mb-3">
            <IconBlock settings={settings} />
          </div>
        )}
        <NameLine settings={settings} donorName={donorName} align="center" />
        <div style={{ marginTop: 6 }}>
          <AmountLine settings={settings} donorAmount={donorAmount} align="center" />
        </div>
        <MessageLine settings={settings} donorMessage={donorMessage} />
      </div>
    </div>
  );
}

// ── 4. Minimal Premium Banner ────────────────────────────────────────────────
export function MinimalBannerVariant({ settings, donorName, donorAmount, donorMessage, isCelebrating }) {
  const accent = settings.accentColor || '#a855f7';
  return (
    <div
      className="relative rounded-xl transition-colors duration-200"
      style={{
        backgroundColor: settings.backgroundColor,
        border: `1px solid ${accent}33`,
        boxShadow: `0 8px 24px ${accent}22`,
        ...getCelebrationShakeStyle(settings, isCelebrating),
      }}
    >
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      </div>
      <CelebrationBurst settings={settings} isCelebrating={isCelebrating} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px 14px 22px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: accent, marginBottom: 4,
          }}>
            <Crown style={{ width: 12, height: 12 }} />
            Top Donor
          </div>
          <NameLine settings={settings} donorName={donorName} align="left" />
          <div style={{ marginTop: 2 }}>
            <AmountLine settings={settings} donorAmount={donorAmount} align="left" />
          </div>
          {settings.showMessage && (
            <p className="opacity-70" style={{ color: settings.textColor, fontSize: Math.max(11, (Array.isArray(settings.messageFontSize) ? settings.messageFontSize[0] : settings.messageFontSize ?? 18) - 4), margin: '4px 0 0', textAlign: 'left' }}>
              &quot;{donorMessage}&quot;
            </p>
          )}
        </div>
        {settings.showIcon && <IconBlock settings={settings} size={Math.min(getSize(settings), 72)} />}
      </div>
    </div>
  );
}

// ── 5. Trophy Podium Style ───────────────────────────────────────────────────
function PodiumSlot({ rank, donor, settings }) {
  const color = rank === 2 ? '#C0C0C0' : '#CD7F32';
  const height = rank === 2 ? 88 : 74;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#1a1a1a', fontWeight: 900, fontSize: 14,
        boxShadow: `0 4px 10px ${color}66`,
      }}>
        {rank}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: settings.textColor, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {donor?.name ?? '—'}
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color, marginBottom: 4 }}>
        {donor?.amount ?? ''}
      </div>
      <div style={{
        width: '100%', height, borderRadius: '6px 6px 0 0',
        background: `linear-gradient(180deg, ${color}33, ${color}11)`,
        border: `1px solid ${color}55`, borderBottom: 'none',
      }} />
    </div>
  );
}

export function TrophyPodiumVariant({ settings, donorName, donorAmount, donorMessage, resolvedTitle, isCelebrating }) {
  const accent = settings.accentColor || '#FFD700';
  return (
    <CardShell settings={settings} isCelebrating={isCelebrating} style={{ textAlign: 'center' }}>
      <TitleLine settings={settings} resolvedTitle={resolvedTitle} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10 }}>
        <PodiumSlot rank={2} donor={PREVIEW_RANK2} settings={settings} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1.2, minWidth: 0 }}>
          <Crown style={{ width: 26, height: 26, color: accent, animation: 'topDonateCrownFloat 2.2s ease-in-out infinite' }} />
          {settings.showIcon && <IconBlock settings={settings} size={Math.min(getSize(settings), 84)} showCrown={false} />}
          <NameLine settings={settings} donorName={donorName} align="center" />
          <AmountLine settings={settings} donorAmount={donorAmount} align="center" />
          <div style={{
            width: '100%', height: 108, marginTop: 4, borderRadius: '8px 8px 0 0',
            background: `linear-gradient(180deg, ${accent}44, ${accent}11)`,
            border: `1px solid ${accent}77`, borderBottom: 'none',
          }} />
        </div>
        <PodiumSlot rank={3} donor={PREVIEW_RANK3} settings={settings} />
      </div>
      <MessageLine settings={settings} donorMessage={donorMessage} />
      <p className="opacity-50" style={{ fontSize: 11, color: settings.textColor, marginTop: 8 }}>
        อันดับ 2-3 เป็นข้อมูลตัวอย่างสำหรับพรีวิวเท่านั้น
      </p>
    </CardShell>
  );
}

// ── 6. Circular Profile Focus ────────────────────────────────────────────────
export function CircularProfileVariant({ settings, donorName, donorAmount, donorMessage, resolvedTitle, isCelebrating }) {
  const accent = settings.accentColor || '#a855f7';
  const ringBase = Math.max(getSize(settings), 90);
  return (
    <CardShell settings={settings} isCelebrating={isCelebrating} style={{ textAlign: 'center' }}>
      <TitleLine settings={settings} resolvedTitle={resolvedTitle} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: ringBase + 40 }}>
        {[1.55, 1.3].map((scale, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            width: ringBase * scale, height: ringBase * scale,
            border: `1px dashed ${accent}55`,
          }} />
        ))}
        {settings.showIcon && <IconBlock settings={settings} />}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          padding: '3px 12px', borderRadius: 999,
          background: settings.backgroundColor, border: `1px solid ${accent}`,
          color: accent, fontSize: 11, fontWeight: 800,
        }}>
          #1
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <NameLine settings={settings} donorName={donorName} align="center" />
        <AmountLine settings={settings} donorAmount={donorAmount} align="center" />
        <MessageLine settings={settings} donorMessage={donorMessage} />
      </div>
    </CardShell>
  );
}

// ── 7. Compact Overlay Strip ─────────────────────────────────────────────────
export function CompactStripVariant({ settings, donorName, donorAmount, isCelebrating }) {
  const accent = settings.accentColor || '#a855f7';
  return (
    <div
      className="relative flex items-center gap-3 rounded-full transition-colors duration-200"
      style={{
        backgroundColor: settings.backgroundColor,
        border: `1px solid ${accent}55`,
        padding: '8px 16px 8px 8px',
        boxShadow: `0 6px 18px ${accent}22`,
        width: '100%',
        boxSizing: 'border-box',
        ...getCelebrationShakeStyle(settings, isCelebrating),
      }}
    >
      <CelebrationBurst settings={settings} isCelebrating={isCelebrating} />
      {settings.showIcon && <IconBlock settings={settings} size={Math.min(getSize(settings), 44)} />}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 999, background: `${accent}22`,
        color: accent, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        Top
      </div>
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        <NameLine settings={settings} donorName={donorName} align="left" truncate />
      </div>
      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <AmountLine settings={settings} donorAmount={donorAmount} align="right" />
      </div>
    </div>
  );
}

export const TOP_DONATE_VARIANT_MAP = {
  classic: ClassicVariant,
  'hero-center': HeroCenterVariant,
  'neon-glass': NeonGlassVariant,
  'minimal-banner': MinimalBannerVariant,
  'trophy-podium': TrophyPodiumVariant,
  'circular-profile': CircularProfileVariant,
  'compact-strip': CompactStripVariant,
};
