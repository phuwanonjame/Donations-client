"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Crown,
  ExternalLink,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { fetchPlanHistory, fetchPlanStatus } from "@/actions/Plansapi/plansApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HISTORY_USER_ID = "244bad71-4990-4a79-9a19-9ff983a55442";
const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || "http://localhost:3002/";

const planPresentation = {
  free: { color: "from-slate-500 to-slate-600" },
  lite: { color: "from-cyan-500 to-teal-400" },
  pro: { color: "from-sky-500 to-blue-500" },
  ultra: { color: "from-amber-400 to-orange-500" },
};

const statusConfig = {
  PAID: {
    icon: CheckCircle,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    label: "Paid",
  },
  PENDING: {
    icon: Clock,
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    label: "Pending",
  },
  FAILED: {
    icon: XCircle,
    color: "text-rose-300",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    label: "Failed",
  },
  EXPIRED: {
    icon: AlertCircle,
    color: "text-slate-300",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    label: "Expired",
  },
};

function formatPrice(value, currency = "THB") {
  const amount = Number(value || 0);
  const formatted = amount.toLocaleString("th-TH", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
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

function getDurationLabel(months) {
  if (months === 12) {
    return "1 ปี";
  }

  return `${months} เดือน`;
}

function buildPaymentRedirectUrl(planOrderId) {
  const normalizedBase = PAYMENT_BASE_URL.endsWith("/")
    ? PAYMENT_BASE_URL
    : `${PAYMENT_BASE_URL}/`;

  return `${normalizedBase}${planOrderId}`;
}

function canShowPendingActions(item) {
  const paymentStatus = item?.payments?.[0]?.status;
  return item?.status === "PENDING" || paymentStatus === "PENDING";
}

export default function SubscriptionHistory() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [planStatus, setPlanStatus] = useState(null);
  const [planStatusError, setPlanStatusError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setIsLoading(true);
      setHistoryError("");
      setPlanStatusError("");

      const [historyResult, statusResult] = await Promise.all([
        fetchPlanHistory(HISTORY_USER_ID),
        fetchPlanStatus(HISTORY_USER_ID),
      ]);

      if (!active) {
        return;
      }

      if (!historyResult.length) {
        setHistory([]);
        setHistoryError("ยังไม่สามารถโหลดประวัติแพลนได้ในตอนนี้");
      } else {
        const sortedHistory = [...historyResult].sort(
          (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
        );

        setHistory(sortedHistory);
      }

      if (!statusResult) {
        setPlanStatus(null);
        setPlanStatusError("ยังไม่สามารถโหลดแพลนปัจจุบันได้ในตอนนี้");
      } else {
        setPlanStatus(statusResult);
      }

      setIsLoading(false);
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);
  const currentPlan = planStatus?.currentPlan || planStatus?.freeFallback || null;
  const currentPlanCode = currentPlan?.code?.toLowerCase?.() || "free";
  const currentPlanStyle = planPresentation[currentPlanCode] || planPresentation.free;
  const currentPlanName = currentPlan?.name || "Free";
  const currentPlanPrice = currentPlan?.finalAmount || 0;
  const currentPlanStatus = planStatus?.planSource || "FREE";
  const currentUsage = planStatus?.usage || planStatus?.freeFallback || null;
  const isFreePlan = currentPlanCode === "free" || currentPlanStatus === "FREE";

  function handleOpenPayment(item) {
    if (!item?.id) {
      toast.error("ไม่พบรายการสำหรับไปหน้าชำระเงิน");
      return;
    }

    window.location.assign(buildPaymentRedirectUrl(item.id));
  }

  function handleCancelOrder(item) {
    toast.message(`เตรียมยกเลิกรายการ ${item?.plan?.name || ""}`, {
      description: "ตอนนี้ปุ่มยกเลิกแสดงไว้ก่อน รอเชื่อม API ยกเลิกคำสั่งซื้อ",
    });
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl"
      >
        <div className="relative p-6">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Current Plan</h2>
                <p className="text-sm text-slate-400">สถานะแพลนล่าสุดของบัญชีนี้</p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-6">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-600 bg-gradient-to-br ${currentPlanStyle.color}`}
                >
                  <span className="text-3xl font-bold text-white">{currentPlanName[0]}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{currentPlanName}</h3>
                  {!isFreePlan && currentPlan && (
                    <>
                      <p className="mt-1 text-sm text-slate-400">
                        แพ็กเกจ {getDurationLabel(currentPlan.durationMonths || 1)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {currentPlan?.startedAt && (
                          <span className="text-xs text-slate-500">เริ่มใช้งาน {formatDateTime(currentPlan.startedAt)}</span>
                        )}
                      </div>
                    </>
                  )}
                  {planStatusError && (
                    <p className="mt-2 text-xs text-amber-300">{planStatusError}</p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => router.push("/plans")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-400"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>

            {currentUsage && (
              <div className="relative z-10 mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Billing Window</p>
                  <p className="mt-2 text-sm text-white">{formatDateTime(currentUsage?.billingWindowStart)}</p>
                  <p className="mt-1 text-sm text-slate-400">ถึง {formatDateTime(currentUsage?.billingWindowEnd)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Usage This Period</p>
                  <p className="mt-2 text-2xl font-bold text-white">{currentUsage?.usedThisPeriod ?? 0}</p>
                  <p className="mt-1 text-sm text-slate-400">ใช้งานในรอบปัจจุบัน</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Remaining</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {currentUsage?.remainingThisPeriod ?? "Unlimited"}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Limit {currentUsage?.monthlyLimit ?? "Unlimited"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl"
      >
        <div className="border-b border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Subscription History</h2>
              <p className="text-sm text-slate-400">ประวัติการสมัครแพลนและสถานะการชำระเงิน</p>
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
                <TableHead className="px-4 text-slate-400">ลำดับ</TableHead>
                <TableHead className="px-4 text-slate-400">Plan</TableHead>
                <TableHead className="px-4 text-slate-400">Duration</TableHead>
                <TableHead className="px-4 text-slate-400">Amount</TableHead>
                <TableHead className="px-4 text-slate-400">Created</TableHead>
                <TableHead className="px-4 text-slate-400">Paid / Expired</TableHead>
                <TableHead className="px-4 text-slate-400">Status</TableHead>
                <TableHead className="px-4 text-slate-400">เพิ่มเติม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-slate-700/50">
                  <TableCell colSpan={8} className="py-12 text-center text-slate-300">
                    กำลังโหลดประวัติแพลน...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow className="border-slate-700/50">
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                        <Clock className="h-8 w-8 text-slate-500" />
                      </div>
                      <p className="mb-1 font-medium text-white">No subscription history</p>
                      <p className="text-sm text-slate-500">ประวัติการสมัครแพลนจะขึ้นที่หน้านี้</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item, index) => {
                  const planCode = item?.plan?.code?.toLowerCase?.() || "free";
                  const planStyle = planPresentation[planCode] || planPresentation.free;
                  const status = statusConfig[item?.status] || statusConfig.PENDING;
                  const StatusIcon = status.icon;
                  const showPendingActions = canShowPendingActions(item);

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.04 }}
                      className="border-slate-700/50 hover:bg-slate-800/30"
                    >
                      <TableCell className="px-4 py-4 align-top">
                        <span className="font-medium text-white">{index + 1}</span>
                      </TableCell>
                      <TableCell className="px-4 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${planStyle.color}`}
                          >
                            <span className="text-sm font-bold text-white">{item?.plan?.name?.[0] || "P"}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{item?.plan?.name || "-"}</p>
                            <p className="text-xs text-slate-500">{item?.plan?.code || "-"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-slate-300">
                        {getDurationLabel(Number(item?.durationMonths || 0))}
                      </TableCell>
                      <TableCell className="px-4 py-4 align-top">
                        <div className="space-y-1">
                          <p className="font-medium text-white">{formatPrice(item?.finalAmount, item?.currency)}</p>
                          {Number(item?.discountAmount || 0) > 0 && (
                            <p className="text-xs text-emerald-300">
                              ลดไป {formatPrice(item?.discountAmount, item?.currency)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-slate-400">
                        {formatDateTime(item?.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 py-4 align-top">
                        <div className="space-y-1 text-slate-400">
                          <p>Paid: {formatDateTime(item?.paidAt)}</p>
                          <p>Expired: {formatDateTime(item?.expiredAt)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 align-top">
                        <div className="flex flex-col items-start gap-2">
                          <Badge className={`${status.bg} ${status.color} ${status.border} border`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 align-top">
                        {showPendingActions ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleOpenPayment(item)}
                              className="h-8 rounded-full bg-cyan-500 px-3 text-xs font-medium text-white hover:bg-cyan-400"
                            >
                              ไปชำระเงิน
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleCancelOrder(item)}
                              className="h-8 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 text-xs font-medium text-rose-200 hover:bg-rose-500/20"
                            >
                              ยกเลิก
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>

          {!isLoading && history.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>ทั้งหมด {history.length} รายการ</span>
              <button
                type="button"
                onClick={() => router.push("/plans")}
                className="inline-flex items-center gap-1 text-cyan-300 transition hover:text-cyan-200"
              >
                ไปหน้า Plans
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
