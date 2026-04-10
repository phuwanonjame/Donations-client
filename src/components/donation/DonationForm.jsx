import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, Upload, Download, X, Check } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "promptpay", label: "พร้อมเพย์", description: "สแกน QR ทุกธนาคาร", color: "#009688", tag: "PromptPay" },
  { id: "bank", label: "บัญชีธนาคาร", description: "โอนตรงเข้าบัญชี", color: "#6366f1", tag: "Bank" },
  { id: "truemoney", label: "ทรูมันนี่", description: "อั่งเปา TrueMoney", color: "#e53935", tag: "True" },
];

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

const theme = {
  primary: "186, 230, 253",
  secondary: "147, 197, 253",
  accent: "255, 255, 255",
};

export default function DonationForm({ selectedSticker }) {
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("10");
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const totalAmount = amount + (selectedSticker?.price || 0);

  const handleQuickAmount = (val) => {
    setAmount(val);
    setCustomAmount(String(val));
  };

  const handleAmountInput = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) setAmount(num);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !slipFile) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSlipFile(null);
    setSlipPreview(null);
    setDonorName("");
    setMessage("");
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          border: `1px solid rgba(${theme.primary},0.35)`,
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
          backdropFilter: "blur(18px)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          style={{
            width: 80, height: 80, borderRadius: "50%",
            border: `1px solid rgba(${theme.primary},0.4)`,
            background: `rgba(${theme.primary},0.1)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: `0 0 24px rgba(${theme.primary},0.3)`,
          }}
        >
          <Check style={{ width: 32, height: 32, color: `rgb(${theme.primary})` }} />
        </motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: "#fff", marginBottom: 4 }}>ส่งสำเร็จแล้ว!</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>ขอบคุณที่โดเนทให้ streamer นะครับ</p>
        <button
          onClick={handleReset}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 13, color: `rgb(${theme.primary})`,
            border: `1px solid rgba(${theme.primary},0.35)`,
            padding: "8px 24px", borderRadius: 99,
            background: `rgba(${theme.primary},0.08)`,
            cursor: "pointer",
          }}
        >
          โดเนทอีกครั้ง
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Step 1 */}
      <StepCard step={1} title="กรอกข้อความที่ต้องการบอก">
        <img
        src="/imgs/ice.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-1 left-0 w-10 z-20 opacity-90"
      />

      <img
        src="/imgs/ice_bar_1.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-12 -right-5 w-90 z-20 opacity-90"
      />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InputField
            label="ชื่อของคุณ"
            required
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="เช่น คุณน้องชาย"
          />
          <div>
            <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
              ข้อความ (ไม่บังคับ)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="พิมพ์ข้อความที่อยากฝากถึง streamer..."
              style={{
                width: "100%", boxSizing: "border-box",
                border: `1px solid rgba(${theme.primary},0.25)`,
                borderRadius: 12, padding: "10px 14px",
                fontSize: 13, color: "#fff",
                background: `rgba(${theme.primary},0.06)`,
                outline: "none", resize: "none",
              }}
            />
          </div>
          {selectedSticker && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: 10, borderRadius: 12,
              background: `rgba(${theme.primary},0.08)`,
              border: `1px solid rgba(${theme.primary},0.25)`,
            }}>
              <span style={{ fontSize: 24 }}>{selectedSticker.emoji}</span>
              <div>
                <p style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{selectedSticker.name}</p>
                <p style={{ fontSize: 11, color: `rgb(${theme.primary})` }}>+฿{selectedSticker.price} สติ๊กเกอร์</p>
              </div>
            </div>
          )}
        </div>
      </StepCard>

      {/* Step 2 */}
      <StepCard step={2} title="เลือกช่องทางและจำนวนเงิน">
        <img
        src="/imgs/ice_bar_2.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-1 -left-1 w-20 z-20 opacity-90"
      />

      <img
        src="/imgs/ice_bar_2.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-7 -right-3 w-90 z-20 opacity-90"
      />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                padding: 12, borderRadius: 12, textAlign: "left", cursor: "pointer",
                border: paymentMethod === pm.id
                  ? `1px solid rgba(${theme.primary},0.7)`
                  : `1px solid rgba(255,255,255,0.12)`,
                background: paymentMethod === pm.id
                  ? `rgba(${theme.primary},0.15)`
                  : "rgba(255,255,255,0.04)",
                boxShadow: paymentMethod === pm.id
                  ? `0 0 12px rgba(${theme.primary},0.3)`
                  : "none",
                transition: "all .2s",
              }}
            >
              <span style={{
                fontSize: 10, fontWeight: 600, color: "#fff",
                padding: "2px 6px", borderRadius: 6, marginBottom: 8,
                background: pm.color,
              }}>
                {pm.tag}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 500,
                color: paymentMethod === pm.id ? `rgb(${theme.primary})` : "#fff",
              }}>
                {pm.label}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2, lineHeight: 1.4 }}>
                {pm.description}
              </span>
            </button>
          ))}
        </div>

        <div style={{ borderTop: `1px solid rgba(${theme.primary},0.15)`, paddingTop: 20 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
            {paymentMethod === "promptpay" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 128, flexShrink: 0 }}>
                <div style={{
                  width: 128, height: 128, background: "#fff", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 8, border: `1px solid rgba(${theme.primary},0.2)`,
                }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: 8,
                    background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img src={`https://promptpay.io/0826589650/${customAmount}.png`} alt="QR Code" />
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>สแกน QR พร้อมเพย์</p>
                <button
                  type="button"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: 11, color: `rgba(${theme.primary},0.8)`,
                    border: `1px solid rgba(${theme.primary},0.25)`,
                    padding: "4px 10px", borderRadius: 99,
                    background: "none", cursor: "pointer",
                  }}
                >
                  <Download style={{ width: 12, height: 12 }} /> บันทึก QR
                </button>
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                  จำนวนเงิน (บาท) <span style={{ color: `rgb(${theme.primary})` }}>*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={handleAmountInput}
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: `1px solid rgba(${theme.primary},0.35)`,
                    borderRadius: 12, padding: "10px 14px",
                    fontSize: 20, fontWeight: 500,
                    color: `rgb(${theme.primary})`,
                    background: `rgba(${theme.primary},0.08)`,
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {QUICK_AMOUNTS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleQuickAmount(v)}
                      style={{
                        fontSize: 12, padding: "5px 12px", borderRadius: 99, cursor: "pointer",
                        border: amount === v
                          ? `1px solid rgba(${theme.primary},0.7)`
                          : `1px solid rgba(255,255,255,0.15)`,
                        background: amount === v ? `rgba(${theme.primary},0.2)` : "transparent",
                        color: amount === v ? `rgb(${theme.primary})` : "rgba(255,255,255,0.55)",
                        boxShadow: amount === v ? `0 0 8px rgba(${theme.primary},0.25)` : "none",
                        transition: "all .2s",
                      }}
                    >
                      ฿{v}
                    </button>
                  ))}
                </div>
              </div>

              {selectedSticker && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: 10, borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(${theme.primary},0.2)`,
                }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>รวมสติ๊กเกอร์</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: `rgb(${theme.primary})` }}>฿{totalAmount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 3 */}
      <StepCard step={3} title="แนบสลิปการโอนเงิน">
        <img
        src="/imgs/ice_bar_2.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-1 -left-1 w-20 z-20 opacity-90"
      />

      <img
        src="/imgs/ice_bar_2.png"
        alt="ice-left"
        className="pointer-events-none absolute -top-7 -right-3 w-90 z-20 opacity-90"
      />
        
        {slipPreview ? (
          <div style={{ position: "relative" }}>
            <img
              src={slipPreview}
              alt="slip preview"
              style={{
                width: "100%", maxHeight: 256, objectFit: "contain",
                borderRadius: 12, border: `1px solid rgba(${theme.primary},0.25)`,
              }}
            />
            <button
              type="button"
              onClick={() => { setSlipFile(null); setSlipPreview(null); }}
              style={{
                position: "absolute", top: 8, right: 8,
                width: 28, height: 28, borderRadius: "50%",
                border: `1px solid rgba(${theme.primary},0.3)`,
                background: "rgba(0,0,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.7)",
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 8,
              border: isDragging
                ? `2px dashed rgba(${theme.primary},0.8)`
                : `2px dashed rgba(${theme.primary},0.3)`,
              borderRadius: 12, padding: 32, cursor: "pointer",
              background: isDragging ? `rgba(${theme.primary},0.08)` : "rgba(255,255,255,0.02)",
              transition: "all .2s",
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              border: `1px solid rgba(${theme.primary},0.3)`,
              background: `rgba(${theme.primary},0.08)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Upload style={{ width: 20, height: 20, color: `rgba(${theme.primary},0.8)` }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>คลิกหรือลากสลิปมาวางที่นี่</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>PNG, JPG (ต้องมี QR Code)</p>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

        <motion.button
          type="submit"
          disabled={isSubmitting || !donorName || !slipFile}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: 16, width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: isSubmitting || !donorName || !slipFile
              ? "rgba(186,230,253,0.2)"
              : `rgb(${theme.primary})`,
            color: isSubmitting || !donorName || !slipFile ? "rgba(255,255,255,0.3)" : "#0d2a3a",
            fontWeight: 500, fontSize: 14,
            padding: "14px 24px", borderRadius: 99, border: "none",
            cursor: isSubmitting || !donorName || !slipFile ? "not-allowed" : "pointer",
            boxShadow: isSubmitting || !donorName || !slipFile
              ? "none"
              : `0 0 16px rgba(${theme.primary},0.6), 0 0 32px rgba(${theme.primary},0.3)`,
            transition: "all .2s",
          }}
        >
          {isSubmitting ? (
            <>
              <span style={{
                width: 16, height: 16, borderRadius: "50%",
                border: "2px solid rgba(13,42,58,0.3)",
                borderTopColor: "#0d2a3a",
                animation: "spin 0.8s linear infinite",
                display: "inline-block",
              }} />
              กำลังส่ง...
            </>
          ) : (
            <>
              <Rocket style={{ width: 16, height: 16 }} />
              ส่งการโดเนท {totalAmount > amount ? `— ฿${totalAmount}` : `— ฿${amount}`}
            </>
          )}
        </motion.button>
      </StepCard>
    </form>
  );
}

