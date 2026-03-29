import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";

// Import รายการ Font
import { thaiGoogleFonts, fontWeights } from "../utils/fontUtils";

export default function TextTab({ settings, updateSetting }) {
  
  // Helper function to get values from settings (support both flat and grouped)
  const getSettingValue = (flatKey, groupedPath, defaultValue) => {
    if (!settings) return defaultValue;
    
    // If using grouped structure
    if (settings.metadata) {
      const paths = groupedPath.split('.');
      let value = settings.metadata;
      for (const p of paths) {
        if (value && typeof value === 'object' && p in value) {
          value = value[p];
        } else {
          return defaultValue;
        }
      }
      return value !== undefined && value !== null ? value : defaultValue;
    }
    
    // Flat structure
    return settings[flatKey] !== undefined && settings[flatKey] !== null 
      ? settings[flatKey] 
      : defaultValue;
  };

  // Helper function to update values (support both flat and grouped)
  const updateSettingValue = (flatKey, groupedPath, value) => {
    if (settings.metadata) {
      // For grouped structure, update nested object
      const paths = groupedPath.split('.');
      let updatedMetadata = { ...settings.metadata };
      let current = updatedMetadata;
      
      for (let i = 0; i < paths.length - 1; i++) {
        if (!current[paths[i]]) {
          current[paths[i]] = {};
        }
        current = current[paths[i]];
      }
      
      current[paths[paths.length - 1]] = value;
      updateSetting("metadata", updatedMetadata);
    } else {
      // Flat structure
      updateSetting(flatKey, value);
    }
  };

  // Helper function to get font ID from font family
  const getFontIdFromFamily = (fontFamily) => {
    const fontMap = {
      "Kanit": "default",
      "Prompt": "prompt",
      "Sarabun": "sarabun",
      "Noto Sans Thai": "noto",
      "IBM Plex Sans Thai": "ibmplex"
    };
    return fontMap[fontFamily] || "ibmplex";
  };

  // Get values with proper defaults
  const prefixText = getSettingValue('prefixText', 'title.text', '{{user}} โดเนทมา');
  const suffixText = getSettingValue('suffixText', 'title.suffixText', 'โดเนทมา');
  const amountText = getSettingValue('amountText', 'title.amountText', '{{amount}}฿');
  const amountSuffix = getSettingValue('amountSuffix', 'title.amountSuffix', '฿');
  
  // Font settings
  const fontFamily = getSettingValue('font', 'title.fontFamily', 'IBM Plex Sans Thai');
  const font = getFontIdFromFamily(fontFamily);
  const fontWeight = getSettingValue('fontWeight', 'title.fontWeight', '700');
  const textSize = getSettingValue('textSize', 'title.fontSize', 36);
  
  // Colors
  const textColor = getSettingValue('textColor', 'title.mainColor', '#FFFFFF');
  const donorNameColor = getSettingValue('donorNameColor', 'title.usernameColor', '#FF9500');
  const amountColor = getSettingValue('amountColor', 'title.amountColor', '#0EA5E9');
  const borderWidth = getSettingValue('borderWidth', 'title.strokeWidth', 2.5);
  const borderColor = getSettingValue('borderColor', 'title.strokeColor', '#000000');
  
  // Message settings
  const messageFontFamily = getSettingValue('messageFont', 'message.fontFamily', 'IBM Plex Sans Thai');
  const messageFont = getFontIdFromFamily(messageFontFamily);
  const messageFontWeight = getSettingValue('messageFontWeight', 'message.fontWeight', '500');
  const messageFontSize = getSettingValue('messageFontSize', 'message.fontSize', 24);
  const messageColor = getSettingValue('messageColor', 'message.color', '#FFFFFF');
  const messageBorderWidth = getSettingValue('messageBorderWidth', 'message.strokeWidth', 2.5);
  const messageBorderColor = getSettingValue('messageBorderColor', 'message.strokeColor', '#000000');

  // Helper functions - แก้ไขการจัดการ textSize
  const getTextSize = () => {
    if (!textSize) return 36;
    if (Array.isArray(textSize)) {
      return textSize[0] || 36;
    }
    return parseInt(textSize) || 36;
  };

  const getMessageFontSize = () => {
    if (!messageFontSize) return 24;
    if (Array.isArray(messageFontSize)) {
      return messageFontSize[0] || 24;
    }
    return parseInt(messageFontSize) || 24;
  };

  const currentTextSize = getTextSize();
  const currentMessageFontSize = getMessageFontSize();

  // Handle font change
  const handleFontChange = (fontId) => {
    const fontMap = {
      "default": "Kanit",
      "prompt": "Prompt",
      "sarabun": "Sarabun",
      "noto": "Noto Sans Thai",
      "ibmplex": "IBM Plex Sans Thai"
    };
    const fontFamilyName = fontMap[fontId] || "IBM Plex Sans Thai";
    updateSettingValue('font', 'title.fontFamily', fontFamilyName);
  };

  // Handle message font change
  const handleMessageFontChange = (fontId) => {
    const fontMap = {
      "default": "Kanit",
      "prompt": "Prompt",
      "sarabun": "Sarabun",
      "noto": "Noto Sans Thai",
      "ibmplex": "IBM Plex Sans Thai"
    };
    const fontFamilyName = fontMap[fontId] || "IBM Plex Sans Thai";
    updateSettingValue('messageFont', 'message.fontFamily', fontFamilyName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" /> Message Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Prefix Text</Label>
            <Input
              value={prefixText} 
              onChange={(e) => updateSettingValue('prefixText', 'title.text', e.target.value)}
              placeholder="{{user}} โดเนทมา"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
            <p className="text-slate-500 text-xs">Use {"{{user}}"} for donor name</p>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Suffix Text</Label>
            <Input
              value={suffixText} 
              onChange={(e) => updateSettingValue('suffixText', 'title.suffixText', e.target.value)}
              placeholder="โดเนทมา"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Amount Text */}
        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Amount Text Format</Label>
          <Input
            value={amountText}
            onChange={(e) => updateSettingValue('amountText', 'title.amountText', e.target.value)}
            placeholder="{{amount}}฿"
            className="bg-slate-800/80 border-slate-700 text-white"
          />
          <p className="text-slate-500 text-sm">Use {"{{amount}}"} as placeholder for donation amount</p>
        </div>

        {/* Font Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Font Family</Label>
            <Select
              value={font}
              onValueChange={handleFontChange}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {thaiGoogleFonts.map((fontItem) => (
                  <SelectItem
                    key={fontItem.id}
                    value={fontItem.id}
                    className="text-white hover:bg-slate-700"
                    style={{ fontFamily: fontItem.cssFamily }} 
                  >
                    {fontItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Font Weight</Label>
            <Select
              value={fontWeight}
              onValueChange={(v) => updateSettingValue('fontWeight', 'title.fontWeight', v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {fontWeights.map((w) => (
                  <SelectItem key={w} value={w} className="text-white hover:bg-slate-700">
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Text Size Slider - สำหรับชื่อและจำนวนเงิน */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Name & Amount Size</Label>
            <span className="text-cyan-400 font-medium">
              {currentTextSize}px
            </span>
          </div>
          <Slider
            value={[currentTextSize]}
            onValueChange={(v) => updateSettingValue('textSize', 'title.fontSize', v[0])}
            min={12}
            max={72}
            step={1}
            className="w-full"
          />
          <p className="text-slate-500 text-sm text-right">ขนาดตัวอักษรของชื่อและจำนวนเงิน</p>
        </div>

        {/* Text Color */}
        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Text Color</Label>
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={textColor}
              onChange={(e) => updateSettingValue('textColor', 'title.mainColor', e.target.value)}
              className="w-20 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
            <span className="text-slate-400">{textColor}</span>
          </div>
        </div>

        {/* Border */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Border Width ({borderWidth}px)</Label>
            <Slider
              value={[borderWidth]}
              onValueChange={(v) => updateSettingValue('borderWidth', 'title.strokeWidth', v[0])}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Border Color</Label>
            <Input
              type="color"
              value={borderColor}
              onChange={(e) => updateSettingValue('borderColor', 'title.strokeColor', e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
        </div>

        {/* Special Colors */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Donor Name Color</Label>
            <Input
              type="color"
              value={donorNameColor}
              onChange={(e) => updateSettingValue('donorNameColor', 'title.usernameColor', e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Amount Color</Label>
            <Input
              type="color"
              value={amountColor}
              onChange={(e) => updateSettingValue('amountColor', 'title.amountColor', e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
        </div>

        {/* Amount Suffix */}
        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Amount Suffix</Label>
          <Input
            value={amountSuffix}
            onChange={(e) => updateSettingValue('amountSuffix', 'title.amountSuffix', e.target.value)}
            placeholder="฿"
            className="bg-slate-800/80 border-slate-700 text-white"
          />
          <p className="text-slate-500 text-sm">(Fallback if amountText is not set)</p>
        </div>
      </div>

      {/* Message Styling Section */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">Message Styling</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Message Font Family */}
          <div className="space-y-2">
            <Label className="text-slate-300">Message Font Family</Label>
            <Select
              value={messageFont}
              onValueChange={handleMessageFontChange}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {thaiGoogleFonts.map((fontItem) => (
                  <SelectItem
                    key={fontItem.id}
                    value={fontItem.id}
                    className="text-white hover:bg-slate-700"
                    style={{ fontFamily: fontItem.cssFamily }}
                  >
                    {fontItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Message Font Weight */}
          <div className="space-y-2">
            <Label className="text-slate-300">Message Font Weight</Label>
            <Select
              value={messageFontWeight}
              onValueChange={(v) => updateSettingValue('messageFontWeight', 'message.fontWeight', v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {fontWeights.map((w) => (
                  <SelectItem key={w} value={w} className="text-white hover:bg-slate-700">
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message Font Size */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Message Font Size</Label>
            <span className="text-cyan-400 font-medium">
              {currentMessageFontSize}px
            </span>
          </div>
          <Slider
            value={[currentMessageFontSize]}
            onValueChange={(v) => updateSettingValue('messageFontSize', 'message.fontSize', v[0])}
            min={12}
            max={48}
            step={1}
            className="w-full"
          />
        </div>

        {/* Message Color */}
        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Message Color</Label>
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={messageColor}
              onChange={(e) => updateSettingValue('messageColor', 'message.color', e.target.value)}
              className="w-20 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
            <span className="text-slate-400">{messageColor}</span>
          </div>
        </div>

        {/* Message Border */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Width ({messageBorderWidth}px)</Label>
            <Slider
              value={[messageBorderWidth]}
              onValueChange={(v) => updateSettingValue('messageBorderWidth', 'message.strokeWidth', v[0])}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Color</Label>
            <Input
              type="color"
              value={messageBorderColor}
              onChange={(e) => updateSettingValue('messageBorderColor', 'message.strokeColor', e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}