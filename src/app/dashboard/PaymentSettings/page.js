"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, Check, AlertCircle, Gift, Handshake, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const paymentChannels = [
  {
    id: 'promptpay',
    name: 'PromptPay',
    icon: Smartphone,
    description: 'Instant transfers via PromptPay QR',
    gradient: 'from-blue-500 to-cyan-500',
    enabled: true,
    fee: '0%',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct bank account transfers',
    gradient: 'from-emerald-500 to-teal-500',
    enabled: false,
    fee: '0%',
  },
  {
    id: 'truemoney',
    name: 'TrueMoney Wallet',
    icon: Wallet,
    description: 'Accept TrueMoney Wallet payments',
    gradient: 'from-orange-500 to-red-500',
    enabled: false,
    fee: '2.9%',
  },
];

const partnerPayments = [
  {
    id: 'feelfreepay',
    name: 'Feel Free Pay',
    description: 'Alternative payment gateway',
    icon: Handshake,
    gradient: 'from-violet-500 to-purple-600',
    enabled: false,
    isPro: true,
  },
];

const giftOptions = [
  {
    id: 'gift-donate',
    name: 'Donate via Gift',
    description: 'Allow supporters to send virtual gifts',
    icon: Gift,
    gradient: 'from-pink-500 to-rose-500',
    enabled: false,
  },
];

const banks = [
  'Bangkok Bank',
  'Kasikorn Bank',
  'Siam Commercial Bank',
  'Krung Thai Bank',
  'Bank of Ayudhya',
  'TMBThanachart Bank',
];

export default function PaymentSettings() {
  const [channels, setChannels] = useState(paymentChannels);
  const [partners, setPartners] = useState(partnerPayments);
  const [gifts, setGifts] = useState(giftOptions);

  const toggleChannel = (id, type = 'channel') => {
    if (type === 'channel') {
      setChannels(prev => 
        prev.map(ch => ch.id === id ? { ...ch, enabled: !ch.enabled } : ch)
      );
    } else if (type === 'partner') {
      setPartners(prev => 
        prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
      );
    } else if (type === 'gift') {
      setGifts(prev => 
        prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Payment Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Payment Channels</h2>
            <p className="text-slate-400 text-sm">Enable the payment methods you want to accept</p>
          </div>
        </div>

        <div className="grid gap-4">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                channel.enabled 
                  ? 'bg-slate-800/80 border-cyan-500/30' 
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${channel.gradient} ${channel.enabled ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${channel.gradient} ${channel.enabled ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                    <channel.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${channel.enabled ? 'text-white' : 'text-slate-400'} transition-colors`}>
                        {channel.name}
                      </h3>
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                        Fee: {channel.fee}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-sm">{channel.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {channel.enabled && (
                    <span className="flex items-center gap-1 text-cyan-400 text-sm">
                      <Check className="w-4 h-4" />
                      Active
                    </span>
                  )}
                  <Switch
                    checked={channel.enabled}
                    onCheckedChange={() => toggleChannel(channel.id, 'channel')}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Partner Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Partner Payment</h2>
            <p className="text-slate-400 text-sm">Additional payment gateways from our partners</p>
          </div>
        </div>

        <div className="grid gap-4">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                partner.enabled 
                  ? 'bg-slate-800/80 border-violet-500/30' 
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${partner.gradient} ${partner.enabled ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${partner.gradient} ${partner.enabled ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                    <partner.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${partner.enabled ? 'text-white' : 'text-slate-400'} transition-colors`}>
                        {partner.name}
                      </h3>
                      {partner.isPro && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                          PRO
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm">{partner.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={partner.enabled}
                  onCheckedChange={() => toggleChannel(partner.id, 'partner')}
                  disabled={partner.isPro}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-purple-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Donate via Gift */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Donate via Gift</h2>
            <p className="text-slate-400 text-sm">Let supporters send virtual gifts with their donations</p>
          </div>
        </div>

        <div className="grid gap-4">
          {gifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                gift.enabled 
                  ? 'bg-slate-800/80 border-pink-500/30' 
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gift.gradient} ${gift.enabled ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gift.gradient} ${gift.enabled ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                    <gift.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${gift.enabled ? 'text-white' : 'text-slate-400'} transition-colors`}>
                      {gift.name}
                    </h3>
                    <p className="text-slate-500 text-sm">{gift.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={gift.enabled}
                  onCheckedChange={() => toggleChannel(gift.id, 'gift')}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-rose-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {gifts[0].enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 rounded-xl bg-pink-500/10 border border-pink-500/20"
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {['🎁', '💎', '🌟', '🎉', '💖', '🔥'].map((emoji, i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-2xl hover:border-pink-500/50 cursor-pointer transition-colors">
                  {emoji}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Receiving Account Setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Receiving Account</h2>
            <p className="text-slate-400 text-sm">Set up your bank account to receive withdrawals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Bank</Label>
            <Select>
              <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {banks.map(bank => (
                  <SelectItem key={bank} value={bank.toLowerCase().replace(/\s/g, '-')} className="text-white hover:bg-slate-700">
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Account Number</Label>
            <Input 
              placeholder="Enter your account number"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Account Name</Label>
            <Input 
              placeholder="Account holder name"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">PromptPay ID</Label>
            <Input 
              placeholder="Phone number or ID card number"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-amber-200 text-sm">
            Make sure your account details are correct. Incorrect information may delay your withdrawals.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25">
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}