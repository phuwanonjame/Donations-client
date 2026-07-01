"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  CloudUpload,
  Gamepad2,
  Globe,
  Heart,
  Lock,
  Moon,
  Music2,
  Play,
  ShieldCheck,
  Trophy,
  UserRound,
  WalletCards,
} from "lucide-react";

import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";
import { loadDonatePageSettings } from "@/components/donation/shared/donatePageStorage";
import { getVideoEmbedData } from "@/components/donation/shared/videoEmbed";

function buildPublicDonatePageSettings(source) {
  return {
    ...source,
    display: {
      ...source.display,
      showProfileHeader: true,
      showDonationForm: true,
      showMusicPanel: false,
      showVideoHighlights: true,
      showDailyContent: true,
      showGallery: false,
      showSchedule: true,
      showProducts: false,
      showRecentDonations: false,
      showFooter: true,
    },
  };
}

const defaultPublicDonatePageSettings =
  buildPublicDonatePageSettings(defaultDonatePageSettings);

let cachedRawSettings = null;
let cachedPublicSettings = defaultPublicDonatePageSettings;

function subscribe(onStoreChange) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  const loadedSettings = loadDonatePageSettings(defaultDonatePageSettings);
  const rawSettings = JSON.stringify(loadedSettings);

  if (rawSettings !== cachedRawSettings) {
    cachedRawSettings = rawSettings;
    cachedPublicSettings = buildPublicDonatePageSettings(loadedSettings);
  }

  return cachedPublicSettings;
}

const socialIcons = {
  youtube: Clapperboard,
  facebook: Globe,
  tiktok: Music2,
};

const tabItems = [
  { id: "highlights", label: "ไฮไลต์ & คลิปเด็ด", icon: Play },
  { id: "content", label: "คอนเทนต์ล่าสุด", icon: Gamepad2 },
  { id: "schedule", label: "ตารางสตรีม", icon: CalendarDays },
  { id: "top", label: "Top Donors", icon: Trophy },
  { id: "about", label: "เกี่ยวกับสตรีมเมอร์", icon: UserRound },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function GlassPanel({ children, className = "" }) {
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-[18px] border border-[#3845a5]/70 bg-[#071238]/92 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(39,101,255,0.2),transparent_36%),linear-gradient(180deg,rgba(10,22,65,0.58),rgba(4,9,31,0.3))]" />
      <div className="relative">{children}</div>
    </section>
  );
}

function StepTitle({ number, title, subtitle }) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4c8eff]/70 bg-[#0b1a50] text-xs font-bold text-[#7eb6ff] shadow-[0_0_14px_rgba(61,126,255,0.25)]">
        {number}
      </span>
      <span>
        <span className="block text-sm font-semibold leading-5 text-white">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-xs leading-5 text-slate-400">{subtitle}</span>
        ) : null}
      </span>
    </div>
  );
}

