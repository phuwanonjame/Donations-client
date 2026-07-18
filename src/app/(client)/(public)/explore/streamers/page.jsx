"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import CompactStreamerCard from "@/components/explore/CompactStreamerCard";
import { fetchExploreStreamers, mapCategoryIdToName, profileCategoryOptions } from "@/lib/exploreData";

const categoryChipNames = ["ทั้งหมด", ...profileCategoryOptions.map((item) => item.name)];

export default function ExploreStreamersPage() {
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

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

  return (
    <div className="min-h-screen bg-[#07131f] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-cyan-300">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้า Explore
            </Link>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">All Streamers</p>
              <h1 className="mt-2 font-['Chakra_Petch'] text-4xl font-bold">
                สตรีมเมอร์ทั้งหมดในระบบ
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                รวมโปรไฟล์สาธารณะทั้งหมดที่ดึงได้จากระบบ พร้อม filter ตามหมวดหมู่และค้นหาได้ในหน้าเดียว
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right backdrop-blur-xl">
            <p className="text-sm text-slate-400">จำนวนทั้งหมด</p>
            <p className="font-['Chakra_Petch'] text-3xl font-bold text-cyan-300">
              {filteredStreamers.length}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#091521] px-4 py-3">
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

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center text-slate-300">
            กำลังโหลดรายชื่อสตรีมเมอร์...
          </div>
        ) : filteredStreamers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/5 px-6 py-14 text-center text-slate-300">
            ยังไม่เจอโปรไฟล์ที่ตรงกับเงื่อนไขที่เลือก
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredStreamers.map((streamer) => (
              <CompactStreamerCard key={streamer.id} streamer={streamer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

