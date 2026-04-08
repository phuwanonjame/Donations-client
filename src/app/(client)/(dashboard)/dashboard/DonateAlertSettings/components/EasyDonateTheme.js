// ============================================
// EasyDonateTheme.js — STABLE
// ============================================
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";

// ── helpers ─────────────────────────────────────────────
function resolveNum(raw, fallback) {
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return parseInt(raw, 10) || fallback;
  return fallback;
}

// ★ Font resolution:
// settings.font = family string เช่น "Kanit", "IBM Plex Sans Thai"
// getFontFamilyCss ใช้สำหรับกรณี metadata ที่ส่ง id มา เช่น "default"
// ถ้า font ขึ้นต้น uppercase หรือมี space = family string → ใช้ตรงๆ
function resolveFont(fontValue, getFontFamilyCssFn) {
  if (!fontValue) return "IBM Plex Sans Thai";
  // Family string: ขึ้นต้น uppercase หรือมี space
  if (/^[A-Z]/.test(fontValue) || fontValue.includes(" ")) return fontValue;
  // id string: ส่งให้ getFontFamilyCss แปลง
  if (getFontFamilyCssFn) return getFontFamilyCssFn(fontValue) || fontValue;
  return fontValue;
}

function buildTextStroke(color, width) {
  const w = parseFloat(width);
  if (!w) return "none";
  return `${-w}px ${-w}px 0 ${color},${w}px ${-w}px 0 ${color},${-w}px ${w}px 0 ${color},${w}px ${w}px 0 ${color}`;
}

// ── ConfettiLayer ────────────────────────────────────────
const ConfettiLayer = ({ settings }) => {
  const emojis     = ["🎃","👻","🦇","🕷️","💀","🕸️","🍬","🍭"];
  const effectType = settings.confettiEffect || settings.effect || "fountain";
  const color      = settings.amountColor || "#FF6B00";
  const count      = 50;

  const variants = (i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 300 + Math.random() * 300;
    switch (effectType) {
      case "rain":
        return {
          initial: { x: (Math.random()-0.5)*500, y: -50, opacity: 0, scale: 0 },
          animate: { x: (Math.random()-0.5)*200, y: 500+Math.random()*200, opacity:[1,1,0], scale:[1,1.2,0], rotate:Math.random()*720-360,
            transition: { duration:3+Math.random()*2, ease:"easeInOut", delay:Math.random()*0.5 } },
        };
      case "spiral": {
        const r = 300+Math.random()*100, a = Math.random()*Math.PI*2;
        return {
          initial: { x:0, y:-50, opacity:0, scale:0 },
          animate: { x:[0, r*Math.cos(a+2*Math.PI), r*Math.cos(a+4*Math.PI)], y:[0,400,800+Math.random()*100],
            opacity:[1,1,0], scale:[1,1.2,0], rotate:Math.random()*720+360,
            transition: { duration:4+Math.random()*1.5, ease:"easeInOut", delay:Math.random()*0.3 } },
        };
      }
      case "blast":
        return {
          initial: { x:0, y:0, opacity:0, scale:0 },
          animate: { x:[0, dist*Math.cos(angle)], y:[0, dist*Math.sin(angle)+Math.random()*200],
            opacity:[1,1,0], scale:[1,1.2,0], rotate:Math.random()*720-360,
            transition: { duration:1.8+Math.random()*1, ease:"easeInOut", delay:Math.random()*0.2 } },
        };
      default: {
        const hx = (Math.random()-0.5)*400;
        return {
          initial: { x:0, y:0, opacity:0, scale:0 },
          animate: { x:[0,hx*0.5,hx], y:[0,-(200+Math.random()*150), 500+Math.random()*200],
            opacity:[1,1,0], scale:[1,1.2,0], rotate:Math.random()*720-360,
            transition: { duration:2.5+Math.random()*1.5, ease:"easeInOut", delay:Math.random()*0.1 } },
        };
      }
    }
  };

  const pos = (effectType === "rain" || effectType === "spiral")
    ? { top:"0%", left:"50%", transform:"translateX(-50%)" }
    : { top:"50%", left:"50%", transform:"translate(-50%,-50%)" };

  return (
    <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_,i) => (
        <motion.div key={i} className="absolute text-2xl"
          variants={variants(i)} initial="initial" animate="animate"
          style={{ ...pos, color }}
        >{emojis[i % emojis.length]}</motion.div>
      ))}
    </motion.div>
  );
};

