import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchAlertThemes } from "@/actions/DonateAlertapi/donateSettingsApi";
import { normalizeFlatSettings } from "../utils/settingsUtils";
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
      titleMainColor: "#ffffff",
      titleStrokeColor: "#3b82f6",
      titleStrokeWidth: 2,
      titleFontFamily: "IBM Plex Sans Thai",
      titleFontWeight: "700",
      titleFontSize: [36],
      titleAmountColor: "#3b82f6",
      titleUsernameColor: "#ffffff",
      messageColor: "#d1d5db",
      titleAmountShine: false,
      titleText: "{{user}} ",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "fadeInUp",
      animationExitType: "fadeOutUp",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#f3e8ff",
      titleStrokeColor: "#c084fc",
      titleStrokeWidth: 3,
      titleFontFamily: "Prompt",
      titleFontWeight: "700",
      titleFontSize: [38],
      titleAmountColor: "#e879f9",
      titleUsernameColor: "#f0abfc",
      messageColor: "#f5d0fe",
      titleAmountShine: true,
      titleText: "✨ {{user}} ✨",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "zoomIn",
      animationExitType: "fadeOutUp",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#fecaca",
      titleStrokeColor: "#f87171",
      titleStrokeWidth: 4,
      titleFontFamily: "Noto Sans Thai",
      titleFontWeight: "700",
      titleFontSize: [40],
      titleAmountColor: "#fca5a5",
      titleUsernameColor: "#fca5a5",
      messageColor: "#fecaca",
      titleAmountShine: true,
      titleText: "🐉 {{user}} 🐉",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "bounceIn",
      animationExitType: "fadeOutDown",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#d1fae5",
      titleStrokeColor: "#10b981",
      titleStrokeWidth: 2,
      titleFontFamily: "IBM Plex Sans Thai",
      titleFontWeight: "700",
      titleFontSize: [34],
      titleAmountColor: "#34d399",
      titleUsernameColor: "#6ee7b7",
      messageColor: "#a7f3d0",
      titleAmountShine: false,
      titleText: "🎮 {{user}} 🎮",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "slideInLeft",
      animationExitType: "fadeOutUp",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#fef3c7",
      titleStrokeColor: "#f59e0b",
      titleStrokeWidth: 1,
      titleFontFamily: "Sarabun",
      titleFontWeight: "500",
      titleFontSize: [32],
      titleAmountColor: "#fbbf24",
      titleUsernameColor: "#fbbf24",
      messageColor: "#fde68a",
      titleAmountShine: false,
      titleText: "🎬 {{user}} 🎬",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "fadeIn",
      animationExitType: "fadeOut",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#fce7f3",
      titleStrokeColor: "#f472b6",
      titleStrokeWidth: 3,
      titleFontFamily: "Prompt",
      titleFontWeight: "600",
      titleFontSize: [36],
      titleAmountColor: "#f9a8d4",
      titleUsernameColor: "#f9a8d4",
      messageColor: "#fbcfe8",
      titleAmountShine: true,
      titleText: "🌸 {{user}} 🌸",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "zoomIn",
      animationExitType: "fadeOutUp",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#fef3c7",
      titleStrokeColor: "#f59e0b",
      titleStrokeWidth: 4,
      titleFontFamily: "Noto Sans Thai",
      titleFontWeight: "700",
      titleFontSize: [38],
      titleAmountColor: "#fbbf24",
      titleUsernameColor: "#fde68a",
      messageColor: "#fef3c7",
      titleAmountShine: true,
      titleText: "👑 {{user}} 👑",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "bounceIn",
      animationExitType: "fadeOutUp",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#cbd5e1",
      titleStrokeColor: "#475569",
      titleStrokeWidth: 1,
      titleFontFamily: "Sarabun",
      titleFontWeight: "500",
      titleFontSize: [34],
      titleAmountColor: "#94a3b8",
      titleUsernameColor: "#94a3b8",
      messageColor: "#cbd5e1",
      titleAmountShine: false,
      titleText: "🥷 {{user}} 🥷",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "fadeInDown",
      animationExitType: "fadeOutDown",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#cffafe",
      titleStrokeColor: "#22d3ee",
      titleStrokeWidth: 2,
      titleFontFamily: "IBM Plex Sans Thai",
      titleFontWeight: "700",
      titleFontSize: [36],
      titleAmountColor: "#67e8f9",
      titleUsernameColor: "#a5f3fc",
      messageColor: "#cffafe",
      titleAmountShine: true,
      titleText: "⚡ {{user}} ⚡",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "zoomIn",
      animationExitType: "zoomOut",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
      titleMainColor: "#d1fae5",
      titleStrokeColor: "#10b981",
      titleStrokeWidth: 2,
      titleFontFamily: "IBM Plex Sans Thai",
      titleFontWeight: "500",
      titleFontSize: [34],
      titleAmountColor: "#34d399",
      titleUsernameColor: "#6ee7b7",
      messageColor: "#a7f3d0",
      titleAmountShine: false,
      titleText: "🌿 {{user}} 🌿",
      titleAmountText: "{{amount}}฿",
      animationEnterType: "fadeInUp",
      animationExitType: "fadeOutUp",
      animationEnterDuration: 1,
      animationExitDuration: 1,
      animationDisplayDuration: 3,
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
  const settings = normalizeFlatSettings(template.settings);

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
                {settings.titleFontFamily}
              </span>
            </div>
            <p className="text-xs mt-0.5 text-slate-300/80">{template.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { label: settings.animationEnterType, icon: "IN" },
            { label: settings.animationExitType, icon: "OUT" },
            { label: settings.titleAmountShine ? "shine" : "plain", icon: "TXT" },
            { label: `${settings.animationDisplayDuration}s`, icon: "TIME" },
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
            settings.titleMainColor,
            settings.titleUsernameColor,
            settings.titleAmountColor,
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
            {(Array.isArray(settings.titleFontSize) ? settings.titleFontSize[0] : settings.titleFontSize) || 36}px
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
      ...normalizeFlatSettings(template.settings),
      templateId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8"
    >
      <div className="space-y-4">
        <button
          onClick={() => setGalleryOpen((open) => !open)}
          className="w-full flex items-start sm:items-center justify-between gap-3 px-1 py-1"
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
              <div className="space-y-6">
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
          className="mt-2 p-4 rounded-xl bg-slate-800/30"
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
