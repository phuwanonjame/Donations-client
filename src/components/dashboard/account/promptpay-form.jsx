"use client";
import { toast } from "sonner";

import FormWrapper from "@/components/form/form-wrapper";
import { useState, useEffect } from "react";
import { ChevronDown, Save } from "lucide-react";
import FormField from "@/components/form/form-field";
import { promptpaySchema } from "@/schemas/profile.schema";
import { Label } from "@/components/ui/label";
import FormButton from "@/components/form/form-button";

const promptpay = {
  promptpayType: "",
  promptpayValue: "",
};

export default function PromptpayForm() {
  const [expanded, setExpanded] = useState(false);

  // 🔥 toggle state แยก
  const [enabled, setEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // 🔥 ใช้เป็น gate
  const [isSaved, setIsSaved] = useState(false);

  const onSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 1500));
    console.log("SAVE:", data);

    setIsSaved(true); // ✅ unlock toggle
  };

  const handleToggle = async () => {
    if (!isSaved) {
      toast.warning("กรุณาบันทึกข้อมูลก่อน");
      return;
    }

    if (toggleLoading) return;

    try {
      setToggleLoading(true);

      const newValue = !enabled;

      // mock API
      await new Promise((res) => setTimeout(res, 1000));

      setEnabled(newValue);

      // ✅ success toast
      toast.success(newValue ? "เปิดใช้งานสำเร็จ" : "ปิดใช้งานสำเร็จ");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <FormWrapper
      schema={promptpaySchema}
      onSubmit={onSubmit}
      defaultValues={{
        promptpayType: promptpay.promptpayType,
        promptpayValue: promptpay.promptpayValue,
      }}
    >
      {({ loading, isDirty, watch }) => {
        const type = watch("promptpayType");

        // 🔥 ถ้ามีการแก้ form → lock toggle ใหม่
        useEffect(() => {
          if (isDirty) setIsSaved(false);
        }, [isDirty]);

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
                  <p className="text-sm sm:text-base font-medium text-white truncate">
                    พร้อมเพย์
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
                  onClick={handleToggle}
                  disabled={!isSaved || toggleLoading}
                  className={`relative w-11 h-6 rounded-full border transition-all duration-300
                    ${
                      enabled
                        ? "bg-emerald-600 border-emerald-700"
                        : "bg-white/10 border-white/15"
                    }
                    ${
                      !isSaved || toggleLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                >
                  <span
                    className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white
                      transition-transform duration-300
                      ${enabled ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <span className="text-[10px] text-white/35">
                  {toggleLoading
                    ? "กำลังโหลด..."
                    : enabled
                      ? "เปิดใช้"
                      : "ปิดใช้"}
                </span>
              </div>
            </div>

            {/* Expand */}
            <div className="px-5 pb-4">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10
                  py-2 text-xs sm:text-sm text-white/50 hover:bg-white/5 hover:text-white/80"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
                {expanded ? "ปิด" : "ตั้งค่า"}
              </button>
            </div>

            {/* Form */}
            <div
              className={`overflow-hidden transition-all duration-300
                ${expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="border-t border-white/8 px-5 pt-4 pb-5 space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">
                    ประเภท
                  </label>

                  <FormField
                    name="promptpayType"
                    type="select"
                    placeholder="Select promptpay type"
                    loading={loading}
                    options={[
                      { label: "เบอร์โทรศัพท์", value: "phone" },
                      { label: "เลขประจำตัวประชาชน", value: "national_id" },
                      { label: "เลขที่บัญชี", value: "account" },
                    ]}
                  />
                </div>

                {/* Value */}
                <div>
                  <Label className="block text-xs text-white/40 mb-1.5">
                    {type === "phone"
                      ? "เบอร์โทรศัพท์"
                      : type === "national_id"
                        ? "เลขประจำตัวประชาชน"
                        : "เลขที่บัญชี"}
                  </Label>

                  <FormField
                    name="promptpayValue"
                    type="text"
                    placeholder="กรอกข้อมูล"
                    loading={loading}
                    className="w-full rounded-lg border border-white/10 bg-black/30
                      px-3 py-2.5 text-sm text-white placeholder:text-white/25"
                  />
                </div>

                {/* Save */}
                <FormButton
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8"
                  loading={loading}
                  isDirty={isDirty}
                >
                  <Save className="w-4 h-4" />
                  Save
                </FormButton>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="w-full rounded-lg border border-white/10 py-2 text-xs text-white/40 hover:bg-white/5"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </FormWrapper>
  );
}
