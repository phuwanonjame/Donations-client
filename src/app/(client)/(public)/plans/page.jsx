'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  Crown,
  Gem,
  Minus,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetchPlans, purchasePlan } from '@/actions/Plansapi/plansApi';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const billingOptions = [
  { id: 'monthly', label: '1 เดือน', suffix: '/เดือน' },
  { id: 'quarterly', label: '3 เดือน', suffix: '/3 เดือน' },
  { id: 'yearly', label: '1 ปี', suffix: '/ปี' },
];

const fallbackPlans = [
  {
    code: 'free',
    name: 'Basic',
    icon: Zap,
    caption: 'เหมาะสำหรับผู้เริ่มต้นที่อยากลองเปิดรับโดเนท',
    description: 'โดเนทขึ้นจอได้ครบ ใช้งานง่าย และเริ่มต้นได้ทันที',
    price: { monthly: 0, quarterly: 0, yearly: 0 },
    cta: 'แพลนปัจจุบัน',
    current: true,
    accent: 'from-slate-500 to-slate-300',
    border: 'border-white/10',
    glow: 'bg-white/10',
    summary: 'โดเนทขึ้นจอ 10 ครั้ง/เดือน',
    features: [
      { label: 'โดเนทขึ้นจอ 10 ครั้งต่อเดือน', included: true },
      { label: 'มีโฆษณาในหน้ารับเงิน', included: false },
      { label: 'ปรับธีมหน้ารับเงินได้เฉพาะพื้นฐาน', included: false },
      { label: 'ปรับแต่งวิดเจ็ตเริ่มต้นได้', included: true },
    ],
  },
  {
    code: 'lite',
    name: 'Lite',
    icon: Sparkles,
    caption: 'ชุดประหยัดที่พร้อมใช้งานสำหรับครีเอเตอร์รายวัน',
    description: 'ปลดโฆษณา เพิ่มความน่าเชื่อถือ และแต่งหน้าเพจให้เป็นตัวเอง',
    price: { monthly: 29, quarterly: 79, yearly: 290 },
    cta: 'อัปเกรดเป็น Lite',
    accent: 'from-cyan-400 to-teal-300',
    border: 'border-cyan-400/20',
    glow: 'bg-cyan-400/15',
    summary: 'โดเนทขึ้นจอ 30 ครั้ง/เดือน',
    features: [
      { label: 'โดเนทขึ้นจอ 30 ครั้งต่อเดือน', included: true },
      { label: 'ไม่มีโฆษณาในหน้ารับเงิน', included: true },
      { label: 'เปลี่ยนรูปปก พื้นหลัง และโทนสีได้', included: true },
      { label: 'อัปโหลดเสียงแจ้งเตือนของตัวเอง', included: true },
    ],
  },
  {
    code: 'pro',
    name: 'Pro',
    icon: Crown,
    caption: 'สำหรับคนที่อยากทำแบรนด์และปรับแต่งประสบการณ์ให้ลึกขึ้น',
    description: 'สมดุลที่สุดระหว่างราคาและความสามารถสำหรับสายสตรีมจริงจัง',
    price: { monthly: 79, quarterly: 219, yearly: 790 },
    cta: 'อัปเกรดเป็น Pro',
    accent: 'from-sky-400 to-cyan-300',
    border: 'border-sky-400/30',
    glow: 'bg-sky-400/15',
    summary: 'โดเนทขึ้นจอ 80 ครั้ง/เดือน',
    features: [
      { label: 'โดเนทขึ้นจอ 80 ครั้งต่อเดือน', included: true },
      { label: 'ไม่มีโฆษณาในหน้ารับเงิน', included: true },
      { label: 'ธีม วิดเจ็ต และเสียงแจ้งเตือนปรับได้ครบ', included: true },
      { label: 'ตั้งค่าการแสดงผลขั้นสูงสำหรับสตรีม', included: true },
    ],
  },
  {
    code: 'ultra',
    name: 'Ultra',
    icon: Rocket,
    caption: 'ปลดล็อกทุกอย่างสำหรับผู้ที่ต้องการความยืดหยุ่นเต็มรูปแบบ',
    description: 'แพลนแนะนำสำหรับครีเอเตอร์ที่อยากใช้ระบบได้แบบไม่มีข้อจำกัด',
    price: { monthly: 249, quarterly: 699, yearly: 2490 },
    cta: 'อัปเกรดเป็น Ultra',
    accent: 'from-cyan-300 via-sky-300 to-teal-200',
    border: 'border-cyan-300/40',
    glow: 'bg-cyan-300/20',
    summary: 'โดเนทขึ้นจอไม่จำกัด',
    featured: true,
    features: [
      { label: 'โดเนทขึ้นจอได้ไม่จำกัด', included: true },
      { label: 'ไม่มีโฆษณาในหน้ารับเงิน', included: true },
      { label: 'ปรับแต่งทุกส่วนของหน้าและวิดเจ็ตได้ทั้งหมด', included: true },
      { label: 'เหมาะกับแคมเปญขนาดใหญ่และงานโปรโมชัน', included: true },
    ],
  },
];

