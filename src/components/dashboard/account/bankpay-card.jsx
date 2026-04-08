"use client";

import { useState } from "react";
import { ChevronDown, Save } from "lucide-react";

export default function BankPayCard() {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [type, setType] = useState("phone");
  const [value, setValue] = useState("0825568960");
  const [tag, setTag] = useState("TEST");

  return (
    <div
      className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden
        bg-white/[0.03] backdrop-blur-sm
        ${expanded ? "border-white/20" : "border-white/10"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="https://nozomi.easydonate.app/ezdn-asset/images/payment/promptpay.png"
            alt="PromptPay"
            className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-medium text-white leading-tight truncate">
              ฮนาคาร
            </p>
            <p className="text-xs sm:text-sm text-white/50 truncate">
              รับเงินเข้าบัญชีพร้อมเพย์ทันที
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setEnabled((v) => !v)}
            className={`relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer
              ${enabled
                ? "bg-emerald-600 border-emerald-700"
                : "bg-white/10 border-white/15"
              }`}
          >
            <span
              className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm
                transition-transform duration-300
                ${enabled ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
          <span className="text-[10px] text-white/35">
            {enabled ? "เปิดใช้" : "ปิดใช้"}
          </span>
        </div>
      </div>

      {/* Expand Button */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10
            py-2 text-xs sm:text-sm text-white/50 transition-all duration-200
            hover:bg-white/5 hover:text-white/80 cursor-pointer"
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "ปิด" : "ตั้งค่า"}
        </button>
      </div>

      {/* Form */}
      <div
        className={`overflow-hidden transition-all duration-350 ease-in-out
          ${expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-white/8 px-5 pt-4 pb-5 space-y-4">
          {/* Type Select */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-medium">
              ประเภท
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-black/30
                  px-3 py-2.5 text-sm text-white outline-none cursor-pointer
                  transition-all duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              >
                <option value="phone">เบอร์โทรศัพท์</option>
                <option value="national_id">เลขประจำตัวประชาชน</option>
                <option value="account">เลขที่บัญชี</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
            </div>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-medium">
              {type === "phone"
                ? "เบอร์โทรศัพท์"
                : type === "national_id"
                ? "เลขประจำตัวประชาชน"
                : "เลขที่บัญชี"}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="กรอกข้อมูล"
              className="w-full rounded-lg border border-white/10 bg-black/30
                px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none
                transition-all duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />

            
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 font-medium">
              {type === "phone"
                ? "เบอร์โทรศัพท์"
                : type === "national_id"
                ? "เลขประจำตัวประชาชน"
                : "เลขที่บัญชี"}
            </label>

            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="กรอกข้อมูล"
              className="w-full rounded-lg border border-white/10 bg-black/30
                px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none
                transition-all duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg
              bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98]
              py-2.5 text-sm font-medium text-white transition-all duration-200 cursor-pointer"
          >
            <Save size={14} strokeWidth={2.5} />
            บันทึก
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="flex w-full items-center justify-center rounded-lg border border-white/10
              py-2 text-xs text-white/40 transition-all duration-200
              hover:bg-white/5 hover:text-white/60 cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}