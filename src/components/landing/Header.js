"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../providers/LanguageProvider";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About Me", href: "/about" },
    { name: t.nav.features, href: "#features" },
    { name: t.nav.pricing, href: "#pricing" },
    { name: t.nav.support, href: "#support" },
  ];

  const UserProfileOrLogin = (
    isLoading ? (
      <div className="h-8 w-20 animate-pulse rounded bg-gray-700/70"></div>
    ) : isAuthenticated ? (
      <Link href="/profile" className="group flex items-center gap-4">
        <div className="hidden h-6 w-px bg-cyan-500/25 md:block"></div>
        <Button
          variant="ghost"
          className="flex cursor-pointer items-center gap-2 text-white hover:bg-white/5"
        >
          <User className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold">{user.name || "Profile"}</span>
        </Button>
      </Link>
    ) : (
      <Link href="/login">
        <Button
          variant="ghost"
          className="cursor-pointer text-gray-300 hover:bg-white/5 hover:text-white"
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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#07111f]/72 backdrop-blur-xl border-b border-cyan-400/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${isScrolled ? "h-20" : "h-22"}`}>
          <Link href="#" className="group flex items-center gap-2">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/30 transition-shadow group-hover:shadow-cyan-500/50">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 opacity-30 blur group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              Stream<span className="text-cyan-400">Flow</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-gray-200 drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors hover:text-cyan-300"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-gray-200 drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors hover:text-cyan-300"
                >
                  {link.name}
                </a>
              )
            )}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />
            {UserProfileOrLogin}
            <Link href="/dashboard/">
              <Button className="cursor-pointer bg-gradient-to-r from-cyan-500 to-cyan-400 font-semibold text-[#0A1628] shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-400 hover:to-cyan-300 hover:shadow-cyan-500/40">
                {t.nav.getStarted}
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-200 drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)] hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-cyan-500/10 bg-[#07111f]/92 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-4 px-6 py-6">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block py-2 font-medium text-gray-300 transition-colors hover:text-cyan-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block py-2 font-medium text-gray-300 transition-colors hover:text-cyan-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              )}
              <div className="space-y-3 border-t border-gray-700/50 pt-4">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
                <Link href={isAuthenticated ? "/profile" : "/login"}>
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    {isAuthenticated ? (
                      <>
                        <User className="h-4 w-4 text-cyan-400" />
                        <span className="font-semibold">{user.name || "Profile"}</span>
                      </>
                    ) : (
                      t.nav.login
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard/">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 font-semibold text-[#0A1628] hover:from-cyan-400 hover:to-cyan-300">
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
