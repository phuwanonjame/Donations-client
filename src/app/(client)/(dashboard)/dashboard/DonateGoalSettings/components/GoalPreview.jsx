import React from 'react';
import { resolveText, calculatePercentage } from '../utils/donate-goal';

const SHINE_KEYFRAMES = `
  @keyframes donateGoalShineSweep {
    0% {
      transform: translateX(-140%) skewX(-20deg);
      opacity: 0;
    }
    12% {
      opacity: 0.9;
    }
    88% {
      opacity: 0.9;
    }
    100% {
      transform: translateX(260%) skewX(-20deg);
      opacity: 0;
    }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('donate-goal-shine-styles')) {
  const style = document.createElement('style');
  style.id = 'donate-goal-shine-styles';
  style.textContent = SHINE_KEYFRAMES;
  document.head.appendChild(style);
}

// Helper: คำนวณจำนวนวันที่เหลือ (days) จาก endAt (ถ้ามี)
function getRemainingDays(endAt) {
  if (!endAt) return 30;
  const end = new Date(endAt);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// จัดรูปแบบตัวเลขแบบไทย (มี comma)
function formatNumber(num) {
  return num.toLocaleString('th-TH');
}

function renderProgressShine(color) {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 100%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="absolute inset-y-[-10%] left-[-38%] w-[34%] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 18%, rgba(255,255,255,0.52) 50%, rgba(255,255,255,0.14) 82%, rgba(255,255,255,0) 100%)',
          filter: `blur(3px) drop-shadow(0 0 8px ${color})`,
          opacity: 0.9,
          animation: 'donateGoalShineSweep 2.1s linear infinite',
        }}
      />
    </>
  );
}

const GRADIENT_PRESETS = {
  custom: {
    from: null,
    via: null,
    to: null,
  },
  aurora: {
    from: "#22D3EE",
    via: "#8B5CF6",
    to: "#EC4899",
  },
  sunset: {
    from: "#FB7185",
    via: "#FB923C",
    to: "#FACC15",
  },
  ocean: {
    from: "#0EA5E9",
    via: "#14B8A6",
    to: "#67E8F9",
  },
  berry: {
    from: "#A855F7",
    via: "#EC4899",
    to: "#F43F5E",
  },
  mono: {
    from: "#94A3B8",
    via: "#E2E8F0",
    to: "#CBD5E1",
  },
};

function getGradientPalette(settings) {
  const preset = GRADIENT_PRESETS[settings.progressSkin] || GRADIENT_PRESETS.custom;
  return {
    from: preset.from || settings.progressGradientFrom || settings.progressColor,
    via: preset.via || settings.progressGradientVia || settings.progressColor,
    to: preset.to || settings.progressGradientTo || settings.progressColor,
  };
}

function getProgressSkinStyles(skin, palette, baseColor) {
  const gradient = `linear-gradient(90deg, ${palette.from} 0%, ${palette.via} 52%, ${palette.to} 100%)`;

  switch (skin) {
    case 'custom':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 24%), ${gradient}`,
        boxShadow: `0 0 10px ${palette.via}66, 0 0 22px ${palette.to}33, inset 0 1px 0 rgba(255,255,255,0.14)`,
      };
    case 'aurora':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 26%), ${gradient}`,
        boxShadow: '0 0 12px rgba(139, 92, 246, 0.26), 0 0 22px rgba(34, 211, 238, 0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
      };
    case 'sunset':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 24%), ${gradient}`,
        boxShadow: '0 0 10px rgba(251, 146, 60, 0.30), 0 0 20px rgba(244, 63, 94, 0.24), inset 0 1px 0 rgba(255,255,255,0.16)',
      };
    case 'ocean':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 22%), ${gradient}`,
        boxShadow: '0 0 10px rgba(14, 165, 233, 0.28), 0 0 20px rgba(20, 184, 166, 0.24), inset 0 1px 0 rgba(255,255,255,0.22)',
      };
    case 'berry':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 26%), ${gradient}`,
        boxShadow: '0 0 12px rgba(236, 72, 153, 0.28), 0 0 24px rgba(168, 85, 247, 0.22), inset 0 1px 0 rgba(255,255,255,0.16)',
      };
    case 'mono':
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 24%), ${gradient}`,
        boxShadow: '0 0 10px rgba(226, 232, 240, 0.16), 0 0 16px rgba(148, 163, 184, 0.18), inset 0 1px 0 rgba(255,255,255,0.26)',
      };
    case 'solid':
    default:
      return {
        background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 24%), linear-gradient(90deg, ${baseColor} 0%, ${baseColor} 100%)`,
        boxShadow: `0 0 8px ${baseColor}66, 0 0 18px ${baseColor}44, inset 0 1px 0 rgba(255,255,255,0.12)`,
      };
  }
}

function renderProgressSkinOverlay(skin) {
  if (skin === 'aurora') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 22% 45%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 18%), radial-gradient(circle at 76% 58%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 20%)',
          opacity: 0.9,
        }}
      />
    );
  }

  if (skin === 'sunset') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.12) 24%, rgba(255,255,255,0.18) 50%, rgba(255,244,214,0.12) 76%, rgba(255,255,255,0) 100%)',
          opacity: 0.75,
        }}
      />
    );
  }

  if (skin === 'ocean') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0) 100%)',
          opacity: 0.7,
          mixBlendMode: 'screen',
        }}
      />
    );
  }

  if (skin === 'berry') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 18% 50%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 16%), radial-gradient(circle at 78% 54%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 18%)',
          opacity: 0.8,
        }}
      />
    );
  }

  if (skin === 'mono') {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.16) 12.5%, transparent 12.5%, transparent 50%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.16) 62.5%, transparent 62.5%, transparent)',
          backgroundSize: '18px 18px',
          opacity: 0.22,
          mixBlendMode: 'screen',
        }}
      />
    );
  }

  return null;
}

