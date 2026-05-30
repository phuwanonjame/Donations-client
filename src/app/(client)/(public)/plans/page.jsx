'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Crown,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const billingOptions = [
  { id: 'monthly', label: '1 เดือน', suffix: '/เดือน' },
  { id: 'quarterly', label: '3 เดือน', suffix: '/3 เดือน' },
  { id: 'yearly', label: '1 ปี', suffix: '/ปี' },
];

const plans = [
  {
    name: 'Basic',
    icon: Zap,
    caption: 'เหมาะสำหรับผู้เริ่มต้นที่อยากลองเปิดรับโดเนท',
    description: 'โดเนทขึ้นจอได้ครบ ใช้งานง่าย และเริ่มต้นได้ทันที',
    price: { monthly: 0, quarterly: 0, yearly: 0 },
    cta: 'แพลนปัจจุบัน',
    current: true,
    accent: 'from-slate-500 to-slate-300',
    border: 'border-white/10',
    glow: 'bg-white/10',
    summary: 'โดเนทขึ้นจอ 10 ครั้ง/เดือน',
    features: [
      { label: 'โดเนทขึ้นจอ 10 ครั้งต่อเดือน', included: true },
      { label: 'มีโฆษณาในหน้ารับเงิน', included: false },
      { label: 'ปรับธีมหน้ารับเงินได้เฉพาะพื้นฐาน', included: false },
      { label: 'ปรับแต่งวิดเจ็ตเริ่มต้นได้', included: true },
    ],
  },
  {
    name: 'Lite',
    icon: Sparkles,
    caption: 'ชุดประหยัดที่พร้อมใช้งานสำหรับครีเอเตอร์รายวัน',
    description: 'ปลดโฆษณา เพิ่มความน่าเชื่อถือ และแต่งหน้าเพจให้เป็นตัวเอง',
    price: { monthly: 29, quarterly: 79, yearly: 290 },
    cta: 'อัปเกรดเป็น Lite',
    accent: 'from-cyan-400 to-teal-300',
    border: 'border-cyan-400/20',
    glow: 'bg-cyan-400/15',
    summary: 'โดเนทขึ้นจอ 30 ครั้ง/เดือน',
    features: [
      { label: 'โดเนทขึ้นจอ 30 ครั้งต่อเดือน', included: true },
      { label: 'ไม่มีโฆษณาในหน้ารับเงิน', included: true },
      { label: 'เปลี่ยนรูปปก พื้นหลัง และโทนสีได้', included: true },
      { label: 'อัปโหลดเสียงแจ้งเตือนของตัวเอง', included: true },
    ],
  },
  {
    name: 'Pro',
    icon: Crown,
    caption: 'สำหรับคนที่อยากทำแบรนด์และปรับแต่งประสบการณ์ให้ลึกขึ้น',
    description: 'สมดุลที่สุดระหว่างราคาและความสามารถสำหรับสายสตรีมจริงจัง',
    price: { monthly: 79, quarterly: 219, yearly: 790 },
    cta: 'อัปเกรดเป็น Pro',
    accent: 'from-sky-400 to-cyan-300',
    border: 'border-sky-400/30',
    glow: 'bg-sky-400/15',
    summary: 'โดเนทขึ้นจอ 80 ครั้ง/เดือน',
    features: [
      { label: 'โดเนทขึ้นจอ 80 ครั้งต่อเดือน', included: true },
      { label: 'ไม่มีโฆษณาในหน้ารับเงิน', included: true },
      { label: 'ธีม วิดเจ็ต และเสียงแจ้งเตือนปรับได้ครบ', included: true },
      { label: 'ตั้งค่าการแสดงผลขั้นสูงสำหรับสตรีม', included: true },
    ],
  },
  {
    name: 'Ultra',
    icon: Rocket,
    caption: 'ปลดล็อกทุกอย่างสำหรับผู้ที่ต้องการความยืดหยุ่นเต็มรูปแบบ',
    description: 'แพลนแนะนำสำหรับครีเอเตอร์ที่อยากใช้ระบบได้แบบไม่มีข้อจำกัด',
    price: { monthly: 249, quarterly: 699, yearly: 2490 },
    cta: 'อัปเกรดเป็น Ultra',
    accent: 'from-cyan-300 via-sky-300 to-teal-200',
    border: 'border-cyan-300/40',
    glow: 'bg-cyan-300/20',
    summary: 'โดเนทขึ้นจอไม่จำกัด',
    featured: true,
    features: [
      { label: 'โดเนทขึ้นจอได้ไม่จำกัด', included: true },
      { label: 'ไม่มีโฆษณาในหน้ารับเงิน', included: true },
      { label: 'ปรับแต่งทุกส่วนของหน้าและวิดเจ็ตได้ทั้งหมด', included: true },
      { label: 'เหมาะกับแคมเปญขนาดใหญ่และงานโปรโมชัน', included: true },
    ],
  },
];

