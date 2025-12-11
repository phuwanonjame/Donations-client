"use client";
import React, { useState } from "react";
// สมมติว่าไฟล์เหล่านี้มีอยู่จริง
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import PreviewPanel from "./components/PreviewPanel";
import { defaultSettings } from "./components/utils/settingsUtils";

export default function DonateAlertSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * ฟังก์ชันสำหรับแปลงโครงสร้างการตั้งค่า Donation Alert จากรูปแบบ Flat (ที่ใช้ใน UI)
   * เป็นรูปแบบ Nested JSON (ที่ใช้สำหรับ API/Backend)
   * @param {object} flatSettings - Object การตั้งค่าแบบ Flat จาก state
   * @returns {object} - Object การตั้งค่าแบบ Nested ที่พร้อมส่ง
   */
  const transformSettings = (flatSettings) => {
    const {
      // System/Root Level Properties (ต้องดึงมาจาก state หรือกำหนดค่าเริ่มต้น)
      id,
      userId,
      createdAt,
      updatedAt,
      token,
      type = "ALERT",

      // Flat Properties ที่จะถูกนำไปจัดกลุ่มใน metadata
      enabled,
      volume,
      duration,
      textSize,
      alertSound,
      animation,
      font,
      fontWeight,
      textColor,
      borderWidth,
      borderColor,
      donorNameColor,
      amountColor,
      backgroundColor,
      showAmount,
      showMessage,
      showName,
      prefixText,
      suffixText,
      amountText,
      amountSuffix,
      minAmountForAlert,
      inAnimation,
      inDuration,
      outAnimation,
      outDuration,
      displayDuration,
      ttsVoice,
      ttsRate,
      ttsPitch,
      ttsEnabled,
      ttsMessageEnabled,
      ttsVolume,
      useCustomSound,
      customSound,
      alertImage,
      effect,
      useRanges,
      ranges,
      amountShine,
      messageFont,
      messageFontWeight,
      messageFontSize,
      messageColor,
      messageBorderWidth,
      messageBorderColor,
      ttsTitleEnabled,
      ttsMessageEnabledField, // Key สำหรับ TTS Message Enabled
      ...rest
    } = flatSettings;

    // จัดกลุ่ม properties ให้เป็นโครงสร้าง nested ที่ต้องการ
    return {
      id: id,
      type: type,
      userId: userId,
      createdAt: createdAt,
      updatedAt: updatedAt,
      token: token,

      metadata: {
        type: "main",
        minimumDonation: minAmountForAlert,
        image: alertImage,
        effect: effect,

        // --- Audio/Sound Settings ---
        audio: {
          tts: {
            rate: ttsRate,
            pitch: ttsPitch,
            voice: ttsVoice,
            volume: ttsVolume,
            title: { enabled: ttsTitleEnabled },
            message: { enabled: ttsMessageEnabledField }, // ใช้ ttsMessageEnabledField
          },
          notification: {
            sound: alertSound,
            volume: Array.isArray(volume) ? volume[0] : volume,
            useCustom: useCustomSound,
            customSound: customSound,
          },
        },

        // --- Title/Text Settings (ข้อความหลัก) ---
        title: {
          // รวม prefix และ suffix เพื่อให้เป็น text เดียวกัน
          text: `${prefixText} ${suffixText}`,
          amountText: amountText,
          fontSize: Array.isArray(textSize) ? textSize[0] : textSize,
          fontFamily: font,
          fontWeight: fontWeight,
          mainColor: textColor,
          amountColor: amountColor,
          amountShine: amountShine,
          strokeColor: borderColor,
          strokeWidth: borderWidth,
          usernameColor: donorNameColor,
        },

        // --- Message Settings (ข้อความโดเนท) ---
        message: {
          fontFamily: messageFont,
          fontWeight: messageFontWeight,
          fontSize: messageFontSize,
          color: messageColor,
          strokeWidth: messageBorderWidth,
          strokeColor: messageBorderColor,
        },

        // --- Animation Settings ---
        animation: {
          // แปลงจากวินาทีเป็นมิลลิวินาที
          enter: { type: inAnimation, duration: inDuration * 1000 },
          display: { duration: displayDuration * 1000 },
          exit: { type: outAnimation, duration: outDuration * 1000 },
        },

        // --- Ranges ---
        ranges: {
          useRanges: useRanges,
          items: ranges,
        },

        // ...rest สามารถมี properties อื่นๆ ที่ไม่ได้ถูก map
        ...rest,
      },
    };
  };

  const handleSave = async () => {
    // ⭐️ ใช้ฟังก์ชันแปลงโครงสร้างก่อน log/ส่ง API ⭐️
    const settingsToSend = transformSettings(settings);

    alert("Settings saved successfully! (Mock)");
    console.log("Settings to save:", settingsToSend);
    // ในการทำงานจริง: await saveSettings(settingsToSend);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings(defaultSettings);
    }
  };

  const handleCopyJSON = () => {
    const settingsToSend = transformSettings(settings); // คัดลอกในรูปแบบที่ส่งจริง
    navigator.clipboard.writeText(JSON.stringify(settingsToSend, null, 2));
    alert("Settings copied to clipboard!");
  };

  if (loading)
    return <p className="text-white text-center mt-6">Loading settings...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <SettingsHeader settings={settings} updateSetting={updateSetting} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
          {/* Settings Panel */}
          <div className="xl:col-span-2 space-y-6">
            <SettingsTabs
              settings={settings}
              updateSetting={updateSetting}
              handleReset={handleReset}
              handleCopyJSON={handleCopyJSON}
            />
          </div>

          {/* Preview Panel */}
          <PreviewPanel settings={settings} handleSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
