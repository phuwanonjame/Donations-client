"use client";
import React, { useState } from 'react';
import Sidebar from './components/navigation/Sidebar';
import Header from './components/navigation/Header';

const pageTitles = {
  Dashboard: 'Dashboard Overview',
  Widgets: 'Stream Widgets',
  ManageAccount: 'Manage Account',
  PaymentSettings: 'Payment Channels',
  DonatePageSettings: 'Donate Page Settings',
  DonateAlertSettings: 'Donate Alert Settings',
  DonateGoalSettings: 'Donate Goal Settings',
  LeaderboardSettings: 'Leaderboard Settings',
  TopDonateSettings: 'Top Donate Settings',
  RecentDonateSettings: 'Recent Donate Settings',
  GiftAlertSettings: 'Gift Alert Settings',
  DeveloperZone: 'Developer Zone',
  SubscriptionHistory: 'My Package',
  Withdraw: 'Withdraw',
  EarningHistory: 'Earning History',
};

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 192 100% 50%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 192 100% 50%;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }
        
        *::-webkit-scrollbar {
          width: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
      
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          currentPage={currentPageName} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
            title={pageTitles[currentPageName] || 'Dashboard'}
          />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}