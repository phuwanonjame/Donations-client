// ============================================
// ไฟล์: components/AlertManager.js หรือหน้าแสดงผลหลัก
// ============================================
import React, { useState } from "react";
import FullscreenVisualEditor from "./FullscreenVisualEditor";
import AlertPreview from "./AlertPreview";

export default function AlertManager() {
  const [settings, setSettings] = useState({
    donorNameColor: "#FF9500",
    amountColor: "#0EA5E9",
    suffixText: "โดเนทมา",
    messageText: "ขอบคุณสำหรับการใช้งาน FastDonate",
    showName: true,
    showAmount: true,
    showMessage: true,
    // ... settings อื่นๆ
  });
  
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveSettings = async () => {
    // บันทึก settings ไปยัง backend หรือ localStorage
    console.log("บันทึก settings:", settings);
    // await api.saveSettings(settings);
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* ปุ่มเปิด Visual Editor */}
      <button 
        onClick={() => setShowVisualEditor(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        เปิด Visual Editor
      </button>
      
      {/* Preview ปกติ */}
      <div className="mt-4">
        <AlertPreview 
          settings={settings}
          isPlaying={false}
        />
      </div>
      
      {/* Visual Editor Modal */}
      {showVisualEditor && (
        <FullscreenVisualEditor
          settings={settings}
          updateSetting={updateSetting}
          onClose={() => setShowVisualEditor(false)}
          onSave={saveSettings}
        />
      )}
    </div>
  );
}