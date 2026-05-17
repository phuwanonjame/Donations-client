import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  RotateCcw,
  Settings2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RangeConfigModal from "../ranges/RangeConfigModal";
import RangeTemplateSelector from "../ranges/RangeTemplateSelector";
import { useDonateAlertSettings } from "../context/DonateAlertSettingsProvider";

function createRangeId(ranges, prefix = "range") {
  const existingIds = new Set((ranges || []).map((range) => String(range.id)));
  let index = (ranges?.length || 0) + 1;
  let candidate = `${prefix}-${index}`;

  while (existingIds.has(candidate)) {
    index += 1;
    candidate = `${prefix}-${index}`;
  }

  return candidate;
}

function RangeCard({ range, onEdit, onEditConfig, onDelete, onDuplicate, onResetToDefault }) {
  const [expanded, setExpanded] = useState(false);

  const configKeys = [
    { key: "notificationSound", label: "Sound" },
    { key: "animationEnterType", label: "Anim In" },
    { key: "effect", label: "Effect" },
    { key: "titleAmountColor", label: "Amount Color", isColor: true },
    { key: "animationDisplayDuration", label: "Duration", suffix: "s" },
  ];

  const templateLabel = range._templateId ? "template" : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3">
        <span
          className="w-3 h-3 rounded-full shrink-0 border border-white/20"
          style={{ background: range.color || "#00e5ff" }}
        />

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-medium text-sm truncate">{range.name || `Range #${range.id}`}</p>
            {templateLabel && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/20 shrink-0">
                {templateLabel}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs">
            {range.minAmount ?? 0}฿{range.maxAmount ? ` - ${range.maxAmount}฿` : "+"}
          </p>
        </div>

        {range.isCustomized ? (
          <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-[10px] shrink-0">Customized</Badge>
        ) : (
          <Badge className="bg-slate-700/50 text-slate-500 border-0 text-[10px] shrink-0">= Default</Badge>
        )}

        <div className="grid grid-cols-[1fr_auto_auto] sm:flex sm:items-center gap-1 shrink-0 w-full sm:w-auto">
          <Button
            size="sm"
            onClick={onEditConfig}
            className="h-8 sm:h-7 px-2.5 text-xs bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white gap-1"
          >
            <Settings2 className="w-3 h-3" />
            Config
            <ArrowRight className="w-3 h-3" />
          </Button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Edit range metadata"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded((value) => !value)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {configKeys.map(({ key, label, isColor, suffix }) => {
                  const value = range[key];
                  if (value === undefined) return null;

                  return (
                    <div key={key} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
                      <div className="flex items-center gap-1">
                        {isColor && (
                          <span className="w-3 h-3 rounded-full border border-slate-600" style={{ background: value }} />
                        )}
                        <span className="text-xs text-slate-300 font-mono truncate">
                          {isColor ? value : `${value}${suffix || ""}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500">Colors:</span>
                {[range.titleMainColor, range.titleUsernameColor, range.titleAmountColor, range.messageColor]
                  .filter(Boolean)
                  .map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                <span className="ml-auto text-[10px] text-slate-500 font-mono">{range.titleFontFamily || "-"}</span>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-1 border-t border-slate-700/40">
                <button
                  onClick={onEditConfig}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                >
                  <Settings2 className="w-3 h-3" /> Edit Config
                </button>
                <button
                  onClick={onResetToDefault}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset to Default
                </button>
                <button
                  onClick={onDuplicate}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors sm:ml-auto"
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

export default function RangesTab({ onEditRange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRange, setEditingRange] = useState(null);
  const {
    normalizedSettings,
    ranges,
    updateGlobalSetting,
    replaceRanges,
    buildRangeSettings,
  } = useDonateAlertSettings();

  const useRanges = normalizedSettings?.rangesUseRanges ?? false;

  const handleSaveRangeMetadata = (rangeConfig) => {
    let updatedRanges;

    if (ranges.find((range) => range.id === rangeConfig.id)) {
      updatedRanges = ranges.map((range) => (range.id === rangeConfig.id ? { ...range, ...rangeConfig } : range));
    } else {
      updatedRanges = [
        ...ranges,
        buildRangeSettings({
          ...rangeConfig,
          id: rangeConfig.id || createRangeId(ranges),
        }),
      ];
    }

    replaceRanges(updatedRanges);
    setIsModalOpen(false);
    setEditingRange(null);
  };

  const handleDeleteRange = (id) => {
    if (!window.confirm("Delete this range?")) return;
    replaceRanges(ranges.filter((range) => range.id !== id));
  };

  const handleDuplicateRange = (range) => {
    const newRange = {
      ...range,
      id: createRangeId(ranges, `${range.id}-copy`),
      name: `${range.name} (Copy)`,
      priority: ranges.length + 1,
      _templateId: undefined,
    };

    replaceRanges([...ranges, newRange]);
  };

  const handleResetRangeToDefault = (rangeId) => {
    if (!window.confirm("Reset this range's config to match Default settings?")) return;

    const updatedRanges = ranges.map((range) => {
      if (range.id !== rangeId) return range;

      return buildRangeSettings({
        id: range.id,
        name: range.name,
        minAmount: range.minAmount,
        maxAmount: range.maxAmount,
        priority: range.priority,
        color: range.color,
        _templateId: range._templateId,
        isCustomized: false,
      });
    });

    replaceRanges(updatedRanges);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Donation Ranges System
          </h3>
          <p className="text-slate-400 text-sm mt-1">Set different alert configs by donation amount.</p>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <Badge variant={useRanges ? "default" : "secondary"} className={useRanges ? "bg-cyan-500" : "bg-slate-600"}>
            {useRanges ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={useRanges}
            onCheckedChange={(value) => updateGlobalSetting("rangesUseRanges", value)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>
      </div>

      {useRanges && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-sm"
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
          <div className="space-y-0.5 text-blue-300/80 text-xs">
            <p className="font-medium text-blue-200 text-sm">How ranges work</p>
            <p>
              1. Pick a quick template or create a new range.
              <br />
              2. Open Config to customize Media, Sound, Text, or Effects.
              <br />
              3. When you edit a range from the main tabs, changes are scoped to that range.
              <br />
              4. Reset to Default copies the current global master settings back into the range.
            </p>
          </div>
        </motion.div>
      )}

      {useRanges ? (
        <div className="space-y-4">
          <RangeTemplateSelector
            existingRanges={ranges}
            onSelectTemplate={(templateConfig) => {
              const newRange = buildRangeSettings({
                id: createRangeId(ranges),
                ...templateConfig,
                isCustomized: true,
              });
              replaceRanges([...ranges, newRange]);
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Configured Ranges
              <span className="text-slate-500 text-sm font-normal">({ranges.length})</span>
            </h4>
            <Button
              onClick={handleOpenNewRange}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Range
            </Button>
          </div>

          {ranges.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="py-12 text-center">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No ranges yet</p>
                <p className="text-slate-500 text-xs mt-1 mb-4">
                  Choose a quick template above or create your first range manually.
                </p>
                <Button onClick={handleOpenNewRange} variant="outline" className="border-slate-600 text-slate-300">
                  <Plus className="w-4 h-4 mr-2" /> Create Your First Range
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {ranges
                .slice()
                .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                .map((range) => (
                  <RangeCard
                    key={range.id}
                    range={range}
                    onEdit={() => {
                      setEditingRange(range);
                      setIsModalOpen(true);
                    }}
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
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="py-16 text-center">
            <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Ranges system is disabled</p>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Enable this to create different alert behavior for different donation amounts.
            </p>
            <Button onClick={() => updateGlobalSetting("rangesUseRanges", true)} className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500">
              Enable Ranges System
            </Button>
          </CardContent>
        </Card>
      )}

      <RangeConfigModal
        key={isModalOpen ? editingRange?.id ?? "new-range" : "closed"}
        range={editingRange}
        defaultSettings={normalizedSettings}
        onSave={handleSaveRangeMetadata}
        onDelete={handleDeleteRange}
        onDuplicate={handleDuplicateRange}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRange(null);
        }}
        isOpen={isModalOpen}
      />
    </motion.div>
  );
}
