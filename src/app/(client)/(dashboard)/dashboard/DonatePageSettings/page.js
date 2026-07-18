"use client";

import React, { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
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
  Gift,
  X,
  Play,
  Users,
  Camera,
  Tablet,
  Smartphone,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchDonatePageSettings,
  saveDonatePageSettings,
} from "@/actions/DonatePageapi/donatePageSettingsApi";
import { checkUsernameAvailability, updateUsername } from "@/actions/Usersapi/usersApi";
import {
  buildDonatePageMetadata,
  buildDonatePageSettingsPatch,
} from "@/components/donation/shared/donatePageMetadata";
import PublicDonatePage from "@/components/donation/shared/PublicDonatePage";
import { donationDecorationPresets } from "@/components/donation/shared/donatePageConfig";
import { getVideoEmbedData } from "@/components/donation/shared/videoEmbed";

const defaultDecorationPreset =
  donationDecorationPresets.find((preset) => preset.id === "original-default") ||
  donationDecorationPresets[0];
const MAX_GALLERY_IMAGES = 6;
const MAX_CONTENT_POSTS = 2;
const MAX_HIGHLIGHT_VIDEOS = 4;

const MAX_PROFILE_CATEGORIES = 5;
const STREAMFLOW_DOMAIN = "streamflow";
const USERNAME_PATTERN = /^[a-z0-9]+$/;
const RESERVED_USERNAMES = new Set([
  "about",
  "account",
  "api",
  "categories",
  "dashboard",
  "developerzone",
  "donate",
  "explore",
  "faviconico",
  "landing",
  "login",
  "page",
  "plans",
  "register",
  "streamers",
  "test",
  "verify",
  "widgets",
  "withdraw",
]);

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

const socialPlaceholders = {
  facebook: "https://facebook.com/username",
  youtube: "https://youtube.com/@channel",
  tiktok: "https://tiktok.com/@username",
  x: "https://x.com/username",
  instagram: "https://instagram.com/username",
  website: "https://your-website.com",
};

