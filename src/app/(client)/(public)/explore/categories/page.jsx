"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Gamepad2, Search, Users } from "lucide-react";

import { buildCategorySummaries, fetchExploreStreamers } from "@/lib/exploreData";

export default function ExploreCategoriesPage() {
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

  const categories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return buildCategorySummaries(streamers).filter((category) => {
      if (!normalizedQuery) {
        return true;
      }

      return category.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query, streamers]);

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
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">All Categories</p>
              <h1 className="mt-2 font-['Chakra_Petch'] text-4xl font-bold">
                หมวดหมู่ทั้งหมดในระบบ
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                เข้าหน้านี้เพื่อดูหมวดหมู่ทั้งหมดพร้อมจำนวนสมาชิกในแต่ละหมวด
                และกดเข้าไปต่อเพื่อดู streamer cards ในหมวดนั้นได้เลย
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right backdrop-blur-xl">
            <p className="text-sm text-slate-400">จำนวนหมวดหมู่</p>
            <p className="font-['Chakra_Petch'] text-3xl font-bold text-cyan-300">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-[2rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาหมวดหมู่"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center text-slate-300">
            กำลังโหลดหมวดหมู่...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/explore/categories/${category.id}`}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/25"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/60 transition group-hover:text-cyan-300" />
                </div>

                <div className="mt-10">
                  <h2 className="font-['Chakra_Petch'] text-2xl font-bold text-white">
                    {category.name}
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                    <Users className="h-4 w-4 text-cyan-300" />
                    สมาชิก {category.memberCount} คน
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
