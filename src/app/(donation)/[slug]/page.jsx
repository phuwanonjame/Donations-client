"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Globe,
  Heart,
  Lock,
  Moon,
  Music2,
  Play,
  ShieldCheck,
  Trophy,
  Upload,
  UserRound,
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

  const handleStorageChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
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
  { id: "content", label: "คอนเทนต์ล่าสุด", icon: Heart },
  { id: "schedule", label: "ตารางสตรีม", icon: CalendarDays },
  { id: "top", label: "Top Donors", icon: Trophy },
  { id: "about", label: "เกี่ยวกับสตรีมเมอร์", icon: UserRound },
];

function PaymentMethodCard({ title, subtitle, active = false, badge }) {
  return (
    <button
      type="button"
      className={[
        "rounded-2xl border px-4 py-3 text-left transition",
        active
          ? "border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.18)]"
          : "border-white/10 bg-[#0a1336]/80 hover:border-white/20 hover:bg-[#0c173e]",
      ].join(" ")}
    >
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-900">
        {badge}
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-white/45">{subtitle}</p>
    </button>
  );
}

function SectionShell({ children, className = "" }) {
  return (
    <section
      className={[
        "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,49,0.94),rgba(8,13,39,0.96))] shadow-[0_22px_80px_rgba(3,7,24,0.45)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[22px] border border-white/6 bg-[#0a1233]/80 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <Play className="h-8 w-8 text-white/25" />
      </div>
      <p className="text-lg font-semibold text-white/75">{title}</p>
      <p className="mt-2 max-w-md text-sm text-white/38">{description}</p>
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
            embedUrl: embed.embedUrl || video.embedUrl || "",
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

  const avatarFallback = settings.profile.name?.charAt(0)?.toUpperCase() || "D";

  return (
    <div
      className="min-h-screen bg-[#040822] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(55, 65, 180, 0.18), transparent 28%), linear-gradient(180deg, #040822 0%, #05092a 100%)",
      }}
    >
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#040822]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2d6bff,#712cff)] shadow-[0_10px_30px_rgba(65,105,255,0.35)]">
              <span className="text-lg font-black text-white">D</span>
            </div>
            <div>
              <p className="text-lg font-black tracking-wide text-white">DONATEHUB</p>
              <p className="text-xs text-white/45">by Streamflow</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden items-center gap-2 text-sm text-white/65 sm:flex">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              ปลอดภัย 100%
            </span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
            >
              <Moon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-2xl bg-[linear-gradient(135deg,#1e5fff,#10a2ff)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(30,95,255,0.35)] transition hover:brightness-110"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1180px] px-4 pb-12 pt-6 lg:px-8">
        <SectionShell className="overflow-hidden">
          <div className="relative min-h-[260px] border-b border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${settings.profile.bannerUrl || settings.profile.backgroundUrl})`,
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,25,0.2),rgba(3,7,26,0.88))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(90,74,255,0.32),transparent_24%),radial-gradient(circle_at_84%_40%,rgba(255,72,145,0.16),transparent_18%)]" />

            <div className="relative flex flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end">
              <div className="relative shrink-0">
                {settings.profile.avatarUrl ? (
                  <img
                    src={settings.profile.avatarUrl}
                    alt={settings.profile.name}
                    className="h-28 w-28 rounded-full border-4 border-cyan-300/70 object-cover shadow-[0_18px_45px_rgba(14,165,233,0.28)] sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-cyan-300/70 bg-[linear-gradient(135deg,#2563eb,#7c3aed)] text-4xl font-black text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] sm:h-32 sm:w-32">
                    {avatarFallback}
                  </div>
                )}
                <span className="absolute bottom-2 right-1 h-5 w-5 rounded-full border-4 border-[#0a1233] bg-lime-400" />
              </div>

              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {settings.profile.isOnline ? (
                    <>
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        LIVE
                      </span>
                      <span className="rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1 text-xs font-medium text-lime-300">
                        ออนไลน์
                      </span>
                    </>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                    {settings.profile.name}
                  </h1>
                  {settings.profile.verified ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.45)]">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-base text-white/65">{settings.profile.handle}</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                  {settings.profile.bio}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {socials.map((social) => {
                    const Icon = socialIcons[social.id] || Play;

                    return (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0b1236]/85 text-white/80 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <SectionShell className="border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(9,16,48,0.98),rgba(8,14,40,0.98))] px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {settings.donation.pageTitle}
                      </h2>
                      <p className="mt-1 text-sm text-white/50">
                        {settings.donation.welcomeMessage}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d173f]/90 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-cyan-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">ปลอดภัย 100%</p>
                      <p className="text-xs text-white/40">
                        ตรวจสอบยอดผู้สนับสนุนแบบเรียลไทม์
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-white">ใส่ข้อมูลผู้โดเนท</p>
                        <p className="text-xs text-white/40">ชื่อของคุณ (แสดงบนสตรีม)</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-[#08102d] px-4 py-3 text-sm text-white outline-none placeholder:text-white/22 focus:border-cyan-400/45"
                        placeholder="เช่น xB6, Somchai, Anonymous"
                      />
                      <div>
                        <textarea
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-white/10 bg-[#08102d] px-4 py-3 text-sm text-white outline-none placeholder:text-white/22 focus:border-cyan-400/45"
                          placeholder="ส่งข้อความให้กำลังใจสั้น ๆ ❤️"
                        />
                        <p className="mt-2 text-right text-xs text-white/25">0/255</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-white">เลือกช่องทางการชำระเงิน</p>
                        <p className="text-xs text-white/40">สแกน QR หรือโอนผ่านบัญชี</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <PaymentMethodCard
                        title="PromptPay"
                        subtitle="สแกน QR Code"
                        badge="PP"
                        active
                      />
                      <PaymentMethodCard
                        title="โอนธนาคาร"
                        subtitle="ทุกธนาคาร"
                        badge="BK"
                      />
                      <PaymentMethodCard
                        title="TrueMoney"
                        subtitle="วอลเล็ต"
                        badge="TM"
                      />
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
                      <div className="rounded-2xl border border-white/10 bg-[#08102d] p-4">
                        <p className="mb-3 text-sm text-white/55">สแกน QR Code เพื่อชำระเงิน</p>
                        <div className="flex h-[170px] items-center justify-center rounded-2xl bg-white p-3">
                          {settings.donation.qrCodeUrl ? (
                            <img
                              src={settings.donation.qrCodeUrl}
                              alt="QR Code"
                              className="h-full w-full rounded-xl object-contain"
                            />
                          ) : (
                            <div className="grid h-full w-full grid-cols-5 gap-1 rounded-xl bg-white p-2">
                              {Array.from({ length: 25 }).map((_, index) => (
                                <span
                                  key={index}
                                  className={index % 2 === 0 ? "bg-slate-900" : "bg-white"}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#08102d] p-4">
                        <p className="mb-3 text-sm text-white/55">หรือระบุจำนวนเงิน</p>
                        <input
                          className="w-full rounded-2xl border border-white/10 bg-[#060d27] px-4 py-3 text-sm text-white outline-none placeholder:text-white/22 focus:border-cyan-400/45"
                          placeholder={`ขั้นต่ำ ${settings.donation.minAmount} บาท`}
                        />

                        <div className="mt-4">
                          <p className="mb-3 text-sm text-white/45">ยอดนิยม</p>
                          <div className="grid grid-cols-4 gap-2">
                            {(settings.donation.quickAmounts || [10, 20, 100, 500])
                              .slice(0, 4)
                              .map((amount) => (
                                <button
                                  type="button"
                                  key={amount}
                                  className="rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/75 transition hover:border-cyan-300/35 hover:bg-cyan-400/10 hover:text-white"
                                >
                                  {amount}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-white">อัปโหลดสลิป</p>
                        <p className="text-xs text-white/40">(ไม่บังคับ)</p>
                      </div>
                    </div>

                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-white/12 bg-[#08102d]/80 px-6 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Upload className="h-8 w-8 text-white/35" />
                      </div>
                      <p className="text-lg font-semibold text-white/85">
                        คลิกหรือวางไฟล์มาวางที่นี่
                      </p>
                      <p className="mt-2 text-sm text-white/35">
                        รองรับไฟล์ JPG, PNG ไม่เกิน 5MB
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/12 bg-emerald-400/5 px-4 py-3 text-center text-sm text-emerald-300">
                    ข้อมูลการชำระเงินของคุณจะถูกเก็บเป็นความลับ และไม่ถูกเปิดเผยต่อสาธารณะ
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-2xl bg-[linear-gradient(135deg,#6d3bff,#18a2ff)] px-5 py-4 text-lg font-bold text-white shadow-[0_20px_45px_rgba(64,82,255,0.35)] transition hover:brightness-110"
                  >
                    ยืนยันการโดเนท
                  </button>

                  <p className="text-center text-sm text-yellow-300/85">
                    🔒 ระบบปลอดภัย 100% by Streamflow
                  </p>
                </div>
              </div>
            </SectionShell>

            <SectionShell className="mt-6 px-5 py-8 text-center sm:px-6">
              <div className="mx-auto max-w-2xl">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Lock className="h-6 w-6 text-white/55" />
                </div>
                <h3 className="text-2xl font-bold text-white">เนื้อหาอื่น ๆ ถูกซ่อนไว้</h3>
                <p className="mt-2 text-sm leading-7 text-white/42">
                  คลิกเพื่อดูไฮไลต์, คอนเทนต์, ตารางสตรีม และข้อมูลอื่น ๆ เพิ่มเติม
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </SectionShell>

            <SectionShell className="mt-6 px-4 py-4 sm:px-5 sm:py-5">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
                {tabItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={[
                        "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "border-violet-400/35 bg-violet-500/12 text-violet-200 shadow-[0_0_25px_rgba(139,92,246,0.18)]"
                          : "border-white/8 bg-[#08102d]/80 text-white/55 hover:border-white/16 hover:text-white/80",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/8 bg-[#09112f]/90 p-4 sm:p-5">
                {activeTab === "highlights" ? (
                  videos.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="overflow-hidden rounded-[22px] border border-white/10 bg-[#071028]"
                        >
                          <div className="relative aspect-video bg-[#050b1f]">
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(109,59,255,0.25),rgba(24,162,255,0.2))]">
                                <Play className="h-10 w-10 text-white/70" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.85))]" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                              <div>
                                <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200/80">
                                  {video.platformLabel}
                                </p>
                                <p className="mt-1 text-lg font-semibold text-white">
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="ยังไม่มีไฮไลต์หรือคลิป"
                      description="ติดตามสตรีมเมอร์เพื่อรับชมไฮไลต์และคลิปเด็ด!"
                    />
                  )
                ) : null}

                {activeTab === "content" ? (
                  posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded-[22px] border border-white/10 bg-[#071028] p-4"
                        >
                          {post.image ? (
                            <img
                              src={post.image}
                              alt=""
                              className="mb-4 h-56 w-full rounded-[18px] object-cover"
                            />
                          ) : null}
                          <p className="text-base leading-7 text-white/85">{post.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="ยังไม่มีคอนเทนต์ล่าสุด"
                      description="คอนเทนต์ใหม่จะมาแสดงที่นี่เมื่อมีการอัปเดตจากหน้า settings"
                    />
                  )
                ) : null}

                {activeTab === "schedule" ? (
                  schedule.length > 0 ? (
                    <div className="grid gap-3">
                      {schedule.map((item) => (
                        <div
                          key={item.id}
                          className="grid items-center gap-3 rounded-[20px] border border-white/10 bg-[#071028] px-4 py-4 sm:grid-cols-[90px_1fr_1fr]"
                        >
                          <span className="text-sm font-semibold text-cyan-200">{item.day}</span>
                          <span className="text-sm text-white/75">{item.time}</span>
                          <span className="text-sm text-white/55">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="ยังไม่มีตารางสตรีม"
                      description="ตารางสตรีมจะมาแสดงที่นี่เมื่อมีการตั้งค่าไว้ในระบบ"
                    />
                  )
                ) : null}

                {activeTab === "top" ? (
                  <EmptyState
                    title="ยังไม่มี Top Donors"
                    description="อันดับผู้สนับสนุนจะมาแสดงที่นี่เมื่อมีข้อมูลการโดเนทจริง"
                  />
                ) : null}

                {activeTab === "about" ? (
                  <div className="rounded-[22px] border border-white/10 bg-[#071028] p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/70">
                      About Streamer
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-white">{settings.profile.name}</h3>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
                      {settings.profile.bio}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {socials.map((social) => (
                        <span
                          key={social.id}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65"
                        >
                          {social.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </SectionShell>
          </div>
        </SectionShell>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 py-6 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2025 Streamflow Co., Ltd. All rights reserved.</span>
          <div className="flex gap-6">
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>เงื่อนไขการให้บริการ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
