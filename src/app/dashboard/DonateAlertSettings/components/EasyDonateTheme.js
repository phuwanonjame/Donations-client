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
  const alertImage = imageUrl || settings.image || ""; 
  
  // 3. คำนวณ Style & Shadow Utilities
  const strokeColor = settings.borderColor || settings.titleStrokeColor || "#000";
  const strokeWidth = settings.borderWidth || settings.titleStrokeWidth || 2; 
  const messageStrokeColor = settings.messageBorderColor || settings.messageStrokeColor || "#000";
  const messageStrokeWidth = settings.messageBorderWidth || settings.messageStrokeWidth || 2;

  const getTextStroke = (color, width) => {
    if (!width || width === 0) return "none";
    const w = parseFloat(width);
    // ใช้ text-shadow 4 ทิศทาง
    return `
      ${-w}px ${-w}px 0 ${color},
      ${w}px ${-w}px 0 ${color},
      ${-w}px ${w}px 0 ${color},
      ${w}px ${w}px 0 ${color}
    `.trim().replace(/\s+/g, ' ');
  };
  
  const getAmountShadow = (color, isShine) => {
    const shineColor = color || "#FF6B00";
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
      const c = settings.amountColor || "#FF6B00";
      return `0 0 10px ${c}, 0 0 15px ${c}80`;
    }
    if (settings.effect === "shadow") return "0 5px 15px rgba(0,0,0,0.5)";
    return settings.imageShadow ? "0 0 10px rgba(255,107,0,0.3)" : "none";
  };
  
  const currentTextSize = Array.isArray(settings.textSize) ? settings.textSize[0] : settings.textSize || 32;
  const currentMessageFontSize = settings.messageFontSize || (currentTextSize * 0.75);

  return (
    <motion.div
      className="relative w-full flex flex-col items-center"
      style={{ fontFamily: mainFontFamily }} 
      variants={mainVariants}
      initial="initial"
      animate={animationStep === "in" || animationStep === "display" ? "animate" : animationStep} 
      exit="exit"
    >
      {/* ✅ แก้ไข: ใช้ settings แทน effectiveSettings */}
      {settings.showConfetti && (animationStep === "in" || animationStep === "display") && <ConfettiLayer settings={settings} />} 

      {/* Background Motion Effects (Decorative) */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(138,43,226,0.2) 50%, transparent 100%)",
        }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Bats */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -20, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          🦇
        </motion.div>
      ))}

      <div className="w-full flex flex-col items-center relative  z-20">
        {/* Pumpkin Top */}
        <motion.div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-5xl"
          animate={{ 
            rotate: [-5, 5, -5],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎃
        </motion.div>

        {/* Image Display Block */}
        <div className="flex justify-center mb-[-10px]">
          {/* ส่วนแสดงผลรูปภาพ: alertImage ต้องมีค่าเป็น URL ที่ถูกต้อง */}
          {alertImage ? (
            <motion.img
              src={alertImage}
              alt="Alert"
              className=" w-36 h-36 rounded-lg object-cover z-10" 
              style={{ boxShadow: getImageShadow() }}
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ) : (
            // Fallback เมื่อไม่มีรูปภาพ
            <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-orange-600 to-purple-900 rounded-lg"> 
              <ImageIcon className="w-8 h-8 text-orange-200" />
            </div>
          )}
        </div>

        {/* Text Container Box */}
        <div
          className="relative z-0 p-5 pt-8 rounded-2xl flex flex-col items-center"
          style={{
            background: settings.backgroundColor || "linear-gradient(135deg, rgba(25,0,51,0.85) 0%, rgba(51,17,0,0.85) 100%)",
            minWidth: "350px",
            maxWidth: "100%",
            paddingBottom: settings.showMessage && displayMessage ? "20px" : "5px",
            backdropFilter: "blur(10px)", 
            border: "none", 
            boxShadow: "0 5px 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(138,43,226,0.1)",
          }}
        >
          {/* Decorative Emojis and Effects */}
          <div className="absolute top-0 left-0 text-3xl opacity-50">🕸️</div>
          <div className="absolute top-0 right-0 text-3xl opacity-50 transform scale-x-[-1]">🕸️</div>
          <motion.div className="absolute top-1/2 left-2 text-2xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>👻</motion.div>
          <motion.div className="absolute top-1/2 right-2 text-2xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>👻</motion.div>
          
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "rgba(255,107,0,0.1)" }}
            animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
          />

          {/* Main Text Content */}
          <div className="text-center w-full relative z-10">
            {settings.showName && (
              <span
                style={{
                  color: settings.donorNameColor || settings.textColor,
                  fontSize: `${currentTextSize}px`, 
                  fontWeight: getFontWeight(settings.fontWeight || "700"), 
                  textShadow: getTextStroke(strokeColor, strokeWidth),
                }}
              >
                {displayName}
              </span>
            )}
            {settings.showName && settings.suffixText && (
              <span
                className="ml-2"
                style={{
                  color: settings.textColor,
                  fontSize: `${currentTextSize}px`, 
                  fontWeight: getFontWeight(settings.fontWeight || "700"),
                  textShadow: getTextStroke(strokeColor, strokeWidth),
                }}
              >
                {settings.suffixText}
              </span>
            )}
            {settings.showAmount && (
              <span
                className="ml-2"
                style={{
                  color: settings.amountColor || "#FF6B00",
                  fontSize: `${currentTextSize}px`, 
                  fontWeight: getFontWeight(settings.fontWeight || "700"), 
                  textShadow: getAmountShadow(settings.amountColor, settings.amountShine),
                }}
              >
                {amountText} 
              </span>
            )}
          </div>

          {settings.showMessage && displayMessage && (
            <div
              className="mt-1 text-center w-full relative z-10"
              style={{
                fontFamily: messageFontFamily,
                fontWeight: messageFontWeight,
                color: settings.messageColor || settings.textColor || "#FFF",
                fontSize: `${currentMessageFontSize}px`, 
                lineHeight: 1.4,
                textShadow: getTextStroke(messageStrokeColor, messageStrokeWidth),
              }}
            >
              {displayMessage}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EasyDonateTheme;