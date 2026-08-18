"use client";

import React, { useState, useEffect } from 'react';
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
import { DoctorBookingModal } from './components/DoctorBookingModal';
import { Doctor } from './data/doctors';
import { Clinic } from './data/clinics';
import { landingService, LandingStats, defaultStats } from './services/landing.service';

export function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [stats, setStats] = useState<LandingStats>(defaultStats);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingInitialMode, setBookingInitialMode] = useState<'video' | 'in_person'>('video');

  useEffect(() => {
    let mounted = true;
    landingService.getLandingData().then((data) => {
      if (mounted) {
        if (data.doctors) setDoctors(data.doctors);
        if (data.clinics) setClinics(data.clinics);
        if (data.stats) setStats(data.stats);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleHeroSearch = (criteria: {
    doctorQuery?: string;
    specialty?: string;
    location?: string;
  }) => {
    if (criteria.specialty) {
      setSelectedSpecialty(criteria.specialty);
    } else {
      setSelectedSpecialty('All');
    }
    const combinedQuery = [criteria.doctorQuery, criteria.location]
      .filter(Boolean)
      .join(' ');
    setSearchQuery(combinedQuery);
  };

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSearchQuery('');
  };

  const handleViewClinicDoctors = (clinicId: string, clinicName: string) => {
    setSearchQuery(clinicName);
    const docSection = document.getElementById('doctors');
    if (docSection) {
      docSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookDoctor = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setBookingInitialMode(doctor.online ? 'video' : 'in_person');
  };

  const handleStartOnlineConsult = () => {
    // Find first online doctor or general online consult
    const onlineDoc = doctors.find((d) => d.online) || doctors[0];
    if (onlineDoc) {
      setBookingDoctor(onlineDoc);
      setBookingInitialMode('video');
    }
  };

  return (
    <div className="min-h-full w-full bg-canvas font-sans text-ink">
      <Navbar />
      <main>
        <Hero
          onSearch={handleHeroSearch}
          onSpecialtySelect={handleSpecialtySelect}
          stats={stats}
        />
        <TrustSection stats={stats} />
        <SpecialtiesSection onSelectSpecialty={handleSpecialtySelect} />
        <FeaturedDoctors
          doctors={doctors}
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={setSelectedSpecialty}
          searchQuery={searchQuery}
          onBookDoctor={handleBookDoctor}
        />
        <HowItWorks />
        <ClinicsSection
          clinics={clinics}
          onViewClinicDoctors={handleViewClinicDoctors}
        />
        <OnlineConsultation onStartOnlineConsult={handleStartOnlineConsult} />
        <Testimonials />
        <ForProviders />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />

      {/* Global Doctor Appointment Booking Modal */}
      <DoctorBookingModal
        doctor={bookingDoctor}
        isOpen={!!bookingDoctor}
        onClose={() => setBookingDoctor(null)}
        initialMode={bookingInitialMode}
      />
    </div>
  );
}
