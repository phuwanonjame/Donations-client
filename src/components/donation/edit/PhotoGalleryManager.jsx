import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Heart, MessageCircle, Plus, Trash2 } from "lucide-react";

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
};

export default function PhotoGalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 6 - photos.length;
    const toAdd = files.slice(0, remaining);

    toAdd.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [
        ...prev,
        { url, likes: 0, caption: file.name.replace(/\.[^.]+$/, "") },
      ]);
    });

    // reset input so same file can be added again after removal
    e.target.value = "";
  };

  const handleRemove = (i) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[i].url);
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length === 0) setDeleteMode(false);
      return next;
    });
    if (selectedPhoto === photos[i]) setSelectedPhoto(null);
  };

  const isFull = photos.length >= 6;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden p-4 rounded-2xl backdrop-blur-xl border border-white/10"
      >
        {/* Glass */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
            backdropFilter: "blur(18px)",
          }}
        />

        {/* Gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
          <div
            className="w-full h-full rounded-2xl"
            style={{
              background: `linear-gradient(120deg, rgba(${theme.primary},0.6), rgba(${theme.secondary},0.6), rgba(${theme.accent},0.6))`,
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />
        </div>

        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.primary},0.25)` }} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `rgba(${theme.secondary},0.25)` }} />

        {/* Content */}
        <div className="relative z-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" style={{ color: `rgb(${theme.accent})` }} />
              <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">
                📸 รูปภาพ & โมเมนต์
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Counter dots */}
              <div className="flex items-center gap-1">
                {[0,1,2,3,4,5].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i < photos.length
                        ? `rgb(${theme.primary})`
                        : `rgba(${theme.primary},0.2)`,
                      boxShadow: i < photos.length
                        ? `0 0 4px rgba(${theme.primary},0.8)`
                        : "none",
                    }}
                  />
                ))}
                <span className="text-[10px] text-white/40 ml-1 font-mono">
                  {photos.length}/6
                </span>
              </div>

              {/* Delete toggle */}
              {photos.length > 0 && (
                <button
                  onClick={() => setDeleteMode(!deleteMode)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    color: deleteMode ? `rgb(${theme.primary})` : "rgba(255,255,255,0.4)",
                    background: deleteMode ? `rgba(${theme.primary},0.15)` : "transparent",
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Add button */}
              {!isFull && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddPhoto}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Grid */}
          {photos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 flex flex-col items-center gap-3 text-white/40"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `rgba(${theme.primary},0.1)` }}
              >
                <Camera className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-xs text-center">
                ยังไม่มีรูปเลย<br />
                <span className="opacity-60">กด + เพื่อเพิ่มรูปภาพ (สูงสุด 6 รูป)</span>
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              <AnimatePresence initial={false}>
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    whileHover={!deleteMode ? { scale: 1.05 } : {}}
                    whileTap={!deleteMode ? { scale: 0.95 } : {}}
                    onClick={() => !deleteMode && setSelectedPhoto(photo)}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Normal hover overlay */}
                    {!deleteMode && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-white text-xs">
                          <Heart className="w-3 h-3 fill-current" />
                          {photo.likes}
                        </div>
                      </div>
                    )}

                    {/* Delete mode overlay */}
                    {deleteMode && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(239,68,68,0.85)" }}
                        >
                          <X className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}

                {/* Empty slot placeholder เมื่อยังไม่เต็ม */}
                {!isFull && photos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: `rgba(${theme.primary},0.06)`,
                      border: `1.5px dashed rgba(${theme.primary},0.25)`,
                    }}
                  >
                    <Plus className="w-5 h-5" style={{ color: `rgba(${theme.primary},0.5)` }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full rounded-2xl"
              />

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <p className="text-white text-sm">{selectedPhoto.caption}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-white/70 text-xs">
                    <Heart className="w-3 h-3" /> {selectedPhoto.likes}
                  </span>
                  <span className="flex items-center gap-1 text-white/70 text-xs">
                    <MessageCircle className="w-3 h-3" /> 0
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}