const faqs = [
  {
    title: 'ถ้าเริ่มจากแพลนฟรีก่อน แล้วค่อยอัปเกรดได้ไหม',
    detail: 'ได้เลย คุณสามารถเริ่มจาก Basic แล้วค่อยอัปเกรดเมื่ออยากปลดล็อกฟีเจอร์เพิ่มขึ้น',
  },
  {
    title: 'ซื้อแบบ 3 เดือนหรือ 1 ปีคุ้มกว่ายังไง',
    detail: 'แพลนระยะยาวช่วยลดค่าใช้จ่ายเฉลี่ยต่อเดือน เหมาะกับคนที่ใช้งานต่อเนื่อง',
  },
  {
    title: 'แพลนไหนเหมาะกับคนสตรีมบ่อย',
    detail: 'ถ้าสตรีมเป็นประจำและอยากแต่งหน้าเพจจริงจัง แนะนำ Pro หรือ Ultra',
  },
];

const trustItems = [
  'รองรับการปรับแต่งหน้ารับเงิน',
  'จัดการวิดเจ็ตและเสียงแจ้งเตือนได้',
  'พร้อมขยายตามการเติบโตของช่อง',
];

function formatPrice(value) {
  return value.toLocaleString('th-TH');
}

export default function PlansPage() {
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="relative overflow-hidden bg-[#0A1628] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_40%),linear-gradient(180deg,rgba(10,22,40,0.1),rgba(10,22,40,1))]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"
        >
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              เลือกแพลนที่โตไปพร้อมกับช่องของคุณ
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
              เลือกแพลน
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                ที่เหมาะกับการรับโดเนทของคุณ
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              หน้านี้ออกแบบมาให้เลือกง่ายขึ้น เห็นความต่างชัดขึ้น และยังคงโทนของแพลตฟอร์มเดิม
              เพื่อให้คุณอัปเกรดได้ตรงกับรูปแบบการใช้งานจริง
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Billing Cycle</p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              รองรับทั้งรายเดือน ราย 3 เดือน และรายปี เพื่อให้เลือกจ่ายตามจังหวะการเติบโตของช่องได้สบายขึ้น
            </p>

            <div className="mt-6 inline-flex w-full flex-wrap gap-2 rounded-full border border-white/10 bg-black/20 p-1.5">
              {billingOptions.map((option) => {
                const active = billing === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBilling(option.id)}
                    className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 md:text-base ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-[#0A1628] shadow-lg shadow-cyan-500/20'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-4">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.price[billing];
            const suffix = billingOptions.find((option) => option.id === billing)?.suffix ?? '/เดือน';

            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className={`group relative overflow-hidden rounded-[2rem] border ${plan.border} bg-white/5 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.07] ${
                  plan.featured ? 'ring-1 ring-cyan-300/40 xl:-mt-4 xl:mb-4' : ''
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-40 ${plan.glow} blur-3xl`} />

                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-cyan-300 to-teal-200 px-3 py-1 text-xs font-bold text-[#0A1628]">
                    แนะนำ
                  </div>
                )}

                <div className="relative z-10 flex h-full flex-col">
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.accent} shadow-lg shadow-cyan-950/20`}>
                    <Icon className="h-7 w-7 text-[#0A1628]" />
                  </div>

                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight">{plan.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-cyan-100/80">{plan.caption}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{plan.description}</p>
                  </div>

                  <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ราคาเริ่มต้น</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-lg text-slate-400">฿</span>
                      <span className="text-4xl font-bold tracking-tight">
                        {formatPrice(price)}
                      </span>
                      <span className="pb-1 text-sm text-slate-400">{suffix}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{plan.summary}</p>
                  </div>

                  <Button
                    className={`mb-6 h-12 w-full rounded-full text-sm font-semibold transition-all ${
                      plan.featured
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200 text-[#0A1628] shadow-lg shadow-cyan-500/20 hover:brightness-110'
                        : plan.current
                          ? 'border border-white/15 bg-white/10 text-white hover:bg-white/15'
                          : 'border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20'
                    }`}
                  >
                    {plan.cta}
                    {!plan.current && <ArrowRight className="ml-1 h-4 w-4" />}
                  </Button>

                  <div className="mt-auto">
                    <p className="mb-3 text-sm font-medium text-slate-400">สิ่งที่คุณจะได้</p>
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature.label}
                          className={`flex items-start gap-3 text-sm leading-6 ${
                            feature.included ? 'text-slate-100' : 'text-slate-500'
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                              feature.included
                                ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-300'
                                : 'border-white/10 bg-white/5 text-slate-500'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span>{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Why This Page</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight">หน้าราคาแบบใหม่ที่อ่านง่ายและเทียบได้เร็ว</h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              เราจัดลำดับข้อมูลใหม่ให้เห็นความต่างของแต่ละแพลนชัดตั้งแต่ราคา ความจุ และขอบเขตการปรับแต่ง
              เพื่อช่วยลดภาระการตัดสินใจ โดยยังรักษาความรู้สึก modern creator tool ของโปรเจกต์นี้ไว้ครบ
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/50 p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-300 text-[#0A1628]">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">คำถามที่พบบ่อย</h3>
                <p className="text-sm text-slate-400">สรุปสั้น ๆ ก่อนตัดสินใจอัปเกรด</p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">{faq.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{faq.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
