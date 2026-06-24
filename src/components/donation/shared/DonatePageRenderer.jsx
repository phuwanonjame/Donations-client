"use client";

import DonatePageStructure from "@/components/donation/shared/DonatePageStructure";

export default function DonatePageRenderer({
  settings,
  preview = false,
  optimizeForEditor = false,
}) {
  return (
    <DonatePageStructure
      settings={settings}
      preview={preview}
      optimizeForEditor={optimizeForEditor}
      className={
        preview
          ? "min-h-0 overflow-hidden rounded-[28px] border border-slate-700/80 shadow-2xl shadow-black/30"
          : ""
      }
    />
  );
}
