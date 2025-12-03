'use client';
import React from 'react';
import { motion } from "framer-motion";
import { Bell, Shield, BarChart3, Palette, ChevronRight } from "lucide-react";
import  {useLanguage}  from '../../contexts/LanguageContext';

const featureIcons = [Bell, Shield, BarChart3, Palette];
const featureColors = [
  { color: "from-cyan-500 to-cyan-400", shadowColor: "shadow-cyan-500/20" },
  { color: "from-green-500 to-emerald-400", shadowColor: "shadow-green-500/20" },
  { color: "from-violet-500 to-purple-400", shadowColor: "shadow-violet-500/20" },
  { color: "from-orange-500 to-amber-400", shadowColor: "shadow-orange-500/20" },
];

function FeaturePreview({ index, t }) {
  if (index === 0) {
    return (
      <div className="relative mt-4 p-4 bg-[#0D1B2A] rounded-xl border border-cyan-500/20">
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-lg border border-cyan-500/30"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-sm">
            💎
          </div>
          <div className="flex-1">
            <p className="text-cyan-400 font-semibold text-sm">{t.features.items[0].alertTitle}</p>
            <p className="text-gray-400 text-xs">{t.features.items[0].alertDesc}</p>
          </div>
          <div className="text-cyan-400 font-bold">+$10</div>
        </motion.div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="mt-4 flex items-center justify-center gap-4">
        {[
          { name: 'PayPal', bg: 'bg-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400' },
          { name: 'Stripe', bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400' },
          { name: 'Bank', bg: 'bg-green-600/20', border: 'border-green-500/30', text: 'text-green-400' },
        ].map((method) => (
          <motion.div
            key={method.name}
            whileHover={{ y: -4 }}
            className={`px-4 py-3 rounded-xl ${method.bg} border ${method.border} ${method.text} text-xs font-medium`}
          >
            {method.name}
          </motion.div>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="mt-4 p-4 bg-[#0D1B2A] rounded-xl border border-violet-500/20">
        <div className="flex items-end gap-2 h-20">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-1 bg-gradient-to-t from-violet-500 to-purple-400 rounded-t"
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-gray-500 text-xs">
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 flex flex-wrap gap-2 justify-center">
      {['#00D4FF', '#9147FF', '#FF6B6B', '#FFD93D', '#6BCB77'].map((color) => (
        <motion.div
          key={color}
          whileHover={{ scale: 1.2 }}
          className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 ring-offset-[#0D1B2A] ring-transparent hover:ring-white/30 transition-all"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const { t } = useLanguage();
  return (
    <section id="features" className="relative py-32 bg-[#0A1628] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            {t.features.badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.features.title1}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              {t.features.title2}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {t.features.items.map((feature, index) => {
            const Icon = featureIcons[index];
            const colors = featureColors[index];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${colors.color} rounded-3xl opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500`} />
                
                <div className="relative h-full p-8 bg-[#1E3A5F]/30 backdrop-blur-sm rounded-3xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-500">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${colors.color} ${colors.shadowColor} shadow-lg mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Preview */}
                  <FeaturePreview index={index} t={t} />

                  {/* Learn More Link */}
                  <a href="#" className="inline-flex items-center gap-1 mt-6 text-cyan-400 font-medium text-sm hover:text-cyan-300 transition-colors group/link">
                    {t.features.learnMore}
                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}