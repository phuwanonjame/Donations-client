import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Castle, 
  Gamepad2, 
  Film, 
  Tv, 
  Sword, 
  Crown,
  Star,
  Gem,
  Zap,
  Heart,
  Shield,
  Wand,
  Moon,
  Sun,
  Flame,
  Droplets,
  Leaf
} from "lucide-react";


// =====================================
// TEMPLATE LIST
// =====================================

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
      backgroundColor: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
      textColor: '#ffffff',
      borderColor: '#3b82f6',
      borderWidth: 2,
      font: 'default',
      fontWeight: 'medium',
      textSize: [24],
      amountColor: '#3b82f6',
      donorNameColor: '#ffffff',
      messageColor: '#d1d5db',
      amountShine: false
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(88, 28, 135, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
      textColor: '#f3e8ff',
      borderColor: '#c084fc',
      borderWidth: 3,
      font: 'prompt',
      fontWeight: 'bold',
      textSize: [26],
      amountColor: '#e879f9',
      donorNameColor: '#f0abfc',
      messageColor: '#f5d0fe',
      amountShine: true,
      borderStyle: 'double'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(127, 29, 29, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
      textColor: '#fecaca',
      borderColor: '#f87171',
      borderWidth: 4,
      font: 'noto',
      fontWeight: 'bold',
      textSize: [28],
      amountColor: '#fca5a5',
      donorNameColor: '#fca5a5',
      messageColor: '#fecaca',
      amountShine: true,
      borderStyle: 'solid',
      amountSuffix: '🔥'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)',
      textColor: '#d1fae5',
      borderColor: '#10b981',
      borderWidth: 2,
      font: 'ibmplex',
      fontWeight: 'bold',
      textSize: [22],
      amountColor: '#34d399',
      donorNameColor: '#6ee7b7',
      messageColor: '#a7f3d0',
      amountShine: false,
      prefixText: 'Player: {{user}}',
      suffixText: '⚔️'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(120, 53, 15, 0.9) 0%, rgba(245, 158, 11, 0.9) 100%)',
      textColor: '#fef3c7',
      borderColor: '#f59e0b',
      borderWidth: 1,
      font: 'sarabun',
      fontWeight: 'normal',
      textSize: [20],
      amountColor: '#fbbf24',
      donorNameColor: '#fbbf24',
      messageColor: '#fde68a',
      amountShine: false,
      prefixText: 'Star: {{user}}',
      suffixText: '🎬'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(190, 24, 93, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%)',
      textColor: '#fce7f3',
      borderColor: '#f472b6',
      borderWidth: 3,
      font: 'prompt',
      fontWeight: 'medium',
      textSize: [24],
      amountColor: '#f9a8d4',
      donorNameColor: '#f9a8d4',
      messageColor: '#fbcfe8',
      amountShine: true,
      prefixText: 'Kawaii {{user}}',
      suffixText: '🌸',
      messageFont: 'prompt',
      messageFontWeight: 'medium'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(120, 53, 15, 0.9) 0%, rgba(245, 158, 11, 0.9) 100%)',
      textColor: '#fef3c7',
      borderColor: '#f59e0b',
      borderWidth: 4,
      font: 'noto',
      fontWeight: 'bold',
      textSize: [26],
      amountColor: '#fbbf24',
      donorNameColor: '#fde68a',
      messageColor: '#fef3c7',
      amountShine: true,
      prefixText: 'Your Majesty {{user}}',
      suffixText: '👑',
      amountSuffix: '🥇'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      textColor: '#cbd5e1',
      borderColor: '#475569',
      borderWidth: 1,
      font: 'sarabun',
      fontWeight: 'medium',
      textSize: [22],
      amountColor: '#94a3b8',
      donorNameColor: '#94a3b8',
      messageColor: '#cbd5e1',
      amountShine: false,
      prefixText: 'Shinobi {{user}}',
      suffixText: '🗡️',
      amountSuffix: '💨'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(22, 78, 99, 0.9) 0%, rgba(8, 145, 178, 0.9) 100%)',
      textColor: '#cffafe',
      borderColor: '#22d3ee',
      borderWidth: 2,
      font: 'ibmplex',
      fontWeight: 'bold',
      textSize: [24],
      amountColor: '#67e8f9',
      donorNameColor: '#a5f3fc',
      messageColor: '#cffafe',
      amountShine: true,
      prefixText: 'Neo-{{user}}',
      suffixText: '⚡',
      amountSuffix: '💾'
    }
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
      backgroundColor: 'linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)',
      textColor: '#d1fae5',
      borderColor: '#10b981',
      borderWidth: 2,
      font: 'default',
      fontWeight: 'normal',
      textSize: [22],
      amountColor: '#34d399',
      donorNameColor: '#6ee7b7',
      messageColor: '#a7f3d0',
      amountShine: false,
      prefixText: 'Nature Lover {{user}}',
      suffixText: '🌿',
      amountSuffix: '🍃'
    }
  }
};




