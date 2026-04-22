import { motion } from "framer-motion";

const SOCIAL_ICONS = {
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02..." />
    </svg>
  ),
};

export default function ProfileHeader2({ profile }) {
  return (
    <div className="relative mb-8 flex flex-col items-center
      bg-white/5 backdrop-blur-xl border border-white/10
      rounded-3xl px-6 py-8 shadow-2xl max-w-xl w-full mx-auto">

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-[3px] shadow-2xl shadow-pink-500/30">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl font-bold font-kanit text-primary">
                {profile.name?.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Online */}
        {profile.isOnline && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-[3px] border-card">
            <div className="w-full h-full rounded-full bg-green-400 animate-ping opacity-50" />
          </div>
        )}
      </motion.div>

      {/* Name */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <h1 className="text-3xl font-bold font-kanit text-white">
          {profile.name}
        </h1>

        <p className="text-base text-white/70 font-inter mt-1">
          {profile.handle}
        </p>

        {profile.isOnline && (
          <span className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            กำลังไลฟ์อยู่
          </span>
        )}
      </motion.div>

      {/* Bio */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-center text-base text-white/80 max-w-lg px-6 font-kanit leading-relaxed"
      >
        {profile.bio}
      </motion.p>

      {/* Social */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 mt-5"
      >
        {profile.socials?.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-muted hover:bg-primary/20 hover:text-primary flex items-center justify-center text-muted-foreground transition-all duration-300 border border-border hover:border-primary/40 hover:scale-110"
          >
            {SOCIAL_ICONS[s.icon] || s.label.charAt(0)}
          </a>
        ))}
      </motion.div>
    </div>
  );
}