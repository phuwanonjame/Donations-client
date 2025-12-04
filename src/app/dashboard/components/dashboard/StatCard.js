import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-20 blur-3xl rounded-full transform translate-x-8 -translate-y-8`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-sm font-medium">{title}</span>
          {Icon && (
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-slate-500 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}