"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, User } from "lucide-react"; // Import 'User' icon
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../providers/LanguageProvider";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth(); // Use the auth context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.features, href: "#features" },
    { name: t.nav.pricing, href: "#pricing" },
    { name: t.nav.support, href: "#support" },
  ];

  const UserProfileOrLogin = (
    // Show a loading state or nothing while checking auth
    isLoading ? (
      <div className="w-20 h-8 rounded animate-pulse bg-gray-700"></div>
    ) : 
    // If logged in, show user name and a profile link
    isAuthenticated ? (
      <Link href="/profile" className="flex items-center gap-4 group">
        {/* Separator line for desktop */}
        <div className="hidden md:block h-6 w-px bg-cyan-500/30"></div> 
        <Button
          variant="ghost"
          className="text-white cursor-pointer hover:bg-white/5 flex items-center gap-2"
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">{user.name || "Profile"}</span> {/* Display user's name */}
        </Button>
      </Link>
    ) : (
      // If logged out, show the Login button
      <Link href="/login">
        <Button
          variant="ghost"
          className="text-gray-300 cursor-pointer hover:text-white hover:bg-white/5"
        >
          {t.nav.login}
        </Button>
      </Link>
    )
  );


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A1628]/90 backdrop-blur-xl border-b border-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Stream<span className="text-cyan-400">Flow</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {UserProfileOrLogin} {/* Use the new conditional component */}
            <Link href="/dashboard/Dashboard">
              <Button className="bg-gradient-to-r cursor-pointer from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628] font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
                {t.nav.getStarted}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Updated Login/Profile Link) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A1628]/95 backdrop-blur-xl border-t border-cyan-500/10"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-700/50">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
                
                {/* Mobile Login/Profile Link */}
                <Link href={isAuthenticated ? "/profile" : "/login"}>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2"
                  >
                    {isAuthenticated ? (
                       <>
                        <User className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold">{user.name || "Profile"}</span>
                      </>
                    ) : (
                      t.nav.login
                    )}
                  </Button>
                </Link>

                <Link href="/dashboard/Dashboard">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#0A1628] font-semibold">
                        {t.nav.getStarted}
                    </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}