"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Globe,
  Camera,
  Save,
  Shield,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SocialForm from '@/components/dashboard/account/social-form';
import ProfileDetailFrom from '@/components/dashboard/account/profile-detail-form';

export default function ManageAccount() {
  const [profile, setProfile] = useState({
    displayName: 'Creator',
    fullName: '',
    email: 'creator@example.com',
    phone: '',
    birthDate: '',
    bio: '',
    country: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    twitter: '',
    instagram: '',
    website: '',
  });

  const updateProfile = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-4 border-cyan-500/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-3xl text-white">
                {profile.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{profile.displayName || 'Creator'}</h2>
            <p className="text-slate-400">{profile.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                Free Plan
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                Verified
              </span>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
            <Camera className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <ProfileDetailFrom />

        {/* Social Media Links */}
        <SocialForm />
        
      </div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Security</h3>
            <p className="text-slate-400 text-sm">Manage your account security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-slate-500 text-sm">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Change
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-white font-medium">Two-Factor Auth</p>
                <p className="text-slate-500 text-sm">Not enabled</p>
              </div>
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Enable
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-8">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}