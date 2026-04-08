// ============================================
// FullscreenVisualEditor.js — STABLE (no infinite loop)
// ============================================
"use client";
import React, {
  useState, useEffect, useRef, useCallback, memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Edit3, Type, Image, Eye, Sparkles,
  Volume2, ArrowLeft, Maximize2, Minimize2,
  Zap, ChevronRight, Layers, MessageSquare,
  HelpCircle, X, ChevronLeft, ChevronRight as ChevronRightIcon,
  MousePointerClick, Palette, Play, CheckCircle2,
} from "lucide-react";
import { Button }  from "@/components/ui/button";
import { Input }   from "@/components/ui/input";
import { Label }   from "@/components/ui/label";
import { Slider }  from "@/components/ui/slider";
import { Switch }  from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AlertPreview from "./AlertPreview";
import { playAlertSound } from "../../../../../../utils/audioUtils";
import { thaiGoogleFonts, fontWeights } from "./utils/fontUtils";

/* ─────────────────────────────────────────────
   FONT UTILITIES  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
function optFamily(opt) {
  return opt?.family || opt?.name || opt?.id || "";
}

const _injected = new Set();
function injectFont(family) {
  if (!family || _injected.has(family) || typeof document === "undefined") return;
  _injected.add(family);
  if (document.querySelector(`link[data-gf="${family}"]`)) return;
  const l = document.createElement("link");
  l.rel  = "stylesheet";
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g,"+")}:wght@300;400;500;600;700;800;900&display=swap`;
  l.setAttribute("data-gf", family);
  document.head.appendChild(l);
}

/* ─────────────────────────────────────────────
   HELPERS  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
function isHex(v) { return typeof v === "string" && /^#[0-9a-fA-F]{3,8}$/.test(v); }

const ARR_KEYS = new Set(["textSize","messageFontSize","volume","ttsVolume"]);

function readArr(raw, fb = 0) {
  if (Array.isArray(raw)) return raw[0] ?? fb;
  return typeof raw === "number" ? raw : fb;
}

/* ─────────────────────────────────────────────
   ONBOARDING STEPS
───────────────────────────────────────────── */
const ONBOARDING_KEY = "ve_onboarding_done";

const STEPS = [
  {
    icon: <MousePointerClick className="w-10 h-10 text-cyan-400" />,
    title: "คลิก Badge เพื่อแก้ไข",
    desc: "ด้านซ้ายและขวามี Badge แต่ละส่วน เช่น รูปภาพ, ข้อความ, เสียง — คลิกเพื่อเปิดแผงตั้งค่าได้เลย",
    highlight: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40",
    tip: "💡 Badge ที่เลือกอยู่จะมีเส้นเชื่อมไปยัง element จริงบน Preview",
  },
  {
    icon: <Palette className="w-10 h-10 text-purple-400" />,
    title: "ปรับแต่งได้ทันที",
    desc: "เปลี่ยนสี, ฟอนต์, ขนาด, เอฟเฟกต์ — Preview กลางจอจะอัปเดตทันทีโดยไม่ต้อง Save",
    highlight: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/40",
    tip: "💡 ใช้ปุ่ม ± ด้านขวาบน Preview เพื่อ Zoom เข้า-ออก",
  },
  {
    icon: <Play className="w-10 h-10 text-green-400" />,
    title: "ทดสอบ Animation",
    desc: "กดปุ่ม ▶ เล่น ที่ด้านบนขวา เพื่อดู Animation เข้า-แสดง-ออก ก่อน Save จริง",
    highlight: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/40",
    tip: "💡 ปรับ Animation ได้ที่ Badge 'อนิเมชัน' ด้านขวา",
  },
  {
    icon: <CheckCircle2 className="w-10 h-10 text-amber-400" />,
    title: "บันทึกเมื่อพร้อม",
    desc: "เมื่อแต่งครบแล้ว กดปุ่ม 'บันทึกและปิด' สีฟ้า-น้ำเงิน ด้านบนขวา เพื่อบันทึกทุกการเปลี่ยนแปลง",
    highlight: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40",
    tip: "💡 ถ้าออกโดยไม่ Save จะมี indicator 'ยังไม่ได้บันทึก' เตือน",
  },
];

