// TopDonatePreview.tsx
"use client";
import React, { useEffect } from 'react';
import { injectFontFamily } from '../../DonateAlertSettings/components/utils/fontUtils';
import {
  injectTopDonateKeyframes,
  resolvePreviewFontFamily,
  resolveTitle,
  useTopDonateCelebration,
} from './TopDonateShared';
import { ClassicVariant, TOP_DONATE_VARIANT_MAP } from './TopDonateVariants';

injectTopDonateKeyframes();

export default function TopDonatePreview({ settings, donorData }) {
  const donorName    = donorData?.name    ?? 'SuperFan123';
  const donorAmount  = donorData?.amount  ?? '฿5,000';
  const donorMessage = donorData?.message ?? 'Love your content! Keep it up!';

  const isCelebrating = useTopDonateCelebration(donorName);

  useEffect(() => {
    [settings.topDonatorFontFamily, settings.amountFontFamily].forEach((fontId) => {
      const cssFamily = resolvePreviewFontFamily(fontId);
      const familyName = cssFamily.split(',')[0]?.replace(/["']/g, '').trim();
      injectFontFamily(familyName);
    });
  }, [settings.topDonatorFontFamily, settings.amountFontFamily]);

  const resolvedTitle = resolveTitle(settings.title ?? '', donorData);
  const Variant = TOP_DONATE_VARIANT_MAP[settings.templateVariant] ?? ClassicVariant;

  return (
    <div className="space-y-4">
      <Variant
        settings={settings}
        donorName={donorName}
        donorAmount={donorAmount}
        donorMessage={donorMessage}
        resolvedTitle={resolvedTitle}
        isCelebrating={isCelebrating}
      />
    </div>
  );
}
