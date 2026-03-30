// ./components/tabs/RangesTab.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Plus, Trash2, Edit2, Copy, 
  ChevronDown, ChevronUp, AlertCircle,
  Volume2, Droplet, Image as ImageIcon, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RangeConfigModal from "./ranges/RangeConfigModal";
import RangeTemplateSelector from "./ranges/RangeTemplateSelector";
import RangeItem from "./ranges/RangeItem"; // ต้อง import RangeItem ด้วย

export default function RangesTab({ settings, updateSetting }) {
  const [ranges, setRanges] = useState(settings?.donationRanges || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRange, setEditingRange] = useState(null);
  const [expandedRange, setExpandedRange] = useState(null);
  
  const useRanges = settings?.useRanges ?? false;

  const handleSaveRange = (rangeConfig) => {
    let updatedRanges;
    if (ranges.find(r => r.id === rangeConfig.id)) {
      // แก้ไข range เดิม
      updatedRanges = ranges.map(r => r.id === rangeConfig.id ? rangeConfig : r);
    } else {
      // สร้าง range ใหม่
      updatedRanges = [...ranges, rangeConfig];
    }
    setRanges(updatedRanges);
    updateSetting("donationRanges", updatedRanges);
    setIsModalOpen(false);
    setEditingRange(null);
  };

  const handleDeleteRange = (id) => {
    if (window.confirm("Are you sure you want to delete this range?")) {
      const updatedRanges = ranges.filter(r => r.id !== id);
      setRanges(updatedRanges);
      updateSetting("donationRanges", updatedRanges);
    }
  };

  const handleDuplicateRange = (range) => {
    const newRange = {
      ...range,
      id: Date.now(),
      name: `${range.name} (Copy)`,
      priority: ranges.length + 1
    };
    const updatedRanges = [...ranges, newRange];
    setRanges(updatedRanges);
    updateSetting("donationRanges", updatedRanges);
  };

  const handleToggleRange = (enabled) => {
    updateSetting("useRanges", enabled);
    if (!enabled) {
      console.log("Ranges system disabled");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Donation Ranges System
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Create different alert configurations based on donation amounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={useRanges ? "default" : "secondary"} 
                 className={useRanges ? "bg-cyan-500" : "bg-slate-600"}>
            {useRanges ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={useRanges}
            onCheckedChange={handleToggleRange}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>
      </div>

      {useRanges ? (
        <div className="space-y-6">
          {/* Quick Templates */}
          <RangeTemplateSelector onSelectTemplate={(template) => {
            const newRange = {
              id: Date.now(),
              ...template,
              priority: ranges.length + 1
            };
            const updatedRanges = [...ranges, newRange];
            setRanges(updatedRanges);
            updateSetting("donationRanges", updatedRanges);
          }} />

          {/* Ranges List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Configured Ranges ({ranges.length})
              </h4>
              <Button
                onClick={() => {
                  setEditingRange(null); // ตั้งเป็น null เพื่อสร้าง range ใหม่
                  setIsModalOpen(true);
                }}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Range
              </Button>
            </div>

            {ranges.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 border-dashed">
                <CardContent className="py-12 text-center">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No donation ranges configured yet</p>
                  <Button
                    onClick={() => {
                      setEditingRange(null);
                      setIsModalOpen(true);
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create Your First Range
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence>
                {ranges
                  .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                  .map(range => (
                    <RangeItem
                      key={range.id}
                      range={range}
                      isExpanded={expandedRange === range.id}
                      onToggleExpand={() => setExpandedRange(
                        expandedRange === range.id ? null : range.id
                      )}
                      onEdit={() => {
                        setEditingRange(range);
                        setIsModalOpen(true);
                      }}
                      onDelete={() => handleDeleteRange(range.id)}
                      onDuplicate={() => handleDuplicateRange(range)}
                    />
                  ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      ) : (
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="py-16 text-center">
            <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Ranges system is disabled</p>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Enable to create different alert configurations for different donation amounts.
              Each range can have its own effects, sounds, and animations.
            </p>
            <Button
              onClick={() => handleToggleRange(true)}
              className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Enable Ranges System
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal for creating/editing ranges */}
      <RangeConfigModal
        range={editingRange}
        onSave={handleSaveRange}
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