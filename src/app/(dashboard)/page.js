"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, Link as LinkIcon, Copy, ExternalLink } from 'lucide-react';
import StatCard from '@/components/dashboard/main/StatCard';
import DonationChart from '@/components/dashboard/main/DonationChart';
import RecentDonations from '@/components/dashboard/main/RecentDonations';
import VisitsWidget from '@/components/dashboard/main/VisitsWidget';
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
    <div className="w-full h-full">
      <div className="space-y-6 px-0 sm:px-1">
        {/* Quick Link Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-4 md:p-5"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 flex-shrink-0">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">Your Donate Page</h3>
                <p className="text-slate-400 text-sm truncate">Share this link with your audience</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none min-w-0 bg-slate-800/80 border border-slate-700/50 rounded-xl px-3 py-2">
                <span className="text-cyan-400 text-sm font-mono truncate block">
                  {donateLink}
                </span>
              </div>
              <Button
                onClick={copyLink}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 whitespace-nowrap"
              >
                <Copy className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
          <div className="sm:col-span-2 lg:col-span-1">
            <VisitsWidget />
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-2 min-w-0 overflow-hidden">
            <DonationChart />
          </div>
          <div className="xl:col-span-1 min-w-0 overflow-hidden">
            <RecentDonations />
          </div>
        </div>
      </div>
    </div>
  );
}