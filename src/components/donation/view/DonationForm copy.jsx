import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, Upload, Download, X, Check } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "promptpay", label: "พร้อมเพย์", description: "สแกน QR ทุกธนาคาร", color: "#009688", tag: "PromptPay" },
  { id: "bank", label: "บัญชีธนาคาร", description: "โอนตรงเข้าบัญชี", color: "#6366f1", tag: "Bank" },
  { id: "truemoney", label: "ทรูมันนี่", description: "อั่งเปา TrueMoney", color: "#e53935", tag: "True" },
];

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

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
        className="bg-card border border-border rounded-2xl p-10 text-center neon-border"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 glow-accent"
        >
          <Check className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-1 text-glow">ส่งสำเร็จแล้ว!</h2>
        <p className="text-sm text-muted-foreground mb-6">ขอบคุณที่โดเนทให้ streamer นะครับ ❤️</p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 text-sm text-primary border border-primary/30 hover:bg-primary/10 px-6 py-2.5 rounded-full transition-all"
        >
          โดเนทอีกครั้ง
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Step 1: Message */}
      <StepCard step={1} title="กรอกข้อความที่ต้องการบอก">
        <div className="space-y-3">
          <InputField
            label="ชื่อของคุณ"
            required
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="เช่น คุณน้องชาย"
          />
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">ข้อความ (ไม่บังคับ)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="พิมพ์ข้อความที่อยากฝากถึง streamer..."
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder-muted-foreground/50 resize-none"
            />
          </div>
          {selectedSticker && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
              <span className="text-2xl">{selectedSticker.emoji}</span>
              <div>
                <p className="text-xs text-foreground font-medium">{selectedSticker.name}</p>
                <p className="text-[11px] text-primary">+฿{selectedSticker.price} สติ๊กเกอร์</p>
              </div>
            </div>
          )}
        </div>
      </StepCard>

      {/* Step 2: Payment */}
      <StepCard step={2} title="เลือกช่องทางและจำนวนเงิน">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id)}
              className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                paymentMethod === pm.id
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-secondary/30 hover:border-primary/20"
              }`}
            >
              <span
                className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-md mb-2"
                style={{ background: pm.color }}
              >
                {pm.tag}
              </span>
              <span className={`text-xs font-medium ${paymentMethod === pm.id ? "text-primary" : "text-foreground"}`}>
                {pm.label}
              </span>
              <span className="text-[11px] text-muted-foreground leading-snug mt-0.5">{pm.description}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex flex-col sm:flex-row gap-5">
            {paymentMethod === "promptpay" && (
              <div className="flex flex-col items-center gap-2 sm:w-36 flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-2 border border-border">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 text-center px-2">QR Code<br />พร้อมเพย์</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">สแกน QR พร้อมเพย์</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-full transition-colors"
                >
                  <Download className="w-3 h-3" /> บันทึก QR
                </button>
              </div>
            )}

            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  จำนวนเงิน (บาท) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={handleAmountInput}
                  required
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-xl font-heading font-bold text-primary bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {QUICK_AMOUNTS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleQuickAmount(v)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        amount === v
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/20"
                      }`}
                    >
                      ฿{v}
                    </button>
                  ))}
                </div>
              </div>

              {selectedSticker && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border">
                  <span className="text-xs text-muted-foreground">รวมสติ๊กเกอร์</span>
                  <span className="text-sm font-semibold text-primary">฿{totalAmount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 3: Slip Upload */}
      <StepCard step={3} title="แนบสลิปการโอนเงิน">
        {slipPreview ? (
          <div className="relative">
            <img
              src={slipPreview}
              alt="slip preview"
              className="w-full max-h-64 object-contain rounded-xl border border-border"
            />
            <button
              type="button"
              onClick={() => { setSlipFile(null); setSlipPreview(null); }}
              className="absolute top-2 right-2 bg-card border border-border rounded-full w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
              isDragging
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-secondary/30"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">คลิกหรือลากสลิปมาวางที่นี่</p>
            <p className="text-xs text-muted-foreground">PNG, JPG (ต้องมี QR Code)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <motion.button
          type="submit"
          disabled={isSubmitting || !donorName || !slipFile}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium text-sm py-3.5 px-6 rounded-full transition-all glow-primary"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * step }}
      className="bg-card border border-border rounded-2xl p-5 neon-border"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white bg-gradient-to-r from-primary to-pink-500 flex-shrink-0">
          {step}
        </span>
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

function InputField({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type="text"
        required={required}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder-muted-foreground/50"
        {...props}
      />
    </div>
  );
}