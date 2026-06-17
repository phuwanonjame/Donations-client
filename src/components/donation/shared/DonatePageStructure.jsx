"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProfileHeader from "@/components/donation/view/ProfileHeader";
import MusicPlayer from "@/components/donation/view/MusicPlayer";
import VideoHighlights from "@/components/donation/view/VideoHighlights";
import DailyContent from "@/components/donation/view/DailyContent";
import PhotoGallery from "@/components/donation/view/PhotoGallery";
import StreamSchedule from "@/components/donation/view/StreamSchedule";
import ProductPromo from "@/components/donation/view/ProductPromo";
import RecentDonations from "@/components/donation/view/RecentDonations";
import DonationForm from "@/components/donation/view/DonationForm";
import ProfileHeader2 from "@/components/donation/view/ProfileHeader2";
import MusicUploadPanel from "@/components/donation/edit/MusicUploadPanel";

function Snowfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);

    const flakes = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.8 + 0.3,
      drift: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.5 + 0.3,
      wobble: Math.random() * Math.PI * 2,
    }));

    let animId;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      flakes.forEach((flake) => {
        flake.wobble += 0.015;
        flake.y += flake.speed;
        flake.x += flake.drift + Math.sin(flake.wobble) * 0.3;

        if (flake.y > height + 10) {
          flake.y = -10;
          flake.x = Math.random() * width;
        }
        if (flake.x > width + 10) flake.x = -10;
        if (flake.x < -10) flake.x = width + 10;

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${flake.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
    />
  );
}

function SnowOverlay() {
  const particles = [
    { className: "left-[4%] top-[3%] h-1.5 w-1.5", duration: 5.2, delay: 0.1 },
    { className: "left-[8%] top-[12%] h-2 w-2", duration: 6.4, delay: 0.4 },
    { className: "left-[12%] top-[22%] h-1.5 w-1.5", duration: 5.8, delay: 0.8 },
    { className: "left-[16%] top-[33%] h-2 w-2", duration: 6.8, delay: 0.2 },
    { className: "left-[20%] top-[44%] h-1.5 w-1.5", duration: 5.6, delay: 0.6 },
    { className: "left-[24%] top-[56%] h-2 w-2", duration: 7.1, delay: 0.9 },
    { className: "left-[28%] top-[68%] h-1.5 w-1.5", duration: 5.9, delay: 0.3 },
    { className: "left-[32%] top-[80%] h-2 w-2", duration: 6.6, delay: 1.1 },
    { className: "left-[36%] top-[10%] h-1.5 w-1.5", duration: 5.4, delay: 0.5 },
    { className: "left-[40%] top-[20%] h-2 w-2", duration: 6.9, delay: 0.7 },
    { className: "left-[44%] top-[30%] h-1.5 w-1.5", duration: 5.7, delay: 0.2 },
    { className: "left-[48%] top-[40%] h-2 w-2", duration: 6.7, delay: 1.0 },
    { className: "left-[52%] top-[50%] h-1.5 w-1.5", duration: 5.5, delay: 0.4 },
    { className: "left-[56%] top-[60%] h-2 w-2", duration: 6.5, delay: 0.8 },
    { className: "left-[60%] top-[70%] h-1.5 w-1.5", duration: 5.8, delay: 0.3 },
    { className: "left-[64%] top-[82%] h-2 w-2", duration: 7.2, delay: 1.2 },
    { className: "left-[68%] top-[8%] h-1.5 w-1.5", duration: 5.3, delay: 0.2 },
    { className: "left-[72%] top-[18%] h-2 w-2", duration: 6.3, delay: 0.9 },
    { className: "left-[76%] top-[28%] h-1.5 w-1.5", duration: 5.6, delay: 0.4 },
    { className: "left-[80%] top-[38%] h-2 w-2", duration: 6.8, delay: 0.6 },
    { className: "left-[84%] top-[48%] h-1.5 w-1.5", duration: 5.7, delay: 1.0 },
    { className: "left-[88%] top-[58%] h-2 w-2", duration: 6.6, delay: 0.5 },
    { className: "left-[92%] top-[68%] h-1.5 w-1.5", duration: 5.9, delay: 0.7 },
    { className: "left-[96%] top-[78%] h-2 w-2", duration: 6.4, delay: 1.1 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 opacity-95 mix-blend-screen">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.75)] ${particle.className}`}
          animate={{
            y: [0, 18, 0],
            x: [0, 4, -3, 0],
            opacity: [0.35, 0.95, 0.45],
            scale: [1, 1.15, 0.95],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function mapPhotos(gallery) {
  return gallery.map((item, index) => ({
    url: item.url,
    likes: item.likes ?? (index + 1) * 50,
    caption: item.caption || item.title || `Gallery ${index + 1}`,
  }));
}

function mapSchedule(schedule) {
  return schedule.map((item) => ({
    day: item.day,
    time: item.time,
    game: item.game || item.title || "",
    live: Boolean(item.live),
  }));
}

function mapProducts(products) {
  return products.map((item) => ({
    name: item.name,
    price:
      typeof item.price === "number" || typeof item.price === "string"
        ? `฿${String(item.price).replace(/^฿/, "")}`
        : "฿0",
    image: item.image,
    badge: item.badge || null,
    rating: item.rating ?? null,
  }));
}

function mapRecentDonations(donations) {
  return donations.map((item) => ({
    initials:
      item.initials ||
      String(item.name || "A")
        .split(" ")
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(""),
    name: item.name,
    message: item.message,
    amount: item.amount,
    timeAgo: item.timeAgo || item.time || "",
  }));
}

export default function DonatePageStructure({
  settings,
  preview = false,
  className = "",
}) {
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [previewWidth, setPreviewWidth] = useState(0);
  const previewRef = useRef(null);
  const template = 1;

  useEffect(() => {
    if (!preview || !previewRef.current) return undefined;

    const element = previewRef.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setPreviewWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);
    setPreviewWidth(element.getBoundingClientRect().width);

    return () => {
      observer.disconnect();
    };
  }, [preview]);

  const profile = useMemo(
    () => ({
      name: settings.profile.name,
      handle: settings.profile.username || settings.profile.handle,
      bio: settings.profile.bio,
      avatarUrl: settings.profile.avatarUrl,
      avatar_url: settings.profile.avatarUrl,
      isOnline: settings.profile.isOnline,
      is_online: settings.profile.isOnline,
      banner_url: settings.profile.bannerUrl,
      socials: settings.socials
        .filter((item) => item.enabled)
        .map((item) => ({
          label: item.label,
          href: item.href,
          icon: item.id,
        })),
    }),
    [settings]
  );

  const isCompactPreview = preview && previewWidth > 0 && previewWidth < 900;
  const isMobilePreview = preview && previewWidth > 0 && previewWidth < 520;
  const videos = useMemo(
    () => settings.videos.filter((item) => item.enabled),
    [settings.videos]
  );
  const posts = useMemo(
    () => settings.posts.filter((item) => item.enabled),
    [settings.posts]
  );
  const photos = useMemo(
    () => mapPhotos(settings.gallery.filter((item) => item.enabled)),
    [settings.gallery]
  );
  const schedule = useMemo(
    () => mapSchedule(settings.schedule.filter((item) => item.enabled)),
    [settings.schedule]
  );
  const products = useMemo(
    () => mapProducts(settings.products.filter((item) => item.enabled)),
    [settings.products]
  );
  const recentDonations = useMemo(
    () =>
      mapRecentDonations(
        settings.recentDonations.items.slice(0, settings.recentDonations.maxItems)
      ),
    [settings.recentDonations]
  );
  const playlist = useMemo(
    () => settings.music.playlist || [],
    [settings.music]
  );
  const donationDecorations = useMemo(
    () => settings.design?.donationFormDecorations || {},
    [settings.design]
  );
  const donationFormTheme = useMemo(
    () => settings.design?.donationFormTheme || {},
    [settings.design]
  );
  const sectionTheme = useMemo(
    () => settings.design?.sectionTheme || settings.design?.donationFormTheme || {},
    [settings.design]
  );
  const sectionDecorations = useMemo(
    () => settings.design?.sectionDecorations || {},
    [settings.design]
  );

  return (
    <div
      ref={preview ? previewRef : null}
      className={`relative min-h-screen bg-cover bg-center bg-fixed ${className}`.trim()}
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1542751371-adc38448a05e')",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {settings.design.snowEffect && (preview ? <SnowOverlay /> : <Snowfall />)}

      <div className="relative z-10">
        <div className={preview ? "flex justify-center pt-4" : "flex justify-center pt-6"}>
          <h1
            className={
              isMobilePreview
                ? "text-xl font-bold tracking-wide text-white"
                : "text-3xl font-bold tracking-wide text-white"
            }
          >
            DonateHUB
          </h1>
        </div>

        <div
          className={
            preview
              ? "mx-auto max-w-6xl px-3 pb-8 pt-4"
              : "mx-auto max-w-6xl px-4 pb-16 pt-6"
          }
        >
          {settings.display.showProfileHeader && (
            <div className="mb-5">
              {template === 1 ? (
                <ProfileHeader profile={profile} />
              ) : (
                <ProfileHeader2 profile={profile} />
              )}
            </div>
          )}

          {settings.display.showDonationForm && (
            <div className={preview || isCompactPreview ? "mb-5" : "mb-5 lg:hidden"}>
              <DonationForm
                selectedSticker={selectedSticker}
                decorations={donationDecorations}
                visualTheme={donationFormTheme}
              />
            </div>
          )}

          <div
            className={
              isCompactPreview
                ? "grid grid-cols-1 items-start gap-5"
                : "grid grid-cols-1 items-start gap-5 lg:grid-cols-12"
            }
          >
            <div
              className={
                isCompactPreview
                  ? "order-2 space-y-5"
                  : "order-2 space-y-5 lg:order-1 lg:col-span-8"
              }
            >
              {settings.display.showDonationForm && !preview && (
                <div className="hidden lg:block">
                  <DonationForm
                    selectedSticker={selectedSticker}
                    decorations={donationDecorations}
                    visualTheme={donationFormTheme}
                  />
                </div>
              )}
              {settings.display.showVideoHighlights && (
                <VideoHighlights videos={videos} visualTheme={sectionTheme} />
              )}
              {settings.display.showDailyContent && (
                <DailyContent posts={posts} visualTheme={sectionTheme} />
              )}
            </div>

            <div
              className={
                isCompactPreview
                  ? "order-1 space-y-5"
                  : "order-1 space-y-5 lg:order-2 lg:col-span-4"
              }
            >
              {settings.display.showMusicPanel && (
                <MusicUploadPanel visualTheme={sectionTheme} />
              )}
              {settings.display.showMusicPanel && (
                <MusicPlayer
                  playlist={playlist}
                  visualTheme={sectionTheme}
                  decorations={sectionDecorations}
                />
              )}
              {settings.display.showGallery && (
                <PhotoGallery photos={photos} visualTheme={sectionTheme} />
              )}
              {settings.display.showSchedule && (
                <StreamSchedule schedule={schedule} visualTheme={sectionTheme} />
              )}
              {settings.display.showProducts && (
                <ProductPromo products={products} visualTheme={sectionTheme} />
              )}
              {settings.display.showRecentDonations && (
                <RecentDonations
                  donations={recentDonations}
                  visualTheme={sectionTheme}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
