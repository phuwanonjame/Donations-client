"use client";

import { useRef, useState } from "react";
import {
  CalendarDays,
  Camera,
  Columns2,
  GripVertical,
  Megaphone,
  Music,
  Palette,
  Settings2,
  User,
} from "lucide-react";

import ProductPromo from "@/components/donation/view/ProductPromo";
import RecentDonations from "@/components/donation/view/RecentDonations";
import DonationForm from "@/components/donation/view/DonationForm";
import DailyContentManager from "@/components/donation/edit/DailyContentManager";
import MusicManager from "@/components/donation/edit/MusicManager";
import PhotoGalleryManager from "@/components/donation/edit/PhotoGalleryManager";
import StreamScheduleManager from "@/components/donation/edit/StreamScheduleManager";
import VideoHighlightsManager from "@/components/donation/edit/VedioHightlightsManager";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PROFILE = {
  name: "x86",
  handle: "ezdn.app/x86",
  bio: "สตรีมเมอร์สาย Competitive | เล่น Valorant & LoL | สตรีมทุกวัน 20:00+",
  avatarUrl: "",
  isOnline: true,
  banner_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  socials: [
    { label: "Facebook", href: "https://facebook.com/test", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/test", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com/test", icon: "youtube" },
    { label: "TikTok", href: "https://tiktok.com/test", icon: "tiktok" },
  ],
};

const tabItems = [
  { id: "profile", title: "โปรไฟล์", icon: User },
  { id: "appearance", title: "ธีม", icon: Palette },
  { id: "layout", title: "จัด layout", icon: Columns2 },
  { id: "media", title: "เสียง/เพลง", icon: Music },
  { id: "promotion", title: "โปรโมท", icon: Megaphone },
  { id: "schedule", title: "ตาราง/คอนเทนต์", icon: CalendarDays },
  { id: "settings", title: "ตั้งค่า", icon: Settings2 },
];

const initialEnabledState = {
  music: true,
  gallery: true,
  video_highlights: true,
  product_promo: true,
  recent_donations: true,
  daily_content: true,
  stream_schedule: true,
};

const themeOptions = [
  {
    id: "festival",
    title: "เทศกาล",
    description: "ใช้โทนสีอบอุ่น คอนเฟตติ และเส้นโค้งที่ดูสนุกขึ้น",
    palette: "from-amber-400 via-orange-400 to-rose-400",
  },
  {
    id: "space",
    title: "อวกาศ",
    description: "โทนมืดลึก มีวงโคจรและ glow ที่ดู futuristic",
    palette: "from-indigo-500 via-violet-500 to-sky-400",
  },
  {
    id: "gaming",
    title: "เกมมิ่ง",
    description: "เส้นคม สี neon และเฟรมแบบ HUD สำหรับสายสตรีมแข่งขัน",
    palette: "from-cyan-400 via-blue-500 to-emerald-400",
  },
];

const layoutTemplates = [
  {
    id: "hero-stack",
    title: "Hero Stack",
    description: "หน้าปกใหญ่ด้านบน โปรไฟล์ซ้อนด้านล่าง และคอนเทนต์เรียงเป็น stack",
  },
  {
    id: "split-showcase",
    title: "Split Showcase",
    description: "แบ่งพื้นที่หน้าเป็นสองฝั่ง ให้โปรไฟล์กับคอนเทนต์เด่นคนละด้าน",
  },
  {
    id: "compact-card",
    title: "Compact Card",
    description: "เน้นกล่องคอนเทนต์กระชับ เหมาะกับหน้าที่อยากอ่านง่ายและเลื่อนไว",
  },
];

const layoutModules = [
  { id: "music", title: "เพลงและเสียง", description: "โมดูลเพลงประกอบ" },
  { id: "gallery", title: "แกลเลอรีรูปภาพ", description: "ภาพกิจกรรมและคาแรกเตอร์" },
  { id: "video_highlights", title: "วิดีโอไฮไลต์", description: "คลิปเด่นของช่อง" },
  { id: "product_promo", title: "โปรโมท", description: "สินค้า แคมเปญ หรือบล็อกโปรโมท" },
  { id: "recent_donations", title: "โดเนทล่าสุด", description: "กิจกรรมโดเนทล่าสุดของผู้ชม" },
  { id: "daily_content", title: "คอนเทนต์ประจำวัน", description: "ประกาศหรือเนื้อหารายวัน" },
  { id: "stream_schedule", title: "ตารางสตรีม", description: "วันและเวลาสตรีม" },
];

