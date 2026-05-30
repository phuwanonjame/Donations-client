"use client";

import React from "react";
import { Copy, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWidgetUrl } from "@/utils/widgetUrls";

export default function WidgetUrlHeaderField({ type, widgetId, accentClass = "text-cyan-300" }) {
  const widgetUrl = createWidgetUrl(type, widgetId || "preview");
  const hasRealWidget = Boolean(widgetId);

  const handleCopy = () => {
    navigator.clipboard?.writeText(widgetUrl);
  };

  const handleOpen = () => {
    window.open(widgetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Widget URL
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={widgetUrl}
              readOnly
              inputMode="url"
              className={`flex-1 border-white/10 bg-transparent font-mono text-xs focus:border-cyan-400 sm:text-sm ${accentClass}`}
            />
            <Button
              size="icon"
              variant="outline"
              className="border-white/10 hover:border-cyan-400 hover:bg-slate-800"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {!hasRealWidget && (
            <p className="text-xs text-slate-500">Preview URL shown until this widget finishes loading.</p>
          )}
        </div>
        <Button
          variant="outline"
          className="border-white/10 text-slate-300 hover:border-cyan-400 hover:bg-slate-800"
          onClick={handleOpen}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Overlay
        </Button>
      </div>
    </div>
  );
}
