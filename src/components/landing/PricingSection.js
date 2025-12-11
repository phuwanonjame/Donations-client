'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown, Star, ArrowRight } from "lucide-react";
import { useLanguage } from '../../contexts/LanguageContext';

const planIcons = [Zap, Sparkles, Crown, Star];

const planStyles = [
  { color: "from-gray-500 to-gray-400", borderColor: "border-gray-600/30", highlighted: false },
  { color: "from-cyan-500 to-cyan-400", borderColor: "border-cyan-500/50", highlighted: false },
  { color: "from-amber-500 to-orange-400", borderColor: "border-amber-500/30", highlighted: false },
  { color: "from-purple-500 to-fuchsia-400", borderColor: "border-purple-500/30", highlighted: true },
];

const planPrices = ["Free", "฿49", "฿199", "฿399"];
const planFees   = ["5% Fee", "3% Fee", "1% Fee", "0% Fee"];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="pricing" className="relative py-32 bg-gradient-to-b from-[#0A1628] via-[#0D1B2A] to-[#0A1628] overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            {t.pricing.badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.pricing.title1}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">{t.pricing.title2}</span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            {t.pricing.subtitle}
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-[#1E3A5F]/50 border border-cyan-500/20">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-cyan-500 text-[#0A1628]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.pricing.monthly}
            </button>

            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isAnnual 
                  ? 'bg-cyan-500 text-[#0A1628]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.pricing.annual}
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                {t.pricing.save}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-8">
          {t.pricing.plans.map((plan, index) => {
            const Icon = planIcons[index];
            const style = planStyles[index];
            const price = planPrices[index];
            const fee = planFees[index];

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative group ${style.highlighted ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >

                {/* Highlight glow */}
                {style.highlighted && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                )}

                <div
                  className={`relative h-full p-8 rounded-3xl border flex flex-col ${style.borderColor} ${
                    style.highlighted
                      ? 'bg-gradient-to-b from-[#1E3A5F]/80 to-[#0D1B2A]/90 backdrop-blur-xl'
                      : 'bg-[#1E3A5F]/30 backdrop-blur-sm'
                  } transition-all duration-300 hover:border-cyan-500/50`}
                >

                  {/* Badge */}
                  {style.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-[#0A1628] text-sm font-bold shadow-lg shadow-cyan-500/30">
                        {t.pricing.mostPopular}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${style.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-white">
                        {price === 'Free'
                          ? price
                          : isAnnual
                            ? `฿${parseInt(price.slice(1)) * 10}`
                            : price}
                      </span>
                      {price !== 'Free' && (
                        <span className="text-gray-400">{isAnnual ? t.pricing.year : t.pricing.month}</span>
                      )}
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-cyan-400 font-bold">{fee}</span>
                      <span className="text-gray-400 text-sm">{t.pricing.perDonation}</span>
                    </div>
                  </div>

                  {/* Features – FLEX GROW เพื่อดันปุ่มลงล่าง */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${style.color} flex items-center justify-center mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button – ตำแหน่งเท่ากันทุแพลน */}
                  <Button
                    className={`w-full py-6 font-semibold text-lg group/btn ${
                      style.highlighted
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628] shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                        : 'bg-white/5 border border-gray-600 text-white hover:bg-white/10 hover:border-gray-500'
                    } transition-all`}
                  >
                    {price === 'Free' ? t.pricing.startFree : t.pricing.choosePlan}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-6">{t.pricing.trust}</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {t.pricing.badges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
