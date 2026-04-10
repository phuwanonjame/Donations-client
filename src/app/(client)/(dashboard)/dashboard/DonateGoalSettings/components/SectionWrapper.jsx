// components/SectionWrapper.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function SectionWrapper({ children, delay = 0, className = "", title, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={`
        rounded-2xl 
        bg-gradient-to-br from-slate-800/50 to-slate-900/50 
        border border-slate-700/50 
        backdrop-blur-xl 
        p-4 sm:p-5 md:p-6 
        transition-all duration-300 
        hover:border-slate-600/50 
        hover:shadow-xl 
        hover:shadow-emerald-500/5
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4 sm:mb-5 md:mb-6">
          {icon && <div className="text-emerald-400">{icon}</div>}
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {title}
          </h3>
        </div>
      )}
      {children}
    </motion.div>
  );
}