// ==================== DisplayTab.js ====================
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Clock, Palette, Eye } from "lucide-react";

export default function DisplayTab({ settings, updateSetting }) {
  // ✅ flat structure เท่านั้น
  const displayDuration  = settings?.displayDuration  ?? 3;
  const inAnimation      = settings?.inAnimation      ?? "fadeInUp";
  const inDuration       = settings?.inDuration       ?? 1;
  const outAnimation     = settings?.outAnimation     ?? "fadeOutUp";
  const outDuration      = settings?.outDuration      ?? 1;
  const backgroundColor  = settings?.backgroundColor  ?? "transparent";
  const minAmountForAlert = settings?.minAmountForAlert ?? 10;
  const showName         = settings?.showName         ?? true;
  const showAmount       = settings?.showAmount       ?? true;
  const showMessage      = settings?.showMessage      ?? true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cyan-400" /> Animation & Timing
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Display Duration
          </Label>
          <Slider
            value={[displayDuration]}
            onValueChange={(v) => updateSetting("displayDuration", v[0])}
            min={1} max={10} step={1} className="w-full"
          />
          <span className="text-cyan-400 font-medium">{displayDuration}s</span>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Background Color
          </Label>
          <Input
            type="color"
            value={backgroundColor === "transparent" ? "#1e293b" : backgroundColor}
            onChange={(e) => updateSetting("backgroundColor", e.target.value)}
            className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Animation In</Label>
          <Select value={inAnimation} onValueChange={(v) => updateSetting("inAnimation", v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {["fadeIn","fadeInDown","fadeInUp","bounceIn","zoomIn","slideInLeft","slideInRight","rollIn"].map(v => (
                <SelectItem key={v} value={v} className="text-white hover:bg-slate-700">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">In Duration ({inDuration}s)</Label>
          <Slider value={[inDuration]} onValueChange={(v) => updateSetting("inDuration", v[0])}
            min={0.5} max={3} step={0.1} className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Animation Out</Label>
          <Select value={outAnimation} onValueChange={(v) => updateSetting("outAnimation", v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {["fadeOut","fadeOutUp","fadeOutDown","bounceOut","zoomOut"].map(v => (
                <SelectItem key={v} value={v} className="text-white hover:bg-slate-700">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Out Duration ({outDuration}s)</Label>
          <Slider value={[outDuration]} onValueChange={(v) => updateSetting("outDuration", v[0])}
            min={0.5} max={3} step={0.1} className="w-full" />
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="space-y-3 mt-6">
        <h4 className="text-md font-semibold text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" /> Visibility Settings
        </h4>
        {[
          { key: "showName",    label: "Show Donor Name" },
          { key: "showAmount",  label: "Show Amount" },
          { key: "showMessage", label: "Show Message" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-white">{label}</span>
            </div>
            <Switch
              checked={key === "showName" ? showName : key === "showAmount" ? showAmount : showMessage}
              onCheckedChange={(v) => updateSetting(key, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Minimum Donation */}
      <div className="space-y-2 mt-6">
        <Label className="text-slate-300">Minimum Donation Amount ({minAmountForAlert}฿)</Label>
        <Slider
          value={[minAmountForAlert]}
          onValueChange={(v) => updateSetting("minAmountForAlert", v[0])}
          min={1} max={1000} step={1} className="w-full"
        />
        <p className="text-slate-500 text-sm">Alerts will only show for donations above this amount</p>
      </div>
    </motion.div>
  );
}