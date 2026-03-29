"use client";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useRef, useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const ProfileAvatar = ({ profile }) => {
  const [preview, setPreview] = useState(profile?.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // cleanup memory
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // setError("");

    // ✅ validate type
    if (!file.type.startsWith("image/")) {
    //   setError("ต้องเป็นไฟล์รูปภาพเท่านั้น");
      toast.error("ต้องเป็นไฟล์รูปภาพเท่านั้น");
      fileInputRef.current.value = ""; 
      return;
    }

    // ✅ validate size
    if (file.size > MAX_SIZE) {
    //   setError("ไฟล์ต้องไม่เกิน 2MB");
      toast.error("ไฟล์ต้องไม่เกิน 2MB");
      fileInputRef.current.value = "";
      return;
    }

    // preview ทันที
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      // (optional) ถ้า backend return url ใหม่
      const data = await res.json();
      if (data?.url) {
        setPreview(data.url); // ใช้ url จริงแทน blob
      }
    } catch (err) {
      console.error(err);
    //   setError("อัปโหลดไม่สำเร็จ");
      toast.error("อัปโหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
        fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-[200px] w-[200px] border-4 border-white/20 shadow-xl">
          <AvatarImage src={preview} />
          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-4xl text-white">
            {profile?.displayName?.[0]?.toUpperCase() || "C"}
          </AvatarFallback>
        </Avatar>

        {/* hidden input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className={`absolute bottom-2 right-2 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/20 transition
            ${loading 
              ? "bg-black/30 cursor-not-allowed" 
              : "bg-black/50 hover:scale-95 hover:bg-black/70"}
          `}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* error message */}
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfileAvatar;