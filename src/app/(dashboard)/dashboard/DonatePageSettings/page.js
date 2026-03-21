"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, MessageSquare, Filter, Check, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const themes = [
  {
    id: 'v2-default',
    name: 'V2 Default',
    preview: 'from-slate-900 via-slate-800 to-slate-900',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'aquamarine',
    name: 'AquaMarine',
    preview: 'from-teal-900 via-cyan-900 to-slate-900',
    accent: 'from-teal-400 to-cyan-400',
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    preview: 'from-purple-900 via-violet-900 to-slate-900',
    accent: 'from-purple-500 to-pink-500',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    preview: 'from-orange-900 via-red-900 to-slate-900',
    accent: 'from-orange-500 to-red-500',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    preview: 'from-emerald-900 via-green-900 to-slate-900',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink',
    preview: 'from-pink-900 via-rose-900 to-slate-900',
    accent: 'from-pink-500 to-rose-500',
  },
];

const filterSettings = [
  { id: 'profanity', name: 'Block Profanity', description: 'Filter out inappropriate language', enabled: true },
  { id: 'links', name: 'Block Links', description: 'Prevent URLs in donation messages', enabled: true },
  { id: 'spam', name: 'Spam Detection', description: 'Automatically filter spam messages', enabled: false },
  { id: 'anonymous', name: 'Allow Anonymous', description: 'Let donors hide their name', enabled: true },
];

export default function DonatePageSettings() {
  const [selectedTheme, setSelectedTheme] = useState('v2-default');
  const [filters, setFilters] = useState(filterSettings);
  const [minAmount, setMinAmount] = useState([20]);

  const toggleFilter = (id) => {
    setFilters(prev =>
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Theme Selection</h2>
            <p className="text-slate-400 text-sm">Choose a visual style for your donate page</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {themes.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative group rounded-xl overflow-hidden aspect-[4/5] transition-all duration-300 ${
                selectedTheme === theme.id
                  ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900'
                  : 'hover:scale-105'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.preview}`} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.accent} mb-3 shadow-lg`} />
                <div className="w-full space-y-1.5">
                  <div className="h-2 bg-white/20 rounded-full" />
                  <div className="h-2 bg-white/10 rounded-full w-2/3" />
                </div>
              </div>
              
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                  <Check className="w-4 h-4 text-slate-900" />
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-medium text-center">{theme.name}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white mr-3">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white">
            Apply Theme
          </Button>
        </div>
      </motion.div>

      {/* Page Customization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Page Customization</h2>
          <p className="text-slate-400 text-sm">Personalize your donation page content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Page Title</Label>
            <Input
              placeholder="Support my content!"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Minimum Donation (฿)</Label>
            <div className="pt-2">
              <Slider
                value={minAmount}
                onValueChange={setMinAmount}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-slate-500 text-sm">฿{minAmount}</span>
                <span className="text-slate-500 text-sm">Max: ฿100</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-slate-300">Welcome Message</Label>
            <Textarea
              placeholder="Thank you for supporting my channel! Every donation helps me create better content..."
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Message Filtering */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Message Filtering</h2>
            <p className="text-slate-400 text-sm">Control what messages appear on your page</p>
          </div>
        </div>

        <div className="grid gap-4">
          {filters.map((filter, index) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${filter.enabled ? 'bg-cyan-400' : 'bg-slate-600'} transition-colors`} />
                <div>
                  <h4 className="text-white font-medium">{filter.name}</h4>
                  <p className="text-slate-500 text-sm">{filter.description}</p>
                </div>
              </div>
              <Switch
                checked={filter.enabled}
                onCheckedChange={() => toggleFilter(filter.id)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}