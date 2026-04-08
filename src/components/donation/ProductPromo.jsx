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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-4 neon-border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-yellow-400" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            🛍️ สินค้า & Merch
          </h3>
        </div>
        <a href="#" className="text-xs text-primary hover:underline flex items-center gap-1">
          ดูทั้งหมด <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-2.5">
        {PRODUCTS.map((product, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                {product.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-semibold text-primary">{product.price}</span>
                <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  {product.rating}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}