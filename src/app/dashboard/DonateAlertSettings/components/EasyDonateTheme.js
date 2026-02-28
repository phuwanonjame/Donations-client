import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

// =================================================================
// ConfettiLayer Component 
// =================================================================
const ConfettiLayer = ({ settings }) => {
    const emojis = ["🎃", "👻", "🦇", "🕷️", "💀", "🕸️", "🍬", "🍭"];
    const count = 50;
    const effectType = settings.confettiEffect || "fountain";

    const getConfettiVariants = (i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 300;
        
        switch (effectType) {
            case "rain":
                return {
                    initial: { x: (Math.random() - 0.5) * 500, y: -50, opacity: 0, scale: 0 },
                    animate: {
                        x: (Math.random() - 0.5) * 200,
                        y: 500 + Math.random() * 200,
                        opacity: [1, 1, 0],
                        scale: [1, 1.2, 0],
                        rotate: Math.random() * 720 - 360,
                        transition: { duration: 3 + Math.random() * 2, ease: "easeInOut", delay: Math.random() * 0.5 },
                    },
                };
            case "spiral":
                const radius = 300 + Math.random() * 100;
                const startAngle = Math.random() * Math.PI * 2;
                return {
                    initial: { x: 0, y: -50, opacity: 0, scale: 0 },
                    animate: {
                        x: [0, radius * Math.cos(startAngle + 2 * Math.PI), radius * Math.cos(startAngle + 4 * Math.PI)],
                        y: [0, 400, 800 + Math.random() * 100],
                        opacity: [1, 1, 0],
                        scale: [1, 1.2, 0],
                        rotate: Math.random() * 720 + 360,
                        transition: { duration: 4 + Math.random() * 1.5, ease: "easeInOut", delay: Math.random() * 0.3 },
                    },
                };
            case "blast":
                return {
                    initial: { x: 0, y: 0, opacity: 0, scale: 0 },
                    animate: {
                        x: [0, distance * Math.cos(angle)],
                        y: [0, distance * Math.sin(angle) + Math.random() * 200],
                        opacity: [1, 1, 0],
                        scale: [1, 1.2, 0],
                        rotate: Math.random() * 720 - 360,
                        transition: { duration: 1.8 + Math.random() * 1, ease: "easeInOut", delay: Math.random() * 0.2 },
                    },
                };
            default: // fountain
                const horizontalRange = (Math.random() - 0.5) * 400;
                const initialUp = -(200 + Math.random() * 150);
                const finalDown = 500 + Math.random() * 200;
                return {
                    initial: { x: 0, y: 0, opacity: 0, scale: 0 },
                    animate: {
                        x: [0, horizontalRange * 0.5, horizontalRange],
                        y: [0, initialUp, finalDown],
                        opacity: [1, 1, 0],
                        scale: [1, 1.2, 0],
                        rotate: Math.random() * 720 - 360,
                        transition: { duration: 2.5 + Math.random() * 1.5, ease: "easeInOut", delay: Math.random() * 0.1 },
                    },
                };
        }
    };

    const getInitialPosition = () => {
        switch (effectType) {
            case "rain":
            case "spiral":
                return { top: "0%", left: "50%", transform: "translateX(-50%)" };
            default:
                return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
        }
    };

    const initialStyle = getInitialPosition();

    return (
        <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl"
                    variants={getConfettiVariants(i)}
                    initial="initial"
                    animate="animate"
                    style={{ ...initialStyle, color: settings.amountColor || "#FF6B00" }}
                >
                    {emojis[i % emojis.length]}
                </motion.div>
            ))}
        </motion.div>
    );
};
// =================================================================

