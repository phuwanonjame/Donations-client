"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Globe,
  Loader2,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// --------------------
// ZOD SCHEMA
// --------------------
const socialSchema = z.object({
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
});

// --------------------
// SOCIAL CONFIG
// --------------------
const socialLinks = [
  { key: "facebook", icon: Facebook, placeholder: "facebook.com/username", color: "from-blue-600 to-blue-700" },
  { key: "youtube", icon: Youtube, placeholder: "youtube.com/@channel", color: "from-red-600 to-red-700" },
  { key: "tiktok", icon: Globe, placeholder: "tiktok.com/@username", color: "from-slate-800 to-slate-900" },
  { key: "twitter", icon: Twitter, placeholder: "twitter.com/username", color: "from-sky-500 to-sky-600" },
  { key: "instagram", icon: Instagram, placeholder: "instagram.com/username", color: "from-pink-500 to-purple-600" },
  { key: "website", icon: Globe, placeholder: "yourwebsite.com", color: "from-emerald-500 to-teal-600" },
];

// --------------------
// COMPONENT
// --------------------
const SocialForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      facebook: "",
      youtube: "",
      tiktok: "",
      twitter: "",
      instagram: "",
      website: "",
    },
  });

  const onSubmit = async (data) => {
    if (loading) return; // 🔒 กันกดเบิ้ล

    try {
      setLoading(true);

      // 🔥 mock API
      await new Promise((res) => setTimeout(res, 1500));

      console.log("submit:", data);

      toast.success("อัปเดตสำเร็จ 🎉");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Social Media</h3>
            <p className="text-slate-400 text-sm">
              Connect your social profiles
            </p>
          </div>
        </div>

        {/* INPUT */}
        <div className="space-y-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;

            return (
              <motion.div
                key={social.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${social.color}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <Input
                  placeholder={social.placeholder}
                  {...form.register(social.key)}
                  disabled={loading}
                  className="flex-1 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                />
              </motion.div>
            );
          })}
        </div>

        {/* BUTTON */}
        <div className="mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังบันทึก...
              </span>
            ) : (
              "บันทึก"
            )}
          </Button>
        </div>
      </motion.div>
    </form>
  );
};

export default SocialForm;