function SettingBlock({ title, description, enabled, onToggle, children }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
            {enabled ? "On" : "Off"}
          </span>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-cyan-400 data-[state=unchecked]:bg-white/15"
          />
        </div>
      </div>

      {enabled ? (
        children
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 px-5 py-10 text-center">
          <p className="text-base font-medium text-white">ส่วนนี้ถูกปิดการใช้งานอยู่</p>
          <p className="mt-2 text-sm text-white/55">
            เปิดสวิตช์ด้านขวาเพื่อกลับมาแก้ไขและแสดงโมดูลนี้อีกครั้ง
          </p>
        </div>
      )}
    </section>
  );
}

function UploadCard({ title, description, preview, onPick, shape = "rect" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>

      <button
        type="button"
        onClick={onPick}
        className={`group relative mt-4 overflow-hidden border border-dashed border-white/15 bg-white/[0.04] transition hover:border-cyan-300/35 hover:bg-white/[0.06] ${
          shape === "circle"
            ? "h-32 w-32 rounded-full"
            : "flex h-40 w-full items-center justify-center rounded-2xl"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt={title}
            className={`h-full w-full object-cover ${shape === "circle" ? "rounded-full" : ""}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-white/55">
            <Camera className="h-5 w-5" />
            <span className="text-xs">เลือกภาพ</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </button>
    </div>
  );
}

function SelectCard({ title, description, active, onClick, palette }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-cyan-300/35 bg-white/[0.08] shadow-lg shadow-cyan-950/20"
          : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      {palette && <div className={`mb-4 h-20 rounded-xl bg-gradient-to-r ${palette}`} />}
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
    </button>
  );
}

