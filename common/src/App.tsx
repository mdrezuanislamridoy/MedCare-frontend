import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { FeaturedDoctors } from './components/FeaturedDoctors';
import { HowItWorks } from './components/HowItWorks';
import { ClinicsSection } from './components/ClinicsSection';
import { OnlineConsultation } from './components/OnlineConsultation';
import { Testimonials } from './components/Testimonials';
import { ForProviders } from './components/ForProviders';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-full w-full bg-canvas font-sans text-ink">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <SpecialtiesSection />
        <FeaturedDoctors />
        <HowItWorks />
        <ClinicsSection />
        <OnlineConsultation />
        <Testimonials />
        <ForProviders />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </div>);

}