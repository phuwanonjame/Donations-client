import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, Sparkles, Bell, X } from "lucide-react";

export default function MediaTab({ settings, updateSetting }) {
  const fileInputRef = useRef(null);

  // Helper function to safely get image URL (support both flat and grouped)
  const getImageUrl = () => {
    if (!settings) return "";
    
    // If using grouped structure
    if (settings.metadata) {
      return settings.metadata.image || "";
    }
    
    // Flat structure
    return settings.image || settings.alertImage || "";
  };

  // Helper function to update image URL
  const updateImageUrl = (url) => {
    if (settings.metadata) {
      // For grouped structure, update metadata.image
      updateSetting("metadata", {
        ...settings.metadata,
        image: url
      });
    } else {
      // For flat structure, update both image and alertImage for compatibility
      updateSetting("image", url);
      updateSetting("alertImage", url);
    }
  };

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
      updateImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------
  // 📌 Handle Preset Images
  // ----------------------------------
  const handlePreset = (type) => {
    if (type === "default") {
      updateImageUrl("https://cdn-icons-png.flaticon.com/512/3900/3900569.png");
    } else if (type === "premium") {
      updateImageUrl("https://cdn-icons-png.flaticon.com/512/992/992651.png");
    }
  };

  // ----------------------------------
  // 📌 Clear Image
  // ----------------------------------
  const handleClearImage = () => {
    updateImageUrl("");
  };

  const currentImageUrl = getImageUrl();

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
        className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer group"
      >
        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
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
      {currentImageUrl && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-300 text-sm">Preview</p>
            <button
              onClick={handleClearImage}
              className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <img
            src={currentImageUrl}
            alt="Alert Preview"
            className="max-h-48 mx-auto rounded-xl border border-slate-700 shadow-lg object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=Invalid+Image";
            }}
          />
        </div>
      )}

      {/* URL Input */}
      <div>
        <Label className="text-slate-300 mb-2 block">Image URL</Label>
        <Input
          value={currentImageUrl}
          onChange={(e) => updateImageUrl(e.target.value)}
          placeholder="https://example.com/image.png"
          className="bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
        />
        <p className="text-slate-500 text-xs mt-1">
          Enter a direct link to an image or GIF
        </p>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          onClick={() => handlePreset("default")}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center cursor-pointer hover:border-cyan-500/30 transition-all hover:scale-105"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-sm">Default Alert</p>
        </div>

        <div
          onClick={() => handlePreset("premium")}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center cursor-pointer hover:border-cyan-500/30 transition-all hover:scale-105"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-sm">Premium Alert</p>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
        <p className="text-xs text-cyan-400">
          💡 Tip: Use GIFs for animated alerts! Recommended size: 200x200px
        </p>
      </div>
    </motion.div>
  );
}