// ./components/tabs/ranges/RangeItem.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown, ChevronUp, Edit2, Trash2, Copy,
  Volume2, Droplet, Image as ImageIcon, Sparkles,
} from "lucide-react";
import { normalizeFlatSettings } from "../utils/settingsUtils";

export default function RangeItem({ range, onEdit, onDelete, onDuplicate, isExpanded, onToggleExpand }) {
  const normalizedRange = normalizeFlatSettings(range);

  const getPriorityColor = (priority) => {
    if (priority <= 3) return "border-green-500 text-green-400";
    if (priority <= 6) return "border-yellow-500 text-yellow-400";
    return "border-red-500 text-red-400";
  };

  const titleFontSize = Array.isArray(normalizedRange.titleFontSize)
    ? normalizedRange.titleFontSize[0]
    : normalizedRange.titleFontSize;
  const notificationVolume = Array.isArray(normalizedRange.notificationVolume)
    ? normalizedRange.notificationVolume[0]
    : normalizedRange.notificationVolume;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <div className={`p-4 rounded-xl bg-gradient-to-r ${normalizedRange.backgroundColor || "from-slate-800/50 to-slate-900/50"} border ${range.enabled ? "border-slate-700/50" : "border-red-500/30 opacity-75"} hover:border-cyan-500/30 transition-all`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={onToggleExpand}>
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-white font-semibold text-lg">{range.name}</h4>
              <Badge variant="outline" className={getPriorityColor(range.priority)}>
                Priority {range.priority}
              </Badge>
              <Badge variant="secondary" className="bg-slate-700">
                ฿{range.minAmount?.toLocaleString()} - ฿{range.maxAmount?.toLocaleString()}
              </Badge>
              {!range.enabled && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                  Disabled
                </Badge>
              )}
              {normalizedRange.notificationSound && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  <Volume2 className="w-3 h-3 mr-1" /> Sound
                </Badge>
              )}
              {normalizedRange.showConfetti && (
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                  <Droplet className="w-3 h-3 mr-1" /> Confetti
                </Badge>
              )}
              {normalizedRange.imageGlow && (
                <Badge variant="secondary" className="bg-fuchsia-500/20 text-fuchsia-300">
                  <ImageIcon className="w-3 h-3 mr-1" /> Glow
                </Badge>
              )}
              {normalizedRange.titleAmountShine && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  <Sparkles className="w-3 h-3 mr-1" /> Shine
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
              <span>Effect: {normalizedRange.effect || "realistic_look"}</span>
              <span>Animation: {normalizedRange.animationEnterType || "fadeInUp"}</span>
              <span>Duration: {normalizedRange.animationDisplayDuration || 3}s</span>
              {normalizedRange.titleFontFamily && <span>Font: {normalizedRange.titleFontFamily}</span>}
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(range)}
              className="text-cyan-400 hover:text-cyan-300"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(range)}
              className="text-blue-400 hover:text-blue-300"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(range.id)}
              className="text-red-400 hover:text-red-300"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="text-slate-400"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-slate-700/50 overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Image</p>
                  <p className="text-white text-sm">{normalizedRange.image ? "custom media" : "none"}</p>
                  {normalizedRange.image && (
                    <p className="text-slate-400 text-xs truncate mt-1">{normalizedRange.image.substring(0, 40)}</p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Font</p>
                  <p className="text-white text-sm">{normalizedRange.titleFontFamily || "IBM Plex Sans Thai"} x {titleFontSize || 36}px</p>
                  <p className="text-slate-400 text-xs">Color: {normalizedRange.titleMainColor || "#ffffff"}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Audio</p>
                  <p className="text-white text-sm">{normalizedRange.notificationSound || "disabled"}</p>
                  <p className="text-slate-400 text-xs">Volume: {notificationVolume ?? 75}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Background</p>
                  <div className={`w-full h-6 rounded bg-gradient-to-r ${normalizedRange.backgroundColor || "from-purple-500 to-pink-500"} mt-1`} />
                </div>
              </div>

              {range.customCSS && (
                <div className="mt-3 p-2 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-500 text-xs">Custom CSS</p>
                  <pre className="text-slate-400 text-xs truncate font-mono">{range.customCSS.substring(0, 100)}</pre>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <div className="flex gap-4 text-xs">
                  <span className="text-slate-500">Sound: {normalizedRange.notificationSound || "Disabled"}</span>
                  <span className="text-slate-500">Confetti: {normalizedRange.showConfetti ? normalizedRange.confettiEffect : "Off"}</span>
                  <span className="text-slate-500">TTS: {normalizedRange.ttsTitleEnabled || normalizedRange.ttsMessageEnabled ? "On" : "Off"}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

RangeItem.propTypes = {
  range: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
    minAmount: PropTypes.number,
    maxAmount: PropTypes.number,
    priority: PropTypes.number,
    enabled: PropTypes.bool,
    backgroundColor: PropTypes.string,
    customCSS: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  onToggleExpand: PropTypes.func.isRequired,
};

RangeItem.defaultProps = {
  isExpanded: false,
};