function PaymentMethodCard({ title, subtitle, active = false, icon: Icon }) {
  return (
    <button
      type="button"
      className={cx(
        "flex min-h-[66px] items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left transition",
        active
          ? "border-[#5568ff]/70 bg-[#101d52] shadow-[inset_0_0_0_1px_rgba(72,112,255,0.18)]"
          : "border-[#253266] bg-[#0a143a] hover:border-[#42519a]"
      )}
    >
      <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-[8px] bg-white text-[#153065] shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold leading-5 text-white">
          {title}
        </span>
        <span className="block truncate text-xs leading-4 text-slate-400">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

function SocialButton({ href, icon: Icon, label, tone }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cx(
        "flex h-11 w-11 items-center justify-center rounded-[9px] border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5",
        tone || "bg-[#0c1740] text-white"
      )}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-[208px] flex-col items-center justify-center rounded-[14px] border border-[#1d2b62] bg-[#071133]/84 px-5 text-center">
      <div className="mb-3 text-[#314070]">
        <Clapperboard className="h-16 w-16" strokeWidth={1.35} />
      </div>
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      <p className="mt-1.5 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function FakeQrPattern() {
  return (
    <div className="grid h-full w-full grid-cols-7 gap-1 bg-white p-1">
      {Array.from({ length: 49 }).map((_, index) => {
        const dark =
          index % 2 === 0 ||
          index % 5 === 0 ||
          [1, 2, 7, 14, 35, 42, 43, 47, 48].includes(index);

        return (
          <span
            key={index}
            className={cx("rounded-[1px]", dark ? "bg-slate-950" : "bg-white")}
          />
        );
      })}
    </div>
  );
}

export default function DonateProfile() {
  const [activeTab, setActiveTab] = useState("highlights");
  const settings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultPublicDonatePageSettings
  );

  const socials = useMemo(
    () =>
      (settings.socials || [])
        .filter((item) => item.enabled)
        .filter((item) => ["youtube", "facebook", "tiktok"].includes(item.id))
        .slice(0, 3),
    [settings.socials]
  );

  const videos = useMemo(
    () =>
      (settings.videos || [])
        .filter((item) => item.enabled)
        .map((video) => {
          const embed = getVideoEmbedData(video.url || "");

          return {
            ...video,
            thumbnail: embed.thumbnailUrl || video.thumbnail || "",
            platformLabel: embed.platformLabel || video.platform || "Video",
          };
        })
        .slice(0, 4),
    [settings.videos]
  );

  const posts = useMemo(
    () => (settings.posts || []).filter((item) => item.enabled).slice(0, 2),
    [settings.posts]
  );

  const schedule = useMemo(
    () => (settings.schedule || []).filter((item) => item.enabled).slice(0, 6),
    [settings.schedule]
  );

  const quickAmounts = (settings.donation.quickAmounts || [10, 20, 100, 500]).slice(
    0,
    4
  );
  const avatarFallback = settings.profile.name?.charAt(0)?.toUpperCase() || "D";
  const bannerUrl =
    settings.profile.bannerUrl ||
    settings.profile.backgroundUrl ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e";

  return (
    <div className="min-h-screen bg-[#030720] text-white">
      <nav className="sticky top-0 z-40 h-[57px] border-b border-[#27306d] bg-[#030720]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-4 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[8px] bg-[#061044]">
              <div className="absolute inset-1 rounded-br-[18px] rounded-tl-[5px] bg-[linear-gradient(135deg,#15b7ff,#2856ff_46%,#6d33ff)]" />
              <div className="absolute left-0 top-0 h-full w-1/2 bg-[#030720]" />
              <span className="relative text-sm font-black text-white">D</span>
            </div>
            <div className="leading-none">
              <p className="text-[17px] font-black tracking-wide text-white">DONATEHUB</p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">by Streamflow</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs text-slate-300 sm:flex">
              <ShieldCheck className="h-4 w-4" />
              ปลอดภัย 100%
            </span>
            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/7 sm:flex"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/7 sm:flex"
            >
              <Moon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-[10px] bg-[#1668ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(22,104,255,0.36)] transition hover:bg-[#2675ff]"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </nav>

      <header className="relative h-[198px] overflow-hidden border-b border-[#18245a] bg-[#030720] sm:h-[210px]">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${bannerUrl})`,
            backgroundPosition: "center 38%",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#030720_0%,rgba(3,7,32,0.67)_30%,rgba(3,7,32,0.2)_70%,#030720_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,32,0.04),rgba(3,7,32,0.9))]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,#030720)]" />

        <div className="relative mx-auto flex h-full max-w-[1120px] items-end px-4 pb-7 sm:px-10">
          <div className="flex items-end gap-5">
            <div className="relative shrink-0">
              {settings.profile.avatarUrl ? (
                <img
                  src={settings.profile.avatarUrl}
                  alt={settings.profile.name}
                  className="h-[126px] w-[126px] rounded-full border-[3px] border-[#44b7ff]/90 object-cover shadow-[0_18px_42px_rgba(0,0,0,0.45)]"
                />
              ) : (
                <div className="flex h-[126px] w-[126px] items-center justify-center rounded-full border-[3px] border-[#44b7ff]/90 bg-[linear-gradient(135deg,#1c72ff,#7b35ff)] text-5xl font-black shadow-[0_18px_42px_rgba(0,0,0,0.45)]">
                  {avatarFallback}
                </div>
              )}
              <span className="absolute bottom-3 right-1.5 h-5 w-5 rounded-full border-[3px] border-[#071238] bg-[#34e64b]" />
            </div>

            <div className="pb-1">
              {settings.profile.isOnline ? (
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-[6px] bg-[#ff163b] px-2.5 py-1 text-[11px] font-black leading-none text-white">
                    ♥ LIVE
                  </span>
                  <span className="rounded-[6px] border border-[#23c769]/35 bg-[#0d331f]/80 px-2.5 py-1 text-[11px] font-bold leading-none text-[#43e578]">
                    ออนไลน์
                  </span>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <h1 className="text-[34px] font-black leading-none text-white sm:text-[38px]">
                  {settings.profile.name}
                </h1>
                {settings.profile.verified ? (
                  <BadgeCheck className="h-6 w-6 fill-[#168bff] text-white" />
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-300">{settings.profile.handle}</p>
              <p className="mt-2 max-w-[580px] text-sm leading-6 text-slate-100">
                {settings.profile.bio}
              </p>
              <div className="mt-4 flex gap-3">
                {socials.map((social) => {
                  const Icon = socialIcons[social.id] || Play;
                  const tone =
                    social.id === "youtube"
                      ? "bg-[#e8242f] text-white"
                      : social.id === "facebook"
                        ? "bg-[#1865d8] text-white"
                        : "bg-[#111827] text-white";

                  return (
                    <SocialButton
                      key={social.id}
                      href={social.href}
                      icon={Icon}
                      label={social.label}
                      tone={tone}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-4 pb-10 pt-3 sm:px-10">
        <GlassPanel className="mt-0">
          <div className="p-5 sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Heart className="mt-1 h-7 w-7 fill-[#9c75ff] text-[#a88cff]" />
                <div>
                  <h2 className="text-[24px] font-bold leading-8 text-white">
                    {settings.donation.pageTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    โดเนทเพื่อเป็นกำลังใจให้สตรีมเมอร์คนโปรดของคุณ
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-3 rounded-[12px] border border-[#243873] bg-[#101b4b]/90 px-4 py-3 md:flex">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#f7d66d]">ปลอดภัย 100%</p>
                  <p className="text-[11px] text-slate-400">รายการแนบสลิปตรวจสอบด้วยระบบอัจฉริยะ</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#3f75ff,#7b47ff)]">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </span>
              </div>
            </div>

            <div className="grid gap-7 lg:grid-cols-[1.15fr_0.82fr]">
              <div className="space-y-5 lg:border-r lg:border-[#22305f] lg:pr-7">
                <section>
                  <StepTitle
                    number="1"
                    title="ใส่ข้อมูลผู้โดเนท"
                    subtitle="ชื่อของคุณ (แสดงบนสตรีม)"
                  />
                  <input
                    className="h-10 w-full rounded-[9px] border border-[#1b295e] bg-[#040a24] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#3f7dff]"
                    placeholder="เช่น xB6, Somchai, Anonymous"
                  />
                  <label className="mt-3 block text-sm text-slate-400">
                    ข้อความถึงสตรีมเมอร์ (ไม่บังคับ)
                  </label>
                  <textarea
                    rows={3}
                    className="mt-2 h-[70px] w-full resize-none rounded-[9px] border border-[#1b295e] bg-[#040a24] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#3f7dff]"
                    placeholder="ส่งข้อความให้กำลังใจสั้น ๆ ❤️"
                  />
                  <p className="mt-1 text-right text-xs text-slate-500">0/255</p>
                </section>

                <section>
                  <StepTitle
                    number="2"
                    title="เลือกช่องทางการชำระเงิน"
                    subtitle="สแกน QR Code หรือโอนผ่านบัญชี"
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <PaymentMethodCard
                      title="PromptPay"
                      subtitle="สแกน QR Code"
                      icon={WalletCards}
                      active
                    />
                    <PaymentMethodCard
                      title="โอนธนาคาร"
                      subtitle="ทุกธนาคาร"
                      icon={Building2}
                    />
                    <PaymentMethodCard
                      title="TrueMoney"
                      subtitle="วอลเล็ต"
                      icon={WalletCards}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-[245px_1fr]">
                    <div>
                      <p className="mb-2 text-sm text-slate-400">สแกน QR Code เพื่อชำระเงิน</p>
                      <div className="rounded-[10px] border border-[#172454] bg-[#061032] p-3">
                        <div className="mx-auto flex h-[170px] w-[170px] items-center justify-center rounded-[6px] bg-white p-2">
                          {settings.donation.qrCodeUrl ? (
                            <img
                              src={settings.donation.qrCodeUrl}
                              alt="QR Code"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <FakeQrPattern />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-0 sm:pt-1">
                      <p className="mb-2 text-sm text-slate-400">หรือระบุจำนวนเงิน</p>
                      <input
                        className="h-10 w-full rounded-[9px] border border-[#1b295e] bg-[#040a24] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#3f7dff]"
                        placeholder="ระบุจำนวนเงิน (บาท)"
                      />
                      <p className="mb-2 mt-4 text-sm text-slate-500">ยอดนิยม</p>
                      <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map((amount) => (
                          <button
                            type="button"
                            key={amount}
                            className="h-10 rounded-[8px] border border-[#1d2b62] bg-[#10183d] text-sm font-semibold text-slate-300 transition hover:border-[#477cff] hover:text-white"
                          >
                            {amount}
                          </button>
                        ))}
                      </div>
                      <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                        <CircleHelp className="h-4 w-4" />
                        เมื่อชำระเงินแล้ว กรุณาอัปโหลดสลิปเพื่อยืนยันการโดเนท
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="flex flex-col">
                <StepTitle number="3" title="อัปโหลดสลิป" subtitle="(ไม่บังคับ)" />
                <div className="flex min-h-[226px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#2c3b74] bg-[#071133]/76 px-5 text-center">
                  <CloudUpload className="mb-3 h-9 w-9 text-[#9a80ff]" />
                  <p className="text-base font-semibold text-slate-200">
                    คลิกหรือวางไฟล์มาวางที่นี่
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    รองรับไฟล์ JPG, PNG ไม่เกิน 5MB
                  </p>
                </div>

                <p className="mx-auto mt-4 flex max-w-[330px] items-start gap-2 text-center text-xs leading-5 text-emerald-300/82">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    ข้อมูลการชำระเงินของคุณจะถูกเก็บเป็นความลับ และไม่ถูกเปิดเผยต่อสาธารณะ
                  </span>
                </p>

                <div className="flex-1" />
                <button
                  type="button"
                  className="mt-24 h-[62px] w-full rounded-[11px] bg-[linear-gradient(90deg,#6d32ff,#159dff)] text-lg font-bold text-white shadow-[0_0_28px_rgba(54,101,255,0.48)] transition hover:brightness-110 lg:mt-auto"
                >
                  ยืนยันการโดเนท
                  <Heart className="ml-2 inline h-5 w-5 fill-white/55 text-white/55" />
                </button>
                <p className="mt-4 text-center text-xs text-[#e4c65d]">
                  ระบบปลอดภัย 100% by Streamflow
                </p>
              </aside>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="mt-4">
          <div className="flex min-h-[150px] flex-col items-center justify-center px-5 py-7 text-center">
            <div className="-mt-10 mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-[#2a376f] bg-[#071238] text-slate-300">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-[22px] font-bold text-white">เนื้อหาอื่น ๆ ถูกซ่อนไว้</h3>
            <p className="mt-1.5 text-sm text-slate-400">
              คลิกเพื่อดูไฮไลต์, คอนเทนต์, ตารางสตรีม และข้อมูลอื่น ๆ เพิ่มเติม
            </p>
            <ChevronDown className="mt-4 h-6 w-6 text-white" />
          </div>
        </GlassPanel>

        <GlassPanel className="mt-4">
          <div className="p-5">
            <div className="grid overflow-hidden rounded-[10px] border border-[#1d2b62] bg-[#071033] sm:grid-cols-5">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={cx(
                      "flex h-[58px] items-center justify-center gap-2 border-[#1d2b62] px-3 text-sm font-semibold transition sm:border-r sm:last:border-r-0",
                      isActive
                        ? "border border-[#ab44ff] bg-[linear-gradient(90deg,rgba(161,49,255,0.26),rgba(18,91,255,0.34))] text-white shadow-[0_0_24px_rgba(118,64,255,0.38)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cx(
                        "h-5 w-5",
                        item.id === "top" ? "text-[#e8c96d]" : "text-[#a58cff]"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-[13px] border border-[#1b295e] bg-[#071133]/74 p-4">
              {activeTab === "highlights" ? (
                videos.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {videos.map((video) => (
                      <article
                        key={video.id}
                        className="overflow-hidden rounded-[13px] border border-[#1d2b62] bg-[#061032]"
                      >
                        <div className="relative aspect-video bg-[#040a24]">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Play className="h-10 w-10 text-slate-500" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(3,7,32,0.9))]" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase text-cyan-200/75">
                                {video.platformLabel}
                              </p>
                              <p className="mt-1 text-base font-semibold text-white">
                                {video.title}
                              </p>
                            </div>
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
                            >
                              <Play className="ml-0.5 h-4 w-4 fill-white" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="ยังไม่มีไฮไลต์หรือคลิป"
                    description="ติดตามสตรีมเมอร์เพื่อรับชมไฮไลต์และคลิปเด็ด"
                  />
                )
              ) : null}

              {activeTab === "content" ? (
                posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <article
                        key={post.id}
                        className="rounded-[13px] border border-[#1d2b62] bg-[#061032] p-4"
                      >
                        {post.image ? (
                          <img
                            src={post.image}
                            alt=""
                            className="mb-4 h-56 w-full rounded-[10px] object-cover"
                          />
                        ) : null}
                        <p className="text-sm leading-7 text-slate-200">{post.text}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="ยังไม่มีคอนเทนต์ล่าสุด"
                    description="คอนเทนต์ใหม่จะแสดงที่นี่เมื่อมีการอัปเดต"
                  />
                )
              ) : null}

              {activeTab === "schedule" ? (
                schedule.length > 0 ? (
                  <div className="grid gap-3">
                    {schedule.map((item) => (
                      <div
                        key={item.id}
                        className="grid items-center gap-3 rounded-[10px] border border-[#1d2b62] bg-[#061032] px-4 py-3 sm:grid-cols-[90px_1fr_1fr]"
                      >
                        <span className="text-sm font-semibold text-cyan-200">{item.day}</span>
                        <span className="text-sm text-slate-300">{item.time}</span>
                        <span className="text-sm text-slate-400">{item.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="ยังไม่มีตารางสตรีม"
                    description="ตารางสตรีมจะแสดงเมื่อมีการตั้งค่าไว้ในระบบ"
                  />
                )
              ) : null}

              {activeTab === "top" ? (
                <EmptyState
                  title="ยังไม่มี Top Donors"
                  description="อันดับผู้สนับสนุนจะแสดงที่นี่เมื่อมีข้อมูลการโดเนทจริง"
                />
              ) : null}

              {activeTab === "about" ? (
                <div className="rounded-[13px] border border-[#1d2b62] bg-[#061032] p-5">
                  <p className="text-xs font-semibold uppercase text-cyan-200/70">
                    About Streamer
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">
                    {settings.profile.name}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    {settings.profile.bio}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </GlassPanel>
      </main>

      <footer className="border-t border-[#131d4a]">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-5 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 Streamflow Co., Ltd. All rights reserved.</span>
          <div className="flex gap-9">
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>เงื่อนไขการให้บริการ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
