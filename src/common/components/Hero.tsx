"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  StethoscopeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CalendarCheckIcon,
  StarIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { LandingStats, defaultStats } from '../services/landing.service';
import { specialties } from '../data/specialties';

interface HeroProps {
  onSearch?: (criteria: { doctorQuery?: string; specialty?: string; location?: string }) => void;
  onSpecialtySelect?: (specialty: string) => void;
  stats?: LandingStats;
}

export function Hero({ onSearch, onSpecialtySelect, stats = defaultStats }: HeroProps) {
  const [doctorQuery, setDoctorQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        doctorQuery,
        specialty: selectedSpecialty,
        location: locationQuery,
      });
    }
    const docSection = document.getElementById('doctors');
    if (docSection) {
      docSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePopularClick = (item: string) => {
    setSelectedSpecialty(item);
    if (onSpecialtySelect) {
      onSpecialtySelect(item);
    }
    const docSection = document.getElementById('doctors');
    if (docSection) {
      docSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-teal-50"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 lg:grid lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
            <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
            Every doctor licence-verified
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Find the Right Doctor. Book Your Appointment.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Discover verified doctors near you, compare specialists by experience, rating and fee,
            check real-time availability, and book your visit online in a couple of minutes — in
            clinic or by video.
          </p>

          <form
            className="mt-8 rounded-3xl border border-teal-100 bg-white p-3 shadow-lift"
            onSubmit={handleSubmit}
            aria-label="Search for a doctor"
          >
            <div className="grid gap-2 lg:grid-cols-3">
              <div className="px-3 py-2">
                <label htmlFor="search-doctor" className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Doctor
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-teal-600">
                    <SearchIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="search-doctor"
                    type="text"
                    value={doctorQuery}
                    onChange={(e) => setDoctorQuery(e.target.value)}
                    placeholder="Doctor name"
                    className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="px-3 py-2 lg:border-l lg:border-teal-100">
                <label htmlFor="search-specialty" className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Specialty
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-teal-600">
                    <StethoscopeIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <select
                    id="search-specialty"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full border-0 bg-transparent p-0 text-sm text-ink focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-3 py-2 lg:border-l lg:border-teal-100">
                <label htmlFor="search-location" className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Location
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-teal-600">
                    <MapPinIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="search-location"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City or Boston"
                    className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <SearchIcon className="h-4 w-4" />
              Find Doctors
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
            <span className="text-xs font-medium">Popular:</span>
            {['Cardiology', 'Dentistry', 'Pediatrics', 'Dermatology', 'Neurology'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handlePopularClick(item)}
                className="inline-flex items-center rounded-full bg-teal-50/80 px-2.5 py-0.5 text-xs font-medium text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="relative mt-14 lg:col-span-6 lg:mt-0"
        >
          <div className="overflow-hidden rounded-4xl border border-teal-100 bg-canvas shadow-lift">
            <img
              src="/c33bc54f-5822-40aa-a492-5a072799d232.jpg"
              alt="A doctor in a white coat speaking with a patient in a bright clinic consultation room"
              className="h-full w-full object-cover"
              width={1200}
              height={900}
            />
          </div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 left-4 hidden items-center gap-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-lift sm:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <CalendarCheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Appointment confirmed</p>
              <p className="text-xs text-ink-muted">Dr. Anjali Sharma · Today, 4:30 PM</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-5 right-4 hidden items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-lift sm:flex"
          >
            <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink">
              {stats.ratingAverage.toFixed(1)}{' '}
              <span className="font-normal text-ink-muted">· {stats.totalReviews.toLocaleString()} reviews</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}