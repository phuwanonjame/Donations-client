// ============================================
// ไฟล์: ./components/EasyDonateTheme.js
// ============================================
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";

// =================================================================
// ConfettiLayer Component 
// =================================================================
const ConfettiLayer = ({ settings }) => {
    const emojis = ["🎃", "👻", "🦇", "🕷️", "💀", "🕸️", "🍬", "🍭"];
    const count = 50;
    
    const getEffectType = () => {
        if (settings.metadata) {
            return settings.metadata.effect || "fountain";
        }
        return settings.confettiEffect || settings.effect || "fountain";
    };
    
    const getAmountColor = () => {
        if (settings.metadata) {
            return settings.metadata.title?.amountColor || "#FF6B00";
        }
        return settings.amountColor || "#FF6B00";
    };
    
    const effectType = getEffectType();

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
            default:
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
                    style={{ ...initialStyle, color: getAmountColor() }}
                >
                    {emojis[i % emojis.length]}
                </motion.div>
            ))}
        </motion.div>
    );
};
// =================================================================

const extractSetting = (settings, flatPath, groupedPath, defaultValue) => {
    if (!settings) return defaultValue;
    
    if (settings.metadata) {
        const paths = groupedPath.split('.');
        let value = settings.metadata;
        for (const p of paths) {
            if (value && typeof value === 'object' && p in value) {
                value = value[p];
            } else {
                return defaultValue;
            }
        }
        return value !== undefined && value !== null ? value : defaultValue;
    }
    
    return settings[flatPath] !== undefined && settings[flatPath] !== null 
        ? settings[flatPath] 
        : defaultValue;
};

