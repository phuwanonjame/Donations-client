"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Gamepad2, Search, Sparkles, Users, Video } from "lucide-react";

import CompactStreamerCard from "@/components/explore/CompactStreamerCard";
import {
  buildCategorySummaries,
  fetchExploreStreamers,
  mapCategoryIdToName,
  profileCategoryOptions,
} from "@/lib/exploreData";

const ALL_CATEGORY_LABEL = "ทั้งหมด";
const categoryChipNames = [
  ALL_CATEGORY_LABEL,
  ...profileCategoryOptions.map((item) => item.name),
];

const categoryAccents = [
  "from-cyan-400 to-blue-500",
  "from-rose-500 to-orange-400",
  "from-emerald-400 to-teal-500",
  "from-violet-500 to-fuchsia-500",
  "from-amber-400 to-yellow-500",
  "from-sky-400 to-indigo-500",
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_LABEL);
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
        activeCategory === ALL_CATEGORY_LABEL ||
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
  const featuredStreamers = filteredStreamers.slice(0, 10);
  const featuredCategories = categories.slice(0, 8);
  const liveNow = filteredStreamers.filter((streamer) => streamer.isWidgetOnline).slice(0, 10);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050315] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(45,212,191,0.2),transparent_28%),radial-gradient(circle_at_85%_8%,rgba(244,63,94,0.16),transparent_26%),linear-gradient(180deg,#07041d_0%,#050315_42%,#03020c_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(115deg,rgba(34,211,238,0.08),transparent_35%,rgba(248,113,113,0.1))]" />

      <section className="relative px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-cyan-100">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Streamflow Discovery
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-['Chakra_Petch'] text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            ค้นพบสตรีมเมอร์ใหม่ๆ
            <span className="block bg-gradient-to-r from-cyan-200 via-white to-rose-200 bg-clip-text text-transparent">
              ที่พร้อมรับแรงสนับสนุนจากคุณ
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            รวมหน้าโดเนทของครีเอเตอร์ในระบบ ค้นหาตามชื่อ หมวดหมู่ หรือดูว่าใครกำลัง Live อยู่ตอนนี้
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <MetricPill label="Streamers" value={streamers.length} />
            <MetricPill label="Categories" value={categories.length} />
            <MetricPill label="Live Now" value={streamers.filter((item) => item.isWidgetOnline).length} live />
          </div>
        </div>
      </section>

      <main className="relative -mt-14 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="mx-auto max-w-2xl rounded-full border border-white/20 bg-white/5 px-5 py-3">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-white/50" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหาสตรีมเมอร์..."
                className="w-full bg-transparent p-1 text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categoryChipNames.map((chip) => {
              const isActive = chip === activeCategory;

              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveCategory(chip)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                    isActive
                      ? "border-cyan-300/60 bg-cyan-300 text-[#040316]"
                      : "border-white/15 bg-black/25 text-white/65 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <section>
            <SectionHeader
              icon={Sparkles}
              title="สตรีมเมอร์แนะนำวันนี้"
              subtitle="Featured Streamers"
              actionHref="/explore/streamers"
              actionLabel="ดูทั้งหมด"
              accent="from-cyan-400 to-blue-500"
            />

            {isLoading ? (
              <EmptyPanel text="กำลังโหลดรายชื่อสตรีมเมอร์จากระบบ..." />
            ) : featuredStreamers.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featuredStreamers.map((streamer) => (
                  <StreamerCard key={streamer.id} streamer={streamer} />
                ))}
              </div>
            ) : (
              <EmptyPanel text="ยังไม่พบสตรีมเมอร์ที่ตรงกับการค้นหา" />
            )}
          </section>

          <section>
            <SectionHeader
              icon={Gamepad2}
              title="หมวดหมู่ยอดนิยม"
              subtitle="Categories"
              actionHref="/explore/categories"
              actionLabel="ดูทั้งหมด"
              accent="from-rose-500 to-orange-400"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  accent={categoryAccents[index % categoryAccents.length]}
                />
              ))}
            </div>
          </section>

          {liveNow.length > 0 ? (
            <section>
              <SectionHeader
                icon={Video}
                title="กำลัง Live อยู่"
                subtitle="Currently Live"
                actionHref="/explore/streamers"
                actionLabel="ดูทั้งหมด"
                accent="from-red-600 to-red-400"
                ping
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {liveNow.map((streamer) => (
                  <StreamerCard key={streamer.id} streamer={streamer} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  actionHref,
  actionLabel,
  accent,
  ping = false,
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 md:gap-5">
        <div
          className={`relative flex aspect-square w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${accent} sm:w-16`}
        >
          {ping ? <div className="absolute inset-0 animate-ping rounded-2xl bg-red-500/35" /> : null}
          <Icon className="relative h-7 w-7" />
        </div>
        <div>
          <h2 className="font-['Chakra_Petch'] text-2xl font-bold md:text-3xl">{title}</h2>
          <p className="text-base font-medium text-white/55 md:text-xl">{subtitle}</p>
        </div>
      </div>

      {actionHref ? (
        <Link
          href={actionHref}
          className="flex items-center gap-2 rounded-full border border-white/20 p-3 text-sm font-semibold text-white/80 transition duration-300 hover:scale-95 hover:bg-white/5 sm:px-4 sm:py-2"
        >
          <ArrowRight className="h-5 w-5" />
          <span className="hidden sm:block">{actionLabel}</span>
        </Link>
      ) : null}
    </div>
  );
}

function CategoryCard({ category, accent }) {
  const previewMembers = category.members.slice(0, 3);

  return (
    <Link
      href={`/explore/categories/${category.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-5 transition duration-300 hover:scale-[1.02] hover:border-cyan-300/40"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-bl ${accent} opacity-20 transition duration-300 group-hover:opacity-40`}
      />
      <ArrowRight className="absolute right-6 top-6 z-10 h-6 w-6 text-white/20 transition duration-300 group-hover:text-white/70" />

      <div className="relative flex items-center gap-4">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="aspect-square h-14 rounded-xl object-cover"
          />
        ) : (
          <div className={`flex aspect-square h-14 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}>
            <Gamepad2 className="h-6 w-6" />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate font-['Chakra_Petch'] text-xl font-bold tracking-tight">
            {category.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-white/55">
            <Users className="h-3.5 w-3.5" />
            <p className="text-sm">{category.memberCount} streamers</p>
          </div>
        </div>
      </div>

      {previewMembers.length > 0 ? (
        <div className="relative mt-6 flex flex-wrap items-center gap-1.5">
          {previewMembers.map((member) => (
            <div
              key={member.id}
              className="flex w-fit items-center gap-1 rounded-full border border-white/20 p-0.5 pr-2"
            >
              <StreamerAvatar streamer={member} sizeClass="h-5 w-5" />
              <p className="max-w-[90px] truncate text-sm text-white/80">{member.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="relative mt-6 text-sm text-white/45">ยังไม่มี streamer ในหมวดนี้</p>
      )}
    </Link>
  );
}

function StreamerAvatar({ streamer, sizeClass }) {
  return streamer.avatarUrl ? (
    <img
      src={streamer.avatarUrl}
      alt={streamer.name}
      className={`${sizeClass} rounded-full object-cover`}
    />
  ) : (
    <span
      className={`${sizeClass} flex items-center justify-center rounded-full bg-cyan-300 text-[10px] font-bold text-[#040316]`}
    >
      {streamer.name?.slice(0, 1)?.toUpperCase() || "S"}
    </span>
  );
}

function MetricPill({ label, value, live = false }) {
  return (
    <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm text-white/65">
      <span className={live ? "text-red-300" : "text-cyan-200"}>{value}</span>
      <span className="ml-2">{label}</span>
    </div>
  );
}

function EmptyPanel({ text }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-black/40 px-6 py-14 text-center text-white/55">
      {text}
    </div>
  );
}

function StreamerCard({ streamer }) {
  return <CompactStreamerCard streamer={streamer} darkStatus />;
}
