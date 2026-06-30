'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, ShieldCheck, CircleDollarSign } from "lucide-react";
import { useLanguage } from '../../contexts/LanguageContext';
import heroPreview from '../../../public/landing-hero-dashboard.png';

const particles = [
  { left: '8%', top: '18%', duration: 5.2, delay: 0.3 },
  { left: '19%', top: '74%', duration: 4.8, delay: 0.9 },
  { left: '32%', top: '28%', duration: 5.6, delay: 0.4 },
  { left: '44%', top: '81%', duration: 4.2, delay: 1.2 },
  { left: '57%', top: '16%', duration: 5.4, delay: 0.5 },
  { left: '68%', top: '62%', duration: 4.4, delay: 1.1 },
  { left: '81%', top: '26%', duration: 5.1, delay: 0.2 },
  { left: '92%', top: '72%', duration: 4.7, delay: 1.4 },
  { left: '13%', top: '88%', duration: 5.3, delay: 0.8 },
  { left: '74%', top: '10%', duration: 5.0, delay: 0.6 },
];

const featureBullets = [
  'Alert overlays แบบเรียลไทม์',
  'โดเนทและจัดการหน้าจอในที่เดียว',
  'รองรับ OBS / Streamlabs ทันที',
];

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#07111f] pt-24 sm:pt-28 lg:pt-32">
      <div className="absolute inset-0">
        <Image
          src={heroPreview}
          alt="StreamFlow dashboard wallpaper"
          fill
          priority
          className="object-cover object-center scale-[1.06]"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_46%,rgba(8,32,78,0.14),rgba(3,10,20,0.10)_28%,rgba(3,10,20,0.42)_58%,rgba(3,10,20,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,20,0.94)_0%,rgba(4,10,20,0.90)_16%,rgba(4,10,20,0.72)_34%,rgba(4,10,20,0.40)_52%,rgba(4,10,20,0.18)_68%,rgba(4,10,20,0.12)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#07111f]/58 via-[#07111f]/14 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-[#07111f]/72 via-[#07111f]/18 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(47,166,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(47,166,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] mix-blend-screen" />

        <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[8%] right-[14%] h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-3xl" />

        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/45"
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [-14, 14, -14], opacity: [0.2, 0.75, 0.2] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-[1500px] items-center px-4 pb-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-[560px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/28 bg-[#06111f]/66 px-4 py-2 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold tracking-wide text-cyan-200 sm:text-sm">{t.hero.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 text-4xl font-black leading-[0.95] text-white drop-shadow-[0_16px_42px_rgba(0,0,0,0.85)] sm:text-5xl lg:text-6xl xl:text-[4.5rem]"
          >
            <span className="block">รับบริจาคง่ายขึ้น</span>
            <span className="mt-2 block bg-gradient-to-r from-cyan-100 via-sky-200 to-cyan-400 bg-clip-text text-transparent">
              โฟกัสที่คอนเทนต์ที่คุณรัก
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-[520px] text-sm leading-relaxed text-slate-200 sm:text-base lg:text-lg"
          >
            StreamFlow ช่วยให้คุณรับการสนับสนุนจากผู้ชมทั่วโลก จัดการโดเนท แจ้งเตือน และ Overlay ได้แบบลื่นไหลใน Dashboard เดียว
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="group rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 px-7 py-6 text-base font-bold text-[#04101c] shadow-[0_16px_40px_rgba(22,211,255,0.32)] transition-all hover:scale-[1.01] hover:shadow-[0_18px_50px_rgba(22,211,255,0.42)]"
            >
              เริ่มใช้งานฟรี
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border border-white/18 bg-[#07111f]/44 px-7 py-6 text-base font-semibold text-white backdrop-blur-md hover:border-cyan-300/30 hover:bg-cyan-400/10"
            >
              <Play className="mr-2 h-5 w-5" />
              ดูตัวอย่างการทำงาน
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-white/10 bg-[#07111f]/34 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-200">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold">ปลอดภัยและรวดเร็ว</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">เชื่อมการแสดงผลกับ OBS / Streamlabs ได้ทันที</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#07111f]/34 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-200">
                <CircleDollarSign className="h-4 w-4" />
                <span className="font-semibold">รายได้ในที่เดียว</span>
              </div>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">ติดตามยอดโดเนทและเป้าหมายแบบเรียลไทม์</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400 sm:text-sm"
          >
            {featureBullets.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