const socialTemplateMap = new Map(fixedSocials.map((item) => [item.id, item]));

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
    desc: "ตั้งค่าช่องทางรับเงิน",
    icon: Heart,
  },
  {
    id: "filter",
    title: "ข้อความ / ฟิลเตอร์",
    desc: "ข้อความฟอร์มและตัวกรอง",
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
    name: "",
    handle: "streamflow/",
    username: "",
    bio: "",
    avatarUrl: "",
    bannerUrl: "",
    backgroundUrl: "",
    isOnline: false,
    verified: false,
  },

  socials: [],

  donation: {
    pageTitle: "",
    minAmount: 20,
    quickAmounts: [10, 20, 50, 100, 200, 500],
    qrCodeUrl: "",
    showQrCode: true,
    allowCustomAmount: true,
    allowAnonymous: true,
    showDonorName: true,
    showMessage: true,
    welcomeMessage: "",
    buttonText: "",
    channels: {
      promptpay: {
        enabled: false,
        expanded: false,
        type: "phone",
        value: "",
      },
      bank: {
        enabled: false,
        expanded: false,
        bankName: "",
        accountName: "",
        accountNumber: "",
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

  profileCategories: [],

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

  videos: [],

  posts: [],

  gallery: [],

  schedule: [],

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

function sanitizeUsername(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 50);
}

function buildStreamflowHandle(username = "") {
  const normalizedUsername = sanitizeUsername(username);
  return normalizedUsername ? `${STREAMFLOW_DOMAIN}/${normalizedUsername}` : `${STREAMFLOW_DOMAIN}/`;
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

function GlassTimeInput(props) {
  return (
    <Input
      type="time"
      step="1800"
      {...props}
      className={cx(
        "border-slate-700/80 bg-slate-950/50 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400/70",
        "[color-scheme:dark]",
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

function SectionSaveAction({ onSave, className, disabled = false, label = "บันทึกส่วนนี้" }) {
  return (
    <div className={cx("mt-4 flex justify-end", className)}>
      <Button
        type="button"
        disabled={disabled}
        className="h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onSave}
      >
        <Save className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}

function normalizeSocials(socials) {
  const source = Array.isArray(socials) ? socials : fixedSocials;

  return source.map((item) => {
    const template = socialTemplateMap.get(item.id);

    return {
      ...(template || {}),
      ...item,
      label: item.label || template?.label || "Social Link",
      href: item.href || template?.href || "",
      enabled: item.enabled ?? true,
    };
  });
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

function normalizeGallery(gallery, fallback = defaultSettings.gallery) {
  const source = Array.isArray(gallery) ? gallery : fallback;

  return source
    .slice(0, MAX_GALLERY_IMAGES)
    .map((item, index) => ({
      id: index + 1,
      url: item?.url || "",
      enabled: item?.enabled ?? true,
    }))
    .filter((item) => item.url);
}

function normalizePosts(posts, fallback = defaultSettings.posts) {
  const source = Array.isArray(posts) ? posts : fallback;

  return source.slice(0, MAX_CONTENT_POSTS).map((item, index) => ({
    id: index + 1,
    text: item?.text || "",
    image: item?.image || "",
    enabled: item?.enabled ?? true,
  }));
}

function normalizeVideos(videos, fallback = defaultSettings.videos) {
  const source = Array.isArray(videos) ? videos : fallback;

  return source.slice(0, MAX_HIGHLIGHT_VIDEOS).map((item, index) => {
    const embed = getVideoEmbedData(item?.url || "");

    return {
      id: index + 1,
      title: item?.title || `${embed.platformLabel || "คลิป"} ${index + 1}`,
      url: item?.url || "",
      platform: embed.platform || item?.platform || "",
      embedUrl: embed.embedUrl || item?.embedUrl || "",
      thumbnail: embed.thumbnailUrl || item?.thumbnail || "",
      enabled: item?.enabled ?? true,
    };
  });
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

function buildInitialSettings(source = defaultSettings, preferredUsername = "") {
  const loadedSettings = {
    ...defaultSettings,
    ...(source || {}),
    design: {
      ...defaultSettings.design,
      ...(source?.design || {}),
    },
    profile: {
      ...defaultSettings.profile,
      ...(source?.profile || {}),
    },
    donation: {
      ...defaultSettings.donation,
      ...(source?.donation || {}),
      channels: {
        ...defaultSettings.donation.channels,
        ...(source?.donation?.channels || {}),
        promptpay: {
          ...defaultSettings.donation.channels.promptpay,
          ...(source?.donation?.channels?.promptpay || {}),
        },
        bank: {
          ...defaultSettings.donation.channels.bank,
          ...(source?.donation?.channels?.bank || {}),
        },
      },
    },
  };

  const normalizedProfileUsername = sanitizeUsername(
    preferredUsername ||
      loadedSettings.profile?.username ||
      String(loadedSettings.profile?.handle || "").replace(/^.*\//, "")
  );

  loadedSettings.profile = {
    ...loadedSettings.profile,
    username: normalizedProfileUsername,
    handle: buildStreamflowHandle(normalizedProfileUsername),
  };

  return {
    ...loadedSettings,
    socials: normalizeSocials(loadedSettings.socials),
    filters: normalizeFilters(loadedSettings.filters),
    profanityWords: normalizeProfanityWords(loadedSettings.profanityWords),
    customProfanityWords: normalizeCustomProfanityWords(
      loadedSettings.customProfanityWords
    ),
    videos: normalizeVideos(loadedSettings.videos),
    gallery: normalizeGallery(loadedSettings.gallery),
    posts: normalizePosts(loadedSettings.posts),
    schedule: normalizeSchedule(loadedSettings.schedule),
  };
}

export default function DonatePageSettings() {
  const { user, isLoading: isAuthLoading, refetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("theme");
  const [settings, setSettings] = useState(() => buildInitialSettings());
  const [customProfanityInput, setCustomProfanityInput] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewViewport, setPreviewViewport] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const deferredSettings = useDeferredValue(settings);
  const avatarFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: true,
    message: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (isAuthLoading) {
        return;
      }

      if (!user?.id) {
        setSettings(buildInitialSettings());
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetchDonatePageSettings(user.id);
        const metadata = response?.metadata;

        setSettings(
          metadata
            ? buildInitialSettings(buildDonatePageSettingsPatch(metadata), user.username)
            : buildInitialSettings(undefined, user.username)
        );
      } catch (error) {
        console.error(error);
        setSettings(buildInitialSettings(undefined, user.username));
        toast.error("โหลดข้อมูลไม่สำเร็จ ใช้ค่าเริ่มต้นชั่วคราว");
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, [isAuthLoading, user?.id, user?.username]);

  useEffect(() => {
    if (loading || isAuthLoading || !user?.id) {
      return;
    }

    const normalizedUsername = sanitizeUsername(settings.profile?.username);

    if (!normalizedUsername || normalizedUsername.length < 3) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Username ต้องมีอย่างน้อย 3 ตัวอักษร",
      });
      return;
    }

    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "ใช้ได้เฉพาะ a-z และ 0-9 เท่านั้น",
      });
      return;
    }

    if (RESERVED_USERNAMES.has(normalizedUsername)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "ชื่อนี้ถูกสงวนไว้โดยระบบ",
      });
      return;
    }

    let cancelled = false;

    setUsernameStatus((prev) => ({
      ...prev,
      checking: true,
      message: "กำลังตรวจสอบ username...",
    }));

    const timer = setTimeout(async () => {
      const result = await checkUsernameAvailability(normalizedUsername, user.id);

      if (cancelled) {
        return;
      }

      setUsernameStatus({
        checking: false,
        available: result.available,
        message: result.available
          ? "สามารถใช้งาน username นี้ได้"
          : "Username นี้ถูกใช้แล้ว",
      });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isAuthLoading, loading, settings.profile?.username, user?.id]);

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
  const profanityFilter =
    settings.filters.find((item) => item.id === "profanity") ||
    defaultSettings.filters[0];
  const sectionSaveActionProps = {
    disabled: saving || loading,
    label: saving ? "กำลังบันทึก..." : "บันทึกส่วนนี้",
  };

  const cloneDecorations = (decorations) =>
    Object.fromEntries(
      Object.entries(decorations).map(([key, value]) => [key, { ...value }])
    );
  const cloneSectionDecorations = (decorations) =>
    Object.fromEntries(
      Object.entries(decorations || {}).map(([key, value]) => [key, { ...value }])
    );
  const ActiveTabIcon = activeTab === "music" ? Users : activeNavItem.icon;

  const applyDecorationPreset = (preset) => {
    setSettings((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        ...preset.settingsPatch,
        decorationPreset: preset.id,
        donationFormDecorations: cloneDecorations(preset.decorations),
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
    if (key === "username" || key === "handle") {
      const normalizedUsername = sanitizeUsername(value);

      setSettings((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          username: normalizedUsername,
          handle: buildStreamflowHandle(normalizedUsername),
        },
      }));
      return;
    }

    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  };

  const readFileAsDataUrl = (file, options = {}) =>
    new Promise((resolve, reject) => {
      const {
        maxWidth = 1600,
        maxHeight = 1600,
        quality = 0.82,
      } = options;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("read-failed"));
          return;
        }

        const image = new window.Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = image;

          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(1, widthRatio, heightRatio);

          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));

          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("canvas-context-unavailable"));
            return;
          }

          context.drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.onerror = () => reject(new Error("image-load-failed"));
        image.src = reader.result;
      };
      reader.onerror = () => reject(new Error("read-failed"));
      reader.readAsDataURL(file);
    });

  const updateDonation = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        [key]: value,
      },
    }));
  };

  const updateDonationChannel = (channelKey, key, value) => {
    setSettings((prev) => ({
      ...prev,
      donation: {
        ...prev.donation,
        channels: {
          ...prev.donation.channels,
          [channelKey]: {
            ...prev.donation.channels[channelKey],
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

  const persistSettings = async (nextSettings, mode = "publish") => {
    if (saving || loading) {
      return false;
    }

    if (!user?.id) {
      toast.error("ไม่พบข้อมูลผู้ใช้");
      return false;
    }

    const normalizedUsername = sanitizeUsername(nextSettings.profile?.username);

    if (normalizedUsername.length < 3) {
      toast.error("Username ต้องมีอย่างน้อย 3 ตัวอักษร");
      return false;
    }

    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      toast.error("Username ใช้ได้เฉพาะ a-z และ 0-9 เท่านั้น");
      return false;
    }

    if (RESERVED_USERNAMES.has(normalizedUsername)) {
      toast.error("ชื่อนี้ถูกสงวนไว้โดยระบบ");
      return false;
    }

    const usernameCheck = await checkUsernameAvailability(normalizedUsername, user.id);

    if (!usernameCheck.available) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Username นี้ถูกใช้แล้ว",
      });
      toast.error("Username นี้ถูกใช้แล้ว");
      return false;
    }

    const preparedSettings = {
      ...nextSettings,
      profile: {
        ...nextSettings.profile,
        username: normalizedUsername,
        handle: buildStreamflowHandle(normalizedUsername),
      },
    };

    setSaving(true);

    try {
      const usernameUpdate = await updateUsername(user.id, normalizedUsername);

      if (!usernameUpdate?.ok) {
        if (usernameUpdate?.errorCode === "route-not-found") {
          throw new Error(
            "Backend ยังไม่มี route อัปเดต username กรุณารีสตาร์ต backend ก่อน"
          );
        }

        throw new Error(
          usernameUpdate?.message || "อัปเดต username ใน tb user ไม่สำเร็จ"
        );
      }

      const response = await saveDonatePageSettings(
        user.id,
        buildDonatePageMetadata(preparedSettings)
      );

      if (!response) {
        throw new Error("save-failed");
      }

      toast.success(
        mode === "draft"
          ? "บันทึกข้อมูลเรียบร้อยแล้ว"
          : "บันทึกและเผยแพร่เรียบร้อยแล้ว"
      );
      setSettings(preparedSettings);
      await refetchUser?.();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (mode = "publish") => {
    return persistSettings(settings, mode);
  };

  const handleProfileImageUpload = async (key, file) => {
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);

      if (!dataUrl) {
        throw new Error("empty-image");
      }

      const nextSettings = {
        ...settings,
        profile: {
          ...settings.profile,
          [key]: dataUrl,
        },
      };

      setSettings(nextSettings);
      await persistSettings(nextSettings, "draft");
    } catch (error) {
      console.error(error);
      toast.error("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  };

  const updateSocial = (id, key, value) => {
    setSettings((prev) => ({
      ...prev,
      socials: prev.socials.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const updateSocialType = (currentId, nextId) => {
    if (!nextId || currentId === nextId) {
      return;
    }

    setSettings((prev) => {
      const takenIds = new Set(
        (prev.socials || [])
          .filter((item) => item.id !== currentId)
          .map((item) => item.id)
      );

      if (takenIds.has(nextId)) {
        return prev;
      }

      const nextTemplate = socialTemplateMap.get(nextId);
      if (!nextTemplate) {
        return prev;
      }

      return {
        ...prev,
        socials: (prev.socials || []).map((item) =>
          item.id === currentId
            ? {
                ...nextTemplate,
                enabled: true,
                href:
                  item.href && item.href !== (socialTemplateMap.get(currentId)?.href || "")
                    ? item.href
                    : "",
              }
            : item
        ),
      };
    });
  };

  const addSocial = () => {
    setSettings((prev) => {
      const currentIds = new Set((prev.socials || []).map((item) => item.id));
      const nextTemplate = fixedSocials.find((item) => !currentIds.has(item.id));

      if (!nextTemplate) {
        return prev;
      }

      return {
        ...prev,
        socials: [...(prev.socials || []), { ...nextTemplate, enabled: true }],
      };
    });
  };

  const removeSocial = (id) => {
    setSettings((prev) => ({
      ...prev,
      socials: (prev.socials || []).filter((item) => item.id !== id),
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

  const addPost = () => {
    setSettings((prev) => {
      const currentPosts = normalizePosts(prev.posts, []);
      if (currentPosts.length >= MAX_CONTENT_POSTS) {
        return prev;
      }

      return {
        ...prev,
        posts: [
          ...currentPosts,
          {
            id: currentPosts.length + 1,
            text: "",
            image: "",
            enabled: true,
          },
        ],
      };
    });
  };

  const removePost = (id) => {
    setSettings((prev) => ({
      ...prev,
      posts: normalizePosts(
        (prev.posts || []).filter((item) => item.id !== id),
        []
      ),
    }));
  };

  const handlePostImageUpload = (postId, file) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateArrayItem("posts", postId, "image", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addVideoHighlight = () => {
    setSettings((prev) => {
      const currentVideos = normalizeVideos(prev.videos, []);
      if (currentVideos.length >= MAX_HIGHLIGHT_VIDEOS) {
        return prev;
      }

      return {
        ...prev,
        videos: [
          ...currentVideos,
          {
            id: currentVideos.length + 1,
            title: `คลิป ${currentVideos.length + 1}`,
            url: "",
            platform: "",
            embedUrl: "",
            thumbnail: "",
            enabled: true,
          },
        ],
      };
    });
  };

  const removeVideoHighlight = (id) => {
    setSettings((prev) => ({
      ...prev,
      videos: normalizeVideos(
        (prev.videos || []).filter((item) => item.id !== id),
        []
      ),
    }));
  };

  const updateVideoUrl = (id, value) => {
    const embed = getVideoEmbedData(value);

    setSettings((prev) => ({
      ...prev,
      videos: normalizeVideos(
        (prev.videos || []).map((item) =>
          item.id === id
            ? {
                ...item,
                url: value,
                platform: embed.platform,
                embedUrl: embed.embedUrl,
                thumbnail: embed.thumbnailUrl || item.thumbnail || "",
                title:
                  item.title && !item.title.startsWith("คลิป ")
                    ? item.title
                    : embed.platformLabel
                      ? `${embed.platformLabel} Highlight`
                      : item.title,
              }
            : item
        ),
        []
      ),
    }));
  };

  const handleGalleryUpload = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) {
      return;
    }

    const remainingSlots = Math.max(0, MAX_GALLERY_IMAGES - (settings.gallery?.length || 0));
    if (remainingSlots <= 0) {
      toast.error(`เพิ่มรูปได้สูงสุด ${MAX_GALLERY_IMAGES} รูป`);
      return;
    }

    try {
      const uploadedUrls = await Promise.all(
        files.slice(0, remainingSlots).map((file) =>
          readFileAsDataUrl(file, {
            maxWidth: 1280,
            maxHeight: 1280,
            quality: 0.78,
          })
        )
      );

      setSettings((prev) => {
        const currentGallery = normalizeGallery(prev.gallery, []);
        const nextGalleryItems = uploadedUrls
          .filter(Boolean)
          .map((url, index) => ({
            id: currentGallery.length + index + 1,
            url,
            enabled: true,
          }));

        return {
          ...prev,
          gallery: normalizeGallery([...currentGallery, ...nextGalleryItems], []),
        };
      });

      if (files.length > remainingSlots) {
        toast.warning(`เพิ่มได้สูงสุด ${MAX_GALLERY_IMAGES} รูป ระบบเพิ่มให้ ${remainingSlots} รูปแรก`);
      }
    } catch {
      toast.error("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  };

  const removeGalleryImage = (id) => {
    setSettings((prev) => ({
      ...prev,
      gallery: normalizeGallery(
        (prev.gallery || []).filter((item) => item.id !== id),
        []
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
                item.id === "music" ? "หมวดหมู่โปรไฟล์" : item.title;
              const itemDesc =
                item.id === "music"
                  ? "เลือกแนวคอนเทนต์หรือเกมที่คุณทำ"
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
                  disabled={loading}
                  className="border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  ดูตัวอย่างเต็มจอ
                </Button>
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-6">
            <div className="space-y-5">
              {activeTab === "theme" && (
              <SectionCard
                id="theme"
                title="ธีม & ดีไซน์"
                description="แยกโทนสีหลักออกจากกรอบเทศกาล เพื่อให้หน้าดูสะอาดและไม่สีจัดเกินไป"
                icon={Palette}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        กรอบเทศกาล
                      </p>
                      <p className="text-xs text-slate-500">
                        เพิ่มแค่กรอบ ลาย และ ornament ตามเทศกาล โดยคงโทนสีหลักที่เลือกไว้
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                      {selectedDecorationPreset.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

                            <div className="relative h-24 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.55),rgba(2,6,23,0.75))]">
                              {preset.sectionDecorations?.panelLeft?.src ? (
                                <Image
                                  src={preset.sectionDecorations.panelLeft.src}
                                  alt={preset.sectionDecorations.panelLeft.alt || `${preset.name} left decoration`}
                                  width={56}
                                  height={56}
                                  className="pointer-events-none absolute -left-2 -top-2 h-14 w-auto opacity-95"
                                />
                              ) : null}
                              {preset.sectionDecorations?.panelRight?.src ? (
                                <Image
                                  src={preset.sectionDecorations.panelRight.src}
                                  alt={preset.sectionDecorations.panelRight.alt || `${preset.name} right decoration`}
                                  width={56}
                                  height={56}
                                  className="pointer-events-none absolute -right-2 -top-2 h-14 w-auto opacity-95"
                                />
                              ) : null}
                              <div className="absolute inset-x-4 bottom-4 h-10 rounded-xl border border-white/10 bg-black/20" />
                              <div className="absolute inset-x-8 bottom-8 h-2 rounded-full bg-white/10" />
                            </div>

                            <p className="text-[11px] text-white/65">
                              {preset.id === "original-default"
                                ? "ลุคเดิมของหน้าแบบไม่เพิ่มกรอบหรือลายพิเศษ"
                                : preset.id === "ice-default"
                                  ? "ลุคพื้นฐานของระบบ พร้อมกรอบน้ำแข็งเดิม"
                                  : "เปลี่ยนเฉพาะกรอบเทศกาล ไม่เปลี่ยนโทนสีหลัก"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
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
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-white">รูปภาพโปรไฟล์</p>
                      <p className="text-xs text-slate-500">
                        อัปโหลดรูปโปรไฟล์และรูปปกสำหรับหน้าโดเนท
                      </p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                        <p className="mb-3 text-sm font-medium text-slate-300">
                          รูปโปรไฟล์
                        </p>
                        <div className="mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-slate-800 shadow-xl shadow-purple-500/20">
                          {settings.profile.avatarUrl ? (
                            <img
                              src={settings.profile.avatarUrl}
                              alt={settings.profile.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-6xl font-bold text-white">
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

                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                        <p className="mb-3 text-sm font-medium text-slate-300">
                          รูปปก Banner
                        </p>
                        <div
                          className="aspect-[16/6] w-full overflow-hidden rounded-2xl border border-slate-800 bg-cover bg-center shadow-lg shadow-black/20"
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
                      </div>

                    </div>

                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">ข้อมูลโปรไฟล์</p>
                        <p className="text-xs text-slate-500">
                          ตั้งชื่อ ช่องทาง และคำอธิบายที่จะแสดงบนหน้าโดเนท
                        </p>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                        <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-slate-800 shadow-xl shadow-purple-500/20">
                          {settings.profile.avatarUrl ? (
                            <img
                              src={settings.profile.avatarUrl}
                              alt={settings.profile.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-[2.25rem] font-bold text-white">
                              {settings.profile.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {settings.profile.name || "ชื่อสตรีมเมอร์"}
                          </p>
                          <p className="truncate text-sm text-slate-400">
                            {settings.profile.handle || "ลิงก์ / Username"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="ชื่อสตรีมเมอร์">
                        <GlassInput
                          value={settings.profile.name}
                          onChange={(e) => updateProfile("name", e.target.value)}
                        />
                      </Field>
                      <Field label="ลิงก์ / Username">
                        <div className="space-y-2">
                          <div className="flex overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/50 text-white focus-within:ring-2 focus-within:ring-cyan-400/70">
                            <div className="flex items-center border-r border-slate-700/80 bg-slate-900/80 px-3 text-sm text-slate-400">
                              {STREAMFLOW_DOMAIN}/
                            </div>
                            <input
                              value={settings.profile.username}
                              onChange={(e) => updateProfile("username", e.target.value)}
                              placeholder="yourname"
                              className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <p className="truncate text-slate-500">
                              ลิงก์ของคุณ: {settings.profile.handle}
                            </p>
                            <p
                              className={cx(
                                "shrink-0",
                                usernameStatus.checking
                                  ? "text-amber-300"
                                  : usernameStatus.available
                                    ? "text-emerald-300"
                                    : "text-rose-300"
                              )}
                            >
                              {usernameStatus.message}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">
                            ใช้ได้เฉพาะตัวพิมพ์เล็กภาษาอังกฤษ `a-z` และตัวเลข `0-9`
                          </p>
                        </div>
                      </Field>
                    </div>

                    <Field label="คำอธิบาย Bio" className="mt-4">
                      <GlassTextarea
                        value={settings.profile.bio}
                        maxLength={160}
                        onChange={(e) => updateProfile("bio", e.target.value)}
                      />
                      <p className="text-right text-xs text-slate-500">
                        {settings.profile.bio.length}/160
                      </p>
                    </Field>

                    <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
                  </div>

                  <div className="rounded-[28px] border border-white/15 bg-gradient-to-tl from-white/10 via-slate-900/30 to-transparent p-5 sm:p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white">โซเชียลมีเดีย</h3>
                      <p className="text-sm font-medium text-white/50">Social Media</p>
                    </div>

                    <div className="space-y-2.5">
                      {settings.socials.map((social) => (
                        <div
                          key={social.id}
                          className="rounded-2xl border border-white/10 bg-black/30 p-3"
                        >
                          <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                              <Select
                                value={social.id}
                                onValueChange={(value) => updateSocialType(social.id, value)}
                              >
                                <SelectTrigger className="rounded-full border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-cyan-300">
                                      <LinkIcon className="h-3.5 w-3.5" />
                                    </div>
                                    <SelectValue placeholder="เลือกโซเชียล" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent className="border-slate-700 bg-slate-900 text-white">
                                  {fixedSocials.map((option) => {
                                    const isTaken =
                                      option.id !== social.id &&
                                      settings.socials.some((item) => item.id === option.id);

                                    return (
                                      <SelectItem
                                        key={option.id}
                                        value={option.id}
                                        disabled={isTaken}
                                        className="text-white focus:bg-slate-800 focus:text-white"
                                      >
                                        {option.label}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            <GlassInput
                              value={social.href}
                              placeholder={socialPlaceholders[social.id] || "https://"}
                              className="rounded-full border-white/10 bg-black/40 px-4 py-2.5 placeholder:text-white/25"
                              onChange={(e) =>
                                updateSocial(social.id, "href", e.target.value)
                              }
                            />

                            <div className="flex items-center justify-end gap-1 text-white/60">
                              <button
                                type="button"
                                title="ลบ"
                                onClick={() => removeSocial(social.id)}
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-rose-500/15 hover:text-rose-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 w-full rounded-full border-dashed border-white/20 bg-transparent text-white/70 hover:border-white/40 hover:bg-white/5 hover:text-white disabled:opacity-40"
                      onClick={addSocial}
                      disabled={settings.socials.length >= fixedSocials.length}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      เพิ่มลิงก์
                    </Button>

                    <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
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
                <div className="grid gap-4 xl:grid-cols-3">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">พร้อมเพย์</p>
                        <p className="text-sm text-slate-400">เบอร์โทร, เลขบัตรประชาชน หรือเลขบัญชี</p>
                      </div>
                      <MiniSwitch
                        checked={settings.donation.channels.promptpay.enabled}
                        onCheckedChange={(value) =>
                          updateDonationChannel("promptpay", "enabled", value)
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <Field label="ประเภทพร้อมเพย์">
                        <Select
                          value={settings.donation.channels.promptpay.type}
                          onValueChange={(value) =>
                            updateDonationChannel("promptpay", "type", value)
                          }
                        >
                          <SelectTrigger className="border-slate-700 bg-slate-950/50 text-white">
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-700 bg-slate-900 text-white">
                            <SelectItem value="phone" className="text-white focus:bg-slate-800 focus:text-white">
                              เบอร์โทรศัพท์
                            </SelectItem>
                            <SelectItem value="national_id" className="text-white focus:bg-slate-800 focus:text-white">
                              เลขประจำตัวประชาชน
                            </SelectItem>
                            <SelectItem value="account" className="text-white focus:bg-slate-800 focus:text-white">
                              เลขบัญชี
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="หมายเลขพร้อมเพย์">
                        <GlassInput
                          value={settings.donation.channels.promptpay.value}
                          placeholder="กรอกข้อมูลพร้อมเพย์"
                          onChange={(e) =>
                            updateDonationChannel("promptpay", "value", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">บัญชีธนาคาร</p>
                        <p className="text-sm text-slate-400">ข้อมูลบัญชีสำหรับการโอนผ่านธนาคาร</p>
                      </div>
                      <MiniSwitch
                        checked={settings.donation.channels.bank.enabled}
                        onCheckedChange={(value) =>
                          updateDonationChannel("bank", "enabled", value)
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <Field label="ชื่อธนาคาร">
                        <GlassInput
                          value={settings.donation.channels.bank.bankName}
                          placeholder="เช่น SCB"
                          onChange={(e) =>
                            updateDonationChannel("bank", "bankName", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="ชื่อบัญชี">
                        <GlassInput
                          value={settings.donation.channels.bank.accountName}
                          placeholder="ชื่อเจ้าของบัญชี"
                          onChange={(e) =>
                            updateDonationChannel("bank", "accountName", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="เลขบัญชี">
                        <GlassInput
                          value={settings.donation.channels.bank.accountNumber}
                          placeholder="123-4-56789-0"
                          onChange={(e) =>
                            updateDonationChannel("bank", "accountNumber", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-dashed border-cyan-500/20 bg-cyan-500/5 p-5">
                    <p className="text-sm font-semibold text-cyan-200">สถานะการใช้งาน</p>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                        <span>พร้อมเพย์</span>
                        <span className={cx(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          settings.donation.channels.promptpay.enabled
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-slate-800 text-slate-400"
                        )}>
                          {settings.donation.channels.promptpay.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                        <span>บัญชีธนาคาร</span>
                        <span className={cx(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          settings.donation.channels.bank.enabled
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-slate-800 text-slate-400"
                        )}>
                          {settings.donation.channels.bank.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </span>
                      </div>
                    </div>

                    <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
                  </div>
                </div>
              </SectionCard>
              </>
              )}

              {activeTab === "filter" && (

              <>
                <SectionCard
                  id="donation-filter"
                  title="ตั้งค่าฟอร์มโดเนท"
                  description="ตั้งค่ายอดขั้นต่ำ ข้อความ และปุ่มที่จะแสดงบนฟอร์ม"
                  icon={Heart}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="หัวข้อฟอร์มโดเนท">
                      <GlassInput
                        value={settings.donation.pageTitle}
                        onChange={(e) => updateDonation("pageTitle", e.target.value)}
                      />
                    </Field>

                    <Field label="ยอดโดเนทขั้นต่ำ">
                      <GlassInput
                        type="number"
                        min="0"
                        value={settings.donation.minAmount}
                        onChange={(e) =>
                          updateDonation("minAmount", Number(e.target.value || 0))
                        }
                      />
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
                  </div>

                  <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
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

                  <SectionSaveAction
                    onSave={() => handleSaveSettings("draft")}
                    className="mt-6"
                    {...sectionSaveActionProps}
                  />
                </div>
              </SectionCard>
              </>
              )}

              {activeTab === "music" && (
              <SectionCard
                id="music"
                title="หมวดหมู่โปรไฟล์"
                description="เลือกหมวดหมู่ที่บอกว่าคุณสตรีมหรือทำคอนเทนต์เกี่ยวกับอะไร"
                icon={Users}
              >
                <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">หมวดหมู่โปรไฟล์</p>
                    <p className="text-xs text-slate-500">
                      {selectedProfileCategories.length} / {MAX_PROFILE_CATEGORIES}
                    </p>
                  </div>
                  <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    เลือกได้สูงสุด {MAX_PROFILE_CATEGORIES} หมวด
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white">ที่เลือกแล้ว</h3>
                      <p className="text-sm text-slate-500">
                        หมวดหมู่ที่จะแสดงบนโปรไฟล์ของคุณ
                      </p>
                    </div>

                    {selectedProfileCategories.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-500">
                        ยังไม่ได้เลือกหมวดหมู่โปรไฟล์
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
                              <p className="text-xs text-slate-300">หมวดหมู่ที่เลือกแล้ว</p>
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
                      <h3 className="text-xl font-semibold text-white">หมวดหมู่ที่มีให้เลือก</h3>
                      <p className="text-sm text-slate-500">
                        กดเพื่อเพิ่มหรือนำหมวดหมู่ออก
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
                              <p className="text-xs text-slate-400">หมวดหมู่โปรไฟล์</p>
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

                <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
              </SectionCard>
              )}

              {activeTab === "content" && (
              <SectionCard
                id="content"
                title="วิดีโอ / คอนเทนต์"
                description="จัดการไฮไลท์วิดีโอและโพสต์รายวัน"
                icon={Video}
              >
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">ไฮไลท์วิดีโอ</p>
                        <p className="text-xs text-slate-500">
                          วิดีโอที่จะแสดงในส่วน Highlight
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-900/60 text-slate-300"
                        onClick={addVideoHighlight}
                        disabled={settings.videos.length >= MAX_HIGHLIGHT_VIDEOS}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มวิดีโอ
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {settings.videos.map((video) => (
                        <div
                          key={video.id}
                          className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-slate-500">
                              <GripVertical className="h-4 w-4" />
                              <span className="text-sm text-slate-300">
                                {video.title || `คลิป ${video.id}`}
                              </span>
                              {video.platform ? (
                                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
                                  {video.platform}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                              <MiniSwitch
                                checked={video.enabled}
                                onCheckedChange={(value) =>
                                  updateArrayItem("videos", video.id, "enabled", value)
                                }
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white"
                                onClick={() => removeVideoHighlight(video.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <div className="space-y-3">
                              <GlassInput
                                value={video.url}
                                placeholder="วางลิงก์ YouTube หรือ TikTok"
                                onChange={(e) => updateVideoUrl(video.id, e.target.value)}
                              />
                              <p className="text-xs text-slate-500">
                                รองรับ `youtube.com`, `youtu.be` และ `tiktok.com`
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                              <p className="text-xs font-medium text-slate-300">สถานะลิงก์</p>
                              <p className="mt-2 text-sm text-white">
                                {video.url
                                  ? video.embedUrl
                                    ? video.platform === "youtube"
                                      ? "พร้อมแสดง YouTube"
                                      : "พร้อมแสดง TikTok"
                                    : "ลิงก์นี้ยังไม่รองรับ"
                                  : "ยังไม่ได้วางลิงก์"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">โพสต์รายวัน</p>
                        <p className="text-xs text-slate-500">
                          คอนเทนต์ล่าสุดที่จะโชว์บนหน้าโดเนท
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-900/60 text-slate-300"
                        onClick={addPost}
                        disabled={settings.posts.length >= MAX_CONTENT_POSTS}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มโพสต์
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {settings.posts.map((post) => (
                        <div
                          key={post.id}
                          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-500">
                              <GripVertical className="h-4 w-4" />
                              <span className="text-sm text-slate-400">
                                Post #{post.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MiniSwitch
                                checked={post.enabled}
                                onCheckedChange={(value) =>
                                  updateArrayItem("posts", post.id, "enabled", value)
                                }
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white"
                                onClick={() => removePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4 p-4">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/70">
                              <div className="flex items-center gap-3 border-b border-slate-800/80 px-4 py-3">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                                  {settings.profile.avatarUrl ? (
                                    <img
                                      src={settings.profile.avatarUrl}
                                      alt={settings.profile.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    settings.profile.name.slice(0, 1).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-white">
                                    {settings.profile.name || "ชื่อสตรีมเมอร์"}
                                  </p>
                                  <p className="text-xs text-slate-500">โพสต์ตัวอย่าง</p>
                                </div>
                              </div>

                              {post.text ? (
                                <p className="whitespace-pre-line px-4 py-3 text-sm leading-6 text-slate-200">
                                  {post.text}
                                </p>
                              ) : null}

                              <div className="flex min-h-[220px] items-center justify-center bg-slate-950/70">
                                {post.image ? (
                                  <img
                                    src={post.image}
                                    alt=""
                                    className="max-h-[420px] w-full object-contain"
                                  />
                                ) : (
                                  <div className="flex h-56 w-full items-center justify-center text-sm text-slate-500">
                                    ยังไม่มีรูปคอนเทนต์
                                  </div>
                                )}
                              </div>
                            </div>

                            <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
                              <Upload className="mr-2 h-4 w-4" />
                              อัปโหลดรูป
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePostImageUpload(post.id, e.target.files?.[0])}
                              />
                            </label>

                            <GlassTextarea
                              value={post.text}
                              placeholder="พิมพ์ข้อความคอนเทนต์ที่จะแสดงบนหน้าโดเนท"
                              onChange={(e) =>
                                updateArrayItem("posts", post.id, "text", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
                  </div>
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
                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">รูปภาพแกลเลอรี</p>
                      <p className="text-sm text-slate-400">
                        แนะนำขนาดรูป 800x800px หรือสัดส่วน 1:1
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                        {settings.gallery.length} / {MAX_GALLERY_IMAGES} รูป
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-900/60 text-slate-300 disabled:opacity-40"
                        onClick={() => galleryFileInputRef.current?.click()}
                        disabled={settings.gallery.length >= MAX_GALLERY_IMAGES}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        อัปโหลดรูป
                      </Button>
                    </div>
                  </div>

                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleGalleryUpload(e.target.files);
                      e.target.value = "";
                    }}
                  />

                  {settings.gallery.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/20 px-4 py-10 text-center">
                      <p className="text-sm font-medium text-slate-300">ยังไม่มีรูปในแกลเลอรี</p>
                      <p className="mt-1 text-xs text-slate-500">
                        เพิ่มได้สูงสุด {MAX_GALLERY_IMAGES} รูป และสามารถเปิด/ปิดแต่ละรูปได้
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {settings.gallery.map((item) => (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
                        >
                          <div
                            className="h-40 bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.url})` }}
                          />

                          <div className="space-y-3 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-white">รูปที่ {item.id}</p>
                                <p className="text-xs text-slate-500">
                                  {item.enabled ? "กำลังแสดงบนหน้าโปรไฟล์" : "ซ่อนอยู่"}
                                </p>
                              </div>
                              <MiniSwitch
                                checked={item.enabled}
                                onCheckedChange={(value) =>
                                  updateArrayItem("gallery", item.id, "enabled", value)
                                }
                              />
                            </div>

                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white"
                                onClick={() => removeGalleryImage(item.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบรูป
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
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
                          <GlassTimeInput
                            value={startTime}
                            placeholder="เวลาเริ่ม"
                            onChange={(e) =>
                              updateArrayItem(
                                "schedule",
                                item.id,
                                "time",
                                buildScheduleTimeRange(e.target.value, endTime)
                              )
                            }
                          />
                          <GlassTimeInput
                            value={endTime}
                            placeholder="เวลาจบ"
                            onChange={(e) =>
                              updateArrayItem(
                                "schedule",
                                item.id,
                                "time",
                                buildScheduleTimeRange(startTime, e.target.value)
                              )
                            }
                          />
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
                <SectionSaveAction onSave={() => handleSaveSettings("draft")} {...sectionSaveActionProps} />
              </SectionCard>
              )}

            </div>
          </div>
        </main>
      </div>

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 left-0 top-0 z-50 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-0 bg-slate-950 p-0 text-white shadow-none sm:max-w-none"
        >
          <DialogHeader className="border-b border-slate-800 bg-slate-950/95 px-5 py-4 text-left backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <DialogTitle className="text-white">Live Preview</DialogTitle>
                <DialogDescription className="mt-1 text-slate-400">
                  ดูตัวอย่างหน้าที่ผู้สนับสนุนจะเห็นแบบเต็มพื้นที่
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={cx(
                    "border-slate-700 bg-slate-900/60 text-slate-400",
                    previewViewport === "desktop" &&
                      "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                  )}
                  onClick={() => setPreviewViewport("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cx(
                    "border-slate-700 bg-slate-900/60 text-slate-400",
                    previewViewport === "tablet" &&
                      "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                  )}
                  onClick={() => setPreviewViewport("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cx(
                    "border-slate-700 bg-slate-900/60 text-slate-400",
                    previewViewport === "mobile" &&
                      "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                  )}
                  onClick={() => setPreviewViewport("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => setIsPreviewModalOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  ปิด
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(2,6,23,1))] p-0">
            <PreviewSurface viewport={previewViewport} fullScreen>
              <LivePreview settings={deferredSettings} fullBleed />
            </PreviewSurface>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const LivePreview = memo(function LivePreview({
  settings,
  optimizeForEditor = false,
  fullBleed = false,
}) {
  void optimizeForEditor;
  void fullBleed;

  return <PublicDonatePage settings={settings} />;
});

const PREVIEW_VIEWPORTS = {
  desktop: {
    label: "Desktop View",
    container: "w-full max-w-none",
    framed: "w-full max-w-[1280px]",
    minHeight: "min-h-[780px]",
    icon: Monitor,
  },
  tablet: {
    label: "Tablet View",
    container: "w-full max-w-[860px]",
    framed: "w-full max-w-[820px]",
    minHeight: "min-h-[900px]",
    icon: Tablet,
  },
  mobile: {
    label: "Mobile View",
    container: "w-full max-w-[430px]",
    framed: "w-full max-w-[390px]",
    minHeight: "min-h-[720px]",
    icon: Smartphone,
  },
};

function PreviewSurface({ children, viewport = "desktop", fullScreen = false }) {
  const activeViewport = PREVIEW_VIEWPORTS[viewport] || PREVIEW_VIEWPORTS.desktop;

  return (
    <div
      className={cx(
        "bg-slate-900/60 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-700",
        fullScreen
          ? "h-full overflow-y-auto overflow-x-auto p-3 lg:p-5"
          : "max-h-[calc(100vh-170px)] rounded-2xl border border-slate-800/80 p-2"
      )}
    >
      <div
        className={cx(
          "mx-auto bg-slate-950 transition-all",
          fullScreen
            ? "min-h-full overflow-visible rounded-none border-0 shadow-none"
            : "rounded-[28px] border border-slate-700/80 shadow-[0_30px_90px_rgba(0,0,0,0.45)]",
          fullScreen
            ? activeViewport.container
            : activeViewport.framed
        )}
      >
        <div className="border-b border-slate-800 bg-slate-950/90 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              {activeViewport.label}
            </div>
          </div>
        </div>

        <div className={cx("bg-slate-950", activeViewport.minHeight)}>
          {children}
        </div>
      </div>
    </div>
  );
}
