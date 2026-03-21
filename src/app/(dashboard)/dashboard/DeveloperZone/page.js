"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Webhook, 
  MessageCircle, 
  Send, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Check, 
  AlertTriangle,
  Zap,
  Crown,
  Star,
  Rocket,
  TestTube,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const integrations = [
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    color: 'from-indigo-500 to-purple-500',
    enabled: false,
    webhookUrl: '',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '✈️',
    color: 'from-blue-400 to-cyan-400',
    enabled: false,
    webhookUrl: '',
  },
  {
    id: 'line',
    name: 'LINE',
    icon: '💬',
    color: 'from-green-400 to-emerald-400',
    enabled: false,
    webhookUrl: '',
  },
];

const statusTiers = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    features: ['5 Webhook Events/day', 'Basic API Access', 'Standard Support'],
    price: 'Free',
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Star,
    color: 'from-cyan-500 to-blue-500',
    features: ['Unlimited Webhooks', 'Full API Access', 'Priority Support', 'Custom Branding'],
    price: '฿199/mo',
    current: false,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    icon: Crown,
    color: 'from-amber-500 to-orange-500',
    features: ['Everything in Pro', 'White-label Solution', 'Dedicated Support', 'Custom Integration'],
    price: '฿499/mo',
    current: false,
  },
];

export default function DeveloperZone() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhooks, setWebhooks] = useState(integrations);
  const [testAmount, setTestAmount] = useState('100');
  const [testName, setTestName] = useState('Tester');
  const [testMessage, setTestMessage] = useState('Test donation message!');
  const apiKey = 'ed_live_sk_xxxxxxxxxxxxxxxxxxxxx';

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key copied!",
      description: "Your API key has been copied to clipboard.",
    });
  };

  const toggleWebhook = (id) => {
    setWebhooks(prev =>
      prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w)
    );
  };

  const updateWebhookUrl = (id, url) => {
    setWebhooks(prev =>
      prev.map(w => w.id === id ? { ...w, webhookUrl: url } : w)
    );
  };

  const sendTestDonation = () => {
    toast({
      title: "Test donation sent!",
      description: `Simulated a ฿${testAmount} donation from ${testName}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Status Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Developer Tiers</h2>
            <p className="text-slate-400 text-sm">Unlock more features with higher tiers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl border p-5 transition-all duration-300 ${
                tier.current 
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50' 
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {tier.current && (
                <Badge className="absolute -top-2 right-4 bg-cyan-500 text-white">Current</Badge>
              )}
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                <tier.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-2xl font-bold text-cyan-400 mb-4">{tier.price}</p>
              
              <ul className="space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              {!tier.current && (
                <Button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white">
                  Upgrade
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* API Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">API Access</h2>
            <p className="text-slate-400 text-sm">Integrate EasyDonate with your applications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">API Key</Label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <code className="flex-1 text-cyan-400 font-mono text-sm">
                  {showApiKey ? apiKey : '••••••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <Button
                onClick={copyApiKey}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-amber-200 text-sm">
              Keep your API key secret. Do not share it publicly or commit it to version control.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Regenerate Key
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              View Documentation
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Webhook Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <Webhook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Webhook Notification</h2>
              <p className="text-slate-400 text-sm">Get real-time notifications when you receive donations</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {webhooks.map((webhook, index) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`rounded-xl border transition-all duration-300 ${
                webhook.enabled
                  ? 'bg-slate-800/80 border-cyan-500/30'
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${webhook.color} flex items-center justify-center text-2xl`}>
                      {webhook.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{webhook.name}</h3>
                      <p className="text-slate-500 text-sm">
                        {webhook.enabled ? 'Notifications enabled' : 'Not configured'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={webhook.enabled}
                    onCheckedChange={() => toggleWebhook(webhook.id)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                  />
                </div>

                {webhook.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={webhook.webhookUrl}
                          onChange={(e) => updateWebhookUrl(webhook.id, e.target.value)}
                          placeholder={`Enter your ${webhook.name} webhook URL`}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                        <Check className="w-3 h-3 mr-1" />
                        New Donation
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        Refunds
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        Milestones
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <h4 className="text-white font-medium mb-2">Custom Webhook</h4>
          <p className="text-slate-500 text-sm mb-4">Add a custom webhook endpoint for advanced integrations</p>
          <Button variant="outline" className="border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Webhook
          </Button>
        </div>
      </motion.div>

      {/* Donate Testing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Donate Testing</h2>
            <p className="text-slate-400 text-sm">Test your donation alerts and webhooks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Donor Name</Label>
            <Input
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Test Donor"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Amount (฿)</Label>
            <Input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              placeholder="100"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Message</Label>
            <Input
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Test message"
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={sendTestDonation}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
          >
            <Play className="w-4 h-4 mr-2" />
            Send Test Donation
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Test Webhook
          </Button>
        </div>
      </motion.div>

      {/* Events Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Events</h2>
            <p className="text-slate-400 text-sm">Webhook delivery history</p>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 bg-slate-800/80 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Events</SelectItem>
              <SelectItem value="success" className="text-white hover:bg-slate-700">Success</SelectItem>
              <SelectItem value="failed" className="text-white hover:bg-slate-700">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-slate-500" />
          </div>
          <h4 className="text-white font-medium mb-2">No events yet</h4>
          <p className="text-slate-500 text-sm max-w-xs">
            Events will appear here once you start receiving donations with webhooks enabled
          </p>
        </div>
      </motion.div>
    </div>
  );
}