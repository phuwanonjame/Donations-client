// ./components/tabs/ranges/RangeItem.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, ChevronUp, Edit2, Trash2, Copy, 
  Volume2, Droplet, Image as ImageIcon, Sparkles, Zap
} from "lucide-react";

export default function RangeItem({ range, onEdit, onDelete, onDuplicate, isExpanded, onToggleExpand }) {
  // Helper function to get badge color based on priority
  const getPriorityColor = (priority) => {
    if (priority <= 3) return "border-green-500 text-green-400";
    if (priority <= 6) return "border-yellow-500 text-yellow-400";
    return "border-red-500 text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <div className={`p-4 rounded-xl bg-gradient-to-r ${range.backgroundColor || 'from-slate-800/50 to-slate-900/50'} border ${range.enabled ? 'border-slate-700/50' : 'border-red-500/30 opacity-75'} hover:border-cyan-500/30 transition-all`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={onToggleExpand}>
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-white font-semibold text-lg">{range.name}</h4>
              <Badge variant="outline" className={getPriorityColor(range.priority)}>
                Priority {range.priority}
              </Badge>
              <Badge variant="secondary" className="bg-slate-700">
                ฿{range.minAmount.toLocaleString()} - ฿{range.maxAmount.toLocaleString()}
              </Badge>
              {!range.enabled && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                  Disabled
                </Badge>
              )}
              {range.soundEnabled && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  <Volume2 className="w-3 h-3 mr-1" /> Sound
                </Badge>
              )}
              {range.showConfetti && (
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                  <Droplet className="w-3 h-3 mr-1" /> Confetti
                </Badge>
              )}
              {range.imageGlow && (
                <Badge variant="secondary" className="bg-fuchsia-500/20 text-fuchsia-300">
                  <ImageIcon className="w-3 h-3 mr-1" /> Glow
                </Badge>
              )}
              {range.amountShine && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  <Sparkles className="w-3 h-3 mr-1" /> Shine
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 flex-wrap">
              <span>Effect: {range.textEffect || "realistic_look"}</span>
              <span>Animation: {range.animationStyle || "slide-up"}</span>
              <span>Duration: {range.duration || 5000}ms</span>
              {range.fontFamily && <span>Font: {range.fontFamily}</span>}
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