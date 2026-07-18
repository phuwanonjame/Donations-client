"use client";

import Link from "next/link";
import { BadgeCheck, Users } from "lucide-react";

function WidgetStatusChip({ streamer, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
        streamer.isWidgetOnline
          ? dark
            ? "bg-black/35 text-lime-100 ring-1 ring-lime-300/30"
            : "bg-lime-400/15 text-lime-100 ring-1 ring-lime-300/30"
          : dark
            ? "bg-black/25 text-slate-100 ring-1 ring-white/10"
            : "bg-slate-900/45 text-slate-200 ring-1 ring-white/10"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          streamer.isWidgetOnline ? "bg-lime-300 animate-pulse" : "bg-slate-400"
        }`}
      />
      {streamer.isWidgetOnline ? "Widget Online" : "Widget Offline"}
    </span>
  );
}

export default function CompactStreamerCard({
  streamer,
  footerLabel = "Category",
  footerValue = "",
  footerIcon = null,
  darkStatus = false,
}) {
  return (
    <Link
      href={`/${streamer.slug}`}
      className="group block overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/25"
    >
      <div className={`relative h-40 bg-gradient-to-br ${streamer.accent}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.36),transparent_38%),linear-gradient(180deg,transparent,rgba(7,19,31,0.88))]" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-[11px] text-white backdrop-blur-md">
          {streamer.verified ? (
            <>
              <BadgeCheck className="h-3.5 w-3.5 text-cyan-200" />
              Verified
            </>
          ) : (
            <>Profile</>
          )}
        </div>
        <div className="absolute right-4 top-4">
          <WidgetStatusChip streamer={streamer} dark={darkStatus} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 p-4">
          <div className="h-20 w-20 overflow-hidden rounded-3xl border-2 border-white/20 bg-[#08111d] shadow-[0_14px_30px_rgba(3,7,24,0.38)]">
            {streamer.avatarUrl ? (
              <img
                src={streamer.avatarUrl}
                alt={streamer.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#2563eb,#7c3aed)] text-2xl font-black text-white">
                {streamer.name?.slice(0, 1)?.toUpperCase() || "S"}
              </div>
            )}
          </div>
          <div className="min-w-0 pb-1">
            <h3 className="truncate font-['Chakra_Petch'] text-xl font-bold text-white">
              {streamer.name}
            </h3>
            <p className="truncate text-sm text-white/75">@{streamer.handle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{footerLabel}</p>
          <div className="flex items-center gap-2 pt-1">
            {footerIcon === "users" ? <Users className="h-4 w-4 text-cyan-300" /> : null}
            <p className="truncate font-semibold text-white">{footerValue || streamer.category}</p>
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-slate-200 transition group-hover:border-cyan-300/20 group-hover:text-cyan-100">
          View Profile
        </div>
      </div>
    </Link>
  );
}
