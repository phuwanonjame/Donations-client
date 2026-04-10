"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProfileBanner from "@/components/donation/ProfileBanner";
import ProfileHeader from "@/components/donation/ProfileHeader";
import MusicPlayer from "@/components/donation/MusicPlayer";
import VideoHighlights from "@/components/donation/VideoHighlights";
import DailyContent from "@/components/donation/DailyContent";
import PhotoGallery from "@/components/donation/PhotoGallery";
import StreamSchedule from "@/components/donation/StreamSchedule";
import ProductPromo from "@/components/donation/ProductPromo";
import RecentDonations from "@/components/donation/RecentDonations";
import DonationForm from "@/components/donation/DonationForm";
import ProfileHeader2 from "@/components/donation/ProfileHeader2";
import MusicUploadPanel from "@/components/donation/MusicUploadPanel";
import YouTubeAudioPlayer from "@/components/donation/YouTubeAudioPlayer";

const PROFILE = {
  name: "x86",
  handle: "ezdn.app/x86",
  bio: "สตรีมเมอร์สาย Competitive 🎮 | เล่น Valorant & LoL | สตรีมทุกวัน 20:00+",
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

// ---- Snowfall ----
function Snowfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // สร้าง snowflakes
    const flakes = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 0.5,       // ขนาด 0.5–3px
      speed: Math.random() * 0.8 + 0.3,   // ความเร็วตก
      drift: Math.random() * 0.4 - 0.2,   // แกว่งซ้าย-ขวา
      opacity: Math.random() * 0.5 + 0.3, // ความโปร่งใส
      wobble: Math.random() * Math.PI * 2, // phase สำหรับแกว่ง
    }));

    let animId;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      flakes.forEach((f) => {
        f.wobble += 0.015;
        f.y += f.speed;
        f.x += f.drift + Math.sin(f.wobble) * 0.3;

        // วนกลับเมื่อหลุดจอ
        if (f.y > height + 10) { f.y = -10; f.x = Math.random() * width; }
        if (f.x > width + 10)  { f.x = -10; }
        if (f.x < -10)         { f.x = width + 10; }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${f.opacity})`; // ฟ้าน้ำแข็ง
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
        pointerEvents: "none", // ไม่บล็อก click
      }}
    />
  );
}

// ---- Main Page ----
export default function DonateProfile() {
  const [selectedSticker, setSelectedSticker] = useState(null);
  const template = 1;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1542751371-adc38448a05e')",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* ❄️ หิมะตก */}
      <Snowfall />

      <div className="relative z-10">
        <div className="flex justify-center pt-6">
          <h1 className="text-white text-3xl font-bold tracking-wide">
            DonateHUB
          </h1>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-6 pb-16">
          <div className="mb-5">
            {template === 1 ? (
              <ProfileHeader profile={PROFILE} />
            ) : (
              <ProfileHeader2 profile={PROFILE} />
            )}
          </div>

          <div className="lg:hidden mb-5">
            <DonationForm selectedSticker={selectedSticker} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-5 order-2 lg:order-1">
              <div className="hidden lg:block">
                <DonationForm selectedSticker={selectedSticker} />
              </div>
              <VideoHighlights />
              <DailyContent />
            </div>

            <div className="lg:col-span-4 space-y-5 order-1 lg:order-2">
              <MusicUploadPanel />
              <MusicPlayer />
              <PhotoGallery />
              <StreamSchedule />
              <ProductPromo />
              <RecentDonations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}