const planPresentation = {
  free: {
    icon: Zap,
    name: 'Basic',
    caption: 'เหมาะสำหรับผู้เริ่มต้นที่อยากลองเปิดรับโดเนท',
    cta: 'แพลนปัจจุบัน',
    current: true,
    accent: 'from-slate-500 to-slate-300',
    border: 'border-white/10',
    glow: 'bg-white/10',
  },
  lite: {
    icon: Sparkles,
    caption: 'ชุดประหยัดที่พร้อมใช้งานสำหรับครีเอเตอร์รายวัน',
    cta: 'อัปเกรดเป็น Lite',
    accent: 'from-cyan-400 to-teal-300',
    border: 'border-cyan-400/20',
    glow: 'bg-cyan-400/15',
  },
  pro: {
    icon: Crown,
    caption: 'สำหรับคนที่อยากทำแบรนด์และปรับแต่งประสบการณ์ให้ลึกขึ้น',
    cta: 'อัปเกรดเป็น Pro',
    accent: 'from-sky-400 to-cyan-300',
    border: 'border-sky-400/30',
    glow: 'bg-sky-400/15',
  },
  ultra: {
    icon: Rocket,
    caption: 'ปลดล็อกทุกอย่างสำหรับผู้ที่ต้องการความยืดหยุ่นเต็มรูปแบบ',
    cta: 'อัปเกรดเป็น Ultra',
    accent: 'from-cyan-300 via-sky-300 to-teal-200',
    border: 'border-cyan-300/40',
    glow: 'bg-cyan-300/20',
    featured: true,
  },
};

const faqs = [
  {
    title: 'ถ้าเริ่มจากแพลนฟรีก่อน แล้วค่อยอัปเกรดได้ไหม',
    detail: 'ได้เลย คุณสามารถเริ่มจาก Basic แล้วค่อยอัปเกรดเมื่ออยากปลดล็อกฟีเจอร์เพิ่มขึ้น',
  },
  {
    title: 'ซื้อแบบ 3 เดือนหรือ 1 ปีคุ้มกว่ายังไง',
    detail: 'แพลนระยะยาวช่วยลดค่าใช้จ่ายเฉลี่ยต่อเดือน เหมาะกับคนที่ใช้งานต่อเนื่อง',
  },
  {
    title: 'แพลนไหนเหมาะกับคนสตรีมบ่อย',
    detail: 'ถ้าสตรีมเป็นประจำและอยากแต่งหน้าเพจจริงจัง แนะนำ Pro หรือ Ultra',
  },
];

const trustItems = [
  'รองรับการปรับแต่งหน้ารับเงิน',
  'จัดการวิดเจ็ตและเสียงแจ้งเตือนได้',
  'พร้อมขยายตามการเติบโตของช่อง',
];

const PURCHASE_PROVIDER = 'PROMPTPAY';
const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || 'http://localhost:3002/';

