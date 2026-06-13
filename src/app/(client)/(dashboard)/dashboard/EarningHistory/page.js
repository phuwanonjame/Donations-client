"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  Download,
  Filter,
  History,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchDonationHistory } from "@/actions/Donationsapi/donationHistoryApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
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

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-xl">
        <p className="mb-1 text-xs text-slate-400">{label}</p>
        <p className="font-bold text-cyan-400">฿{payload[0].value.toLocaleString("th-TH")}</p>
      </div>
    );
  }
  return null;
};

function formatPrice(value, currency = "THB") {
  const amount = Number(value || 0);
  const formatted = amount.toLocaleString("th-TH", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return currency === "THB" ? `฿${formatted}` : `${formatted} ${currency}`;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getMonthKey(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getStatusBadgeClass(status) {
  if (status === "COMPLETED") {
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  }

  if (status === "PENDING") {
    return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  }

  return "bg-rose-500/20 text-rose-400 border-rose-500/30";
}

export default function EarningHistory() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const earningHistoryUserId = user?.id;

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (isAuthLoading) {
        setIsLoading(true);
        return;
      }

      if (!earningHistoryUserId) {
        setHistory([]);
        setHistoryError("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHistoryError("");

      const result = await fetchDonationHistory(earningHistoryUserId);

      if (!active) {
        return;
      }

      if (!result.length) {
        setHistory([]);
        setHistoryError("ยังไม่สามารถโหลดประวัติรายรับได้ในตอนนี้");
        setIsLoading(false);
        return;
      }

      const sortedHistory = [...result].sort(
        (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
      );

      setHistory(sortedHistory);
      setIsLoading(false);
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, [earningHistoryUserId, isAuthLoading]);

  const completedDonations = useMemo(
    () => history.filter((item) => item?.status === "COMPLETED"),
    [history]
  );

  const filteredTransactions = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item?.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.donorMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        item?.status?.toLowerCase() === filterType.toLowerCase() ||
        item?.paymentMethod?.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [filterType, history, searchTerm]);

  const totalEarnings = useMemo(
    () => completedDonations.reduce((sum, item) => sum + Number(item?.amount || 0), 0),
    [completedDonations]
  );

  const thisMonthEarnings = useMemo(() => {
    const now = new Date();
    return completedDonations
      .filter((item) => {
        const createdAt = new Date(item?.createdAt);
        return (
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, item) => sum + Number(item?.amount || 0), 0);
  }, [completedDonations]);

  const lastMonthEarnings = useMemo(() => {
    const now = new Date();
    const targetMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const targetYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    return completedDonations
      .filter((item) => {
        const createdAt = new Date(item?.createdAt);
        return (
          createdAt.getMonth() === targetMonth &&
          createdAt.getFullYear() === targetYear
        );
      })
      .reduce((sum, item) => sum + Number(item?.amount || 0), 0);
  }, [completedDonations]);

  const monthGrowthPercent = useMemo(() => {
    if (lastMonthEarnings === 0) {
      return thisMonthEarnings > 0 ? 100 : 0;
    }

    return ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
  }, [lastMonthEarnings, thisMonthEarnings]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthBuckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
        earnings: 0,
      };
    });

    const map = new Map(monthBuckets.map((item) => [item.key, item]));

    completedDonations.forEach((item) => {
      const key = getMonthKey(item?.createdAt);
      const bucket = map.get(key);
      if (bucket) {
        bucket.earnings += Number(item?.amount || 0);
      }
    });

    return monthBuckets;
  }, [completedDonations]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Earnings</span>
            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatPrice(totalEarnings)}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-slate-500">All time</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">This Month</span>
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatPrice(thisMonthEarnings)}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400">{monthGrowthPercent.toFixed(0)}%</span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Donations</span>
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-2">
              <History className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">{completedDonations.length}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-slate-500">Completed transactions</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
            <p className="text-sm text-slate-500">Earnings breakdown by month</p>
          </div>
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                fontSize={12}
                stroke="#64748b"
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                fontSize={12}
                stroke="#64748b"
                tickFormatter={(value) => `฿${value}`}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="earnings" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl"
      >
        <div className="border-b border-slate-700/50 p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Transaction History</h3>
              <p className="text-sm text-slate-500">All your completed and pending donation history</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search donor or message..."
                  className="w-full border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 sm:w-64"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full border-slate-700 bg-slate-800/80 text-white sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Status</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-slate-700">Completed</SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-slate-700">Pending</SelectItem>
                  <SelectItem value="failed" className="text-white hover:bg-slate-700">Failed</SelectItem>
                  <SelectItem value="promptpay" className="text-white hover:bg-slate-700">PromptPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {historyError && !isLoading && (
            <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              {historyError}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-transparent">
                <TableHead className="font-medium text-slate-400">Donor</TableHead>
                <TableHead className="font-medium text-slate-400">Message</TableHead>
                <TableHead className="font-medium text-slate-400">Method</TableHead>
                <TableHead className="font-medium text-slate-400">Status</TableHead>
                <TableHead className="font-medium text-slate-400">Date</TableHead>
                <TableHead className="text-right font-medium text-slate-400">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-slate-300">
                    กำลังโหลดประวัติรายรับ...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                        <History className="h-8 w-8 text-slate-500" />
                      </div>
                      <p className="mb-1 font-medium text-white">No transactions yet</p>
                      <p className="text-sm text-slate-500">Your earning history will appear here</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.04 }}
                    className="border-slate-700/50 transition-colors hover:bg-slate-800/30"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{tx.donorName || "Anonymous"}</p>
                        <p className="text-xs text-slate-500">{tx.id.slice(0, 8)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[280px] whitespace-normal text-white">
                      {tx.donorMessage || "-"}
                    </TableCell>
                    <TableCell className="text-slate-300">{tx.paymentMethod || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{formatDateTime(tx.createdAt)}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-400">
                      +{formatPrice(tx.amount, tx.currency)}
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
