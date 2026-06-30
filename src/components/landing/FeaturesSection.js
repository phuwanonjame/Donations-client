'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Gauge, Link2, LayoutDashboard, ChevronRight, Trophy, Clock3, Target, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const featureIcons = [Bell, Gauge, Link2, LayoutDashboard];
const featureColors = [
  { color: 'from-cyan-500 to-blue-400', shadowColor: 'shadow-cyan-500/20' },
  { color: 'from-violet-500 to-fuchsia-400', shadowColor: 'shadow-violet-500/20' },
  { color: 'from-emerald-500 to-teal-400', shadowColor: 'shadow-emerald-500/20' },
  { color: 'from-amber-500 to-orange-400', shadowColor: 'shadow-amber-500/20' },
];

const copy = {
  en: {
    badge: 'Made for Real Donation Workflows',
    title1: 'More Than a Pretty Overlay.',
    title2: 'A Donation System That Converts Better.',
    subtitle:
      'StreamFlow helps you turn donation intent into action with widget-ready experiences, real previews, fast setup for OBS, and a dashboard that keeps every donation touchpoint consistent.',
    learnMore: 'See the widget workflow',
    items: [
      {
        title: 'Donation Widgets That Cover the Full Journey',
        description:
          'Use Donate Alert, Donate Goal, Leaderboard, Top Donate, and Recent Donate together to make each donation feel visible, rewarding, and worth repeating.',
      },
      {
        title: 'Configure with Confidence Before Going Live',
        description:
          'Preview typography, colors, layout, ranking blocks, and donation states before they reach your audience so your stream presentation stays polished every time.',
      },
      {
        title: 'Copy, Paste, and Run in OBS / Streamlabs',
        description:
          'Every widget is designed for browser-source usage, making it easier to launch new overlays quickly and keep your setup lightweight.',
      },
      {
        title: 'One Dashboard to Manage Every Donation Moment',
        description:
          'Control widget states, update settings, review previews, and keep all donation surfaces aligned without jumping between fragmented tools.',
      },
    ],
  },
  th: {
    badge: 'ออกแบบจาก flow รับโดเนทที่ใช้งานจริง',
    title1: 'ไม่ใช่แค่ overlay ที่สวย',
    title2: 'แต่คือระบบรับโดเนทที่ช่วยให้คนอยากกดมากขึ้น',
    subtitle:
      'StreamFlow ช่วยเปลี่ยนความตั้งใจของผู้ชมให้กลายเป็นการสนับสนุนจริง ด้วยวิดเจ็ตที่พร้อมใช้งาน, preview ก่อนขึ้นไลฟ์, ลิงก์พร้อมใช้กับ OBS และ dashboard ที่คุมประสบการณ์รับโดเนทได้ทั้งระบบ',
    learnMore: 'ดู flow การใช้งานวิดเจ็ต',
    items: [
      {
        title: 'วิดเจ็ตหลักครบตั้งแต่แจ้งเตือนจนถึงแรงจูงใจให้โดเนทซ้ำ',
        description:
          'มีครบทั้ง แจ้งเตือนโดเนท, เป้าหมายโดเนท, อันดับผู้สนับสนุน, โดเนทสูงสุด และโดเนทล่าสุด เพื่อทำให้ทุกยอดโดเนทถูกมองเห็นและกระตุ้นให้ผู้ชมคนอื่นอยากร่วมสนับสนุนต่อ',
      },
      {
        title: 'เห็นผลจริงก่อนขึ้นไลฟ์ด้วย preview ของแต่ละวิดเจ็ต',
        description:
          'ปรับตัวอักษร สี รูปแบบการ์ด การจัดอันดับ และสถานะการแสดงผลของ แจ้งเตือนโดเนท, เป้าหมายโดเนท และอันดับผู้สนับสนุน ได้ก่อนขึ้นจริง ช่วยให้หน้าสตรีมดูพร้อมและน่าเชื่อถือกว่าเดิม',
      },
      {
        title: 'มี Widget URL พร้อมใช้กับ OBS / Streamlabs ทันที',
        description:
          'แต่ละวิดเจ็ตมีลิงก์ Browser Source พร้อมคัดลอก ทำให้เอา แจ้งเตือนโดเนท, เป้าหมายโดเนท หรือโดเนทล่าสุด ไปวางบน OBS / Streamlabs ได้เร็วและลดขั้นตอนระหว่างเซ็ตสตรีม',
      },
      {
        title: 'คุมทุกจุดสำคัญจาก Dashboard เดียว',
        description:
          'เปิดปิดวิดเจ็ต, เข้าไปตั้งค่า, ดู preview และจัดการประสบการณ์ของ แจ้งเตือนโดเนท, อันดับผู้สนับสนุน, โดเนทสูงสุด และโดเนทล่าสุด ได้จากหน้าเดียว ช่วยให้ดูแลง่ายและต่อยอดได้เร็ว',
      },
    ],
  },
};

