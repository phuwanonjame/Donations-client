import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";

export default function TextTab({ settings, updateSetting }) {
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
              value={settings.prefixText}
              onChange={(e) => updateSetting("prefixText", e.target.value)}
              placeholder="{{user}}"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Suffix Text</Label>
            <Input
              value={settings.suffixText}
              onChange={(e) => updateSetting("suffixText", e.target.value)}
              placeholder="โดเนทมา"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Amount Text */}
        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Amount Text Format</Label>
          <Input
            value={settings.amountText}
            onChange={(e) => updateSetting("amountText", e.target.value)}
            placeholder="{{amount}}฿"
            className="bg-slate-800/80 border-slate-700 text-white"
          />
          <p className="text-slate-500 text-sm">Use {"{{amount}}"} as placeholder for donation amount</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Font Family</Label>
            <Select
              value={settings.font}
              onValueChange={(v) => updateSetting("font", v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {[
                  { id: "default", name: "Kanit" },
                  { id: "prompt", name: "Prompt" },
                  { id: "sarabun", name: "Sarabun" },
                  { id: "noto", name: "Noto Sans Thai" },
                  { id: "ibmplex", name: "IBM Plex Sans Thai" },
                ].map((font) => (
                  <SelectItem
                    key={font.id}
                    value={font.id}
                    className="text-white hover:bg-slate-700"
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Font Weight</Label>
            <Select
              value={settings.fontWeight}
              onValueChange={(v) => updateSetting("fontWeight", v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {["normal", "medium", "bold", "extrabold"].map((w) => (
                  <SelectItem key={w} value={w} className="text-white hover:bg-slate-700">
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 mb-4">
          <Label className="text-slate-300">Text Size</Label>
          <span className="text-cyan-400 font-medium">{settings.textSize[0]}px</span>
        </div>
        <Slider
          value={settings.textSize}
          onValueChange={(v) => updateSetting("textSize", v)}
          min={12}
          max={72}
          step={1}
          className="w-full"
        />

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Text Color</Label>
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSetting("textColor", e.target.value)}
              className="w-20 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
            <span className="text-slate-400">{settings.textColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Border Width ({settings.borderWidth}px)</Label>
            <Slider
              value={[settings.borderWidth]}
              onValueChange={(v) => updateSetting("borderWidth", v[0])}
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
              value={settings.borderColor}
              onChange={(e) => updateSetting("borderColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Donor Name Color</Label>
            <Input
              type="color"
              value={settings.donorNameColor}
              onChange={(e) => updateSetting("donorNameColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Amount Color</Label>
            <Input
              type="color"
              value={settings.amountColor}
              onChange={(e) => updateSetting("amountColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Amount Suffix</Label>
          <Input
            value={settings.amountSuffix}
            onChange={(e) => updateSetting("amountSuffix", e.target.value)}
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
          <div className="space-y-2">
            <Label className="text-slate-300">Message Font Family</Label>
            <Select
              value={settings.messageFont || settings.font}
              onValueChange={(v) => updateSetting("messageFont", v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {[
                  { id: "default", name: "Kanit" },
                  { id: "prompt", name: "Prompt" },
                  { id: "sarabun", name: "Sarabun" },
                  { id: "noto", name: "Noto Sans Thai" },
                  { id: "ibmplex", name: "IBM Plex Sans Thai" },
                ].map((font) => (
                  <SelectItem
                    key={font.id}
                    value={font.id}
                    className="text-white hover:bg-slate-700"
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Message Font Weight</Label>
            <Select
              value={settings.messageFontWeight || settings.fontWeight}
              onValueChange={(v) => updateSetting("messageFontWeight", v)}
            >
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {["normal", "medium", "bold", "extrabold"].map((w) => (
                  <SelectItem key={w} value={w} className="text-white hover:bg-slate-700">
                    {w.charAt(0).toUpperCase() + w.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Message Font Size ({settings.messageFontSize || 24}px)</Label>
          <Slider
            value={[settings.messageFontSize || 24]}
            onValueChange={(v) => updateSetting("messageFontSize", v[0])}
            min={12}
            max={48}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label className="text-slate-300">Message Color</Label>
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={settings.messageColor || settings.textColor}
              onChange={(e) => updateSetting("messageColor", e.target.value)}
              className="w-20 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
            <span className="text-slate-400">{settings.messageColor || settings.textColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Message Border Width ({settings.messageBorderWidth || 2.5}px)</Label>
            <Slider
              value={[settings.messageBorderWidth || 2.5]}
              onValueChange={(v) => updateSetting("messageBorderWidth", v[0])}
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
              value={settings.messageBorderColor || settings.borderColor}
              onChange={(e) => updateSetting("messageBorderColor", e.target.value)}
              className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}