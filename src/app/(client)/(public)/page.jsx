import FeaturesSection from '@/components/landing/FeaturesSection'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import PricingSection from '@/components/landing/PricingSection'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-[#0A1628]">
          <Header />
          <main>
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
          </main>
          <Footer />
        </div>
  )
}

export default page