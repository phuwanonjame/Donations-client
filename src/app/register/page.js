'use client';

import React, { useMemo, useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSocialAuthUrl, registerService, requestOtpService } from "../services/authService/authService";

const t = {
  register: {
    title: "Create your account",
    subtitle: "Set up your creator dashboard and start managing donation alerts.",
    nameLabel: "Full name",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    registerButton: "Create account",
    haveAccount: "Already have an account?",
    loginLink: "Sign in",
    orSeparator: "or create with email",
    socialTitle: "Sign up with",
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

const socialProviders = [
  { provider: "google", label: "Google", icon: GoogleIcon },
  { provider: "facebook", label: "Facebook", icon: FacebookIcon },
];

const particles = [
  { left: 10, top: 20, duration: 4.3, delay: 0.2 },
  { left: 24, top: 76, duration: 3.7, delay: 1.0 },
  { left: 42, top: 16, duration: 4.9, delay: 0.7 },
  { left: 60, top: 70, duration: 3.8, delay: 1.5 },
  { left: 78, top: 28, duration: 4.5, delay: 0.4 },
  { left: 88, top: 82, duration: 4.2, delay: 1.8 },
  { left: 16, top: 52, duration: 3.9, delay: 1.2 },
  { left: 72, top: 10, duration: 4.7, delay: 0.9 },
];

const CustomButton = ({ children, className = '', variant = 'primary', size = 'default', ...props }) => {
  const baseClasses = "rounded-xl font-semibold transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-[#0D1B2A]";
  const sizeClasses = size === 'lg' ? "px-6 py-3.5 text-base" : "px-4 py-2 text-sm";

  const variantClasses = {
    primary: "bg-cyan-400 text-[#07111F] shadow-lg shadow-cyan-500/25 hover:bg-cyan-300",
    link: "text-cyan-300 hover:text-white bg-transparent shadow-none p-0"
  }[variant];

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
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
    aria-label={`Sign up with ${label}`}
  >
    <Icon />
    <span>{label}</span>
  </button>
);

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const particleVariants = useMemo(() => ({
    animate: {
      y: [-18, 18, -18],
      opacity: [0.18, 0.75, 0.18],
    }
  }), []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const registerResult = await registerService({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (!registerResult.success) {
        alert(registerResult.data?.message || "Register failed");
        return;
      }

      await requestOtpService({ email: form.email });

      alert("Register successful! Please verify your OTP.");
      router.push(`/register/verify?email=${form.email}`);
    } catch (error) {
      alert(error.message || "Register failed");
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
          className="w-full max-w-[30rem]"
        >
          <div className="rounded-2xl border border-cyan-300/15 bg-[#0D1B2A]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </div>
              <h1 className="text-3xl font-bold tracking-normal text-white">{t.register.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">{t.register.subtitle}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-300">{t.register.socialTitle}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {socialProviders.map((provider) => (
                  <SocialButton key={provider.provider} {...provider} />
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="h-px flex-1 bg-slate-700/80" />
                <span>{t.register.orSeparator}</span>
                <span className="h-px flex-1 bg-slate-700/80" />
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">{t.register.nameLabel}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/40 pl-10 pr-4 text-white outline-none transition focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">{t.register.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/40 pl-10 pr-4 text-white outline-none transition focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">{t.register.passwordLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/40 pl-10 pr-4 text-white outline-none transition focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15"
                      placeholder="********"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">{t.register.confirmPasswordLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-700/80 bg-slate-950/40 pl-10 pr-4 text-white outline-none transition focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/15"
                      placeholder="********"
                      required
                    />
                  </div>
                </div>
              </div>

              <CustomButton
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : (
                  <>
                    {t.register.registerButton}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </CustomButton>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-3 text-center text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
              <span className="text-slate-400">{t.register.haveAccount}</span>
              <CustomButton variant="link" className="text-sm" onClick={() => router.push("/login")}>
                {t.register.loginLink}
              </CustomButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
