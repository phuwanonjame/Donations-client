"use client";

import React, { memo, useDeferredValue, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Palette,
  User,
  Heart,
  MessageSquare,
  Filter,
  Music,
  Video,
  ImageIcon,
  CalendarDays,
  ShoppingBag,
  Monitor,
  Check,
  Eye,
  Save,
  Upload,
  Plus,
  Trash2,
  Link as LinkIcon,
  GripVertical,
  Bell,
  HelpCircle,
  Sparkles,
  Shield,
  Gift,
  ExternalLink,
  Copy,
  X,
  Play,
  Clock,
  Users,
  Headphones,
  Camera,
  Settings2,
  ChevronDown,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import DonatePageRenderer from "@/components/donation/shared/DonatePageRenderer";
import { donationDecorationPresets } from "@/components/donation/shared/donatePageConfig";
import {
  loadDonatePageSettings,
  saveDonatePageSettings,
} from "@/components/donation/shared/donatePageStorage";

const defaultDecorationPreset =
  donationDecorationPresets.find((preset) => preset.id === "ice-default") ||
  donationDecorationPresets[0];

const themes = [
  {
    id: "v2-default",
    name: "V2 Default",
    preview: "from-slate-900 via-slate-800 to-slate-950",
    accent: "from-cyan-500 to-blue-500",
    primary: "#06B6D4",
    secondary: "#3B82F6",
    background: "#0B0F19",
  },
  {
    id: "aquamarine",
    name: "AquaMarine",
    preview: "from-teal-900 via-cyan-900 to-slate-950",
    accent: "from-teal-400 to-cyan-400",
    primary: "#2DD4BF",
    secondary: "#22D3EE",
    background: "#081F26",
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    preview: "from-purple-950 via-violet-950 to-slate-950",
    accent: "from-purple-500 to-pink-500",
    primary: "#8B5CF6",
    secondary: "#EC4899",
    background: "#120A25",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    preview: "from-orange-950 via-red-950 to-slate-950",
    accent: "from-orange-500 to-red-500",
    primary: "#F97316",
    secondary: "#EF4444",
    background: "#24100A",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    preview: "from-emerald-950 via-green-950 to-slate-950",
    accent: "from-emerald-500 to-teal-500",
    primary: "#10B981",
    secondary: "#14B8A6",
    background: "#071A12",
  },
  {
    id: "neon-pink",
    name: "Neon Pink",
    preview: "from-pink-950 via-rose-950 to-slate-950",
    accent: "from-pink-500 to-rose-500",
    primary: "#EC4899",
    secondary: "#F43F5E",
    background: "#240915",
  },
];

const MAX_PROFILE_CATEGORIES = 5;

const profileCategoryOptions = [
  {
    id: "valorant",
    name: "VALORANT",
    image:
      "https://cdn.aona.co.th/u/nicenathapong/files/5be1c4094156fbe74d7049d417818b6c245291b569cd0dc5cfe80dd9e24d1336.png",
  },
  {
    id: "rov",
    name: "RoV",
    image:
      "https://play-lh.googleusercontent.com/2RrzGOcirTAU4vPzLiZ3Us4k-E-RtPVBbWB-RkU5FAT9gVrTlUJL0nYVN6VlpSbGq_uHHaLsvwvtxm1Mjirxpg",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    image: "https://i.imgur.com/nKsYRdJ.png",
  },
  { id: "music", name: "Music & Singing" },
  { id: "vtuber", name: "VTuber" },
  { id: "irl", name: "IRL" },
];

const fixedSocials = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/test",
    enabled: true,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com/test",
    enabled: true,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/test",
    enabled: true,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/test",
    enabled: true,
  },
  {
    id: "instagram",
    label: "IG",
    href: "https://instagram.com/test",
    enabled: true,
  },
  {
    id: "website",
    label: "Website",
    href: "https://example.com",
    enabled: true,
  },
];

const STREAM_SCHEDULE_DAYS = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
];

const TIME_SELECT_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";

  return `${hours}:${minutes}`;
});

const DEFAULT_PROFANITY_WORDS = [
  "เงี่ยน",
  "เย็ด",
  "ควย",
  "เหี้ย",
  "หี",
  "ชิบหาย",
  "กะหรี่",
  "หำ",
  "เชี่ย",
  "เหยด",
  "เวร",
  "ตาย",
  "เจี๊ยว",
  "แม่ง",
  "ควาย",
  "สัส",
  "ดอกทอง",
  "ส้นตีน",
  "มึง",
  "กู",
  "กุ",
  "ไอ",
  "แตด",
  "กวนตีน",
];

const navItems = [
  {
    id: "theme",
    title: "ธีม & ดีไซน์",
    desc: "ปรับแต่งธีม สี และสไตล์",
    icon: Palette,
  },
  {
    id: "profile",
    title: "โปรไฟล์",
    desc: "ข้อมูลสตรีมเมอร์และช่องทาง",
    icon: User,
  },
  {
    id: "donation",
    title: "ช่องทางรับเงิน",
    desc: "ตั้งค่าช่องทางรับเงินและฟอร์มโดเนท",
    icon: Heart,
  },
  {
    id: "filter",
    title: "ข้อความ / ฟิลเตอร์",
    desc: "จัดการข้อความและตัวกรอง",
    icon: MessageSquare,
  },
  {
    id: "music",
    title: "เพลง",
    desc: "เพลงประกอบและ Playlist",
    icon: Music,
  },
  {
    id: "content",
    title: "วิดีโอ / คอนเทนต์",
    desc: "ไฮไลท์วิดีโอและโพสต์รายวัน",
    icon: Video,
  },
  {
    id: "gallery",
    title: "แกลเลอรี",
    desc: "รูปภาพและแกลเลอรี",
    icon: ImageIcon,
  },
  {
    id: "schedule",
    title: "ตารางสตรีม",
    desc: "กำหนดวันและเวลาไลฟ์",
    icon: CalendarDays,
  },
  {
    id: "products",
    title: "สินค้า / โปรโมชัน",
    desc: "สินค้าและโปรโมชัน",
    icon: ShoppingBag,
  },
  {
    id: "display",
    title: "การแสดงผล",
    desc: "จัดการการแสดงผลส่วนต่างๆ",
    icon: Monitor,
  },
];

