// ==================== TextTab.js ====================
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { thaiGoogleFonts, fontWeights } from "../utils/fontUtils";

const _injected = new Set();
function injectFont(family) {
  if (!family || _injected.has(family) || typeof document === "undefined") return;
  _injected.add(family);
  if (document.querySelector(`link[data-gf="${family}"]`)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
  l.setAttribute("data-gf", family);
  document.head.appendChild(l);
}

function optFamily(opt) {
  return opt?.family || opt?.name || opt?.id || "";
}

export default function TextTab({ settings, updateSetting }) {
  // ✅ flat structure เท่านั้น
  const prefixText   = settings?.prefixText     ?? "{{user}}";
  const suffixText   = settings?.suffixText     ?? "โดเนทมา";
  const amountText   = settings?.amountText     ?? "{{amount}}฿";
  const amountSuffix = settings?.amountSuffix   ?? "฿";

  const fontFamily   = settings?.font           ?? "IBM Plex Sans Thai";
  const fontWeight   = settings?.fontWeight     ?? "700";
  const textSize     = settings?.textSize;
  const textColor    = settings?.textColor      ?? "#FFFFFF";
  const donorNameColor = settings?.donorNameColor ?? "#FF9500";
  const amountColor  = settings?.amountColor    ?? "#0EA5E9";
  const borderWidth  = settings?.borderWidth    ?? 2.5;
  const borderColor  = settings?.borderColor    ?? "#000000";

  const messageFontFamily  = settings?.messageFont        ?? "IBM Plex Sans Thai";
  const messageFontWeight  = settings?.messageFontWeight  ?? "500";
  const messageFontSize    = settings?.messageFontSize    ?? 24;
  const messageColor       = settings?.messageColor       ?? "#FFFFFF";
  const messageBorderWidth = settings?.messageBorderWidth ?? 2.5;
  const messageBorderColor = settings?.messageBorderColor ?? "#000000";

  const currentTextSize = Array.isArray(textSize) ? (textSize[0] ?? 36) : (parseInt(textSize) || 36);
  const currentMsgSize  = Array.isArray(messageFontSize) ? (messageFontSize[0] ?? 24) : (parseInt(messageFontSize) || 24);

  const handleFontChange = (familyString) => {
    injectFont(familyString);
    updateSetting("font", familyString);
  };

  const handleMessageFontChange = (familyString) => {
    injectFont(familyString);
    updateSetting("messageFont", familyString);
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
              onChange={(e) => updateSetting("prefixText", e.target.value)}
              placeholder="{{user}}"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
            <p className="text-slate-500 text-xs">Use {"{{user}}"} for donor name</p>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Suffix Text</Label>
            <Input
              value={suffixText}
              onChange={(e) => updateSetting("suffixText", e.target.value)}
              placeholder="โดเนทมา"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Amount Text Format</Label>
          <Input
            value={amountText}
            onChange={(e) => updateSetting("amountText", e.target.value)}
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
            <Select value={fontWeight} onValueChange={(v) => updateSetting("fontWeight", v)}>
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
            onValueChange={(v) => updateSetting("textSize", v)}
            min={12} max={72} step={1} className="w-full"
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Text Color</Label>
          <div className="flex items-center gap-3">
            <Input type="color" value={textColor} onChange={(e) => updateSetting("textColor", e.target.value)}
              className="w-20 h-10 p-1 bg-slate-800/80 border-slate-700" />
            <span className="text-slate-400">{textColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Border Width ({borderWidth}px)</Label>
            <Slider value={[borderWidth]} onValueChange={(v) => updateSetting("borderWidth", v[0])}
              min={0} max={10} step={0.5} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Border Color</Label>
            <Input type="color" value={borderColor} onChange={(e) => updateSetting("borderColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Donor Name Color</Label>
            <Input type="color" value={donorNameColor} onChange={(e) => updateSetting("donorNameColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Amount Color</Label>
            <Input type="color" value={amountColor} onChange={(e) => updateSetting("amountColor", e.target.value)}
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
          <div className="flex items-center gap-3">
            <Input type="color" value={messageColor} onChange={(e) => updateSetting("messageColor", e.target.value)}
              className="w-20 h-10 p-1 bg-slate-800/80 border-slate-700" />
            <span className="text-slate-400">{messageColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Width ({messageBorderWidth}px)</Label>
            <Slider value={[messageBorderWidth]} onValueChange={(v) => updateSetting("messageBorderWidth", v[0])}
              min={0} max={10} step={0.5} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Color</Label>
            <Input type="color" value={messageBorderColor} onChange={(e) => updateSetting("messageBorderColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}