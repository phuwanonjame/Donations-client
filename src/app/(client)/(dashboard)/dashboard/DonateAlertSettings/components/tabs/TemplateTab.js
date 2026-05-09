import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchAlertThemes } from "@/actions/DonateAlertapi/donateSettingsApi";
import {
  Copy,
  Upload,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Film,
  Tv,
  Sword,
  Crown,
  Star,
  Zap,
  Flame,
  Leaf,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ICON_COMPONENTS = {
  Crown,
  Film,
  Flame,
  Gamepad2,
  Leaf,
  Sparkles,
  Star,
  Sword,
  Tv,
  Zap,
};

const THEME_CATEGORY_TITLES = {
  basic: "แนวพื้นฐาน",
  fantasy: "แนวแฟนตาซี",
  entertainment: "แนวบันเทิง",
  special: "แนวพิเศษ",
  other: "อื่นๆ",
};

const THEME_CATEGORY_ORDER = [
  { key: "basic", templates: ["basic", "nature"] },
  { key: "fantasy", templates: ["fantasy", "dragon", "royal"] },
  { key: "entertainment", templates: ["game", "movie", "anime"] },
  { key: "special", templates: ["ninja", "cyberpunk"] },
];

function getIconName(iconMarkup = "") {
  const match = String(iconMarkup).match(/<\s*([A-Za-z0-9]+)/);
  return match?.[1] || "Sparkles";
}

function normalizeThemeItem(item) {
  const config = item?.themeConfig || item || {};
  const id = config.id || item?.name || item?.id;
  const Icon = ICON_COMPONENTS[getIconName(config.icon)] || Sparkles;

  if (!id || !config.settings) return null;

  return {
    id,
    name: config.name || item?.name || id,
    description: config.description || "",
    icon: <Icon className="w-4 h-4" />,
    color: config.color || "text-cyan-400",
    bgColor: config.bgColor || "from-cyan-900/20 to-blue-800/20",
    borderColor: config.borderColor || "border-cyan-700/50",
    settings: config.settings,
  };
}

function buildTemplateMap(themeItems) {
  return themeItems.reduce((acc, item) => {
    const template = normalizeThemeItem(item);
    if (template) acc[template.id] = template;
    return acc;
  }, {});
}

function buildTemplateCategories(templateMap) {
  const seen = new Set();
  const categories = THEME_CATEGORY_ORDER.map((category) => {
    const templatesInCategory = category.templates.filter((id) => templateMap[id]);
    templatesInCategory.forEach((id) => seen.add(id));
    return {
      title: THEME_CATEGORY_TITLES[category.key],
      templates: templatesInCategory,
    };
  }).filter((category) => category.templates.length > 0);

  const otherTemplates = Object.keys(templateMap).filter((id) => !seen.has(id));
  if (otherTemplates.length > 0) {
    categories.push({
      title: THEME_CATEGORY_TITLES.other,
      templates: otherTemplates,
    });
  }

  return categories;
}

const templates = {
  basic: {
    id: "basic",
    name: "พื้นฐาน",
    description: "แบบพื้นฐานที่เรียบง่าย",
    icon: <Star className="w-4 h-4" />,
    color: "text-blue-400",
    bgColor: "from-blue-900/20 to-blue-800/20",
    borderColor: "border-blue-700/50",
    settings: {
      textColor: "#ffffff",
      borderColor: "#3b82f6",
      borderWidth: 2,
      font: "IBM Plex Sans Thai",
      fontWeight: "700",
      textSize: [36],
      amountColor: "#3b82f6",
      donorNameColor: "#ffffff",
      messageColor: "#d1d5db",
      amountShine: false,
      prefixText: "{{user}} ",
      amountText: "{{amount}}฿",
      inAnimation: "fadeInUp",
      outAnimation: "fadeOutUp",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  fantasy: {
    id: "fantasy",
    name: "แฟนตาซี",
    description: "แบบเทพนิยายและเวทมนตร์",
    icon: <Sparkles className="w-4 h-4" />,
    color: "text-purple-400",
    bgColor: "from-purple-900/20 to-pink-800/20",
    borderColor: "border-purple-700/50",
    settings: {
      textColor: "#f3e8ff",
      borderColor: "#c084fc",
      borderWidth: 3,
      font: "Prompt",
      fontWeight: "700",
      textSize: [38],
      amountColor: "#e879f9",
      donorNameColor: "#f0abfc",
      messageColor: "#f5d0fe",
      amountShine: true,
      prefixText: "✨ {{user}} ✨",
      amountText: "{{amount}}฿",
      inAnimation: "zoomIn",
      outAnimation: "fadeOutUp",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  dragon: {
    id: "dragon",
    name: "มังกร",
    description: "แบบพลังและความเกรียงไกร",
    icon: <Flame className="w-4 h-4" />,
    color: "text-red-400",
    bgColor: "from-red-900/20 to-orange-800/20",
    borderColor: "border-red-700/50",
    settings: {
      textColor: "#fecaca",
      borderColor: "#f87171",
      borderWidth: 4,
      font: "Noto Sans Thai",
      fontWeight: "700",
      textSize: [40],
      amountColor: "#fca5a5",
      donorNameColor: "#fca5a5",
      messageColor: "#fecaca",
      amountShine: true,
      prefixText: "🐉 {{user}} 🐉",
      amountText: "{{amount}}฿",
      inAnimation: "bounceIn",
      outAnimation: "fadeOutDown",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  game: {
    id: "game",
    name: "เกม",
    description: "แบบอินเตอร์เฟซเกม",
    icon: <Gamepad2 className="w-4 h-4" />,
    color: "text-green-400",
    bgColor: "from-green-900/20 to-emerald-800/20",
    borderColor: "border-green-700/50",
    settings: {
      textColor: "#d1fae5",
      borderColor: "#10b981",
      borderWidth: 2,
      font: "IBM Plex Sans Thai",
      fontWeight: "700",
      textSize: [34],
      amountColor: "#34d399",
      donorNameColor: "#6ee7b7",
      messageColor: "#a7f3d0",
      amountShine: false,
      prefixText: "🎮 {{user}} 🎮",
      amountText: "{{amount}}฿",
      inAnimation: "slideInLeft",
      outAnimation: "fadeOutUp",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  movie: {
    id: "movie",
    name: "หนัง",
    description: "แบบโรงหนังและฮอลลีวู้ด",
    icon: <Film className="w-4 h-4" />,
    color: "text-yellow-400",
    bgColor: "from-yellow-900/20 to-amber-800/20",
    borderColor: "border-yellow-700/50",
    settings: {
      textColor: "#fef3c7",
      borderColor: "#f59e0b",
      borderWidth: 1,
      font: "Sarabun",
      fontWeight: "500",
      textSize: [32],
      amountColor: "#fbbf24",
      donorNameColor: "#fbbf24",
      messageColor: "#fde68a",
      amountShine: false,
      prefixText: "🎬 {{user}} 🎬",
      amountText: "{{amount}}฿",
      inAnimation: "fadeIn",
      outAnimation: "fadeOut",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  anime: {
    id: "anime",
    name: "อนิเมะ",
    description: "แบบการ์ตูนญี่ปุ่น",
    icon: <Tv className="w-4 h-4" />,
    color: "text-pink-400",
    bgColor: "from-pink-900/20 to-rose-800/20",
    borderColor: "border-pink-700/50",
    settings: {
      textColor: "#fce7f3",
      borderColor: "#f472b6",
      borderWidth: 3,
      font: "Prompt",
      fontWeight: "600",
      textSize: [36],
      amountColor: "#f9a8d4",
      donorNameColor: "#f9a8d4",
      messageColor: "#fbcfe8",
      amountShine: true,
      prefixText: "🌸 {{user}} 🌸",
      amountText: "{{amount}}฿",
      inAnimation: "zoomIn",
      outAnimation: "fadeOutUp",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  royal: {
    id: "royal",
    name: "ราชวงศ์",
    description: "แบบหรูหราและราชวงศ์",
    icon: <Crown className="w-4 h-4" />,
    color: "text-amber-400",
    bgColor: "from-amber-900/20 to-yellow-800/20",
    borderColor: "border-amber-700/50",
    settings: {
      textColor: "#fef3c7",
      borderColor: "#f59e0b",
      borderWidth: 4,
      font: "Noto Sans Thai",
      fontWeight: "700",
      textSize: [38],
      amountColor: "#fbbf24",
      donorNameColor: "#fde68a",
      messageColor: "#fef3c7",
      amountShine: true,
      prefixText: "👑 {{user}} 👑",
      amountText: "{{amount}}฿",
      inAnimation: "bounceIn",
      outAnimation: "fadeOutUp",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  ninja: {
    id: "ninja",
    name: "นินจา",
    description: "แบบลึกลับและเงียบเชียบ",
    icon: <Sword className="w-4 h-4" />,
    color: "text-gray-400",
    bgColor: "from-gray-900/20 to-slate-800/20",
    borderColor: "border-gray-700/50",
    settings: {
      textColor: "#cbd5e1",
      borderColor: "#475569",
      borderWidth: 1,
      font: "Sarabun",
      fontWeight: "500",
      textSize: [34],
      amountColor: "#94a3b8",
      donorNameColor: "#94a3b8",
      messageColor: "#cbd5e1",
      amountShine: false,
      prefixText: "🥷 {{user}} 🥷",
      amountText: "{{amount}}฿",
      inAnimation: "fadeInDown",
      outAnimation: "fadeOutDown",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "ไซเบอร์พังก์",
    description: "แบบอนาคตและเทคโนโลยี",
    icon: <Zap className="w-4 h-4" />,
    color: "text-cyan-400",
    bgColor: "from-cyan-900/20 to-blue-800/20",
    borderColor: "border-cyan-700/50",
    settings: {
      textColor: "#cffafe",
      borderColor: "#22d3ee",
      borderWidth: 2,
      font: "IBM Plex Sans Thai",
      fontWeight: "700",
      textSize: [36],
      amountColor: "#67e8f9",
      donorNameColor: "#a5f3fc",
      messageColor: "#cffafe",
      amountShine: true,
      prefixText: "⚡ {{user}} ⚡",
      amountText: "{{amount}}฿",
      inAnimation: "zoomIn",
      outAnimation: "zoomOut",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
  nature: {
    id: "nature",
    name: "ธรรมชาติ",
    description: "แบบต้นไม้และสิ่งแวดล้อม",
    icon: <Leaf className="w-4 h-4" />,
    color: "text-emerald-400",
    bgColor: "from-emerald-900/20 to-green-800/20",
    borderColor: "border-emerald-700/50",
    settings: {
      textColor: "#d1fae5",
      borderColor: "#10b981",
      borderWidth: 2,
      font: "IBM Plex Sans Thai",
      fontWeight: "500",
      textSize: [34],
      amountColor: "#34d399",
      donorNameColor: "#6ee7b7",
      messageColor: "#a7f3d0",
      amountShine: false,
      prefixText: "🌿 {{user}} 🌿",
      amountText: "{{amount}}฿",
      inAnimation: "fadeInUp",
      outAnimation: "fadeOutUp",
      inDuration: 1,
      outDuration: 1,
      displayDuration: 3,
    },
  },
};

const templateCategories = [
  { title: "แนวพื้นฐาน", templates: ["basic", "nature"] },
  { title: "แนวแฟนตาซี", templates: ["fantasy", "dragon", "royal"] },
  { title: "แนวบันเทิง", templates: ["game", "movie", "anime"] },
  { title: "แนวพิเศษ", templates: ["ninja", "cyberpunk"] },
];

function TemplateCard({ template, isSelected, onSelect }) {
  const settings = template.settings;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative w-full text-left rounded-2xl border overflow-hidden group transition-all duration-200
        bg-gradient-to-br ${template.bgColor}
        ${isSelected
          ? "border-cyan-400/70 shadow-lg shadow-cyan-950/40"
          : `${template.borderColor} hover:shadow-lg hover:shadow-black/30`
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px]">
          <Check className="w-3 h-3" />
          Selected
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-950/40 border border-white/10 ${template.color}`}>
            {template.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">{template.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-950/40 border border-white/10 ${template.color}`}>
                {settings.font}
              </span>
            </div>
            <p className="text-xs mt-0.5 text-slate-300/80">{template.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { label: settings.inAnimation, icon: "IN" },
            { label: settings.outAnimation, icon: "OUT" },
            { label: settings.amountShine ? "shine" : "plain", icon: "TXT" },
            { label: `${settings.displayDuration}s`, icon: "TIME" },
          ].map((item, index) => (
            <span
              key={index}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/35 border border-white/10 text-white/70 flex items-center gap-1"
            >
              <span className="font-semibold text-white/45">{item.icon}</span>
              <span className="font-mono">{item.label}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-3">
          {[
            settings.textColor,
            settings.donorNameColor,
            settings.amountColor,
            settings.messageColor,
          ].map((value, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ background: value }}
              title={value}
            />
          ))}
          <span className="ml-auto text-[10px] text-white/45 font-mono">
            {settings.textSize?.[0] || 36}px
          </span>
        </div>
      </div>

      <div className={`absolute inset-x-0 bottom-0 h-8 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <span className="text-[11px] font-semibold text-white flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {isSelected ? "กำลังใช้งาน" : "ใช้ Template นี้"}
        </span>
      </div>
    </motion.button>
  );
}

export default function TemplateTab({
  handleReset,
  handleCopyJSON,
  onTemplateSelect,
  currentTemplate = "basic",
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [apiTemplates, setApiTemplates] = useState({});
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState("");

  const availableTemplates = Object.keys(apiTemplates).length > 0 ? apiTemplates : templates;
  const availableTemplateCategories = buildTemplateCategories(availableTemplates);
  const selectedTemplateData = availableTemplates[selectedTemplate];

  useEffect(() => {
    setSelectedTemplate(currentTemplate);
  }, [currentTemplate]);

  useEffect(() => {
    let active = true;

    const loadThemes = async () => {
      setTemplatesLoading(true);
      setTemplatesError("");

      const payload = await fetchAlertThemes();
      if (!active) return;

      const templateMap = buildTemplateMap(payload?.data || []);
      if (Object.keys(templateMap).length > 0) {
        setApiTemplates(templateMap);
      } else {
        setTemplatesError("โหลด Template จาก API ไม่สำเร็จ กำลังใช้ค่า fallback");
      }

      setTemplatesLoading(false);
    };

    loadThemes();

    return () => {
      active = false;
    };
  }, []);

  const handleTemplateClick = (templateId) => {
    const template = availableTemplates[templateId];
    if (!template) return;

    setSelectedTemplate(templateId);
    onTemplateSelect?.({
      ...template.settings,
      templateId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-4 sm:p-6 space-y-6 sm:space-y-8"
    >
      <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
        <button
          onClick={() => setGalleryOpen((open) => !open)}
          className="w-full flex items-start sm:items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/30">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Template Gallery</p>
              <p className="text-[11px] text-slate-400">เลือกรูปแบบสำเร็จรูปสำหรับ alert ทั้งชุด</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {templatesLoading ? "loading..." : `${Object.keys(availableTemplates).length} templates`}
            </span>
            {galleryOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        <AnimatePresence>
          {galleryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-6">
                {templatesError && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                    {templatesError}
                  </div>
                )}

                {templatesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-36 rounded-2xl border border-slate-700/50 bg-slate-800/40 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  availableTemplateCategories.map((category) => (
                    <div key={category.title}>
                      <h4 className="text-[11px] font-semibold text-slate-400 mb-3 uppercase tracking-[0.18em]">
                        {category.title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {category.templates.map((templateId) => (
                          <TemplateCard
                            key={templateId}
                            template={availableTemplates[templateId]}
                            isSelected={selectedTemplate === templateId}
                            onSelect={() => handleTemplateClick(templateId)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedTemplateData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedTemplateData.bgColor}`}>
                {selectedTemplateData.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white">{selectedTemplateData.name}</h4>
                <p className="text-xs text-slate-400">Template selected</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleTemplateClick(selectedTemplate)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 w-full sm:w-auto"
            >
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
          <p className="text-slate-400 text-sm mb-4">
            Wipes all custom settings and reverts to the system defaults.
          </p>
          <Button variant="destructive" onClick={handleReset} className="bg-red-600 hover:bg-red-700">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Settings
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-white font-medium mb-2 flex items-center gap-2">
            <Copy className="w-4 h-4" /> Import/Export Settings
          </p>
          <p className="text-slate-400 text-sm mb-4">Share your configuration using a JSON string.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
