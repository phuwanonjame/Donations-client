"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, Link as LinkIcon, Copy, ExternalLink } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DonationChart from '../components/dashboard/DonationChart';
import RecentDonations from '../components/dashboard/RecentDonations';
import VisitsWidget from '../components/dashboard/VisitsWidget';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const donateLink = 'easydonate.app/creator';

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${donateLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Link Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Your Donate Page</h3>
              <p className="text-slate-400 text-sm">Share this link with your audience</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
              <span className="text-cyan-400 text-sm font-mono truncate">{donateLink}</span>
            </div>
            <Button
              onClick={copyLink}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Earnings"
          value="฿0.00"
          subtitle="All time revenue"
          icon={Wallet}
          gradient="from-cyan-500 to-blue-500"
          delay={0}
        />
        <StatCard
          title="Earnings Today"
          value="฿0.00"
          subtitle="Since midnight"
          icon={TrendingUp}
          gradient="from-purple-500 to-pink-500"
          delay={0.1}
        />
        <div className="md:col-span-2 lg:col-span-1">
          <VisitsWidget />
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DonationChart />
        </div>
        <div className="xl:col-span-1">
          <RecentDonations />
        </div>
      </div>
    </div>
  );
}