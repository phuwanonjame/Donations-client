"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Flame, Gamepad2, Search, Sparkles, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import CompactStreamerCard from "@/components/explore/CompactStreamerCard";
import {
  buildCategorySummaries,
  fetchExploreStreamers,
  mapCategoryIdToName,
  profileCategoryOptions,
} from "@/lib/exploreData";

const categoryChipNames = ["ทั้งหมด", ...profileCategoryOptions.map((item) => item.name)];
const liveGradients = [
  "from-fuchsia-500 to-pink-400",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const data = await fetchExploreStreamers();

      if (!cancelled) {
        setStreamers(data);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStreamers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return streamers.filter((streamer) => {
      const matchesCategory =
        activeCategory === "ทั้งหมด" ||
        streamer.category === activeCategory ||
        streamer.profileCategories.some(
          (categoryId) => mapCategoryIdToName(categoryId) === activeCategory
        );

      const matchesQuery =
        !normalizedQuery ||
        streamer.name.toLowerCase().includes(normalizedQuery) ||
        streamer.handle.toLowerCase().includes(normalizedQuery) ||
        streamer.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, streamers]);

  const categories = useMemo(() => buildCategorySummaries(streamers), [streamers]);
  const featuredStreamers = filteredStreamers.slice(0, 6);
  const featuredCategories = categories.slice(0, 4);
  const liveNow = filteredStreamers.slice(0, 4);

  return (
    <div className="min-h-screen overflow-hidden bg-[#07131f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_28%),linear-gradient(180deg,#08111b_0%,#0b1725_42%,#08111b_100%)]" />
      <div className="absolute left-1/2 top-44 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Streamer Discovery
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/80">
                  Explore creators
                </p>
                <h1 className="max-w-3xl font-['Chakra_Petch'] text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  สำรวจสตรีมเมอร์
                  <span className="bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text text-transparent">
                    {" "}และหมวดหมู่ทั้งหมดในระบบ
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  เข้าหน้า streamers เพื่อดูโปรไฟล์ทั้งหมด หรือเข้าหน้า categories
                  เพื่อดูหมวดหมู่ทั้งหมดและจำนวนสมาชิกในแต่ละหมวดได้ทันที
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/explore/streamers">
                  <Button className="h-12 rounded-full bg-cyan-400 px-6 text-[#07131f] hover:bg-cyan-300">
                    ดูสตรีมเมอร์ทั้งหมด
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/explore/categories">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
                  >
                    ดูหมวดหมู่ทั้งหมด
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/10 via-transparent to-pink-400/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Discovery snapshot
                    </p>
                    <h2 className="mt-2 font-['Chakra_Petch'] text-2xl font-bold">
                      Explore Overview
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
                    {isLoading ? "Loading" : "Ready"}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <StatRow label="สตรีมเมอร์ทั้งหมดในระบบ" value={`${streamers.length}`} />
                  <StatRow label="หมวดหมู่ทั้งหมดของระบบ" value={`${categories.length}`} />
                  <StatRow label="ผลลัพธ์ที่ตรงกับการค้นหา" value={`${filteredStreamers.length}`} />
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-white/8 to-white/4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-pink-400/15 p-3 text-pink-300">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">หมวดที่ระบบรองรับ</p>
                      <p className="font-semibold text-white">
                        {profileCategoryOptions.map((item) => item.name).join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-[#091521] px-4 py-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ค้นหาชื่อสตรีมเมอร์, username หรือแท็ก"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categoryChipNames.map((chip) => {
                  const isActive = chip === activeCategory;

                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setActiveCategory(chip)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-cyan-400 text-[#07131f]"
                          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Featured Streamers"
            title="ตัวอย่างสตรีมเมอร์ในระบบ"
            actionHref="/explore/streamers"
            actionLabel="ดูทั้งหมด"
          />

          {isLoading ? (
            <EmptyPanel text="กำลังโหลดรายชื่อสตรีมเมอร์จากระบบ..." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {featuredStreamers.map((streamer) => (
                <StreamerCard key={streamer.id} streamer={streamer} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <SectionHeader
              eyebrow="Categories"
              title="หมวดหมู่ทั้งหมด"
              actionHref="/explore/categories"
              actionLabel="ดูทั้งหมด"
              compact
            />

            <div className="space-y-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/explore/categories/${category.id}`}
                  className="block rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-5 transition hover:border-cyan-300/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                        <Gamepad2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">
                          มีสมาชิก {category.memberCount} คน
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/70" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-rose-400/10 p-3 text-rose-300">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profiles</p>
                <h2 className="font-['Chakra_Petch'] text-2xl font-bold">โปรไฟล์ที่น่าสนใจ</h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {liveNow.map((streamer, index) => (
                <Link
                  key={streamer.id}
                  href={`/${streamer.slug}`}
                  className="group rounded-[1.5rem] border border-white/10 bg-[#091521] p-4 transition hover:border-cyan-300/20"
                >
                  <div
                    className={`mb-4 h-32 rounded-[1.25rem] bg-gradient-to-br ${
                      liveGradients[index % liveGradients.length]
                    } p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-black/30 px-3 py-1 text-xs text-white">
                        PROFILE
                      </span>
                      <span className="text-sm font-medium text-white/90">{streamer.viewers}</span>
                    </div>
                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
                          streamer.isWidgetOnline
                            ? "bg-black/35 text-lime-100 ring-1 ring-lime-300/30"
                            : "bg-black/25 text-slate-100 ring-1 ring-white/10"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            streamer.isWidgetOnline ? "bg-lime-300 animate-pulse" : "bg-slate-300"
                          }`}
                        />
                        {streamer.isWidgetOnline ? "Widget Online" : "Widget Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{streamer.name}</h3>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                        {streamer.category}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-400">{streamer.bio}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, actionHref, actionLabel, compact = false }) {
  return (
    <div className={`mb-6 flex items-center justify-between gap-4 ${compact ? "" : ""}`}>
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/75">{eyebrow}</p>
        <h2 className="mt-2 font-['Chakra_Petch'] text-3xl font-bold">{title}</h2>
      </div>
      {actionHref ? (
        <Link href={actionHref}>
          <Button
            variant="ghost"
            className="rounded-full text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200"
          >
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="font-['Chakra_Petch'] text-2xl font-bold text-cyan-300">{value}</span>
    </div>
  );
}

function EmptyPanel({ text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center text-slate-300">
      {text}
    </div>
  );
}

function StreamerCard({ streamer }) {
  return <CompactStreamerCard streamer={streamer} darkStatus />;
}


