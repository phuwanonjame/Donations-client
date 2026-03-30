"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Globe,
  Camera,
  Save,
  Shield,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SocialForm from "@/components/dashboard/account/social-form";
import ProfileDetailForm from "@/components/dashboard/account/profile-detail-form";
import ProfileAvatar from "@/components/dashboard/account/profile-avatar";
import CategorySelectorForm from "@/components/dashboard/account/category-selector-form";

export default function ManageAccount() {
  const [profile, setProfile] = useState({
    displayName: "Creator",
    fullName: "",
    email: "creator@example.com",
    phone: "",
    birthDate: "",
    bio: "",
    country: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    twitter: "",
    instagram: "",
    website: "",
  });

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
      >
        <div className="relative mt-[100px] mb-8 flex flex-col gap-8 rounded-3xl border border-white/20 bg-gradient-to-tl from-white/10 via-white/0 to-white/0 p-6 md:p-8 xl:flex-row">
          {/* LEFT: PROFILE */}
          <div className="-mt-[120px] flex w-full flex-col items-center justify-center">
            {/* Avatar */}
            <ProfileAvatar />

            {/* Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {profile.displayName || "Creator"}
            </h2>

            {/* Email */}
            <p className="text-white/60 mt-2 text-sm md:text-base break-all">
              dhub.app/x86
            </p>

            {/* Tags */}
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                Free Plan
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                Verified
              </span>
            </div>
          </div>

          {/* RIGHT: ACTION / INFO */}
          <div className="w-full xl:max-w-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Manage Account
                </h1>
                <p className="text-white/60 text-sm md:text-base">
                  จัดการบัญชี
                </p>
              </div>

             
            </div>

            {/* Info block */}
            <div className="space-y-4">
              {/* Email */}
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/60">Email</p>
                <div className="flex justify-between items-center">
                   <p className="text-lg font-medium break-all text-white">
                  {profile.email}
                  
                </p>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                Verified
              </span>
                </div>
               
              </div>

              {/* Example extra */}
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/60">Phone Number</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium break-all text-white">
                  0123456789
                  
                </p>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                Verified
              </span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <ProfileDetailForm />

        {/* Social Media Links */}
        <SocialForm />
      </div>

      <CategorySelectorForm />

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Security</h3>
            <p className="text-slate-400 text-sm">
              Manage your account security
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-slate-500 text-sm">
                  Last changed 30 days ago
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Change
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-white font-medium">Two-Factor Auth</p>
                <p className="text-slate-500 text-sm">Not enabled</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Enable
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-8">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