const defaultSettings = {
  theme: "v2-default",

  design: {
    glassEffect: true,
    snowEffect: true,
    glowEffect: true,
    compactMode: false,
    cardOpacity: 70,
    backgroundBlur: 35,
    borderRadius: 22,
    decorationPreset: defaultDecorationPreset.id,
    donationFormDecorations: defaultDecorationPreset.decorations,
    donationFormTheme: defaultDecorationPreset.formTheme,
    sectionTheme: defaultDecorationPreset.sectionTheme,
    sectionDecorations: defaultDecorationPreset.sectionDecorations,
  },

  profile: {
    name: "x86",
    handle: "ezdn.app/x86",
    username: "x86",
    bio: "สตรีมเมอร์สาย Competitive 🎮 | เล่น Valorant & LoL | สตรีมทุกวัน 20:00+",
    avatarUrl: "",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    backgroundUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    isOnline: true,
    verified: true,
  },

  socials: [
    ...fixedSocials,
  ],

  donation: {
    pageTitle: "สนับสนุนสตรีมเมอร์",
    minAmount: 20,
    quickAmounts: [10, 20, 50, 100, 200, 500],
    qrCodeUrl: "",
    showQrCode: true,
    allowCustomAmount: true,
    allowAnonymous: true,
    showDonorName: true,
    showMessage: true,
    welcomeMessage: "ขอบคุณที่สนับสนุนกันนะครับ ทุกโดเนทช่วยให้ทำคอนเทนต์ได้ดีขึ้น 💜",
    buttonText: "โดเนทเลย",
    channels: {
      promptpay: {
        enabled: true,
        expanded: false,
        type: "phone",
        value: "0825568960",
      },
      bank: {
        enabled: false,
        expanded: false,
        bankName: "SCB",
        accountName: "Creator Studio",
        accountNumber: "123-4-56789-0",
      },
    },
  },

  filters: [
    {
      id: "profanity",
      name: "Block Profanity",
      description: "บล็อกคำหยาบและภาษาที่ไม่เหมาะสม",
      enabled: true,
    },
  ],
  profanityWords: DEFAULT_PROFANITY_WORDS,
  customProfanityWords: [],

  profileCategories: ["valorant", "rov", "music"],

  music: {
    enabled: true,
    allowYoutubeRequest: true,
    allowUpload: true,
    showNowPlaying: true,
    showPlaylist: true,
    autoplay: false,
    volume: 65,
    currentSong: {
      title: "Chill Vibes Lo-fi",
      artist: "StudyBeats",
      duration: "3:24",
    },
    playlist: [
      { id: 1, title: "Chill Vibes Lo-fi", duration: "3:24" },
      { id: 2, title: "Neon Dreams", duration: "4:21" },
      { id: 3, title: "Midnight Rain", duration: "2:58" },
    ],
  },

  videos: [
    {
      id: 1,
      title: "Clutch 1v3 Valorant!",
      views: "12.5K",
      duration: "0:45",
      thumbnail:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      enabled: true,
    },
    {
      id: 2,
      title: "จังหวะพลิกเกมสุดเดือด",
      views: "8.2K",
      duration: "1:20",
      thumbnail:
        "https://images.unsplash.com/photo-1598550476439-6847785fcea6",
      enabled: true,
    },
    {
      id: 3,
      title: "Ace แบบไม่ให้ตั้งตัว",
      views: "15.1K",
      duration: "0:58",
      thumbnail:
        "https://images.unsplash.com/photo-1603481546238-487240415921",
      enabled: true,
    },
  ],

  posts: [
    {
      id: 1,
      text: "วันนี้เล่นจัดหนัก Valorant ตั้งแต่ 2 ทุ่ม วันนี้มีท้าทายสุดเดือดครับ 🔥",
      image:
        "https://images.unsplash.com/photo-1542751110-97427bbecf20",
      enabled: true,
    },
    {
      id: 2,
      text: "เล่น LoL กับเพื่อนๆ สนุกจัด ๆ ไปเลย 🤣",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      enabled: true,
    },
  ],

  gallery: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
      enabled: true,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6",
      enabled: true,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1603481546238-487240415921",
      enabled: true,
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
      enabled: true,
    },
  ],

  schedule: [
    {
      id: 1,
      day: "จันทร์",
      time: "20:00 - 23:00",
      title: "Valorant",
      enabled: true,
    },
    {
      id: 2,
      day: "อังคาร",
      time: "20:00 - 23:00",
      title: "Just Chatting",
      enabled: true,
    },
    {
      id: 3,
      day: "พุธ",
      time: "20:00 - 00:00",
      title: "GTA V RP",
      enabled: true,
    },
    {
      id: 4,
      day: "พฤหัสบดี",
      time: "",
      title: "",
      enabled: true,
    },
    {
      id: 5,
      day: "ศุกร์",
      time: "19:00 - 01:00",
      title: "Game Night",
      enabled: true,
    },
    {
      id: 6,
      day: "เสาร์",
      time: "15:00 - 20:00",
      title: "Special Event",
      enabled: true,
    },
    {
      id: 7,
      day: "อาทิตย์",
      time: "",
      title: "",
      enabled: true,
    },
  ],

  products: [
    {
      id: 1,
      name: "HUB Hoodie",
      price: 590,
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234",
      enabled: true,
    },
    {
      id: 2,
      name: "แก้วน้ำ Gamer",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      enabled: true,
    },
    {
      id: 3,
      name: "Mousepad RGB",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae",
      enabled: true,
    },
  ],

  recentDonations: {
    enabled: true,
    maxItems: 5,
    showAmount: true,
    showTime: true,
    items: [
      { id: 1, name: "NuttyNat", amount: 500, message: "สู้ๆครับพี่ ✨", time: "2 นาทีที่แล้ว" },
      { id: 2, name: "Pakporn Gamer", amount: 200, message: "เกมมากครับ 🔥", time: "5 นาทีที่แล้ว" },
      { id: 3, name: "Anonymous", amount: 100, message: "โดเนทครับ 💜", time: "10 นาทีที่แล้ว" },
      { id: 4, name: "BossZa", amount: 50, message: "ร้าววววว!", time: "12 นาทีที่แล้ว" },
      { id: 5, name: "RealAum", amount: 20, message: "สนุกมากครับ", time: "18 นาทีที่แล้ว" },
    ],
  },

  display: {
    showProfileHeader: true,
    showDonationForm: true,
    showMusicPanel: true,
    showVideoHighlights: true,
    showDailyContent: true,
    showGallery: true,
    showSchedule: true,
    showProducts: true,
    showRecentDonations: true,
    stickyDonationForm: true,
    showFooter: true,
  },
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SectionCard({ id, title, description, icon: Icon, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "480px",
      }}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-44 rounded-bl-full bg-cyan-300/10 blur-2xl" />

      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{description}</p>
        </div>
      </div>

      {children}
    </motion.section>
  );
}

function Field({ label, children, className }) {
  return (
    <div className={cx("space-y-2", className)}>
      <Label className="text-sm font-medium text-slate-300">{label}</Label>
      {children}
    </div>
  );
}

function GlassInput(props) {
  return (
    <Input
      {...props}
      className={cx(
        "border-slate-700/80 bg-slate-950/50 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/70",
        props.className
      )}
    />
  );
}

function GlassTextarea(props) {
  return (
    <Textarea
      {...props}
      className={cx(
        "min-h-[96px] border-slate-700/80 bg-slate-950/50 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/70",
        props.className
      )}
    />
  );
}

function MiniSwitch({ checked, onCheckedChange }) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-cyan-500"
    />
  );
}

function ToggleRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-cyan-300">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium text-white">{title}</p>
          {description ? (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>
      <MiniSwitch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function DonationChannelCard({
  title,
  subtitle,
  badge,
  enabled,
  expanded,
  onToggleEnabled,
  onToggleExpanded,
  children,
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-2xl border bg-slate-950/40 backdrop-blur-sm transition-all duration-300",
        expanded ? "border-slate-600/80" : "border-slate-800"
      )}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
            <span className="text-sm font-bold">{badge}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight text-white sm:text-base">
              {title}
            </p>
            <p className="truncate text-xs text-slate-500 sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            type="button"
            onClick={onToggleEnabled}
            className={cx(
              "relative h-6 w-11 rounded-full border transition-all duration-300",
              enabled
                ? "border-emerald-700 bg-emerald-600"
                : "border-slate-700 bg-slate-800"
            )}
          >
            <span
              className={cx(
                "absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-300",
                enabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-[10px] text-slate-500">
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-800 py-2 text-xs text-slate-400 transition-all duration-200 hover:bg-slate-900/70 hover:text-slate-200 sm:text-sm"
        >
          <ChevronDown
            size={14}
            className={cx("transition-transform duration-300", expanded && "rotate-180")}
          />
          {expanded ? "Hide settings" : "Configure"}
        </button>
      </div>

      <div
        className={cx(
          "overflow-hidden transition-all duration-300 ease-in-out",
          expanded ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-4 border-t border-slate-800 px-5 pb-5 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function normalizeSocials(socials) {
  const mapped = new Map((socials || []).map((item) => [item.id, item]));

  return fixedSocials.map((item) => ({
    ...item,
    href: mapped.get(item.id)?.href || item.href,
    enabled: true,
  }));
}

function normalizeSchedule(schedule) {
  const mapped = new Map((schedule || []).map((item) => [item.day, item]));

  return STREAM_SCHEDULE_DAYS.map((day, index) => {
    const existingItem = mapped.get(day);

    return {
      id: index + 1,
      day,
      time: existingItem?.time || "",
      title: existingItem?.title || "",
      enabled: true,
    };
  });
}

function normalizeFilters(filters, fallbackCustomWords = []) {
  const profanityFilter = (filters || []).find((item) => item.id === "profanity");

  return [
    {
      id: "profanity",
      name: "Block Profanity",
      description: "บล็อกคำหยาบและภาษาที่ไม่เหมาะสม",
      enabled: profanityFilter?.enabled ?? true,
    },
  ];
}

function normalizeProfanityWords(words) {
  const mergedWords = (Array.isArray(words) && words.length ? words : DEFAULT_PROFANITY_WORDS)
    .map((word) => String(word || "").trim())
    .filter(Boolean);

  return Array.from(new Set(mergedWords));
}

function normalizeCustomProfanityWords(words) {
  return Array.from(
    new Set(
      (Array.isArray(words) ? words : [])
        .map((word) => String(word || "").trim())
        .filter(Boolean)
    )
  );
}

function parseScheduleTimeRange(timeRange = "") {
  const [startTime = "", endTime = ""] = timeRange.split(" - ").map((value) => value.trim());

  return {
    startTime: TIME_SELECT_OPTIONS.includes(startTime) ? startTime : "",
    endTime: TIME_SELECT_OPTIONS.includes(endTime) ? endTime : "",
  };
}

function buildScheduleTimeRange(startTime, endTime) {
  if (!startTime && !endTime) {
    return "";
  }

  if (!startTime) {
    return endTime;
  }

  if (!endTime) {
    return startTime;
  }

  return `${startTime} - ${endTime}`;
}

function buildInitialSettings() {
  const loadedSettings = loadDonatePageSettings(defaultSettings);

  return {
    ...loadedSettings,
    socials: normalizeSocials(loadedSettings.socials),
    filters: normalizeFilters(loadedSettings.filters),
    profanityWords: normalizeProfanityWords(loadedSettings.profanityWords),
    customProfanityWords: normalizeCustomProfanityWords(
      loadedSettings.customProfanityWords
    ),
    schedule: normalizeSchedule(loadedSettings.schedule),
  };
}

export default function DonatePageSettings() {
  const [activeTab, setActiveTab] = useState("theme");
  const [settings, setSettings] = useState(buildInitialSettings);
  const [saveMessage, setSaveMessage] = useState("");
  const [customProfanityInput, setCustomProfanityInput] = useState("");
  const deferredSettings = useDeferredValue(settings);
  const avatarFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const backgroundFileInputRef = useRef(null);

  const selectedTheme = useMemo(() => {
    return themes.find((theme) => theme.id === settings.theme) || themes[0];
  }, [settings.theme]);
  const activeNavItem = useMemo(() => {
    return navItems.find((item) => item.id === activeTab) || navItems[0];
  }, [activeTab]);
  const selectedDecorationPreset = useMemo(() => {
    return (
      donationDecorationPresets.find(
        (preset) => preset.id === settings.design.decorationPreset
      ) || donationDecorationPresets[0]
    );
  }, [settings.design.decorationPreset]);
  const selectedProfileCategories = useMemo(() => {
    return profileCategoryOptions.filter((item) =>
      (settings.profileCategories || []).includes(item.id)
    );
  }, [settings.profileCategories]);
  const donationChannels =
    settings.donation?.channels || defaultSettings.donation.channels;
  const profanityFilter =
    settings.filters.find((item) => item.id === "profanity") ||
    defaultSettings.filters[0];

  const cloneDecorations = (decorations) =>
    Object.fromEntries(
      Object.entries(decorations).map(([key, value]) => [key, { ...value }])
    );
  const cloneFormTheme = (formTheme) => ({ ...formTheme });
  const cloneSectionTheme = (sectionTheme) => ({ ...sectionTheme });
  const cloneSectionDecorations = (decorations) =>
    Object.fromEntries(
      Object.entries(decorations || {}).map(([key, value]) => [key, { ...value }])
    );
  const ActiveTabIcon = activeTab === "music" ? Users : activeNavItem.icon;

  const applyDecorationPreset = (preset) => {
    setSettings((prev) => ({
      ...prev,
      theme: preset.themeId || prev.theme,
      design: {
        ...prev.design,
        ...preset.settingsPatch,
        decorationPreset: preset.id,
        donationFormDecorations: cloneDecorations(preset.decorations),
        donationFormTheme: cloneFormTheme(preset.formTheme),
        sectionTheme: cloneSectionTheme(preset.sectionTheme),
        sectionDecorations: cloneSectionDecorations(preset.sectionDecorations),
      },
    }));
  };

  const updateDesign = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        [key]: value,
      },
    }));
  };

  const updateProfile = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  };

  const handleProfileImageUpload = (key, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateProfile(key, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateDonation = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        [key]: value,
      },
    }));
  };

  const updateMusic = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      music: {
        ...prev.music,
        [key]: value,
      },
    }));
  };

  const updateDisplay = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value,
      },
    }));
  };

  const updateDonationChannel = (channel, key, value) => {
    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        channels: {
          ...(prev.donation.channels || defaultSettings.donation.channels),
          [channel]: {
            ...(prev.donation.channels?.[channel] ||
              defaultSettings.donation.channels[channel]),
            [key]: value,
          },
        },
      },
    }));
  };

  const toggleProfileCategory = (categoryId) => {
    setSettings((prev) => {
      const selected = prev.profileCategories || [];
      const exists = selected.includes(categoryId);

      if (exists) {
        return {
          ...prev,
          profileCategories: selected.filter((id) => id !== categoryId),
        };
      }

      if (selected.length >= MAX_PROFILE_CATEGORIES) {
        return prev;
      }

      return {
        ...prev,
        profileCategories: [...selected, categoryId],
      };
    });
  };

  const removeProfileCategory = (categoryId) => {
    setSettings((prev) => ({
      ...prev,
      profileCategories: (prev.profileCategories || []).filter(
        (id) => id !== categoryId
      ),
    }));
  };

  const handleRestoreSaved = () => {
    setSettings(buildInitialSettings());
    setSaveMessage("โหลดค่าที่บันทึกล่าสุดกลับมาแล้ว");
  };

  const handleSaveSettings = (mode = "publish") => {
    const saved = saveDonatePageSettings(settings);

    setSaveMessage(
      saved
        ? mode === "draft"
          ? "บันทึกร่างแล้ว และหน้าโปรไฟล์จริงจะใช้ค่านี้ชั่วคราว"
          : "บันทึกและอัปเดตหน้าโปรไฟล์จริงแล้ว"
        : "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง"
    );
  };

  const updateSocial = (id, key, value) => {
    setSettings((prev) => ({
      ...prev,
      socials: prev.socials.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const toggleFilter = (id) => {
    setSettings((prev) => ({
      ...prev,
      filters: prev.filters.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  };

  const addCustomProfanityWord = () => {
    const nextWord = customProfanityInput.trim();

    if (!nextWord) {
      return;
    }

    setSettings((prev) => {
      const existingWords = [
        ...(prev.profanityWords || []),
        ...(prev.customProfanityWords || []),
      ].map((word) => word.toLowerCase());

      if (existingWords.includes(nextWord.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        customProfanityWords: [...(prev.customProfanityWords || []), nextWord],
      };
    });

    setCustomProfanityInput("");
  };

  const removeCustomProfanityWord = (wordToRemove) => {
    setSettings((prev) => ({
      ...prev,
      customProfanityWords: (prev.customProfanityWords || []).filter(
        (word) => word !== wordToRemove
      ),
    }));
  };

  const updateArrayItem = (arrayKey, id, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addQuickAmount = () => {
    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        quickAmounts: [...prev.donation.quickAmounts, 100],
      },
    }));
  };

  const updateQuickAmount = (index, value) => {
    const nextValue = Number(value || 0);

    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        quickAmounts: prev.donation.quickAmounts.map((amount, idx) =>
          idx === index ? nextValue : amount
        ),
      },
    }));
  };

  const removeQuickAmount = (index) => {
    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        quickAmounts: prev.donation.quickAmounts.filter((_, idx) => idx !== index),
      },
    }));
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="relative isolate overflow-hidden rounded-[28px] border border-slate-800/80 bg-[#07111f] text-slate-100 shadow-2xl shadow-black/20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${settings.profile.backgroundUrl || settings.profile.bannerUrl})`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.88),rgba(2,6,23,0.98))]" />

      {settings.design.snowEffect && (
        <div className="pointer-events-none absolute inset-0 z-10 opacity-70">
          <div className="absolute left-[8%] top-[12%] h-1 w-1 rounded-full bg-cyan-200" />
          <div className="absolute left-[24%] top-[34%] h-1.5 w-1.5 rounded-full bg-cyan-100" />
          <div className="absolute left-[48%] top-[8%] h-1 w-1 rounded-full bg-blue-100" />
          <div className="absolute left-[68%] top-[44%] h-1.5 w-1.5 rounded-full bg-cyan-100" />
          <div className="absolute left-[82%] top-[24%] h-1 w-1 rounded-full bg-cyan-200" />
          <div className="absolute left-[92%] top-[62%] h-1.5 w-1.5 rounded-full bg-blue-200" />
          <div className="absolute left-[38%] top-[72%] h-1 w-1 rounded-full bg-cyan-100" />
          <div className="absolute left-[16%] top-[84%] h-1.5 w-1.5 rounded-full bg-blue-100" />
        </div>
      )}

      <div className="relative z-20">
        <aside className="border-b border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur-xl lg:p-6">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">DonateHUB</h1>
              <p className="text-xs text-slate-400">Page Settings</p>
            </div>
          </div>

          <nav className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {navItems.map((item, index) => {
              const Icon = item.id === "music" ? Users : item.icon;
              const isActive = activeTab === item.id;
              const itemTitle =
                item.id === "music" ? "Profile Categories" : item.title;
              const itemDesc =
                item.id === "music"
                  ? "Select categories for this profile"
                  : item.desc;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cx(
                    "group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    isActive
                      ? "border-purple-500/70 bg-purple-500/15 shadow-lg shadow-purple-500/10"
                      : "border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-900/70"
                  )}
                >
                  <div
                    className={cx(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-slate-900 text-slate-400 group-hover:text-cyan-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cx(
                        "text-sm font-semibold",
                        isActive ? "text-white" : "text-slate-300"
                      )}
                    >
                      {index + 1}. {itemTitle}
                    </p>
                    <p className="truncate text-xs text-slate-500">{itemDesc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 xl:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">ต้องการความช่วยเหลือ?</p>
                <p className="text-xs text-slate-500">ดูวิธีใช้งานและคำแนะนำ</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              คู่มือการใช้งาน
            </Button>
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full border-slate-700 bg-slate-950/40 text-slate-300 hover:bg-slate-800 hover:text-white sm:w-auto xl:hidden"
          >
            รีเซ็ตค่าทั้งหมด
          </Button>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/95 px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-cyan-300">
                  <ActiveTabIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">ตั้งค่า / ปรับแต่งหน้าโดเนท</p>
                  <h1 className="text-xl font-bold text-white lg:text-2xl">
                    ตั้งค่าหน้ารับโดเนท
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white md:inline-flex"
                  onClick={() => handleSaveSettings("draft")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  ดูตัวอย่างเต็มจอ
                </Button>

                <Button
                  variant="outline"
                  className="hidden border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white md:inline-flex"
                >
                  <Save className="mr-2 h-4 w-4" />
                  บันทึกร่าง
                </Button>

                <Button
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/20 hover:from-cyan-400 hover:to-purple-400"
                  onClick={() => handleSaveSettings("publish")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  บันทึก & เผยแพร่
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-5 p-4 lg:p-6 xl:grid-cols-[minmax(0,7fr)_minmax(380px,3fr)] 2xl:grid-cols-[minmax(0,6.5fr)_minmax(440px,3.5fr)]">
            <div className="space-y-5">
              {activeTab === "theme" && (
              <SectionCard
                id="theme"
                title="ธีม & ดีไซน์"
                description="เลือกธีม สี เอฟเฟกต์ และบรรยากาศของหน้ารับโดเนท"
                icon={Palette}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {themes.map((theme, index) => (
                    <motion.button
                      key={theme.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme: theme.id }))
                      }
                      className={cx(
                        "group relative overflow-hidden rounded-xl border p-4 text-left transition-all",
                        settings.theme === theme.id
                          ? "border-cyan-400 shadow-lg shadow-cyan-500/20"
                          : "border-slate-700/70 hover:border-slate-500"
                      )}
                    >
                      <div
                        className={cx(
                          "absolute inset-0 bg-gradient-to-br opacity-80",
                          theme.preview
                        )}
                      />
                      <div className="relative">
                        <div className="mb-6 flex items-start justify-between">
                          <div
                            className={cx(
                              "h-11 w-11 rounded-xl bg-gradient-to-br shadow-lg",
                              theme.accent
                            )}
                          />
                          {settings.theme === theme.id && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="h-2 rounded-full bg-white/20" />
                          <div className="h-2 w-2/3 rounded-full bg-white/10" />
                          <div className="h-8 rounded-lg bg-black/25" />
                        </div>

                        <p className="mt-4 font-semibold text-white">{theme.name}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Seasonal Decoration Presets
                      </p>
                      <p className="text-xs text-slate-500">
                        เลือกชุดของตกแต่งสำเร็จรูปสำหรับฟอร์มโดเนท แล้ว preview จะอัปเดตทันที
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                      {selectedDecorationPreset.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {donationDecorationPresets.map((preset) => {
                      const isActive =
                        settings.design.decorationPreset === preset.id;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyDecorationPreset(preset)}
                          className={cx(
                            "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
                            isActive
                              ? "border-amber-400 shadow-lg shadow-amber-500/20"
                              : "border-slate-700/70 hover:border-slate-500"
                          )}
                        >
                          <div
                            className={cx(
                              "absolute inset-0 bg-gradient-to-br opacity-80",
                              preset.preview
                            )}
                          />
                          <div className="relative space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="inline-flex rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                                  {preset.badge}
                                </span>
                                <p className="mt-3 text-base font-semibold text-white">
                                  {preset.name}
                                </p>
                                <p className="mt-1 text-xs text-white/70">
                                  {preset.description}
                                </p>
                              </div>
                              {isActive && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-slate-950">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-14 rounded-xl border border-white/10 bg-black/20" />
                              <div className="h-14 rounded-xl border border-white/10 bg-black/15" />
                              <div className="h-14 rounded-xl border border-white/10 bg-black/10" />
                            </div>

                            <p className="text-[11px] text-white/65">
                              Applies color theme: {preset.themeId}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Field label="สีหลัก Primary">
                    <GlassInput value={selectedTheme.primary} readOnly />
                  </Field>
                  <Field label="สีรอง Secondary">
                    <GlassInput value={selectedTheme.secondary} readOnly />
                  </Field>
                  <Field label="พื้นหลัง Background">
                    <GlassInput value={selectedTheme.background} readOnly />
                  </Field>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <ToggleRow
                    icon={Sparkles}
                    title="เอฟเฟกต์หิมะ"
                    description="แสดงหิมะตกบนหน้าโดเนท"
                    checked={settings.design.snowEffect}
                    onChange={(value) => updateDesign("snowEffect", value)}
                  />
                  <ToggleRow
                    icon={Shield}
                    title="Glass Effect"
                    description="เปิดพื้นหลังโปร่งใสแบบกระจก"
                    checked={settings.design.glassEffect}
                    onChange={(value) => updateDesign("glassEffect", value)}
                  />
                  <ToggleRow
                    icon={Sparkles}
                    title="Glow Effect"
                    description="เพิ่มแสงเรืองให้ปุ่มและการ์ด"
                    checked={settings.design.glowEffect}
                    onChange={(value) => updateDesign("glowEffect", value)}
                  />
                  <ToggleRow
                    icon={Monitor}
                    title="Compact Mode"
                    description="ลดช่องไฟให้หน้าแน่นขึ้น"
                    checked={settings.design.compactMode}
                    onChange={(value) => updateDesign("compactMode", value)}
                  />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <Field label={`ความเข้มของการ์ด ${settings.design.cardOpacity}%`}>
                    <Slider
                      value={[settings.design.cardOpacity]}
                      min={30}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateDesign("cardOpacity", value[0])}
                    />
                  </Field>
                  <Field label={`ความเบลอพื้นหลัง ${settings.design.backgroundBlur}%`}>
                    <Slider
                      value={[settings.design.backgroundBlur]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        updateDesign("backgroundBlur", value[0])
                      }
                    />
                  </Field>
                  <Field label={`ความโค้งมุม ${settings.design.borderRadius}px`}>
                    <Slider
                      value={[settings.design.borderRadius]}
                      min={8}
                      max={32}
                      step={1}
                      onValueChange={(value) =>
                        updateDesign("borderRadius", value[0])
                      }
                    />
                  </Field>
                </div>
              </SectionCard>
              )}

              {activeTab === "profile" && (
              <SectionCard
                id="profile"
                title="โปรไฟล์"
                description="จัดการข้อมูลโปรไฟล์ รูปปก รูปโปรไฟล์ และช่องทางติดต่อ"
                icon={User}
              >
                <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                      <p className="mb-3 text-sm font-medium text-slate-300">
                        รูปโปรไฟล์
                      </p>
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-2xl shadow-lg shadow-purple-500/20">
                        {settings.profile.avatarUrl ? (
                          <img
                            src={settings.profile.avatarUrl}
                            alt={settings.profile.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-3xl font-bold text-white">
                            {settings.profile.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4 w-full border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => avatarFileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        เปลี่ยนรูป
                      </Button>
                      <input
                        ref={avatarFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleProfileImageUpload("avatarUrl", e.target.files?.[0])
                        }
                      />
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                      <p className="mb-3 text-sm font-medium text-slate-300">
                        รูปปก Banner
                      </p>
                      <div
                        className="h-24 rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${settings.profile.bannerUrl})` }}
                      />
                      <Button
                        variant="outline"
                        className="mt-4 w-full border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => bannerFileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        เปลี่ยนรูปปก
                      </Button>
                      <input
                        ref={bannerFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleProfileImageUpload("bannerUrl", e.target.files?.[0])
                        }
                      />
                      <div className="mt-4">
                        <GlassInput
                          value={settings.profile.bannerUrl}
                          placeholder="Paste cover image URL"
                          onChange={(e) => updateProfile("bannerUrl", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                      <p className="mb-3 text-sm font-medium text-slate-300">
                        รูปพื้นหลัง
                      </p>
                      <div
                        className="h-24 rounded-xl bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${settings.profile.backgroundUrl || settings.profile.bannerUrl})`,
                        }}
                      />
                      <Button
                        variant="outline"
                        className="mt-4 w-full border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => backgroundFileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        อัปรูปพื้นหลัง
                      </Button>
                      <input
                        ref={backgroundFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleProfileImageUpload("backgroundUrl", e.target.files?.[0])
                        }
                      />
                      <div className="mt-4">
                        <GlassInput
                          value={settings.profile.backgroundUrl || ""}
                          placeholder="Paste background image URL"
                          onChange={(e) =>
                            updateProfile("backgroundUrl", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="ชื่อสตรีมเมอร์">
                        <GlassInput
                          value={settings.profile.name}
                          onChange={(e) => updateProfile("name", e.target.value)}
                        />
                      </Field>
                      <Field label="ลิงก์ / Username">
                        <GlassInput
                          value={settings.profile.handle}
                          onChange={(e) => updateProfile("handle", e.target.value)}
                        />
                      </Field>
                    </div>

                    <Field label="คำอธิบาย Bio">
                      <GlassTextarea
                        value={settings.profile.bio}
                        maxLength={160}
                        onChange={(e) => updateProfile("bio", e.target.value)}
                      />
                      <p className="text-right text-xs text-slate-500">
                        {settings.profile.bio.length}/160
                      </p>
                    </Field>

                    {false && (
                      <div className="grid gap-3 md:grid-cols-2">
                      <ToggleRow
                        icon={Bell}
                        title="สถานะออนไลน์"
                        description="แสดงว่ากำลังออนไลน์"
                        checked={settings.profile.isOnline}
                        onChange={(value) => updateProfile("isOnline", value)}
                      />
                      <ToggleRow
                        icon={Check}
                        title="Verified Badge"
                        description="แสดงเครื่องหมายยืนยัน"
                        checked={settings.profile.verified}
                        onChange={(value) => updateProfile("verified", value)}
                      />
                      </div>
                    )}

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">ช่องทางโซเชียล</p>
                          <p className="text-xs text-slate-500">
                            เปิด/ปิด และแก้ไขลิงก์โซเชียลที่แสดงบนหน้าโดเนท
                          </p>
                        </div>
                        {false && <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-700 bg-slate-900/60 text-slate-300"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          เพิ่มช่องทาง
                        </Button>}
                      </div>

                      <div className="space-y-3">
                        {settings.socials.map((social) => (
                          <div
                            key={social.id}
                            className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 md:grid-cols-[160px_1fr]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white">{social.label}</span>
                            </div>
                            <GlassInput
                              value={social.href}
                              onChange={(e) =>
                                updateSocial(social.id, "href", e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
              )}

              {activeTab === "donation" && (
              <>
              <SectionCard
                id="donation-channels-top"
                title="ช่องทางรับเงิน"
                description="ตั้งค่าช่องทางรับเงินที่ใช้รับการสนับสนุน"
                icon={Gift}
              >
                <div>
                  <div className="mb-3">
                    <p className="font-semibold text-white">ช่องทางรับเงิน</p>
                    <p className="text-xs text-slate-500">
                      ตั้งค่าช่องทางที่ผู้สนับสนุนใช้โอนเงินหรือส่งโดเนท
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <DonationChannelCard
                      title="PromptPay"
                      subtitle="Receive donations via PromptPay instantly"
                      badge="PP"
                      enabled={donationChannels.promptpay.enabled}
                      expanded={donationChannels.promptpay.expanded}
                      onToggleEnabled={() =>
                        updateDonationChannel(
                          "promptpay",
                          "enabled",
                          !donationChannels.promptpay.enabled
                        )
                      }
                      onToggleExpanded={() =>
                        updateDonationChannel(
                          "promptpay",
                          "expanded",
                          !donationChannels.promptpay.expanded
                        )
                      }
                    >
                      <Field label="PromptPay Type">
                        <select
                          value={donationChannels.promptpay.type}
                          onChange={(e) =>
                            updateDonationChannel(
                              "promptpay",
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        >
                          <option value="phone">Phone Number</option>
                          <option value="national_id">National ID</option>
                          <option value="account">Account Number</option>
                        </select>
                      </Field>

                      <Field label="PromptPay Value">
                        <GlassInput
                          value={donationChannels.promptpay.value}
                          placeholder="Enter PromptPay value"
                          onChange={(e) =>
                            updateDonationChannel(
                              "promptpay",
                              "value",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </DonationChannelCard>

                    <DonationChannelCard
                      title="Bank Account"
                      subtitle="Receive donations via direct bank transfer"
                      badge="BK"
                      enabled={donationChannels.bank.enabled}
                      expanded={donationChannels.bank.expanded}
                      onToggleEnabled={() =>
                        updateDonationChannel(
                          "bank",
                          "enabled",
                          !donationChannels.bank.enabled
                        )
                      }
                      onToggleExpanded={() =>
                        updateDonationChannel(
                          "bank",
                          "expanded",
                          !donationChannels.bank.expanded
                        )
                      }
                    >
                      <Field label="Bank Name">
                        <GlassInput
                          value={donationChannels.bank.bankName}
                          placeholder="Enter bank name"
                          onChange={(e) =>
                            updateDonationChannel("bank", "bankName", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Account Name">
                        <GlassInput
                          value={donationChannels.bank.accountName}
                          placeholder="Enter account name"
                          onChange={(e) =>
                            updateDonationChannel(
                              "bank",
                              "accountName",
                              e.target.value
                            )
                          }
                        />
                      </Field>

                      <Field label="Account Number">
                        <GlassInput
                          value={donationChannels.bank.accountNumber}
                          placeholder="Enter account number"
                          onChange={(e) =>
                            updateDonationChannel(
                              "bank",
                              "accountNumber",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </DonationChannelCard>
                  </div>
                </div>
              </SectionCard>
              {false && <SectionCard
                id="donation"
                title="โดเนท"
                description="ตั้งค่าฟอร์มโดเนท จำนวนเงิน QR Code และข้อความ"
                icon={Heart}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="หัวข้อฟอร์มโดเนท">
                    <GlassInput
                      value={settings.donation.pageTitle}
                      onChange={(e) => updateDonation("pageTitle", e.target.value)}
                    />
                  </Field>

                  <Field label={`ยอดโดเนทขั้นต่ำ ฿${settings.donation.minAmount}`}>
                    <Slider
                      value={[settings.donation.minAmount]}
                      min={1}
                      max={500}
                      step={1}
                      onValueChange={(value) => updateDonation("minAmount", value[0])}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>฿1</span>
                      <span>Max: ฿500</span>
                    </div>
                  </Field>

                  <Field label="ข้อความต้อนรับ" className="md:col-span-2">
                    <GlassTextarea
                      value={settings.donation.welcomeMessage}
                      onChange={(e) =>
                        updateDonation("welcomeMessage", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="ข้อความปุ่มโดเนท">
                    <GlassInput
                      value={settings.donation.buttonText}
                      onChange={(e) => updateDonation("buttonText", e.target.value)}
                    />
                  </Field>

                  <Field label="QR Code / PromptPay">
                    <div className="flex gap-2">
                      <GlassInput
                        value={settings.donation.qrCodeUrl}
                        placeholder="URL รูป QR Code หรือเว้นว่างไว้"
                        onChange={(e) => updateDonation("qrCodeUrl", e.target.value)}
                      />
                      <Button
                        variant="outline"
                        className="border-slate-700 bg-slate-900/60 text-slate-300"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </Field>
                </div>

              </SectionCard>}

              {false && <SectionCard
                id="donation-channels"
                title="Donation Channels"
                description="Configure how supporters can send donations"
                icon={Gift}
              >
                <div>
                  <div className="mb-3">
                    <p className="font-semibold text-white">Donation Channels</p>
                    <p className="text-xs text-slate-500">
                      Configure how supporters can send donations
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <DonationChannelCard
                      title="PromptPay"
                      subtitle="Receive donations via PromptPay instantly"
                      badge="PP"
                      enabled={donationChannels.promptpay.enabled}
                      expanded={donationChannels.promptpay.expanded}
                      onToggleEnabled={() =>
                        updateDonationChannel(
                          "promptpay",
                          "enabled",
                          !donationChannels.promptpay.enabled
                        )
                      }
                      onToggleExpanded={() =>
                        updateDonationChannel(
                          "promptpay",
                          "expanded",
                          !donationChannels.promptpay.expanded
                        )
                      }
                    >
                      <Field label="PromptPay Type">
                        <select
                          value={donationChannels.promptpay.type}
                          onChange={(e) =>
                            updateDonationChannel(
                              "promptpay",
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        >
                          <option value="phone">Phone Number</option>
                          <option value="national_id">National ID</option>
                          <option value="account">Account Number</option>
                        </select>
                      </Field>

                      <Field label="PromptPay Value">
                        <GlassInput
                          value={donationChannels.promptpay.value}
                          placeholder="Enter PromptPay value"
                          onChange={(e) =>
                            updateDonationChannel(
                              "promptpay",
                              "value",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </DonationChannelCard>

                    <DonationChannelCard
                      title="Bank Account"
                      subtitle="Receive donations via direct bank transfer"
                      badge="BK"
                      enabled={donationChannels.bank.enabled}
                      expanded={donationChannels.bank.expanded}
                      onToggleEnabled={() =>
                        updateDonationChannel(
                          "bank",
                          "enabled",
                          !donationChannels.bank.enabled
                        )
                      }
                      onToggleExpanded={() =>
                        updateDonationChannel(
                          "bank",
                          "expanded",
                          !donationChannels.bank.expanded
                        )
                      }
                    >
                      <Field label="Bank Name">
                        <GlassInput
                          value={donationChannels.bank.bankName}
                          placeholder="Enter bank name"
                          onChange={(e) =>
                            updateDonationChannel("bank", "bankName", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Account Name">
                        <GlassInput
                          value={donationChannels.bank.accountName}
                          placeholder="Enter account name"
                          onChange={(e) =>
                            updateDonationChannel(
                              "bank",
                              "accountName",
                              e.target.value
                            )
                          }
                        />
                      </Field>

                      <Field label="Account Number">
                        <GlassInput
                          value={donationChannels.bank.accountNumber}
                          placeholder="Enter account number"
                          onChange={(e) =>
                            updateDonationChannel(
                              "bank",
                              "accountNumber",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </DonationChannelCard>
                  </div>
                </div>
              </SectionCard>}

                {false && <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">จำนวนเงินแนะนำ</p>
                      <p className="text-xs text-slate-500">
                        จำนวนเงินที่จะแสดงเป็นปุ่มลัดในฟอร์มโดเนท
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addQuickAmount}
                      className="border-slate-700 bg-slate-900/60 text-slate-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      เพิ่มจำนวน
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {settings.donation.quickAmounts.map((amount, index) => (
                      <div
                        key={`${amount}-${index}`}
                        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                      >
                        <span className="text-sm text-slate-500">฿</span>
                        <GlassInput
                          type="number"
                          value={amount}
                          onChange={(e) => updateQuickAmount(index, e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeQuickAmount(index)}
                          className="border-slate-700 bg-slate-900/60 text-slate-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>}

                {false && <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <ToggleRow
                    icon={ImageIcon}
                    title="แสดง QR Code"
                    description="ให้ผู้สนับสนุนสแกน QR ได้"
                    checked={settings.donation.showQrCode}
                    onChange={(value) => updateDonation("showQrCode", value)}
                  />
                  <ToggleRow
                    icon={Gift}
                    title="กำหนดจำนวนเงินเอง"
                    description="ให้กรอกจำนวนเงินเองได้"
                    checked={settings.donation.allowCustomAmount}
                    onChange={(value) => updateDonation("allowCustomAmount", value)}
                  />
                  <ToggleRow
                    icon={Users}
                    title="อนุญาต Anonymous"
                    description="ซ่อนชื่อผู้โดเนทได้"
                    checked={settings.donation.allowAnonymous}
                    onChange={(value) => updateDonation("allowAnonymous", value)}
                  />
                  <ToggleRow
                    icon={MessageSquare}
                    title="เปิดข้อความโดเนท"
                    description="ให้ผู้โดเนทส่งข้อความได้"
                    checked={settings.donation.showMessage}
                    onChange={(value) => updateDonation("showMessage", value)}
                  />
                </div>}
              </>
              )}

              {activeTab === "filter" && (

              <>
                <SectionCard
                  id="donation-filter"
                  title="ช่องทางรับเงิน"
                  description="ตั้งค่าฟอร์มโดเนท จำนวนเงิน QR Code และข้อความ"
                  icon={Heart}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="หัวข้อฟอร์มโดเนท">
                      <GlassInput
                        value={settings.donation.pageTitle}
                        onChange={(e) => updateDonation("pageTitle", e.target.value)}
                      />
                    </Field>

                    <Field label={`ยอดโดเนทขั้นต่ำ ฿${settings.donation.minAmount}`}>
                      <Slider
                        value={[settings.donation.minAmount]}
                        min={1}
                        max={500}
                        step={1}
                        onValueChange={(value) => updateDonation("minAmount", value[0])}
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>฿1</span>
                        <span>Max: ฿500</span>
                      </div>
                    </Field>

                    <Field label="ข้อความต้อนรับ" className="md:col-span-2">
                      <GlassTextarea
                        value={settings.donation.welcomeMessage}
                        onChange={(e) =>
                          updateDonation("welcomeMessage", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="ข้อความปุ่มโดเนท">
                      <GlassInput
                        value={settings.donation.buttonText}
                        onChange={(e) => updateDonation("buttonText", e.target.value)}
                      />
                    </Field>

                    <Field label="QR Code / PromptPay">
                      <div className="flex gap-2">
                        <GlassInput
                          value={settings.donation.qrCodeUrl}
                          placeholder="URL รูป QR Code หรือเว้นว่างไว้"
                          onChange={(e) => updateDonation("qrCodeUrl", e.target.value)}
                        />
                        <Button
                          variant="outline"
                          className="border-slate-700 bg-slate-900/60 text-slate-300"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </Field>
                  </div>
                </SectionCard>

              <SectionCard
                id="filter"
                title="ข้อความ / ฟิลเตอร์"
                description="ควบคุมข้อความที่จะแสดงบนหน้ารับโดเนท"
                icon={Filter}
              >
                <div className="rounded-[28px] border border-white/15 bg-gradient-to-tl from-white/10 via-slate-900/30 to-transparent p-4 sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      ตัวกรองข้อความ
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                      Messages Filter
                    </p>
                  </div>

                  <div className="mb-6 rounded-[28px] border border-white/15 bg-slate-950/30 p-3">
                    <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-black/30 px-5 py-3">
                      <div>
                        <p className="text-base font-medium text-white sm:text-lg">
                          คำที่กรองโดยระบบ
                        </p>
                        <p className="text-xs text-slate-400 sm:text-sm">
                          รายการคำหยาบที่ระบบจะบล็อกอัตโนมัติ
                        </p>
                      </div>
                      <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                        {settings.profanityWords.length} คำ
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 p-2 sm:p-3">
                      {settings.profanityWords.map((word) => (
                        <span
                          key={word}
                          className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/90"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/25 px-4 py-4">
                    <div>
                      <p className="text-lg font-medium text-white">
                        Block Profanity
                      </p>
                      <p className="text-xs text-slate-400 sm:text-sm">
                        {profanityFilter.description}
                      </p>
                    </div>
                    <MiniSwitch
                      checked={profanityFilter.enabled}
                      onCheckedChange={() => toggleFilter(profanityFilter.id)}
                    />
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 text-base font-medium text-white">
                      เพิ่มคำกรองของคุณเอง
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <GlassInput
                        value={customProfanityInput}
                        placeholder="พิมพ์คำที่ต้องการเพิ่ม"
                        className="rounded-full border-white/10 bg-black/40"
                        onChange={(e) => setCustomProfanityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomProfanityWord();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-6 text-white hover:bg-white/10"
                        onClick={addCustomProfanityWord}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่ม
                      </Button>
                    </div>
                  </div>

                  {(settings.customProfanityWords || []).length > 0 ? (
                    <div className="mb-2">
                      <p className="mb-3 text-sm font-medium text-slate-300">
                        คำกรองที่คุณเพิ่ม
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {settings.customProfanityWords.map((word) => (
                          <button
                            key={word}
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-100 transition hover:bg-emerald-400/15"
                            onClick={() => removeCustomProfanityWord(word)}
                          >
                            {word}
                            <X className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </SectionCard>
              </>
              )}

              {activeTab === "music" && (
              <SectionCard
                id="music"
                title="เพลง"
                description="ตั้งค่าเพลงประกอบ YouTube Request และ Playlist"
                icon={Users}
              >
                <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">Profile categories</p>
                    <p className="text-xs text-slate-500">
                      {selectedProfileCategories.length} / {MAX_PROFILE_CATEGORIES}
                    </p>
                  </div>
                  <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    Pick up to {MAX_PROFILE_CATEGORIES}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white">Selected</h3>
                      <p className="text-sm text-slate-500">
                        Categories currently attached to this profile
                      </p>
                    </div>

                    {selectedProfileCategories.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-500">
                        No profile categories selected yet
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {selectedProfileCategories.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => removeProfileCategory(item.id)}
                            className="relative flex h-[90px] gap-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-left transition hover:scale-[1.02]"
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={72}
                                height={72}
                                className="aspect-square h-full rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex aspect-square h-full items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white">
                                {item.name[0]}
                              </div>
                            )}

                            <div className="flex flex-col justify-center">
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-xs text-slate-300">Selected category</p>
                            </div>

                            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                              <X className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white">Available</h3>
                      <p className="text-sm text-slate-500">
                        Click to add or remove categories
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {profileCategoryOptions.map((item) => {
                        const isSelected = (settings.profileCategories || []).includes(
                          item.id
                        );

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleProfileCategory(item.id)}
                            className={cx(
                              "relative flex h-[90px] gap-3 rounded-2xl border p-3 text-left transition hover:scale-[1.02]",
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-slate-700 bg-slate-900/60"
                            )}
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={72}
                                height={72}
                                className="aspect-square h-full rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex aspect-square h-full items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white">
                                {item.name[0]}
                              </div>
                            )}

                            <div className="flex flex-col justify-center">
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-xs text-slate-400">Profile category</p>
                            </div>

                            {isSelected ? (
                              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {false && <div className="grid gap-3 md:grid-cols-2">
                  <ToggleRow
                    icon={Music}
                    title="เปิด Music Player"
                    description="แสดงกล่องเพลงบนหน้าโดเนท"
                    checked={settings.music.enabled}
                    onChange={(value) => updateMusic("enabled", value)}
                  />
                  <ToggleRow
                    icon={LinkIcon}
                    title="รับเพลงจาก YouTube"
                    description="ให้ผู้ใช้ส่งลิงก์เพลงได้"
                    checked={settings.music.allowYoutubeRequest}
                    onChange={(value) =>
                      updateMusic("allowYoutubeRequest", value)
                    }
                  />
                  <ToggleRow
                    icon={Upload}
                    title="เปิดอัปโหลดเพลง"
                    description="อนุญาตอัปโหลดไฟล์เพลง"
                    checked={settings.music.allowUpload}
                    onChange={(value) => updateMusic("allowUpload", value)}
                  />
                  <ToggleRow
                    icon={Headphones}
                    title="แสดง Playlist"
                    description="แสดงรายการเพลงถัดไป"
                    checked={settings.music.showPlaylist}
                    onChange={(value) => updateMusic("showPlaylist", value)}
                  />
                </div>}

                {false && <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <Field label="ชื่อเพลงปัจจุบัน">
                    <GlassInput
                      value={settings.music.currentSong.title}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          music: {
                            ...prev.music,
                            currentSong: {
                              ...prev.music.currentSong,
                              title: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </Field>
                  <Field label="ศิลปิน">
                    <GlassInput
                      value={settings.music.currentSong.artist}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          music: {
                            ...prev.music,
                            currentSong: {
                              ...prev.music.currentSong,
                              artist: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </Field>
                  <Field label={`ระดับเสียง ${settings.music.volume}%`}>
                    <Slider
                      value={[settings.music.volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateMusic("volume", value[0])}
                    />
                  </Field>
                </div>}
              </SectionCard>
              )}

              {activeTab === "content" && (
              <SectionCard
                id="content"
                title="วิดีโอ / คอนเทนต์"
                description="จัดการไฮไลท์วิดีโอและโพสต์รายวัน"
                icon={Video}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">ไฮไลท์วิดีโอ</p>
                    <p className="text-xs text-slate-500">
                      วิดีโอที่จะแสดงในส่วน Highlight
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900/60 text-slate-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มวิดีโอ
                  </Button>
                </div>

                <div className="space-y-3">
                  {settings.videos.map((video) => (
                    <div
                      key={video.id}
                      className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 md:grid-cols-[auto_1fr_120px_auto]"
                    >
                      <div className="flex items-center gap-2 text-slate-500">
                        <GripVertical className="h-4 w-4" />
                        <MiniSwitch
                          checked={video.enabled}
                          onCheckedChange={(value) =>
                            updateArrayItem("videos", video.id, "enabled", value)
                          }
                        />
                      </div>
                      <GlassInput
                        value={video.title}
                        onChange={(e) =>
                          updateArrayItem("videos", video.id, "title", e.target.value)
                        }
                      />
                      <GlassInput
                        value={video.duration}
                        onChange={(e) =>
                          updateArrayItem(
                            "videos",
                            video.id,
                            "duration",
                            e.target.value
                          )
                        }
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-slate-700 bg-slate-900/60 text-slate-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">โพสต์รายวัน</p>
                    <p className="text-xs text-slate-500">
                      คอนเทนต์ล่าสุดที่จะโชว์บนหน้าโดเนท
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900/60 text-slate-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มโพสต์
                  </Button>
                </div>

                <div className="space-y-3">
                  {settings.posts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                          <GripVertical className="h-4 w-4" />
                          <span className="text-sm text-slate-400">
                            Post #{post.id}
                          </span>
                        </div>
                        <MiniSwitch
                          checked={post.enabled}
                          onCheckedChange={(value) =>
                            updateArrayItem("posts", post.id, "enabled", value)
                          }
                        />
                      </div>
                      <GlassTextarea
                        value={post.text}
                        onChange={(e) =>
                          updateArrayItem("posts", post.id, "text", e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
              )}

              {activeTab === "gallery" && (
              <SectionCard
                id="gallery"
                title="แกลเลอรี"
                description="จัดการรูปภาพที่แสดงในหน้าโปรไฟล์"
                icon={ImageIcon}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    แนะนำขนาดรูป 800x800px หรือสัดส่วน 1:1
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900/60 text-slate-300"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    อัปโหลดรูป
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {settings.gallery.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40"
                    >
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.url})` }}
                      />
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm text-slate-400">รูปที่ {item.id}</span>
                        <MiniSwitch
                          checked={item.enabled}
                          onCheckedChange={(value) =>
                            updateArrayItem("gallery", item.id, "enabled", value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
              )}

              {activeTab === "schedule" && (
              <SectionCard
                id="schedule"
                title="ตารางสตรีม"
                description="กำหนดวัน เวลา และกิจกรรมที่จะไลฟ์"
                icon={CalendarDays}
              >
                <div className="mb-4">
                  <p className="text-sm text-slate-400">
                    ตารางนี้จะแสดงในกล่อง Stream Schedule ด้านขวาของหน้าโปรไฟล์ โดยกำหนดคงที่เป็นวันจันทร์ - อาทิตย์
                  </p>
                </div>

                <div className="space-y-3">
                  {settings.schedule.map((item) => {
                    const { startTime, endTime } = parseScheduleTimeRange(item.time);

                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 md:grid-cols-[120px_260px_1fr]"
                      >
                        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/70 px-4 text-sm font-medium text-slate-200">
                          {item.day}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={startTime || "none"}
                            onValueChange={(value) =>
                              updateArrayItem(
                                "schedule",
                                item.id,
                                "time",
                                buildScheduleTimeRange(
                                  value === "none" ? "" : value,
                                  endTime
                                )
                              )
                            }
                          >
                            <SelectTrigger className="w-full border-slate-700 bg-slate-950/50 text-white">
                              <SelectValue placeholder="เวลาเริ่ม" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 border-slate-700 bg-slate-800">
                              <SelectItem value="none" className="text-white hover:bg-slate-700">
                                ไม่ระบุ
                              </SelectItem>
                              {TIME_SELECT_OPTIONS.map((timeOption) => (
                                <SelectItem
                                  key={`start-${timeOption}`}
                                  value={timeOption}
                                  className="text-white hover:bg-slate-700"
                                >
                                  {timeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={endTime || "none"}
                            onValueChange={(value) =>
                              updateArrayItem(
                                "schedule",
                                item.id,
                                "time",
                                buildScheduleTimeRange(
                                  startTime,
                                  value === "none" ? "" : value
                                )
                              )
                            }
                          >
                            <SelectTrigger className="w-full border-slate-700 bg-slate-950/50 text-white">
                              <SelectValue placeholder="เวลาจบ" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 border-slate-700 bg-slate-800">
                              <SelectItem value="none" className="text-white hover:bg-slate-700">
                                ไม่ระบุ
                              </SelectItem>
                              {TIME_SELECT_OPTIONS.map((timeOption) => (
                                <SelectItem
                                  key={`end-${timeOption}`}
                                  value={timeOption}
                                  className="text-white hover:bg-slate-700"
                                >
                                  {timeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <GlassInput
                          value={item.title}
                          placeholder="เช่น Valorant"
                          onChange={(e) =>
                            updateArrayItem(
                              "schedule",
                              item.id,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
              )}

              {activeTab === "products" && (
              <SectionCard
                id="products"
                title="สินค้า / โปรโมชัน"
                description="จัดการสินค้าหรือโปรโมชันที่แสดงบนหน้าโดเนท"
                icon={ShoppingBag}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    ใช้สำหรับขาย Merch หรือโปรโมตสินค้าให้แฟนคลับ
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-900/60 text-slate-300"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    เพิ่มสินค้า
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {settings.products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                    >
                      <div
                        className="mb-3 h-28 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <Field label="ชื่อสินค้า">
                        <GlassInput
                          value={product.name}
                          onChange={(e) =>
                            updateArrayItem(
                              "products",
                              product.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                      <Field label="ราคา" className="mt-3">
                        <GlassInput
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            updateArrayItem(
                              "products",
                              product.id,
                              "price",
                              Number(e.target.value || 0)
                            )
                          }
                        />
                      </Field>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-400">แสดงสินค้า</span>
                        <MiniSwitch
                          checked={product.enabled}
                          onCheckedChange={(value) =>
                            updateArrayItem(
                              "products",
                              product.id,
                              "enabled",
                              value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
              )}

              {activeTab === "display" && (
              <SectionCard
                id="display"
                title="การแสดงผล"
                description="เปิด/ปิด section ต่าง ๆ ที่จะแสดงบนหน้า DonateProfile"
                icon={Monitor}
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <ToggleRow
                    icon={User}
                    title="Profile Header"
                    description="แสดงข้อมูลโปรไฟล์ด้านบน"
                    checked={settings.display.showProfileHeader}
                    onChange={(value) => updateDisplay("showProfileHeader", value)}
                  />
                  <ToggleRow
                    icon={Heart}
                    title="Donation Form"
                    description="แสดงฟอร์มโดเนท"
                    checked={settings.display.showDonationForm}
                    onChange={(value) => updateDisplay("showDonationForm", value)}
                  />
                  <ToggleRow
                    icon={Music}
                    title="Music Player"
                    description="แสดงเครื่องเล่นเพลง"
                    checked={settings.display.showMusicPanel}
                    onChange={(value) => updateDisplay("showMusicPanel", value)}
                  />
                  <ToggleRow
                    icon={Video}
                    title="Video Highlights"
                    description="แสดงวิดีโอไฮไลท์"
                    checked={settings.display.showVideoHighlights}
                    onChange={(value) => updateDisplay("showVideoHighlights", value)}
                  />
                  <ToggleRow
                    icon={MessageSquare}
                    title="Daily Content"
                    description="แสดงโพสต์รายวัน"
                    checked={settings.display.showDailyContent}
                    onChange={(value) => updateDisplay("showDailyContent", value)}
                  />
                  <ToggleRow
                    icon={Camera}
                    title="Photo Gallery"
                    description="แสดงแกลเลอรีรูปภาพ"
                    checked={settings.display.showGallery}
                    onChange={(value) => updateDisplay("showGallery", value)}
                  />
                  <ToggleRow
                    icon={CalendarDays}
                    title="Stream Schedule"
                    description="แสดงตารางสตรีม"
                    checked={settings.display.showSchedule}
                    onChange={(value) => updateDisplay("showSchedule", value)}
                  />
                  <ToggleRow
                    icon={ShoppingBag}
                    title="Product Promo"
                    description="แสดงสินค้าและโปรโมชัน"
                    checked={settings.display.showProducts}
                    onChange={(value) => updateDisplay("showProducts", value)}
                  />
                  <ToggleRow
                    icon={Gift}
                    title="Recent Donations"
                    description="แสดงผู้สนับสนุนล่าสุด"
                    checked={settings.display.showRecentDonations}
                    onChange={(value) => updateDisplay("showRecentDonations", value)}
                  />
                  <ToggleRow
                    icon={Settings2}
                    title="Footer"
                    description="แสดง Footer ด้านล่าง"
                    checked={settings.display.showFooter}
                    onChange={(value) => updateDisplay("showFooter", value)}
                  />
                </div>
              </SectionCard>
              )}

              <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-800 bg-slate-950/95 px-4 py-4 lg:-mx-6 lg:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  {saveMessage ? (
                    <div className="flex items-center text-sm text-emerald-300 sm:mr-auto">
                      {saveMessage}
                    </div>
                  ) : null}
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={handleRestoreSaved}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => handleSaveSettings("draft")}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    บันทึกร่าง
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/20 hover:from-cyan-400 hover:to-purple-400"
                    onClick={() => handleSaveSettings("publish")}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    บันทึก & เผยแพร่
                  </Button>
                </div>
              </div>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-[88px] rounded-2xl border border-slate-700/70 bg-slate-950/92 p-4 shadow-2xl shadow-black/30 2xl:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">Live Preview</p>
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="text-xs text-slate-500">
                        อัปเดตแบบเรียลไทม์
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      ตัวอย่างหน้าที่ผู้สนับสนุนจะเห็น
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-700 bg-slate-900/60 text-slate-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <LivePreview settings={deferredSettings} optimizeForEditor />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function LegacyLivePreview({ settings, selectedTheme }) {
  return (
    <div className="max-h-[calc(100vh-150px)] overflow-y-auto rounded-xl border border-slate-800 bg-[#06101d] p-3 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-700">
      <div
        className="relative overflow-hidden rounded-xl border border-slate-700 bg-cover bg-center"
        style={{
          backgroundImage: `url(${settings.profile.bannerUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative p-4 pt-16">
          <div className="flex items-end gap-3">
            <div
              className={cx(
                "flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-3xl font-black text-white shadow-lg",
                selectedTheme.accent
              )}
            >
              {settings.profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 pb-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-2xl font-black text-white">
                  {settings.profile.name}
                </h3>
                {settings.profile.verified && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
                {settings.profile.isOnline && (
                  <span className="rounded-full bg-green-500/20 px-2 py-1 text-[10px] font-bold text-green-300">
                    ONLINE
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                <span>{settings.profile.handle}</span>
                <Copy className="h-3 w-3" />
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-slate-200">
                {settings.profile.bio}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {settings.socials
              .filter((item) => item.enabled)
              .map((social) => (
                <span
                  key={social.id}
                  className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs text-white"
                >
                  {social.label}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {settings.display.showDonationForm && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-300" />
              <h4 className="font-bold text-white">{settings.donation.pageTitle}</h4>
            </div>

            <p className="mb-3 text-xs text-slate-400">
              {settings.donation.welcomeMessage}
            </p>

            <div className="grid grid-cols-[110px_1fr] gap-3">
              {settings.donation.showQrCode && (
                <div className="flex h-28 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-900">
                  QR CODE
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {settings.donation.quickAmounts.map((amount, index) => (
                    <span
                      key={`${amount}-${index}`}
                      className={cx(
                        "rounded-lg border px-3 py-1.5 text-xs text-white",
                        index === 1
                          ? "border-purple-400 bg-purple-500/30"
                          : "border-slate-700 bg-slate-950/60"
                      )}
                    >
                      ฿{amount}
                    </span>
                  ))}
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white">
                  ฿ {settings.donation.minAmount}
                </div>

                {settings.donation.showMessage && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                    ส่งข้อความกำลังใจให้สตรีมเมอร์...
                  </div>
                )}
              </div>
            </div>

            <button
              className={cx(
                "mt-4 w-full rounded-xl bg-gradient-to-r py-3 font-bold text-white shadow-lg",
                selectedTheme.accent
              )}
            >
              ♥ {settings.donation.buttonText}
            </button>
          </div>
        )}

        {settings.display.showMusicPanel && settings.music.enabled && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Music className="h-4 w-4 text-cyan-300" />
              <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Now Playing
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={cx(
                  "flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br",
                  selectedTheme.accent
                )}
              >
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">
                  {settings.music.currentSong.title}
                </p>
                <p className="text-xs text-slate-400">
                  {settings.music.currentSong.artist}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                  <div
                    className={cx("h-full w-1/2 rounded-full bg-gradient-to-r", selectedTheme.accent)}
                  />
                </div>
              </div>
              <button
                className={cx(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br",
                  selectedTheme.accent
                )}
              >
                <Play className="h-4 w-4 fill-white text-white" />
              </button>
            </div>

            {settings.music.showPlaylist && (
              <div className="mt-3 space-y-1">
                {settings.music.playlist.slice(0, 3).map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-2 text-xs text-slate-300"
                  >
                    <span>
                      {index + 1}. {song.title}
                    </span>
                    <span className="text-slate-500">{song.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {settings.display.showGallery && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-cyan-300" />
                <p className="font-bold text-white">แกลเลอรี</p>
              </div>
              <span className="text-xs text-purple-300">ดูทั้งหมด</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {settings.gallery
                .filter((item) => item.enabled)
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    className="h-16 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.url})` }}
                  />
                ))}
            </div>
          </div>
        )}

        {settings.display.showVideoHighlights && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Video className="h-4 w-4 text-cyan-300" />
              <p className="font-bold text-white">ไฮไลท์วิดีโอ</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {settings.videos
                .filter((item) => item.enabled)
                .slice(0, 3)
                .map((video) => (
                  <div key={video.id}>
                    <div
                      className="relative h-16 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                        <Play className="h-5 w-5 fill-white text-white" />
                      </div>
                    </div>
                    <p className="mt-1 truncate text-[10px] text-white">
                      {video.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {settings.display.showSchedule && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-cyan-300" />
              <p className="font-bold text-white">ตารางสตรีม</p>
            </div>

            <div className="space-y-2">
              {settings.schedule
                .filter((item) => item.enabled)
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_1fr_1fr] gap-2 text-xs"
                  >
                    <span className="text-slate-400">{item.day}</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </span>
                    <span className="text-right text-white">{item.title}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {settings.display.showProducts && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-cyan-300" />
              <p className="font-bold text-white">สินค้า / โปรโมชัน</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {settings.products
                .filter((item) => item.enabled)
                .slice(0, 3)
                .map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50"
                  >
                    <div
                      className="h-16 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                    <div className="p-2">
                      <p className="truncate text-[10px] text-white">
                        {product.name}
                      </p>
                      <p className="text-xs font-bold text-cyan-300">
                        ฿{product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {settings.display.showRecentDonations &&
          settings.recentDonations.enabled && (
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Gift className="h-4 w-4 text-cyan-300" />
                <p className="font-bold text-white">ผู้สนับสนุนล่าสุด</p>
              </div>

              <div className="space-y-2">
                {settings.recentDonations.items
                  .slice(0, settings.recentDonations.maxItems)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-950/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{item.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-cyan-300">
                          ฿{item.amount}
                        </p>
                        <p className="text-[10px] text-slate-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
      </div>

      {settings.display.showFooter && (
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
          <span>© 2024 DonateHUB</span>
          <span>TrueMoney / PromptPay</span>
        </div>
      )}
    </div>
  );
}

const LivePreview = memo(function LivePreview({ settings, optimizeForEditor = false }) {
  return (
    <DonatePageRenderer
      settings={settings}
      preview
      optimizeForEditor={optimizeForEditor}
    />
  );
});
