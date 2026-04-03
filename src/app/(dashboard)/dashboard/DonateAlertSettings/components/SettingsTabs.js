// ==================== SettingsTabs.js (FIXED) ====================
// FIX: ส่ง effectiveSettings + updateSetting ที่ถูก context ไปที่ FullscreenVisualEditor
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image, Volume2, Type, Sparkles, Zap, RotateCcw, 
  Pencil, ChevronRight, Palette, Layout, Layers,
  Globe, ChevronDown, Check, AlertCircle, ArrowLeft,
  Plus, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import MediaTab    from "./tabs/MediaTab";
import SoundTab    from "./tabs/SoundTab";
import TextTab     from "./tabs/TextTab";
import DisplayTab  from "./tabs/DisplayTab";
import EffectsTab  from "./tabs/EffectsTab";
import RangesTab   from "./tabs/RangesTab";
import TemplateTab from "./tabs/TemplateTab";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CONTENT_TABS = [
  { id:"media",   label:"Media",   icon:Image,    color:"from-blue-500 to-cyan-500",    description:"Images & animations" },
  { id:"sound",   label:"Sound",   icon:Volume2,  color:"from-purple-500 to-pink-500",  description:"Audio & effects" },
  { id:"text",    label:"Text",    icon:Type,     color:"from-green-500 to-emerald-500", description:"Typography & styling" },
  { id:"display", label:"Display", icon:Sparkles, color:"from-orange-500 to-red-500",   description:"Visual effects" },
  { id:"effects", label:"Effects", icon:Zap,      color:"from-yellow-500 to-amber-500", description:"Transitions & animations" },
];

const ALL_TABS = [
  ...CONTENT_TABS,
  { id:"ranges",   label:"Ranges",   icon:Layers,    color:"from-cyan-500 to-blue-500",     description:"Donation ranges" },
  { id:"template", label:"Template", icon:RotateCcw, color:"from-indigo-500 to-purple-500", description:"Presets & layouts" },
];

