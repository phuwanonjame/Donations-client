"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Camera, Trash2, Check, X, Pencil, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Facebook, Instagram, Twitter, Youtube, Globe, Music } from "lucide-react";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music,
  default: Globe,
};

export default function ProfileHeaderManager({ profile, themeColors, festival }) {
  const glowColor = themeColors?.glow || "#7c3aed";
  const primaryColor = themeColors?.primary || "#7c3aed";

  // ── Banner state ───────────────────────────────────────────────────────────
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isBannerEditing, setIsBannerEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const bannerFileRef = useRef(null);

  // ── Avatar state ───────────────────────────────────────────────────────────
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || profile.avatarUrl || null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const avatarFileRef = useRef(null);

  // ── Bio state ──────────────────────────────────────────────────────────────
  const [bio, setBio] = useState(profile.bio || "");
  const [bioInput, setBioInput] = useState(bio);
  const [isBioEditing, setIsBioEditing] = useState(false);

  // ── Banner handlers ────────────────────────────────────────────────────────
  const handleBannerPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    const url = URL.createObjectURL(file);
    setBannerPreview(url);
    setIsBannerEditing(true);
    setShowDropdown(false);
    e.target.value = "";
  };

  const handleBannerSave = () => {
    if (bannerPreview) {
      if (bannerUrl?.startsWith("blob:")) URL.revokeObjectURL(bannerUrl);
      setBannerUrl(bannerPreview);
      setBannerPreview(null);
    }
    setIsBannerEditing(false);
    setShowDropdown(false);
    toast.success("บันทึกภาพปกแล้ว!");
  };

  const handleBannerCancel = () => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(null);
    setIsBannerEditing(false);
    setShowDropdown(false);
  };

  const handleBannerDelete = () => {
    if (bannerUrl?.startsWith("blob:")) URL.revokeObjectURL(bannerUrl);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerUrl(null);
    setBannerPreview(null);
    setIsBannerEditing(false);
    setShowDropdown(false);
    toast.success("ลบภาพปกแล้ว");
  };

  const displayBanner = bannerPreview || bannerUrl;

  // ── Avatar handlers ────────────────────────────────────────────────────────
  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setIsAvatarEditing(true);
    e.target.value = "";
  };

  const handleAvatarSave = () => {
    if (avatarPreview) {
      if (avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
      setAvatarUrl(avatarPreview);
      setAvatarPreview(null);
    }
    setIsAvatarEditing(false);
    toast.success("บันทึกรูปโปรไฟล์แล้ว!");
  };

  const handleAvatarCancel = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setIsAvatarEditing(false);
  };

  const handleAvatarDelete = () => {
    if (avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarUrl(null);
    setAvatarPreview(null);
    setIsAvatarEditing(false);
    toast.success("ลบรูปโปรไฟล์แล้ว");
  };

  const displayAvatar = avatarPreview || avatarUrl;

  // ── Bio handlers ───────────────────────────────────────────────────────────
  const handleBioSave = () => {
    setBio(bioInput.trim());
    setIsBioEditing(false);
    toast.success("บันทึก bio แล้ว!");
  };

  const handleBioCancel = () => {
    setBioInput(bio);
    setIsBioEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-4"
    >
      {/* ── Banner ── */}
      {/* hidden file input — อยู่นอก banner div เพื่อไม่ถูก overflow-hidden ตัด */}
      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerPick} />
      <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />

      <div className="relative h-48 sm:h-64 rounded-2xl" onClick={() => showDropdown && setShowDropdown(false)}>
        {/* Image / gradient bg — overflow-hidden แยกไว้ใน div ลูก */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {(bannerPreview || bannerUrl) ? (
            <img
              src={bannerPreview || bannerUrl}
              alt="banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primaryColor}40, ${glowColor}20, ${primaryColor}40)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>

        {/* Festival badge */}
        {festival && festival.id !== "default" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md z-10"
            style={{ background: `${primaryColor}80`, border: `1px solid ${primaryColor}60` }}
          >
            <span>{festival.emoji}</span>
            <span>{festival.nameLocal}</span>
          </motion.div>
        )}

        {/* Preview badge + Save/Cancel */}
        {isBannerEditing && (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/70 font-medium">
              ดูตัวอย่าง
            </span>
            <button
              onClick={handleBannerCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/80 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              ยกเลิก
            </button>
            <button
              onClick={handleBannerSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all"
              style={{ background: "rgb(186,230,253)", color: "#0c1a2e" }}
            >
              <Check className="w-3.5 h-3.5" />
              บันทึก
            </button>
          </div>
        )}

        {/* Dropdown button — แสดงตลอด ที่มุมขวาล่าง */}
        {!isBannerEditing && (
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/15 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              {bannerUrl ? "แก้ไขภาพปก" : "เพิ่มภาพปก"}
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full right-0 mb-2 w-44 rounded-xl overflow-hidden border border-white/10 backdrop-blur-xl"
                  style={{ background: "rgba(10,15,25,0.92)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => bannerFileRef.current?.click()}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/80 hover:bg-white/10 transition-all text-left"
                  >
                    <ImagePlus className="w-3.5 h-3.5 flex-shrink-0" />
                    {bannerUrl ? "เปลี่ยนภาพปก" : "Browse ภาพปก"}
                  </button>
                  {bannerUrl && (
                    <>
                      <div className="h-px bg-white/8 mx-3" />
                      <button
                        onClick={handleBannerDelete}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-all text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                        ลบภาพปก
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Avatar + Info ── */}
      <div className="relative sm:-mt-10 px-4 sm:px-6 flex flex-col sm:flex-row gap-4 items-center sm:items-end">
        {/* Avatar */}
        <div className="relative">
          <div
            className="group relative w-28 overflow-hidden rounded-2xl border-4"
            style={{ borderColor: primaryColor, boxShadow: `0 0 25px ${glowColor}50` }}
          >
            <div className="h-28 w-28 overflow-hidden">
              {displayAvatar ? (
                <img src={displayAvatar} alt={profile.display_name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${glowColor})` }}
                >
                  {profile.name?.[0] || "?"}
                </div>
              )}
            </div>

            {!isAvatarEditing ? (
              <button
                onClick={() => avatarFileRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 px-3 text-white">
                <span className="text-[10px] font-medium tracking-[0.16em] text-white/70">
                  PREVIEW
                </span>
                <div className="flex w-full gap-2">
                  <button
                    onClick={handleAvatarCancel}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-[11px] text-white/80 backdrop-blur-sm transition-all hover:bg-black/70"
                  >
                    <X className="w-3.5 h-3.5" />
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleAvatarSave}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition-all"
                    style={{ background: "rgb(186,230,253)", color: "#0c1a2e" }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    บันทึก
                  </button>
                </div>
                {displayAvatar && (
                  <button
                    onClick={handleAvatarDelete}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[11px] font-medium text-red-200 transition-all hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ลบรูปโปรไฟล์
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${profile.is_online ? "bg-green-500" : "bg-gray-500"}`}>
            {profile.is_online ? <Wifi className="w-3 h-3 text-white" /> : <WifiOff className="w-3 h-3 text-white" />}
          </div>
        </div>

        {/* Name + handle + status */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
          <p className="text-white/50 text-sm font-mono">@{profile.handle}</p>
          <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${profile.is_online ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${profile.is_online ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
              {profile.is_online ? "กำลังสตรีมอยู่" : "ออฟไลน์"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Social links ── */}
      <div className="px-4 sm:px-6 flex flex-wrap gap-2">
        {profile.socials?.map((s) => {
          const Icon = socialIcons[s.icon] || socialIcons.default;
          return (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="text-white/80 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </a>
          );
        })}
      </div>

      {/* ── Bio ── */}
      <div className="px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {isBioEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-2"
            >
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="เขียน bio ของคุณที่นี่..."
                rows={3}
                maxLength={200}
                autoFocus
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-sky-300/40 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/30">{bioInput.length}/200</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleBioCancel}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleBioSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: "rgb(186,230,253)", color: "#0c1a2e" }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    บันทึก
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group flex items-start gap-2"
            >
              {bio ? (
                <p className="text-white/70 text-sm leading-relaxed flex-1">{bio}</p>
              ) : (
                <p className="text-white/30 text-sm italic flex-1">ยังไม่มี bio — กด ✏️ เพื่อเพิ่ม</p>
              )}
              <button
                onClick={() => { setBioInput(bio); setIsBioEditing(true); }}
                className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
