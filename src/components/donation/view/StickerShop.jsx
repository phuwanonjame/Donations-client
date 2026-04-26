import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

const STICKERS = [
  { id: 1, emoji: "🔥", name: "ไฟลุก!", price: 10, tier: "basic" },
  { id: 2, emoji: "❤️", name: "หัวใจรัก", price: 10, tier: "basic" },
  { id: 3, emoji: "😂", name: "ขำจนน้ำตาไหล", price: 20, tier: "basic" },
  { id: 4, emoji: "🎮", name: "Gamer Mode", price: 20, tier: "basic" },
  { id: 5, emoji: "⚡", name: "ซูเปอร์โดเนท!", price: 50, tier: "premium" },
  { id: 6, emoji: "🌟", name: "ดาวสว่าง", price: 50, tier: "premium" },
  { id: 7, emoji: "💎", name: "เพชรแห่งราตรี", price: 100, tier: "premium" },
  { id: 8, emoji: "🦄", name: "ยูนิคอร์นมายากล", price: 100, tier: "premium" },
  { id: 9, emoji: "👑", name: "คิงออฟโดเนท", price: 200, tier: "legendary" },
  { id: 10, emoji: "🐉", name: "มังกรทอง", price: 200, tier: "legendary" },
  { id: 11, emoji: "🏆", name: "แชมป์เปี้ยน!", price: 500, tier: "legendary" },
  { id: 12, emoji: "🚀", name: "จรวดสู่ดวงจันทร์", price: 500, tier: "legendary" },
];

const tierColors = {
  basic: { bg: "bg-secondary/50", border: "border-border", glow: "" },
  premium: { bg: "bg-primary/5", border: "border-primary/20", glow: "glow-primary" },
  legendary: { bg: "bg-yellow-500/5", border: "border-yellow-500/20", glow: "" },
};

const tierLabels = {
  basic: { label: "ธรรมดา", color: "text-muted-foreground" },
  premium: { label: "พรีเมียม ✨", color: "text-primary" },
  legendary: { label: "เลเจนดารี่ 👑", color: "text-yellow-400" },
};

export default function StickerShop({ onStickerSelect }) {
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? STICKERS : STICKERS.filter((s) => s.tier === filter);

  const handleSelect = (sticker) => {
    setSelectedSticker(sticker.id === selectedSticker?.id ? null : sticker);
    onStickerSelect?.(sticker.id === selectedSticker?.id ? null : sticker);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border rounded-2xl p-4 neon-border"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          🎨 สติ๊กเกอร์โดเนท
        </h3>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        เลือกสติ๊กเกอร์แนบไปกับการโดเนท! ยิ่งแพงยิ่งเท่ 💸
      </p>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
        {[
          { key: "all", label: "ทั้งหมด" },
          { key: "basic", label: "ธรรมดา" },
          { key: "premium", label: "พรีเมียม" },
          { key: "legendary", label: "เลเจนดารี่" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
              filter === tab.key
                ? "bg-primary/20 border-primary/30 text-primary"
                : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sticker grid */}
      <div className="grid grid-cols-4 gap-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((sticker) => {
            const tier = tierColors[sticker.tier];
            const isSelected = selectedSticker?.id === sticker.id;
            return (
              <motion.button
                key={sticker.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(sticker)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-primary/10 border-primary/40 ring-1 ring-primary/30"
                    : `${tier.bg} ${tier.border} hover:border-primary/30`
                } ${tier.glow}`}
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <span className="text-2xl">{sticker.emoji}</span>
                <span className="text-[10px] text-foreground truncate w-full text-center leading-tight">
                  {sticker.name}
                </span>
                <span className="text-[10px] font-semibold text-primary">฿{sticker.price}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {selectedSticker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-center"
        >
          <p className="text-xs text-foreground">
            เลือก <span className="text-lg">{selectedSticker.emoji}</span>{" "}
            <span className="font-medium">{selectedSticker.name}</span>
            {" "}— เพิ่ม <span className="text-primary font-semibold">฿{selectedSticker.price}</span> ในการโดเนท
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}