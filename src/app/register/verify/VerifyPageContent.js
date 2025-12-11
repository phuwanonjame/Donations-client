'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { verifyOtpService, requestOtpService, checkVerifiedService } from "../../services/authService/authService";

// Custom Button
const CustomButton = ({ children, className = '', variant = 'primary', size = 'default', ...props }) => {
  const baseClasses = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center";
  let sizeClasses = size === 'lg' ? "px-8 py-4 text-lg" : "px-4 py-2 text-base";

  let variantClasses;
  if (variant === 'primary') {
    variantClasses =
      "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628] shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50";
  } else if (variant === 'outline') {
    variantClasses =
      "border border-gray-600 text-gray-300 hover:text-white hover:bg-white/5 hover:border-cyan-500";
  } else if (variant === 'link') {
    variantClasses = "text-cyan-400 hover:text-cyan-300 bg-transparent shadow-none p-0";
  }

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------ เช็ค verify ------------------
  useEffect(() => {
    if (!email) return;

    const checkVerified = async () => {
      const data = await checkVerifiedService(email);
      if (data.success && data.data.isVerified) {
        alert("Your account is already verified. Redirecting to login...");
        router.replace("/login");
      }
    };

    checkVerified();
  }, [email, router]);

  // ------------------ Verify OTP ------------------
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyOtpService({ email, otp });
    setLoading(false);

    if (!res.success) {
      alert(res.data.message || "OTP incorrect");
      return;
    }

    alert("Verify success!");
    router.push("/login");
  };

  // ------------------ Resend OTP ------------------
  const handleResend = async () => {
    const res = await requestOtpService({ email });
    alert(res.data.message || "OTP sent again");
  };

  const particleVariants = {
    animate: {
      y: [-20, 20, -20],
      opacity: [0.2, 0.8, 0.2],
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628] p-4 sm:p-8">

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-1 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-blue-700/30 shadow-2xl shadow-cyan-500/10">
          <div className="bg-[#0D1B2A] rounded-2xl p-6 sm:p-8 space-y-6">

            {/* Header */}
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-gray-400 text-sm">
                We sent an OTP verification code to:
                <br />
                <span className="text-cyan-400">{email}</span>
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl"
                  required
                />
              </div>

              <CustomButton
                type="submit"
                size="lg"
                className={`w-full ${loading ? 'opacity-60 cursor-not-allowed' : 'group'}`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </CustomButton>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-gray-500">Didn't receive OTP? </span>
              <CustomButton variant="link" className="text-sm" onClick={handleResend}>
                Resend OTP
              </CustomButton>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
