// ในไฟล์: ./components/VisualEditorOverlay.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, X, Check, Type, Palette, Image, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import font options
import { thaiGoogleFonts, fontWeights } from "../utils/fontUtils";

export default function VisualEditorOverlay({ 
  settings, 
  updateSetting, 
  isActive,
  onClose 
}) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });
  const [tempValue, setTempValue] = useState("");

  // Define editable zones with their positions and edit types
  const editableZones = [
    {
      id: "donorName",
      name: "Donor Name",
      path: "donorNameColor",
      flatPath: "donorNameColor",
      groupedPath: "title.usernameColor",
      type: "color",
      getValue: () => settings.donorNameColor,
      getPosition: () => ({ x: "50%", y: "30%" }),
      area: "text",
      icon: Type
    },
    {
      id: "amount",
      name: "Amount",
      path: "amountColor",
      flatPath: "amountColor",
      groupedPath: "title.amountColor",
      type: "color",
      getValue: () => settings.amountColor,
      getPosition: () => ({ x: "70%", y: "30%" }),
      area: "text",
      icon: Type
    },
    {
      id: "suffixText",
      name: "Suffix Text",
      path: "suffixText",
      flatPath: "suffixText",
      groupedPath: "title.suffixText",
      type: "text",
      getValue: () => settings.suffixText,
      getPosition: () => ({ x: "50%", y: "30%" }),
      area: "text",
      icon: Type
    },
    {
      id: "message",
      name: "Message",
      path: "messageText",
      flatPath: "messageText",
      groupedPath: "message.text",
      type: "text",
      getValue: () => settings.messageText,
      getPosition: () => ({ x: "50%", y: "70%" }),
      area: "message",
      icon: Type
    },
    {
      id: "messageColor",
      name: "Message Color",
      path: "messageColor",
      flatPath: "messageColor",
      groupedPath: "message.color",
      type: "color",
      getValue: () => settings.messageColor,
      getPosition: () => ({ x: "50%", y: "70%" }),
      area: "message",
      icon: Palette
    },
    {
      id: "image",
      name: "Alert Image",
      path: "alertImage",
      flatPath: "alertImage",
      groupedPath: "image",
      type: "image",
      getValue: () => settings.alertImage,
      getPosition: () => ({ x: "50%", y: "15%" }),
      area: "image",
      icon: Image
    },
    {
      id: "fontSize",
      name: "Font Size",
      path: "textSize",
      flatPath: "textSize",
      groupedPath: "title.fontSize",
      type: "slider",
      min: 12,
      max: 72,
      getValue: () => settings.textSize?.[0] || 36,
      getPosition: () => ({ x: "50%", y: "30%" }),
      area: "text",
      icon: Type
    },
    {
      id: "font",
      name: "Font Family",
      path: "font",
      flatPath: "font",
      groupedPath: "title.fontFamily",
      type: "select",
      options: thaiGoogleFonts,
      getValue: () => settings.font,
      getPosition: () => ({ x: "50%", y: "30%" }),
      area: "text",
      icon: Type
    }
  ];

  const handleElementClick = (element, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setEditPosition({ x: rect.right + 10, y: rect.top });
    setSelectedElement(element);
    setTempValue(element.getValue());
  };

  const handleSaveEdit = () => {
    if (selectedElement) {
      let valueToSave = tempValue;
      
      // Handle different types
      if (selectedElement.type === "slider") {
        valueToSave = [tempValue];
      } else if (selectedElement.type === "select") {
        valueToSave = tempValue;
      }
      
      updateSetting(selectedElement.path, valueToSave);
    }
    setSelectedElement(null);
  };

  const handleCancelEdit = () => {
    setSelectedElement(null);
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
              }}
            >
              <div className="relative">
                {/* Highlight effect */}
                <div className="absolute inset-0 rounded-lg bg-cyan-500/30 blur-md group-hover:bg-cyan-500/50 transition-all" />
                
                {/* Edit button */}
                <div className="relative flex items-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-cyan-500/50 shadow-lg">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-white font-medium">{zone.name}</span>
                  <Edit3 className="w-3 h-3 text-cyan-400" />
                  
                  {/* Value preview */}
                  {zone.type === "color" ? (
                    <div 
                      className="w-4 h-4 rounded border border-slate-600"
                      style={{ backgroundColor: value }}
                    />
                  ) : zone.type === "slider" ? (
                    <span className="text-xs text-cyan-400">{value}px</span>
                  ) : (
                    <span className="text-xs text-slate-300 max-w-[100px] truncate">
                      {value}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
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
                  <selectedElement.icon className="w-5 h-5 text-cyan-400" />
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
              {selectedElement.type === "color" ? (
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
                </div>
              ) : selectedElement.type === "slider" ? (
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
                </div>
              ) : selectedElement.type === "select" ? (
                <div className="space-y-3">
                  <Label className="text-slate-300">Select Font</Label>
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
                          style={{ fontFamily: option.cssFamily }}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
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

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply
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
        )}
      </AnimatePresence>

      {/* Instruction overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm rounded-full border border-cyan-500/30 text-xs text-cyan-400">
          ✨ Click on any button to edit that element
        </div>
      </div>
    </>
  );
}