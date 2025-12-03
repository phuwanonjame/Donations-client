import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import  LanguageProvider  from '../../providers/LanguageProvider';

export default function Landing() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A1628]">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}