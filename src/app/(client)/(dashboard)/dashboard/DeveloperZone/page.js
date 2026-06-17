"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ClipboardList,
  Copy,
  Crown,
  Globe,
  LoaderCircle,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Trash2,
  Webhook,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { fetchPlanStatus } from "@/actions/Plansapi/plansApi";
import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  fetchWebhookDeliveryHistory,
  fetchWebhookEndpoints,
  fetchWebhookProfile,
  resendWebhookDelivery,
  updateWebhookEndpoint,
} from "@/actions/Webhooksapi/webhooksApi";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const WEBHOOK_LIMIT_BY_PLAN = {
  free: 1,
  lite: 1,
  pro: 3,
  ultra: 5,
};

const webhookTypeOptions = [
  {
    id: "STANDARD",
    name: "Standard Webhook",
    shortName: "Standard",
    description: "Generic webhook endpoint for your own backend or automation flow.",
    color: "from-cyan-500 to-blue-500",
    icon: Webhook,
    placeholder: "https://your-app.com/api/webhook",
  },
  {
    id: "DISCORD",
    name: "Discord",
    shortName: "Discord",
    description: "Send donation events straight into a Discord channel.",
    color: "from-indigo-500 to-violet-500",
    icon: MessageCircle,
    placeholder: "https://discord.com/api/webhooks/...",
  },
  {
    id: "TELEGRAM",
    name: "Telegram",
    shortName: "Telegram",
    description: "Trigger notifications into a Telegram bot or relay service.",
    color: "from-sky-500 to-cyan-400",
    icon: Send,
    placeholder: "https://api.telegram.org/bot...",
  },
];

const statusTiers = [
  {
    id: "free",
    name: "Basic",
    icon: Zap,
    color: "from-slate-500 to-slate-600",
    price: "Free",
    current: true,
  },
  {
    id: "lite",
    name: "Lite",
    icon: Sparkles,
    color: "from-cyan-500 to-teal-400",
    price: "THB 29/mo",
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Star,
    color: "from-cyan-500 to-blue-500",
    price: "THB 199/mo",
    current: false,
  },
  {
    id: "ultra",
    name: "Ultra",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    price: "THB 499/mo",
    current: false,
  },
];

const sampleWebhookPayload = {
  event: "donation.completed",
  timestamp: "2026-06-13T10:30:00.000Z",
  data: {
    id: "don_123456",
    userId: "usr_123456",
    donorName: "Tester",
    amount: 100,
    currency: "THB",
    message: "Test donation message!",
    paymentMethod: "PROMPTPAY",
    status: "COMPLETED",
    createdAt: "2026-06-13T10:29:48.000Z",
  },
};

const getWebhookConfig = (typeId) =>
  webhookTypeOptions.find((item) => item.id === typeId) || webhookTypeOptions[0];

const createDefaultWebhookName = (typeId) => `${getWebhookConfig(typeId).shortName} Hook`;

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const mapEndpointToViewModel = (endpoint) => ({
  id: endpoint.id,
  type: endpoint.type,
  name: endpoint.name,
  webhookUrl: endpoint.url,
  enabled: endpoint.isEnabled,
  description: endpoint.description || "",
  eventType: endpoint.eventType,
  events: ["donation.completed"],
});

const formatAmount = (amount, currency) => {
  const numericAmount = typeof amount === "number" ? amount : Number(amount || 0);

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: currency || "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
};

const formatDeliveryTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const formatJson = (value) => {
  if (!value) {
    return "{}";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export default function DeveloperZone() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [webhooks, setWebhooks] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedWebhookType, setSelectedWebhookType] = useState(webhookTypeOptions[0].id);
  const [createWebhookName, setCreateWebhookName] = useState(createDefaultWebhookName(webhookTypeOptions[0].id));
  const [createWebhookUrl, setCreateWebhookUrl] = useState("");
  const [planStatus, setPlanStatus] = useState(null);
  const [webhookDeliveries, setWebhookDeliveries] = useState([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);
  const [hasLoadedWebhooks, setHasLoadedWebhooks] = useState(false);
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [pendingWebhookActionIds, setPendingWebhookActionIds] = useState([]);
  const [pendingDeliveryActionIds, setPendingDeliveryActionIds] = useState([]);
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const developerUserId = user?.id;

  const loadWebhookDeliveries = async (userId, limit = 20) => {
    const deliveries = await fetchWebhookDeliveryHistory(userId, limit);
    setWebhookDeliveries(deliveries || []);
  };

  useEffect(() => {
    let active = true;

    async function loadPlanStatus() {
      if (isAuthLoading || !developerUserId) {
        return;
      }

      const result = await fetchPlanStatus(developerUserId);

      if (!active) {
        return;
      }

      setPlanStatus(result);
    }

    loadPlanStatus();

    return () => {
      active = false;
    };
  }, [developerUserId, isAuthLoading]);

  useEffect(() => {
    let active = true;

    async function loadWebhookData() {
      if (isAuthLoading || !developerUserId) {
        return;
      }

      setIsLoadingWebhooks(true);

      try {
        const [, endpoints, deliveries] = await Promise.all([
          fetchWebhookProfile(developerUserId),
          fetchWebhookEndpoints(developerUserId),
          fetchWebhookDeliveryHistory(developerUserId, 20),
        ]);

        if (!active) {
          return;
        }

        setWebhooks((endpoints || []).map(mapEndpointToViewModel));
        setWebhookDeliveries(deliveries || []);
        setHasLoadedWebhooks(true);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error("Failed to load webhook data:", error);
        toast.error("Failed to load webhooks", {
          description: error instanceof Error ? error.message : "Unable to load webhook settings.",
        });
      } finally {
        if (active) {
          setIsLoadingWebhooks(false);
        }
      }
    }

    loadWebhookData();

    return () => {
      active = false;
    };
  }, [developerUserId, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading || !developerUserId) {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      try {
        await loadWebhookDeliveries(developerUserId);
      } catch (error) {
        console.error("Failed to refresh webhook deliveries:", error);
      }
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [developerUserId, isAuthLoading]);

  useEffect(() => {
    setCreateWebhookName(createDefaultWebhookName(selectedWebhookType));
    setCreateWebhookUrl("");
  }, [selectedWebhookType]);

  const resolvedCurrentPlan = planStatus?.currentPlan || planStatus?.freeFallback || null;
  const currentPlanCode = resolvedCurrentPlan?.code?.toLowerCase?.() || "free";
  const webhookLimit = WEBHOOK_LIMIT_BY_PLAN[currentPlanCode] ?? WEBHOOK_LIMIT_BY_PLAN.free;
  const isWebhookIdPending = (id) => pendingWebhookActionIds.includes(id);
  const isDeliveryIdPending = (id) => pendingDeliveryActionIds.includes(id);
  const selectedWebhookConfig = useMemo(
    () => getWebhookConfig(selectedWebhookType),
    [selectedWebhookType]
  );
  const filteredWebhookDeliveries = useMemo(() => {
    if (deliveryFilter === "success") {
      return webhookDeliveries.filter((item) => item.status === "SUCCESS");
    }

    if (deliveryFilter === "failed") {
      return webhookDeliveries.filter((item) => item.status === "FAILED");
    }

    return webhookDeliveries;
  }, [deliveryFilter, webhookDeliveries]);
  const resolvedStatusTiers = useMemo(
    () =>
      statusTiers.map((tier) => ({
        ...tier,
        current: tier.id === currentPlanCode,
      })),
    [currentPlanCode]
  );

  const copySamplePayload = async () => {
    await navigator.clipboard.writeText(JSON.stringify(sampleWebhookPayload, null, 2));
    toast.success("Payload copied", {
      description: "Webhook sample payload has been copied to clipboard.",
    });
  };

  const openCreateWebhookDialog = () => {
    if (webhooks.length >= webhookLimit) {
      toast.error("Webhook limit reached", {
        description: `Your ${currentPlanCode} plan can create up to ${webhookLimit} webhook${webhookLimit === 1 ? "" : "s"}.`,
      });
      return;
    }

    setSelectedWebhookType(webhookTypeOptions[0].id);
    setIsCreateDialogOpen(true);
  };

  const handleCreateWebhook = async () => {
    if (!developerUserId) {
      return;
    }

    if (!createWebhookName.trim()) {
      toast.error("Webhook name required", {
        description: "Add a webhook name before creating this webhook.",
      });
      return;
    }

    if (!createWebhookUrl.trim()) {
      toast.error("Webhook URL required", {
        description: "Add a destination URL before creating this webhook.",
      });
      return;
    }

    if (!isValidUrl(createWebhookUrl.trim())) {
      toast.error("Invalid webhook URL", {
        description: "Webhook URL must start with http:// or https://",
      });
      return;
    }

    if (webhooks.length >= webhookLimit) {
      toast.error("Webhook limit reached", {
        description: `Your ${currentPlanCode} plan can create up to ${webhookLimit} webhook${webhookLimit === 1 ? "" : "s"}.`,
      });
      return;
    }

    setIsCreatingWebhook(true);

    try {
      const created = await createWebhookEndpoint({
        userId: developerUserId,
        name: createWebhookName.trim() || createDefaultWebhookName(selectedWebhookType),
        type: selectedWebhookType,
        url: createWebhookUrl.trim(),
        eventType: "DONATION_COMPLETED",
        isEnabled: false,
      });

      setWebhooks((previous) => [...previous, mapEndpointToViewModel(created)]);
      setIsCreateDialogOpen(false);
      setCreateWebhookUrl("");

      toast.success("Webhook created", {
        description: `${selectedWebhookConfig.shortName} webhook has been added to your workspace.`,
      });
    } catch (error) {
      console.error("Failed to create webhook:", error);
      toast.error("Failed to create webhook", {
        description: error instanceof Error ? error.message : "Unable to create webhook.",
      });
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const updateWebhookField = (id, key, value) => {
    setWebhooks((previous) =>
      previous.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const startWebhookAction = (id) => {
    setPendingWebhookActionIds((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  const finishWebhookAction = (id) => {
    setPendingWebhookActionIds((previous) => previous.filter((item) => item !== id));
  };

  const startDeliveryAction = (id) => {
    setPendingDeliveryActionIds((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  const finishDeliveryAction = (id) => {
    setPendingDeliveryActionIds((previous) => previous.filter((item) => item !== id));
  };

  const toggleWebhook = async (id) => {
    const target = webhooks.find((item) => item.id === id);

    if (!target || !developerUserId || isWebhookIdPending(id)) {
      return;
    }

    const nextEnabled = !target.enabled;
    startWebhookAction(id);
    updateWebhookField(id, "enabled", nextEnabled);

    try {
      await updateWebhookEndpoint(id, {
        userId: developerUserId,
        isEnabled: nextEnabled,
      });

      toast.success(nextEnabled ? "Webhook enabled" : "Webhook paused", {
        description: `${target.name} has been ${nextEnabled ? "enabled" : "paused"}.`,
      });
    } catch (error) {
      updateWebhookField(id, "enabled", target.enabled);
      console.error("Failed to toggle webhook:", error);
      toast.error("Failed to update webhook", {
        description: error instanceof Error ? error.message : "Unable to update webhook status.",
      });
    } finally {
      finishWebhookAction(id);
    }
  };

  const removeWebhook = async (id) => {
    if (!developerUserId || isWebhookIdPending(id)) {
      return;
    }

    const existing = webhooks.find((item) => item.id === id);
    startWebhookAction(id);

    try {
      await deleteWebhookEndpoint(id, developerUserId);
      setWebhooks((previous) => previous.filter((item) => item.id !== id));
      toast.success("Webhook removed", {
        description: existing?.name
          ? `${existing.name} has been deleted.`
          : "The webhook configuration has been deleted.",
      });
    } catch (error) {
      console.error("Failed to delete webhook:", error);
      toast.error("Failed to remove webhook", {
        description: error instanceof Error ? error.message : "Unable to delete webhook.",
      });
    } finally {
      finishWebhookAction(id);
    }
  };

  const saveWebhook = async (webhook) => {
    if (!developerUserId || isWebhookIdPending(webhook.id)) {
      return;
    }

    if (!webhook.name.trim()) {
      toast.error("Webhook name required", {
        description: "Add a webhook name before saving this webhook.",
      });
      return;
    }

    if (!webhook.webhookUrl.trim()) {
      toast.error("Webhook URL required", {
        description: "Add a destination URL before saving this webhook.",
      });
      return;
    }

    if (!isValidUrl(webhook.webhookUrl.trim())) {
      toast.error("Invalid webhook URL", {
        description: "Webhook URL must start with http:// or https://",
      });
      return;
    }

    startWebhookAction(webhook.id);

    try {
      const updated = await updateWebhookEndpoint(webhook.id, {
        userId: developerUserId,
        name: webhook.name.trim(),
        url: webhook.webhookUrl.trim(),
        type: webhook.type,
        eventType: "DONATION_COMPLETED",
        isEnabled: webhook.enabled,
      });

      setWebhooks((previous) =>
        previous.map((item) => (item.id === webhook.id ? mapEndpointToViewModel(updated) : item))
      );

      toast.success("Webhook saved", {
        description: `${webhook.name} is ready to receive donation events.`,
      });
    } catch (error) {
      console.error("Failed to save webhook:", error);
      toast.error("Failed to save webhook", {
        description: error instanceof Error ? error.message : "Unable to save webhook.",
      });
    } finally {
      finishWebhookAction(webhook.id);
    }
  };

  const handleOpenDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setIsDeliveryDialogOpen(true);
  };

  const handleResendDelivery = async (deliveryId) => {
    if (!developerUserId || isDeliveryIdPending(deliveryId)) {
      return;
    }

    startDeliveryAction(deliveryId);

    try {
      const resentDelivery = await resendWebhookDelivery(deliveryId, developerUserId);

      await loadWebhookDeliveries(developerUserId);

      if (selectedDelivery?.id === deliveryId && resentDelivery) {
        setSelectedDelivery(resentDelivery);
      }

      toast.success("Webhook resent", {
        description: `Manual resend finished with status ${resentDelivery?.status || "UNKNOWN"}.`,
      });
    } catch (error) {
      console.error("Failed to resend webhook delivery:", error);
      toast.error("Failed to resend webhook", {
        description: error instanceof Error ? error.message : "Unable to resend this webhook delivery.",
      });
    } finally {
      finishDeliveryAction(deliveryId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Current Plan</h2>
                <p className="text-xs text-slate-400">Webhook quota and upgrades</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-3">
              {resolvedStatusTiers
                .filter((tier) => tier.current || WEBHOOK_LIMIT_BY_PLAN[tier.id] > webhookLimit)
                .map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border px-3 py-3 transition-all duration-300 ${
                      tier.current
                        ? "border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
                        : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600"
                    }`}
                  >
                    {tier.current && (
                      <Badge className="absolute -top-2 right-3 bg-cyan-500 px-2 py-0 text-[10px] text-white">
                        Current
                      </Badge>
                    )}

                    {!tier.current && (
                      <Button className="absolute right-3 top-3 h-7 rounded-full bg-slate-700 px-3 text-xs text-white hover:bg-slate-600">
                        Upgrade
                      </Button>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tier.color}`}
                      >
                        <tier.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-bold text-white">{tier.name}</h3>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-cyan-400">{tier.price}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-400">
                        {WEBHOOK_LIMIT_BY_PLAN[tier.id] ?? 0} slot
                        {(WEBHOOK_LIMIT_BY_PLAN[tier.id] ?? 0) === 1 ? "" : "s"}
                      </p>
                      <p className="text-xs text-slate-500">Webhook access</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3">
                  <Webhook className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Webhook Builder</h2>
                  <p className="text-sm text-slate-400">
                    Your current plan is {currentPlanCode}. You can create up to {webhookLimit} webhook
                    {webhookLimit === 1 ? "" : "s"}.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Badge className="justify-center border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-cyan-200">
                  {webhooks.length}/{webhookLimit} webhooks used
                </Badge>
                <Button
                  type="button"
                  onClick={openCreateWebhookDialog}
                  disabled={webhooks.length >= webhookLimit || isLoadingWebhooks}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Webhook
                </Button>
              </div>
            </div>

            {isLoadingWebhooks && !hasLoadedWebhooks ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
                <h4 className="text-lg font-semibold text-white">Loading webhooks...</h4>
                <p className="mt-2 text-sm text-slate-500">Fetching your webhook settings.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {webhooks.map((webhook, index) => {
                  const config = getWebhookConfig(webhook.type);
                  const Icon = config.icon;
                  const isPending = isWebhookIdPending(webhook.id);

                  return (
                    <motion.div
                      key={webhook.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.06 }}
                      className={`rounded-2xl border p-5 transition-all duration-300 ${
                        webhook.enabled
                          ? "border-cyan-500/30 bg-slate-800/80"
                          : "border-slate-700/50 bg-slate-800/30"
                      }`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${config.color}`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-white">{webhook.name}</h3>
                              <Badge
                                variant="outline"
                                className="border-slate-600 bg-slate-900/50 text-slate-300"
                              >
                                {config.shortName}
                              </Badge>
                              {webhook.enabled ? (
                                <Badge className="bg-emerald-500/15 text-emerald-300">Active</Badge>
                              ) : (
                                <Badge className="bg-slate-500/15 text-slate-300">Paused</Badge>
                              )}
                            </div>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                              {config.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch
                            checked={webhook.enabled}
                            onCheckedChange={() => toggleWebhook(webhook.id)}
                            disabled={isPending}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => removeWebhook(webhook.id)}
                            disabled={isPending}
                            className="border-rose-500/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr_auto]">
                        <div className="space-y-2">
                          <Label className="text-slate-400">Webhook Name</Label>
                          <Input
                            value={webhook.name}
                            onChange={(event) => updateWebhookField(webhook.id, "name", event.target.value)}
                            disabled={isPending}
                            placeholder="Webhook name"
                            className="border-slate-700 bg-slate-700/50 text-white placeholder:text-slate-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-400">Destination URL</Label>
                          <Input
                            value={webhook.webhookUrl}
                            onChange={(event) =>
                              updateWebhookField(webhook.id, "webhookUrl", event.target.value)
                            }
                            disabled={isPending}
                            placeholder={config.placeholder}
                            className="border-slate-700 bg-slate-700/50 text-white placeholder:text-slate-500"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => saveWebhook(webhook)}
                            disabled={isPending}
                            className="w-full bg-slate-700 text-white hover:bg-slate-600 lg:w-auto"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            {isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {webhook.events.map((eventName) => (
                          <Badge
                            key={`${webhook.id}-${eventName}`}
                            variant="outline"
                            className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                          >
                            <Check className="mr-1 h-3 w-3" />
                            {eventName}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!isLoadingWebhooks && hasLoadedWebhooks && webhooks.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
                <Globe className="mx-auto h-10 w-10 text-slate-500" />
                <h4 className="mt-4 text-lg font-semibold text-white">No webhooks created yet</h4>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first webhook and choose how donation completed events should be delivered.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Recent Events</h2>
                <p className="text-sm text-slate-400">Webhook delivery history</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadWebhookDeliveries(developerUserId)}
                  disabled={!developerUserId}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                  <SelectTrigger className="w-32 border-slate-700 bg-slate-800/80 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">
                    All Events
                  </SelectItem>
                  <SelectItem value="success" className="text-white hover:bg-slate-700">
                    Success
                  </SelectItem>
                  <SelectItem value="failed" className="text-white hover:bg-slate-700">
                    Failed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>

            {filteredWebhookDeliveries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50">
                  <MessageCircle className="h-8 w-8 text-slate-500" />
                </div>
                <h4 className="mb-2 text-white">No events yet</h4>
                <p className="max-w-xs text-sm text-slate-500">
                  Completed donation webhook deliveries will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredWebhookDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {delivery.webhookEndpoint?.name || "Webhook Endpoint"}
                          </p>
                          <Badge
                            className={
                              delivery.status === "SUCCESS"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : delivery.status === "FAILED"
                                  ? "bg-rose-500/15 text-rose-300"
                                  : "bg-amber-500/15 text-amber-300"
                            }
                          >
                            {delivery.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{delivery.webhookEndpoint?.url}</p>
                        <p className="mt-2 text-sm text-slate-300">
                          {delivery.donation?.donorName || "Anonymous"} sent{" "}
                          <span className="font-medium text-cyan-300">
                            {formatAmount(delivery.donation?.amount, delivery.donation?.currency)}
                          </span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">{formatDeliveryTime(delivery.createdAt)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          HTTP {delivery.responseStatus ?? "-"} | Attempt {delivery.attemptCount}
                        </p>
                      </div>
                    </div>

                    {delivery.lastError && (
                      <p className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                        {delivery.lastError}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenDelivery(delivery)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        View Details
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleResendDelivery(delivery.id)}
                        disabled={isDeliveryIdPending(delivery.id)}
                        className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 hover:text-white"
                      >
                        {isDeliveryIdPending(delivery.id) ? (
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="mr-2 h-4 w-4" />
                        )}
                        {isDeliveryIdPending(delivery.id) ? "Resending..." : "Resend"}
                      </Button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 p-3">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Webhook Docs</h2>
                  <p className="text-sm text-slate-400">
                    Reference payload structure and delivery format for integrations
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={copySamplePayload}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Payload
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                  <p className="text-sm font-semibold text-white">Delivery</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-400">
                    <p>
                      <span className="font-medium text-slate-200">Method:</span> POST
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">Content-Type:</span> application/json
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">Success response:</span> 200 OK
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">Event:</span> donation.completed
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">Retry policy:</span> 3 attempts, 8s timeout
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                  <p className="text-sm font-semibold text-white">Headers</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-400">
                    <p>
                      <span className="font-medium text-slate-200">x-webhook-event:</span> donation.completed
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">x-webhook-signature:</span> sha256=&lt;hmac&gt;
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">x-webhook-delivery-id:</span> unique delivery id
                    </p>
                    <p>
                      <span className="font-medium text-slate-200">Secret:</span> one signing secret per account
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
                <p className="text-sm font-semibold text-white">Simple Setup</p>
                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <p>1. Create a webhook endpoint and paste your destination URL.</p>
                  <p>2. Enable the webhook.</p>
                  <p>3. When a donation completes, we send a `POST` request with JSON automatically.</p>
                  <p>4. Your receiver can just read the JSON body and return any `2xx` response.</p>
                  <p>5. If something fails, you can inspect the log below and use Resend.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700/50 bg-[#07111F] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Sample Payload</p>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    JSON
                  </Badge>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-slate-950/70 p-4 text-xs leading-6 text-cyan-200">
                  {JSON.stringify(sampleWebhookPayload, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => loadWebhookDeliveries(developerUserId)}
              disabled={!developerUserId}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh Delivery Logs
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent className="border-white/10 bg-[#081221] text-white sm:max-w-3xl">
          <DialogHeader className="text-left">
            <DialogTitle>Webhook Delivery Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              Inspect request payload, response details, and replay this delivery if needed.
            </DialogDescription>
          </DialogHeader>

          {selectedDelivery ? (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Summary</p>
                  <div className="mt-3 space-y-2">
                    <p>Status: {selectedDelivery.status}</p>
                    <p>Endpoint: {selectedDelivery.webhookEndpoint?.name || "Webhook Endpoint"}</p>
                    <p>URL: {selectedDelivery.webhookEndpoint?.url || "-"}</p>
                    <p>Attempt Count: {selectedDelivery.attemptCount}</p>
                    <p>HTTP Status: {selectedDelivery.responseStatus ?? "-"}</p>
                    <p>Sent At: {formatDeliveryTime(selectedDelivery.createdAt)}</p>
                    <p>Delivered At: {formatDeliveryTime(selectedDelivery.deliveredAt)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Donation Context</p>
                  <div className="mt-3 space-y-2">
                    <p>Donation ID: {selectedDelivery.donation?.id || "-"}</p>
                    <p>Donor: {selectedDelivery.donation?.donorName || "Anonymous"}</p>
                    <p>
                      Amount: {formatAmount(selectedDelivery.donation?.amount, selectedDelivery.donation?.currency)}
                    </p>
                    <p>Payment Method: {selectedDelivery.donation?.paymentMethod || "-"}</p>
                    <p>Donation Status: {selectedDelivery.donation?.status || "-"}</p>
                    <p>Event: donation.completed</p>
                  </div>
                </div>
              </div>

              {selectedDelivery.lastError && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                  {selectedDelivery.lastError}
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/50 bg-[#07111F] p-4">
                  <p className="mb-3 text-sm font-semibold text-white">Request Payload</p>
                  <pre className="max-h-80 overflow-auto rounded-xl bg-slate-950/70 p-4 text-xs leading-6 text-cyan-200">
                    {formatJson(selectedDelivery.requestPayload)}
                  </pre>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-[#07111F] p-4">
                  <p className="mb-3 text-sm font-semibold text-white">Response Body</p>
                  <pre className="max-h-80 overflow-auto rounded-xl bg-slate-950/70 p-4 text-xs leading-6 text-cyan-200">
                    {selectedDelivery.responseBody || "No response body captured"}
                  </pre>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleResendDelivery(selectedDelivery.id)}
                  disabled={isDeliveryIdPending(selectedDelivery.id)}
                  className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 hover:text-white"
                >
                  {isDeliveryIdPending(selectedDelivery.id) ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                  )}
                  {isDeliveryIdPending(selectedDelivery.id) ? "Resending..." : "Resend Delivery"}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="border-white/10 bg-[#081221] text-white sm:max-w-xl">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-300 to-teal-200 text-slate-950">
              <Plus className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-semibold">Create a new webhook</DialogTitle>
            <DialogDescription className="text-sm leading-7 text-slate-300">
              Choose the webhook type you want to create. Your current {currentPlanCode} plan allows up to {webhookLimit} webhook destination
              {webhookLimit === 1 ? "" : "s"}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-3">
            {webhookTypeOptions.map((option) => {
              const Icon = option.icon;
              const active = selectedWebhookType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedWebhookType(option.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-cyan-400/50 bg-cyan-400/10"
                      : "border-slate-700/60 bg-slate-900/40 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${option.color}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{option.name}</span>
                        {active && <Badge className="bg-cyan-500 text-white">Selected</Badge>}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Webhook Name</Label>
              <Input
                value={createWebhookName}
                onChange={(event) => setCreateWebhookName(event.target.value)}
                placeholder="Webhook name"
                className="border-slate-700 bg-slate-900/40 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Destination URL</Label>
              <Input
                value={createWebhookUrl}
                onChange={(event) => setCreateWebhookUrl(event.target.value)}
                placeholder={selectedWebhookConfig.placeholder}
                className="border-slate-700 bg-slate-900/40 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
            <p className="text-sm font-medium text-white">Preview</p>
            <p className="mt-2 text-sm text-slate-400">
              The new webhook will be created as <span className="text-cyan-300">{selectedWebhookConfig.shortName}</span> and start in paused mode. Supported event:{" "}
              <span className="text-emerald-300">donation.completed</span>.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateWebhook}
              disabled={isCreatingWebhook}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isCreatingWebhook ? "Creating..." : "Create Webhook"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
