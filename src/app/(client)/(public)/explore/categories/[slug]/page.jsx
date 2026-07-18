"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import CompactStreamerCard from "@/components/explore/CompactStreamerCard";
import {
  buildCategorySummaries,
  fetchExploreStreamers,
  profileCategoryOptions,
} from "@/lib/exploreData";

export default function ExploreCategoryDetailPage({ params }) {
  const slug = params?.slug;
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

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

  const category = useMemo(() => {
    return buildCategorySummaries(streamers).find((item) => item.id === slug) || null;
  }, [slug, streamers]);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return (category?.members || []).filter((streamer) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        streamer.name.toLowerCase().includes(normalizedQuery) ||
        streamer.handle.toLowerCase().includes(normalizedQuery) ||
        streamer.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [category, query]);

  const fallbackCategoryName =
    profileCategoryOptions.find((item) => item.id === slug)?.name || slug;

  return (
    <div className="min-h-screen bg-[#07131f] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Link
              href="/explore/categories"
              className="inline-flex items-center gap-2 text-sm text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าหมวดหมู่
            </Link>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Category Detail</p>
              <h1 className="mt-2 font-['Chakra_Petch'] text-4xl font-bold">
                {category?.name || fallbackCategoryName}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                ดูโปรไฟล์สตรีมเมอร์ทั้งหมดในหมวดนี้แบบ card list และกดเข้าโปรไฟล์ต่อได้ทันที
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right backdrop-blur-xl">
            <p className="text-sm text-slate-400">Members</p>
            <p className="font-['Chakra_Petch'] text-3xl font-bold text-cyan-300">
              {filteredMembers.length}
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-[2rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหา streamer ในหมวดนี้"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center text-slate-300">
            กำลังโหลดสมาชิกในหมวดหมู่...
          </div>
        ) : !category ? (
          <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/5 px-6 py-14 text-center text-slate-300">
            ไม่พบหมวดหมู่ที่ต้องการ
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/5 px-6 py-14 text-center text-slate-300">
            หมวดนี้ยังไม่มี member ที่ตรงกับคำค้นหา
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredMembers.map((streamer) => (
              <CompactStreamerCard
                key={streamer.id}
                streamer={streamer}
                footerLabel="Category"
                footerValue={category.name}
                footerIcon="users"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

