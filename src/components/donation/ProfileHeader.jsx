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
    <div className="flex flex-wrap gap-5 items-end -mt-16 md:-mt-20 mb-8 relative z-10">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="relative group"
      >
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl ring-4 ring-background overflow-hidden flex-shrink-0 glow-primary">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white text-3xl font-heading font-bold">
                {initials}
              </span>
            </div>
          )}
        </div>
        {/* Online indicator */}
        {profile.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-background flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
        )}
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-w-[200px] pb-1"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight text-glow">
          {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-body">
          {profile.handle}
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {profile.isOnline ? "🟢 LIVE NOW" : "ออฟไลน์"}
          <RefreshCw className="w-3 h-3 ml-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity" />
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.socials?.map((s) => {
            const Icon = socialIcons[s.icon] || socialIcons.default;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border bg-card hover:border-primary/50 hover:text-primary px-3 py-1.5 rounded-full transition-all duration-300 hover:glow-primary"
              >
                <Icon className="w-3 h-3" />
                {s.label}
              </a>
            );
          })}
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
            {profile.bio}
          </p>
        )}
      </motion.div>
    </div>
  );
}