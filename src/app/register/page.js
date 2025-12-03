'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, User, Sparkles } from "lucide-react";

// Mock Translation
const t = {
  register: {
    title: "Create Your Account",
    subtitle: "Start your journey and manage your alerts with your new dashboard.",
    nameLabel: "Full Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    registerButton: "Create Account",
    haveAccount: "Already have an account?",
    loginLink: "Sign In",
    orSeparator: "OR CONTINUE WITH",
    twitchButton: "Twitch",
    youtubeButton: "YouTube",
  }
};

// Custom Button
const CustomButton = ({ children, className = '', variant = 'primary', size = 'default', ...props }) => {
  const baseClasses = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center";
  
  let sizeClasses = "px-4 py-2 text-base";
  if (size === 'lg') sizeClasses = "px-8 py-4 text-lg";

  let variantClasses;
  if (variant === 'primary') {
    variantClasses = "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628] shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50";
  } else if (variant === 'outline') {
    variantClasses = "border border-gray-600 text-gray-300 hover:text-white hover:bg-white/5 hover:border-cyan-500";
  } else if (variant === 'link') {
    variantClasses = "text-cyan-400 hover:text-cyan-300 bg-transparent shadow-none p-0";
  }

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Registering with:', form);
      setIsLoading(false);
    }, 1500);
  };

  const particleVariants = {
    animate: {
      y: [-20, 20, -20],
      opacity: [0.2, 0.8, 0.2],
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628] p-4 sm:p-8">
      
      {/* Floating Background */}
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-1 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-blue-700/30 shadow-2xl shadow-cyan-500/10">
          <div className="bg-[#0D1B2A] rounded-2xl p-6 sm:p-8 space-y-8">
            
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {t.register.title}
              </h2>
              <p className="text-gray-400 text-sm">{t.register.subtitle}</p>
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3">
              <button className="group flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl bg-[#9147FF]/10 border border-[#9147FF]/30 hover:bg-[#9147FF]/20 hover:border-[#9147FF]/50 transition-all">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#9147FF">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                </svg>
                <span className="text-[#9147FF] font-medium text-base">{t.register.twitchButton}</span>
              </button>
              <button className="group flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-red-500 font-medium text-base">{t.register.youtubeButton}</span>
              </button>
            </div>

            {/* Separator */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-700/50" />
              <span className="flex-shrink mx-4 text-gray-500 text-sm">{t.register.orSeparator}</span>
              <div className="flex-grow border-t border-gray-700/50" />
            </div>

            {/* Register Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.register.nameLabel}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl focus:ring-1 focus:ring-cyan-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.register.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl focus:ring-1 focus:ring-cyan-400"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.register.passwordLabel}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl focus:ring-1 focus:ring-cyan-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.register.confirmPasswordLabel}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1E3A5F]/50 border border-gray-700/50 text-white rounded-xl focus:ring-1 focus:ring-cyan-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <CustomButton
                type="submit"
                size="lg"
                className={`w-full ${isLoading ? 'opacity-60 cursor-not-allowed' : 'group'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-[#0A1628]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4..." />
                  </svg>
                ) : (
                  <>
                    {t.register.registerButton}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </CustomButton>

            </form>

            {/* Already have account */}
            <div className="text-center text-sm mt-6">
              <span className="text-gray-500">{t.register.haveAccount} </span>
              <CustomButton variant="link" className="text-sm">
                {t.register.loginLink}
              </CustomButton>
            </div>
          
          </div>
        </div>
      </motion.div>
    </section>
  );
}
