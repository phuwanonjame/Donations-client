"use client";
import React, { useState } from 'react';
import Sidebar from './components/navigation/Sidebar';
import Header from './components/navigation/Header';
import { ToastProvider } from "@/components/ui/use-toast";


export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <ToastProvider>
  

        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </div>
  );
}
