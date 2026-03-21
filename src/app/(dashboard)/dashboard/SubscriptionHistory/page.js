"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Clock, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const plans = [
  { name: 'Free', price: 0, color: 'from-slate-500 to-slate-600' },
  { name: 'Pro', price: 199, color: 'from-cyan-500 to-blue-500' },
  { name: 'Business', price: 499, color: 'from-purple-500 to-pink-500' },
  { name: 'Enterprise', price: 999, color: 'from-amber-500 to-orange-500' },
];

const subscriptionHistory = [
  {
    id: 1,
    plan: 'Pro',
    price: 199,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'cancelled',
  },
  {
    id: 2,
    plan: 'Free',
    price: 0,
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    status: 'completed',
  },
];

const statusConfig = {
  active: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  completed: { icon: CheckCircle, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  pending: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
};

export default function SubscriptionHistory() {
  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="relative p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Current Plan</h2>
                <p className="text-slate-400 text-sm">Manage your subscription</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600">
                  <span className="text-3xl font-bold text-white">F</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Free Plan</h3>
                  <p className="text-slate-400">฿0/month</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      Current
                    </Badge>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="border-t border-slate-700/50 p-6">
          <h4 className="text-white font-semibold mb-4">Available Plans</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  plan.name === 'Free' 
                    ? 'bg-slate-800/80 border-cyan-500/30' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                  <span className="text-white font-bold">{plan.name[0]}</span>
                </div>
                <h5 className="text-white font-semibold">{plan.name}</h5>
                <p className="text-slate-400 text-sm">
                  {plan.price === 0 ? 'Free' : `฿${plan.price}/mo`}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Subscription History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Subscription History</h2>
              <p className="text-slate-400 text-sm">View your past subscriptions and payments</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Plan Name</TableHead>
                <TableHead className="text-slate-400 font-medium">Price</TableHead>
                <TableHead className="text-slate-400 font-medium">Start Date</TableHead>
                <TableHead className="text-slate-400 font-medium">End Date</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-white font-medium mb-1">No subscription history</p>
                      <p className="text-slate-500 text-sm">Your subscription history will appear here</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                subscriptionHistory.map((sub, index) => {
                  const status = statusConfig[sub.status];
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                            plans.find(p => p.name === sub.plan)?.color || 'from-slate-500 to-slate-600'
                          } flex items-center justify-center`}>
                            <span className="text-white text-sm font-bold">{sub.plan[0]}</span>
                          </div>
                          <span className="text-white font-medium">{sub.plan}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {sub.price === 0 ? 'Free' : `฿${sub.price}`}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(sub.startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(sub.endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.bg} ${status.color} ${status.border} border capitalize`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {sub.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}