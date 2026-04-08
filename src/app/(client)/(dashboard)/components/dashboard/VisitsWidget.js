import React from 'react';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, ExternalLink } from 'lucide-react';

export default function VisitsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm font-medium">Donate Page Visits</span>
        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
          <Eye className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">0</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>0%</span>
            </div>
            <span className="text-slate-500 text-sm">vs last week</span>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white text-sm transition-all duration-300">
          <ExternalLink className="w-4 h-4" />
          View Page
        </button>
      </div>
    </motion.div>
  );
}