

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          <p className="text-cyan-400 font-bold">{payload[0].value.toLocaleString()} ฿</p>
        </div>
      );
    }
    return null;
  };
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyData = [
  { name: 'Mon', amount: 0 },
  { name: 'Tue', amount: 0 },
  { name: 'Wed', amount: 0 },
  { name: 'Thu', amount: 0 },
  { name: 'Fri', amount: 0 },
  { name: 'Sat', amount: 0 },
  { name: 'Sun', amount: 0 },
];

const monthlyData = [
  { name: 'Jan', amount: 0 },
  { name: 'Feb', amount: 0 },
  { name: 'Mar', amount: 0 },
  { name: 'Apr', amount: 0 },
  { name: 'May', amount: 0 },
  { name: 'Jun', amount: 0 },
];

const yearlyData = [
  { name: '2020', amount: 0 },
  { name: '2021', amount: 0 },
  { name: '2022', amount: 0 },
  { name: '2023', amount: 0 },
  { name: '2024', amount: 0 },
  { name: '2025', amount: 0 },
];

export default function DonationChart() {
  const [timeframe, setTimeframe] = useState('daily');
  
  const getData = () => {
    switch(timeframe) {
      case 'monthly': return monthlyData;
      case 'yearly': return yearlyData;
      default: return dailyData;
    }
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Donation History</h3>
          <p className="text-slate-500 text-sm">Track your earnings over time</p>
        </div>
        
        <div className="flex bg-slate-800/80 rounded-xl p-1">
          {['daily', 'monthly', 'yearly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                timeframe === tf 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}฿`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#00d4ff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}