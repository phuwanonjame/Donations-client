import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock } from 'lucide-react';

function formatRelativeTime(value) {
  if (!value) {
    return '-';
  }

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function RecentDonations({ donations = [] }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Donates</h3>
          <p className="text-slate-500 text-sm">Latest supporter activity</p>
        </div>
        <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">
          View All
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-slate-500" />
          </div>
          <h4 className="text-white font-medium mb-2">No donations yet</h4>
          <p className="text-slate-500 text-sm max-w-xs">
            Share your donate page link to start receiving support from your community
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {(donation.donorName || 'A')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{donation.donorName || 'Anonymous'}</p>
                <p className="text-slate-500 text-sm truncate">{donation.donorMessage || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-bold">{Number(donation.amount || 0).toLocaleString('th-TH')} ฿</p>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(donation.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
