import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const WIDGET_SETTINGS_ROUTES = {
  DonateAlertSettings: "widgets/donate-alert-settings",
  DonateGoalSettings: "widgets/donate-goal-settings",
  LeaderboardSettings: "widgets/leaderboard-settings",
  TopDonateSettings: "widgets/top-donate-settings",
  RecentDonateSettings: "widgets/recent-donate-settings",
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(path) {
  if (!path || path === "Dashboard") {
    return "/dashboard/";
  }

  const normalizedPath = WIDGET_SETTINGS_ROUTES[path] || path;
  return "/dashboard/" + normalizedPath;
}
