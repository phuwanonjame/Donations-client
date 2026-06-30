'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Crown, Gem, Minus, Plus, Rocket, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetchPlans, fetchPlanStatus, purchasePlan } from '@/actions/Plansapi/plansApi';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || 'http://localhost:3002/';
const PURCHASE_PROVIDER = 'PROMPTPAY';

const BILLING_OPTIONS = [
  { id: 'monthly', months: 1, label: 'รายเดือน', suffix: '/เดือน' },
  { id: 'quarterly', months: 3, label: '3 เดือน', suffix: '/3 เดือน' },
  { id: 'yearly', months: 12, label: 'รายปี', suffix: '/ปี' },
];

const PLAN_META = {
  free: {
    icon: Zap,
    displayName: 'Basic',
    caption: 'เหมาะสำหรับผู้เริ่มต้นที่อยากลองเปิดรับโดเนท',
    accent: 'from-slate-500 to-slate-300',
    border: 'border-white/10',
    glow: 'bg-white/10',
    cta: 'แพลนปัจจุบัน',
  },
  lite: {
    icon: Sparkles,
    displayName: 'Lite',
    caption: 'ทางเลือกประหยัด สำหรับครีเอเตอร์ที่เริ่มใช้งานจริงจัง',
    accent: 'from-cyan-400 to-teal-300',
    border: 'border-cyan-400/20',
    glow: 'bg-cyan-400/15',
    cta: 'อัปเกรดเป็น Lite',
  },
  pro: {
    icon: Crown,
    displayName: 'Pro',
    caption: 'สมดุลที่สุดสำหรับสตรีมเมอร์ที่ต้องการปรับแต่งและใช้งานต่อเนื่อง',
    accent: 'from-sky-400 to-cyan-300',
    border: 'border-sky-400/30',
    glow: 'bg-sky-400/15',
    cta: 'อัปเกรดเป็น Pro',
  },
  ultra: {
    icon: Rocket,
    displayName: 'Ultra',
    caption: 'ปลดล็อกทุกอย่างสำหรับสายคอนเทนต์ที่ต้องการความยืดหยุ่นเต็มรูปแบบ',
    accent: 'from-cyan-300 via-sky-300 to-teal-200',
    border: 'border-cyan-300/40',
    glow: 'bg-cyan-300/20',
    cta: 'อัปเกรดเป็น Ultra',
    featured: true,
  },
};

const PLAN_ORDER = {
  free: 0,
  lite: 1,
  pro: 2,
  ultra: 3,
};

function formatPrice(value) {
  return Number(value || 0).toLocaleString('th-TH');
}

function buildPaymentRedirectUrl(planOrderId) {
  const normalizedBase = PAYMENT_BASE_URL.endsWith('/') ? PAYMENT_BASE_URL : `${PAYMENT_BASE_URL}/`;
  return `${normalizedBase}${planOrderId}`;
}

function getPlanOrderId(response) {
  return response?.data?.id || response?.id || null;
}

function normalizePlan(apiPlan) {
  const code = apiPlan?.code?.toLowerCase?.() || 'free';
  const meta = PLAN_META[code] || PLAN_META.free;
  const priceOptions = Array.isArray(apiPlan?.priceOptions) ? apiPlan.priceOptions : [];
  const monthlyOption = priceOptions.find((option) => Number(option?.durationMonths) === 1);
  const quarterlyOption = priceOptions.find((option) => Number(option?.durationMonths) === 3);
  const yearlyOption = priceOptions.find((option) => Number(option?.durationMonths) === 12);
  const monthlyPrice = Number(monthlyOption?.finalAmount ?? apiPlan?.pricing?.monthlyPrice ?? 0);

  return {
    id: apiPlan?.id,
    code,
    name: meta.displayName || apiPlan?.name || 'Plan',
    caption: meta.caption || apiPlan?.description || '',
    description: apiPlan?.description || '',
    icon: meta.icon,
    accent: meta.accent,
    border: meta.border,
    glow: meta.glow,
    cta: meta.cta || `เลือก ${apiPlan?.name || 'Plan'}`,
    featured: Boolean(meta.featured || apiPlan?.isFeatured),
    monthlyDonationLimit: apiPlan?.monthlyDonationLimit,
    features: Array.isArray(apiPlan?.features) ? apiPlan.features : [],
    prices: {
      monthly: monthlyPrice,
      quarterly: Number(quarterlyOption?.finalAmount ?? monthlyPrice * 3),
      yearly: Number(yearlyOption?.finalAmount ?? monthlyPrice * 12),
    },
  };
}

