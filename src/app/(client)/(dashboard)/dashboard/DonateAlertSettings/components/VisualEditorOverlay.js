// ในไฟล์: ./components/VisualEditorOverlay.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, X, Check, Type, Palette, Image, 
  Volume2, Eye, EyeOff, Move, Trash2 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Font options (import from your fontUtils or define here)
const thaiGoogleFonts = [
  { id: "default", name: "Kanit", cssFamily: "Kanit, sans-serif" },
  { id: "prompt", name: "Prompt", cssFamily: "Prompt, sans-serif" },
  { id: "sarabun", name: "Sarabun", cssFamily: "Sarabun, sans-serif" },
  { id: "noto", name: "Noto Sans Thai", cssFamily: "Noto Sans Thai, sans-serif" },
  { id: "ibmplex", name: "IBM Plex Sans Thai", cssFamily: "IBM Plex Sans Thai, sans-serif" }
];

const fontWeights = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

export default function VisualEditorOverlay({ settings, updateSetting, isActive }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Define editable zones with their positions and edit types
  const editableZones = [
    {
      id: "donorName",
      name: "Donor Name",
      flatPath: "donorNameColor",
      groupedPath: "title.usernameColor",
      type: "color",
      getValue: () => settings.donorNameColor || "#FF9500",
      getPosition: () => ({ x: "35%", y: "28%" }),
      area: "text",
      icon: Type,
      preview: (value) => (
        <span style={{ color: value }}>ชื่อผู้บริจาค</span>
      )
    },
    {
      id: "amount",
      name: "Amount Color",
      flatPath: "amountColor",
      groupedPath: "title.amountColor",
      type: "color",
      getValue: () => settings.amountColor || "#0EA5E9",
      getPosition: () => ({ x: "70%", y: "28%" }),
      area: "text",
      icon: Palette,
      preview: (value) => (
        <span style={{ color: value }}>100฿</span>
      )
    },
    {
      id: "amountShine",
      name: "Amount Shine",
      flatPath: "amountShine",
      groupedPath: "title.amountShine",
      type: "boolean",
      getValue: () => settings.amountShine ?? true,
      getPosition: () => ({ x: "70%", y: "35%" }),
      area: "text",
      icon: Sparkles,
      preview: (value) => (
        <span>{value ? "✨ Shine ON" : "✨ Shine OFF"}</span>
      )
    },
    {
      id: "suffixText",
      name: "Suffix Text",
      flatPath: "suffixText",
      groupedPath: "title.suffixText",
      type: "text",
      getValue: () => settings.suffixText || "โดเนทมา",
      getPosition: () => ({ x: "55%", y: "28%" }),
      area: "text",
      icon: Type,
      preview: (value) => (
        <span>{value}</span>
      )
    },
    {
      id: "message",
      name: "Message Text",
      flatPath: "messageText",
      groupedPath: "message.text",
      type: "text",
      getValue: () => settings.messageText || "ขอบคุณสำหรับการใช้งาน FastDonate",
      getPosition: () => ({ x: "50%", y: "70%" }),
      area: "message",
      icon: Type,
      preview: (value) => (
        <span className="text-sm">{value.substring(0, 30)}...</span>
      )
    },
    {
      id: "messageColor",
      name: "Message Color",
      flatPath: "messageColor",
      groupedPath: "message.color",
      type: "color",
      getValue: () => settings.messageColor || "#FFFFFF",
      getPosition: () => ({ x: "50%", y: "77%" }),
      area: "message",
      icon: Palette,
      preview: (value) => (
        <span style={{ color: value }}>ข้อความตัวอย่าง</span>
      )
    },
    {
      id: "image",
      name: "Alert Image",
      flatPath: "alertImage",
      groupedPath: "image",
      type: "image",
      getValue: () => settings.alertImage || "",
      getPosition: () => ({ x: "50%", y: "15%" }),
      area: "image",
      icon: Image,
      preview: (value) => (
        <div className="w-8 h-8 rounded bg-cover bg-center" style={{ backgroundImage: `url(${value})` }} />
      )
    },
    {
      id: "fontSize",
      name: "Font Size",
      flatPath: "textSize",
      groupedPath: "title.fontSize",
      type: "slider",
      min: 12,
      max: 72,
      getValue: () => {
        const val = settings.textSize;
        if (Array.isArray(val)) return val[0] || 36;
        return val || 36;
      },
      getPosition: () => ({ x: "50%", y: "38%" }),
      area: "text",
      icon: Type,
      preview: (value) => (
        <span style={{ fontSize: `${value}px` }}>{value}px</span>
      )
    },
    {
      id: "font",
      name: "Font Family",
      flatPath: "font",
      groupedPath: "title.fontFamily",
      type: "select",
      options: thaiGoogleFonts,
      getValue: () => settings.font || "ibmplex",
      getPosition: () => ({ x: "50%", y: "33%" }),
      area: "text",
      icon: Type,
      preview: (value) => {
        const font = thaiGoogleFonts.find(f => f.id === value);
        return <span style={{ fontFamily: font?.cssFamily }}>{font?.name || value}</span>;
      }
    },
    {
      id: "fontWeight",
      name: "Font Weight",
      flatPath: "fontWeight",
      groupedPath: "title.fontWeight",
      type: "select",
      options: fontWeights.map(w => ({ id: w, name: w })),
      getValue: () => settings.fontWeight || "700",
      getPosition: () => ({ x: "50%", y: "43%" }),
      area: "text",
      icon: Type,
      preview: (value) => (
        <span style={{ fontWeight: value }}>Bold {value}</span>
      )
    },
    {
      id: "showName",
      name: "Show Donor Name",
      flatPath: "showName",
      groupedPath: "title.showName",
      type: "boolean",
      getValue: () => settings.showName ?? true,
      getPosition: () => ({ x: "20%", y: "20%" }),
      area: "visibility",
      icon: Eye,
      preview: (value) => (
        <span>{value ? "👁️ Visible" : "👁️‍🗨️ Hidden"}</span>
      )
    },
    {
      id: "showAmount",
      name: "Show Amount",
      flatPath: "showAmount",
      groupedPath: "title.showAmount",
      type: "boolean",
      getValue: () => settings.showAmount ?? true,
      getPosition: () => ({ x: "80%", y: "20%" }),
      area: "visibility",
      icon: Eye,
      preview: (value) => (
        <span>{value ? "👁️ Visible" : "👁️‍🗨️ Hidden"}</span>
      )
    },
    {
      id: "showMessage",
      name: "Show Message",
      flatPath: "showMessage",
      groupedPath: "message.showMessage",
      type: "boolean",
      getValue: () => settings.showMessage ?? true,
      getPosition: () => ({ x: "50%", y: "85%" }),
      area: "visibility",
      icon: Eye,
      preview: (value) => (
        <span>{value ? "👁️ Visible" : "👁️‍🗨️ Hidden"}</span>
      )
    }
  ];

  // Helper to update setting
  const handleUpdateSetting = (element, value) => {
    let finalValue = value;
    
    // Handle special cases
    if (element.type === "slider" && element.flatPath === "textSize") {
      finalValue = [value];
    } else if (element.type === "boolean") {
      finalValue = value;
    }
    
    updateSetting(element.flatPath, finalValue);
  };

  const handleElementClick = (element, event) => {
    event.stopPropagation();
    setSelectedElement(element);
    setTempValue(element.getValue());
  };

  const handleSaveEdit = () => {
    if (selectedElement) {
      handleUpdateSetting(selectedElement, tempValue);
    }
    setSelectedElement(null);
  };

  const handleCancelEdit = () => {
    setSelectedElement(null);
  };

  // Render edit modal based on element type
  const renderEditModal = () => {
    if (!selectedElement) return null;

    const Icon = selectedElement.icon;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={handleCancelEdit}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Edit {selectedElement.name}
              </h3>
            </div>
            <button
              onClick={handleCancelEdit}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Edit Input based on type */}
          {selectedElement.type === "color" && (
            <div className="space-y-3">
              <Label className="text-slate-300">Select Color</Label>
              <Input
                type="color"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full h-12 bg-slate-800/80 border-slate-700"
              />
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="#FFFFFF"
                className="bg-slate-800/80 border-slate-700 text-white font-mono"
              />
              <div className="mt-2 p-2 rounded bg-slate-800/50 text-center">
                <span className="text-sm text-slate-400">Preview:</span>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border border-slate-600"
                    style={{ backgroundColor: tempValue }}
                  />
                  <span className="text-white font-mono text-sm">{tempValue}</span>
                </div>
              </div>
            </div>
          )}

          {selectedElement.type === "slider" && (
            <div className="space-y-3">
              <Label className="text-slate-300">
                Size: {tempValue}px
              </Label>
              <Slider
                value={[tempValue]}
                onValueChange={(v) => setTempValue(v[0])}
                min={selectedElement.min || 12}
                max={selectedElement.max || 72}
                step={1}
                className="w-full"
              />
              <div className="text-center text-cyan-400 font-medium">
                {tempValue}px
              </div>
            </div>
          )}

          {selectedElement.type === "select" && (
            <div className="space-y-3">
              <Label className="text-slate-300">Select Option</Label>
              <Select
                value={tempValue}
                onValueChange={setTempValue}
              >
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {selectedElement.options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id}
                      className="text-white hover:bg-slate-700"
                      style={option.cssFamily ? { fontFamily: option.cssFamily } : {}}
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedElement.type === "boolean" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <span className="text-white">{selectedElement.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant={tempValue ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTempValue(true)}
                    className={tempValue ? "bg-cyan-500" : "border-slate-700"}
                  >
                    ON
                  </Button>
                  <Button
                    variant={!tempValue ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTempValue(false)}
                    className={!tempValue ? "bg-slate-600" : "border-slate-700"}
                  >
                    OFF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {selectedElement.type === "text" && (
            <div className="space-y-3">
              <Label className="text-slate-300">Text</Label>
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-slate-800/80 border-slate-700 text-white"
                placeholder={`Enter ${selectedElement.name.toLowerCase()}`}
              />
              {selectedElement.id === "message" && (
                <p className="text-xs text-slate-500">
                  Use {"{{user}}"} to show donor name
                </p>
              )}
            </div>
          )}

          {selectedElement.type === "image" && (
            <div className="space-y-3">
              <Label className="text-slate-300">Image URL</Label>
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
                placeholder="https://example.com/image.png"
              />
              {tempValue && (
                <div className="mt-2 p-2 rounded bg-slate-800/50 text-center">
                  <img 
                    src={tempValue} 
                    alt="Preview" 
                    className="max-h-32 mx-auto rounded"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100x100?text=Invalid+URL";
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleSaveEdit}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
          </div>

          {/* Quick tip */}
          <div className="mt-4 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-xs text-cyan-400 text-center">
              💡 Changes are applied to preview immediately
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay with editable zones */}
      <div className="absolute inset-0 pointer-events-none">
        {editableZones.map((zone) => {
          const position = zone.getPosition();
          const value = zone.getValue();
          const Icon = zone.icon;
          
          return (
            <motion.button
              key={zone.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleElementClick(zone, e)}
              className="absolute pointer-events-auto group"
              style={{
                left: position.x,
                top: position.y,
                transform: "translate(-50%, -50%)",
                zIndex: 20
              }}
            >
              <div className="relative">
                {/* Highlight effect */}
                <div className="absolute inset-0 rounded-lg bg-cyan-500/30 blur-md group-hover:bg-cyan-500/50 transition-all" />
                
                {/* Edit button */}
                <div className="relative flex items-center gap-2 px-3 py-2 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-cyan-500/50 shadow-lg">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-white font-medium whitespace-nowrap">
                    {zone.name}
                  </span>
                  <Edit3 className="w-3 h-3 text-cyan-400" />
                  
                  {/* Value preview */}
                  {zone.type === "color" && (
                    <div 
                      className="w-4 h-4 rounded border border-slate-600"
                      style={{ backgroundColor: value }}
                    />
                  )}
                  {zone.type === "slider" && (
                    <span className="text-xs text-cyan-400">{value}px</span>
                  )}
                  {zone.type === "boolean" && (
                    <span className="text-xs text-cyan-400">
                      {value ? "ON" : "OFF"}
                    </span>
                  )}
                  {zone.type === "text" && (
                    <span className="text-xs text-slate-300 max-w-[80px] truncate">
                      {value}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Instruction overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-20">
        <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-full border border-cyan-500/30 text-xs text-cyan-400 shadow-lg">
          ✨ Click on any button to edit that element
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedElement && renderEditModal()}
      </AnimatePresence>
    </>
  );
}

// Add missing Sparkles icon import if needed
import { Sparkles } from "lucide-react";