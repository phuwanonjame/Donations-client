import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Globe, Music, RefreshCw } from "lucide-react";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music,
  default: Globe,
};

export default function ProfileHeader({ profile }) {
  const initials = profile.name?.slice(0, 2) || "??";

  return (
    <div className="flex flex-wrap gap-6 items-end mb-10 relative z-10">
      
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
        className="relative group"
      >
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl ring-[5px] ring-background overflow-hidden flex-shrink-0 glow-primary transition-transform duration-300 group-hover:scale-105">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white text-4xl font-heading font-bold">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Online */}
        {profile.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-[3px] border-background flex items-center justify-center shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          </div>
        )}
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-w-[220px] pb-1"
      >
        {/* Name */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight tracking-wide text-glow">
          {profile.name}
        </h1>

        {/* Handle */}
        <p className="text-base text-muted-foreground mt-1 font-body">
          {profile.handle}
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 mt-3 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {profile.isOnline ? "🟢 LIVE NOW" : "ออฟไลน์"}
          <RefreshCw className="w-3.5 h-3.5 ml-1 opacity-60 cursor-pointer hover:opacity-100 transition" />
        </div>

        {/* Social */}
        <div className="flex flex-wrap gap-2.5 mt-4">
          {profile.socials?.map((s) => {
            const Icon = socialIcons[s.icon] || socialIcons.default;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground border border-border bg-card hover:border-primary/50 hover:text-primary px-3.5 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:glow-primary"
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </a>
            );
          })}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-base text-muted-foreground/90 max-w-lg leading-relaxed">
            {profile.bio}
          </p>
        )}
      </motion.div>
    </div>
  );
}