export default function PlansPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [billing, setBilling] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [plansError, setPlansError] = useState('');
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [currentPlanCode, setCurrentPlanCode] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const activeBilling = useMemo(
    () => BILLING_OPTIONS.find((option) => option.id === billing) || BILLING_OPTIONS[0],
    [billing]
  );

  useEffect(() => {
    let active = true;

    async function loadPlansData() {
      setIsLoadingPlans(true);
      setPlansError('');
      const apiPlans = await fetchPlans();
      if (!active) return;

      if (!apiPlans.length) {
        setPlans([]);
        setPlansError('ยังไม่สามารถโหลดข้อมูลแพลนได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
        setIsLoadingPlans(false);
        return;
      }

      const normalized = apiPlans
        .filter((plan) => Number(plan?.isActive) === 1 || plan?.isActive === true)
        .sort((a, b) => (PLAN_ORDER[a?.code?.toLowerCase?.()] ?? 999) - (PLAN_ORDER[b?.code?.toLowerCase?.()] ?? 999))
        .map(normalizePlan);

      setPlans(normalized);
      setIsLoadingPlans(false);
    }

    loadPlansData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      if (isAuthLoading) return;
      if (!user?.id) {
        setCurrentPlanCode(null);
        return;
      }

      const status = await fetchPlanStatus(user.id);
      if (!active || !status) return;

      const activeSubscription = Array.isArray(status?.activeSubscriptions)
        ? status.activeSubscriptions.find((subscription) => subscription?.plan?.code)
        : null;

      setCurrentPlanCode(activeSubscription?.plan?.code?.toLowerCase?.() || null);
    }

    loadStatus();
    return () => {
      active = false;
    };
  }, [isAuthLoading, user?.id]);

  const handleSelectPlan = (plan) => {
    if (isAuthLoading) {
      toast.error('กำลังตรวจสอบบัญชีผู้ใช้ กรุณาลองอีกครั้ง');
      return;
    }

    if (!user?.id) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเลือกแพลน');
      router.push('/login');
      return;
    }

    setSelectedPlan(plan);
    setSelectedMonths(activeBilling.months);
  };

  const handleChangeMonths = (direction) => {
    setSelectedMonths((prev) => Math.max(1, prev + direction));
  };

  const handlePurchase = async () => {
    if (!user?.id || !selectedPlan?.id) {
      toast.error('ไม่สามารถเริ่มคำสั่งซื้อได้');
      return;
    }

    setIsPurchasing(true);

    try {
      const response = await purchasePlan({
        userId: user.id,
        planId: selectedPlan.id,
        durationMonths: selectedMonths,
        provider: PURCHASE_PROVIDER,
      });

      const planOrderId = getPlanOrderId(response);
      if (!planOrderId) {
        toast.error('สร้างรายการสำเร็จ แต่ไม่พบลิงก์ชำระเงิน');
        return;
      }

      toast.success('กำลังพาไปหน้าชำระเงิน');
      router.push(buildPaymentRedirectUrl(planOrderId));
    } catch (error) {
      toast.error(error?.message || 'ไม่สามารถสร้างรายการซื้อแพลนได้');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0A1628] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_40%),linear-gradient(180deg,rgba(10,22,40,0.1),rgba(10,22,40,1))]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"
        >
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              เลือกแพลนที่เหมาะกับช่องของคุณ
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
              เลือกแพลน
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                ที่เหมาะกับการรับโดเนทของคุณ
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              เลือกรอบบิลที่เหมาะกับจังหวะการเติบโตของช่องคุณได้เลย ทั้งรายเดือน 3 เดือน และรายปี
              พร้อมดูความต่างของแต่ละแพลนแบบชัดเจนก่อนตัดสินใจ
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Billing Cycle</p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              สลับดูราคาแต่ละแพลนตามรอบบิลที่คุณต้องการ เพื่อเปรียบเทียบความคุ้มค่าได้ง่ายขึ้น
            </p>

            <div className="mt-6 inline-flex w-full flex-wrap gap-2 rounded-full border border-white/10 bg-black/20 p-1.5">
              {BILLING_OPTIONS.map((option) => {
                const active = billing === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBilling(option.id)}
                    className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 md:text-base ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-[#0A1628] shadow-lg shadow-cyan-500/20'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-4">
          {isLoadingPlans && (
            <div className="xl:col-span-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-xl">
              กำลังโหลดข้อมูลแพลน...
            </div>
          )}

          {!isLoadingPlans && plansError && (
            <div className="xl:col-span-4 rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-100 backdrop-blur-xl">
              {plansError}
            </div>
          )}

          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.prices[billing];
            const currentRank = PLAN_ORDER[currentPlanCode] ?? -1;
            const planRank = PLAN_ORDER[plan.code] ?? -1;
            const isCurrentPlan = currentPlanCode ? plan.code === currentPlanCode : plan.code === 'free';
            const isLowerPlan = currentPlanCode ? planRank < currentRank : false;
            const buttonLabel = isCurrentPlan ? 'แพลนปัจจุบัน' : isLowerPlan ? 'แพลนต่ำกว่า' : plan.cta;

            return (
              <motion.article
                key={plan.code}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className={`group relative overflow-hidden rounded-[2rem] border ${plan.border} bg-white/5 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.07] ${
                  plan.featured ? 'ring-1 ring-cyan-300/40 xl:-mt-4 xl:mb-4' : ''
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-40 ${plan.glow} blur-3xl`} />

                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-cyan-300 to-teal-200 px-3 py-1 text-xs font-bold text-[#0A1628]">
                    แนะนำ
                  </div>
                )}

                <div className="relative z-10 flex h-full flex-col">
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.accent} shadow-lg shadow-cyan-950/20`}>
                    <Icon className="h-7 w-7 text-[#0A1628]" />
                  </div>

                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight">{plan.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-cyan-100/80">{plan.caption}</p>
                  </div>

                  <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ราคาเริ่มต้น</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-lg text-slate-400">฿</span>
                      <span className="text-4xl font-bold tracking-tight">{formatPrice(price)}</span>
                      <span className="pb-1 text-sm text-slate-400">{activeBilling.suffix}</span>
                    </div>
                    {plan.monthlyDonationLimit ? (
                      <p className="mt-3 text-sm text-slate-400">โดเนทขึ้นจอ {plan.monthlyDonationLimit} ครั้งต่อเดือน</p>
                    ) : (
                      <p className="mt-3 text-sm text-slate-400">เหมาะสำหรับเริ่มทดลองใช้งาน</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isLowerPlan}
                    className={`mb-6 h-12 w-full rounded-full text-sm font-semibold transition-all ${
                      isCurrentPlan
                        ? 'border border-cyan-300/30 bg-cyan-400/15 text-white hover:bg-cyan-400/20'
                        : isLowerPlan
                          ? 'cursor-not-allowed border border-slate-700 bg-slate-800/70 text-slate-500 hover:bg-slate-800/70'
                          : plan.featured
                            ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200 text-[#0A1628] shadow-lg shadow-cyan-500/20 hover:brightness-110'
                            : 'border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20'
                    }`}
                  >
                    {buttonLabel}
                    {!isCurrentPlan && !isLowerPlan && <ArrowRight className="ml-1 h-4 w-4" />}
                  </Button>

                  <div className="mt-auto">
                    <p className="mb-3 text-sm font-medium text-slate-400">สิ่งที่คุณจะได้รับ</p>
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature.label}
                          className={`flex items-start gap-3 text-sm leading-6 ${feature.included ? 'text-slate-100' : 'text-slate-500'}`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                              feature.included
                                ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-300'
                                : 'border-white/10 bg-white/5 text-slate-500'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span>{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <Dialog open={Boolean(selectedPlan)} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="overflow-hidden border-white/10 bg-[#081221] p-0 text-white shadow-2xl shadow-cyan-950/40 sm:max-w-2xl [&>[data-slot=dialog-close]]:z-30 [&>[data-slot=dialog-close]]:top-5 [&>[data-slot=dialog-close]]:right-5 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-white/15 [&>[data-slot=dialog-close]]:bg-white/5 [&>[data-slot=dialog-close]]:p-2 [&>[data-slot=dialog-close]]:text-white/80 [&>[data-slot=dialog-close]]:ring-0 [&>[data-slot=dialog-close]]:hover:bg-white/10 [&>[data-slot=dialog-close]]:hover:text-white">
          <div className="relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,102,255,0.4)_0%,rgba(0,102,255,0)_50%,rgba(0,102,255,0)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-300/20 via-sky-400/10 to-transparent blur-3xl" />

            <div className="relative z-10 p-6 sm:p-8">
              <DialogHeader className="space-y-3 text-left">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-teal-200 text-[#0A1628] shadow-lg shadow-cyan-500/20">
                  <Gem className="h-6 w-6" />
                </div>
                <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  เลือกรอบบิลสำหรับ {selectedPlan?.name}
                </DialogTitle>
                <DialogDescription className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  เลือกระยะเวลาที่ต้องการ แล้วระบบจะพาไปหน้าชำระเงินเพื่อยืนยันการอัปเกรดแพลน
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeMonths(-1)}
                      disabled={selectedMonths <= 1}
                      className="flex aspect-square h-[25px] items-center justify-center rounded-full border border-white/20 transition duration-300 hover:scale-95 hover:bg-white/10 disabled:opacity-60"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <p className="text-xl font-semibold text-white">{selectedMonths} เดือน</p>

                    <button
                      type="button"
                      onClick={() => handleChangeMonths(1)}
                      className="flex aspect-square h-[25px] items-center justify-center rounded-full border border-white/20 transition duration-300 hover:scale-95 hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {BILLING_OPTIONS.map((option) => {
                      const active = selectedMonths === option.months;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedMonths(option.months)}
                          className={`rounded-full px-3 py-0.5 transition duration-300 ${
                            active ? 'bg-white font-medium text-black' : 'border border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">สรุปรายการ</p>
                    <h4 className="mt-2 text-2xl font-semibold text-white">{selectedPlan?.name} Plan</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">ชำระตามระยะเวลาที่เลือก และรับสิทธิ์ใช้งานตามแพลนนั้นทันทีหลังยืนยันการชำระเงิน</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-slate-400">ชำระครั้งนี้</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                      ฿{formatPrice(selectedPlan ? (selectedPlan.prices.monthly * selectedMonths) : 0)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{selectedMonths} เดือน</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    disabled={isPurchasing}
                    className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    ย้อนกลับ
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="h-12 flex-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200 text-[#0A1628] shadow-lg shadow-cyan-500/20 hover:brightness-110"
                  >
                    {isPurchasing ? 'กำลังสร้างรายการ...' : 'ดำเนินการชำระเงิน'}
                    {!isPurchasing && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
