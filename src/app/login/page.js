'use client';

import React, { useMemo, useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { getSocialAuthUrl, loginService } from "@/app/services/authService/authService";

const t = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to manage donations, alerts, widgets, and creator settings.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Sign in",
    socialTitle: "Continue with",
    orSeparator: "or sign in with email",
    signupPrompt: "New to StreamFlow?",
    signUpLink: "Create an account"
  }
};

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.76-.07-1.49-.2-2.19H12v4.14h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.48Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.62-2.41l-3.23-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.4 13.91a6.02 6.02 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.33-2.59Z" />
    <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.82 1.5l2.87-2.87C16.95 2.99 14.69 2 12 2A10 10 0 0 0 3.07 7.5l3.33 2.59C7.19 7.73 9.4 5.97 12 5.97Z" />
  </svg>
);

const FacebookIcon = () => <span className="text-xl font-bold leading-none text-[#1877F2]">f</span>;
const StreamlabsIcon = () => (
  <svg className="h-6 w-6 text-[#80F5D2]" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M8.6878 1.3459a1.365 1.365 0 0 0-.2734.0058c-.528.066-1.0133.1616-1.4843.3086A10.0568 10.0568 0 0 0 .3208 8.2697c-.147.471-.2445.9583-.3105 1.4863-.091.734.431 1.4041 1.166 1.4961.734.091 1.404-.43 1.496-1.164.05-.406.119-.7316.209-1.0196A7.3736 7.3736 0 0 1 7.727 4.221c.288-.09.6145-.157 1.0195-.207.735-.092 1.255-.7631 1.164-1.4981a1.3394 1.3394 0 0 0-1.2226-1.17Zm4.0488 5.2226c-2.629 0-3.9432.0007-4.9472.5117A4.684 4.684 0 0 0 5.7406 9.131c-.512 1.004-.5117 2.3183-.5117 4.9473v4.289c0 1.502-.001 2.2542.291 2.8282.257.505.6679.9149 1.1719 1.1719.574.292 1.326.291 2.828.291h6.9706c2.628 0 3.9442.0012 4.9472-.5098a4.6883 4.6883 0 0 0 2.0507-2.0508c.512-1.004.5117-2.3182.5117-4.9472v-1.0723c0-2.629.0003-3.9433-.5117-4.9473a4.6883 4.6883 0 0 0-2.0507-2.0508c-1.003-.511-2.3193-.5117-4.9472-.5117zm.537 6.7051c.741 0 1.3399.5998 1.3399 1.3398v2.6836c0 .74-.5988 1.3399-1.3398 1.3399-.74 0-1.3418-.5999-1.3418-1.3399v-2.6836c0-.74.6018-1.3398 1.3418-1.3398zm5.3632 0c.74 0 1.3399.5998 1.3399 1.3398v2.6836c0 .74-.5999 1.3399-1.3399 1.3399-.741 0-1.3398-.5999-1.3398-1.3399v-2.6836c0-.74.5989-1.3398 1.3398-1.3398z" />
  </svg>
);

const socialProviders = [
  { provider: "google", label: "Google", icon: GoogleIcon },
  { provider: "facebook", label: "Facebook", icon: FacebookIcon },
  { provider: "streamlabs", label: "Streamlabs", icon: StreamlabsIcon },
];

const particles = [
  { left: 12, top: 18, duration: 4.2, delay: 0.2 },
  { left: 28, top: 72, duration: 3.5, delay: 1.1 },
  { left: 44, top: 24, duration: 4.8, delay: 0.8 },
  { left: 64, top: 66, duration: 3.9, delay: 1.6 },
  { left: 82, top: 32, duration: 4.4, delay: 0.5 },
  { left: 18, top: 52, duration: 4.1, delay: 2.0 },
  { left: 72, top: 14, duration: 3.7, delay: 1.3 },
  { left: 90, top: 78, duration: 4.9, delay: 0.9 },
];

const CustomButton = ({ children, className = '', variant = 'primary', size = 'default', ...props }) => {
  const base = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-[#0D1B2A]";
  const sizeClasses = size === 'lg' ? "px-6 py-3.5 text-base" : "px-4 py-2 text-sm";

  const types = {
    primary: "bg-cyan-400 text-[#07111F] shadow-lg shadow-cyan-500/25 hover:bg-cyan-300",
    link: "text-cyan-300 hover:text-white bg-transparent p-0 shadow-none"
  };

  return (
    <button className={`${base} ${sizeClasses} ${types[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SocialButton = ({ provider, label, icon: Icon }) => (
  <button
    type="button"
    onClick={() => {
      window.location.href = getSocialAuthUrl(provider);
    }}
    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-cyan-300/80 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
    aria-label={`Continue with ${label}`}
  >
    <Icon />
    <span>{label}</span>
  </button>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const particleVariants = useMemo(() => ({
    animate: { y: [-18, 18, -18], opacity: [0.18, 0.75, 0.18] }
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginService(email, password);
      const token = res?.data?.data?.token;
      const innerSuccess = res?.data?.success;
      const innerMessage = res?.data?.message;

      if (!innerSuccess) {
        if (innerMessage === "Email not verified") {
          alert("Your email is not verified yet. Please verify your email first.");
          window.location.href = `/register/verify?email=${email}`;
          return;
        }

        alert(innerMessage || "Login failed");
        return;
      }

      if (!token) {
        alert("Login success, but token was not provided by the server.");
        return;
      }

      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const secureFlag = isLocalhost ? '' : 'Secure;';
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      document.cookie = `token=${token}; path=/; SameSite=Strict; Expires=${expirationDate.toUTCString()}; ${secureFlag}`;
      window.location.href = "/dashboard/Dashboard";
    } catch (error) {
      alert(error.message || "Login failed due to API error or network issue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#07111F] px-4 py-8 text-white sm:px-8">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-300/50"
            style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
            variants={particleVariants}
            animate="animate"
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[34rem]"
        >
          <div className="rounded-2xl border border-cyan-300/15 bg-[#0D1B2A]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </div>
              <h1 className="text-3xl font-bold tracking-normal text-white">{t.login.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">{t.login.subtitle}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-300">{t.login.socialTitle}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {socialProviders.map((provider) => (
                  <SocialButton key={provider.provider} {...provider} />
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="h-px flex-1 bg-slate-700/80" />
                <span>{t.login.orSeparator}</span>
                <span className="h-px flex-1 bg-slate-700/80" />
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">{t.login.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/40 pl-10 pr-4 text-white outline-none transition focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">{t.login.passwordLabel}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/40 pl-10 pr-12 text-white outline-none transition focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800/80 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <CustomButton type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : (
                  <>
                    {t.login.loginButton}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </CustomButton>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-3 text-center text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
              <span className="text-slate-400">{t.login.signupPrompt}</span>
              <Link href="/register" className="font-semibold text-cyan-300 hover:text-white">
                {t.login.signUpLink}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