export default function GoalPreview({ settings, currentAmount }) {
  const percentage = calculatePercentage(currentAmount, settings.goalAmount);
  const days = getRemainingDays(settings.isUseEndAt ? settings.endAt : null);
  const progressBarHeight = Math.max(20, Math.min(Number(settings.progressBarHeight) || 32, 56));
  const progressSkin = settings.progressSkin || 'custom';
  const progressPalette = getGradientPalette(settings);
  const progressStyles = getProgressSkinStyles(progressSkin, progressPalette, settings.progressColor);

  const previewData = {
    amount: currentAmount,
    goal: settings.goalAmount,
    percentage: percentage,
    days: days,
  };

  // สร้าง style สำหรับข้อความที่มีขอบ (stroke)
  const getStrokeStyle = (strokeWidth, strokeColor) => {
    if (strokeWidth && strokeWidth !== '0px' && strokeColor) {
      return { WebkitTextStroke: `${strokeWidth} ${strokeColor}` };
    }
    return {};
  };

  // สร้างข้อความชื่อเป้าหมาย แสดงจำนวนเป้าหมายตาม setting showGoalAmount
  const goalDisplayText = settings.showGoalAmount
    ? `${settings.goalName} (${formatNumber(settings.goalAmount)} บาท)`
    : settings.goalName;

  if (settings.type === 'main') {
    return (
      <div className="space-y-2">
        {/* ชื่อเป้าหมาย */}
        <p
          className="text-center font-bold"
          style={{
            color: settings.goalColor,
            fontSize: settings.goalFontSize,
            fontFamily: settings.goalFontFamily,
            fontWeight: settings.goalFontWeight,
            ...getStrokeStyle(settings.goalStrokeWidth, settings.goalStrokeColor),
          }}
        >
          {goalDisplayText}
        </p>

        {/* หลอดเป้าหมาย */}
        <div className="relative w-full rounded-full overflow-hidden bg-slate-700" style={{ height: `${progressBarHeight}px` }}>
          <div
            className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
            style={{
              background: progressStyles.background,
              width: `${percentage}%`,
              boxShadow: progressStyles.boxShadow,
            }}
          >
            {renderProgressSkinOverlay(progressSkin)}
            {settings.progressShine && renderProgressShine(settings.progressColor)}
          </div>
          <span
            className="absolute inset-0 flex items-center justify-center font-medium"
            style={{ color: '#fff', fontFamily: settings.progressFontFamily, fontSize: '14px' }}
          >
            {resolveText(settings.progressText, previewData)}
          </span>
        </div>

        {/* รายละเอียดด้านล่าง (ซ้าย/ขวา) - ลบ text-xs ออก */}
        <div
          className="flex justify-between"
          style={{
            color: settings.descriptionColor,
            fontFamily: settings.descriptionFontFamily,
            fontWeight: settings.descriptionFontWeight,
            fontSize: settings.descriptionFontSize,
            ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
          }}
        >
          <span>{resolveText(settings.descriptionLeftText, previewData)}</span>
          <span>{resolveText(settings.descriptionRightText, previewData)}</span>
        </div>
      </div>
    );
  }

  // Large widget preview
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p
          style={{
            color: settings.goalColor,
            fontSize: settings.goalFontSize,
            fontFamily: settings.goalFontFamily,
            fontWeight: settings.goalFontWeight,
            ...getStrokeStyle(settings.goalStrokeWidth, settings.goalStrokeColor),
          }}
        >
          {goalDisplayText}
        </p>
        <span
          style={{
            color: settings.descriptionColor,
            fontSize: settings.largeTopFontSize,
            fontFamily: settings.descriptionFontFamily,
            fontWeight: settings.descriptionFontWeight,
            ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
          }}
        >
          {resolveText(settings.largeTopRightText, previewData)}
        </span>
      </div>

      {/* หลอดเป้าหมาย */}
      <div className="relative w-full rounded-full overflow-hidden bg-slate-700" style={{ height: `${progressBarHeight}px` }}>
        <div
          className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
          style={{
            background: progressStyles.background,
            width: `${percentage}%`,
            boxShadow: progressStyles.boxShadow,
          }}
        >
          {renderProgressSkinOverlay(progressSkin)}
          {settings.progressShine && renderProgressShine(settings.progressColor)}
        </div>
        <span
          className="absolute inset-0 flex items-center justify-center font-medium text-white"
          style={{ fontFamily: settings.progressFontFamily, fontSize: '14px' }}
        >
          {resolveText(settings.progressText, previewData)}
        </span>
      </div>

      {/* รายละเอียดล่างซ้าย/ขวา (Large) - ลบ text-xs */}
      <div
        className="flex justify-between"
        style={{
          color: settings.descriptionColor,
          fontFamily: settings.descriptionFontFamily,
          fontWeight: settings.descriptionFontWeight,
          ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
        }}
      >
        <span style={{ fontSize: settings.largeBottomFontSize }}>
          {resolveText(settings.largeBottomLeftText, previewData)}
        </span>
        <span style={{ fontSize: settings.largeBottomFontSize }}>
          {resolveText(settings.largeBottomRightText, previewData)}
        </span>
      </div>
    </div>
  );
}
