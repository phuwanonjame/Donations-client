"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext'; // 🌟 Import useAuth
import { useRouter } from 'next/navigation'; // สำหรับ App Router (ถ้าใช้ Pages Router ให้ใช้ 'next/router')

// Helper function to delete the 'token' cookie
const deleteTokenCookie = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
};

export default function Header({ onMenuClick, title }) {
  const { user, isLoading, refetchUser } = useAuth(); // 🌟 ดึงค่าจาก Context
  const router = useRouter();

  // ---------------------------------
  // 🔥 HANDLE LOGOUT
  // ---------------------------------
  const handleLogout = () => {
    deleteTokenCookie(); // ลบคุกกี้ Token
    
    // Clear user state and trigger re-fetch in AuthContext (optional but good practice)
    // โดยปกติการลบคุกกี้แล้วเรียก refetchUser จะทำให้ AuthContext ตั้งค่า user เป็น null
    // เนื่องจาก API /me จะตอบกลับด้วย 401
    refetchUser(); 
    
    // Redirect to login page
    router.push('/login'); 
  };

  // กำหนดชื่อผู้ใช้และสถานะ
  const userName = user?.name || "Guest";
  const userPlan = "Free Plan"; // สมมติว่า Plan มาจาก Context ใน user object (user?.plan)

  if (isLoading) {
    // 💡 แสดง Loading State ขณะที่กำลังตรวจสอบ Auth
    return (
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              <div className="h-4 w-32 mt-1 bg-slate-700/50 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-40 bg-slate-700/50 rounded-xl animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-slate-500 text-sm hidden sm:block">Welcome back, {userName}!</p> {/* 🌟 แสดงชื่อจริง */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-40"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-xl"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">{userName}</p> {/* 🌟 แสดงชื่อจริง */}
                  <p className="text-xs text-slate-500">{userPlan}</p> {/* 🌟 แสดง Plan จริง */}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white">
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                Subscription
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={handleLogout} // 🌟 เรียกใช้ฟังก์ชัน Logout
                className="hover:bg-slate-700 cursor-pointer text-red-400 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout 
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}