// =====================================
// MAIN COMPONENT
// =====================================

export default function TemplateTab({ 
  handleReset,
  handleCopyJSON,
  onTemplateSelect,
  currentTemplate = "basic"
}) {
  
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [showAllTemplates, setShowAllTemplates] = useState(false);


  const handleTemplateClick = (templateId) => {
    setSelectedTemplate(templateId);
    if (onTemplateSelect) {
      onTemplateSelect(templates[templateId].settings);
    }
  };

  const templateCategories = [
    { title: "แนวพื้นฐาน", templates: ["basic", "nature"] },
    { title: "แนวแฟนตาซี", templates: ["fantasy", "dragon", "royal"] },
    { title: "แนวบันเทิง", templates: ["game", "movie", "anime"] },
    { title: "แนวพิเศษ", templates: ["ninja", "cyberpunk"] },
  ];


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Template Gallery
        </h3>
        <div className="text-sm text-slate-400">
          {Object.keys(templates).length} templates available
        </div>
      </div>


      {/* TEMPLATE CATEGORIES */}
      <div className="space-y-6">
        {templateCategories.map((category) => (
          <div key={category.title}>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              {category.title}
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.templates.map((templateId) => {
                const template = templates[templateId];
                const isSelected = selectedTemplate === templateId;

                return (
                  <motion.button
                    key={templateId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateClick(templateId)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? `border-cyan-500 bg-cyan-500/10 ${template.bgColor}`
                        : `${template.borderColor} bg-slate-800/30 hover:bg-slate-700/30`
                    }`}
                  >
                    {/* ICON AND STATUS DOT */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-slate-900/50 ${isSelected ? "bg-cyan-900/30" : ""}`}>
                        {template.icon}
                      </div>

                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      )}
                    </div>

                    {/* TEXT INFO */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-semibold ${isSelected ? "text-cyan-300" : template.color}`}>
                          {template.name}
                        </span>

                        {isSelected && (
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                        )}
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



      {/* SHOW MORE BUTTON */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllTemplates(!showAllTemplates)}
          className="border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
        >
          {showAllTemplates ? "Show Less Templates" : "Show All Templates"}
        </Button>
      </div>



      {/* SELECTED TEMPLATE PREVIEW */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${templates[selectedTemplate].bgColor}`}>
                {templates[selectedTemplate].icon}
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  {templates[selectedTemplate].name}
                </h4>
                <p className="text-xs text-slate-400">Template selected</p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => handleTemplateClick(selectedTemplate)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Apply Template
            </Button>
          </div>
        </motion.div>
      )}




      {/* RESET + IMPORT/EXPORT PANEL */}
      <div className="space-y-4">

        {/* RESET SECTION */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-white font-medium mb-2 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset to Default Settings
          </p>

          <p className="text-slate-400 text-sm mb-4">
            Wipes all custom settings and reverts to the system defaults.
          </p>

          <Button 
            variant="destructive"
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Settings
          </Button>
        </div>



        {/* IMPORT / EXPORT JSON */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-white font-medium mb-2 flex items-center gap-2">
            <Copy className="w-4 h-4" /> Import/Export Settings
          </p>

          <p className="text-slate-400 text-sm mb-4">
            Share your configuration using a JSON string.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleCopyJSON}
              className="border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>

            <Button 
              variant="outline" 
              className="border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
