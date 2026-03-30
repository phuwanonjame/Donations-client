// ./components/tabs/ranges/RangeTemplateSelector.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Gift, Star, Trophy, Zap, ChevronDown, ChevronUp } from "lucide-react";

const templates = [
  {
    id: "small",
    name: "Small Gift",
    displayName: "🎁 Small Gift",
    description: "For small donations 1-100 THB",
    icon: Gift,
    color: "from-purple-500 to-pink-500",
    config: {
      name: "Small Gift",
      minAmount: 1,
      maxAmount: 100,
      priority: 1,
      textEffect: "realistic_look",
      soundEnabled: true,
      soundUrl: "/sounds/coin.mp3",
      soundVolume: 70,
      showConfetti: false,
      animationStyle: "slide-up",
      duration: 3000,
      backgroundColor: "from-purple-500 to-pink-500",
      position: "top-center",
    }
  },
  {
    id: "medium",
    name: "Big Support",
    displayName: "🌟 Big Support",
    description: "For medium donations 101-500 THB",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    config: {
      name: "Big Support",
      minAmount: 101,
      maxAmount: 500,
      priority: 2,
      textEffect: "glow",
      soundEnabled: true,
      soundUrl: "/sounds/magic.mp3",
      soundVolume: 80,
      showConfetti: true,
      confettiEffect: "fountain",
      animationStyle: "scale",
      duration: 5000,
      imageGlow: true,
      backgroundColor: "from-blue-500 to-cyan-500",
      position: "top-center",
    }
  },
  {
    id: "large",
    name: "Super Star",
    displayName: "🏆 Super Star",
    description: "For large donations 501+ THB",
    icon: Trophy,
    color: "from-orange-500 to-red-500",
    config: {
      name: "Super Star",
      minAmount: 501,
      maxAmount: 999999,
      priority: 3,
      textEffect: "neon",
      soundEnabled: true,
      soundUrl: "/sounds/cheer.mp3",
      soundVolume: 90,
      showConfetti: true,
      confettiEffect: "blast",
      animationStyle: "bounce",
      duration: 7000,
      imageGlow: true,
      amountShine: true,
      particleEffect: true,
      backgroundColor: "from-orange-500 to-red-500",
      position: "top-center",
      textGlow: true,
      textShadow: true,
    }
  },
  {
    id: "premium",
    name: "Premium Alert",
    displayName: "⚡ Premium Alert",
    description: "Full effects for VIP donors (1000+ THB)",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
    config: {
      name: "Premium Alert",
      minAmount: 1000,
      maxAmount: 999999,
      priority: 4,
      textEffect: "neon",
      soundEnabled: true,
      soundUrl: "/sounds/applause.mp3",
      soundVolume: 100,
      showConfetti: true,
      confettiEffect: "spiral",
      animationStyle: "flip",
      duration: 10000,
      imageGlow: true,
      amountShine: true,
      particleEffect: true,
      textGlow: true,
      textShadow: true,
      backgroundColor: "from-yellow-500 to-amber-500",
      position: "center",
      glowIntensity: 100,
    }
  }
];

export default function RangeTemplateSelector({ onSelectTemplate }) {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <h4 className="text-white font-medium">Quick Templates</h4>
          <span className="text-xs text-slate-500">Start with pre-configured settings</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-cyan-400 hover:text-cyan-300"
        >
          {showTemplates ? (
            <>Hide Templates <ChevronUp className="w-4 h-4 ml-1" /></>
          ) : (
            <>Show Templates <ChevronDown className="w-4 h-4 ml-1" /></>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`bg-gradient-to-r ${template.color} cursor-pointer hover:shadow-xl transition-all border-0 shadow-lg`}
                      onClick={() => onSelectTemplate(template.config)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-white" />
                          <CardTitle className="text-white text-base">{template.displayName}</CardTitle>
                        </div>
                        <CardDescription className="text-white/80 text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-white/70 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span>💰</span>
                            <span>{template.config.minAmount.toLocaleString()} - {template.config.maxAmount === 999999 ? '∞' : template.config.maxAmount.toLocaleString()} THB</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>✨</span>
                            <span>{template.config.textEffect}</span>
                          </div>
                          {template.config.showConfetti && (
                            <div className="flex items-center gap-2">
                              <span>🎊</span>
                              <span>Confetti: {template.config.confettiEffect}</span>
                            </div>
                          )}
                          {template.config.soundEnabled && (
                            <div className="flex items-center gap-2">
                              <span>🔊</span>
                              <span>Sound enabled</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-slate-500 text-xs text-center mt-3">
              Click any template to create a new range with those settings
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

RangeTemplateSelector.propTypes = {
  onSelectTemplate: PropTypes.func.isRequired,
};