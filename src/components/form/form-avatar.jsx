"use client";
import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const FormAvatarField = ({ name = "avatar", profile, loading }) => {
  const { setValue, watch, formState: { errors } } = useFormContext();

  const fileInputRef = useRef(null);
  const value = watch(name);

  const [preview, setPreview] = useState(profile?.avatarUrl || "");
  const [localError, setLocalError] = useState("");

  // cleanup blob
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError("");

    // ✅ validate type
    if (!file.type.startsWith("image/")) {
      setLocalError("ต้องเป็นรูปภาพเท่านั้น");
      return;
    }

    // ✅ validate size
    if (file.size > MAX_SIZE) {
      setLocalError("ไฟล์ต้องไม่เกิน 2MB");
      return;
    }

    // preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    // set เข้า form
    setValue(name, file, { shouldDirty: true });
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

      {/* error */}
      {(localError || errors[name]) && (
        <p className="text-sm text-red-400">
          {localError || errors[name]?.message}
        </p>
      )}
    </div>
  );
};

export default FormAvatarField;