"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, Link as LinkIcon, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { fetchDonationHistory } from "@/actions/Donationsapi/donationHistoryApi";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import DonationChart from "../components/dashboard/DonationChart";
import RecentDonations from "../components/dashboard/RecentDonations";
import VisitsWidget from "../components/dashboard/VisitsWidget";
import { Button } from "@/components/ui/button";

const getProfileSlug = (user) => {
  const rawValue =
    user?.slug ||
    user?.username ||
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "";

  return String(rawValue)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
};

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dashboardUserId = user?.id;
  const donateLink = useMemo(() => {
    const profileSlug = getProfileSlug(user);

    if (!profileSlug || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/${profileSlug}`;
  }, [user]);

  const copyLink = async () => {
    if (!donateLink) {
      toast.error("User profile link is not ready yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(donateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy donate page link");
    }
  };

  useEffect(() => {
    let active = true;

    async function loadDonations() {
      if (isAuthLoading) {
        setIsLoading(true);
        return;
      }

      if (!dashboardUserId) {
        setDonations([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await fetchDonationHistory(dashboardUserId);

      if (!active) {
        return;
      }

      setDonations(
        [...result].sort(
          (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
        )
      );
      setIsLoading(false);
    }

    loadDonations();

    return () => {
      active = false;
    };
  }, [dashboardUserId, isAuthLoading]);

  const completedDonations = useMemo(
    () => donations.filter((item) => item?.status === "COMPLETED"),
    [donations]
  );

  const totalEarnings = useMemo(
    () => completedDonations.reduce((sum, item) => sum + Number(item?.amount || 0), 0),
    [completedDonations]
  );

  const todayEarnings = useMemo(() => {
    const now = new Date();
    return completedDonations
      .filter((item) => {
        const date = new Date(item?.createdAt);
        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, item) => sum + Number(item?.amount || 0), 0);
  }, [completedDonations]);

  const recentDonations = useMemo(() => completedDonations.slice(0, 5), [completedDonations]);

  const formatMoney = (value) =>
    `฿${Number(value || 0).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const openDonatePage = () => {
    if (!donateLink) {
      toast.error("User profile link is not ready yet");
      return;
    }

    window.open(donateLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-4 md:p-6"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 shadow-lg shadow-cyan-500/25">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Your Donate Page</h3>
              <p className="text-sm text-slate-400">Share this link with your audience</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/80 px-4 py-2.5 md:flex-none">
              <span className="truncate font-mono text-sm text-cyan-400">
                {donateLink || "Loading profile link..."}
              </span>
            </div>
            <Button
              onClick={copyLink}
              disabled={!donateLink}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-400"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              onClick={openDonatePage}
              disabled={!donateLink}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={formatMoney(totalEarnings)}
          subtitle={isLoading ? "Loading..." : "All time revenue"}
          icon={Wallet}
          gradient="from-cyan-500 to-blue-500"
          delay={0}
        />
        <StatCard
          title="Earnings Today"
          value={formatMoney(todayEarnings)}
          subtitle={isLoading ? "Loading..." : "Since midnight"}
          icon={TrendingUp}
          gradient="from-purple-500 to-pink-500"
          delay={0.1}
        />
        <div className="md:col-span-2 lg:col-span-1">
          <VisitsWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DonationChart donations={completedDonations} />
        </div>
        <div className="xl:col-span-1">
          <RecentDonations donations={recentDonations} />
        </div>
      </div>
    </div>
  );
}
