"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  CalendarDays,
  Clapperboard,
  Check,
  Copy,
  Download,
  Globe,
  Heart,
  Loader2,
  Music2,
  Play,
  RefreshCw,
  ShieldCheck,
  ImageIcon,
  Upload,
} from "lucide-react";
import { createDonation } from "@/actions/Donationsapi/donationHistoryApi";
import { getVideoEmbedData } from "@/components/donation/shared/videoEmbed";
import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";

const socialIcons = {
  youtube: Clapperboard,
  facebook: Globe,
  tiktok: Music2,
};

const WIDGET_ONLINE_API_BASE = "http://localhost:8080/widget/online";

const tabItems = [
  { id: "highlights", label: "ไฮไลต์ & คลิปเด็ด", icon: Play },
  { id: "content", label: "คอนเทนต์ล่าสุด", icon: Heart },
  { id: "schedule", label: "ตารางสตรีม", icon: CalendarDays },
  { id: "gallery", label: "รูปภาพ", icon: ImageIcon },
];

function DecorationSprite({
  src,
  alt,
  className = "",
  width = 160,
  height = 160,
}) {
  if (!src) {
    return null;
  }

  return (
    <div className={["pointer-events-none absolute z-20", className].join(" ")}>
      <Image
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

function PaymentMethodCard({
  title,
  subtitle,
  logoSrc,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition",
        active
          ? "border-[#2c9eff] bg-[#132458] shadow-[0_0_0_1px_rgba(50,150,255,0.35),0_0_26px_rgba(69,92,255,0.24)]"
          : "border-[#1d2c61] bg-[#0a1435] hover:border-[#344989] hover:bg-[#0d1842]",
      ].join(" ")}
    >
      {logoSrc ? (
        <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white p-1.5">
          <img
            src={logoSrc}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">{title}</p>
        <p className="truncate text-xs text-white/45">{subtitle}</p>
      </div>
    </button>
  );
}

function SectionShell({ children, className = "" }) {
  return (
    <section
      className={[
        "rounded-[22px] border border-[#25356f]/90 bg-[linear-gradient(180deg,rgba(10,17,49,0.94),rgba(8,13,39,0.96))] shadow-[0_22px_80px_rgba(3,7,24,0.45),inset_0_1px_0_rgba(100,139,255,0.12)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[18px] border border-[#1d2d63] bg-[#0a1233]/80 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[14px] border border-[#26376f] bg-white/5">
        <Play className="h-8 w-8 text-white/25" />
      </div>
      <p className="text-lg font-semibold text-white/75">{title}</p>
      <p className="mt-2 max-w-md text-sm text-white/38">{description}</p>
    </div>
  );
}

function TabContentSkeleton({ variant = "grid" }) {
  if (variant === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[18px] border border-[#1d2d63] bg-[#071028] p-4"
          >
            <div className="mb-4 h-4 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/8" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/8" />
              <div className="h-24 animate-pulse rounded-[14px] bg-white/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[16px] border border-[#1d2d63] bg-[#071028]"
        >
          <div className="aspect-[4/3] animate-pulse bg-white/6" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  onLoad,
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={["relative overflow-hidden", wrapperClassName].join(" ")}>
      {!isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,rgba(148,163,184,0.12),rgba(30,41,59,0.35))]" />
      ) : null}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={() => setIsLoaded(true)}
        className={[
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        ].join(" ")}
      />
    </div>
  );
}

export default function PublicDonatePage({
  settings: incomingSettings,
  donationTargetUserId = null,
  donationTargetUsername = "",
}) {
  const settings = {
    ...defaultDonatePageSettings,
    ...(incomingSettings || {}),
    design: {
      ...(defaultDonatePageSettings.design || {}),
      ...(incomingSettings?.design || {}),
    },
    profile: {
      ...(defaultDonatePageSettings.profile || {}),
      ...(incomingSettings?.profile || {}),
    },
    donation: {
      ...(defaultDonatePageSettings.donation || {}),
      ...(incomingSettings?.donation || {}),
      channels: {
        ...(defaultDonatePageSettings.donation?.channels || {}),
        ...(incomingSettings?.donation?.channels || {}),
        promptpay: {
          ...(defaultDonatePageSettings.donation?.channels?.promptpay || {}),
          ...(incomingSettings?.donation?.channels?.promptpay || {}),
        },
        bank: {
          ...(defaultDonatePageSettings.donation?.channels?.bank || {}),
          ...(incomingSettings?.donation?.channels?.bank || {}),
        },
      },
    },
    display: {
      ...(defaultDonatePageSettings.display || {}),
      ...(incomingSettings?.display || {}),
    },
  };

  const [activeTab, setActiveTab] = useState("highlights");
  const [isTabPending, startTabSwitch] = useTransition();
  const [selectedPayment, setSelectedPayment] = useState("promptpay");
  const [donationAmount, setDonationAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("10");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isWidgetOnline, setIsWidgetOnline] = useState(
    Boolean(settings.profile.isOnline)
  );
  const [isCheckingWidgetStatus, setIsCheckingWidgetStatus] = useState(false);
  const widgetStatusRequestRef = useRef(false);

  useEffect(() => {
    setIsWidgetOnline(Boolean(settings.profile.isOnline));
  }, [settings.profile.isOnline]);

  const refreshWidgetStatus = async () => {
    if (!donationTargetUserId || isCheckingWidgetStatus || widgetStatusRequestRef.current) {
      return;
    }

    widgetStatusRequestRef.current = true;
    setIsCheckingWidgetStatus(true);

    try {
      const res = await fetch(
        `${WIDGET_ONLINE_API_BASE}/${encodeURIComponent(donationTargetUserId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        setIsWidgetOnline(false);
        return;
      }

      const payload = await res.json();
      setIsWidgetOnline(Boolean(payload?.online));
    } catch {
      setIsWidgetOnline(false);
    } finally {
      widgetStatusRequestRef.current = false;
      setIsCheckingWidgetStatus(false);
    }
  };

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

  const gallery = useMemo(
    () => (settings.gallery || []).filter((item) => item.enabled).slice(0, 6),
    [settings.gallery]
  );
  const sectionDecorations = settings.design?.sectionDecorations || {};
  const bankChannel = settings.donation?.channels?.bank || {};
  const promptPayChannel = settings.donation?.channels?.promptpay || {};
  const bankName = bankChannel.bankName || "";
  const promptPayValue = promptPayChannel.value || "0826589650";
  const promptPayQrAmount = customAmount || String(donationAmount);
  const promptPayQrUrl = `https://promptpay.io/${encodeURIComponent(
    promptPayValue
  )}/${encodeURIComponent(promptPayQrAmount)}.png`;
  const successMessage =
    settings.donation?.welcomeMessage ||
    settings.donation?.successMessage ||
    "ขอบคุณที่โดเนทให้ streamer นะครับ";
  const donateButtonText =
    settings.donation?.buttonText ||
    defaultDonatePageSettings.donation?.buttonText ||
    "โดเนทเลย";

  const handleQuickAmount = (amount) => {
    setDonationAmount(amount);
    setCustomAmount(String(amount));
    clearFieldError("amount");
  };

  const handleAmountInput = (event) => {
    const value = event.target.value;
    setCustomAmount(value);
    clearFieldError("amount");

    const nextAmount = parseFloat(value);
    if (!Number.isNaN(nextAmount)) {
      setDonationAmount(nextAmount);
    }
  };

  const clearFieldError = (fieldName) => {
    setFormErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  const handleSlipChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSlipFile(file);
    setSubmitError("");

    if (file) {
      clearFieldError("slipFile");
    }
  };

  const handleDonateSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const nextErrors = {};
    const minAmount = Math.max(10, Number(settings.donation?.minAmount) || 0);
    const parsedAmount = Number.parseFloat(customAmount);

    if (!donorName.trim()) {
      nextErrors.donorName = "กรุณากรอกชื่อผู้โดเนท";
    }

    if (customAmount.trim() === "" || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "กรุณาระบุจำนวนเงินให้ถูกต้อง";
    } else if (parsedAmount < minAmount) {
      nextErrors.amount = `จำนวนขั้นต่ำ ${minAmount} บาท`;
    }

    if (!slipFile) {
      nextErrors.slipFile = "กรุณาแนบรูปสลิปการโอนเงิน";
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!donationTargetUserId) {
      setSubmitError(
        donationTargetUsername
          ? `ไม่พบบัญชีผู้รับโดเนทสำหรับ ${donationTargetUsername}`
          : "ไม่พบบัญชีผู้รับโดเนท"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const formData = new FormData();
      formData.append("userId", donationTargetUserId);
      formData.append("donorName", donorName.trim());
      if (donorMessage.trim()) {
        formData.append("donorMessage", donorMessage.trim());
      }
      formData.append("amount", String(parsedAmount));
      formData.append("currency", "THB");
      formData.append("paymentMethod", selectedPayment.toUpperCase());
      formData.append("slip", slipFile);

      await createDonation(formData);
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitError(error?.message || "ส่งข้อมูลโดเนทไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsSubmitting(false);
    setDonorName("");
    setDonorMessage("");
    setSlipFile(null);
    setFormErrors({});
    setSubmitError("");
  };

  const handleCopyAccountNumber = async () => {
    const accountNumber = bankChannel.accountNumber || "";
    if (!accountNumber || typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(true);
    window.setTimeout(() => setCopiedAccount(false), 1600);
  };

  const avatarFallback = settings.profile.name?.charAt(0)?.toUpperCase() || "D";
  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) {
      return;
    }

    startTabSwitch(() => {
      setActiveTab(nextTab);
    });
  };

  return (
    <div
      className="min-h-screen bg-[#040822] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(55, 65, 180, 0.18), transparent 28%), linear-gradient(180deg, #040822 0%, #05092a 100%)",
      }}
    >
      <main className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="relative min-h-[260px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${settings.profile.bannerUrl || settings.profile.backgroundUrl})`,
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,25,0.2),rgba(3,7,26,0.88))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(90,74,255,0.32),transparent_24%),radial-gradient(circle_at_84%_40%,rgba(255,72,145,0.16),transparent_18%)]" />
            <DecorationSprite
              src={sectionDecorations.panelLeft?.src}
              alt={sectionDecorations.panelLeft?.alt}
              className="left-0 top-0 w-24 sm:w-28 lg:w-32"
              width={128}
              height={128}
            />
            <DecorationSprite
              src={sectionDecorations.panelRight?.src}
              alt={sectionDecorations.panelRight?.alt}
              className="right-0 top-0 w-24 sm:w-28 lg:w-32"
              width={128}
              height={128}
            />

            <div className="relative flex flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:gap-8 lg:py-10">
              <div className="relative shrink-0">
                <div className="rounded-full border border-white/18 bg-white/8 p-1.5 shadow-[0_24px_70px_rgba(8,145,178,0.34)] backdrop-blur">
                  <div className="rounded-full border-4 border-cyan-200/70 bg-[#071334] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                    {settings.profile.avatarUrl ? (
                      <img
                        src={settings.profile.avatarUrl}
                        alt={settings.profile.name}
                        className="h-36 w-36 rounded-full object-cover sm:h-40 sm:w-40 lg:h-44 lg:w-44"
                      />
                    ) : (
                      <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb,#7c3aed)] text-5xl font-black text-white sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                        {avatarFallback}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={[
                    "absolute bottom-5 right-3 h-6 w-6 rounded-full border-4 border-[#0a1233] lg:bottom-6 lg:right-4",
                    isWidgetOnline
                      ? "bg-lime-400 shadow-[0_0_18px_rgba(132,204,22,0.75)]"
                      : "bg-slate-500 shadow-[0_0_16px_rgba(100,116,139,0.35)]",
                  ].join(" ")}
                />
              </div>

              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void refreshWidgetStatus()}
                    disabled={!donationTargetUserId || isCheckingWidgetStatus}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-[#09122f]",
                      isWidgetOnline
                        ? "border-lime-400/35 bg-lime-400/15 text-lime-200 shadow-[0_10px_24px_rgba(132,204,22,0.18)] hover:-translate-y-0.5 hover:bg-lime-400/22 hover:shadow-[0_14px_30px_rgba(132,204,22,0.22)] active:translate-y-0"
                        : "border-slate-300/25 bg-slate-300/12 text-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.24)] hover:-translate-y-0.5 hover:bg-slate-300/18 hover:shadow-[0_14px_30px_rgba(15,23,42,0.3)] active:translate-y-0",
                      !donationTargetUserId || isCheckingWidgetStatus
                        ? "cursor-not-allowed opacity-80 pointer-events-none"
                        : "",
                    ].join(" ")}
                  >
                    <RefreshCw
                      className={[
                        "h-3 w-3",
                        isCheckingWidgetStatus ? "animate-spin" : "",
                      ].join(" ")}
                    />
                    {isCheckingWidgetStatus
                      ? "checking..."
                      : isWidgetOnline
                        ? "widget online"
                        : "widget offline"}
                  </button>
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
                        className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#22336c] bg-[#0b1236]/85 text-white/80 transition hover:-translate-y-0.5 hover:border-[#2d8cff] hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <SectionShell className="relative border-[#30427d] bg-[radial-gradient(circle_at_54%_0%,rgba(43,91,255,0.22),transparent_30%),linear-gradient(180deg,rgba(11,22,62,0.98),rgba(6,12,39,0.98))] px-4 py-5 sm:px-7 lg:px-10 lg:py-9">
              <DecorationSprite
                src={sectionDecorations.panelLeft?.src}
                alt={sectionDecorations.panelLeft?.alt}
                className="left-0 top-0 w-20 sm:w-24"
                width={96}
                height={96}
              />
              <DecorationSprite
                src={sectionDecorations.panelRight?.src}
                alt={sectionDecorations.panelRight?.alt}
                className="right-0 top-0 w-20 sm:w-24"
                width={96}
                height={96}
              />
              <div className="mb-7 flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]">
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

              <div className="grid gap-8 xl:grid-cols-[1.3fr_1fr]">
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2e73ff] bg-[#10285f] text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(34,108,255,0.35)]">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-white">ใส่ข้อมูลผู้โดเนท</p>
                        <p className="text-xs text-white/40">ชื่อของคุณ (แสดงบนสตรีม)</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input
                        value={donorName}
                        onChange={(event) => {
                          setDonorName(event.target.value);
                          clearFieldError("donorName");
                        }}
                        className={[
                          "w-full rounded-[12px] border bg-[#050b26]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-white/24 focus:border-[#2d8cff]",
                          formErrors.donorName ? "border-rose-400/70" : "border-[#17275a]",
                        ].join(" ")}
                        placeholder="เช่น xB6, Somchai, Anonymous"
                      />
                      {formErrors.donorName ? (
                        <p className="-mt-2 text-xs text-rose-300">{formErrors.donorName}</p>
                      ) : null}
                      <div>
                        <textarea
                          rows={4}
                          value={donorMessage}
                          maxLength={255}
                          onChange={(event) => {
                            setDonorMessage(event.target.value);
                            clearFieldError("donorMessage");
                          }}
                          className={[
                            "w-full resize-none rounded-[12px] border bg-[#050b26]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-white/24 focus:border-[#2d8cff]",
                            formErrors.donorMessage ? "border-rose-400/70" : "border-[#17275a]",
                          ].join(" ")}
                          placeholder="ส่งข้อความให้กำลังใจสั้น ๆ ❤️"
                        />
                        <div className="mt-2 flex items-center justify-between gap-3">
                          {formErrors.donorMessage ? (
                            <p className="text-xs text-rose-300">{formErrors.donorMessage}</p>
                          ) : (
                            <span />
                          )}
                          <p className="text-right text-xs text-white/25">
                            {donorMessage.length}/255
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2e73ff] bg-[#10285f] text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(34,108,255,0.35)]">
                          2
                        </div>
                        <div>
                          <p className="font-semibold text-white">เลือกช่องทางการชำระเงิน</p>
                          <p className="text-xs text-white/40">สแกน QR หรือโอนผ่านบัญชี</p>
                        </div>
                      </div>
                      <div className="w-fit rounded-full border border-[#2d8cff]/30 bg-[#10285f]/55 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(45,140,255,0.14)]">
                        โอนเงินขั้นต่ำ ฿{settings.donation.minAmount}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <PaymentMethodCard
                        title="PromptPay"
                        subtitle="สแกน QR Code"
                        logoSrc="/imgs/prompt-pay-logo.png"
                        active={selectedPayment === "promptpay"}
                        onClick={() => setSelectedPayment("promptpay")}
                      />
                      <PaymentMethodCard
                        title="โอนธนาคาร"
                        subtitle={bankName || "ทุกธนาคาร"}
                        logoSrc="/imgs/bank-logo.png"
                        active={selectedPayment === "bank"}
                        onClick={() => setSelectedPayment("bank")}
                      />
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-[190px_1fr]">
                      {selectedPayment === "bank" ? (
                        <div className="sm:col-span-2">
                          <p className="mb-3 text-sm font-medium text-white/58">
                            ข้อมูลบัญชีสำหรับโอนเงิน
                          </p>
                          <div className="grid gap-3 rounded-[14px] border border-[#18285c] bg-[#07102f] p-4">
                            <div className="rounded-[12px] border border-[#17275a] bg-[#050b26]/90 px-4 py-3">
                              <p className="text-xs text-white/40">ธนาคาร</p>
                              <p className="mt-1 text-base font-bold text-white">
                                {bankName || "ยังไม่ได้ระบุชื่อธนาคาร"}
                              </p>
                            </div>
                            <div className="rounded-[12px] border border-[#17275a] bg-[#050b26]/90 px-4 py-3">
                              <p className="text-xs text-white/40">ชื่อบัญชี</p>
                              <p className="mt-1 text-base font-bold text-white">
                                {bankChannel.accountName || "ยังไม่ได้ระบุชื่อบัญชี"}
                              </p>
                            </div>
                            <div className="rounded-[12px] border border-[#17275a] bg-[#050b26]/90 px-4 py-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs text-white/40">เลขบัญชี</p>
                                  <p className="mt-1 break-all text-xl font-black tracking-wide text-cyan-100">
                                    {bankChannel.accountNumber || "ยังไม่ได้ระบุเลขบัญชี"}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleCopyAccountNumber}
                                  disabled={!bankChannel.accountNumber}
                                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#2d8cff]/35 bg-[#10285f]/70 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-[#2d8cff] hover:bg-[#14306d] disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                  {copiedAccount ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                  {copiedAccount ? "Copied" : "Copy"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="mb-3 text-sm font-medium text-white/58">
                              *สแกน QR Code เพื่อชำระเงิน
                            </p>
                            <div className="rounded-[14px] border border-[#18285c] bg-[#07102f] p-3">
                              <div className="flex h-[180px] items-center justify-center rounded-[10px] p-0">
                                <img
                                  src={promptPayQrUrl}
                                  alt="QR Code"
                                  className="h-full w-full rounded-[6px] object-contain"
                                />
                              </div>
                            </div>
                            <a
                              href={promptPayQrUrl}
                              download={`promptpay-${promptPayQrAmount}.png`}
                              className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full border border-[#2d8cff]/35 bg-[#10285f]/70 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-[#2d8cff] hover:bg-[#14306d]"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Save QR
                            </a>
                          </div>

                          <div>
                            <p className="mb-3 text-sm font-medium text-white/58">
                              หรือระบุจำนวนเงิน
                            </p>
                            <input
                              type="number"
                              min={1}
                              value={customAmount}
                              onChange={handleAmountInput}
                              className={[
                                "w-full rounded-[12px] border bg-[#050b26]/90 px-4 py-3 text-sm text-white outline-none placeholder:text-white/24 focus:border-[#2d8cff]",
                                formErrors.amount ? "border-rose-400/70" : "border-[#17275a]",
                              ].join(" ")}
                              placeholder={`ขั้นต่ำ ${settings.donation.minAmount} บาท`}
                            />
                            {formErrors.amount ? (
                              <p className="mt-2 text-xs text-rose-300">{formErrors.amount}</p>
                            ) : null}
                            <div className="mt-4">
                              <p className="mb-3 text-sm font-medium text-white/45">ยอดนิยม</p>
                              <div className="grid grid-cols-4 gap-2">
                                {(settings.donation.quickAmounts || [10, 20, 100, 500])
                                  .slice(0, 4)
                                  .map((amount) => (
                                    <button
                                      type="button"
                                      key={amount}
                                      onClick={() => handleQuickAmount(amount)}
                                      className={[
                                        "rounded-[10px] border py-3 text-sm font-semibold transition hover:border-[#2d8cff] hover:bg-[#14275e] hover:text-white",
                                        donationAmount === amount
                                          ? "border-[#2d8cff] bg-[#14275e] text-cyan-100 shadow-[0_0_18px_rgba(45,140,255,0.22)]"
                                          : "border-[#1b2a60] bg-[#101b44] text-white/75",
                                      ].join(" ")}
                                    >
                                      ฿{amount}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex min-h-full flex-col border-t border-[#1e2e68] pt-6 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
                  <div className="mb-6 rounded-[16px] border border-[#1d2d63] bg-[#07102f]/80 p-5">
                    <p className="text-base font-bold text-white">วิธีการโอนเงิน</p>
                    <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-white/68">
                      {selectedPayment === "bank" ? (
                        <>
                          <li>
                            เปิดแอปธนาคารที่สามารถแสดงสลิปการโอนเงินได้
                          </li>
                          <li>
                            โอนเงินตามจำนวนที่อยากโดเนทไปยังบัญชีที่แสดงบนหน้าเว็บ
                          </li>
                          <li>
                            แนบสลิปในเว็บ แล้วกดปุ่มยืนยันการโดเนท
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            เปิดแอปธนาคารที่มีฟีเจอร์สแกน QR Code และแสดงสลิปได้
                          </li>
                          <li>
                            ใส่จำนวนเงินที่อยากโดเนท แล้วสแกน QR Code พร้อมเพย์
                          </li>
                          <li>
                            แนบสลิปการโอนเงินในเว็บ แล้วกดปุ่มยืนยันการโดเนท
                          </li>
                        </>
                      )}
                    </ol>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2e73ff] bg-[#10285f] text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(34,108,255,0.35)]">
                        3
                      </div>
                      <p className="font-semibold text-white">อัปโหลดสลิป <span className="text-rose-300">*</span></p>
                    </div>

                    <label
                      className={[
                        "flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed bg-[#0a1439]/65 px-6 text-center transition hover:border-[#2d8cff] hover:bg-[#0d1842]/70",
                        formErrors.slipFile ? "border-rose-400/70" : "border-[#2a376d]",
                      ].join(" ")}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSlipChange}
                      />
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#53439a] bg-violet-400/10">
                        <Upload className="h-7 w-7 text-violet-200/80" />
                      </div>
                      <p className="text-base font-semibold text-white/85">
                        {slipFile ? slipFile.name : "คลิกหรือวางไฟล์มาวางที่นี่"}
                      </p>
                      <p className="mt-2 text-sm text-white/35">
                        รองรับไฟล์ JPG, PNG ไม่เกิน 5MB
                      </p>
                    </label>
                    {formErrors.slipFile ? (
                      <p className="mt-2 text-xs text-rose-300">{formErrors.slipFile}</p>
                    ) : null}
                    {submitError ? (
                      <p className="mt-3 rounded-[12px] border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                        {submitError}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={handleDonateSubmit}
                    disabled={isSubmitting}
                    className="mt-10 w-full rounded-[12px] border border-[#47a0ff]/70 bg-[linear-gradient(135deg,#743bff,#1ba4ff)] px-5 py-5 text-lg font-bold text-white shadow-[0_20px_45px_rgba(64,82,255,0.35),inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
                  >
                    {isSubmitting ? (
                      <>
                        กำลังส่ง...
                        <Loader2 className="ml-2 inline h-5 w-5 animate-spin" />
                      </>
                    ) : (
                      <>
                        {donateButtonText} <Heart className="ml-2 inline h-5 w-5 fill-white/70" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </SectionShell>

            <section className="relative mt-6 overflow-hidden rounded-[22px] border border-[#25356f]/80 bg-[linear-gradient(180deg,rgba(10,17,49,0.78),rgba(8,13,39,0.9))] p-3 shadow-[0_22px_80px_rgba(3,7,24,0.32)] sm:p-4">
              <DecorationSprite
                src={sectionDecorations.panelLeft?.src}
                alt={sectionDecorations.panelLeft?.alt}
                className="left-0 top-0 w-16 sm:w-20"
                width={80}
                height={80}
              />
              <DecorationSprite
                src={sectionDecorations.panelRight?.src}
                alt={sectionDecorations.panelRight?.alt}
                className="right-0 top-0 w-16 sm:w-20"
                width={80}
                height={80}
              />
              <div className="grid grid-cols-2 gap-2 rounded-[16px] bg-[#07102f]/75 p-2 lg:grid-cols-4">
                {tabItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabChange(item.id)}
                      className={[
                        "flex items-center justify-center gap-2 rounded-[12px] border px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "border-[#7f55ff] bg-[linear-gradient(135deg,rgba(150,55,255,0.34),rgba(27,88,255,0.46))] text-violet-100 shadow-[0_0_28px_rgba(111,72,255,0.34)]"
                          : "border-[#1d2d63]/70 bg-transparent text-white/55 hover:border-[#26376f] hover:bg-[#0d1740] hover:text-white/80",
                        isTabPending ? "will-change-transform" : "",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[18px] bg-[#09112f]/74 p-4 sm:p-5">
                {isTabPending ? <TabContentSkeleton variant={activeTab === "schedule" ? "list" : "grid"} /> : null}

                {!isTabPending && activeTab === "highlights" ? (
                  videos.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="overflow-hidden rounded-[16px] border border-[#1d2d63] bg-[#071028]"
                        >
                          <div className="relative aspect-video bg-[#050b1f]">
                            {video.thumbnail ? (
                              <MediaImage
                                src={video.thumbnail}
                                alt={video.title}
                                wrapperClassName="h-full w-full"
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

                {!isTabPending && activeTab === "content" ? (
                  posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="overflow-hidden rounded-[18px] border border-[#1d2d63] bg-[#071028]"
                        >
                          <div className="flex items-center gap-3 border-b border-[#1d2d63]/80 px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb,#7c3aed)] text-sm font-black text-white">
                              {avatarFallback}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {settings.profile.name}
                              </p>
                              <p className="text-xs text-white/35">คอนเทนต์ล่าสุด</p>
                            </div>
                          </div>
                          {post.text ? (
                            <p className="whitespace-pre-line px-4 py-4 text-base leading-7 text-white/85">
                              {post.text}
                            </p>
                          ) : null}
                          {post.image ? (
                            <div className="flex min-h-[240px] items-center justify-center bg-[#04091f]/70">
                              <MediaImage
                                src={post.image}
                                alt=""
                                wrapperClassName="w-full"
                                className="max-h-[520px] w-full object-contain"
                              />
                            </div>
                          ) : null}
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

                {!isTabPending && activeTab === "schedule" ? (
                  schedule.length > 0 ? (
                    <div className="overflow-hidden rounded-[18px] bg-[#071028]/82">
                      {schedule.map((item, index) => (
                        <div
                          key={item.id}
                          className={[
                            "grid gap-4 px-4 py-4 sm:grid-cols-[92px_1fr_auto] sm:items-center sm:px-5",
                            index > 0 ? "border-t border-white/8" : "",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-white/24">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-bold text-cyan-100">
                              {item.day}
                            </span>
                          </div>
                          <div className="min-w-0 border-l border-cyan-300/18 pl-4">
                            <p className="truncate text-base font-semibold text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-white/38">
                              Stream schedule
                            </p>
                          </div>
                          <div className="flex w-fit items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/74 sm:justify-self-end">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            {item.time}
                          </div>
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

                {!isTabPending && activeTab === "gallery" ? (
                  gallery.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {gallery.map((item) => (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-[16px] border border-[#1d2d63] bg-[#071028]"
                        >
                          <div className="flex aspect-square items-center justify-center bg-[#04091f]/70">
                            <MediaImage
                              src={item.url}
                              alt={`Gallery ${item.id}`}
                              wrapperClassName="h-full w-full"
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="ยังไม่มีรูปภาพ"
                      description="รูปจากเมนูแกลเลอรีจะแสดงที่นี่เมื่อเปิดใช้งานไว้"
                    />
                  )
                ) : null}

              </div>
            </section>
          </div>
        </div>
      </main>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[22px] border border-[#2d8cff]/35 bg-[radial-gradient(circle_at_50%_0%,rgba(45,140,255,0.2),transparent_32%),linear-gradient(180deg,rgba(10,18,50,0.98),rgba(5,10,31,0.98))] p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_34px_rgba(34,211,238,0.28)]">
              <Check className="h-9 w-9 text-cyan-200" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-white">ส่งสำเร็จแล้ว!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/62">
              {successMessage}
            </p>
            <div className="mt-5 rounded-[16px] border border-[#1d2d63] bg-[#07102f]/86 px-4 py-3 text-left">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-white/45">ชื่อผู้โดเนท</span>
                <span className="truncate font-bold text-white">{donorName}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-white/45">ยอดโดเนท</span>
                <span className="font-black text-cyan-100">฿{promptPayQrAmount}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseSuccessModal}
              className="mt-6 w-full rounded-[12px] border border-[#47a0ff]/70 bg-[linear-gradient(135deg,#743bff,#1ba4ff)] px-5 py-3.5 text-sm font-bold text-white shadow-[0_18px_42px_rgba(64,82,255,0.35),inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:brightness-110"
            >
              ปิด
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
