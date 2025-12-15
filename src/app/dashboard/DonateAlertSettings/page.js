"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // เพิ่ม motion เข้ามาใช้ใน PreviewPanel
import { Bell, Eye } from "lucide-react"; // เพิ่ม icons ที่ใช้ใน PreviewPanel
import { Button } from '@/components/ui/button'; // เพิ่ม Button ที่ใช้ใน PreviewPanel

// สมมติว่าไฟล์เหล่านี้มีอยู่จริง
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import PreviewPanel from "./components/PreviewPanel";
import { defaultSettings } from "./components/utils/settingsUtils";

import {
  saveDonateSettings,
  fetchDonateSettings,
} from "../action/DonateAlertapi/donateSettingsApi";

export default function DonateAlertSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  // 1. โหลดข้อมูลเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const loadSettings = async () => {
      let res = await fetchDonateSettings();

      if (!res || !res.settings) {
        console.log("⚠ ไม่มีข้อมูล ใช้ default");
        setSettings(defaultSettings);
      } else {
        console.log("📥 Loaded:", res.settings);
        // รวมค่า default เพื่อป้องกัน key หายในกรณี update เวอร์ชั่นใหม่
        setSettings({
          ...defaultSettings,
          ...res.settings,
        });
      }
    };

    loadSettings();
  }, []);

  // 2. ฟังก์ชันอัปเดตค่าทีละตัว
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // 3. ฟังก์ชัน Reset ค่าเป็น Default
  const handleResetSettings = () => {
    const confirmed = window.confirm("คุณต้องการรีเซ็ตการตั้งค่าทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?");
    if (confirmed) {
      setSettings(defaultSettings);
      saveDonateSettings(defaultSettings);
    }
  };

  // 4. ฟังก์ชัน Copy JSON
  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(settings, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert("คัดลอกการตั้งค่า (JSON) เรียบร้อยแล้ว!");
  };

  // 5. ฟังก์ชัน Save ลง Database
  const handleSave = async () => {
    const settingsToSend = settings;
    console.log("Saving...", settingsToSend);

    setLoading(true);
    const res = await saveDonateSettings(settingsToSend);
    setLoading(false);

    if (!res) {
      alert("❌ Failed to save settings!");
      return;
    }

    alert("✅ Settings saved successfully!");
  };

  return (
    // **💡 แก้ไข:** ถ้าต้องการให้ Preview Panel ทำงาน sticky อย่างถูกต้อง 
    // ตรวจสอบให้แน่ใจว่า div นี้ไม่ได้อยู่ใน container อื่นที่มี overflow: hidden
    <div className="min-h-screen"> 
      <div className="mx-auto space-y-8 px-4 sm:px-6  "> {/* เพิ่ม padding เพื่อความสวยงาม */}
        
        {/* Header */}
        <SettingsHeader settings={settings} updateSetting={updateSetting} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column: Tabs */}
          <div className="xl:col-span-2 space-y-6">
            <SettingsTabs
              settings={settings}
              updateSetting={updateSetting}
              handleReset={handleResetSettings}
              handleCopyJSON={handleCopyJSON}
            />
            {/* เพื่อให้หน้าจอมีความยาวพอที่จะ Scroll ได้ดี */}
            <div className="h-[1000px] text-slate-500">
                {/* เพิ่มพื้นที่ว่างให้เกิด Scrollbar เพื่อทดสอบ Sticky */}
                <p>Scroll down to test the sticky preview...</p>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="xl:col-span-1">
            <PreviewPanel settings={settings} handleSave={handleSave} loading={loading} />
          </div>
          
        </div>
      </div>
    </div>
  );
}