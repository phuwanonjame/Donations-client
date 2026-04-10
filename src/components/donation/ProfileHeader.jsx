import { motion } from "framer-motion";
import { Wifi, WifiOff, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Music,
} from "lucide-react";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music,
  default: Globe,
};

export default function ProfileHeader({ profile, themeColors, festival }) {
  const glowColor = themeColors?.glow || "#7c3aed";
  const primaryColor = themeColors?.primary || "#7c3aed";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("คัดลอกลิงก์แล้ว!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-4"
    >
      {/* Banner */}
      <div className="relative h-48 sm:h-80 sm:block hidden rounded-2xl overflow-hidden">
        {profile.banner_url ? (
          <img
            src={profile.banner_url}
            alt="banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}40, ${glowColor}20, ${primaryColor}40)`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Festival */}
        {festival && festival.id !== "default" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md"
            style={{
              background: `${primaryColor}80`,
              border: `1px solid ${primaryColor}60`,
            }}
          >
            <span>{festival.emoji}</span>
            <span>{festival.nameLocal}</span>
          </motion.div>
        )}
      </div>

      {/* Main Info */}
      <div className="relative sm:-mt-10 px-4 sm:px-6 flex flex-col sm:flex-row gap-4 items-center sm:items-end">
        {/* Avatar */}
        <div className="relative">
          <div
            className="w-28 h-28 rounded-2xl overflow-hidden border-4"
            style={{
              borderColor: primaryColor,
              boxShadow: `0 0 25px ${glowColor}50`,
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${glowColor})`,
                }}
              >
                {profile.name?.[0] || "?"}
              </div>
            )}
          </div>

          {/* Status */}
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${
              profile.is_online ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            {profile.is_online ? (
              <Wifi className="w-3 h-3 text-white" />
            ) : (
              <WifiOff className="w-3 h-3 text-white" />
            )}
          </div>
        </div>

        {/* Text Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {profile.name}
          </h1>

          <p className="text-white/50 text-sm font-mono">@{profile.handle}</p>

          {/* Status */}
          <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                profile.is_online
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  profile.is_online
                    ? "bg-green-400 animate-pulse"
                    : "bg-gray-500"
                }`}
              />
              {profile.is_online ? "กำลังสตรีมอยู่" : "ออฟไลน์"}
            </span>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="ml-4 px-4 sm:px-6 flex flex-wrap gap-2">
        {profile.socials?.map((s) => {
          const Icon = socialIcons[s.icon] || socialIcons.default;
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-white/80 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition"
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </a>
          );
        })}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="px-4 sm:px-6 text-white/80 text-sm max-w-2xl">
        <p className="px-4 sm:px-6 text-white/60 text-sm max-w-2xl">
          {profile.bio}
        </p>
        </div>
      )}
    </motion.div>
  );
}