// ── EasyDonateTheme ──────────────────────────────────────
const EasyDonateTheme = forwardRef(({
  settings, displayName, amountText,
  mainVariants, animationStep, imageUrl,
  getFontFamilyCss, getFontWeight,
}, ref) => {
  const donorNameRef = useRef(null);
  const amountRef    = useRef(null);
  const messageRef   = useRef(null);
  const imageRef     = useRef(null);

  useImperativeHandle(ref, () => ({
    getElementPositions: () => ({
      donorName: donorNameRef.current?.getBoundingClientRect(),
      amount:    amountRef.current?.getBoundingClientRect(),
      message:   messageRef.current?.getBoundingClientRect(),
      image:     imageRef.current?.getBoundingClientRect(),
    }),
  }));

  // ── read settings (settings มาจาก buildSettings แล้ว — ค่า flat) ──
  const fontRaw        = settings.font        ?? "IBM Plex Sans Thai";
  const msgFontRaw     = settings.messageFont ?? fontRaw;
  const fontWeight     = settings.fontWeight  ?? "700";
  const textSize       = resolveNum(settings.textSize, 36);
  const textColor      = settings.textColor      ?? "#FFFFFF";
  const donorColor     = settings.donorNameColor ?? "#FF9500";
  const amountColor    = settings.amountColor    ?? "#0EA5E9";
  const borderW        = parseFloat(settings.borderWidth ?? 2.5);
  const borderC        = settings.borderColor    ?? "#000000";
  const amountShine    = settings.amountShine    ?? true;
  const suffixText     = settings.suffixText     ?? "โดเนทมา";
  const showName       = settings.showName       ?? true;
  const showAmount     = settings.showAmount     ?? true;

  const msgFontWeight  = settings.messageFontWeight  ?? "500";
  const msgFontSize    = resolveNum(settings.messageFontSize, 24);
  const msgColor       = settings.messageColor       ?? "#FFFFFF";
  const msgBorderW     = parseFloat(settings.messageBorderWidth ?? 2.5);
  const msgBorderC     = settings.messageBorderColor ?? "#000000";
  const showMessage    = settings.showMessage        ?? true;
  const messageText    = settings.messageText        ?? "ขอบคุณสำหรับการใช้งาน FastDonate";

  const effect         = settings.effect       ?? "realistic_look";
  const imageGlow      = settings.imageGlow    ?? false;
  const showConfetti   = settings.showConfetti ?? false;
  const alertImage     = imageUrl ?? settings.image
    ?? "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif";

  // ★ resolve font — family string ผ่านตรง, id ผ่าน getFontFamilyCss
  const mainFont = resolveFont(fontRaw, getFontFamilyCss);
  const msgFont  = resolveFont(msgFontRaw, getFontFamilyCss);

  const mainFW   = getFontWeight ? getFontWeight(fontWeight)    : fontWeight;
  const msgFW    = getFontWeight ? getFontWeight(msgFontWeight) : msgFontWeight;

  const displayMsg = (messageText || "").replace("{{user}}", displayName);

  const cleanAmount = (() => {
    if (!amountText) return "500";
    const n = amountText.replace(/[^0-9]/g, "");
    return n || "500";
  })();

  const amountShadow = (() => {
    const stroke = buildTextStroke(borderC, borderW);
    switch (effect) {
      case "glow":
      case "neon":
        return `${stroke}, 0 0 10px ${amountColor}, 0 0 20px ${amountColor}80, 0 0 30px ${amountColor}40`;
      case "shadow":
        return `${stroke}, 3px 3px 6px rgba(0,0,0,0.5)`;
      case "realistic_look":
        return amountShine
          ? `${stroke}, 0 0 10px ${amountColor}, 0 0 20px ${amountColor}80, 0 0 30px ${amountColor}40`
          : stroke;
      default: return stroke;
    }
  })();

  const imgShadow = (imageGlow || ["glow","neon"].includes(effect))
    ? `0 0 10px ${amountColor}, 0 0 15px ${amountColor}80`
    : effect === "shadow" ? "0 5px 15px rgba(0,0,0,0.5)" : "none";

  return (
    <motion.div
      className="relative w-full flex flex-col items-center justify-center"
      style={{ fontFamily: mainFont, minHeight: "500px", width: "100%" }}
      variants={mainVariants}
      initial="initial"
      animate={animationStep === "in" || animationStep === "display" ? "animate" : animationStep}
      exit="exit"
    >
      {showConfetti && (animationStep === "in" || animationStep === "display") && (
        <ConfettiLayer settings={settings} />
      )}

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <motion.img
          ref={imageRef}
          className="h-[200px] w-auto rounded-2xl"
          src={alertImage}
          alt="alert"
          style={{ filter:"drop-shadow(0 4px 6px rgba(0,0,0,0.6))", boxShadow: imgShadow }}
          animate={{ scale:[1,1.05,1] }}
          transition={{ duration:2, repeat:Infinity }}
        />

        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-end justify-center gap-3 flex-wrap">
            <h1
              ref={donorNameRef}
              style={{
                fontFamily: mainFont, fontWeight: mainFW,
                fontSize: `${textSize}px`, lineHeight: `${textSize*1.2}px`,
                color: textColor,
                filter: "url(#stroke-filter) drop-shadow(0 4px 6px rgba(0,0,0,0.6))",
              }}
            >
              {showName && (
                <span style={{ color: donorColor, fontWeight: mainFW, fontFamily: mainFont }}>
                  {displayName}
                </span>
              )}
              <span style={{ fontFamily: mainFont }}> {suffixText}</span>
            </h1>

            {showAmount && (
              <h1
                ref={amountRef}
                className="w-fit"
                style={{
                  fontFamily: mainFont, fontWeight: mainFW,
                  fontSize: `${textSize*1.33}px`, lineHeight: `${textSize*1.33}px`,
                  color: amountColor,
                  filter: "url(#stroke-filter) drop-shadow(0 4px 6px rgba(0,0,0,0.6))",
                  textShadow: amountShadow,
                }}
              >
                <span>{cleanAmount}</span><span>฿</span>
              </h1>
            )}
          </div>

          {showMessage && displayMsg && (
            <p
              ref={messageRef}
              className="w-[400px] text-center"
              style={{
                fontFamily: msgFont, fontWeight: msgFW,
                color: msgColor,
                fontSize: `${msgFontSize}px`, lineHeight: `${msgFontSize*1.4}px`,
                filter: "url(#message-stroke-filter) drop-shadow(0 4px 6px rgba(0,0,0,0.6))",
              }}
            >
              {displayMsg}
            </p>
          )}
        </div>
      </div>

      <svg style={{ position:"absolute", width:0, height:0 }}>
        <defs>
          <filter id="stroke-filter">
            <feMorphology operator="dilate" radius={borderW} in="SourceAlpha" result="t"/>
            <feFlood floodColor={borderC} floodOpacity="1" result="f"/>
            <feComposite in="f" in2="t" operator="in" result="s"/>
            <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="message-stroke-filter">
            <feMorphology operator="dilate" radius={msgBorderW} in="SourceAlpha" result="t"/>
            <feFlood floodColor={msgBorderC} floodOpacity="1" result="f"/>
            <feComposite in="f" in2="t" operator="in" result="s"/>
            <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>

      <canvas id="preview-confetti-canvas"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
    </motion.div>
  );
});

EasyDonateTheme.displayName = "EasyDonateTheme";
export default EasyDonateTheme;