function FeaturePreview({ index, language }) {
  if (index === 0) {
    return (
      <div className="relative mt-5 rounded-2xl border border-cyan-500/20 bg-[#0D1B2A] p-4">
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
          {[
            { label: language === 'th' ? 'แจ้งเตือนโดเนท' : 'Donate Alert', icon: Bell },
            { label: language === 'th' ? 'เป้าหมายโดเนท' : 'Donate Goal', icon: Target },
            { label: language === 'th' ? 'อันดับผู้สนับสนุน' : 'Leaderboard', icon: Trophy },
            { label: language === 'th' ? 'โดเนทสูงสุด' : 'Top Donate', icon: Star },
            { label: language === 'th' ? 'โดเนทล่าสุด' : 'Recent Donate', icon: Clock3 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-cyan-500/15 bg-cyan-500/8 px-3 py-3 text-center text-slate-200">
                <Icon className="mx-auto mb-2 h-4 w-4 text-cyan-300" />
                <span className="line-clamp-2 text-[11px] leading-4">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="mt-5 rounded-2xl border border-violet-500/20 bg-[#0D1B2A] p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span>{language === 'th' ? 'Preview ก่อนใช้งานจริง' : 'Preview Before Going Live'}</span>
          <span>{language === 'th' ? 'ปรับได้ละเอียด' : 'Fine-tuned controls'}</span>
        </div>
        <div className="space-y-3">
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-violet-500/20" />
            <div className="flex-1 space-y-2">
              <div className="h-2 rounded-full bg-slate-700" />
              <div className="h-2 w-3/4 rounded-full bg-slate-800" />
            </div>
          </div>
          <div className="flex gap-2 text-[11px] text-slate-300">
            <div className="rounded-lg border border-violet-500/15 bg-violet-500/10 px-2 py-1">Typography</div>
            <div className="rounded-lg border border-violet-500/15 bg-violet-500/10 px-2 py-1">Layout</div>
            <div className="rounded-lg border border-violet-500/15 bg-violet-500/10 px-2 py-1">Colors</div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-[#0D1B2A] p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span>Widget URL</span>
          <span>{language === 'th' ? 'พร้อมคัดลอก' : 'Copy ready'}</span>
        </div>
        <div className="rounded-xl border border-emerald-500/15 bg-slate-950/80 px-3 py-3 font-mono text-[11px] text-emerald-200">
          https://streamflow.app/w/alert/...
        </div>
        <div className="mt-3 flex gap-2">
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">OBS</div>
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">Streamlabs</div>
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">Browser Source</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-amber-500/20 bg-[#0D1B2A] p-4">
      <div className="grid gap-3 text-xs text-slate-300">
        {[
          language === 'th' ? 'เปิด/ปิดวิดเจ็ตตามสถานะไลฟ์' : 'Toggle widgets by stream state',
          language === 'th' ? 'เข้าหน้าตั้งค่าได้ทันที' : 'Open settings instantly',
          language === 'th' ? 'ดู preview รายตัวก่อนปล่อยใช้งาน' : 'Review each preview before publishing',
        ].map((item, idx) => (
          <div key={item} className="flex items-center gap-3 rounded-xl border border-amber-500/10 bg-amber-500/5 px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-[11px] font-semibold text-amber-200">
              {idx + 1}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;

  return (
    <section id="features" className="relative overflow-hidden bg-[#0A1628] py-32">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="mb-6 inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
            {t.badge}
          </span>
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            {t.title1}
            <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {t.items.map((feature, index) => {
            const Icon = featureIcons[index];
            const colors = featureColors[index];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${colors.color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-5`} />

                <div className="relative h-full rounded-3xl border border-cyan-500/10 bg-[#1E3A5F]/30 p-8 backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/30">
                  <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r p-4 ${colors.color} ${colors.shadowColor} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan-400">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {feature.description}
                  </p>

                  <FeaturePreview index={index} language={language} />

                  <a href="/dashboard/widgets" className="group/link mt-6 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300">
                    {t.learnMore}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
