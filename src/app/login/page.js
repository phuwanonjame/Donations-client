'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { loginService } from "@/app/services/authService/authService";   // <-- เพิ่มอันนี้

// Mock Translation Context
const t = {
  login: {
    title: "Welcome Back, Creator",
    subtitle: "Log in to access your dashboard and manage your custom alerts.",
    emailLabel: "Email or Username",
    passwordLabel: "Password",
    forgotPassword: "Forgot Password?",
    loginButton: "Sign In Securely",
    orSeparator: "",
    signupPrompt: "Don't have an account?",
    signUpLink: "Create Account"
  }
};

const CustomButton = ({ children, className = '', variant = 'primary', size = 'default', ...props }) => {
  const base = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center";
  let sizeClasses = size === 'lg' ? "px-8 py-4 text-lg" : "px-4 py-2 text-base";

  const types = {
    primary: "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628]",
    outline: "border border-gray-600 text-gray-300 hover:text-white hover:bg-white/5",
    link: "text-cyan-400 hover:text-cyan-300 bg-transparent p-0"
  };

  return (
    <button className={`${base} ${sizeClasses} ${types[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------
  // 🔥 HANDLE LOGIN + CALL API
  // ---------------------------------
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const res = await loginService(email, password);
        setIsLoading(false);

        // 🔥 DEBUG STEP: ตรวจสอบผลลัพธ์ที่ซ้อนกัน
        console.log("Full API Response Object:", res);
        
        // 🌟 แก้ไขการเข้าถึง Token ให้ถูกต้องตามโครงสร้างที่ซ้อนกัน
        const token = res?.data?.data?.token; 
        
        // ตรวจสอบสถานะความสำเร็จของ Inner Response
        const innerSuccess = res?.data?.success; 
        const innerMessage = res?.data?.message; 

        if (!innerSuccess) {
          // ใช้ innerMessage ในการแสดงข้อผิดพลาด
          if (innerMessage === "Email not verified") {
            alert("Your email is not verified yet. Please verify your email first.");
            window.location.href = `/register/verify?email=${email}`;
            return;
          }

          alert(innerMessage || "Login failed");
          return;
        }

        // ตรวจสอบว่ามี Token หรือไม่
        if (!token) {
            console.error("Token is missing in the API response data.");
            alert("Login success, but token was not provided by the server. Check Back-end response structure.");
            return;
        }

        // 🌟 บันทึก token ใน cookie (ใช้ตัวแปร token ที่ถูกต้อง)
        const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const secureFlag = isLocalhost ? '' : 'Secure;';
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); 

        document.cookie = `token=${token}; path=/; SameSite=Strict; Expires=${expirationDate.toUTCString()}; ${secureFlag}`;

        alert("Login success! Token saved.");
        window.location.href = "/dashboard/Dashboard";

    } catch (error) {
        setIsLoading(false);
        alert(error.message || "Login failed due to API error or network issue.");
    }
};

  const particleVariants = {
    animate: { y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628] p-4 sm:p-8">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
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

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative z-10 w-full max-w-md">
        <div className="p-1 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-blue-700/30 shadow-2xl">
          <div className="bg-[#0D1B2A] rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white mb-2">{t.login.title}</h2>
              <p className="text-gray-400 text-sm">{t.login.subtitle}</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">{t.login.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    type="text"
                    value={email}
                    placeholder='SrtamDOnate@ex.com'
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="password">{t.login.passwordLabel}</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="password"
                    type="password"
                    placeholder='************'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                </div>
              </div>

              <CustomButton type="submit" size="lg" className={`w-full ${isLoading ? 'opacity-60 cursor-not-allowed' : 'group'}`} disabled={isLoading}>
                {isLoading ? "Loading..." : <> {t.login.loginButton} <ArrowRight className="ml-2 w-5 h-5" /> </>}
              </CustomButton>
            </form>

            <div className="text-center text-sm mt-6">
              <span className="text-gray-500">{t.login.signupPrompt} </span>
              <Link href="/register">
                <CustomButton variant="link" className="text-sm">{t.login.signUpLink}</CustomButton>
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
