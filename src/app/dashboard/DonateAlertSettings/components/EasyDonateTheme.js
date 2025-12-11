import React from "react";
import { Image } from "lucide-react";
import { motion } from "framer-motion";

// =======================================================
// Confetti Effect Variants
// =======================================================

// Effect 1: Fountain / Explosion
const getFountainVariants = (i) => {
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
      transition: {
        duration: 2.5 + Math.random() * 1.5,
        ease: "easeOut",
        delay: Math.random() * 0.1,
      },
    },
  };
};

// Effect 2: Rain
const getRainVariants = (i) => ({
  initial: {
    x: (Math.random() - 0.5) * 500,
    y: -50,
    opacity: 0,
    scale: 0,
  },
  animate: {
    x: (Math.random() - 0.5) * 200,
    y: 500 + Math.random() * 200,
    opacity: [1, 1, 0],
    scale: [1, 1.2, 0],
    rotate: Math.random() * 720 - 360,
    transition: {
      duration: 3 + Math.random() * 2,
      ease: "easeOut",
      delay: Math.random() * 0.5,
    },
  },
});

// Effect 3: Spiral
const getSpiralVariants = (i) => {
  const radius = 300 + Math.random() * 100;
  const startAngle = Math.random() * Math.PI * 2;

  return {
    initial: { x: 0, y: -50, opacity: 0, scale: 0 },
    animate: {
      x: [
        0,
        radius * Math.cos(startAngle + 2 * Math.PI),
        radius * Math.cos(startAngle + 4 * Math.PI),
      ],
      y: [0, 400, 800 + Math.random() * 100],
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0],
      rotate: Math.random() * 720 + 360,
      transition: {
        duration: 4 + Math.random() * 1.5,
        ease: "easeOut",
        delay: Math.random() * 0.3,
      },
    },
  };
};

// Effect 4: Blast
const getBlastVariants = () => {
  const angle = Math.random() * Math.PI * 2;
  const distance = 300 + Math.random() * 300;

  return {
    initial: { x: 0, y: 0, opacity: 0, scale: 0 },
    animate: {
      x: [0, distance * Math.cos(angle)],
      y: [0, distance * Math.sin(angle) + Math.random() * 200],
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0],
      rotate: Math.random() * 720 - 360,
      transition: {
        duration: 1.8 + Math.random() * 1,
        ease: "easeOut",
        delay: Math.random() * 0.2,
      },
    },
  };
};

// =======================================================
// Confetti Layer
// =======================================================
const ConfettiLayer = ({ settings }) => {
  const emojis = ["🎉", "🎈", "✨", "🎊", "💖", "🎁", "🥳", "🌟"];
  const count = 50;
  const effectType = settings.confettiEffect || "fountain";

  const getConfettiVariants = (i) => {
    switch (effectType) {
      case "rain":
        return getRainVariants(i);
      case "spiral":
        return getSpiralVariants(i);
      case "blast":
        return getBlastVariants(i);
      default:
        return getFountainVariants(i);
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
          style={{ ...initialStyle, color: settings.amountColor || "#0EA5E9" }}
        >
          {emojis[i % emojis.length]}
        </motion.div>
      ))}
    </motion.div>
  );
};

