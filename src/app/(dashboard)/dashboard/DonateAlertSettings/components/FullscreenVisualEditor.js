// ============================================
// ไฟล์: ./components/FullscreenVisualEditor.js
// ============================================
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Save, RotateCcw, Copy, Check, 
  Edit3, Type, Palette, Image, Eye, 
  Sparkles, Volume2, ArrowLeft, Settings,
  Maximize2, Minimize2, RefreshCw, Music,
  Zap, Clock, EyeOff, AlignLeft, Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import AlertPreview from "./AlertPreview";
import { getFontFamilyCss, getFontWeight } from "./utils/fontUtils";
import { playAlertSound } from "../../../../../utils/audioUtils";

// Font options
const thaiGoogleFonts = [
  { id: "default", name: "Kanit", cssFamily: "Kanit, sans-serif" },
  { id: "prompt", name: "Prompt", cssFamily: "Prompt, sans-serif" },
  { id: "sarabun", name: "Sarabun", cssFamily: "Sarabun, sans-serif" },
  { id: "noto", name: "Noto Sans Thai", cssFamily: "Noto Sans Thai, sans-serif" },
  { id: "ibmplex", name: "IBM Plex Sans Thai", cssFamily: "IBM Plex Sans Thai, sans-serif" }
];

const fontWeights = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
const alertSounds = [
  { id: "chime", name: "Chime" },
  { id: "cash", name: "Cash Register" },
  { id: "bell", name: "Bell Ring" },
  { id: "fanfare", name: "Fanfare" },
  { id: "bb_spirit", name: "BB Spirit" }
];

const animationOptions = [
  { id: "fadeIn", name: "Fade In" },
  { id: "fadeInUp", name: "Fade In Up" },
  { id: "fadeInDown", name: "Fade In Down" },
  { id: "slideInLeft", name: "Slide In Left" },
  { id: "slideInRight", name: "Slide In Right" },
  { id: "zoomIn", name: "Zoom In" },
  { id: "bounceIn", name: "Bounce In" }
];

const effectOptions = [
  { id: "realistic_look", name: "Realistic Look" },
  { id: "glow", name: "Glow Effect" },
  { id: "shadow", name: "Shadow Effect" },
  { id: "neon", name: "Neon Effect" }
];

// Mapping between element id and the key from getElementPositions
const elementIdToPositionKey = {
  donorName: "donorName",
  amount: "amount",
  suffixText: "suffixText",
  message: "message",
  messageColor: "messageColor",
  fontSize: "fontSize",
  font: "font",
  image: "image",
  showName: "showName",
  showAmount: "showAmount",
  showMessage: "showMessage",
  sound: "sound",
  animation: "animation"
};

