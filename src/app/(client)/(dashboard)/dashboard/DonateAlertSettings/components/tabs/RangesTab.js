// ==================== RangesTab.js (UPDATED) ====================
// แก้: ใช้ RangeTemplateSelector ใหม่ + ส่ง existingRanges เพื่อ track ว่า template ไหน added แล้ว
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Plus, Trash2, Edit2, Copy,
  ChevronDown, ChevronUp, AlertCircle,
  Zap, Info, RotateCcw, Settings2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RangeConfigModal from "../ranges/RangeConfigModal";
import RangeTemplateSelector from "../ranges/RangeTemplateSelector";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function buildDefaultRangeConfig(settings) {
  return {
    alertSound:      settings?.alertSound      ?? "bb_spirit",
    volume:          settings?.volume          ?? [75],
    useCustomSound:  settings?.useCustomSound  ?? false,
    customSound:     settings?.customSound     ?? null,
    ttsVoice:        settings?.ttsVoice        ?? "female",
    ttsRate:         settings?.ttsRate         ?? 0.5,
    ttsPitch:        settings?.ttsPitch        ?? 0.5,
    ttsTitleEnabled: settings?.ttsTitleEnabled ?? true,
    ttsMessageEnabledField: settings?.ttsMessageEnabledField ?? false,
    ttsVolume:       settings?.ttsVolume       ?? 50,
    alertImage:      settings?.alertImage      ?? settings?.image ?? "",
    image:           settings?.image           ?? settings?.alertImage ?? "",
    inAnimation:     settings?.inAnimation     ?? "fadeInUp",
    inDuration:      settings?.inDuration      ?? 1,
    outAnimation:    settings?.outAnimation    ?? "fadeOutUp",
    outDuration:     settings?.outDuration     ?? 1,
    displayDuration: settings?.displayDuration ?? 3,
    font:               settings?.font               ?? "IBM Plex Sans Thai",
    fontWeight:         settings?.fontWeight         ?? "700",
    textSize:           settings?.textSize           ?? [36],
    textColor:          settings?.textColor          ?? "#FFFFFF",
    donorNameColor:     settings?.donorNameColor      ?? "#FF9500",
    amountColor:        settings?.amountColor         ?? "#0EA5E9",
    borderWidth:        settings?.borderWidth         ?? 2.5,
    borderColor:        settings?.borderColor         ?? "#000000",
    prefixText:         settings?.prefixText          ?? "{{user}} ",
    amountText:         settings?.amountText          ?? "{{amount}}฿",
    amountSuffix:       settings?.amountSuffix        ?? "฿",
    amountShine:        settings?.amountShine         ?? true,
    showName:           settings?.showName            ?? true,
    showAmount:         settings?.showAmount          ?? true,
    messageFont:        settings?.messageFont         ?? "IBM Plex Sans Thai",
    messageFontWeight:  settings?.messageFontWeight   ?? "500",
    messageFontSize:    settings?.messageFontSize      ?? 24,
    messageColor:       settings?.messageColor         ?? "#FFFFFF",
    messageBorderWidth: settings?.messageBorderWidth  ?? 2.5,
    messageBorderColor: settings?.messageBorderColor  ?? "#000000",
    showMessage:        settings?.showMessage          ?? true,
    effect:          settings?.effect          ?? "realistic_look",
    imageGlow:       settings?.imageGlow       ?? false,
    showConfetti:    settings?.showConfetti    ?? false,
    confettiEffect:  settings?.confettiEffect  ?? "fountain",
    backgroundColor: settings?.backgroundColor ?? "transparent",
    isCustomized: false,
  };
}

