import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  Wallet, 
  ArrowDownToLine, 
  History, 
  Palette, 
  Code, 
  CreditCard,
  ChevronRight,
  Sparkles,
  Package,
  Bell,
  Grid3X3,
  Crown
} from 'lucide-react';

const menuSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
      { name: 'All Widgets', icon: Grid3X3, page: 'Widgets' },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Manage Account', icon: User, page: 'ManageAccount' },
      { name: 'My Package', icon: Package, page: 'SubscriptionHistory' },
      { name: 'Plan History', icon: Crown, page: 'SubscriptionHistory' },
    ]
  },
  {
    title: 'Finance',
    items: [
      { name: 'Payment Channels', icon: CreditCard, page: 'PaymentSettings' },
      { name: 'Withdraw', icon: ArrowDownToLine, page: 'Withdraw' },
      { name: 'Earning History', icon: History, page: 'EarningHistory' },
    ]
  },
  {
    title: 'Customization',
    items: [
      { name: 'Page Design', icon: Palette, page: 'DonatePageSettings' },
      { name: 'Donate Alert', icon: Bell, page: 'DonateAlertSettings' },
      { name: 'Developer Zone', icon: Code, page: 'DeveloperZone' },
    ]
  }
];

export default function Sidebar({ currentPage, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 z-50 lg:hidden"
      >
        <div className="p-6 border-b border-slate-800/50">
         <Link href={createPageUrl('Dashboard')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                StreamFlow
              </h1>
              <p className="text-slate-500 text-xs">Creator Platform</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-88px)]">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <Link
                      key={item.name}
                      href={createPageUrl(item.page)}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors`} />
                      <span className="flex-1 font-medium text-sm">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </motion.aside>

      {/* Desktop Sidebar - Always visible */}
      <aside
        className="hidden lg:flex lg:flex-col w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 flex-shrink-0 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800/50">
          <Link href={createPageUrl('Dashboard')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                StreamFlow
              </h1>
              <p className="text-slate-500 text-xs">Creator Platform</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-88px)]">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <Link
                      key={item.name}
                      href={createPageUrl(item.page)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors`} />
                      <span className="flex-1 font-medium text-sm">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}