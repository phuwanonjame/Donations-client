"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from './components/navigation/Sidebar';
import Header from './components/navigation/Header';
import { ToastProvider } from "@/components/ui/use-toast";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const event = new CustomEvent('sidebarToggle', { 
      detail: { collapsed: sidebarCollapsed } 
    });
    window.dispatchEvent(event);
  }, [sidebarCollapsed]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      <ToastProvider>
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onToggle={handleSidebarToggle}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header 
              onMenuClick={() => setSidebarOpen(true)} 
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={handleSidebarToggle}
            />
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="w-full h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </div>
    
  );
}