/* ─────────────────────────────────────────────
   RANGE CARD
───────────────────────────────────────────── */
function RangeCard({ range, onEdit, onEditConfig, onDelete, onDuplicate, onResetToDefault }) {
  const [expanded, setExpanded] = useState(false);

  const configKeys = [
    { key: "alertSound",      label: "Sound" },
    { key: "inAnimation",     label: "Anim In" },
    { key: "effect",          label: "Effect" },
    { key: "amountColor",     label: "Amount Color", isColor: true },
    { key: "displayDuration", label: "Duration", suffix: "s" },
  ];

  // หาว่า range นี้มาจาก template ไหน (ถ้ามี)
  const templateLabel = range._templateId ? `จาก template` : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Color dot */}
        <span
          className="w-3 h-3 rounded-full shrink-0 border border-white/20"
          style={{ background: range.color || "#00e5ff" }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-medium text-sm truncate">
              {range.name || `Range #${range.id}`}
            </p>
            {templateLabel && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/20 shrink-0">
                template
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs">
            {range.minAmount ?? 0}฿{range.maxAmount ? ` – ${range.maxAmount}฿` : "+"}
          </p>
        </div>

        {/* Badges */}
        {range.isCustomized
          ? <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-[10px] shrink-0">Customized</Badge>
          : <Badge className="bg-slate-700/50 text-slate-500 border-0 text-[10px] shrink-0">= Default</Badge>
        }

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            onClick={onEditConfig}
            className="h-7 px-2.5 text-xs bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white gap-1"
          >
            <Settings2 className="w-3 h-3" />Config<ArrowRight className="w-3 h-3" />
          </Button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="แก้ชื่อและช่วงเงิน"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-700/50"
          >
            <div className="p-3 space-y-3">
              {/* Quick config pills */}
              <div className="grid grid-cols-3 gap-2">
                {configKeys.map(({ key, label, isColor, suffix }) => {
                  const val = range[key];
                  if (val === undefined) return null;
                  return (
                    <div key={key} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
                      <div className="flex items-center gap-1">
                        {isColor && (
                          <span className="w-3 h-3 rounded-full border border-slate-600" style={{ background: val }} />
                        )}
                        <span className="text-xs text-slate-300 font-mono truncate">
                          {isColor ? val : `${val}${suffix || ""}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Color swatches */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500">Colors:</span>
                {[range.textColor, range.donorNameColor, range.amountColor, range.messageColor]
                  .filter(Boolean)
                  .map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} title={c} />
                  ))}
                <span className="ml-auto text-[10px] text-slate-500 font-mono">{range.font || "—"}</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-700/40">
                <button
                  onClick={onEditConfig}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                >
                  <Settings2 className="w-3 h-3" /> Edit Config
                </button>
                <button
                  onClick={onResetToDefault}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset to Default
                </button>
                <button
                  onClick={onDuplicate}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function RangesTab({ settings, updateSetting, onEditRange }) {
  const [ranges, setRanges]           = useState(settings?.donationRanges || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRange, setEditingRange] = useState(null);

  // sync เมื่อ donationRanges จาก props เปลี่ยน
  useEffect(() => {
    setRanges(settings?.donationRanges || []);
  }, [settings?.donationRanges]);

  const useRanges = settings?.useRanges ?? false;

  const syncRanges = (updatedRanges) => {
    setRanges(updatedRanges);
    updateSetting("donationRanges", updatedRanges);
  };

  const handleSaveRangeMetadata = (rangeConfig) => {
    let updated;
    if (ranges.find(r => r.id === rangeConfig.id)) {
      updated = ranges.map(r => r.id === rangeConfig.id ? { ...r, ...rangeConfig } : r);
    } else {
      updated = [...ranges, {
        ...buildDefaultRangeConfig(settings),
        ...rangeConfig,
        id: rangeConfig.id || Date.now(),
      }];
    }
    syncRanges(updated);
    setIsModalOpen(false);
    setEditingRange(null);
  };

  const handleDeleteRange = (id) => {
    if (!window.confirm("Delete this range?")) return;
    syncRanges(ranges.filter(r => r.id !== id));
  };

  const handleDuplicateRange = (range) => {
    const newRange = {
      ...range,
      id: Date.now(),
      name: `${range.name} (Copy)`,
      priority: ranges.length + 1,
      _templateId: undefined, // reset template origin
    };
    syncRanges([...ranges, newRange]);
  };

  const handleResetRangeToDefault = (rangeId) => {
    if (!window.confirm("Reset this range's config to match Default settings?")) return;
    const defaultConfig = buildDefaultRangeConfig(settings);
    const updated = ranges.map(r => {
      if (r.id !== rangeId) return r;
      return {
        id: r.id,
        name: r.name,
        minAmount: r.minAmount,
        maxAmount: r.maxAmount,
        priority: r.priority,
        color: r.color,
        _templateId: r._templateId,
        ...defaultConfig,
        isCustomized: false,
      };
    });
    syncRanges(updated);
  };

  const handleOpenNewRange = () => {
    setEditingRange({
      id: null,
      name: "",
      minAmount: 0,
      maxAmount: null,
      priority: ranges.length + 1,
      color: "#00e5ff",
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* ── Header Toggle ── */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Donation Ranges System
          </h3>
          <p className="text-slate-400 text-sm mt-1">กำหนด config ต่างกันตามจำนวนเงิน donate</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={useRanges ? "default" : "secondary"}
            className={useRanges ? "bg-cyan-500" : "bg-slate-600"}
          >
            {useRanges ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={useRanges}
            onCheckedChange={(v) => updateSetting("useRanges", v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>
      </div>

      {/* ── How-to hint ── */}
      {useRanges && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-sm"
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
          <div className="space-y-0.5 text-blue-300/80 text-xs">
            <p className="font-medium text-blue-200 text-sm">วิธีใช้ Range config</p>
            <p>
              1. เลือก Quick Template หรือกด <strong>Add Range</strong> เพื่อสร้างเอง<br />
              2. กดปุ่ม <strong>Config →</strong> เพื่อแก้ Media / Sound / Text / Effects<br />
              3. Tab ด้านบนจะ switch มาแสดงข้อมูลของ Range<br />
              4. ใช้ <strong>Reset to Default</strong> เพื่อ copy ค่า Default มา
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Main content ── */}
      {useRanges ? (
        <div className="space-y-4">

          {/* Quick Templates */}
          <RangeTemplateSelector
            existingRanges={ranges}
            onSelectTemplate={(templateConfig) => {
              const newRange = {
                id: Date.now(),
                ...buildDefaultRangeConfig(settings), // base
                ...templateConfig,                    // template override (config ของ template เอง)
                isCustomized: true,
              };
              syncRanges([...ranges, newRange]);
            }}
          />

          {/* Range list header */}
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Ranges ที่ตั้งค่าไว้
              <span className="text-slate-500 text-sm font-normal">({ranges.length})</span>
            </h4>
            <Button
              onClick={handleOpenNewRange}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Range
            </Button>
          </div>

          {/* Empty state */}
          {ranges.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="py-12 text-center">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">ยังไม่มี Range</p>
                <p className="text-slate-500 text-xs mt-1 mb-4">
                  เลือก Quick Template ด้านบน หรือสร้างเองด้วยปุ่มด้านล่าง
                </p>
                <Button onClick={handleOpenNewRange} variant="outline" className="border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4 mr-2" /> Create Your First Range
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {[...ranges]
                .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                .map(range => (
                  <RangeCard
                    key={range.id}
                    range={range}
                    onEdit={() => { setEditingRange(range); setIsModalOpen(true); }}
                    onEditConfig={() => onEditRange?.(range.id)}
                    onDelete={() => handleDeleteRange(range.id)}
                    onDuplicate={() => handleDuplicateRange(range)}
                    onResetToDefault={() => handleResetRangeToDefault(range.id)}
                  />
                ))}
            </AnimatePresence>
          )}
        </div>
      ) : (
        /* Disabled state */
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="py-16 text-center">
            <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Ranges system is disabled</p>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              เปิดใช้เพื่อกำหนด alert ที่แตกต่างกันตามจำนวนเงิน donate
            </p>
            <Button
              onClick={() => updateSetting("useRanges", true)}
              className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Enable Ranges System
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Modal ── */}
      <RangeConfigModal
        range={editingRange}
        defaultSettings={settings}
        onSave={handleSaveRangeMetadata}
        onDelete={handleDeleteRange}
        onDuplicate={handleDuplicateRange}
        onClose={() => { setIsModalOpen(false); setEditingRange(null); }}
        isOpen={isModalOpen}
      />
    </motion.div>
  );
}