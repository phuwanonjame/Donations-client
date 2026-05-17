// ============================================
// EasyDonateTheme.js — STABLE
// ============================================
import React, { forwardRef, useRef, useImperativeHandle, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { confettiPresets } from "./utils/settingsUtils";

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

function seededUnit(index, salt = 0) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function seededRange(index, salt, min, max) {
  return min + seededUnit(index, salt) * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return null;
  const normalized = hex.replace("#", "").trim();
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;

  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(255,255,255,${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function getRuntimePerformanceProfile() {
  if (typeof window === "undefined") {
    return {
      isWindows: false,
      reduceMotion: false,
      dpr: 1,
      physicsCount: 64,
      classicCount: 56,
      shadowBlurMax: 12,
      obstacleSampleRate: 3,
    };
  }

  const isWindows = /Windows/i.test(window.navigator?.userAgent || "");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const dprLimit = reduceMotion ? 1 : isWindows ? 1.25 : 1.75;

  return {
    isWindows,
    reduceMotion,
    dpr: Math.min(window.devicePixelRatio || 1, dprLimit),
    physicsCount: reduceMotion ? 0 : isWindows ? 36 : 64,
    classicCount: reduceMotion ? 0 : isWindows ? 30 : 56,
    shadowBlurMax: isWindows ? 6 : 12,
    obstacleSampleRate: isWindows ? 6 : 3,
  };
}

// ── ConfettiLayer ────────────────────────────────────────
const PhysicsConfettiLayer = ({ settings, collisionRefs = [] }) => {
  const canvasRef = useRef(null);
  const effectType = settings.confettiEffect || settings.effect || "fountain";
  const preset     = confettiPresets[effectType] || confettiPresets.fountain;
  const color      = settings.amountColor || "#FF6B00";

  useEffect(() => {
    const perf = getRuntimePerformanceProfile();
    if (perf.reduceMotion) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let cachedObstacle = null;
    const dpr = perf.dpr;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cachedObstacle = null;
    };

    const readObstacle = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const rects = collisionRefs
        .map((ref) => ref.current?.getBoundingClientRect())
        .filter((rect) => rect && rect.width > 0 && rect.height > 0);

      if (!rects.length) return null;

      const left = Math.min(...rects.map((rect) => rect.left)) - canvasRect.left - 16;
      const right = Math.max(...rects.map((rect) => rect.right)) - canvasRect.left + 16;
      const top = Math.min(...rects.map((rect) => rect.top)) - canvasRect.top - 16;
      const bottom = Math.max(...rects.map((rect) => rect.bottom)) - canvasRect.top + 16;
      return { left, right, top, bottom };
    };

    const makeParticle = (i) => {
      const size = seededRange(i, 25, preset.size[0], preset.size[1]);
      const centerX = width / 2;
      const centerY = height / 2;
      const angle = seededRange(i, 1, 0, Math.PI * 2);
      const speed = seededRange(i, 2, 160, 540);
      const side = seededUnit(i, 81) > 0.5 ? 1 : -1;
      const particle = {
        emoji: preset.emojis[i % preset.emojis.length],
        x: centerX,
        y: centerY,
        px: centerX,
        py: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        radius: size * 0.42,
        angle: seededRange(i, 3, -Math.PI, Math.PI),
        spin: seededRange(i, 4, -5.8, 5.8),
        life: 0,
        ttl: seededRange(i, 5, 3.2, 6.5),
        delay: seededRange(i, 6, 0, 0.55),
        gravity: 620,
        drag: 0.992,
        bounce: seededRange(i, 7, 0.48, 0.72),
      };

      switch (effectType) {
        case "rain":
        case "money_rain":
        case "starfall":
        case "snow":
          particle.x = seededRange(i, 9, -40, width + 40);
          particle.y = seededRange(i, 10, -180, -20);
          particle.vx = seededRange(i, 11, -90, 90);
          particle.vy = seededRange(i, 12, 90, 260);
          particle.gravity = effectType === "snow" ? 130 : 520;
          particle.drag = effectType === "snow" ? 0.998 : 0.994;
          particle.ttl = seededRange(i, 13, effectType === "snow" ? 5.2 : 3.6, effectType === "snow" ? 8 : 6.2);
          break;
        case "spiral": {
          const radius = seededRange(i, 14, 120, Math.min(width, height) * 0.38);
          particle.x = centerX + Math.cos(angle) * radius;
          particle.y = -30;
          particle.vx = -Math.sin(angle) * seededRange(i, 15, 180, 360);
          particle.vy = seededRange(i, 16, 170, 340);
          particle.gravity = 360;
          break;
        }
        case "blast":
        case "fireworks":
        case "shockwave":
          particle.x = centerX + seededRange(i, 17, -80, 80);
          particle.y = centerY + seededRange(i, 18, -90, 70);
          particle.vx = Math.cos(angle) * seededRange(i, 19, effectType === "shockwave" ? 420 : 220, effectType === "shockwave" ? 760 : 680);
          particle.vy = Math.sin(angle) * seededRange(i, 20, 180, 600) - seededRange(i, 21, 60, 180);
          particle.gravity = effectType === "shockwave" ? 420 : 560;
          particle.delay = effectType === "fireworks" ? Math.floor(i / 14) * 0.16 + seededRange(i, 22, 0, 0.08) : seededRange(i, 23, 0, 0.18);
          particle.ttl = seededRange(i, 24, 2.2, 4.5);
          break;
        case "heart_burst":
          particle.x = centerX;
          particle.y = centerY + 40;
          particle.vx = Math.cos(seededRange(i, 26, -Math.PI * 0.95, -Math.PI * 0.05)) * seededRange(i, 27, 180, 460);
          particle.vy = -seededRange(i, 28, 260, 620);
          particle.gravity = 500;
          break;
        case "portal": {
          const radius = seededRange(i, 29, Math.min(width, height) * 0.18, Math.min(width, height) * 0.42);
          particle.x = centerX + Math.cos(angle) * radius;
          particle.y = centerY + Math.sin(angle) * radius * 0.65;
          particle.vx = -Math.sin(angle) * seededRange(i, 30, 260, 520) - Math.cos(angle) * seededRange(i, 31, 70, 160);
          particle.vy = Math.cos(angle) * seededRange(i, 32, 160, 340) - Math.sin(angle) * seededRange(i, 33, 50, 120);
          particle.gravity = 120;
          particle.drag = 0.985;
          break;
        }
        case "bubbles":
          particle.x = seededRange(i, 34, width * 0.18, width * 0.82);
          particle.y = height + seededRange(i, 35, 20, 120);
          particle.vx = seededRange(i, 36, -80, 80);
          particle.vy = -seededRange(i, 37, 180, 380);
          particle.gravity = -170;
          particle.drag = 0.996;
          particle.bounce = 0.38;
          particle.ttl = seededRange(i, 38, 4, 7.2);
          break;
        case "meteors":
        case "comet":
          particle.x = effectType === "comet"
            ? centerX + side * seededRange(i, 39, width * 0.35, width * 0.55)
            : seededRange(i, 40, -80, width * 0.8);
          particle.y = seededRange(i, 41, -170, -40);
          particle.vx = -side * seededRange(i, 42, 180, 520);
          particle.vy = seededRange(i, 43, 360, 680);
          particle.gravity = 350;
          particle.ttl = seededRange(i, 44, 1.9, 3.7);
          break;
        default:
          particle.x = centerX + seededRange(i, 45, -70, 70);
          particle.y = centerY + seededRange(i, 46, 10, 80);
          particle.vx = seededRange(i, 47, -280, 280);
          particle.vy = -seededRange(i, 48, 360, 780);
          particle.gravity = 620;
          break;
      }

      particle.px = particle.x;
      particle.py = particle.y;
      return particle;
    };

    const collideRect = (particle, obstacle) => {
      if (!obstacle) return;
      const left = obstacle.left - particle.radius;
      const right = obstacle.right + particle.radius;
      const top = obstacle.top - particle.radius;
      const bottom = obstacle.bottom + particle.radius;
      if (particle.x < left || particle.x > right || particle.y < top || particle.y > bottom) return;

      const moveX = particle.x - particle.px;
      const moveY = particle.y - particle.py;
      const fromLeft = Math.abs(particle.x - left);
      const fromRight = Math.abs(right - particle.x);
      const fromTop = Math.abs(particle.y - top);
      const fromBottom = Math.abs(bottom - particle.y);
      const minPenetration = Math.min(fromLeft, fromRight, fromTop, fromBottom);

      if (minPenetration === fromLeft || (particle.px <= left && moveX > 0)) {
        particle.x = left;
        particle.vx = -Math.abs(particle.vx) * particle.bounce;
      } else if (minPenetration === fromRight || (particle.px >= right && moveX < 0)) {
        particle.x = right;
        particle.vx = Math.abs(particle.vx) * particle.bounce;
      } else if (minPenetration === fromTop || (particle.py <= top && moveY > 0)) {
        particle.y = top;
        particle.vy = -Math.abs(particle.vy) * particle.bounce;
        particle.vx *= 0.86;
      } else {
        particle.y = bottom;
        particle.vy = Math.abs(particle.vy) * particle.bounce;
      }
      particle.spin += particle.vx * 0.008;
    };

    resize();
    const particleCount = Math.min(preset.count, perf.physicsCount);
    const particles = Array.from({ length: particleCount }, (_, i) => makeParticle(i));

    const tick = (time) => {
      const dt = clamp((time - lastTime) / 1000, 0.001, 0.033);
      lastTime = time;
      frameCount += 1;
      if (!cachedObstacle || frameCount % perf.obstacleSampleRate === 1) {
        cachedObstacle = readObstacle();
      }
      const obstacle = cachedObstacle;

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      particles.forEach((particle, i) => {
        particle.life += dt;
        if (particle.life < particle.delay) return;

        if (particle.life > particle.ttl) {
          const fresh = makeParticle(i);
          Object.assign(particle, fresh, { life: 0 });
          return;
        }

        particle.px = particle.x;
        particle.py = particle.y;
        particle.vx *= particle.drag;
        particle.vy = (particle.vy + particle.gravity * dt) * particle.drag;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.angle += particle.spin * dt;

        collideRect(particle, obstacle);

        if (particle.x < particle.radius) {
          particle.x = particle.radius;
          particle.vx = Math.abs(particle.vx) * particle.bounce;
        } else if (particle.x > width - particle.radius) {
          particle.x = width - particle.radius;
          particle.vx = -Math.abs(particle.vx) * particle.bounce;
        }

        if (particle.y > height - particle.radius) {
          particle.y = height - particle.radius;
          particle.vy = -Math.abs(particle.vy) * particle.bounce;
          particle.vx *= 0.84;
          particle.spin *= 0.82;
        } else if (particle.y < -particle.radius * 3 && particle.vy < 0 && particle.gravity < 0) {
          particle.vy *= -0.35;
        }

        const fadeIn = clamp((particle.life - particle.delay) / 0.25, 0, 1);
        const fadeOut = clamp((particle.ttl - particle.life) / 0.7, 0, 1);
        const alpha = fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.font = `${particle.size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.shadowColor = `${color}99`;
        ctx.shadowBlur = Math.min(seededRange(i, 49, 3, 12), perf.shadowBlurMax);
        ctx.fillText(particle.emoji, 0, 0);
        ctx.restore();
      });

      rafId = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [effectType, preset, color, collisionRefs]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 h-full w-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
};

function getClassicOrigin(origin) {
  switch (origin) {
    case "top":
      return { top:"0%", left:"50%", transform:"translateX(-50%)" };
    case "bottom":
      return { bottom:"0%", left:"50%", transform:"translateX(-50%)" };
    default:
      return { top:"50%", left:"50%", transform:"translate(-50%,-50%)" };
  }
}

const ClassicConfettiLayer = ({ settings }) => {
  const effectType = settings.confettiEffect || settings.effect || "fountain";
  const preset     = confettiPresets[effectType] || confettiPresets.fountain;
  const color      = settings.amountColor || "#FF6B00";
  const perf = useMemo(() => getRuntimePerformanceProfile(), []);
  const particleCount = Math.min(preset.count, perf.classicCount);

  const variants = (i) => {
    const angle = seededRange(i, 1, 0, Math.PI * 2);
    const rotate = seededRange(i, 2, -720, 720);
    const delay = seededRange(i, 3, 0, 0.45);
    const endScale = seededRange(i, 4, 0.05, 0.35);

    switch (effectType) {
      case "rain":
      case "money_rain":
      case "snow":
      case "starfall": {
        const startX = seededRange(i, 5, -460, 460);
        const drift = seededRange(i, 6, -180, 180);
        const duration = effectType === "snow" ? seededRange(i, 7, 4.2, 6.8) : seededRange(i, 7, 2.8, 4.8);
        return {
          initial: { x: startX, y: -90, opacity: 0, scale: 0.35, rotate: 0 },
          animate: {
            x: [startX, startX + drift, startX + drift * 0.35],
            y: [-90, 260, 680],
            opacity: effectType === "starfall" ? [0, 1, 0.35, 1, 0] : [0, 1, 1, 0],
            scale: [0.35, 1.15, 0.9, endScale],
            rotate,
            transition: { duration, ease: "easeInOut", delay },
          },
        };
      }
      case "spiral": {
        const radius = seededRange(i, 8, 120, 340);
        const startAngle = seededRange(i, 9, 0, Math.PI * 2);
        const spin = seededRange(i, 10, Math.PI * 2.5, Math.PI * 4.5);
        return {
          initial: { x: 0, y: -40, opacity: 0, scale: 0.2, rotate: 0 },
          animate: {
            x: [
              radius * Math.cos(startAngle),
              radius * Math.cos(startAngle + spin * 0.45),
              radius * Math.cos(startAngle + spin),
            ],
            y: [-40, 260, 680],
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.15, 0.8, endScale],
            rotate: rotate + 720,
            transition: { duration: seededRange(i, 11, 3.4, 5.4), ease: "easeInOut", delay },
          },
        };
      }
      case "blast":
      case "fireworks":
      case "shockwave": {
        const dist = seededRange(i, 12, effectType === "shockwave" ? 320 : 180, effectType === "shockwave" ? 660 : 520);
        const burstDelay = effectType === "fireworks" ? Math.floor(i / 14) * 0.18 + seededRange(i, 13, 0, 0.08) : seededRange(i, 13, 0, 0.16);
        return {
          initial: { x: 0, y: 0, opacity: 0, scale: 0.12, rotate: 0 },
          animate: {
            x: [0, dist * 0.3 * Math.cos(angle), dist * Math.cos(angle)],
            y: [0, dist * 0.24 * Math.sin(angle) - 40, dist * 0.72 * Math.sin(angle) + seededRange(i, 14, 80, 220)],
            opacity: [0, 1, 1, 0],
            scale: [0.12, 1.45, 0.95, endScale],
            rotate,
            transition: { duration: seededRange(i, 15, 1.35, 2.7), ease: "easeOut", delay: burstDelay },
          },
        };
      }
      case "heart_burst": {
        const heartAngle = seededRange(i, 16, -Math.PI * 0.95, -Math.PI * 0.05);
        const dist = seededRange(i, 17, 150, 460);
        return {
          initial: { x: 0, y: 30, opacity: 0, scale: 0.2, rotate: 0 },
          animate: {
            x: [0, dist * 0.35 * Math.cos(heartAngle), dist * Math.cos(heartAngle) + seededRange(i, 18, -80, 80)],
            y: [30, dist * 0.55 * Math.sin(heartAngle) - 90, dist * Math.sin(heartAngle) + seededRange(i, 19, 120, 260)],
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.25, 1, 0.1],
            rotate: seededRange(i, 20, -260, 260),
            transition: { duration: seededRange(i, 21, 2.1, 3.5), ease: ["easeOut", "easeIn"], delay },
          },
        };
      }
      case "portal": {
        const radius = seededRange(i, 22, 240, 420);
        const startAngle = seededRange(i, 23, 0, Math.PI * 2);
        const spin = seededRange(i, 24, Math.PI * 2.4, Math.PI * 4.8);
        return {
          initial: { x: radius * Math.cos(startAngle), y: radius * Math.sin(startAngle) * 0.65, opacity: 0, scale: 0.2, rotate: 0 },
          animate: {
            x: [radius * Math.cos(startAngle), radius * 0.45 * Math.cos(startAngle + spin * 0.55), seededRange(i, 25, -42, 42)],
            y: [radius * Math.sin(startAngle) * 0.65, radius * 0.45 * Math.sin(startAngle + spin * 0.55) * 0.65, seededRange(i, 26, -34, 34)],
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.1, 0.7, 0.05],
            rotate: rotate + 1080,
            transition: { duration: seededRange(i, 27, 2.3, 3.6), ease: "easeInOut", delay },
          },
        };
      }
      case "bubbles": {
        const startX = seededRange(i, 28, -360, 360);
        const floatX = seededRange(i, 29, -170, 170);
        return {
          initial: { x: startX, y: 80, opacity: 0, scale: 0.15, rotate: 0 },
          animate: {
            x: [startX, startX + floatX * 0.6, startX - floatX * 0.2, startX + floatX],
            y: [80, -160, -360, -640],
            opacity: [0, 0.85, 0.7, 0],
            scale: [0.15, 1.2, 0.85, 0.05],
            rotate: seededRange(i, 30, -140, 140),
            transition: { duration: seededRange(i, 31, 3.4, 5.6), ease: "easeInOut", delay },
          },
        };
      }
      case "meteors":
      case "comet": {
        const side = seededUnit(i, 32) > 0.5 ? 1 : -1;
        const startX = effectType === "comet" ? side * seededRange(i, 33, 260, 520) : seededRange(i, 34, -560, 360);
        const diagonal = -side * seededRange(i, 35, 220, 520);
        return {
          initial: { x: startX, y: -120, opacity: 0, scale: 0.25, rotate: side > 0 ? -35 : 35 },
          animate: {
            x: [startX, startX + diagonal * 0.45, startX + diagonal],
            y: [-120, seededRange(i, 36, 100, 240), seededRange(i, 37, 520, 720)],
            opacity: [0, 1, 0.85, 0],
            scale: [0.25, 1.25, 0.8, 0.05],
            rotate: side > 0 ? -80 : 80,
            transition: { duration: seededRange(i, 38, 1.25, 2.4), ease: "easeInOut", delay },
          },
        };
      }
      default: {
        const launchX = seededRange(i, 39, -60, 60);
        const peakX = launchX + seededRange(i, 40, -180, 180);
        const fallX = peakX + seededRange(i, 41, -260, 260);
        return {
          initial: { x: launchX, y: 40, opacity: 0, scale: 0.2, rotate: 0 },
          animate: {
            x: [launchX, peakX, fallX],
            y: [40, seededRange(i, 42, -360, -180), seededRange(i, 43, 360, 620)],
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.2, 0.85, endScale],
            rotate,
            transition: { duration: seededRange(i, 44, 2.2, 4.4), ease: ["easeOut", "easeIn"], delay },
          },
        };
      }
    }
  };

  const pos = getClassicOrigin(preset.origin);
  if (!particleCount) return null;

  return (
    <motion.div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute will-change-transform"
          variants={variants(i)}
          initial="initial"
          animate="animate"
          style={{
            ...pos,
            color,
            fontSize: `${seededRange(i, 45, preset.size[0], preset.size[1])}px`,
            filter: `drop-shadow(0 0 ${Math.min(seededRange(i, 46, 4, 14), perf.shadowBlurMax)}px ${color}80)`,
          }}
        >
          {preset.emojis[i % preset.emojis.length]}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ── EasyDonateTheme ──────────────────────────────────────
const EasyDonateTheme = forwardRef(({
  settings, displayName, amountText,
  mainVariants, animationStep, imageUrl,
  getFontFamilyCss, getFontWeight, isPlaying = false,
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
  const fontRaw        = settings.titleFontFamily        ?? "IBM Plex Sans Thai";
  const msgFontRaw     = settings.messageFontFamily ?? fontRaw;
  const fontWeight     = settings.titleFontWeight  ?? "700";
  const textSize       = resolveNum(settings.titleFontSize, 36);
  const textColor      = settings.titleMainColor      ?? "#FFFFFF";
  const donorColor     = settings.titleUsernameColor ?? "#FF9500";
  const amountColor    = settings.titleAmountColor    ?? "#0EA5E9";
  const borderW        = parseFloat(settings.titleStrokeWidth ?? 2.5);
  const borderC        = settings.titleStrokeColor    ?? "#000000";
  const amountShine    = settings.titleAmountShine    ?? true;
  const amountEffect   = settings.titleAmountEffect   ?? (amountShine ? "sweep" : "none");
  const textEffect     = settings.titleTextEffect     ?? settings.effect ?? "realistic_look";
  const suffixText     = settings.titleSuffixText     ?? "โดเนทมา";
  const showName       = settings.titleShowName       ?? true;
  const showAmount     = settings.titleShowAmount     ?? true;

  const msgFontWeight  = settings.messageFontWeight  ?? "500";
  const msgFontSize    = resolveNum(settings.messageFontSize, 24);
  const msgColor       = settings.messageColor       ?? "#FFFFFF";
  const msgBorderW     = parseFloat(settings.messageStrokeWidth ?? 2.5);
  const msgBorderC     = settings.messageStrokeColor ?? "#000000";
  const showMessage    = settings.messageShowMessage        ?? true;
  const messageText    = settings.messageText        ?? "เล็กพาฟร้องไปไหน เพื่อนรอเล่นเกม";

  const effect         = textEffect;
  const imageGlow      = settings.imageGlow    ?? false;
  const showConfetti   = settings.showConfetti ?? false;
  const confettiMode   = settings.confettiMode ?? "classic";
  const alertImage     = imageUrl ?? settings.image
    ?? "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif";
  const collisionRefs = useMemo(
    () => [imageRef, donorNameRef, amountRef, messageRef],
    [imageRef, donorNameRef, amountRef, messageRef],
  );

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

  const realisticTitleShadow = `${buildTextStroke(borderC, borderW)}, 0 1px 0 rgba(255,255,255,0.25), 0 6px 18px rgba(0,0,0,0.35)`;
  const realisticAmountShadow = amountShine
    ? `${buildTextStroke(borderC, borderW)}, 0 1px 0 rgba(255,255,255,0.45), 0 0 12px ${rgba(amountColor, 0.55)}, 0 0 28px ${rgba(amountColor, 0.35)}, 0 10px 24px rgba(0,0,0,0.32)`
    : `${buildTextStroke(borderC, borderW)}, 0 1px 0 rgba(255,255,255,0.22), 0 8px 20px rgba(0,0,0,0.3)`;
  const messageFilter = msgBorderW > 0
    ? "url(#message-stroke-filter) drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
    : "none";
  const messageStrokeStyle = msgBorderW > 0
    ? {
        WebkitTextStroke: `${msgBorderW}px ${msgBorderC}`,
        textStroke: `${msgBorderW}px ${msgBorderC}`,
        paintOrder: "stroke fill",
      }
    : {
        WebkitTextStroke: "0px transparent",
        WebkitTextStrokeWidth: "0px",
        WebkitTextStrokeColor: "transparent",
        textStroke: "0px transparent",
        textStrokeWidth: "0px",
        textStrokeColor: "transparent",
        WebkitTextFillColor: msgColor,
        textShadow: "none",
        paintOrder: "normal",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      };

  const amountShadow = (() => {
    const stroke = buildTextStroke(borderC, borderW);
    switch (effect) {
      case "glow":
      case "neon":
        return `${stroke}, 0 0 10px ${amountColor}, 0 0 20px ${amountColor}80, 0 0 30px ${amountColor}40`;
      case "shadow":
        return `${stroke}, 3px 3px 6px rgba(0,0,0,0.5)`;
      case "realistic_look":
        return realisticAmountShadow;
      default: return stroke;
    }
  })();

  const titleShadow = (() => {
    const stroke = buildTextStroke(borderC, borderW);
    switch (effect) {
      case "glow":
      case "neon":
        return `${stroke}, 0 0 10px ${rgba(donorColor, 0.35)}, 0 0 18px ${rgba(amountColor, 0.2)}`;
      case "shadow":
        return `${stroke}, 0 8px 18px rgba(0,0,0,0.45)`;
      case "realistic_look":
        return realisticTitleShadow;
      default:
        return `${stroke}, 0 6px 16px rgba(0,0,0,0.28)`;
    }
  })();

  const imgShadow = (imageGlow || ["glow","neon"].includes(effect))
    ? `0 0 10px ${amountColor}, 0 0 15px ${amountColor}80`
    : effect === "shadow" ? "0 5px 15px rgba(0,0,0,0.5)" : "none";

  const renderAmountEffectOverlay = () => {
    if (!amountShine || amountEffect === "none") return null;

    if (amountEffect === "pulse") {
      return (
        <motion.h1
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] w-fit"
          style={{
            fontFamily: mainFont,
            fontWeight: mainFW,
            fontSize: `${textSize * 1.33}px`,
            lineHeight: `${textSize * 1.33}px`,
            color: "#fff7d6",
            opacity: 0.74,
            textShadow: `0 0 16px ${rgba(amountColor, 0.82)}, 0 0 34px ${rgba(amountColor, 0.5)}, 0 0 50px ${rgba("#FFFFFF", 0.28)}`,
            mixBlendMode: "screen",
          }}
          animate={{
            opacity: [0.28, 0.95, 0.28],
            scale: [1, 1.055, 1],
            y: [0, -1.5, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>{cleanAmount}</span><span>฿</span>
        </motion.h1>
      );
    }

    if (amountEffect === "sparkle") {
      const sparkles = [
        { left: "-10%", top: "8%", delay: 0 },
        { left: "84%", top: "4%", delay: 0.35 },
        { left: "16%", top: "72%", delay: 0.6 },
        { left: "92%", top: "76%", delay: 0.95 },
      ];

      return (
        <>
          <motion.h1
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] w-fit"
            style={{
              fontFamily: mainFont,
              fontWeight: mainFW,
              fontSize: `${textSize * 1.33}px`,
              lineHeight: `${textSize * 1.33}px`,
              color: "#fff9e8",
              opacity: 0.48,
              textShadow: `0 0 10px ${rgba(amountColor, 0.65)}, 0 0 26px ${rgba(amountColor, 0.36)}`,
              mixBlendMode: "screen",
            }}
            animate={{ opacity: [0.3, 0.62, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>{cleanAmount}</span><span>฿</span>
          </motion.h1>

          {sparkles.map((sparkle, index) => (
            <motion.span
              key={`sparkle-${index}`}
              aria-hidden="true"
              className="pointer-events-none absolute z-[3] text-white"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                textShadow: `0 0 10px ${rgba(amountColor, 0.85)}, 0 0 20px ${rgba("#FFFFFF", 0.4)}`,
                fontSize: `${Math.max(12, textSize * 0.22)}px`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.4, 1.2, 0.4],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 1.45,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.span>
          ))}
        </>
      );
    }

    if (amountEffect === "pop") {
      return (
        <motion.h1
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] w-fit"
          style={{
            fontFamily: mainFont,
            fontWeight: mainFW,
            fontSize: `${textSize * 1.33}px`,
            lineHeight: `${textSize * 1.33}px`,
            color: "#fff4cc",
            opacity: 0.52,
            textShadow: `0 0 10px ${rgba(amountColor, 0.45)}, 0 10px 18px rgba(0,0,0,0.18)`,
          }}
          animate={{
            opacity: [0.18, 0.65, 0.18],
            scale: [1, 1.085, 1],
            rotate: [0, -1.2, 0],
          }}
          transition={{
            duration: 1.25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>{cleanAmount}</span><span>฿</span>
        </motion.h1>
      );
    }

    return (
      <>
        <motion.h1
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] w-fit"
          style={{
            fontFamily: mainFont,
            fontWeight: mainFW,
            fontSize: `${textSize * 1.33}px`,
            lineHeight: `${textSize * 1.33}px`,
            color: "#fff7d6",
            opacity: 0.72,
            textShadow: `0 0 14px ${rgba(amountColor, 0.78)}, 0 0 30px ${rgba(amountColor, 0.45)}, 0 0 42px ${rgba("#FFFFFF", 0.35)}`,
            mixBlendMode: "screen",
          }}
          animate={{
            opacity: [0.32, 0.98, 0.32],
            scale: [1, 1.045, 1],
            y: [0, -1.5, 0],
          }}
          transition={{
            duration: 1.85,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>{cleanAmount}</span><span>฿</span>
        </motion.h1>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[-14%] z-[3] w-[42%]"
          style={{
            background: `linear-gradient(115deg, ${rgba("#FFFFFF", 0)} 0%, ${rgba("#FFFFFF", 0.14)} 28%, ${rgba("#FFFFFF", 0.95)} 50%, ${rgba("#FFFFFF", 0.18)} 72%, ${rgba("#FFFFFF", 0)} 100%)`,
            filter: `blur(${Math.max(6, textSize * 0.08)}px)`,
            transform: "skewX(-18deg)",
          }}
          animate={{
            x: ["-60%", "240%"],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: 1.55,
            repeat: Infinity,
            repeatDelay: 0.45,
            ease: "easeInOut",
          }}
        />
      </>
    );
  };

  return (
    <motion.div
      className="relative w-full flex flex-col items-center justify-center overflow-visible"
      style={{ fontFamily: mainFont, minHeight: "clamp(280px, 52vw, 500px)", width: "100%" }}
      variants={mainVariants}
      initial="initial"
      animate={animationStep === "in" || animationStep === "display" ? "animate" : animationStep}
      exit="exit"
    >
      {showConfetti && isPlaying && (animationStep === "in" || animationStep === "display") && (
        confettiMode === "physics" ? (
          <PhysicsConfettiLayer settings={settings} collisionRefs={collisionRefs} />
        ) : (
          <ClassicConfettiLayer settings={settings} />
        )
      )}

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <motion.img
          ref={imageRef}
          className="h-[clamp(120px,24vw,200px)] max-w-full w-auto rounded-2xl object-contain"
          src={alertImage}
          alt="alert"
          style={{ filter:"drop-shadow(0 4px 6px rgba(0,0,0,0.6))", boxShadow: imgShadow }}
          animate={isPlaying ? { scale:[1,1.05,1] } : { scale:1 }}
          transition={isPlaying ? { duration:2, repeat:Infinity } : { duration:0.2 }}
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
                textShadow: titleShadow,
              }}
            >
              {showName && (
                <span
                  style={{
                    color: donorColor,
                    fontWeight: mainFW,
                    fontFamily: mainFont,
                  }}
                >
                  {displayName}
                </span>
              )}
              <span style={{ fontFamily: mainFont }}> {suffixText}</span>
            </h1>

            {showAmount && (
              <div ref={amountRef} className="relative w-fit">
                <h1
                  className="relative z-[1] w-fit"
                  style={{
                    fontFamily: mainFont,
                    fontWeight: mainFW,
                    fontSize: `${textSize * 1.33}px`,
                    lineHeight: `${textSize * 1.33}px`,
                    color: amountColor,
                    filter: "url(#stroke-filter) drop-shadow(0 4px 6px rgba(0,0,0,0.6))",
                    textShadow: amountShadow,
                    letterSpacing: amountShine ? "0.02em" : "0.01em",
                  }}
                >
                  <span>{cleanAmount}</span><span>฿</span>
                </h1>
                {renderAmountEffectOverlay()}
              </div>
            )}
          </div>

          {showMessage && displayMsg && (
            <p
              ref={messageRef}
              className="w-full max-w-[400px] text-center break-words"
              style={{
                fontFamily: msgFont, fontWeight: msgFW,
                color: msgColor,
                fontSize: `${msgFontSize}px`, lineHeight: `${msgFontSize*1.4}px`,
                filter: messageFilter,
                textShadow: "none",
                ...messageStrokeStyle,
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
          {msgBorderW > 0 && (
            <filter id="message-stroke-filter">
              <feMorphology operator="dilate" radius={msgBorderW} in="SourceAlpha" result="t"/>
              <feFlood floodColor={msgBorderC} floodOpacity="1" result="f"/>
              <feComposite in="f" in2="t" operator="in" result="s"/>
              <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          )}
        </defs>
      </svg>
    </motion.div>
  );
});

EasyDonateTheme.displayName = "EasyDonateTheme";
export default EasyDonateTheme;
