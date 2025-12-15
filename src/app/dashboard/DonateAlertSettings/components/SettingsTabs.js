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

// Import Tabs ลูกย่อยๆ
import MediaTab from "./tabs/MediaTab";
import SoundTab from "./tabs/SoundTab";
import TextTab from "./tabs/TextTab";
import DisplayTab from "./tabs/DisplayTab";
import EffectsTab from "./tabs/EffectsTab";
import TemplateTab from "./tabs/TemplateTab";

export default function SettingsTabs({ 
  settings, 
  updateSetting,
  handleReset,     // ✅ รับมา
  handleCopyJSON   // ✅ รับมา
}) {
  return (
    <Tabs defaultValue="template" className="w-full">
      <TabsList className="w-full bg-slate-800/80 p-1 rounded-xl grid grid-cols-6 mb-6">
        <TabsTrigger value="media" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"><Image className="w-4 h-4 mr-2" /> Media</TabsTrigger>
        <TabsTrigger value="sound" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"><Volume2 className="w-4 h-4 mr-2" /> Sound</TabsTrigger>
        <TabsTrigger value="text" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"><Type className="w-4 h-4 mr-2" /> Text</TabsTrigger>
        <TabsTrigger value="display" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"><Sparkles className="w-4 h-4 mr-2" /> Display</TabsTrigger>
        <TabsTrigger value="effects" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"><Zap className="w-4 h-4 mr-2" /> Effects</TabsTrigger>
        <TabsTrigger value="template" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"><RotateCcw className="w-4 h-4 mr-2" /> Template</TabsTrigger>
      </TabsList>

      <TabsContent value="media"><MediaTab settings={settings} updateSetting={updateSetting} /></TabsContent>
      <TabsContent value="sound"><SoundTab settings={settings} updateSetting={updateSetting} /></TabsContent>
      <TabsContent value="text"><TextTab settings={settings} updateSetting={updateSetting} /></TabsContent>
      <TabsContent value="display"><DisplayTab settings={settings} updateSetting={updateSetting} /></TabsContent>
      <TabsContent value="effects"><EffectsTab settings={settings} updateSetting={updateSetting} /></TabsContent>

      {/* ✅ ส่วนที่แก้ไขสำคัญ */}
      <TabsContent value="template">
        <TemplateTab 
          currentTemplate={settings.templateId || "basic"} // ส่ง templateId ปัจจุบันไปด้วย (ถ้ามีเก็บใน settings)
          handleReset={handleReset} 
          handleCopyJSON={handleCopyJSON}
          
          // 👇 Logic สำหรับอัปเดต settings เมื่อเลือก Template
          onTemplateSelect={(newTemplateSettings) => {
            // วนลูปอัปเดตค่าทุกตัวที่อยู่ใน Template นั้นๆ เข้าสู่ State หลัก
            Object.entries(newTemplateSettings).forEach(([key, value]) => {
              updateSetting(key, value);
            });
          }}
        />
      </TabsContent>
    </Tabs>
  );
}