// ในไฟล์: ./components/tabs/DisplayTab.js
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Clock, Palette, Eye, EyeOff } from "lucide-react";

export default function DisplayTab({ settings, updateSetting }) {
  
  // Helper function to get values (support both flat and grouped)
  const getSettingValue = (flatKey, groupedPath, defaultValue) => {
    if (!settings) return defaultValue;
    
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
    
    return settings[flatKey] !== undefined && settings[flatKey] !== null 
      ? settings[flatKey] 
      : defaultValue;
  };

  const updateSettingValue = (flatKey, groupedPath, value) => {
    if (settings.metadata) {
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
      updateSetting(flatKey, value);
    }
  };

  // Get values
  const displayDuration = getSettingValue('displayDuration', 'animation.display.duration', 3);
  const inAnimation = getSettingValue('inAnimation', 'animation.enter.type', 'fadeInUp');
  const inDuration = getSettingValue('inDuration', 'animation.enter.duration', 1);
  const outAnimation = getSettingValue('outAnimation', 'animation.exit.type', 'fadeOutUp');
  const outDuration = getSettingValue('outDuration', 'animation.exit.duration', 1);
  const backgroundColor = getSettingValue('backgroundColor', 'backgroundColor', 'transparent');
  const minAmountForAlert = getSettingValue('minAmountForAlert', 'minimumDonation', 10);
  
  // ✅ Get visibility settings
  const showName = getSettingValue('showName', 'title.showName', true);
  const showAmount = getSettingValue('showAmount', 'title.showAmount', true);
  const showMessage = getSettingValue('showMessage', 'message.showMessage', true);

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
            onValueChange={(v) => updateSettingValue('displayDuration', 'animation.display.duration', v[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <span className="text-cyan-400 font-medium">{displayDuration}s</span>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Background Color
          </Label>
          <Input
            type="color"
            value={backgroundColor === 'transparent' ? '#1e293b' : backgroundColor}
            onChange={(e) => updateSettingValue('backgroundColor', 'backgroundColor', e.target.value)}
            className="w-12 h-10 p-1 bg-slate-800/80 border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Animation In</Label>
          <Select value={inAnimation} onValueChange={(v) => updateSettingValue('inAnimation', 'animation.enter.type', v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="fadeIn" className="text-white hover:bg-slate-700">Fade In</SelectItem>
              <SelectItem value="fadeInDown" className="text-white hover:bg-slate-700">Fade In Down</SelectItem>
              <SelectItem value="fadeInUp" className="text-white hover:bg-slate-700">Fade In Up</SelectItem>
              <SelectItem value="bounceIn" className="text-white hover:bg-slate-700">Bounce In</SelectItem>
              <SelectItem value="zoomIn" className="text-white hover:bg-slate-700">Zoom In</SelectItem>
              <SelectItem value="slideInLeft" className="text-white hover:bg-slate-700">Slide In Left</SelectItem>
              <SelectItem value="slideInRight" className="text-white hover:bg-slate-700">Slide In Right</SelectItem>
              <SelectItem value="rollIn" className="text-white hover:bg-slate-700">Roll In</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">In Duration ({inDuration}s)</Label>
          <Slider 
            value={[inDuration]} 
            onValueChange={(v) => updateSettingValue('inDuration', 'animation.enter.duration', v[0])} 
            min={0.5} 
            max={3} 
            step={0.1} 
            className="w-full" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Animation Out</Label>
          <Select value={outAnimation} onValueChange={(v) => updateSettingValue('outAnimation', 'animation.exit.type', v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="fadeOut" className="text-white hover:bg-slate-700">Fade Out</SelectItem>
              <SelectItem value="fadeOutUp" className="text-white hover:bg-slate-700">Fade Out Up</SelectItem>
              <SelectItem value="fadeOutDown" className="text-white hover:bg-slate-700">Fade Out Down</SelectItem>
              <SelectItem value="bounceOut" className="text-white hover:bg-slate-700">Bounce Out</SelectItem>
              <SelectItem value="zoomOut" className="text-white hover:bg-slate-700">Zoom Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Out Duration ({outDuration}s)</Label>
          <Slider 
            value={[outDuration]} 
            onValueChange={(v) => updateSettingValue('outDuration', 'animation.exit.duration', v[0])} 
            min={0.5} 
            max={3} 
            step={0.1} 
            className="w-full" 
          />
        </div>
      </div>

      {/* ✅ Visibility Controls - ต้องใช้ updateSettingValue */}
      <div className="space-y-3 mt-6">
        <h4 className="text-md font-semibold text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" /> Visibility Settings
        </h4>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-white">Show Donor Name</span>
          </div>
          <Switch
            checked={showName}
            onCheckedChange={(v) => updateSettingValue('showName', 'title.showName', v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-white">Show Amount</span>
          </div>
          <Switch
            checked={showAmount}
            onCheckedChange={(v) => updateSettingValue('showAmount', 'title.showAmount', v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-white">Show Message</span>
          </div>
          <Switch
            checked={showMessage}
            onCheckedChange={(v) => updateSettingValue('showMessage', 'message.showMessage', v)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
          />
        </div>
      </div>

      {/* Minimum Donation */}
      <div className="space-y-2 mt-6">
        <Label className="text-slate-300">Minimum Donation Amount ({minAmountForAlert}฿)</Label>
        <Slider
          value={[minAmountForAlert]}
          onValueChange={(v) => updateSettingValue('minAmountForAlert', 'minimumDonation', v[0])}
          min={1}
          max={1000}
          step={1}
          className="w-full"
        />
        <p className="text-slate-500 text-sm">Alerts will only show for donations above this amount</p>
      </div>
    </motion.div>
  );
}