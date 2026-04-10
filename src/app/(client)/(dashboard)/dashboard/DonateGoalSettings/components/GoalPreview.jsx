import React from 'react';
import { resolveText, calculatePercentage } from '../utils/donate-goal';

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

export default function GoalPreview({ settings, currentAmount }) {
  const percentage = calculatePercentage(currentAmount, settings.goalAmount);
  const days = getRemainingDays(settings.isUseEndAt ? settings.endAt : null);

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
        <div className="relative w-full rounded-full overflow-hidden bg-slate-700" style={{ height: '28px' }}>
          <div
            className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
            style={{
              backgroundColor: settings.progressColor,
              width: `${percentage}%`,
              boxShadow: settings.progressShine ? `0 0 16px ${settings.progressColor}` : 'none',
            }}
          >
            {settings.progressShine && (
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  animation: 'goalShine 2s infinite',
                }}
              />
            )}
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
            fontFamily: settings.progressFontFamily,
            ...getStrokeStyle(settings.descriptionStrokeWidth, settings.descriptionStrokeColor),
          }}
        >
          {resolveText(settings.largeTopRightText, previewData)}
        </span>
      </div>

      {/* หลอดเป้าหมาย */}
      <div className="relative w-full rounded-full overflow-hidden bg-slate-700" style={{ height: '32px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            backgroundColor: settings.progressColor,
            width: `${percentage}%`,
            boxShadow: settings.progressShine ? `0 0 16px ${settings.progressColor}` : 'none',
          }}
        />
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