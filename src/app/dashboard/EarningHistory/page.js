"use client";
// ==== CustomTooltip ต้องอยู่นอก Component หลัก ====
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-cyan-400 font-bold">
          ฿{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp, Calendar, Download, Filter, Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', earnings: 0 },
  { month: 'Feb', earnings: 0 },
  { month: 'Mar', earnings: 0 },
  { month: 'Apr', earnings: 0 },
  { month: 'May', earnings: 0 },
  { month: 'Jun', earnings: 0 },
];

const transactions = [];

export default function EarningHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50
          border border-slate-700/50 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Total Earnings</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">฿0.00</h3>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-slate-500">All time</span>
          </div>
        </motion.div>

        {/* card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50
          border border-slate-700/50 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">This Month</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">฿0.00</h3>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">0%</span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </motion.div>

        {/* card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50
          border border-slate-700/50 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Total Donations</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <History className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">0</h3>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-slate-500">Transactions</span>
          </div>
        </motion.div>
      </div>

      {/* Monthly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50
        border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
            <p className="text-slate-500 text-sm">Earnings breakdown by month</p>
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
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
                tickFormatter={(value) => `฿${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="earnings"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50
        border border-slate-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Transaction History</h3>
              <p className="text-slate-500 text-sm">All your earnings and withdrawals</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search transactions..."
                  className="pl-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 w-full sm:w-64"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-800/80 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Types</SelectItem>
                  <SelectItem value="donation" className="text-white hover:bg-slate-700">Donations</SelectItem>
                  <SelectItem value="withdrawal" className="text-white hover:bg-slate-700">Withdrawals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Description</TableHead>
                <TableHead className="text-slate-400 font-medium">Date</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                        <History className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-white font-medium mb-1">No transactions yet</p>
                      <p className="text-slate-500 text-sm">Your earning history will appear here</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell>
                      <Badge className={tx.type === 'donation'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{tx.description}</TableCell>
                    <TableCell className="text-slate-400">{tx.date}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      tx.type === 'donation' ? 'text-emerald-400' : 'text-blue-400'
                    }`}>
                      {tx.type === 'donation' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
