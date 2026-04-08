// ==================== TemplateTab.js ====================
// แก้: templates ส่งค่าเป็น flat structure แทน grouped
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Copy, Upload, RotateCcw, Sparkles, Gamepad2, Film,
  Tv, Sword, Crown, Star, Zap, Heart, Flame, Leaf
} from "lucide-react";

// ✅ templates เป็น flat structure ตรงๆ ไม่ต้องแปลง
const templates = {
  basic: {
    id: "basic", name: "พื้นฐาน", description: "แบบพื้นฐานที่เรียบง่าย",
    icon: <Star className="w-4 h-4" />, color: "text-blue-400",
    bgColor: "from-blue-900/20 to-blue-800/20", borderColor: "border-blue-700/50",
    settings: {
      textColor: "#ffffff", borderColor: "#3b82f6", borderWidth: 2,
      font: "IBM Plex Sans Thai", fontWeight: "700", textSize: [36],
      amountColor: "#3b82f6", donorNameColor: "#ffffff", messageColor: "#d1d5db",
      amountShine: false, prefixText: "{{user}} ", amountText: "{{amount}}฿",
      inAnimation: "fadeInUp", outAnimation: "fadeOutUp", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  fantasy: {
    id: "fantasy", name: "แฟนตาซี", description: "แบบเทพนิยายและเวทมนตร์",
    icon: <Sparkles className="w-4 h-4" />, color: "text-purple-400",
    bgColor: "from-purple-900/20 to-pink-800/20", borderColor: "border-purple-700/50",
    settings: {
      textColor: "#f3e8ff", borderColor: "#c084fc", borderWidth: 3,
      font: "Prompt", fontWeight: "700", textSize: [38],
      amountColor: "#e879f9", donorNameColor: "#f0abfc", messageColor: "#f5d0fe",
      amountShine: true, prefixText: "✨ {{user}} ✨", amountText: "{{amount}}฿",
      inAnimation: "zoomIn", outAnimation: "fadeOutUp", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  dragon: {
    id: "dragon", name: "มังกร", description: "แบบพลังและความเกรียงไกร",
    icon: <Flame className="w-4 h-4" />, color: "text-red-400",
    bgColor: "from-red-900/20 to-orange-800/20", borderColor: "border-red-700/50",
    settings: {
      textColor: "#fecaca", borderColor: "#f87171", borderWidth: 4,
      font: "Noto Sans Thai", fontWeight: "700", textSize: [40],
      amountColor: "#fca5a5", donorNameColor: "#fca5a5", messageColor: "#fecaca",
      amountShine: true, prefixText: "🐉 {{user}} 🐉", amountText: "{{amount}}฿",
      inAnimation: "bounceIn", outAnimation: "fadeOutDown", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  game: {
    id: "game", name: "เกม", description: "แบบอินเตอร์เฟซเกม",
    icon: <Gamepad2 className="w-4 h-4" />, color: "text-green-400",
    bgColor: "from-green-900/20 to-emerald-800/20", borderColor: "border-green-700/50",
    settings: {
      textColor: "#d1fae5", borderColor: "#10b981", borderWidth: 2,
      font: "IBM Plex Sans Thai", fontWeight: "700", textSize: [34],
      amountColor: "#34d399", donorNameColor: "#6ee7b7", messageColor: "#a7f3d0",
      amountShine: false, prefixText: "🎮 {{user}} 🎮", amountText: "{{amount}}฿",
      inAnimation: "slideInLeft", outAnimation: "fadeOutUp", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  movie: {
    id: "movie", name: "หนัง", description: "แบบโรงหนังและฮอลลีวู้ด",
    icon: <Film className="w-4 h-4" />, color: "text-yellow-400",
    bgColor: "from-yellow-900/20 to-amber-800/20", borderColor: "border-yellow-700/50",
    settings: {
      textColor: "#fef3c7", borderColor: "#f59e0b", borderWidth: 1,
      font: "Sarabun", fontWeight: "500", textSize: [32],
      amountColor: "#fbbf24", donorNameColor: "#fbbf24", messageColor: "#fde68a",
      amountShine: false, prefixText: "🎬 {{user}} 🎬", amountText: "{{amount}}฿",
      inAnimation: "fadeIn", outAnimation: "fadeOut", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  anime: {
    id: "anime", name: "อนิเมะ", description: "แบบการ์ตูนญี่ปุ่น",
    icon: <Tv className="w-4 h-4" />, color: "text-pink-400",
    bgColor: "from-pink-900/20 to-rose-800/20", borderColor: "border-pink-700/50",
    settings: {
      textColor: "#fce7f3", borderColor: "#f472b6", borderWidth: 3,
      font: "Prompt", fontWeight: "600", textSize: [36],
      amountColor: "#f9a8d4", donorNameColor: "#f9a8d4", messageColor: "#fbcfe8",
      amountShine: true, prefixText: "🌸 {{user}} 🌸", amountText: "{{amount}}฿",
      inAnimation: "zoomIn", outAnimation: "fadeOutUp", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  royal: {
    id: "royal", name: "ราชวงศ์", description: "แบบหรูหราและราชวงศ์",
    icon: <Crown className="w-4 h-4" />, color: "text-amber-400",
    bgColor: "from-amber-900/20 to-yellow-800/20", borderColor: "border-amber-700/50",
    settings: {
      textColor: "#fef3c7", borderColor: "#f59e0b", borderWidth: 4,
      font: "Noto Sans Thai", fontWeight: "700", textSize: [38],
      amountColor: "#fbbf24", donorNameColor: "#fde68a", messageColor: "#fef3c7",
      amountShine: true, prefixText: "👑 {{user}} 👑", amountText: "{{amount}}฿",
      inAnimation: "bounceIn", outAnimation: "fadeOutUp", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  ninja: {
    id: "ninja", name: "นินจา", description: "แบบลึกลับและเงียบเชียบ",
    icon: <Sword className="w-4 h-4" />, color: "text-gray-400",
    bgColor: "from-gray-900/20 to-slate-800/20", borderColor: "border-gray-700/50",
    settings: {
      textColor: "#cbd5e1", borderColor: "#475569", borderWidth: 1,
      font: "Sarabun", fontWeight: "500", textSize: [34],
      amountColor: "#94a3b8", donorNameColor: "#94a3b8", messageColor: "#cbd5e1",
      amountShine: false, prefixText: "🥷 {{user}} 🥷", amountText: "{{amount}}฿",
      inAnimation: "fadeInDown", outAnimation: "fadeOutDown", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  cyberpunk: {
    id: "cyberpunk", name: "ไซเบอร์พังก์", description: "แบบอนาคตและเทคโนโลยี",
    icon: <Zap className="w-4 h-4" />, color: "text-cyan-400",
    bgColor: "from-cyan-900/20 to-blue-800/20", borderColor: "border-cyan-700/50",
    settings: {
      textColor: "#cffafe", borderColor: "#22d3ee", borderWidth: 2,
      font: "IBM Plex Sans Thai", fontWeight: "700", textSize: [36],
      amountColor: "#67e8f9", donorNameColor: "#a5f3fc", messageColor: "#cffafe",
      amountShine: true, prefixText: "⚡ {{user}} ⚡", amountText: "{{amount}}฿",
      inAnimation: "zoomIn", outAnimation: "zoomOut", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
  nature: {
    id: "nature", name: "ธรรมชาติ", description: "แบบต้นไม้และสิ่งแวดล้อม",
    icon: <Leaf className="w-4 h-4" />, color: "text-emerald-400",
    bgColor: "from-emerald-900/20 to-green-800/20", borderColor: "border-emerald-700/50",
    settings: {
      textColor: "#d1fae5", borderColor: "#10b981", borderWidth: 2,
      font: "IBM Plex Sans Thai", fontWeight: "500", textSize: [34],
      amountColor: "#34d399", donorNameColor: "#6ee7b7", messageColor: "#a7f3d0",
      amountShine: false, prefixText: "🌿 {{user}} 🌿", amountText: "{{amount}}฿",
      inAnimation: "fadeInUp", outAnimation: "fadeOutUp", inDuration: 1, outDuration: 1, displayDuration: 3,
    },
  },
};

const templateCategories = [
  { title: "แนวพื้นฐาน",  templates: ["basic", "nature"] },
  { title: "แนวแฟนตาซี", templates: ["fantasy", "dragon", "royal"] },
  { title: "แนวบันเทิง",  templates: ["game", "movie", "anime"] },
  { title: "แนวพิเศษ",   templates: ["ninja", "cyberpunk"] },
];

export default function TemplateTab({
  handleReset,
  handleCopyJSON,
  onTemplateSelect,
  currentTemplate = "basic",
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);

  const handleTemplateClick = (templateId) => {
    setSelectedTemplate(templateId);
    if (onTemplateSelect) {
      // ✅ ส่ง flat settings ตรงๆ
      onTemplateSelect(templates[templateId].settings);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Template Gallery
        </h3>
        <div className="text-sm text-slate-400">{Object.keys(templates).length} templates available</div>
      </div>

      <div className="space-y-6">
        {templateCategories.map((category) => (
          <div key={category.title}>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">{category.title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.templates.map((templateId) => {
                const template = templates[templateId];
                const isSelected = selectedTemplate === templateId;
                return (
                  <motion.button key={templateId} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateClick(templateId)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? `border-cyan-500 bg-cyan-500/10 ${template.bgColor}`
                        : `${template.borderColor} bg-slate-800/30 hover:bg-slate-700/30`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-slate-900/50 ${isSelected ? "bg-cyan-900/30" : ""}`}>
                        {template.icon}
                      </div>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-semibold ${isSelected ? "text-cyan-300" : template.color}`}>
                          {template.name}
                        </span>
                        {isSelected && <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />}
                      </div>
                      <p className={`text-xs ${isSelected ? "text-cyan-200/70" : "text-slate-400"}`}>
                        {template.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${templates[selectedTemplate].bgColor}`}>
                {templates[selectedTemplate].icon}
              </div>
              <div>
                <h4 className="font-semibold text-white">{templates[selectedTemplate].name}</h4>
                <p className="text-xs text-slate-400">Template selected</p>
              </div>
            </div>
            <Button size="sm" onClick={() => handleTemplateClick(selectedTemplate)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              Apply Template
            </Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-white font-medium mb-2 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset to Default Settings
          </p>
          <p className="text-slate-400 text-sm mb-4">Wipes all custom settings and reverts to the system defaults.</p>
          <Button variant="destructive" onClick={handleReset} className="bg-red-600 hover:bg-red-700">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Settings
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-white font-medium mb-2 flex items-center gap-2">
            <Copy className="w-4 h-4" /> Import/Export Settings
          </p>
          <p className="text-slate-400 text-sm mb-4">Share your configuration using a JSON string.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCopyJSON} className="border-slate-700 text-slate-300 hover:bg-slate-700">
              <Copy className="w-4 h-4 mr-2" /> Copy JSON
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700">
              <Upload className="w-4 h-4 mr-2" /> Import JSON
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}