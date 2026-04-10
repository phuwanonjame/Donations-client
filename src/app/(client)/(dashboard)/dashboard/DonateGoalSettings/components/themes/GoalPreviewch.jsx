// components/GoalPreview.jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { resolveText, calculatePercentage, calculateDaysRemaining } from '../utils/donate-goal';

const MOUSE_ANIMATION_URL =
  'https://lottie.host/648e644f-cedb-4bdb-bab1-b86946e8ad66/8TEyRN0Rwb.lottie';

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:wght@400;600&display=swap');
  @keyframes shimmerBar {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
  @keyframes floatMouse {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50%       { transform: translateX(-50%) translateY(-5px); }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('cny-goal-v2-styles')) {
  const s = document.createElement('style');
  s.id = 'cny-goal-v2-styles';
  s.textContent = KEYFRAMES;
  document.head.appendChild(s);
}

// ─── Corner Ornament ─────────────────────────────────────────────────────────
const CornerOrnament = ({ pos }) => {
  const base = {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#c9960c',
    borderStyle: 'solid',
    opacity: 0.6,
    zIndex: 5,
  };
  const corners = {
    topLeft:     { top: 12, left: 12,   borderWidth: '2px 0 0 2px', borderRadius: '6px 0 0 0' },
    topRight:    { top: 12, right: 12,  borderWidth: '2px 2px 0 0', borderRadius: '0 6px 0 0' },
    bottomLeft:  { bottom: 12, left: 12,  borderWidth: '0 0 2px 2px', borderRadius: '0 0 0 6px' },
    bottomRight: { bottom: 12, right: 12, borderWidth: '0 2px 2px 0', borderRadius: '0 0 6px 0' },
  };
  return <div style={{ ...base, ...corners[pos] }} />;
};

// ─── Gold Badge ───────────────────────────────────────────────────────────────
const GoldBadge = ({ text, fontFamily, fontSize }) => (
  <span
    style={{
      background: 'rgba(10,3,0,0.55)',
      border: '1px solid #c9960c',
      borderRadius: 30,
      padding: '6px 16px',
      fontFamily: fontFamily || 'inherit',
      fontSize: fontSize || 13,
      fontWeight: 600,
      color: '#f5d87a',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}
  >
    {text}
  </span>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({
  percentage,
  label,
  fontFamily,
  fontSize,
  barColor,       // ← รับ progressColor จาก settings
  mouseSize = 100,
  showShine = true,
}) => {
  const clampedPct = Math.min(Math.max(percentage, 5), 93);

  // ถ้ามี barColor ให้ mix เข้ากับ gradient ทอง ถ้าไม่มีใช้ default ทอง
  const fillBackground = barColor
    ? barColor
    : `linear-gradient(90deg,
        #a06a00 0%, #d4900a 20%, #f5d060 45%,
        #faeaaa 55%, #f5d060 70%, #d4900a 85%, #a06a00 100%
      )`;

  return (
    <div style={{ position: 'relative', zIndex: 2, marginBottom: 14 }}>
      {/* Floating mascot */}
      <DotLottieReact
        src={MOUSE_ANIMATION_URL}
        loop
        autoplay
        style={{
          width: mouseSize,
          height: mouseSize,
          position: 'absolute',
          bottom: mouseSize * 0.45,
          left: `${clampedPct}%`,
          transform: 'translateX(-50%)',
          zIndex: 10,
          animation: 'floatMouse 2.2s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Track */}
      <div
        style={{
          background: 'rgba(10,0,0,0.7)',
          border: '1.5px solid #8b6914',
          borderRadius: 40,
          height: 44,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)',
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${Math.min(percentage, 100)}%`,
            borderRadius: 40,
            background: fillBackground,
            backgroundSize: '200% 100%',
            boxShadow: '0 0 18px rgba(230,180,40,0.4)',
            transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
            position: 'relative',
            animation: showShine ? 'shimmerBar 3s linear infinite' : 'none',
          }}
        >
          {/* Gloss */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '45%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
              borderRadius: 40,
            }}
          />
        </div>

        {/* Label */}
        {label && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontFamily || 'inherit',
              fontSize: fontSize || 16,
              fontWeight: 600,
              color: '#1a0800',
              letterSpacing: '0.5px',
              zIndex: 5,
              textShadow: '0 1px 0 rgba(255,230,120,0.6)',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Stats Row ────────────────────────────────────────────────────────────────
const StatsRow = ({
  leftLabel, leftValue,
  rightLabel, rightValue,
  fontFamily, fontSize, fontWeight,
  color, strokeWidth, strokeColor,
}) => {
  const textStyle = {
    fontFamily:       fontFamily || 'inherit',
    fontSize:         fontSize   || 16,
    fontWeight:       fontWeight || 600,
    color:            color      || '#f5d87a',
    WebkitTextStroke: strokeWidth && strokeColor
                        ? `${strokeWidth} ${strokeColor}`
                        : undefined,
    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
  };
  const labelStyle = {
    fontSize: 11,
    color: 'rgba(245,216,122,0.5)',
    letterSpacing: 1,
    marginBottom: 2,
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 2,
      marginTop: 2,
    }}>
      <div>
        <div style={labelStyle}>{leftLabel}</div>
        <div style={textStyle}>{leftValue}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={labelStyle}>{rightLabel}</div>
        <div style={textStyle}>{rightValue}</div>
      </div>
    </div>
  );
};

// ─── CNY Footer ───────────────────────────────────────────────────────────────
const CNYFooter = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 14,
    position: 'relative',
    zIndex: 2,
  }}>
    {['新春大吉', '恭喜发财', '万事如意'].map(text => (
      <span
        key={text}
        style={{
          fontFamily: '"KaiTi","Noto Serif SC","华文楷体",serif',
          fontSize: 13,
          color: 'rgba(232,180,40,0.35)',
          letterSpacing: 2,
        }}
      >
        {text}
      </span>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GoalPreview({ settings, currentAmount, showBackground = true }) {
  const percentage    = calculatePercentage(currentAmount, settings.goalAmount);
  const daysRemaining = calculateDaysRemaining(settings.endAt, settings.isUseEndAt);

  const previewData = {
    amount:     currentAmount,
    goal:       settings.goalAmount,
    percentage,
    days:       daysRemaining,
  };

  const isMain    = settings.type === 'main';
  const mouseSize = isMain ? 90 : 115;

  // ─── แยก badge / stats ตาม type อย่างถูกต้อง ──────────────────────────────
  //
  // main type:
  //   badge    = descriptionRightText  (ตาม form ที่มี field นี้ใน "รายละเอียด")
  //   stat L   = descriptionLeftText
  //   stat R   = descriptionRightText
  //   NOTE: badge กับ stat R จะเป็น field เดียวกัน เพราะ form main ไม่มี badge field แยก
  //         ถ้าต้องการแยกต้องเพิ่ม field ใหม่ใน settings
  //
  // large type:
  //   badge    = largeTopRightText    (มี field แยกใน form)
  //   stat L   = largeBottomLeftText
  //   stat R   = largeBottomRightText

  const badgeText     = resolveText(
    isMain ? settings.descriptionRightText : settings.largeTopRightText,
    previewData
  );
  const badgeFontSize = isMain
    ? settings.descriptionFontSize
    : settings.largeTopFontSize;

  const statLeftText  = resolveText(
    isMain ? settings.descriptionLeftText  : settings.largeBottomLeftText,
    previewData
  );
  const statRightText = resolveText(
    isMain ? settings.descriptionRightText : settings.largeBottomRightText,
    previewData
  );
  const statFontSize  = isMain
    ? settings.descriptionFontSize
    : settings.largeBottomFontSize;

  const cardStyle = {
    background: 'linear-gradient(160deg, #8c1212 0%, #6b0c0c 40%, #4a0808 100%)',
    borderRadius: isMain ? 20 : 24,
    border: '2px solid #e8b428',
    boxShadow: `
      inset 0 1px 0 rgba(255,220,100,0.3),
      0 20px 60px rgba(0,0,0,0.6),
      0 4px 0 #4a2800
    `,
    padding: isMain ? '32px 28px 28px' : '36px 32px 32px',
    position: 'relative',
    overflow: 'hidden',
    ...(showBackground
      ? {}
      : { background: 'transparent', border: 'none', boxShadow: 'none' }),
  };

  return (
    <div style={cardStyle}>

      {/* Background glow */}
      {showBackground && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(255,210,70,0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 90%, rgba(255,100,50,0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* Corner ornaments */}
      {showBackground && ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(p => (
        <CornerOrnament key={p} pos={p} />
      ))}

      {/* ── Header: Goal Name + Badge ──────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Goal Name — รับทุก field จาก "ปรับแต่งข้อความเป้าหมาย" */}
        <p style={{
          fontFamily:       settings.goalFontFamily  || '"Cinzel Decorative", serif',
          fontSize:         settings.goalFontSize     || 17,
          fontWeight:       settings.goalFontWeight   || 700,
          color:            settings.goalColor        || '#fceea0',
          WebkitTextStroke: settings.goalStrokeWidth && settings.goalStrokeColor
                              ? `${settings.goalStrokeWidth} ${settings.goalStrokeColor}`
                              : undefined,
          lineHeight:    1.3,
          letterSpacing: 1,
          textShadow:    '0 0 20px rgba(255,210,70,0.4), 0 2px 4px rgba(0,0,0,0.8)',
          margin:        0,
          maxWidth:      260,
        }}>
          {settings.goalName}
        </p>

        {/* Badge — font มาจาก progressFontFamily, size มาจาก largeTopFontSize (large) หรือ descriptionFontSize (main) */}
        <GoldBadge
          text={badgeText}
          fontFamily={settings.progressFontFamily}
          fontSize={badgeFontSize}
        />
      </div>

      {/* ── Progress Bar — รับ progressColor, progressFontFamily, progressText, progressShine ── */}
      <ProgressBar
        percentage={percentage}
        label={resolveText(settings.progressText, previewData)}
        fontFamily={settings.progressFontFamily}
        barColor={settings.progressColor}
        showShine={settings.progressShine}
        mouseSize={mouseSize}
      />

      {/* ── Stats Row — รับทุก field จาก "รายละเอียด" ────────────────────── */}
      <StatsRow
        leftLabel="RAISED"
        leftValue={statLeftText}
        rightLabel="GOAL"
        rightValue={statRightText}
        fontFamily={settings.descriptionFontFamily}
        fontSize={statFontSize}
        fontWeight={settings.descriptionFontWeight}
        color={settings.descriptionColor}
        strokeWidth={settings.descriptionStrokeWidth}
        strokeColor={settings.descriptionStrokeColor}
      />

      {/* ── CNY Footer ────────────────────────────────────────────────────── */}
      {showBackground && <CNYFooter />}
    </div>
  );
}