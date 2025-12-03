'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useLanguage } from '../../contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628] pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm font-medium">{t.hero.badge}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          {t.hero.headline1}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400">
            {t.hero.headline2}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t.hero.subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628] font-bold px-8 py-6 text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
          >
            {t.hero.startTrial}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/5 hover:border-gray-500 px-8 py-6 text-lg"
          >
            <Play className="mr-2 w-5 h-5" />
            {t.hero.watchDemo}
          </Button>
        </motion.div>

        {/* Social Sign-up Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-gray-500 text-sm">{t.hero.signUpWith}</span>
          <div className="flex items-center gap-4">
            <button className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-[#9147FF]/10 border border-[#9147FF]/30 hover:bg-[#9147FF]/20 hover:border-[#9147FF]/50 transition-all">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#9147FF">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
              </svg>
              <span className="text-[#9147FF] font-medium group-hover:text-[#A970FF] transition-colors">Twitch</span>
            </button>
            <button className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-red-500 font-medium group-hover:text-red-400 transition-colors">YouTube</span>
            </button>
          </div>
        </motion.div>

        {/* Live Alert Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            {/* Browser Frame */}
            <div className="bg-[#1E3A5F]/50 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-1 shadow-2xl shadow-cyan-500/10">
              <div className="bg-[#0D1B2A] rounded-xl overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0A1628] border-b border-gray-700/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-[#1E3A5F]/50 text-gray-400 text-xs">
                      dashboard.streamflow.io
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Preview */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-3 w-32 bg-gray-700/50 rounded" />
                      <div className="h-6 w-48 bg-cyan-500/20 rounded" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-10 w-24 bg-[#1E3A5F] rounded-lg" />
                      <div className="h-10 w-24 bg-cyan-500/30 rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Donation Alert Pop-up */}
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      boxShadow: [
                        '0 0 20px rgba(0,212,255,0.3)',
                        '0 0 40px rgba(0,212,255,0.5)',
                        '0 0 20px rgba(0,212,255,0.3)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-6 min-w-[280px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                        🎉
                      </div>
                      <div>
                        <p className="text-cyan-400 font-bold text-lg">{t.hero.donationAlert.user}</p>
                        <p className="text-white text-sm">{t.hero.donationAlert.donated} <span className="text-cyan-300 font-bold">$25.00</span></p>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-300 text-sm italic">"{t.hero.donationAlert.message}"</p>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 rounded-3xl blur-2xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}