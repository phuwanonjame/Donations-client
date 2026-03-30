// ในไฟล์: ./components/SettingsTabs.js
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Image, Volume2, Type, Sparkles, Zap, RotateCcw, 
  Eye, Code, Pencil, ChevronRight, Palette, Layout, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Import Tabs
import MediaTab from "./tabs/MediaTab";
import SoundTab from "./tabs/SoundTab";
import TextTab from "./tabs/TextTab";
import DisplayTab from "./tabs/DisplayTab";
import EffectsTab from "./tabs/EffectsTab";
import RangesTab from "./tabs/RangesTab";
import TemplateTab from "./tabs/TemplateTab";

export default function SettingsTabs({ 
  settings, 
  updateSetting,
  handleReset,
  handleCopyJSON,
  onOpenVisualEditor
}) {
  const [activeTab, setActiveTab] = useState("template");
  const [isHoveringVisual, setIsHoveringVisual] = useState(false);

  const tabs = [
    { id: "media", label: "Media", icon: Image, color: "from-blue-500 to-cyan-500", description: "Images & animations" },
    { id: "sound", label: "Sound", icon: Volume2, color: "from-purple-500 to-pink-500", description: "Audio & effects" },
    { id: "text", label: "Text", icon: Type, color: "from-green-500 to-emerald-500", description: "Typography & styling" },
    { id: "display", label: "Display", icon: Sparkles, color: "from-orange-500 to-red-500", description: "Visual effects" },
    { id: "effects", label: "Effects", icon: Zap, color: "from-yellow-500 to-amber-500", description: "Transitions & animations" },
    { id: "ranges", label: "Ranges", icon: Layers, color: "from-cyan-500 to-blue-500", description: "Donation ranges" },
    { id: "template", label: "Template", icon: RotateCcw, color: "from-indigo-500 to-purple-500", description: "Presets & layouts" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Visual Editor Card - Enhanced Design */}
      <motion.div 
        variants={containerVariants}
        className="relative group"
        onMouseEnter={() => setIsHoveringVisual(true)}
        onMouseLeave={() => setIsHoveringVisual(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-5 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-md opacity-50 animate-pulse" />
                <div className="relative p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  Visual Editor
                  <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                    NEW
                  </span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Edit your alert in fullscreen mode with real-time preview
                </p>
              </div>
            </div>
            
            <Button
              onClick={onOpenVisualEditor}
              className="group/btn relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                Open Visual Editor
                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                animate={{ x: isHoveringVisual ? "100%" : "-100%" }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tabs Section */}
      <div className="space-y-6">
        {/* Modern Tab Navigation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl blur" />
          <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
            <div className="grid grid-cols-4 md:grid-cols-7 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-3 py-3 rounded-lg transition-all duration-300 group
                      ${isActive 
                        ? "text-white" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-r ${tab.color}`}
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
                      <span className="text-xs font-medium hidden sm:block">{tab.label}</span>
                      <span className="text-[10px] font-medium block sm:hidden">{tab.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6"
          >
            {activeTab === "media" && (
              <MediaTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === "sound" && (
              <SoundTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === "text" && (
              <TextTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === "display" && (
              <DisplayTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === "effects" && (
              <EffectsTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === "ranges" && (
              <RangesTab settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === "template" && (
              <TemplateTab 
                currentTemplate={settings.templateId || "basic"}
                handleReset={handleReset} 
                handleCopyJSON={handleCopyJSON}
                onTemplateSelect={(newTemplateSettings) => {
                  Object.entries(newTemplateSettings).forEach(([key, value]) => {
                    updateSetting(key, value);
                  });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}