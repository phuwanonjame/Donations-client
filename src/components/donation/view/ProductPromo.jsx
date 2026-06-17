import { motion } from "framer-motion";
import { ShoppingBag, ExternalLink, Star } from "lucide-react";

const PRODUCTS = [
  {
    name: "เสื้อทีม x86",
    price: "฿590",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    badge: "ขายดี",
    rating: 4.8,
  },
  {
    name: "หมวกแก๊ปลิมิเต็ด",
    price: "฿390",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=300&h=300&fit=crop",
    badge: "ใหม่",
    rating: 4.9,
  },
  {
    name: "แก้วน้ำ Gamer",
    price: "฿250",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop",
    badge: null,
    rating: 4.7,
  },
];

const defaultTheme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
  base: "4, 15, 30",
  baseSecondary: "12, 28, 48",
  text: "255, 255, 255",
  mutedText: "255, 255, 255",
};

const rgba = (rgb, opacity) => `rgba(${rgb},${opacity})`;

export default function ProductPromo({
  products = PRODUCTS,
  visualTheme = defaultTheme,
}) {
  const theme = { ...defaultTheme, ...visualTheme };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl p-4"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${rgba(theme.base, 0.82)}, ${rgba(
            theme.baseSecondary,
            0.68
          )})`,
          backdropFilter: "blur(18px)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]">
        <div
          className="h-full w-full rounded-2xl"
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

      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: rgba(theme.primary, 0.25) }}
      />
      <div
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: rgba(theme.secondary, 0.25) }}
      />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag
              className="h-4 w-4"
              style={{ color: `rgb(${theme.accent})` }}
            />
            <h3
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: rgba(theme.mutedText, 0.6) }}
            >
              สินค้า & Merch
            </h3>
          </div>

          <a
            href="#"
            className="flex items-center gap-1 text-xs transition hover:text-white"
            style={{ color: rgba(theme.mutedText, 0.6) }}
          >
            ดูทั้งหมด <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="space-y-2.5">
          {products.map((product, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 6 }}
              className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/10"
            >
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: `rgb(${theme.text})` }}
                  >
                    {product.name}
                  </p>

                  {product.badge && (
                    <span
                      className="whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px]"
                      style={{
                        background: rgba(theme.primary, 0.15),
                        color: `rgb(${theme.primary})`,
                        borderColor: rgba(theme.primary, 0.3),
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: `rgb(${theme.primary})` }}
                  >
                    {product.price}
                  </span>

                  <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    {product.rating}
                  </span>
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