const EasyDonateTheme = forwardRef(({
  settings,
  displayName,
  amountText, 
  mainVariants,
  animationStep, 
  imageUrl, 
  getFontFamilyCss, 
  getFontWeight,
}, ref) => {
  // Refs สำหรับแต่ละ element
  const donorNameRef = useRef(null);
  const amountRef = useRef(null);
  const suffixTextRef = useRef(null);
  const messageRef = useRef(null);
  const messageColorRef = useRef(null);
  const fontSizeRef = useRef(null);
  const fontRef = useRef(null);
  const imageRef = useRef(null);
  const showNameRef = useRef(null);
  const showAmountRef = useRef(null);
  const showMessageRef = useRef(null);
  const soundRef = useRef(null);
  const animationRef = useRef(null);
  const borderRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getElementPositions: () => ({
      donorName: donorNameRef.current?.getBoundingClientRect(),
      amount: amountRef.current?.getBoundingClientRect(),
      suffixText: suffixTextRef.current?.getBoundingClientRect(),
      message: messageRef.current?.getBoundingClientRect(),
      messageColor: messageColorRef.current?.getBoundingClientRect(),
      fontSize: fontSizeRef.current?.getBoundingClientRect(),
      font: fontRef.current?.getBoundingClientRect(),
      image: imageRef.current?.getBoundingClientRect(),
      showName: showNameRef.current?.getBoundingClientRect(),
      showAmount: showAmountRef.current?.getBoundingClientRect(),
      showMessage: showMessageRef.current?.getBoundingClientRect(),
      sound: soundRef.current?.getBoundingClientRect(),
      animation: animationRef.current?.getBoundingClientRect(),
      border: borderRef.current?.getBoundingClientRect(),
    })
  }));

  const getSetting = (flatPath, groupedPath, defaultValue) => {
    return extractSetting(settings, flatPath, groupedPath, defaultValue);
  };

  // Title settings
  const font = getSetting('font', 'title.fontFamily', 'ibmplex');
  const fontWeight = getSetting('fontWeight', 'title.fontWeight', '700');
  const textSize = getSetting('textSize', 'title.fontSize', 36);
  const textColor = getSetting('textColor', 'title.mainColor', '#FFFFFF');
  const donorNameColor = getSetting('donorNameColor', 'title.usernameColor', '#FF9500');
  const amountColor = getSetting('amountColor', 'title.amountColor', '#0EA5E9');
  const borderWidth = getSetting('borderWidth', 'title.strokeWidth', 2.5);
  const borderColor = getSetting('borderColor', 'title.strokeColor', '#000000');
  const amountShine = getSetting('amountShine', 'title.amountShine', true);
  const suffixText = getSetting('suffixText', 'title.suffixText', 'โดเนทมา');
  
  const showName = getSetting('showName', 'title.showName', true);
  const showAmount = getSetting('showAmount', 'title.showAmount', true);
  
  // Message settings
  const messageFont = getSetting('messageFont', 'message.fontFamily', 'ibmplex');
  const messageFontWeight = getSetting('messageFontWeight', 'message.fontWeight', '500');
  const messageFontSize = getSetting('messageFontSize', 'message.fontSize', 24);
  const messageColor = getSetting('messageColor', 'message.color', '#FFFFFF');
  const messageBorderWidth = getSetting('messageBorderWidth', 'message.strokeWidth', 2.5);
  const messageBorderColor = getSetting('messageBorderColor', 'message.strokeColor', '#000000');
  const showMessage = getSetting('showMessage', 'message.showMessage', true);
  const messageText = getSetting('messageText', 'message.text', 'ขอบคุณสำหรับการใช้งาน FastDonate');
  
  // Effect settings
  const effect = getSetting('effect', 'effect', 'realistic_look');
  const imageGlow = getSetting('imageGlow', 'imageGlow', false);
  const showConfetti = getSetting('showConfetti', 'showConfetti', false);
  
  // Image
  const alertImage = imageUrl || getSetting('alertImage', 'image', "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif");

  // Font
  const mainFontFamily = getFontFamilyCss(font);
  const messageFontFamily = getFontFamilyCss(messageFont || font);
  const messageFontWeightValue = getFontWeight(messageFontWeight);
  
  const defaultMessage = "ขอบคุณสำหรับการใช้งาน FastDonate";
  const displayMessage = messageText ? messageText.replace('{{user}}', displayName) : defaultMessage;
  
  const strokeColor = borderColor;
  const strokeWidthValue = parseFloat(borderWidth);
  const messageStrokeColor = messageBorderColor;
  const messageStrokeWidthValue = parseFloat(messageBorderWidth);

  const mainFontWeightValue = getFontWeight(fontWeight);
  const nameFontWeightValue = getFontWeight(fontWeight);

  const getTextSize = () => {
    if (!textSize) return 32;
    if (Array.isArray(textSize)) return textSize[0] || 32;
    if (typeof textSize === 'string') return parseInt(textSize) || 32;
    return textSize || 32;
  };

  const getMessageFontSize = () => {
    if (!messageFontSize) return 24;
    if (Array.isArray(messageFontSize)) return messageFontSize[0] || 24;
    if (typeof messageFontSize === 'string') return parseInt(messageFontSize) || 24;
    return messageFontSize || 24;
  };

  const getAmountTextValue = () => {
    if (!amountText) return "500";
    const numbers = amountText.replace(/[^0-9]/g, '');
    return numbers || "500";
  };

  const currentTextSize = getTextSize();
  const currentMessageFontSize = getMessageFontSize();
  const cleanAmount = getAmountTextValue();

  const getTextStroke = (color, width) => {
    if (!width || width === 0) return "none";
    const w = parseFloat(width);
    return `${-w}px ${-w}px 0 ${color}, ${w}px ${-w}px 0 ${color}, ${-w}px ${w}px 0 ${color}, ${w}px ${w}px 0 ${color}`.trim().replace(/\s+/g, ' ');
  };
  
  const getAmountShadow = (color, isShine) => {
    const shineColor = color || "#0EA5E9";
    const stroke = getTextStroke(strokeColor, strokeWidthValue);
    switch (effect) {
      case "glow":
      case "neon":
        return `${stroke}, 0 0 10px ${shineColor}, 0 0 20px ${shineColor}80, 0 0 30px ${shineColor}40`;
      case "shadow":
        return `${stroke}, 3px 3px 6px rgba(0,0,0,0.5)`;
      case "realistic_look":
        if (isShine) return `${stroke}, 0 0 10px ${shineColor}, 0 0 20px ${shineColor}80, 0 0 30px ${shineColor}40, 0 0 40px ${shineColor}20`;
        return stroke;
      default:
        return stroke;
    }
  };

  const getImageShadow = () => {
    if (imageGlow || ["glow", "neon"].includes(effect)) {
      const c = amountColor || "#0EA5E9";
      return `0 0 10px ${c}, 0 0 15px ${c}80`;
    }
    if (effect === "shadow") return "0 5px 15px rgba(0,0,0,0.5)";
    return "none";
  };

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
      {showConfetti && (animationStep === "in" || animationStep === "display") && <ConfettiLayer settings={settings} />} 

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <motion.img 
          ref={imageRef}
          className={`h-[200px] w-auto rounded-2xl ${imageAnimationClass}`}
          src={alertImage}
          alt="img"
          style={{ 
            animationDuration: "1000ms",
            filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`,
            boxShadow: getImageShadow()
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.div 
          className={`flex flex-col items-center ${textContainerAnimationClass}`}
          style={{ animationDuration: "1000ms" }}
        >
          <div className="mb-2 flex items-end justify-center gap-3">
            <h1 
              ref={donorNameRef}
              style={{ 
                fontFamily: mainFontFamily, 
                fontWeight: mainFontWeightValue,
                fontSize: `${currentTextSize}px`,
                lineHeight: `${currentTextSize * 1.2}px`, 
                color: textColor,
                filter: `url(#stroke-filter) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`
              }}
            >
              <span></span>
              {showName && (
                <span style={{ 
                  color: donorNameColor,
                  fontWeight: nameFontWeightValue
                }}>
                  {displayName}
                </span>
              )}
              <span ref={suffixTextRef}> {suffixText}</span>
            </h1>
            
            {showAmount && (
              <h1 
                ref={amountRef}
                className="w-fit shine-effect top-1"
                style={{ 
                  fontFamily: mainFontFamily, 
                  fontWeight: mainFontWeightValue,
                  fontSize: `${currentTextSize * 1.33}px`,
                  lineHeight: `${currentTextSize * 1.33}px`, 
                  color: amountColor,
                  filter: `url(#stroke-filter) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))`,
                  textShadow: getAmountShadow(amountColor, amountShine)
                }}
              >
                <span></span>
                <span>{cleanAmount}</span>
                <span>฿</span>
              </h1>
            )}
          </div>

          {showMessage && displayMessage && (
            <p 
              ref={messageRef}
              className="w-[400px]"
              style={{ 
                fontFamily: messageFontFamily, 
                fontWeight: messageFontWeightValue,
                color: messageColor, 
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

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="stroke-filter">
            <feMorphology operator="dilate" radius={strokeWidthValue} in="SourceAlpha" result="thicken" />
            <feFlood floodColor={strokeColor} floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="thicken" operator="in" result="stroke" />
            <feMerge>
              <feMergeNode in="stroke" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="message-stroke-filter">
            <feMorphology operator="dilate" radius={messageStrokeWidthValue} in="SourceAlpha" result="thicken" />
            <feFlood floodColor={messageStrokeColor} floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="thicken" operator="in" result="stroke" />
            <feMerge>
              <feMergeNode in="stroke" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <canvas id="preview-confetti-canvas" className="pointer-events-none absolute inset-0 z-10 h-full w-full"></canvas>
    </motion.div>
  );
});

EasyDonateTheme.displayName = 'EasyDonateTheme';
export default EasyDonateTheme;