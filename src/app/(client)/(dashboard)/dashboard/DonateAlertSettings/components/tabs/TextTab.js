// ==================== TextTab.js ====================
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { thaiGoogleFonts, fontWeights, injectFontFamily } from "../utils/fontUtils";

function optFamily(opt) {
  return opt?.family || opt?.name || opt?.id || "";
}

export default function TextTab({ settings, updateSetting }) {
  const titleText   = settings?.titleText     ?? "{{user}}";
  const titleSuffixText   = settings?.titleSuffixText     ?? "โดเนทมา";
  const amountText   = settings?.titleAmountText     ?? "{{amount}}฿";
  const amountSuffix = settings?.amountSuffix   ?? "฿";

  const fontFamily   = settings?.titleFontFamily           ?? "IBM Plex Sans Thai";
  const fontWeight   = settings?.titleFontWeight     ?? "700";
  const textSize     = settings?.titleFontSize;
  const textColor    = settings?.titleMainColor      ?? "#FFFFFF";
  const donorNameColor = settings?.titleUsernameColor ?? "#FF9500";
  const amountColor  = settings?.titleAmountColor    ?? "#0EA5E9";
  const borderWidth  = settings?.titleStrokeWidth    ?? 2.5;
  const borderColor  = settings?.titleStrokeColor    ?? "#000000";

  const messageFontFamily  = settings?.messageFontFamily        ?? "IBM Plex Sans Thai";
  const messageFontWeight  = settings?.messageFontWeight  ?? "500";
  const messageFontSize    = settings?.messageFontSize    ?? 24;
  const messageColor       = settings?.messageColor       ?? "#FFFFFF";
  const messageBorderWidth = settings?.messageStrokeWidth ?? 2.5;
  const messageBorderColor = settings?.messageStrokeColor ?? "#000000";

  const currentTextSize = Array.isArray(textSize) ? (textSize[0] ?? 36) : (parseInt(textSize) || 36);
  const currentMsgSize  = Array.isArray(messageFontSize) ? (messageFontSize[0] ?? 24) : (parseInt(messageFontSize) || 24);

  React.useEffect(() => {
    injectFontFamily(fontFamily);
    injectFontFamily(messageFontFamily);
  }, [fontFamily, messageFontFamily]);

  const handleFontChange = (familyString) => {
    injectFontFamily(familyString);
    updateSetting("titleFontFamily", familyString);
  };

  const handleMessageFontChange = (familyString) => {
    injectFontFamily(familyString);
    updateSetting("messageFontFamily", familyString);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" /> Message Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label className="text-slate-300">Prefix Text</Label>
            <Input
              value={titleText}
              onChange={(e) => updateSetting("titleText", e.target.value)}
              placeholder="{{user}}"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
            <p className="text-slate-500 text-xs">Use {"{{user}}"} for donor name</p>
          </div>
          <div className="space-y-2">
              <Label className="text-slate-300">Suffix Text</Label>
            <Input
              value={titleSuffixText}
              onChange={(e) => updateSetting("titleSuffixText", e.target.value)}
              placeholder="โดเนทมา"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
            <Label className="text-slate-300">Amount Text Format</Label>
          <Input
            value={amountText}
            onChange={(e) => updateSetting("titleAmountText", e.target.value)}
            placeholder="{{amount}}฿"
            className="bg-slate-800/80 border-slate-700 text-white"
          />
          <p className="text-slate-500 text-sm">Use {"{{amount}}"} as placeholder</p>
        </div>

        {/* Font Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Font Family</Label>
            <Select value={fontFamily} onValueChange={handleFontChange}>
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white" style={{ fontFamily }}>
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {thaiGoogleFonts.map((fontItem) => {
                  const fam = optFamily(fontItem);
                  return (
                    <SelectItem key={fam} value={fam} className="text-white hover:bg-slate-700" style={{ fontFamily: fam }}>
                      {fontItem.name || fam}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="text-slate-200 text-sm px-2 py-1.5 bg-slate-800/50 rounded border border-slate-700/50" style={{ fontFamily }}>
              ตัวอย่าง: สวัสดี ABC 123
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Font Weight</Label>
            <Select value={fontWeight} onValueChange={(v) => updateSetting("titleFontWeight", v)}>
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {fontWeights.map((w) => (
                  <SelectItem key={w} value={w} className="text-white hover:bg-slate-700">
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Name & Amount Size</Label>
            <span className="text-cyan-400 font-medium">{currentTextSize}px</span>
          </div>
          <Slider
            value={[currentTextSize]}
            onValueChange={(v) => updateSetting("titleFontSize", v)}
            min={12} max={72} step={1} className="w-full"
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Text Color</Label>
          <div className="flex items-center gap-3 min-w-0">
            <Input type="color" value={textColor} onChange={(e) => updateSetting("titleMainColor", e.target.value)}
              className="w-16 sm:w-20 h-10 p-1 bg-slate-800/80 border-slate-700 shrink-0" />
            <span className="text-slate-400 font-mono text-xs sm:text-sm truncate">{textColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Border Width ({borderWidth}px)</Label>
            <Slider value={[borderWidth]} onValueChange={(v) => updateSetting("titleStrokeWidth", v[0])}
              min={0} max={10} step={0.5} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Border Color</Label>
            <Input type="color" value={borderColor} onChange={(e) => updateSetting("titleStrokeColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Donor Name Color</Label>
            <Input type="color" value={donorNameColor} onChange={(e) => updateSetting("titleUsernameColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Amount Color</Label>
            <Input type="color" value={amountColor} onChange={(e) => updateSetting("titleAmountColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Amount Suffix</Label>
          <Input value={amountSuffix} onChange={(e) => updateSetting("amountSuffix", e.target.value)}
            placeholder="฿" className="bg-slate-800/80 border-slate-700 text-white" />
        </div>
      </div>

      {/* Message Styling */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">Message Styling</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Message Font Family</Label>
            <Select value={messageFontFamily} onValueChange={handleMessageFontChange}>
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white" style={{ fontFamily: messageFontFamily }}>
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {thaiGoogleFonts.map((fontItem) => {
                  const fam = optFamily(fontItem);
                  return (
                    <SelectItem key={fam} value={fam} className="text-white hover:bg-slate-700" style={{ fontFamily: fam }}>
                      {fontItem.name || fam}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="text-slate-200 text-sm px-2 py-1.5 bg-slate-800/50 rounded border border-slate-700/50" style={{ fontFamily: messageFontFamily }}>
              ตัวอย่าง: สวัสดี ABC 123
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Message Font Weight</Label>
            <Select value={messageFontWeight} onValueChange={(v) => updateSetting("messageFontWeight", v)}>
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {fontWeights.map((w) => (
                  <SelectItem key={w} value={w} className="text-white hover:bg-slate-700">{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Message Font Size</Label>
            <span className="text-cyan-400 font-medium">{currentMsgSize}px</span>
          </div>
          <Slider value={[currentMsgSize]} onValueChange={(v) => updateSetting("messageFontSize", v[0])}
            min={12} max={48} step={1} className="w-full" />
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Message Color</Label>
          <div className="flex items-center gap-3 min-w-0">
            <Input type="color" value={messageColor} onChange={(e) => updateSetting("messageColor", e.target.value)}
              className="w-16 sm:w-20 h-10 p-1 bg-slate-800/80 border-slate-700 shrink-0" />
            <span className="text-slate-400 font-mono text-xs sm:text-sm truncate">{messageColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Width ({messageBorderWidth}px)</Label>
            <Slider value={[messageBorderWidth]} onValueChange={(v) => updateSetting("messageStrokeWidth", v[0])}
              min={0} max={10} step={0.5} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Color</Label>
            <Input type="color" value={messageBorderColor} onChange={(e) => updateSetting("messageStrokeColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