// =======================================================
// EasyDonateTheme
// =======================================================
const EasyDonateTheme = ({
  settings,
  displayName,
  getAmountText,
  fontFamilies,
  getFontWeight,
  mainVariants,
}) => {
  const mainFontFamily = fontFamilies[settings.font] || fontFamilies["default"];
  const messageFontFamily =
    fontFamilies[settings.messageFont] || mainFontFamily;

  const messageFontWeight = getFontWeight(
    settings.messageFontWeight || settings.fontWeight
  );

  const defaultMessage =
    "เพื่อนกั้มไม่ยอมอาบน้ำ";

  const displayMessage = settings.messageText || defaultMessage;

  const alertImage =
    settings.image ||
    "https://media.tenor.com/7_KRHOBcSnEAAAAM/happy-birthday-ashleigh.gif";

  const strokeColor =
    settings.borderColor || settings.titleStrokeColor || "#000";
  const strokeWidth =
    settings.borderWidth || settings.titleStrokeWidth || 2.5;

  const messageStrokeColor =
    settings.messageBorderColor ||
    settings.messageStrokeColor ||
    "#000";
  const messageStrokeWidth =
    settings.messageBorderWidth ||
    settings.messageStrokeWidth ||
    2.5;

  const getTextStroke = (color, width) => {
    if (!width || width === 0) return "none";
    const w = parseFloat(width);
    return `
      -${w}px -${w}px 0 ${color},
      ${w}px -${w}px 0 ${color},
      -${w}px ${w}px 0 ${color},
      ${w}px ${w}px 0 ${color}
    `;
  };

  const getAmountShadow = (color, isShine) => {
    const shineColor = color || "#0EA5E9";
    const stroke = getTextStroke(strokeColor, strokeWidth);
    const type = settings.effect || "realistic_look";

    switch (type) {
      case "glow":
      case "neon":
        return `
          ${stroke},
          0 0 10px ${shineColor},
          0 0 20px ${shineColor}80,
          0 0 30px ${shineColor}40
        `;
      case "shadow":
        return `${stroke}, 5px 5px 10px rgba(0,0,0,0.7)`;
      case "realistic_look":
        if (isShine) {
          return `
            ${stroke},
            0 0 10px ${shineColor},
            0 0 20px ${shineColor}80,
            0 0 30px ${shineColor}40,
            0 0 40px ${shineColor}20
          `;
        }
        return stroke;
      default:
        return stroke;
    }
  };

  const getImageShadow = () => {
    if (settings.imageGlow || ["glow", "neon"].includes(settings.effect)) {
      const c = settings.amountColor || "#FFF";
      return `0 0 15px ${c}, 0 0 25px ${c}80`;
    }
    if (settings.effect === "shadow")
      return "0 10px 20px rgba(0,0,0,0.6)";
    return settings.imageShadow
      ? "0 0 15px rgba(255,255,255,0.5)"
      : "none";
  };

  return (
    <motion.div
      className="relative w-full flex flex-col items-center"
      style={{ fontFamily: mainFontFamily }}
      variants={mainVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {settings.showConfetti && <ConfettiLayer settings={settings} />}

      <div className="w-full flex flex-col items-center">
        <div className="flex justify-center mb-[-10px]">
          {alertImage ? (
            <img
              src={alertImage}
              alt="Alert"
              className="w-24 h-24 rounded-xl object-cover"
              style={{ boxShadow: getImageShadow() }}
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded-xl">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div
          className="relative z-10 p-5 pt-8 rounded-xl flex flex-col items-center"
          style={{
            background: settings.backgroundColor || "rgba(0,0,0,0.5)",
            minWidth: "350px",
            maxWidth: "100%",
            paddingBottom: settings.showMessage ? "20px" : "5px",
          }}
        >
          {/* NAME + SUFFIX + AMOUNT */}
          <div className="text-center w-full">
            {settings.showName && (
              <span
                style={{
                  color: settings.donorNameColor || settings.textColor,
                  fontSize: `${settings.textSize[0]}px`,
                  fontWeight: getFontWeight(
                    settings.titleFontWeight || "700"
                  ),
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
                  fontSize: `${settings.textSize[0]}px`,
                  fontWeight: getFontWeight(
                    settings.titleFontWeight || "700"
                  ),
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
                  color: settings.amountColor || "#0EA5E9",
                  fontSize: `${settings.textSize[0]}px`,
                  fontWeight: getFontWeight(
                    settings.titleFontWeight || "700"
                  ),
                  textShadow: getAmountShadow(
                    settings.amountColor,
                    settings.amountShine
                  ),
                }}
              >
                {getAmountText()}
              </span>
            )}
          </div>

          {/* MESSAGE */}
          {settings.showMessage && displayMessage && (
            <div
              className="mt-1 text-center w-full"
              style={{
                fontFamily: messageFontFamily,
                fontWeight: messageFontWeight,
                color:
                  settings.messageColor ||
                  settings.textColor ||
                  "#FFF",
                fontSize: `${settings.messageFontSize}px`,
                lineHeight: 1.4,
                textShadow: getTextStroke(
                  messageStrokeColor,
                  messageStrokeWidth
                ),
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