/* ─────────────────────────────────────────────
   ONBOARDING MODAL
───────────────────────────────────────────── */
const OnboardingModal = memo(function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const s = STEPS[step];
  const isLast = step === total - 1;

  const handleFinish = () => {
    try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch {}
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleFinish(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className={`rounded-2xl border backdrop-blur-xl p-6 ${s.highlight} bg-slate-900/95 shadow-2xl`}>

          {/* Close */}
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step
                    ? "bg-cyan-400 w-6"
                    : i < step
                    ? "bg-cyan-700 w-3"
                    : "bg-slate-700 w-3"
                }`}
              />
            ))}
            <span className="ml-auto text-[10px] text-slate-500 font-mono">
              {step + 1} / {total}
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              {s.icon}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <h3 className="text-lg font-bold text-white text-center mb-2">{s.title}</h3>
              <p className="text-slate-300 text-sm text-center leading-relaxed mb-4">{s.desc}</p>
              <div className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 text-center">
                {s.tip}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <button
              onClick={() => setStep(p => Math.max(0, p - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700
                         text-slate-400 hover:text-white hover:bg-slate-700/60 disabled:opacity-30
                         disabled:cursor-not-allowed transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              ก่อนหน้า
            </button>

            {isLast ? (
              <button
                onClick={handleFinish}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500
                           hover:from-cyan-600 hover:to-blue-600 text-white font-semibold
                           text-sm transition-all shadow-lg"
              >
                เริ่มใช้งานเลย 🚀
              </button>
            ) : (
              <button
                onClick={() => setStep(p => Math.min(total - 1, p + 1))}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl
                           bg-gradient-to-r from-cyan-500/80 to-blue-500/80
                           hover:from-cyan-500 hover:to-blue-500 text-white font-semibold
                           text-sm transition-all"
              >
                ถัดไป
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={handleFinish}
              className="w-full mt-2 text-[11px] text-slate-500 hover:text-slate-300 transition-colors py-1"
            >
              ข้ามคำแนะนำ
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

/* ─────────────────────────────────────────────
   STATIC DATA  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const SOUNDS = [
  { id:"chime",     name:"Chime" },
  { id:"cash",      name:"Cash Register" },
  { id:"bell",      name:"Bell Ring" },
  { id:"fanfare",   name:"Fanfare" },
  { id:"bb_spirit", name:"BB Spirit" },
];
const ANIM_IN = [
  { id:"fadeIn",       name:"Fade In" },
  { id:"fadeInUp",     name:"Fade In Up" },
  { id:"fadeInDown",   name:"Fade In Down" },
  { id:"slideInLeft",  name:"Slide In Left" },
  { id:"slideInRight", name:"Slide In Right" },
  { id:"zoomIn",       name:"Zoom In" },
  { id:"bounceIn",     name:"Bounce In" },
];
const ANIM_OUT = [
  { id:"fadeOut",     name:"Fade Out" },
  { id:"fadeOutUp",   name:"Fade Out Up" },
  { id:"fadeOutDown", name:"Fade Out Down" },
  { id:"bounceOut",   name:"Bounce Out" },
  { id:"zoomOut",     name:"Zoom Out" },
];
const EFFECTS = [
  { id:"realistic_look", name:"Realistic Look" },
  { id:"glow",           name:"Glow Effect" },
  { id:"shadow",         name:"Shadow Effect" },
  { id:"neon",           name:"Neon Effect" },
  { id:"none",           name:"No Effect" },
];
const CONFETTI = [
  { id:"fountain", name:"Fountain" },
  { id:"rain",     name:"Rain" },
  { id:"spiral",   name:"Spiral" },
  { id:"blast",    name:"Blast" },
];
const TTS_VOICES = [
  { id:"female", name:"Female (ผู้หญิง)" },
  { id:"male",   name:"Male (ผู้ชาย)" },
];

/* ─────────────────────────────────────────────
   ZONE DEFINITIONS  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const ZONES = [
  {
    id:"image", side:"left", icon:Image, name:"รูปภาพ", posKey:"image",
    description:"รูปภาพ / GIF",
    disp:(ls) => (ls.image||ls.alertImage) ? "มีรูป" : "ไม่มี",
    fields:[
      { key:"image", label:"URL รูปภาพ", type:"image", placeholder:"https://..." },
    ],
  },
  {
    id:"textStyle", side:"left", icon:Type, name:"ข้อความหลัก", posKey:"donorName",
    description:"สี, ขนาด, ฟอนต์",
    disp:(ls) => `${readArr(ls.textSize,36)}px`,
    fields:[
      { key:"prefixText",     label:"ข้อความนำหน้า",  type:"text",   placeholder:"{{user}} โดเนทมา" },
      { key:"suffixText",     label:"ข้อความท้าย",     type:"text",   placeholder:"โดเนทมา" },
      { key:"font",           label:"แบบอักษร",         type:"font",   options:thaiGoogleFonts },
      { key:"fontWeight",     label:"น้ำหนักฟอนต์",    type:"select", options:fontWeights.map(w=>({id:w,name:w})) },
      { key:"textSize",       label:"ขนาดตัวอักษร",    type:"slider", min:12, max:72, isArr:true },
      { key:"textColor",      label:"สีข้อความหลัก",   type:"color" },
      { key:"donorNameColor", label:"สีชื่อผู้บริจาค", type:"color" },
      { key:"borderWidth",    label:"ขอบตัวอักษร",     type:"slider", min:0, max:10, step:0.5 },
      { key:"borderColor",    label:"สีขอบตัวอักษร",   type:"color" },
    ],
  },
  {
    id:"amount", side:"left", icon:Sparkles, name:"จำนวนเงิน", posKey:"amount",
    description:"สี + เอฟเฟกต์",
    disp:(ls) => ls.amountColor||"#0EA5E9",
    fields:[
      { key:"amountText",   label:"รูปแบบจำนวนเงิน",  type:"text", placeholder:"{{amount}}฿" },
      { key:"amountSuffix", label:"ส่วนท้ายจำนวน",     type:"text", placeholder:"฿" },
      { key:"amountColor",  label:"สีจำนวนเงิน",       type:"color" },
      { key:"amountShine",  label:"เอฟเฟกต์ shine",    type:"boolean" },
      { key:"effect",       label:"เอฟเฟกต์ข้อความ",  type:"select", options:EFFECTS },
    ],
  },
  {
    id:"message", side:"left", icon:MessageSquare, name:"ข้อความ", posKey:"message",
    description:"ข้อความใต้ยอด",
    disp:(ls) => { const t=ls.messageText||""; return t.length>12?t.slice(0,12)+"…":t||"—"; },
    fields:[
      { key:"messageText",        label:"ข้อความ",         type:"text",   placeholder:"ขอบคุณ..." },
      { key:"messageFont",        label:"ฟอนต์ข้อความ",   type:"font",   options:thaiGoogleFonts },
      { key:"messageFontWeight",  label:"น้ำหนักฟอนต์",   type:"select", options:fontWeights.map(w=>({id:w,name:w})) },
      { key:"messageFontSize",    label:"ขนาดข้อความ",    type:"slider", min:12, max:48, isArr:true },
      { key:"messageColor",       label:"สีข้อความ",       type:"color" },
      { key:"messageBorderWidth", label:"ขอบข้อความ",     type:"slider", min:0, max:10, step:0.5 },
      { key:"messageBorderColor", label:"สีขอบข้อความ",   type:"color" },
    ],
  },
  {
    id:"animation", side:"right", icon:Zap, name:"อนิเมชัน", posKey:"image",
    description:"animation เข้า-ออก",
    disp:(ls) => ls.inAnimation||"fadeInUp",
    fields:[
      { key:"inAnimation",     label:"animation เข้า",          type:"select", options:ANIM_IN },
      { key:"inDuration",      label:"ระยะเวลาเข้า (วินาที)",   type:"slider", min:0.3, max:3,  step:0.1 },
      { key:"displayDuration", label:"ระยะเวลาแสดง (วินาที)",  type:"slider", min:1,   max:10, step:0.5 },
      { key:"outAnimation",    label:"animation ออก",           type:"select", options:ANIM_OUT },
      { key:"outDuration",     label:"ระยะเวลาออก (วินาที)",    type:"slider", min:0.3, max:3,  step:0.1 },
    ],
  },
  {
    id:"sound", side:"right", icon:Volume2, name:"เสียง", posKey:"image",
    description:"เสียงแจ้งเตือน",
    disp:(ls) => SOUNDS.find(s=>s.id===ls.alertSound)?.name||"BB Spirit",
    fields:[
      { key:"alertSound",             label:"เสียงแจ้งเตือน",      type:"select",  options:SOUNDS },
      { key:"useCustomSound",         label:"ใช้เสียงที่อัปโหลด", type:"boolean" },
      { key:"volume",                 label:"ระดับเสียง",           type:"slider",  min:0, max:100, isArr:true },
      { key:"ttsVoice",               label:"เสียง TTS",            type:"select",  options:TTS_VOICES },
      { key:"ttsRate",                label:"ความเร็วพูด",          type:"slider",  min:0.1, max:2, step:0.1 },
      { key:"ttsPitch",               label:"ระดับเสียงสูงต่ำ",    type:"slider",  min:0.1, max:2, step:0.1 },
      { key:"ttsTitleEnabled",        label:"อ่านชื่อและจำนวน",    type:"boolean" },
      { key:"ttsMessageEnabledField", label:"อ่านข้อความ",          type:"boolean" },
      { key:"ttsVolume",              label:"ระดับเสียง TTS",      type:"slider",  min:0, max:100, isArr:true },
    ],
  },
  {
    id:"effects", side:"right", icon:Layers, name:"เอฟเฟกต์พิเศษ", posKey:"image",
    description:"confetti, glow",
    disp:(ls) => ls.showConfetti?"เปิด":"ปิด",
    fields:[
      { key:"imageGlow",         label:"Glow รูปภาพ",         type:"boolean" },
      { key:"showConfetti",      label:"แสดง Confetti",       type:"boolean" },
      { key:"confettiEffect",    label:"รูปแบบ Confetti",     type:"select",  options:CONFETTI },
      { key:"useRanges",         label:"ใช้ระบบช่วงเงิน",    type:"boolean" },
      { key:"minAmountForAlert", label:"จำนวนเงินขั้นต่ำ",   type:"slider",  min:1, max:1000, step:1 },
    ],
  },
  {
    id:"visibility", side:"right", icon:Eye, name:"การแสดงผล", posKey:"donorName",
    description:"แสดง/ซ่อน",
    disp:(ls) => {
      const p=[];
      if (ls.showName!==false)    p.push("ชื่อ");
      if (ls.showAmount!==false)  p.push("เงิน");
      if (ls.showMessage!==false) p.push("ข้อความ");
      return p.length ? p.join(", ") : "ปิดทั้งหมด";
    },
    fields:[
      { key:"showName",        label:"แสดงชื่อผู้บริจาค", type:"boolean" },
      { key:"showAmount",      label:"แสดงจำนวนเงิน",     type:"boolean" },
      { key:"showMessage",     label:"แสดงข้อความ",       type:"boolean" },
      { key:"backgroundColor", label:"สีพื้นหลัง",        type:"color" },
    ],
  },
];

const LEFT_ZONES  = ZONES.filter(z => z.side === "left");
const RIGHT_ZONES = ZONES.filter(z => z.side === "right");

/* ─────────────────────────────────────────────
   FIELD RENDERER  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const FieldRenderer = memo(function FieldRenderer({ field, value, onUpdate }) {
  switch (field.type) {

    case "font": {
      const opts   = field.options ?? [];
      const safeV  = (typeof value === "string" && value) ? value : optFamily(opts[0]);
      const matched = opts.find(o => optFamily(o) === safeV);
      const dispN  = matched?.name || safeV;
      return (
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">{field.label}</Label>
          <Select value={safeV} onValueChange={v => onUpdate(field.key, v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-9 text-sm"
              style={{ fontFamily: safeV }}>
              <span style={{ fontFamily: safeV }}>{dispN}</span>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-60 overflow-y-auto">
              {opts.map(opt => {
                const fam = optFamily(opt);
                return (
                  <SelectItem key={fam} value={fam} className="text-white hover:bg-slate-700 text-sm">
                    <span style={{ fontFamily: fam }}>{opt.name || fam}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {safeV && (
            <div className="text-slate-200 text-sm px-2 py-1.5 bg-slate-800/50 rounded border border-slate-700/50"
              style={{ fontFamily: safeV }}>
              ตัวอย่าง: สวัสดี ABC 123
            </div>
          )}
        </div>
      );
    }

    case "color":
      return (
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">{field.label}</Label>
          <div className="flex gap-2">
            <input type="color" value={value||"#FFFFFF"}
              onChange={e => onUpdate(field.key, e.target.value)}
              className="w-10 h-9 p-0.5 rounded cursor-pointer bg-transparent border border-slate-700" />
            <Input value={value||"#FFFFFF"}
              onChange={e => onUpdate(field.key, e.target.value)}
              className="flex-1 bg-slate-800/80 border-slate-700 text-white font-mono text-sm h-9" />
          </div>
        </div>
      );

    case "slider": {
      const num  = typeof value === "number" ? value : (field.min ?? 0);
      const pct  = field.key === "volume" || field.key === "ttsVolume";
      const step = field.step ?? 1;
      const dec  = step < 1 ? 1 : 0;
      return (
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label className="text-slate-300 text-xs">{field.label}</Label>
            <span className="text-cyan-400 text-xs font-mono">{num.toFixed(dec)}{pct?"%":""}</span>
          </div>
          <Slider value={[num]} onValueChange={v => onUpdate(field.key, v[0])}
            min={field.min??0} max={field.max??100} step={step} className="w-full" />
        </div>
      );
    }

    case "select": {
      const opts  = field.options ?? [];
      const safeV = value ?? opts[0]?.id ?? "";
      return (
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">{field.label}</Label>
          <Select value={safeV} onValueChange={v => onUpdate(field.key, v)}>
            <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {opts.map(o => (
                <SelectItem key={o.id} value={o.id} className="text-white hover:bg-slate-700 text-sm">
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    case "boolean":
      return (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
          <span className="text-white text-sm">{field.label}</span>
          <Switch checked={value??false} onCheckedChange={v => onUpdate(field.key, v)}
            className="data-[state=checked]:bg-cyan-500" />
        </div>
      );

    case "image":
      return (
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">{field.label}</Label>
          <Input value={value||""} placeholder={field.placeholder}
            onChange={e => onUpdate(field.key, e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white font-mono text-xs h-9" />
          {value && (
            <div className="p-2 rounded bg-slate-800/50 mt-1">
              <img src={value} alt="preview" className="max-h-24 mx-auto rounded object-contain"
                onError={e => { e.currentTarget.style.display="none"; }} />
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-xs">{field.label}</Label>
          <Input value={value||""} placeholder={field.placeholder}
            onChange={e => onUpdate(field.key, e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white h-9 text-sm" />
        </div>
      );
  }
});

/* ─────────────────────────────────────────────
   INLINE PANEL  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const InlinePanel = memo(function InlinePanel({
  zone, ls, onUpdate, onTestSound, testingSound,
}) {
  function resolve(field) {
    const raw = ls[field.key];
    if (field.type === "font") {
      return (typeof raw === "string" && raw) ? raw : optFamily(field.options?.[0]);
    }
    if (ARR_KEYS.has(field.key) || field.isArr) return readArr(raw, field.min??0);
    if (field.type === "boolean") return raw ?? false;
    return raw ?? "";
  }
  return (
    <motion.div
      initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
      exit={{ height:0, opacity:0 }} transition={{ duration:0.2, ease:"easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mx-1 mb-1 p-3 rounded-xl space-y-3 bg-slate-900/80 border border-cyan-500/20">
        {zone.fields.map(f => (
          <FieldRenderer key={f.key} field={f} value={resolve(f)} onUpdate={onUpdate} />
        ))}
        {zone.id === "sound" && (
          <button onClick={onTestSound} disabled={testingSound}
            className="w-full mt-1 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50
                       text-slate-300 text-xs flex items-center justify-center gap-1.5 transition-colors">
            <Volume2 className="w-3.5 h-3.5" />
            {testingSound ? "กำลังเล่น…" : "ทดสอบเสียง"}
          </button>
        )}
      </div>
    </motion.div>
  );
});

/* ─────────────────────────────────────────────
   BADGE BUTTON  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const BadgeButton = memo(function BadgeButton({
  zone, isSelected, dispVal, onToggle, badgeRef,
}) {
  const Icon   = zone.icon;
  const isCol  = isHex(dispVal);
  return (
    <motion.button ref={badgeRef}
      initial={{ opacity:0, x:zone.side==="left"?-12:12 }}
      animate={{ opacity:1, x:0 }}
      whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
      onClick={onToggle}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border
        transition-all duration-150 select-none text-left
        ${isSelected
          ? "bg-cyan-500/20 border-cyan-400/70 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
          : "bg-slate-800/70 border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-700/60"}`}
    >
      <div className={`p-1.5 rounded-lg shrink-0 ${isSelected?"bg-cyan-500/30":"bg-slate-700/80"}`}>
        <Icon className={`w-3.5 h-3.5 ${isSelected?"text-cyan-300":"text-slate-400"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-tight ${isSelected?"text-cyan-300":"text-slate-200"}`}>
          {zone.name}
        </p>
        <p className="text-[10px] text-slate-500 leading-tight truncate">{zone.description}</p>
      </div>
      <div className="shrink-0 flex items-center gap-1.5">
        {isCol && <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" style={{ background:dispVal }} />}
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md
          ${isSelected?"bg-cyan-500/30 text-cyan-200":"bg-slate-700 text-slate-400"}`}>
          {isCol ? dispVal.toUpperCase() : dispVal}
        </span>
      </div>
      <ChevronRight className={`w-3 h-3 shrink-0 transition-transform
        ${isSelected?"rotate-90 text-cyan-400":"text-slate-600"}`} />
    </motion.button>
  );
});

/* ─────────────────────────────────────────────
   CONNECTOR LINES  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const Connectors = memo(function Connectors({
  zones, badgeRects, elemRects, previewBox, selectedId,
}) {
  return (
    <svg style={{
      position:"fixed", inset:0, width:"100vw", height:"100vh",
      zIndex:44, pointerEvents:"none", overflow:"visible",
    }}>
      <defs>
        <marker id="cvDot" markerWidth="8" markerHeight="8" refX="4" refY="4">
          <circle cx="4" cy="4" r="3.2" fill="rgba(34,211,238,0.9)" />
        </marker>
        <filter id="cvGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {zones.map(zone => {
        const badge = badgeRects[zone.id];
        const elem  = elemRects[zone.posKey];
        if (!badge || !elem || !previewBox) return null;
        const isL = zone.side === "left";
        const isSel = selectedId === zone.id;
        const bx = isL ? badge.right : badge.left;
        const by = badge.top + badge.height / 2;
        const dx = elem.cx - bx, dy = elem.cy - by;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const stop = Math.max(0, dist - 18);
        const ex = bx + (dx/dist)*stop, ey = by + (dy/dist)*stop;
        const pe = isL ? previewBox.left : previewBox.right;
        const ew = isL
          ? Math.min(pe-6, bx+(pe-bx)*0.6)
          : Math.max(pe+6, bx+(pe-bx)*0.6);
        return (
          <g key={zone.id} filter={isSel?"url(#cvGlow)":undefined}>
            <path
              d={`M ${bx} ${by} H ${ew} L ${ex} ${ey}`}
              fill="none"
              stroke={isSel?"#22d3ee":"rgba(6,182,212,0.32)"}
              strokeWidth={isSel?2:1.3}
              strokeDasharray="5,3"
              markerEnd="url(#cvDot)"
            />
          </g>
        );
      })}
    </svg>
  );
});

/* ─────────────────────────────────────────────
   ANNOTATION COLUMN  (ไม่เปลี่ยน)
───────────────────────────────────────────── */
const AnnotationColumn = memo(function AnnotationColumn({
  zoneList, side, selectedId, ls,
  onToggle, onUpdate, onTestSound, testingSound, badgeRefs,
}) {
  return (
    <div className="flex flex-col gap-1.5 w-[280px] shrink-0 overflow-y-auto py-3 px-2"
      style={{ maxHeight:"100%" }}>
      <div className={`flex items-center gap-2 px-2 mb-1 ${side==="right"?"flex-row-reverse":""}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          {side==="left"?"ซ้าย":"ขวา"}
        </span>
      </div>
      {zoneList.map(zone => (
        <div key={zone.id}>
          <BadgeButton
            zone={zone}
            isSelected={selectedId === zone.id}
            dispVal={zone.disp(ls)}
            onToggle={() => onToggle(zone.id)}
            badgeRef={el => { badgeRefs.current[zone.id] = el; }}
          />
          <AnimatePresence>
            {selectedId === zone.id && (
              <InlinePanel
                key={`panel-${zone.id}`}
                zone={zone} ls={ls}
                onUpdate={onUpdate}
                onTestSound={onTestSound}
                testingSound={testingSound}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
});

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function FullscreenVisualEditor({
  settings, updateSetting, onClose, onSave,
}) {
  const [selectedId,   setSelectedId]   = useState(null);
  const [previewScale, setPreviewScale] = useState(0.75);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [animStep,     setAnimStep]     = useState("display");
  const [ls,           setLs]           = useState(() => ({ ...settings }));
  const [hasChanges,   setHasChanges]   = useState(false);
  const [testingSound, setTestingSound] = useState(false);
  const [elemRects,    setElemRects]    = useState({});
  const [previewBox,   setPreviewBox]   = useState(null);
  const [badgeRects,   setBadgeRects]   = useState({});

  // ★ Onboarding state — แสดงครั้งแรกเท่านั้น (localStorage)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem(ONBOARDING_KEY); } catch { return true; }
  });

  const wrapRef      = useRef(null);
  const previewRef   = useRef(null);
  const badgeRefs    = useRef({});
  const mountedRef   = useRef(true);
  const rafRef       = useRef(null);
  const resizeRef    = useRef(null);
  const soundRef     = useRef(null);

  // ── lifecycle  (ไม่เปลี่ยน) ──────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    injectFont(settings.font);
    injectFont(settings.messageFont);
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeRef.current);
      clearTimeout(soundRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settingsRef = useRef(settings);
  useEffect(() => {
    if (settingsRef.current !== settings) {
      settingsRef.current = settings;
      setLs({ ...settings });
    }
  }, [settings]);

  // ── rect measurement  (ไม่เปลี่ยน) ──────────────────────
  const measure = useCallback(() => {
    if (!mountedRef.current) return;
    if (wrapRef.current) setPreviewBox(wrapRef.current.getBoundingClientRect());
    if (previewRef.current?.getElementPositions) {
      const pos = previewRef.current.getElementPositions();
      if (pos) {
        const r = {};
        ZONES.forEach(z => {
          const rect = pos[z.posKey];
          if (rect) r[z.posKey] = { cx: rect.left+rect.width/2, cy: rect.top+rect.height/2, ...rect };
        });
        setElemRects(r);
      }
    }
    const br = {};
    Object.entries(badgeRefs.current).forEach(([id, el]) => { if (el) br[id] = el.getBoundingClientRect(); });
    setBadgeRects(br);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);
  }, [previewScale, selectedId, measure]);

  const lsMeasureRef = useRef(null);
  useEffect(() => {
    clearTimeout(lsMeasureRef.current);
    lsMeasureRef.current = setTimeout(measure, 100);
    return () => clearTimeout(lsMeasureRef.current);
  }, [ls, measure]);

  useEffect(() => {
    const h = () => {
      clearTimeout(resizeRef.current);
      resizeRef.current = setTimeout(measure, 80);
    };
    window.addEventListener("resize", h);
    window.addEventListener("scroll", h, true);
    return () => {
      window.removeEventListener("resize", h);
      window.removeEventListener("scroll", h, true);
    };
  }, [measure]);

  // ── update handler  (ไม่เปลี่ยน) ─────────────────────────
  const handleUpdate = useCallback((key, value) => {
    let final = value;
    if (key === "font" || key === "messageFont") {
      injectFont(value);
      final = value;
    } else if (ARR_KEYS.has(key) && typeof value === "number") {
      final = [value];
    }

    setLs(prev => {
      if (prev[key] === final) return prev;
      if (Array.isArray(final) && Array.isArray(prev[key]) && final[0] === prev[key][0]) return prev;
      return { ...prev, [key]: final };
    });
    updateSetting(key, final);
    setHasChanges(true);
  }, [updateSetting]);

  const handleSave = useCallback(async () => {
    await onSave();
    onClose();
  }, [onSave, onClose]);

  const handleTestSound = useCallback(() => {
    const vol = readArr(ls.volume, 75);
    playAlertSound(ls.alertSound || "chime", vol);
    setTestingSound(true);
    soundRef.current = setTimeout(() => {
      if (mountedRef.current) setTestingSound(false);
    }, 1100);
  }, [ls.alertSound, ls.volume]);

  const handleToggle = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  // ── render ───────────────────────────────────────────────
  return (
    <>
      {/* ★ Onboarding Modal — แสดงครั้งแรกเท่านั้น */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onClose={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="fixed inset-0 z-50 bg-slate-950 flex flex-col">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900/95 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Visual Editor</h2>
              <p className="text-[10px] text-slate-400">คลิก badge เพื่อแก้ไข</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20">
                ⚡ ยังไม่ได้บันทึก
              </span>
            )}

            {/* ★ Help button — เปิด Onboarding ซ้ำได้ */}
            <button
              onClick={() => setShowOnboarding(true)}
              title="คำแนะนำการใช้งาน"
              className="p-1.5 rounded-lg hover:bg-slate-800 border border-slate-700/60
                         text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <Button onClick={() => setIsPlaying(v => !v)} variant="outline" size="sm"
              className="border-slate-700 text-slate-300 text-xs h-8">
              {isPlaying ? "⏸ หยุด" : "▶ เล่น"}
            </Button>
            <Button onClick={handleSave} size="sm"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-8 text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" />บันทึกและปิด
            </Button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left */}
          <div className="bg-slate-900/40 border-r border-slate-800/60 overflow-hidden">
            <AnnotationColumn zoneList={LEFT_ZONES} side="left"
              selectedId={selectedId} ls={ls}
              onToggle={handleToggle} onUpdate={handleUpdate}
              onTestSound={handleTestSound} testingSound={testingSound}
              badgeRefs={badgeRefs} />
          </div>

          {/* Center */}
          <div className="flex-1 relative flex flex-col">
            {/* Zoom */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              <button
                onClick={() => setPreviewScale(p => Math.max(0.3, parseFloat((p-0.1).toFixed(2))))}
                className="p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-white">
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-white text-xs font-mono">
                {Math.round(previewScale*100)}%
              </span>
              <button
                onClick={() => setPreviewScale(p => Math.min(1.5, parseFloat((p+0.1).toFixed(2))))}
                className="p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-8">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage:"radial-gradient(circle,#64748b 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
              <div ref={wrapRef}
                style={{ transform:`scale(${previewScale})`, transformOrigin:"center center" }}
                className="relative z-10">
                <AlertPreview
                  ref={previewRef}
                  settings={ls}
                  isPlaying={isPlaying}
                  onPlayStateChange={setIsPlaying}
                  onAnimationStepChange={setAnimStep}
                  externalAnimationStep={animStep}
                />
              </div>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm rounded-full border border-slate-700/60 text-[10px] text-slate-500">
                เส้นชี้จาก badge → element จริง
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-slate-900/40 border-l border-slate-800/60 overflow-hidden">
            <AnnotationColumn zoneList={RIGHT_ZONES} side="right"
              selectedId={selectedId} ls={ls}
              onToggle={handleToggle} onUpdate={handleUpdate}
              onTestSound={handleTestSound} testingSound={testingSound}
              badgeRefs={badgeRefs} />
          </div>
        </div>

        <Connectors zones={ZONES} badgeRects={badgeRects} elemRects={elemRects}
          previewBox={previewBox} selectedId={selectedId} />
      </motion.div>
    </>
  );
}