/* ─────────────────────────────────────────────
   RANGE SELECTOR DROPDOWN
───────────────────────────────────────────── */
function RangeContextSelector({ ranges, activeRangeId, onSelect, onClear }) {
  const [open, setOpen] = useState(false);
  const activeRange = ranges.find(r => r.id === activeRangeId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium
          transition-all duration-200 min-w-[180px] justify-between
          ${activeRange
            ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
            : "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:border-slate-500"
          }
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          {activeRange ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: activeRange.color || "#00e5ff" }} />
              <span className="truncate">{activeRange.name || `Range #${activeRange.id}`}</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Default (Global)</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open?"rotate-180":""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-6, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-6, scale:0.97 }}
            transition={{ duration:0.15 }}
            className="absolute top-full mt-1.5 left-0 w-full min-w-[220px] z-50
                       bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => { onClear(); setOpen(false); }}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left
                ${!activeRange ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300 hover:bg-slate-800"}
              `}
            >
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">Default (Global)</p>
                <p className="text-[10px] text-slate-500">ใช้ settings หลัก</p>
              </div>
              {!activeRange && <Check className="w-3.5 h-3.5 ml-auto text-cyan-400 shrink-0" />}
            </button>

            {ranges.length > 0 && (
              <>
                <div className="h-px bg-slate-700/60 mx-2" />
                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Ranges ({ranges.length})
                  </p>
                </div>
                {ranges
                  .sort((a,b) => (a.priority||0)-(b.priority||0))
                  .map(range => (
                    <button
                      key={range.id}
                      onClick={() => { onSelect(range.id); setOpen(false); }}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left
                        ${activeRangeId===range.id ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300 hover:bg-slate-800"}
                      `}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0 border border-white/20"
                        style={{ background: range.color||"#00e5ff" }} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{range.name||`Range #${range.id}`}</p>
                        <p className="text-[10px] text-slate-500">
                          {range.minAmount??0}฿{range.maxAmount?` – ${range.maxAmount}฿`:"+"}
                          {range.isCustomized
                            ? <span className="ml-1.5 text-cyan-500/80">✦ custom</span>
                            : <span className="ml-1.5 text-slate-600">= default</span>
                          }
                        </p>
                      </div>
                      {activeRangeId===range.id && <Check className="w-3.5 h-3.5 ml-auto text-cyan-400 shrink-0" />}
                    </button>
                  ))}
              </>
            )}

            {ranges.length === 0 && (
              <div className="px-3 py-3 text-xs text-slate-500 text-center">
                ยังไม่มี Range — ไปที่แท็บ Ranges เพื่อสร้าง
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RANGE CONTEXT BANNER
───────────────────────────────────────────── */
function RangeContextBanner({ range, onClear, onResetToDefault }) {
  return (
    <motion.div
      initial={{ opacity:0, height:0 }}
      animate={{ opacity:1, height:"auto" }}
      exit={{ opacity:0, height:0 }}
      transition={{ duration:0.2 }}
      className="overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl
                      bg-gradient-to-r from-cyan-500/10 to-blue-500/10
                      border border-cyan-500/30 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: range.color||"#00e5ff" }} />
          <span className="text-cyan-300 font-medium truncate">
            กำลังแก้ Range: {range.name||`Range #${range.id}`}
          </span>
          <span className="text-slate-500 text-xs hidden sm:inline">
            ({range.minAmount??0}฿{range.maxAmount?` – ${range.maxAmount}฿`:"+"})
          </span>
          {range.isCustomized
            ? <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-[10px] px-1.5 py-0.5">Customized</Badge>
            : <Badge className="bg-slate-700/50 text-slate-400 border-0 text-[10px] px-1.5 py-0.5">= Default</Badge>
          }
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onResetToDefault}
            title="Reset ค่า Range นี้กลับเป็น Default settings"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg
                       bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white
                       border border-slate-600/50 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Reset to Default
          </button>
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-slate-700/40 hover:bg-slate-700
                       text-slate-400 hover:text-white transition-all border border-slate-600/50"
            title="กลับไปแก้ Default"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TAB NAV
───────────────────────────────────────────── */
function TabNav({ tabs, activeTab, onSelect }) {
  return (
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
                onClick={() => onSelect(tab.id)}
                className={`
                  relative px-3 py-3 rounded-lg transition-all duration-300 group
                  ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"}
                `}
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.98 }}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-r ${tab.color}`}
                    layoutId="activeTab"
                    transition={{ type:"spring", bounce:0.2, duration:0.6 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon className={`w-5 h-5 transition-all duration-300 ${isActive?"scale-110":"group-hover:scale-105"}`} />
                  <span className="text-xs font-medium hidden sm:block">{tab.label}</span>
                  <span className="text-[10px] font-medium block sm:hidden">{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   
   FIX: onOpenVisualEditor ตอนนี้รับ callback ที่ส่ง
        effectiveSettings + context-aware updateSetting ออกไป
        แทนที่จะส่งแค่ flag "เปิด editor"
───────────────────────────────────────────── */
export default function SettingsTabs({
  settings,
  updateSetting,
  handleReset,
  handleCopyJSON,
  onOpenVisualEditor,       // (effectiveSettings, updateFn) → void
  onEffectiveSettingsChange,
}) {
  const [activeTab, setActiveTab]               = useState("template");
  const [isHoveringVisual, setIsHoveringVisual] = useState(false);
  const [activeRangeId, setActiveRangeId]       = useState(null);

  const ranges      = settings?.donationRanges || [];
  const activeRange = ranges.find(r => r.id === activeRangeId) || null;

  // ── effectiveSettings = ค่าที่ tab และ Visual Editor ใช้ ─
  const effectiveSettings = activeRange
    ? { ...settings, ...activeRange, donationRanges: settings.donationRanges }
    : settings;

  // แจ้ง parent
  const effectiveKey = activeRangeId ?? "global";
  React.useEffect(() => {
    onEffectiveSettingsChange?.(effectiveSettings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveKey, settings]);

  // ── context-aware updateSetting ───────────────────────
  const handleUpdateSetting = useCallback((key, value) => {
    if (activeRange) {
      const updatedRanges = (settings.donationRanges||[]).map(r => {
        if (r.id !== activeRangeId) return r;
        return { ...r, [key]:value, isCustomized:true };
      });
      updateSetting("donationRanges", updatedRanges);
    } else {
      updateSetting(key, value);
    }
  }, [activeRange, activeRangeId, settings.donationRanges, updateSetting]);

  // ── reset range กลับไปใช้ global ─────────────────────
  const handleResetRangeToDefault = useCallback(() => {
    if (!activeRange) return;
    if (!window.confirm(`Reset "${activeRange.name}" กลับไปใช้ค่า Default settings?`)) return;
    const { donationRanges, useRanges, ...globalConfig } = settings;
    const updatedRanges = (settings.donationRanges||[]).map(r => {
      if (r.id !== activeRangeId) return r;
      return {
        id:r.id, name:r.name, minAmount:r.minAmount,
        maxAmount:r.maxAmount, priority:r.priority, color:r.color,
        ...globalConfig,
        isCustomized: false,
      };
    });
    updateSetting("donationRanges", updatedRanges);
  }, [activeRange, activeRangeId, settings, updateSetting]);

  // ── tab select ────────────────────────────────────────
  const handleTabSelect = (tabId) => {
    if (tabId === "ranges") setActiveRangeId(null);
    setActiveTab(tabId);
  };

  const visibleTabs = activeRange ? CONTENT_TABS : ALL_TABS;
  const safeActiveTab = visibleTabs.find(t => t.id === activeTab) ? activeTab : "media";

  // ── FIX: เปิด Visual Editor พร้อม context ──────────
  // ส่ง effectiveSettings และ handleUpdateSetting ออกไปด้วย
  // เพื่อให้ editor แก้ range หรือ global ได้ถูก context
  const handleOpenVisualEditor = useCallback(() => {
    onOpenVisualEditor(effectiveSettings, handleUpdateSetting);
  }, [onOpenVisualEditor, effectiveSettings, handleUpdateSetting]);

  const containerVariants = {
    hidden:  { opacity:0, y:20 },
    visible: { opacity:1, y:0, transition:{ duration:0.3, staggerChildren:0.05 } },
    exit:    { opacity:0, y:-20, transition:{ duration:0.2 } },
  };

  const contentVariants = {
    hidden:  { opacity:0, x:-20 },
    visible: { opacity:1, x:0, transition:{ duration:0.25 } },
    exit:    { opacity:0, x:20, transition:{ duration:0.2 } },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Visual Editor Card */}
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
                  <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">NEW</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Edit your alert in fullscreen mode with real-time preview
                  {activeRange && (
                    <span className="ml-2 text-cyan-400/80 text-xs">
                      · Range: {activeRange.name}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={handleOpenVisualEditor}
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
                initial={{ x:"-100%" }}
                animate={{ x: isHoveringVisual ? "100%" : "-100%" }}
                transition={{ duration:0.5 }}
              />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <div className="space-y-4">

        {/* Context Switcher Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {settings?.useRanges && ranges.length > 0 && (
            <RangeContextSelector
              ranges={ranges}
              activeRangeId={activeRangeId}
              onSelect={(id) => {
                setActiveRangeId(id);
                if (!CONTENT_TABS.find(t => t.id === activeTab)) setActiveTab("media");
              }}
              onClear={() => setActiveRangeId(null)}
            />
          )}
          {settings?.useRanges && ranges.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-500/70" />
              <span>ไปที่ Tab <strong className="text-slate-300">Ranges</strong> เพื่อสร้าง Range แรก</span>
            </div>
          )}
        </div>

        {/* Range Context Banner */}
        <AnimatePresence>
          {activeRange && (
            <RangeContextBanner
              range={activeRange}
              onClear={() => setActiveRangeId(null)}
              onResetToDefault={handleResetRangeToDefault}
            />
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <TabNav tabs={visibleTabs} activeTab={safeActiveTab} onSelect={handleTabSelect} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${safeActiveTab}-${activeRangeId ?? "global"}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6"
          >
            {safeActiveTab === "media"    && <MediaTab    settings={effectiveSettings} updateSetting={handleUpdateSetting} />}
            {safeActiveTab === "sound"    && <SoundTab    settings={effectiveSettings} updateSetting={handleUpdateSetting} />}
            {safeActiveTab === "text"     && <TextTab     settings={effectiveSettings} updateSetting={handleUpdateSetting} />}
            {safeActiveTab === "display"  && <DisplayTab  settings={effectiveSettings} updateSetting={handleUpdateSetting} />}
            {safeActiveTab === "effects"  && <EffectsTab  settings={effectiveSettings} updateSetting={handleUpdateSetting} />}
            {safeActiveTab === "ranges"   && (
              <RangesTab
                settings={settings}
                updateSetting={updateSetting}
                onEditRange={(rangeId) => {
                  setActiveRangeId(rangeId);
                  setActiveTab("media");
                }}
              />
            )}
            {safeActiveTab === "template" && (
              <TemplateTab
                currentTemplate={settings.templateId || "basic"}
                handleReset={handleReset}
                handleCopyJSON={handleCopyJSON}
                onTemplateSelect={(newTemplateSettings) => {
                  Object.entries(newTemplateSettings).forEach(([key,value]) => updateSetting(key,value));
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}