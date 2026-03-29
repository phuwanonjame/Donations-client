// ในไฟล์: ./components/SettingsTabs.js
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Image, Volume2, Type, Sparkles, Zap, RotateCcw, 
  Eye, Code, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import Tabs
import MediaTab from "./tabs/MediaTab";
import SoundTab from "./tabs/SoundTab";
import TextTab from "./tabs/TextTab";
import DisplayTab from "./tabs/DisplayTab";
import EffectsTab from "./tabs/EffectsTab";
import TemplateTab from "./tabs/TemplateTab";

export default function SettingsTabs({ 
  settings, 
  updateSetting,
  handleReset,
  handleCopyJSON,
  onOpenVisualEditor  // ✅ เพิ่ม props สำหรับเปิด Visual Editor
}) {
  return (
    <div className="space-y-4">
      {/* Visual Editor Button */}
      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Pencil className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Visual Editor</p>
            <p className="text-xs text-slate-400">Click to edit alert in fullscreen mode</p>
          </div>
        </div>
        <Button
          onClick={onOpenVisualEditor}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          size="sm"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Open Visual Editor
        </Button>
      </div>

      {/* Original Tabs */}
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="w-full bg-slate-800/80 p-1 rounded-xl grid grid-cols-6 mb-6">
          <TabsTrigger value="media" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Image className="w-4 h-4 mr-2" /> Media
          </TabsTrigger>
          <TabsTrigger value="sound" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Volume2 className="w-4 h-4 mr-2" /> Sound
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Type className="w-4 h-4 mr-2" /> Text
          </TabsTrigger>
          <TabsTrigger value="display" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2" /> Display
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" /> Effects
          </TabsTrigger>
          <TabsTrigger value="template" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <RotateCcw className="w-4 h-4 mr-2" /> Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media"><MediaTab settings={settings} updateSetting={updateSetting} /></TabsContent>
        <TabsContent value="sound"><SoundTab settings={settings} updateSetting={updateSetting} /></TabsContent>
        <TabsContent value="text"><TextTab settings={settings} updateSetting={updateSetting} /></TabsContent>
        <TabsContent value="display"><DisplayTab settings={settings} updateSetting={updateSetting} /></TabsContent>
        <TabsContent value="effects"><EffectsTab settings={settings} updateSetting={updateSetting} /></TabsContent>
        <TabsContent value="template">
          <TemplateTab 
            currentTemplate={settings.templateId || "basic"}
            handleReset={handleReset} 
            handleCopyJSON={handleCopyJSON}
            onTemplateSelect={(newTemplateSettings) => {
              Object.entries(newTemplateSettings).forEach(([key, value]) => {
                updateSetting(key, value);
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}