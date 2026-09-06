"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  SearchIcon,
  StarIcon,
  MapPinIcon,
  VideoIcon,
  BuildingIcon,
  ClockIcon,
  ShieldCheckIcon,
  FilterIcon,
  CheckIcon,
  ArrowRightIcon,
  CalendarCheckIcon,
  StethoscopeIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Navbar } from '@/src/common/components/Navbar';
import { Footer } from '@/src/common/components/Footer';
import { DoctorBookingModal } from '@/src/common/components/DoctorBookingModal';
import { Doctor, doctors as defaultDoctors } from '@/src/common/data/doctors';
import { landingService } from '@/src/common/services/landing.service';

const specialtiesList = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dentistry',
  'Gynecology',
  'General Medicine',
  'Psychiatry',
  'ENT Specialist',
  'Ophthalmology',
];

export default function DoctorsDirectoryPage() {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(defaultDoctors);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [consultMode, setConsultMode] = useState<'ALL' | 'ONLINE' | 'IN_PERSON'>('ALL');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Fetch dynamic doctors from backend API on mount
  useEffect(() => {
    let mounted = true;
    async function loadDoctors() {
      try {
        const data = await landingService.getLandingData();
        if (mounted && data.doctors && data.doctors.length > 0) {
          setDoctorsList(data.doctors);
        }
      } catch {
        // Keeps defaultDoctors
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDoctors();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctorsList
      .filter((doc) => {
        // Specialty filter
        if (selectedSpecialty !== 'All') {
          if (!doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
            return false;
          }
        }
        // Consultation mode filter
        if (consultMode === 'ONLINE' && !doc.online) return false;
        if (consultMode === 'IN_PERSON' && !doc.location) return false;

        // Search text query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = doc.name.toLowerCase().includes(q);
          const matchSpec = doc.specialty.toLowerCase().includes(q);
          const matchLoc = doc.location.toLowerCase().includes(q);
          if (!matchName && !matchSpec && !matchLoc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') {
          const expA = parseInt(a.experience) || 0;
          const expB = parseInt(b.experience) || 0;
          return expB - expA;
        }
        if (sortBy === 'fee') {
          const feeA = parseInt(a.fee.replace(/[^0-9]/g, '')) || 0;
          const feeB = parseInt(b.fee.replace(/[^0-9]/g, '')) || 0;
          return feeA - feeB;
        }
        return 0;
      });
  }, [doctorsList, selectedSpecialty, consultMode, searchQuery, sortBy]);

  const handleBook = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedSpecialty('All');
    setConsultMode('ALL');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="border-b border-teal-100/80 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-semibold">Doctors Directory</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200">
                <ShieldCheckIcon className="h-4 w-4 text-teal-600" />
                Verified Clinical Specialists
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Find the Right Doctor.
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-ink-soft">
                Explore licensed doctors across all medical fields. Compare consultation fees, patient reviews, and next available appointments — in clinic or by video visit.
              </p>
            </div>

            {/* Search & Mode Bar */}
            <div className="mt-8 rounded-2xl border border-teal-100/80 bg-white p-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-12">
                <div className="relative sm:col-span-6 lg:col-span-7">
                  <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-teal-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by doctor name, specialty, or clinic location..."
                    className="w-full rounded-xl border border-teal-100 bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-3 lg:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-xl border border-teal-100 bg-slate-50/60 py-3 px-3 text-sm font-medium text-ink focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="rating">Sort by: Top Rated</option>
                    <option value="experience">Sort by: Years Experience</option>
                    <option value="fee">Sort by: Lowest Fee</option>
                  </select>
                </div>

                <div className="flex gap-2 sm:col-span-3 lg:col-span-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3 py-3 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    <RotateCcwIcon className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Consultation Mode Filters */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                  <span>Consultation Mode:</span>
                  <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setConsultMode('ALL')}
                      className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                        consultMode === 'ALL'
                          ? 'bg-white text-teal-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Modes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultMode('ONLINE')}
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 font-semibold transition-colors ${
                        consultMode === 'ONLINE'
                          ? 'bg-white text-teal-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <VideoIcon className="h-3.5 w-3.5 text-teal-600" />
                      Video Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultMode('IN_PERSON')}
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 font-semibold transition-colors ${
                        consultMode === 'IN_PERSON'
                          ? 'bg-white text-teal-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BuildingIcon className="h-3.5 w-3.5 text-teal-600" />
                      In-Clinic
                    </button>
                  </div>
                </div>

                <span className="text-xs text-ink-soft">
                  Showing <strong>{filteredDoctors.length}</strong> verified doctors
                </span>
              </div>
            </div>

            {/* Specialty Pills */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {specialtiesList.map((spec) => {
                const isSelected = selectedSpecialty.toLowerCase() === spec.toLowerCase();
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-teal-100 bg-white text-ink-soft hover:border-teal-200 hover:bg-teal-50/50 shadow-2xs'
                    }`}
                  >
                    {isSelected && <CheckIcon className="h-3 w-3" />}
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Doctor Results Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="h-72 rounded-3xl bg-white border border-slate-100 animate-pulse p-6" />
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm max-w-xl mx-auto">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <StethoscopeIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">No doctors match your criteria</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Try adjusting your search terms or clear your specialty filter to view all available medical practitioners.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  <RotateCcwIcon className="h-3.5 w-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDoctors.map((doctor) => (
                  <article
                    key={doctor.id}
                    className="flex flex-col justify-between overflow-hidden rounded-3xl border border-teal-100/80 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div>
                      {/* Doctor Avatar + Rating */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-teal-100 bg-teal-50">
                          <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="h-full w-full object-cover"
                            width={160}
                            height={160}
                          />
                          {doctor.online && (
                            <span
                              title="Available for video visit"
                              className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-xs"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                              <ShieldCheckIcon className="h-3 w-3 text-teal-600" />
                              Verified
                            </span>
                          </div>
                          <h2 className="mt-1 font-display text-base font-bold text-ink truncate hover:text-teal-600 transition-colors">
                            <Link href={`/doctors/${doctor.id}`}>{doctor.name}</Link>
                          </h2>
                          <p className="text-xs font-semibold text-teal-700">{doctor.specialty}</p>
                          <p className="text-[11px] text-ink-muted">{doctor.experience}</p>
                        </div>
                      </div>

                      {/* Location & Meta */}
                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-ink-soft">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{doctor.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 font-bold text-ink">
                            <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {doctor.rating}
                            <span className="font-normal text-ink-muted">({doctor.reviews})</span>
                          </span>
                          <span className="font-bold text-teal-700">{doctor.fee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl bg-teal-50/80 px-2.5 py-1.5 text-[11px] text-teal-900 font-medium">
                          <ClockIcon className="h-3 w-3 text-teal-600 shrink-0" />
                          <span className="truncate">Next: {doctor.nextAvailable}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="flex items-center justify-center rounded-xl border border-teal-200 bg-white py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 transition"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleBook(doctor)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                      >
                        Book Visit
                        <ArrowRightIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <DoctorBookingModal
        doctor={selectedDoctor}
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
}
