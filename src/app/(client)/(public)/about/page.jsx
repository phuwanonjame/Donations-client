import Link from 'next/link';
import {
  ArrowRight,
  Blocks,
  Compass,
  HeartHandshake,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

const principles = [
  {
    title: 'สร้างจากปัญหาจริง ไม่ใช่แค่จากไอเดีย',
    description:
      'ทุกฟีเจอร์เริ่มจากการมอง workflow จริงของ creator ว่าต้องเสียเวลาอยู่ตรงไหนก่อนเริ่มไลฟ์ แล้วเราค่อยออกแบบเพื่อลดขั้นตอนที่ไม่จำเป็นออกทีละจุด',
    icon: Lightbulb,
  },
  {
    title: 'ความน่าเชื่อถือมาก่อนลูกเล่น',
    description:
      'เพราะระบบนี้เกี่ยวข้องกับการรับเงิน ความชัดเจนของข้อมูล การตั้งค่าที่เข้าใจง่าย และ flow ที่ไม่ทำให้ผู้ใช้สับสน จึงสำคัญกว่าลูกเล่นที่ดูหวือหวาแต่ใช้งานจริงยาก',
    icon: ShieldCheck,
  },
  {
    title: 'ออกแบบให้โตต่อได้โดยไม่ต้องรื้อ workflow ใหม่',
    description:
      'เราออกแบบให้เริ่มต้นง่าย แต่ยังขยายต่อได้ ทั้งวิดเจ็ต, หน้ารับโดเนท, preview และ dashboard เพื่อให้ระบบโตไปพร้อมกับช่องของผู้ใช้จริง',
    icon: Rocket,
  },
];

const sections = [
  {
    eyebrow: 'Vision',
    title: 'StreamFlow ไม่ได้ตั้งใจเป็นแค่หน้าโดเนทสวย ๆ',
    body:
      'เป้าหมายของเราคือการทำระบบรับโดเนทที่ช่วยให้ creator เปิดใช้งานได้เร็ว ดูดีตั้งแต่วันแรก และมีเครื่องมือพอที่จะพัฒนา experience ต่อได้เมื่อช่องโตขึ้น ทั้งฝั่งผู้ให้โดเนทและฝั่งคนไลฟ์',
    icon: Blocks,
  },
  {
    eyebrow: 'Process',
    title: 'เราเชื่อว่าของที่ดีต้องใช้ได้จริงก่อน แล้วค่อยยกระดับความสวย',
    body:
      'เราออกแบบแบบ product team มากกว่าการทำ feature แยกส่วน ทุกหน้าต้องตอบได้ว่าช่วยให้ผู้ใช้ตัดสินใจเร็วขึ้นไหม ตั้งค่าง่ายขึ้นไหม และลดความลังเลก่อนเอาไปใช้จริงได้หรือเปล่า',
    icon: Compass,
  },
  {
    eyebrow: 'Philosophy',
    title: 'เราอยากให้ผู้ใช้รู้ว่าระบบนี้ถูกดูแลด้วยมาตรฐานแบบ product studio',
    body:
      'แทนที่จะเล่าว่าใครคือคนเขียนโค้ด เราเลือกเล่าว่าทีมนี้ตัดสินใจอย่างไร จัดลำดับความสำคัญแบบไหน และตั้งมาตรฐานของความเสถียร, ความชัดเจน และประสบการณ์ใช้งานไว้ที่ระดับใด',
    icon: HeartHandshake,
  },
];

const buildApproach = [
  'รวมวิดเจ็ตหลักไว้ในระบบเดียว เช่น แจ้งเตือนโดเนท, เป้าหมายโดเนท, อันดับผู้สนับสนุน, โดเนทสูงสุด และโดเนทล่าสุด',
  'ทำ preview ให้เห็นผลจริงก่อนขึ้นไลฟ์ เพื่อให้ผู้ใช้ตัดสินใจจากของที่เห็น ไม่ใช่จากการเดา',
  'ลด friction ในการเอาไปใช้กับ OBS / Streamlabs ด้วย Widget URL ที่พร้อมคัดลอกและพร้อมใช้งาน',
  'ค่อย ๆ ปรับดีไซน์และ UX ให้ดูดีขึ้น โดยไม่ทำลายสิ่งที่ผู้ใช้ตั้งค่าไว้แล้ว',
];

const teamCards = [
  {
    title: 'Product Thinking',
    description: 'ทุกฟีเจอร์ใหม่ต้องตอบให้ได้ก่อนว่าช่วย creator ตรงไหน ลดงานหลังบ้านอะไร และทำให้การรับโดเนทง่ายขึ้นอย่างไร',
    icon: Sparkles,
  },
  {
    title: 'Experience Design',
    description: 'เราให้ความสำคัญกับ preview, responsive layout, การตั้งค่าที่อ่านง่าย และหน้าจอที่ช่วยให้ผู้ใช้ตัดสินใจได้เร็วขึ้น',
    icon: Wrench,
  },
  {
    title: 'Creator Empathy',
    description: 'เราออกแบบในมุมของคนที่ต้องไลฟ์จริง ต้องเปิด OBS จริง และต้องการระบบที่เชื่อถือได้ระหว่างออกอากาศ',
    icon: Users,
  },
];

export const metadata = {
  title: 'About | StreamFlow',
  description: 'รู้จักแนวคิด ทีม และทิศทางของ StreamFlow ว่าเรากำลังสร้างโปรดักต์นี้เพื่อใครและทำไม',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07111F] text-white">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-3xl" />
          <div className="absolute right-[-10rem] top-24 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" />
                About StreamFlow
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                เราไม่ได้เล่าถึงแค่คนทำ
                <span className="block text-cyan-300">เราเล่าถึงวิธีคิดของทีมที่สร้างโปรดักต์นี้</span>
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                สำหรับ SaaS ที่เกี่ยวกับการรับเงิน ความน่าเชื่อถือสำคัญพอ ๆ กับฟีเจอร์ หน้านี้จึงถูกออกแบบในมุม
                product studio เพื่ออธิบายว่าเราสร้าง StreamFlow ด้วยแนวคิดแบบไหน ตัดสินใจอย่างไร และตั้งมาตรฐานของประสบการณ์ใช้งานไว้ระดับใด
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
                    <p className="text-sm text-slate-400">Team Perspective</p>
                    <p className="mt-1 text-2xl font-bold text-white">Studio mindset, product-first execution</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {teamCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/10 p-2 text-cyan-300">
                          <card.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                          <p className="mt-1 text-sm leading-7 text-slate-300">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6"
            >
              <div className="inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                <section.icon className="h-6 w-6" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">{section.eyebrow}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/55 p-6 backdrop-blur sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              How We Build
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              ถ้าจะทำหน้าแนะนำทีมให้อ่านแล้วรู้จักตัวตนจริง มันควรเล่าวิธีคิด กระบวนการ และมาตรฐานของงาน
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              สำหรับโปรดักต์แบบนี้ หน้า About ที่ดีควรช่วยตอบ 3 เรื่องพร้อมกัน: เรากำลังสร้างสิ่งนี้เพื่อใคร,
              เราทำงานกันด้วยหลักคิดแบบไหน และผู้ใช้จะมั่นใจได้อย่างไรว่าระบบนี้ถูกพัฒนาอย่างตั้งใจในระยะยาว
              เราเลยเลือกเล่าในมุม vision, process และ philosophy ของทีม แทนการทำหน้าแนะนำตัวบุคคลแบบทั่วไป
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {buildApproach.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-5 py-4 text-sm leading-7 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
