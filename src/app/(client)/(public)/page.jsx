import FeaturesSection from '@/components/landing/FeaturesSection'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import HeroSection from '@/components/landing/HeroSection'
import PlansSection from '@/components/landing/PlansSection'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlansSection />
      </main>
      <Footer />
    </div>
  )
}

export default page
