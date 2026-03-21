import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, Sparkles, Bell } from "lucide-react";

export default function MediaTab({ settings, updateSetting }) {
  const fileInputRef = useRef(null);

  // ----------------------------------
  // 📌 Handle File Upload
  // ----------------------------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // จำกัดขนาดไฟล์ 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("ไฟล์ห้ามเกิน 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // 💡 แก้ไข: ใช้ Key "image"
      updateSetting("image", reader.result); // เก็บ Base64
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------
  // 📌 Handle Preset Images
  // ----------------------------------
  const handlePreset = (type) => {
    if (type === "default") {
      // 💡 แก้ไข: ใช้ Key "image"
      updateSetting(
        "image",
        "https://cdn-icons-png.flaticon.com/512/3900/3900569.png"
      );
    } else if (type === "premium") {
      // 💡 แก้ไข: ใช้ Key "image"
      updateSetting(
        "image",
        "https://cdn-icons-png.flaticon.com/512/992/992651.png"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-cyan-400" /> Alert Image / GIF
      </h3>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
      >
        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">
          Upload Image or GIF
        </p>
        <p className="text-slate-500 text-sm mb-4">
          Supports PNG, JPG, GIF (Max 5MB)
        </p>

        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          Choose File
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Preview */}
      {/* 💡 แก้ไข: ใช้ settings.image สำหรับ Preview */}
      {settings.image && (
        <div className="mt-4 text-center">
          <p className="text-slate-300 text-sm mb-2">Preview</p>
          <img
            // 💡 แก้ไข: ใช้ settings.image สำหรับ src
            src={settings.image}
            alt="Alert Preview"
            className="max-h-48 mx-auto rounded-xl border border-slate-700 shadow-lg object-contain"
          />
        </div>
      )}

      {/* URL Input */}
      <div>
        <Label className="text-slate-300 mb-2 block">Image URL</Label>
        <Input
          // 💡 แก้ไข: ใช้ settings.image
          value={settings.image || ""}
          // 💡 แก้ไข: ใช้ Key "image"
          onChange={(e) => updateSetting("image", e.target.value)}
          placeholder="Image URL"
          className="bg-slate-800/80 border-slate-700 text-white"
        />
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          onClick={() => handlePreset("default")}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center cursor-pointer hover:border-cyan-500/30 transition-colors"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-sm">Default Alert</p>
        </div>

        <div
          onClick={() => handlePreset("premium")}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center cursor-pointer hover:border-cyan-500/30 transition-colors"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-sm">Premium Alert</p>
        </div>
      </div>
    </motion.div>
  );
}
