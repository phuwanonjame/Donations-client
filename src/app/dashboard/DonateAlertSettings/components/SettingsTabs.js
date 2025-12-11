import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Image, 
  Volume2, 
  Type, 
  Sparkles, 
  Zap, 
  RotateCcw 
} from "lucide-react";
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
  handleCopyJSON 
}) {
  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="w-full bg-slate-800/80 p-1 rounded-xl grid grid-cols-6">
        <TabsTrigger
          value="media"
          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
        >
          <Image className="w-4 h-4 mr-2" /> Media
        </TabsTrigger>
        <TabsTrigger
          value="sound"
          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
        >
          <Volume2 className="w-4 h-4 mr-2" /> Sound
        </TabsTrigger>
        <TabsTrigger
          value="text"
          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
        >
          <Type className="w-4 h-4 mr-2" /> Text
        </TabsTrigger>
        <TabsTrigger
          value="display"
          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Display
        </TabsTrigger>
        <TabsTrigger
          value="effects"
          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
        >
          <Zap className="w-4 h-4 mr-2" /> Effects
        </TabsTrigger>
        <TabsTrigger
          value="template"
          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Template
        </TabsTrigger>
      </TabsList>

      {/* Media Tab */}
      <TabsContent value="media" className="mt-6">
        <MediaTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>

      {/* Sound Tab */}
      <TabsContent value="sound" className="mt-6">
        <SoundTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>

      {/* Text Tab */}
      <TabsContent value="text" className="mt-6">
        <TextTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>

      {/* Display Tab */}
      <TabsContent value="display" className="mt-6">
        <DisplayTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>

      {/* Effects Tab */}
      <TabsContent value="effects" className="mt-6">
        <EffectsTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>

      {/* Template Tab */}
      <TabsContent value="template" className="mt-6">
        <TemplateTab handleReset={handleReset} handleCopyJSON={handleCopyJSON} />
      </TabsContent>
    </Tabs>
  );
}