const EasyDonateTheme = ({
  settings,
  displayName,
  amountText, 
  mainVariants,
  animationStep, 
  imageUrl, 
  getFontFamilyCss, 
  getFontWeight,
}) => {
  // 1. คำนวณ Font
  const mainFontFamily = getFontFamilyCss(settings.font);
  const messageFontFamily = getFontFamilyCss(settings.messageFont || settings.font);
  const messageFontWeight = getFontWeight(settings.messageFontWeight || settings.fontWeight);
  
  // 2. ข้อมูลข้อความและรูปภาพ
  const defaultMessage = "ขอบคุณสำหรับการใช้งาน FastDonate";
  const displayMessage = settings.messageText ? settings.messageText.replace('{{user}}', displayName) : defaultMessage;
  
  // ใช้ imageUrl ที่ส่งมาเป็น Prop ก่อน
  const alertImage = imageUrl || settings.image || "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif"; 
  
  // 3. คำนวณ Style & Shadow Utilities
  const strokeColor = settings.borderColor || settings.titleStrokeColor || "#000";
  const strokeWidth = settings.borderWidth || settings.titleStrokeWidth || 2; 
  const messageStrokeColor = settings.messageBorderColor || settings.messageStrokeColor || "#000";
  const messageStrokeWidth = settings.messageBorderWidth || settings.messageStrokeWidth || 2;

  // 4. กำหนดสีและขนาดตัวอักษร
  const nameColor = settings.donorNameColor || settings.textColor || "#FF9500";
  const amountColor = settings.amountColor || "#0EA5E9";
  const suffixText = settings.suffixText || "โดเนทมา";
  
  // 5. จัดการ Font Weight
  const mainFontWeight = getFontWeight(settings.fontWeight || "700");
  const nameFontWeight = getFontWeight(settings.fontWeight || "700");

  // แก้ไขการจัดการ textSize ให้ใช้งานได้
  const getTextSize = () => {
    if (!settings.textSize) return 32;
    if (Array.isArray(settings.textSize)) {
      return settings.textSize[0] || 32;
    }
    if (typeof settings.textSize === 'string') {
      return parseInt(settings.textSize) || 32;
    }
    return settings.textSize || 32;
  };

  const getMessageFontSize = () => {
    if (!settings.messageFontSize) return 24;
    if (Array.isArray(settings.messageFontSize)) {
      return settings.messageFontSize[0] || 24;
    }
    if (typeof settings.messageFontSize === 'string') {
      return parseInt(settings.messageFontSize) || 24;
    }
    return settings.messageFontSize || 24;
  };

  const getAmountText = () => {
    if (!amountText) return "500";
    // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
    const numbers = amountText.replace(/[^0-9]/g, '');
    return numbers || "500";
  };

  const currentTextSize = getTextSize();
  const currentMessageFontSize = getMessageFontSize();
  const cleanAmount = getAmountText();

  const getTextStroke = (color, width) => {
    if (!width || width === 0) return "none";
    const w = parseFloat(width);
    return `
      ${-w}px ${-w}px 0 ${color},
      ${w}px ${-w}px 0 ${color},
      ${-w}px ${w}px 0 ${color},
      ${w}px ${w}px 0 ${color}
    `.trim().replace(/\s+/g, ' ');
  };
  
  const getAmountShadow = (color, isShine) => {
    const shineColor = color || "#0EA5E9";
    const stroke = getTextStroke(strokeColor, strokeWidth); 
    const type = settings.effect || "realistic_look";

    switch (type) {
      case "glow":
      case "neon":
        return `${stroke}, 0 0 10px ${shineColor}, 0 0 20px ${shineColor}80, 0 0 30px ${shineColor}40`;
      case "shadow":
        return `${stroke}, 3px 3px 6px rgba(0,0,0,0.5)`;
      case "realistic_look":
        if (isShine) {
          return `${stroke}, 0 0 10px ${shineColor}, 0 0 20px ${shineColor}80, 0 0 30px ${shineColor}40, 0 0 40px ${shineColor}20`;
        }
        return stroke;
      default:
        return stroke;
    }
  };

  const getImageShadow = () => {
    if (settings.imageGlow || ["glow", "neon"].includes(settings.effect)) {
      const c = settings.amountColor || "#0EA5E9";
      return `0 0 10px ${c}, 0 0 15px ${c}80`;
    }
    if (settings.effect === "shadow") return "0 5px 15px rgba(0,0,0,0.5)";
    return settings.imageShadow ? "0 0 10px rgba(255,107,0,0.3)" : "none";
  };

  // Animation classes based on animationStep
  const imageAnimationClass = animationStep === "in" ? "animate__animated animate__fadeInUp" : 
                              animationStep === "out" ? "animate__animated animate__fadeOutUp" : "";
  const textContainerAnimationClass = animationStep === "in" ? "animate__animated animate__fadeInUp" : 
                                      animationStep === "out" ? "animate__animated animate__fadeOutUp" : "";

  return (
    <motion.div
      className="relative w-full flex flex-col items-center justify-center"
      style={{ 
        fontFamily: mainFontFamily,
        minHeight: "500px",
        width: "100%"
      }} 
      variants={mainVariants}
      initial="initial"
      animate={animationStep === "in" || animationStep === "display" ? "animate" : animationStep} 
      exit="exit"
    >
      {/* Confetti Layer */}
      {settings.showConfetti && (animationStep === "in" || animationStep === "display") && <ConfettiLayer settings={settings} />} 

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {/* Image with animation */}
        <motion.img 
          className={`h-[200px] w-auto rounded-2xl ${imageAnimationClass}`}
          src={alertImage}
          alt="img"
          style={{ 
            animationDuration: "1000ms",
            filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`,
            boxShadow: getImageShadow()
          }}
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Text Container with animation */}
        <motion.div 
          className={`flex flex-col items-center ${textContainerAnimationClass}`}
          style={{ animationDuration: "1000ms" }}
        >
          {/* Name and Amount Row */}
          <div className="mb-2 flex items-end justify-center gap-3">
            <h1 
              style={{ 
                fontFamily: mainFontFamily, 
                fontWeight: mainFontWeight, // ใช้ค่าจาก settings
                fontSize: `${currentTextSize}px`,
                lineHeight: `${currentTextSize * 1.2}px`, 
                color: '#FFFFFF',
                filter: `url(#stroke-filter) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`
              }}
            >
              <span></span>
              {settings.showName && (
                <span style={{ 
                  color: nameColor,
                  fontWeight: nameFontWeight // ใช้ค่าเดียวกับ main
                }}>
                  {displayName}
                </span>
              )}
              <span> {suffixText}</span>
            </h1>
            
            {settings.showAmount && (
              <h1 
                className="w-fit shine-effect top-1"
                style={{ 
                  fontFamily: mainFontFamily, 
                  fontWeight: mainFontWeight, // ใช้ค่าจาก settings
                  fontSize: `${currentTextSize * 1.33}px`,
                  lineHeight: `${currentTextSize * 1.33}px`, 
                  color: amountColor,
                  filter: `url(#stroke-filter) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`,
                  textShadow: getAmountShadow(amountColor, settings.amountShine)
                }}
              >
                <span></span>
                <span>{cleanAmount}</span>
                <span>฿</span>
              </h1>
            )}
          </div>

          {/* Message */}
          {settings.showMessage && displayMessage && (
            <p 
              className="w-[400px]"
              style={{ 
                fontFamily: messageFontFamily, 
                fontWeight: messageFontWeight,
                color: settings.messageColor || settings.textColor || '#FFFFFF', 
                fontSize: `${currentMessageFontSize}px`,
                lineHeight: `${currentMessageFontSize * 1.4}px`,
                filter: `url(#message-stroke-filter) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`
              }}
            >
              {displayMessage}
            </p>
          )}
        </motion.div>
      </div>

      {/* SVG filters for stroke effects */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="stroke-filter">
            <feMorphology operator="dilate" radius={strokeWidth} in="SourceAlpha" result="thicken" />
            <feFlood floodColor={strokeColor} floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="thicken" operator="in" result="stroke" />
            <feMerge>
              <feMergeNode in="stroke" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="message-stroke-filter">
            <feMorphology operator="dilate" radius={messageStrokeWidth} in="SourceAlpha" result="thicken" />
            <feFlood floodColor={messageStrokeColor} floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="thicken" operator="in" result="stroke" />
            <feMerge>
              <feMergeNode in="stroke" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Canvas for confetti */}
      <canvas id="preview-confetti-canvas" className="pointer-events-none absolute inset-0 z-10 h-full w-full"></canvas>
    </motion.div>
  );
};

export default EasyDonateTheme;