export default function FullscreenVisualEditor({ 
  settings, 
  updateSetting, 
  onClose,
  onSave
}) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState("display");
  const [isVisible, setIsVisible] = useState(true);
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingSound, setTestingSound] = useState(false);
  const [elementRects, setElementRects] = useState({});
  
  const previewContainerRef = useRef(null);
  const containerRef = useRef(null);
  const alertPreviewRef = useRef(null);
  const requestRef = useRef(null);

  // Update local settings
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Editable zones
  const editableZones = [
    { id: "donorName", name: "ชื่อผู้บริจาค", icon: Type, flatPath: "donorNameColor", type: "color", defaultValue: "#FF9500", getValue: () => localSettings.donorNameColor || "#FF9500", getDisplayValue: () => localSettings.donorNameColor || "#FF9500", description: "สีชื่อผู้บริจาค", settings: [{ key: "donorNameColor", label: "สีชื่อผู้บริจาค", type: "color" }] },
    { id: "amount", name: "จำนวนเงิน", icon: Sparkles, flatPath: "amountColor", type: "color", defaultValue: "#0EA5E9", getValue: () => localSettings.amountColor || "#0EA5E9", getDisplayValue: () => localSettings.amountColor || "#0EA5E9", description: "สีและเอฟเฟกต์ของจำนวนเงิน", settings: [{ key: "amountColor", label: "สีจำนวนเงิน", type: "color" }, { key: "amountShine", label: "เอฟเฟกต์ shine", type: "boolean" }] },
    { id: "suffixText", name: "ข้อความท้าย", icon: Type, flatPath: "suffixText", type: "text", defaultValue: "โดเนทมา", getValue: () => localSettings.suffixText || "โดเนทมา", getDisplayValue: () => (localSettings.suffixText || "").substring(0, 10), description: "ข้อความต่อท้ายชื่อ", settings: [{ key: "suffixText", label: "ข้อความท้าย", type: "text", placeholder: "โดเนทมา" }] },
    { id: "message", name: "ข้อความ", icon: AlignLeft, flatPath: "messageText", type: "text", defaultValue: "ขอบคุณสำหรับการใช้งาน FastDonate", getValue: () => localSettings.messageText || "ขอบคุณสำหรับการใช้งาน FastDonate", getDisplayValue: () => (localSettings.messageText || "").substring(0, 15) + "...", description: "ข้อความแสดงใต้จำนวนเงิน", settings: [{ key: "messageText", label: "ข้อความ", type: "text", placeholder: "ใช้ {{user}} สำหรับชื่อผู้บริจาค" }, { key: "messageColor", label: "สีข้อความ", type: "color" }] },
    { id: "messageColor", name: "สีข้อความ", icon: Palette, flatPath: "messageColor", type: "color", defaultValue: "#FFFFFF", getValue: () => localSettings.messageColor || "#FFFFFF", getDisplayValue: () => localSettings.messageColor || "#FFFFFF", description: "สีของข้อความ", settings: [{ key: "messageColor", label: "สีข้อความ", type: "color" }] },
    { id: "fontSize", name: "ขนาดตัวอักษร", icon: Type, flatPath: "textSize", type: "slider", min: 12, max: 72, getValue: () => { const val = localSettings.textSize; return Array.isArray(val) ? val[0] || 36 : val || 36; }, getDisplayValue: () => { const val = localSettings.textSize; const size = Array.isArray(val) ? val[0] : (val || 36); return `${size}px`; }, description: "ขนาดตัวอักษรของชื่อและจำนวนเงิน", settings: [{ key: "textSize", label: "ขนาดตัวอักษร", type: "slider", min: 12, max: 72 }] },
    { id: "font", name: "แบบอักษร", icon: Type, flatPath: "font", type: "select", options: thaiGoogleFonts, getValue: () => localSettings.font || "ibmplex", getDisplayValue: () => { const fontId = localSettings.font || "ibmplex"; const font = thaiGoogleFonts.find(f => f.id === fontId); return font?.name || fontId; }, description: "รูปแบบตัวอักษร", settings: [{ key: "font", label: "แบบอักษร", type: "select", options: thaiGoogleFonts }] },
    { id: "image", name: "รูปภาพ", icon: Image, flatPath: "alertImage", type: "image", getValue: () => localSettings.alertImage || "", getDisplayValue: () => localSettings.alertImage ? "✓" : "None", description: "รูปภาพหรือ GIF แสดงใน alert", settings: [{ key: "alertImage", label: "URL รูปภาพ", type: "image", placeholder: "https://..." }] },
    { id: "sound", name: "เสียง", icon: Volume2, flatPath: "alertSound", type: "select", options: alertSounds, getValue: () => localSettings.alertSound || "bb_spirit", getDisplayValue: () => { const sound = alertSounds.find(s => s.id === localSettings.alertSound); return sound?.name || "BB Spirit"; }, description: "เสียงแจ้งเตือนและ TTS", settings: [{ key: "alertSound", label: "เสียงแจ้งเตือน", type: "select", options: alertSounds }, { key: "volume", label: "ระดับเสียง", type: "slider", min: 0, max: 100 }] },
    { id: "animation", name: "อนิเมชัน", icon: Zap, flatPath: "inAnimation", type: "select", options: animationOptions, getValue: () => localSettings.inAnimation || "fadeInUp", getDisplayValue: () => localSettings.inAnimation || "fadeInUp", description: "การเคลื่อนไหวเข้า-ออก", settings: [{ key: "inAnimation", label: "动画เข้า", type: "select", options: animationOptions }, { key: "inDuration", label: "ระยะเวลาเข้า", type: "slider", min: 0.5, max: 3, step: 0.1 }] },
    { id: "showName", name: "แสดงชื่อ", icon: Eye, flatPath: "showName", type: "boolean", getValue: () => localSettings.showName ?? true, getDisplayValue: () => localSettings.showName ? "ON" : "OFF", description: "เปิด/ปิด การแสดงชื่อผู้บริจาค", settings: [{ key: "showName", label: "แสดงชื่อผู้บริจาค", type: "boolean" }] },
    { id: "showAmount", name: "แสดงจำนวน", icon: Eye, flatPath: "showAmount", type: "boolean", getValue: () => localSettings.showAmount ?? true, getDisplayValue: () => localSettings.showAmount ? "ON" : "OFF", description: "เปิด/ปิด การแสดงจำนวนเงิน", settings: [{ key: "showAmount", label: "แสดงจำนวนเงิน", type: "boolean" }] },
    { id: "showMessage", name: "แสดงข้อความ", icon: Eye, flatPath: "showMessage", type: "boolean", getValue: () => localSettings.showMessage ?? true, getDisplayValue: () => localSettings.showMessage ? "ON" : "OFF", description: "เปิด/ปิด การแสดงข้อความ", settings: [{ key: "showMessage", label: "แสดงข้อความ", type: "boolean" }] }
  ];

  // ฟังก์ชันดึงตำแหน่งจาก element จริง
  const updatePositionsFromElements = useCallback(() => {
    if (!alertPreviewRef.current?.getElementPositions) return;
    
    const positions = alertPreviewRef.current.getElementPositions();
    if (!positions) return;
    
    const newRects = {};
    editableZones.forEach(zone => {
      const key = elementIdToPositionKey[zone.id];
      if (key && positions[key]) {
        newRects[zone.id] = positions[key];
      }
    });
    
    setElementRects(newRects);
  }, [editableZones]);

  // อัปเดตตำแหน่งเมื่อ settings เปลี่ยน หรือ resize/scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePositionsFromElements();
    }, 100);
    return () => clearTimeout(timer);
  }, [localSettings, previewScale, updatePositionsFromElements]);

  useEffect(() => {
    const handleUpdate = () => {
      requestRef.current = requestAnimationFrame(updatePositionsFromElements);
    };
    
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updatePositionsFromElements]);

  const handleLocalUpdate = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    updateSetting(key, value);
    setHasChanges(true);
  };

  const handleElementClick = (element, event) => {
    event.stopPropagation();
    setSelectedElement(element);
    setTempValue(element.getValue());
  };

  const handleSaveEdit = () => {
    if (selectedElement) {
      let valueToSave = tempValue;
      if (selectedElement.type === "slider" && selectedElement.flatPath === "textSize") {
        valueToSave = [tempValue];
      }
      handleLocalUpdate(selectedElement.flatPath, valueToSave);
    }
    setSelectedElement(null);
  };

  const handleTestSound = () => {
    const soundKey = localSettings.alertSound || "chime";
    const volume = localSettings.volume?.[0] || 75;
    playAlertSound(soundKey, volume);
    setTestingSound(true);
    setTimeout(() => setTestingSound(false), 1000);
  };

  const handleSaveAndClose = async () => {
    await onSave();
    onClose();
  };

  // คำนวณตำแหน่งปุ่มรอบ element (วางห่างจาก element ไปตามทิศทาง)
  const getButtonPosition = (elementId) => {
    const rect = elementRects[elementId];
    if (!rect) return null;
    
    // ตำแหน่ง center ของ element
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    
    const previewRect = previewContainerRef.current?.getBoundingClientRect();
    if (!previewRect) return null;
    
    // ระยะห่างจาก element (px)
    const distance = 100;
    
    // กำหนดทิศทางตาม id ของ element
    const directions = {
      donorName: { dx: -1.2, dy: -0.8 },    // ซ้ายบน
      amount: { dx: 1.2, dy: -0.8 },        // ขวาบน
      suffixText: { dx: 0, dy: -1.2 },      // บน
      message: { dx: -1.2, dy: 0.8 },       // ซ้ายล่าง
      messageColor: { dx: 1.2, dy: 0.8 },   // ขวาล่าง
      fontSize: { dx: -1.5, dy: 0 },        // ซ้าย
      font: { dx: 1.5, dy: 0 },             // ขวา
      image: { dx: 0, dy: -1.5 },           // บน (รูป)
      sound: { dx: 1.5, dy: -1 },           // ขวาบน
      animation: { dx: -1.5, dy: 1 },       // ซ้ายล่าง
      showName: { dx: -1.2, dy: -1.2 },     // ซ้ายบนมาก
      showAmount: { dx: 1.2, dy: -1.2 },    // ขวาบนมาก
      showMessage: { dx: 0, dy: 1.2 }       // ล่าง
    };
    
    const dir = directions[elementId] || { dx: 1, dy: 0 };
    const length = Math.sqrt(dir.dx * dir.dx + dir.dy * dir.dy);
    const normDx = dir.dx / length;
    const normDy = dir.dy / length;
    
    let buttonX = targetX + normDx * distance;
    let buttonY = targetY + normDy * distance;
    
    // ป้องกันปุ่มออกนอกจอ
    const minX = 80;
    const maxX = window.innerWidth - 80;
    const minY = 60;
    const maxY = window.innerHeight - 60;
    
    buttonX = Math.max(minX, Math.min(maxX, buttonX));
    buttonY = Math.max(minY, Math.min(maxY, buttonY));
    
    return { button: { x: buttonX, y: buttonY }, target: { x: targetX, y: targetY } };
  };

  const renderSettingsPanel = () => {
    if (!selectedElement) return null;
    
    const renderField = (field) => {
      const fieldValue = localSettings[field.key];
      const displayValue = field.type === "slider" && field.key === "textSize" 
        ? (Array.isArray(fieldValue) ? fieldValue[0] : fieldValue || 36)
        : fieldValue;

      switch (field.type) {
        case "color":
          return (
            <div className="space-y-2" key={field.key}>
              <Label className="text-slate-300">{field.label}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={displayValue || "#FFFFFF"}
                  onChange={(e) => handleLocalUpdate(field.key, e.target.value)}
                  className="w-16 h-10 p-1 bg-slate-800 border-slate-700"
                />
                <Input
                  value={displayValue || "#FFFFFF"}
                  onChange={(e) => handleLocalUpdate(field.key, e.target.value)}
                  className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          );
        case "slider":
          return (
            <div className="space-y-2" key={field.key}>
              <div className="flex justify-between">
                <Label className="text-slate-300">{field.label}</Label>
                <span className="text-cyan-400 text-sm">
                  {field.key === "textSize" ? `${displayValue}px` : displayValue}
                  {field.key === "volume" && "%"}
                </span>
              </div>
              <Slider
                value={[displayValue || field.min || 0]}
                onValueChange={(v) => {
                  let value = v[0];
                  if (field.key === "textSize") value = [value];
                  handleLocalUpdate(field.key, value);
                }}
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 1}
                className="w-full"
              />
            </div>
          );
        case "select":
          return (
            <div className="space-y-2" key={field.key}>
              <Label className="text-slate-300">{field.label}</Label>
              <Select value={displayValue} onValueChange={(v) => handleLocalUpdate(field.key, v)}>
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {field.options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id} className="text-white hover:bg-slate-700">
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        case "boolean":
          return (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700" key={field.key}>
              <span className="text-white">{field.label}</span>
              <Switch
                checked={displayValue ?? false}
                onCheckedChange={(v) => handleLocalUpdate(field.key, v)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
              />
            </div>
          );
        case "image":
          return (
            <div className="space-y-2" key={field.key}>
              <Label className="text-slate-300">{field.label}</Label>
              <Input
                value={displayValue || ""}
                onChange={(e) => handleLocalUpdate(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
              />
              {displayValue && (
                <div className="mt-2 p-2 rounded bg-slate-800/50">
                  <img src={displayValue} alt="Preview" className="max-h-32 mx-auto rounded" />
                </div>
              )}
            </div>
          );
        default:
          return (
            <div className="space-y-2" key={field.key}>
              <Label className="text-slate-300">{field.label}</Label>
              <Input
                value={displayValue || ""}
                onChange={(e) => handleLocalUpdate(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="bg-slate-800/80 border-slate-700 text-white"
              />
            </div>
          );
      }
    };

    const Icon = selectedElement.icon;

    return (
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-xl">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedElement.name}</h3>
                <p className="text-xs text-slate-400">{selectedElement.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedElement(null)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {selectedElement.settings.map((field, idx) => renderField(field))}
          </div>

          {selectedElement.id === "sound" && (
            <Button
              onClick={handleTestSound}
              disabled={testingSound}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {testingSound ? "กำลังเล่น..." : "ทดสอบเสียง"}
            </Button>
          )}

          <Button
            onClick={handleSaveEdit}
            className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Check className="w-4 h-4 mr-2" />
            บันทึก
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
      ref={containerRef}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Visual Editor</h2>
              <p className="text-xs text-slate-400">คลิกที่ปุ่มเพื่อแก้ไข | เส้นประชี้ไปยังตำแหน่งจริง</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="border-slate-700 text-slate-400">
            <Settings className="w-4 h-4 mr-2" />
            {showSidebar ? "ซ่อนรายการ" : "แสดงรายการ"}
          </Button>
          <Button onClick={handleSaveAndClose} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Save className="w-4 h-4 mr-2" />
            บันทึกและปิด
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-slate-900/50 border-r border-slate-800 overflow-y-auto"
            >
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-400 mb-3">รายการที่แก้ไขได้</h3>
                <div className="space-y-2">
                  {editableZones.map((zone) => {
                    const Icon = zone.icon;
                    const isActive = selectedElement?.id === zone.id;
                    const hasPosition = !!elementRects[zone.id];
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedElement(zone)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-cyan-500/20 border border-cyan-500/50"
                            : "hover:bg-slate-800/50 border border-transparent"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? "bg-cyan-500/30" : "bg-slate-800"}`}>
                          <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${isActive ? "text-cyan-400" : "text-white"}`}>
                            {zone.name}
                          </p>
                          <p className="text-xs text-slate-500">{zone.description}</p>
                        </div>
                        <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                          {zone.getDisplayValue()}
                        </span>
                        {!hasPosition && <span className="text-xs text-yellow-500">⚠️</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center - Preview Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button onClick={() => setPreviewScale(prev => Math.max(0.5, prev - 0.1))} className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-white">
              <Minimize2 className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-white text-sm">
              {Math.round(previewScale * 100)}%
            </span>
            <button onClick={() => setPreviewScale(prev => Math.min(1.2, prev + 0.1))} className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-white">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div ref={previewContainerRef} className="h-full flex items-center justify-center overflow-auto p-8">
            <div className="relative" style={{ transform: `scale(${previewScale})`, transformOrigin: "center" }}>
              {/* Leader Lines SVG */}
              <svg className="absolute inset-0 pointer-events-none overflow-visible w-full h-full z-10">
                {editableZones.map(zone => {
                  const pos = getButtonPosition(zone.id);
                  if (!pos) return null;
                  const isSelected = selectedElement?.id === zone.id;
                  return (
                    <line
                      key={`line-${zone.id}`}
                      x1={pos.button.x}
                      y1={pos.button.y}
                      x2={pos.target.x}
                      y2={pos.target.y}
                      stroke={isSelected ? "#22d3ee" : "rgba(6, 182, 212, 0.5)"}
                      strokeWidth={isSelected ? 2 : 1.5}
                      strokeDasharray="5,3"
                    />
                  );
                })}
              </svg>

              {/* Alert Preview */}
              <AlertPreview
                ref={alertPreviewRef}
                settings={localSettings}
                isPlaying={isPlaying}
                onPlayStateChange={setIsPlaying}
                onAnimationStepChange={setAnimationStep}
                externalAnimationStep={animationStep}
                externalIsVisible={isVisible}
              />

              {/* Editable Label Buttons */}
              <div className="absolute inset-0 pointer-events-none">
                {editableZones.map(zone => {
                  const pos = getButtonPosition(zone.id);
                  if (!pos) return null;
                  const Icon = zone.icon;
                  const isSelected = selectedElement?.id === zone.id;
                  
                  return (
                    <motion.button
                      key={zone.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleElementClick(zone, e)}
                      className={`absolute pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg transition-all z-20 ${
                        isSelected
                          ? "bg-cyan-500 text-white scale-105"
                          : "bg-slate-900/90 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                      }`}
                      style={{
                        left: pos.button.x,
                        top: pos.button.y,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium whitespace-nowrap">{zone.name}</span>
                      <Edit3 className="w-2.5 h-2.5 opacity-70" />
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                        {zone.getDisplayValue()}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-20">
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-full border border-cyan-500/30 text-xs text-cyan-400 shadow-lg">
              ✨ คลิกที่ปุ่มเพื่อแก้ไข | เส้นประชี้ไปยังตำแหน่งจริงของ element
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <AnimatePresence>
          {selectedElement && renderSettingsPanel()}
        </AnimatePresence>
      </div>

      {/* Bottom Status Bar */}
      <div className="px-6 py-2 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>🎨 Visual Editor Mode</span>
          <span>📐 {editableZones.length} จุดแก้ไข</span>
          <span>📍 {Object.keys(elementRects).length} ตำแหน่งที่ตรวจจับได้</span>
          {hasChanges && <span className="text-yellow-400">⚡ มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
            {isPlaying ? "⏸ หยุด" : "▶ เล่นอนิเมชัน"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}