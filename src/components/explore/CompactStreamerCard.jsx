"use client";

import Link from "next/link";

function WidgetStatusChip({ streamer, dark = false }) {
  if (!streamer.isWidgetOnline) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
        dark
          ? "bg-red-600/85 text-white ring-1 ring-red-200/45"
          : "bg-red-500/90 text-white ring-1 ring-red-200/45"
      }`}
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      Live
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
  const bannerUrl = streamer?.bannerUrl || "";
  const categoryLabel = footerValue || streamer.category;

  return (
    <Link
      href={`/${streamer.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/20 bg-black/40 transition duration-300 hover:scale-[1.02] hover:border-cyan-300/40"
    >
      <span className="absolute inset-0 z-10 h-full w-full bg-gradient-to-tl from-cyan-300/0 via-cyan-300/0 to-cyan-300/20 opacity-10 transition duration-300 group-hover:opacity-40" />

      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt=""
          aria-hidden="true"
          className="aspect-[128/40] w-full object-cover object-center transition duration-300 group-hover:scale-105"
          style={{
            maskImage: "linear-gradient(rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)",
            WebkitMaskImage:
              "linear-gradient(rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      ) : (
        <div
          className={`aspect-[128/40] w-full bg-gradient-to-br ${streamer.accent}`}
          style={{
            maskImage: "linear-gradient(rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)",
            WebkitMaskImage:
              "linear-gradient(rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      )}

      <div className="absolute right-4 top-4 z-20">
        <WidgetStatusChip streamer={streamer} dark={darkStatus} />
      </div>

      <div className="relative z-20 -mt-10 p-5">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#08111d]">
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
          <div className="w-full max-w-[70%] min-w-0">
            <h3 className="truncate font-['Chakra_Petch'] text-xl font-bold tracking-tight text-white">
              {streamer.name}
            </h3>
            <p className="-mt-0.5 truncate text-sm text-white/60">
              streamflow.app/{streamer.handle}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-white/60">
          {streamer.bio}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white transition duration-300 group-hover:scale-105">
            {categoryLabel || footerLabel}
          </span>
          {footerIcon === "users" ? (
            <span className="text-xs text-white/50">{footerLabel}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
