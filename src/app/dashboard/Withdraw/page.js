"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownToLine, Clock, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const balance = 0;
  const minWithdraw = 100;
  const pendingWithdrawals = [];

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Available Balance</p>
              <h2 className="text-4xl font-bold text-white">฿{balance.toLocaleString()}</h2>
              <p className="text-slate-500 text-sm mt-1">Minimum withdrawal: ฿{minWithdraw}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-slate-400 text-xs">Receiving Account</p>
              <p className="text-white font-medium">Not configured</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Withdraw Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <ArrowDownToLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Request Withdrawal</h2>
            <p className="text-slate-400 text-sm">Transfer funds to your bank account</p>
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Withdrawal Amount (฿)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">฿</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8 bg-slate-800/80 border-slate-700 text-white text-lg placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-2 mt-3">
              {[100, 500, 1000, 'All'].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset === 'All' ? balance.toString() : preset.toString())}
                  className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  {preset === 'All' ? 'All' : `฿${preset}`}
                </Button>
              ))}
            </div>
          </div>

          {balance < minWithdraw && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-amber-200 text-sm">
                You need at least ฿{minWithdraw} to make a withdrawal. Current balance: ฿{balance}
              </p>
            </div>
          )}

          <Button
            disabled={balance < minWithdraw || !amount || Number(amount) < minWithdraw}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            Request Withdrawal
          </Button>

          <p className="text-slate-500 text-xs text-center">
            Withdrawals are processed within 1-3 business days
          </p>
        </div>
      </motion.div>

      {/* Pending Withdrawals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pending Withdrawals</h2>
            <p className="text-slate-400 text-sm">Track your withdrawal requests</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-slate-500" />
          </div>
          <h4 className="text-white font-medium mb-2">No pending withdrawals</h4>
          <p className="text-slate-500 text-sm max-w-xs">
            Your withdrawal requests will appear here
          </p>
        </div>
      </motion.div>
    </div>
  );
}