function LayoutDropZone({ title, description, children, isOver }) {
  return (
    <div
      className={`rounded-[2rem] border p-4 transition-all duration-200 md:p-5 ${
        isOver
          ? "border-cyan-300/35 bg-cyan-400/10"
          : "border-white/10 bg-black/10"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function LayoutCard({ module, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(module.id)}
      onDragEnd={onDragEnd}
      className="flex cursor-grab items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="mt-0.5 text-white/35">
        <GripVertical className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{module.title}</p>
        <p className="mt-1 text-xs leading-5 text-white/55">{module.description}</p>
      </div>
    </div>
  );
}

export default function DonateProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [enabledMap, setEnabledMap] = useState(initialEnabledState);
  const [themeSettings, setThemeSettings] = useState({
    themeStyle: "gaming",
    layoutTemplate: "hero-stack",
  });
  const [profileSettings, setProfileSettings] = useState({
    displayName: PROFILE.name,
    avatarPreview: PROFILE.avatarUrl || null,
    bannerPreview: PROFILE.banner_url || null,
    wallpaperPreview: null,
    profileText: PROFILE.bio,
    socials: {
      facebook: PROFILE.socials.find((item) => item.icon === "facebook")?.href || "",
      instagram: PROFILE.socials.find((item) => item.icon === "instagram")?.href || "",
      tiktok: PROFILE.socials.find((item) => item.icon === "tiktok")?.href || "",
      youtube: PROFILE.socials.find((item) => item.icon === "youtube")?.href || "",
    },
  });
  const [donateSettings, setDonateSettings] = useState({
    minimumDonation: "20",
    thankYouMessage: "ขอบคุณมากที่สนับสนุนสตรีมของเรา",
    profanityFilter: true,
    isPublished: true,
    customProfanityWords: ["คำหยาบตัวอย่าง"],
  });
  const [profanityDraft, setProfanityDraft] = useState("");
  const [layoutColumns, setLayoutColumns] = useState({
    left: ["music", "video_highlights", "daily_content"],
    right: ["gallery", "stream_schedule", "product_promo", "recent_donations"],
  });
  const [draggingModuleId, setDraggingModuleId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const wallpaperInputRef = useRef(null);

  const setEnabled = (key, checked) => {
    setEnabledMap((prev) => ({
      ...prev,
      [key]: checked,
    }));

    if (!checked) {
      return;
    }

    setLayoutColumns((prev) => {
      const alreadyPlaced = prev.left.includes(key) || prev.right.includes(key);

      if (alreadyPlaced) {
        return prev;
      }

      return {
        left: prev.left,
        right: [...prev.right, key],
      };
    });
  };

  const updateDonateSetting = (key, value) => {
    setDonateSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateProfileSettings = (key, value) => {
    setProfileSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSocialLink = (key, value) => {
    setProfileSettings((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [key]: value,
      },
    }));
  };

  const handleImagePick = (event, key) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    updateProfileSettings(key, URL.createObjectURL(file));
    event.target.value = "";
  };

  const addProfanityWord = () => {
    const nextWord = profanityDraft.trim();
    if (!nextWord) {
      return;
    }

    if (donateSettings.customProfanityWords.includes(nextWord)) {
      setProfanityDraft("");
      return;
    }

    updateDonateSetting("customProfanityWords", [
      ...donateSettings.customProfanityWords,
      nextWord,
    ]);
    setProfanityDraft("");
  };

  const removeProfanityWord = (wordToRemove) => {
    updateDonateSetting(
      "customProfanityWords",
      donateSettings.customProfanityWords.filter((word) => word !== wordToRemove)
    );
  };

  const moveModuleToColumn = (moduleId, nextColumn) => {
    if (!moduleId) {
      return;
    }

    setLayoutColumns((prev) => {
      const left = prev.left.filter((id) => id !== moduleId);
      const right = prev.right.filter((id) => id !== moduleId);

      if (nextColumn === "left") {
        return { left: [...left, moduleId], right };
      }

      return { left, right: [...right, moduleId] };
    });
  };

  const getColumnModules = (column) =>
    layoutColumns[column]
      .map((id) => layoutModules.find((module) => module.id === id))
      .filter((module) => module && enabledMap[module.id])
      .filter(Boolean);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#06101d_0%,#030712_100%)]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
          <TabsList className="inline-flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-white/[0.06] p-1 text-white/60">
            {tabItems.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="profile" className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">โปรไฟล์ของหน้ารับเงิน</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  จัดการรูปและข้อมูลหลักของหน้า donate แบบแยกเป็นหัวข้อชัด ๆ
                </p>
              </div>
              <div className="space-y-5">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImagePick(event, "avatarPreview")}
                />
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImagePick(event, "bannerPreview")}
                />
                <input
                  ref={wallpaperInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImagePick(event, "wallpaperPreview")}
                />

                <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                  <UploadCard
                    title="1. เปลี่ยนรูปโปรไฟล์"
                    description="รูปวงกลมหลักที่จะแสดงบนหน้า donate"
                    preview={profileSettings.avatarPreview}
                    onPick={() => avatarInputRef.current?.click()}
                    shape="circle"
                  />
                  <UploadCard
                    title="2. เปลี่ยนรูปปก"
                    description="ภาพส่วนบนของหน้า ใช้กำหนดอารมณ์และภาพจำของช่อง"
                    preview={profileSettings.bannerPreview}
                    onPick={() => bannerInputRef.current?.click()}
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm font-medium text-white">3. ชื่อที่แสดง</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    ชื่อนี้จะใช้แสดงเป็นชื่อหลักบนหน้ารับเงินของคุณ
                  </p>
                  <div className="mt-3 max-w-xl">
                    <Input
                      value={profileSettings.displayName}
                      onChange={(event) => updateProfileSettings("displayName", event.target.value)}
                      placeholder="เช่น x86 หรือชื่อครีเอเตอร์ของคุณ"
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>

                <UploadCard
                  title="4. ภาพพื้นหลัง"
                  description="ภาพพื้นหลังของทั้งหน้ารับเงิน สามารถใช้คนละภาพกับรูปปกได้"
                  preview={profileSettings.wallpaperPreview}
                  onPick={() => wallpaperInputRef.current?.click()}
                />

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm font-medium text-white">5. ข้อความโปรไฟล์</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    ข้อความแนะนำตัวหรือคำโปรยสั้น ๆ ที่อยากให้คนดูเห็นก่อนโดเนท
                  </p>
                  <textarea
                    value={profileSettings.profileText}
                    onChange={(event) => updateProfileSettings("profileText", event.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="เช่น สตรีมเมอร์สาย Competitive | เล่นทุกวัน 20:00+"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm font-medium text-white">6. โซเชียลมีเดีย</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    แปะลิงก์สำหรับ Facebook, Instagram, TikTok และ YouTube ของคุณ
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">Facebook</label>
                      <Input
                        value={profileSettings.socials.facebook}
                        onChange={(event) => updateSocialLink("facebook", event.target.value)}
                        placeholder="https://facebook.com/yourpage"
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">Instagram</label>
                      <Input
                        value={profileSettings.socials.instagram}
                        onChange={(event) => updateSocialLink("instagram", event.target.value)}
                        placeholder="https://instagram.com/yourpage"
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">TikTok</label>
                      <Input
                        value={profileSettings.socials.tiktok}
                        onChange={(event) => updateSocialLink("tiktok", event.target.value)}
                        placeholder="https://tiktok.com/@yourpage"
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/60">YouTube</label>
                      <Input
                        value={profileSettings.socials.youtube}
                        onChange={(event) => updateSocialLink("youtube", event.target.value)}
                        placeholder="https://youtube.com/@yourchannel"
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">แนวธีมของหน้า</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  เลือกอารมณ์ของหน้ารับเงิน เช่น เทศกาล อวกาศ หรือเกมมิ่ง เพื่อกำหนดโทนของกรอบและองค์ประกอบโดยรวม
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {themeOptions.map((theme) => (
                  <SelectCard
                    key={theme.id}
                    title={theme.title}
                    description={theme.description}
                    palette={theme.palette}
                    active={themeSettings.themeStyle === theme.id}
                    onClick={() =>
                      setThemeSettings((prev) => ({
                        ...prev,
                        themeStyle: theme.id,
                      }))
                    }
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">เทมเพลต layout</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  เลือกรูปแบบการจัดวางหน้าปก ภาพโปรไฟล์ และบล็อกคอนเทนต์ เพื่อให้หน้า donate เหมาะกับสไตล์ช่องของคุณ
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {layoutTemplates.map((layout) => (
                  <SelectCard
                    key={layout.id}
                    title={layout.title}
                    description={layout.description}
                    active={themeSettings.layoutTemplate === layout.id}
                    onClick={() =>
                      setThemeSettings((prev) => ({
                        ...prev,
                        layoutTemplate: layout.id,
                      }))
                    }
                  />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="layout" className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">จัด layout ของหน้า donate</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  ลากวางโมดูลที่เปิดใช้งานไปซ้ายหรือขวาได้ตามต้องการ โดยฟอร์มโดเนทจะถูกล็อกไว้ที่คอลัมน์ซ้ายตำแหน่งแรกเสมอ
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverColumn("left");
                  }}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={() => {
                    moveModuleToColumn(draggingModuleId, "left");
                    setDraggingModuleId(null);
                    setDragOverColumn(null);
                  }}
                >
                  <LayoutDropZone
                    title="คอลัมน์ซ้าย"
                    description="คอลัมน์นี้จะมี DonationForm ล็อกไว้เป็นบล็อกแรกสุด"
                    isOver={dragOverColumn === "left"}
                  >
                    <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3">
                      <p className="text-sm font-semibold text-white">DonationForm</p>
                      <p className="mt-1 text-xs leading-5 text-white/60">
                        ฟอร์มโดเนทหลักของหน้า ถูกล็อกไว้ตำแหน่งแรกทางซ้าย
                      </p>
                    </div>

                    {getColumnModules("left").map((module) => (
                      <LayoutCard
                        key={module.id}
                        module={module}
                        onDragStart={setDraggingModuleId}
                        onDragEnd={() => {
                          setDraggingModuleId(null);
                          setDragOverColumn(null);
                        }}
                      />
                    ))}
                  </LayoutDropZone>
                </div>

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverColumn("right");
                  }}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={() => {
                    moveModuleToColumn(draggingModuleId, "right");
                    setDraggingModuleId(null);
                    setDragOverColumn(null);
                  }}
                >
                  <LayoutDropZone
                    title="คอลัมน์ขวา"
                    description="เหมาะสำหรับวางโมดูลรองหรือ social proof ที่อยากให้ช่วยเสริมหน้า"
                    isOver={dragOverColumn === "right"}
                  >
                    {getColumnModules("right").map((module) => (
                      <LayoutCard
                        key={module.id}
                        module={module}
                        onDragStart={setDraggingModuleId}
                        onDragEnd={() => {
                          setDraggingModuleId(null);
                          setDragOverColumn(null);
                        }}
                      />
                    ))}
                  </LayoutDropZone>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="media" className="space-y-5">
            <SettingBlock
              title="เพลงและเสียงประกอบ"
              description="ใช้ส่วนนี้สำหรับเปิดปิดเพลงประกอบของหน้า donate และจัดการรายการเพลง"
              enabled={enabledMap.music}
              onToggle={(checked) => setEnabled("music", checked)}
            >
              <MusicManager />
            </SettingBlock>

            <SettingBlock
              title="แกลเลอรีรูปภาพ"
              description="เปิดใช้แกลเลอรีเพื่อเพิ่มภาพกิจกรรมหรือภาพคาแรกเตอร์ของช่อง"
              enabled={enabledMap.gallery}
              onToggle={(checked) => setEnabled("gallery", checked)}
            >
              <PhotoGalleryManager />
            </SettingBlock>

            <SettingBlock
              title="วิดีโอไฮไลต์"
              description="เลือกว่าจะให้หน้ารับเงินมีส่วนโชว์คลิปเด่นหรือไม่"
              enabled={enabledMap.video_highlights}
              onToggle={(checked) => setEnabled("video_highlights", checked)}
            >
              <VideoHighlightsManager />
            </SettingBlock>
          </TabsContent>

          <TabsContent value="promotion" className="space-y-5">
            <SettingBlock
              title="คอนเทนต์ประจำวัน"
              description="ใช้สำหรับเปิดปิดประกาศ รายการ หรือหัวข้อประจำวันที่อยากให้คนดูเห็นบนหน้ารับเงิน"
              enabled={enabledMap.daily_content}
              onToggle={(checked) => setEnabled("daily_content", checked)}
            >
              <DailyContentManager />
            </SettingBlock>

            <SettingBlock
              title="บล็อกโปรโมทสินค้า/แคมเปญ"
              description="ใช้สำหรับเปิดปิดส่วนโปรโมทสินค้า กิจกรรม หรือสิ่งที่อยากดันบนหน้า donate"
              enabled={enabledMap.product_promo}
              onToggle={(checked) => setEnabled("product_promo", checked)}
            >
              <ProductPromo />
            </SettingBlock>

            <SettingBlock
              title="โดเนทล่าสุด"
              description="เลือกว่าจะแสดงกิจกรรมโดเนทล่าสุดให้คนดูเห็นบนหน้าหรือไม่"
              enabled={enabledMap.recent_donations}
              onToggle={(checked) => setEnabled("recent_donations", checked)}
            >
              <RecentDonations />
            </SettingBlock>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-5">
            <SettingBlock
              title="ตารางสตรีม"
              description="ใช้สำหรับโชว์วันและเวลาสตรีมให้คนดูวางแผนกลับมาดูได้ง่ายขึ้น"
              enabled={enabledMap.stream_schedule}
              onToggle={(checked) => setEnabled("stream_schedule", checked)}
            >
              <StreamScheduleManager />
            </SettingBlock>
          </TabsContent>

          <TabsContent value="settings" className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">ตั้งค่าหน้ารับเงิน</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  กำหนดเงื่อนไขพื้นฐานของการโดเนท ข้อความหลังชำระเงิน และสถานะการเผยแพร่หน้า
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm font-medium text-white">1. จำนวนโดเนทขั้นต่ำ</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    กำหนดยอดขั้นต่ำที่ผู้ชมต้องกรอกก่อนจะส่งโดเนทได้
                  </p>
                  <div className="mt-3 max-w-xs">
                    <Input
                      type="number"
                      min="1"
                      value={donateSettings.minimumDonation}
                      onChange={(e) => updateDonateSetting("minimumDonation", e.target.value)}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-sm font-medium text-white">
                    2. ข้อความขอบคุณ
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    ข้อความนี้จะแสดงหลังจากคนโดเนทเสร็จ
                  </p>
                  <textarea
                    value={donateSettings.thankYouMessage}
                    onChange={(e) => updateDonateSetting("thankYouMessage", e.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                    placeholder="ขอบคุณที่สนับสนุนเรา"
                  />
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium text-white">3. กรองคำหยาบ</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      เปิดเพื่อช่วยคัดกรองข้อความที่ไม่เหมาะสมก่อนแสดงบนหน้าโดเนท
                    </p>
                    {donateSettings.profanityFilter && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                          เพิ่มคำหยาบเพิ่มเติม
                        </p>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <Input
                            value={profanityDraft}
                            onChange={(e) => setProfanityDraft(e.target.value)}
                            placeholder="เช่น คำที่อยากบล็อกเพิ่ม"
                            className="border-white/10 bg-white/5 text-white"
                          />
                          <button
                            type="button"
                            onClick={addProfanityWord}
                            className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:brightness-110"
                          >
                            เพิ่มคำ
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {donateSettings.customProfanityWords.map((word) => (
                            <button
                              key={word}
                              type="button"
                              onClick={() => removeProfanityWord(word)}
                              className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white transition hover:bg-white/14"
                            >
                              {word} x
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={donateSettings.profanityFilter}
                    onCheckedChange={(checked) => updateDonateSetting("profanityFilter", checked)}
                    className="data-[state=checked]:bg-cyan-400 data-[state=unchecked]:bg-white/15"
                  />
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div>
                    <p className="text-sm font-medium text-white">4. เปิดเผยแพร่หน้าโดเนท</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      เปิดให้คนเข้าชมหน้าโดเนท
                    </p>
                  </div>
                  <Switch
                    checked={donateSettings.isPublished}
                    onCheckedChange={(checked) => updateDonateSetting("isPublished", checked)}
                    className="data-[state=checked]:bg-cyan-400 data-[state=unchecked]:bg-white/15"
                  />
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
