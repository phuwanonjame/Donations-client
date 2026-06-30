"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";
import { fetchDonationHistory } from "@/actions/Donationsapi/donationHistoryApi";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import DonationChart from "../components/dashboard/DonationChart";
import RecentDonations from "../components/dashboard/RecentDonations";
import VisitsWidget from "../components/dashboard/VisitsWidget";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dashboardUserId = user?.id;

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

  return (
    <div className="space-y-6">
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