function StepCard({ step, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 120, delay: 0.05 * step }}
      style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}
    >
      {/* animated gradient bg */}
      <motion.div
        style={{ position: "absolute", inset: 0, opacity: 0.6 }}
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, rgba(${theme.primary},0.25), transparent 60%)`,
            `radial-gradient(circle at 80% 30%, rgba(${theme.secondary},0.25), transparent 60%)`,
            `radial-gradient(circle at 40% 80%, rgba(${theme.accent},0.25), transparent 60%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* dark base */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(4, 15, 30, 0.92)" }} />

      {/* glass */}
      <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      {/* border */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16, padding: 1,
        background: `linear-gradient(120deg, rgba(${theme.primary},0.8), rgba(${theme.secondary},0.8), rgba(${theme.accent},0.8))`,
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 15, background: "rgba(4, 15, 30, 0.95)" }} />
      </div>

      {/* glow */}
      <div style={{
        position: "absolute", top: -64, right: -64, width: 224, height: 224,
        borderRadius: "50%", filter: "blur(80px)", opacity: 0.5,
        background: `rgba(${theme.primary},0.35)`,
      }} />
      <div style={{
        position: "absolute", bottom: -64, left: -64, width: 224, height: 224,
        borderRadius: "50%", filter: "blur(80px)", opacity: 0.5,
        background: `rgba(${theme.accent},0.35)`,
      }} />

      {/* content */}
      <div style={{ position: "relative", zIndex: 10, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: 0, filter: "blur(12px)", opacity: 0.7,
              background: `linear-gradient(120deg, rgb(${theme.primary}), rgb(${theme.accent}))`,
            }} />
            <div style={{
              position: "relative", width: 36, height: 36, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#0d2a3a",
              background: `linear-gradient(120deg, rgb(${theme.primary}), rgb(${theme.accent}))`,
            }}>
              {step}
            </div>
          </motion.div>

          <div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              STEP {step}
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{title}</h3>
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
}

function InputField({ label, required, ...props }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
        {label} {required && <span style={{ color: `rgb(${theme.primary})` }}>*</span>}
      </label>
      <input
        type="text"
        required={required}
        style={{
          width: "100%", boxSizing: "border-box",
          border: `1px solid rgba(${theme.primary},0.25)`,
          borderRadius: 12, padding: "10px 14px",
          fontSize: 13, color: "#fff",
          background: `rgba(${theme.primary},0.06)`,
          outline: "none",
        }}
        {...props}
      />
    </div>
  );
}