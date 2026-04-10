import { motion } from "framer-motion";
import { ShoppingBag, ExternalLink, Star } from "lucide-react";

const PRODUCTS = [
  {
    name: "เสื้อทีม x86",
    price: "฿590",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    badge: "🔥 ขายดี",
    rating: 4.8,
  },
  {
    name: "หมวกแก๊ปลิมิเต็ด",
    price: "฿390",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=300&h=300&fit=crop",
    badge: "✨ ใหม่",
    rating: 4.9,
  },
  {
    name: "แก้วน้ำ Gamer",
    price: "฿250",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop",
    badge: null,
    rating: 4.7,
  },
];

export default function ProductPromo() {
  const theme = {
  primary: "186, 230, 253",   // ฟ้าน้ำแข็งอ่อน (icy blue)
  secondary: "147, 197, 253", // ฟ้าเย็น
  accent: "255, 255, 255",    // ขาวหิมะ
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
      className="relative overflow-hidden p-4 rounded-2xl"
    >
      {/* 🔥 Dark base */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 🧊 Glass */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))`,
          backdropFilter: "blur(18px)",
        }}
      />

      {/* 🌈 Gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
        <div
          className="w-full h-full rounded-2xl"
          style={{
            background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(${theme.accent},0.6))`,
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      </div>

      {/* 💡 Glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `rgba(${theme.primary},0.25)` }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl"
        style={{ background: `rgba(${theme.secondary},0.25)` }}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag
              className="w-4 h-4"
              style={{ color: `rgb(${theme.accent})` }}
            />
            <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">
              🛍️ สินค้า & Merch
            </h3>
          </div>

          <a
            href="#"
            className="text-xs flex items-center gap-1 text-white/60 hover:text-white transition"
          >
            ดูทั้งหมด <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-2.5">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 6 }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
            >
              {/* 🖼️ Image */}
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* 📦 Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">
                    {product.name}
                  </p>

                  {product.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap"
                      style={{
                        background: `rgba(${theme.primary},0.15)`,
                        color: `rgb(${theme.primary})`,
                        borderColor: `rgba(${theme.primary},0.3)`,
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: `rgb(${theme.primary})` }}
                  >
                    {product.price}
                  </span>

                  <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* 🔗 Icon */}
              <ExternalLink className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}