function formatPrice(value) {
  return Number(value || 0).toLocaleString('th-TH', {
    minimumFractionDigits: Number(value || 0) % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function getPlanPrice(plan, months) {
  if (!plan) {
    return 0;
  }

  if (months === 1) {
    return plan.price.monthly;
  }

  if (months === 3) {
    return plan.price.quarterly;
  }

  if (months === 12) {
    return plan.price.yearly;
  }

  return plan.price.monthly * months;
}

function getBaseMonthlyTotal(plan, months) {
  if (!plan) {
    return 0;
  }

  return plan.price.monthly * months;
}

function getDiscountAmount(plan, months) {
  if (!plan || ![3, 12].includes(months)) {
    return 0;
  }

  const baseTotal = getBaseMonthlyTotal(plan, months);
  const discountedTotal = getPlanPrice(plan, months);

  return Math.max(baseTotal - discountedTotal, 0);
}

function getDurationLabel(months) {
  if (months === 12) {
    return '1 ปี';
  }

  return `${months} เดือน`;
}

function getPlanOrderId(response) {
  return response?.data?.id || response?.id || null;
}

function buildPaymentRedirectUrl(planOrderId) {
  const normalizedBase = PAYMENT_BASE_URL.endsWith('/')
    ? PAYMENT_BASE_URL
    : `${PAYMENT_BASE_URL}/`;

  return `${normalizedBase}${planOrderId}`;
}

function normalizePlan(apiPlan) {
  const meta = planPresentation[apiPlan?.code] || {};
  const monthlyPrice = Number(apiPlan?.pricing?.monthlyPrice || 0);
  const priceOptions = Array.isArray(apiPlan?.priceOptions) ? apiPlan.priceOptions : [];
  const quarterlyOption = priceOptions.find((option) => Number(option?.durationMonths) === 3);
  const yearlyOption = priceOptions.find((option) => Number(option?.durationMonths) === 12);

  return {
    id: apiPlan?.id,
    code: apiPlan?.code,
    name: meta.name || apiPlan?.name || 'Plan',
    icon: meta.icon || Star,
    caption: meta.caption || apiPlan?.description || '',
    description: apiPlan?.description || '',
    price: {
      monthly: Number(priceOptions.find((option) => Number(option?.durationMonths) === 1)?.finalAmount ?? monthlyPrice),
      quarterly: Number(quarterlyOption?.finalAmount ?? monthlyPrice * 3),
      yearly: Number(yearlyOption?.finalAmount ?? monthlyPrice * 12),
    },
    cta: meta.cta || `อัปเกรดเป็น ${apiPlan?.name || 'Plan'}`,
    current: Boolean(meta.current),
    accent: meta.accent || 'from-cyan-400 to-teal-300',
    border: meta.border || 'border-cyan-400/20',
    glow: meta.glow || 'bg-cyan-400/15',
    summary: apiPlan?.monthlyDonationLimit
      ? `โดเนทขึ้นจอ ${apiPlan.monthlyDonationLimit} ครั้ง/เดือน`
      : 'รายละเอียดใช้งานตามแพลน',
    featured: Boolean(apiPlan?.isFeatured || meta.featured),
    features: Array.isArray(apiPlan?.features) ? apiPlan.features : [],
    priceOptions,
    monthlyPrice,
  };
}

export default function PlansPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [billing, setBilling] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const purchaseUserId = user?.id;
  const totalPrice = getPlanPrice(selectedPlan, selectedMonths);
  const baseMonthlyTotal = getBaseMonthlyTotal(selectedPlan, selectedMonths);
  const discountAmount = getDiscountAmount(selectedPlan, selectedMonths);
  const hasDiscount = discountAmount > 0;

  const selectedSuffix =
    billingOptions.find((option) => option.id === billing)?.suffix ?? '/เดือน';

  useEffect(() => {
    let active = true;

    async function loadPlans() {
      setIsLoadingPlans(true);
      setPlansError('');

      const apiPlans = await fetchPlans();

      if (!active) {
        return;
      }

      if (!apiPlans.length) {
        setPlansError('ไม่สามารถโหลดข้อมูลแพลนล่าสุดได้ กำลังใช้ข้อมูลสำรองชั่วคราว');
        setPlans(fallbackPlans);
        setIsLoadingPlans(false);
        return;
      }

      const normalizedPlans = apiPlans
        .filter((plan) => Number(plan?.isActive) === 1 || plan?.isActive === true)
        .sort((a, b) => Number(a?.sortOrder || 0) - Number(b?.sortOrder || 0))
        .map(normalizePlan);

      setPlans(normalizedPlans.length ? normalizedPlans : fallbackPlans);
      setIsLoadingPlans(false);
    }

    loadPlans();

    return () => {
      active = false;
    };
  }, []);

  function handleUpgradeClick(plan) {
    if (plan.current) {
      return;
    }

    if (billing === 'quarterly') {
      setSelectedMonths(3);
    } else if (billing === 'yearly') {
      setSelectedMonths(12);
    } else {
      setSelectedMonths(1);
    }

    setPurchaseResult(null);
    setSelectedPlan(plan);
  }

  function changeBilling(step) {
    const nextMonths = selectedMonths + step;

    if (nextMonths < 1) {
      return;
    }

    setSelectedMonths(nextMonths);
  }

  async function handlePurchasePlan() {
    if (!selectedPlan?.id || isPurchasing) {
      return;
    }

    if (isAuthLoading) {
      toast.error('กำลังตรวจสอบข้อมูลผู้ใช้ กรุณาลองอีกครั้ง');
      return;
    }

    if (!purchaseUserId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนอัปเกรดแพลน');
      setSelectedPlan(null);
      router.push('/login');
      return;
    }

    try {
      setIsPurchasing(true);
      setPurchaseResult(null);

      const response = await purchasePlan({
        userId: purchaseUserId,
        planId: selectedPlan.id,
        durationMonths: selectedMonths,
        provider: PURCHASE_PROVIDER,
      });
      const planOrderId = getPlanOrderId(response);

      setPurchaseResult(response);
      if (!planOrderId) {
        toast.error('สร้างรายการสำเร็จ แต่ไม่พบ id สำหรับ redirect');
        return;
      }

      toast.success('สร้างรายการอัปเกรดสำเร็จ กำลังไปหน้าชำระเงิน...');
      window.location.href = buildPaymentRedirectUrl(planOrderId);
    } catch (error) {
      const message = error?.message || 'ไม่สามารถสร้างรายการอัปเกรดได้';
      toast.error(message);
    } finally {
      setIsPurchasing(false);
    }
  }

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
              เลือกแพลนที่โตไปพร้อมกับช่องของคุณ
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
              เลือกแพลน
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                ที่เหมาะกับการรับโดเนทของคุณ
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              หน้านี้ออกแบบมาให้เลือกง่ายขึ้น เห็นความต่างชัดขึ้น และยังคงโทนของแพลตฟอร์มเดิม
              เพื่อให้คุณอัปเกรดได้ตรงกับรูปแบบการใช้งานจริง
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Billing Cycle</p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              รองรับทั้งรายเดือน ราย 3 เดือน และรายปี เพื่อให้เลือกจ่ายตามจังหวะการเติบโตของช่องได้สบายขึ้น
            </p>

            <div className="mt-6 inline-flex w-full flex-wrap gap-2 rounded-full border border-white/10 bg-black/20 p-1.5">
              {billingOptions.map((option) => {
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
              กำลังโหลดแพลนล่าสุด...
            </div>
          )}

          {!isLoadingPlans && plansError && (
            <div className="xl:col-span-4 rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-100 backdrop-blur-xl">
              {plansError}
            </div>
          )}

          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.price[billing];

            return (
              <motion.article
                key={plan.name}
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
                      <span className="text-4xl font-bold tracking-tight">
                        {formatPrice(price)}
                      </span>
                      <span className="pb-1 text-sm text-slate-400">{selectedSuffix}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleUpgradeClick(plan)}
                    className={`mb-6 h-12 w-full rounded-full text-sm font-semibold transition-all ${
                      plan.featured
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200 text-[#0A1628] shadow-lg shadow-cyan-500/20 hover:brightness-110'
                        : plan.current
                          ? 'border border-white/15 bg-white/10 text-white hover:bg-white/15'
                          : 'border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20'
                    }`}
                  >
                    {plan.cta}
                    {!plan.current && <ArrowRight className="ml-1 h-4 w-4" />}
                  </Button>

                  <div className="mt-auto">
                    <p className="mb-3 text-sm font-medium text-slate-400">สิ่งที่คุณจะได้</p>
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature.label}
                          className={`flex items-start gap-3 text-sm leading-6 ${
                            feature.included ? 'text-slate-100' : 'text-slate-500'
                          }`}
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
        <DialogContent
          className="overflow-hidden border-white/10 bg-[#081221] p-0 text-white shadow-2xl shadow-cyan-950/40 sm:max-w-2xl [&>[data-slot=dialog-close]]:z-30 [&>[data-slot=dialog-close]]:top-5 [&>[data-slot=dialog-close]]:right-5 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-white/15 [&>[data-slot=dialog-close]]:bg-white/5 [&>[data-slot=dialog-close]]:p-2 [&>[data-slot=dialog-close]]:text-white/80 [&>[data-slot=dialog-close]]:ring-0 [&>[data-slot=dialog-close]]:hover:bg-white/10 [&>[data-slot=dialog-close]]:hover:text-white"
        >
          <div className="relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 102, 255, 0.4) 0%, rgba(0, 102, 255, 0) 50%, rgba(0, 102, 255, 0) 100%), linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
                backgroundSize: 'cover, 40px 40px, 40px 40px',
                backgroundPosition: 'center center, center center, center center',
                maskImage: 'linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0) 50%)',
              }}
            />
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
                  เลือกแพ็กเกจที่เหมาะกับจังหวะการเติบโตของช่องคุณได้เลย โดยราคาและสิทธิ์ใช้งานของแพลนนี้จะอ้างอิงตามรอบบิลที่เลือก
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeBilling(-1)}
                      disabled={selectedMonths <= 1}
                      className="flex aspect-square h-[25px] items-center justify-center rounded-full border border-white/20 transition duration-300 hover:scale-95 hover:bg-white/10 disabled:opacity-60"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <p className="text-xl font-semibold text-white">
                      {getDurationLabel(selectedMonths)}
                    </p>

                    <button
                      type="button"
                      onClick={() => changeBilling(1)}
                      className="flex aspect-square h-[25px] items-center justify-center rounded-full border border-white/20 transition duration-300 hover:scale-95 hover:bg-white/10 disabled:opacity-60"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {billingOptions.map((option) => {
                      const optionMonths =
                        option.id === 'monthly' ? 1 : option.id === 'quarterly' ? 3 : 12;
                      const active = selectedMonths === optionMonths;

                      return (
                        <button
                          key={`pill-${option.id}`}
                          type="button"
                          onClick={() => setSelectedMonths(optionMonths)}
                          disabled={active}
                          className={`rounded-full px-3 py-0.5 transition duration-300 ${
                            active
                              ? 'bg-white font-medium text-black'
                              : 'border border-white/20 text-white hover:bg-white/10'
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
                    <h4 className="mt-2 text-2xl font-semibold text-white">
                      {selectedPlan?.name} Plan
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {selectedPlan?.summary} และฟีเจอร์ตามแพลนที่เลือก
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-slate-400">ชำระครั้งนี้</p>
                    {hasDiscount && (
                      <p className="mt-2 text-base font-medium text-red-300 line-through decoration-red-400/90 decoration-2">
                        ฿{formatPrice(baseMonthlyTotal)}
                      </p>
                    )}
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                      ฿{formatPrice(totalPrice)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{getDurationLabel(selectedMonths)}</p>
                  </div>
                </div>

                {hasDiscount && (
                  <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-200">
                        ประหยัดทันที ฿{formatPrice(discountAmount)}
                      </p>
                      <p className="text-sm text-emerald-100/80">
                        จากราคาปกติ ฿{formatPrice(baseMonthlyTotal)}
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-200/25 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-100">
                      ส่วนลดแพ็กเกจ {getDurationLabel(selectedMonths)}
                    </div>
                  </div>
                )}

                {purchaseResult && (
                  <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
                    <p className="font-semibold text-cyan-100">สร้างรายการสำเร็จ</p>
                    <p className="mt-1 break-all text-cyan-100/80">
                      {purchaseResult?.message || purchaseResult?.data?.message || 'ส่งคำสั่งซื้อเรียบร้อยแล้ว'}
                    </p>
                  </div>
                )}

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
                    onClick={handlePurchasePlan}
                    disabled={isPurchasing}
                    className="h-12 flex-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-200 text-[#0A1628] shadow-lg shadow-cyan-500/20 hover:brightness-110"
                  >
                    {isPurchasing ? 'กำลังสร้างรายการ...' : 'ดำเนินการอัปเกรด'}
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
