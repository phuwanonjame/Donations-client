"use client";

import DonatePageStructure from "@/components/donation/shared/DonatePageStructure";

export default function DonatePageRenderer({
  settings,
  preview = false,
  optimizeForEditor = false,
  matchLiveLayout = false,
  fullBleedPreview = false,
}) {
  return (
    <DonatePageStructure
      settings={settings}
      preview={preview}
      optimizeForEditor={optimizeForEditor}
      matchLiveLayout={matchLiveLayout}
      className={
        preview
          ? fullBleedPreview
            ? "min-h-0"
            : "min-h-0 overflow-hidden rounded-[28px] border border-slate-700/80 shadow-2xl shadow-black/30"
          : ""
      }
    />
  );
}
