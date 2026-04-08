"use client";
import { useState } from "react";
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
import StickerShop from "@/components/donation/StickerShop";

const PROFILE = {
  name: "x86",
  handle: "ezdn.app/x86",
  bio: "สตรีมเมอร์สาย Competitive 🎮 | เล่น Valorant & LoL | สตรีมทุกวัน 20:00+",
  avatarUrl: "",
  isOnline: true,
  socials: [
    { label: "Facebook", href: "https://facebook.com/test", icon: "facebook" },
    {
      label: "Instagram",
      href: "https://instagram.com/test",
      icon: "instagram",
    },
    { label: "YouTube", href: "https://youtube.com/test", icon: "youtube" },
    { label: "TikTok", href: "https://tiktok.com/test", icon: "tiktok" },
  ],
};

export default function DonateProfile() {
  const [selectedSticker, setSelectedSticker] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <ProfileBanner profile={PROFILE} />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Profile Header */}
        <ProfileHeader profile={PROFILE} />

        {/* MOBILE: Donation Form บนสุด */}
        <div className="lg:hidden mb-5">
          <DonationForm selectedSticker={selectedSticker} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN - Main content */}
          <div className="lg:col-span-8 space-y-5 order-2 lg:order-1">
            {/* DESKTOP: Donation Form */}
            <div className="hidden lg:block">
              <DonationForm selectedSticker={selectedSticker} />
            </div>

            {/* Video Highlights */}
            <VideoHighlights />

            {/* Daily Content */}
            <DailyContent />

            {/* Sticker Shop */}
            {/* <StickerShop onStickerSelect={setSelectedSticker} /> */}
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="lg:col-span-4 space-y-5 order-1 lg:order-2">
            {/* Music Player */}
            <MusicPlayer />
            {/* Photo Gallery */}
            <PhotoGallery />

            {/* Stream Schedule */}
            <StreamSchedule />

            {/* Product Promo */}
            <ProductPromo />

            {/* Recent Donations */}
            <RecentDonations />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="text-primary font-medium">EZDN</span> —
            สร้างหน้าโดเนทของคุณ{" "}
            <a href="/" className="text-primary hover:underline">
              ที่นี่
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
