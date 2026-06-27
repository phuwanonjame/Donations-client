import Link from "next/link";
import { ArrowRight, HeartHandshake, Lightbulb, Rocket, ShieldCheck, Sparkles } from "lucide-react";

const pillars = [
  {
    title: "Why I Built This",
    description:
      "โปรเจกต์นี้เริ่มจากความตั้งใจที่จะทำให้ครีเอเตอร์จัดการระบบรับโดเนตและ widget ได้ง่ายขึ้นในที่เดียว โดยไม่ต้องเสียเวลาสลับหลายเครื่องมือ.",
    icon: Lightbulb,
  },
  {
    title: "What I Want To Solve",
    description:
      "ผมอยากลดงานหลังบ้านที่ซ้ำซ้อน เช่น การตั้งค่าหน้าโดเนต การแจ้งเตือน และการดูข้อมูลผู้สนับสนุน เพื่อให้ผู้สร้างโฟกัสกับคอนเทนต์ได้มากขึ้น.",
    icon: Rocket,
  },
  {
    title: "What Matters Most",
    description:
      "ความเรียบง่าย ความน่าเชื่อถือ และประสบการณ์ที่ใช้งานได้จริง คือแกนหลักของการออกแบบหน้านี้และทั้งระบบ.",
    icon: ShieldCheck,
  },
];

const values = [
  "ช่วยให้ครีเอเตอร์เริ่มต้นได้เร็ว โดยไม่ต้องตั้งค่าซับซ้อนเกินไป",
  "รวมเครื่องมือสำคัญไว้ใน workflow เดียวที่ดูแลง่าย",
  "ออกแบบให้พร้อมต่อยอดในอนาคต ทั้งด้าน analytics, alerts และ customization",
];

export const metadata = {
  title: "About Me | StreamFlow",
  description: "Learn more about the creator and purpose behind StreamFlow.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07111F] text-white">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-3xl" />
          <div className="absolute right-[-8rem] top-24 h-[24rem] w-[24rem] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" />
                About Me
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                สร้าง StreamFlow เพื่อให้การรับโดเนต
                <span className="block text-cyan-300">ง่ายขึ้น ชัดขึ้น และพร้อมโตไปกับครีเอเตอร์</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                ผมทำโปรเจกต์นี้ขึ้นมาเพื่อแก้ปัญหาที่ครีเอเตอร์หลายคนเจอเหมือนกัน:
                เครื่องมือกระจัดกระจาย ตั้งค่ายุ่ง และดูแลหลังบ้านใช้เวลามากเกินไป
                StreamFlow จึงถูกออกแบบให้เป็นศูนย์กลางสำหรับการจัดการโดเนต แจ้งเตือน และองค์ประกอบที่ช่วยให้การไลฟ์ดูเป็นมืออาชีพขึ้น.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-6 py-3 font-semibold text-[#07111F] shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-white"
                >
                  เริ่มใช้งาน
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
                >
                  กลับหน้าแรก
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-emerald-400/10 blur-2xl" />
              <div className="relative rounded-[2rem] border border-cyan-300/15 bg-slate-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
                  <div>
                    <p className="text-sm text-slate-400">Creator Focus</p>
                    <p className="mt-1 text-2xl font-bold text-white">Less setup, more creating</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {values.map((value) => (
                    <div
                      key={value}
                      className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-4 text-sm leading-7 text-slate-300"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/55 p-6 backdrop-blur sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Purpose Behind The Project
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              จุดประสงค์ที่ทำโปรเจกต์นี้
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              เป้าหมายของผมไม่ใช่แค่สร้างหน้าเว็บสวย ๆ แต่คือการทำเครื่องมือที่ใช้งานได้จริง
              สำหรับครีเอเตอร์ที่ต้องการระบบโดเนตที่ดูดี ตั้งค่าได้ และรองรับการเติบโตในระยะยาว.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6"
              >
                <div className="inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
