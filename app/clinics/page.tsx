"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SearchIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  BuildingIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowRightIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Navbar } from '@/src/common/components/Navbar';
import { Footer } from '@/src/common/components/Footer';
import { ClinicDetailsModal } from '@/src/common/components/ClinicDetailsModal';
import { Clinic, clinics as defaultClinics } from '@/src/common/data/clinics';
import { landingService } from '@/src/common/services/landing.service';

const cityList = ['All', 'Boston', 'Cambridge', 'Newton', 'Somerville', 'Brookline'];

export default function ClinicsAndHospitalsPage() {
  const router = useRouter();
  const [clinicsList, setClinicsList] = useState<Clinic[]>(defaultClinics);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadClinics() {
      try {
        const data = await landingService.getLandingData();
        if (mounted && data.clinics && data.clinics.length > 0) {
          setClinicsList(data.clinics);
        }
      } catch {
        // Keeps defaultClinics
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadClinics();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredClinics = useMemo(() => {
    return clinicsList.filter((clinic) => {
      if (selectedCity !== 'All') {
        const locationLower = (clinic.location || clinic.address || '').toLowerCase();
        if (!locationLower.includes(selectedCity.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = clinic.name.toLowerCase().includes(q);
        const matchLoc = (clinic.location || clinic.address || '').toLowerCase().includes(q);
        const matchSpec = clinic.specialties?.some((s: string) => s.toLowerCase().includes(q));
        if (!matchName && !matchLoc && !matchSpec) return false;
      }
      return true;
    });
  }, [clinicsList, selectedCity, searchQuery]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-teal-100/80 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-semibold">Top-Rated Hospitals & Clinics</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200">
                <BuildingIcon className="h-4 w-4 text-teal-600" />
                Accredited Hospital Network
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Top-Rated Hospitals & Medical Centers
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-ink-soft">
                Discover accredited regional hospitals, modern specialty clinics, and medical centers. Every facility is vetted for quality of care, emergency response, and verified patient satisfaction.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mt-8 rounded-2xl border border-teal-100/80 bg-white p-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-12">
                <div className="relative sm:col-span-8 lg:col-span-9">
                  <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-teal-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hospitals by name, medical department, or address..."
                    className="w-full rounded-xl border border-teal-100 bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-4 lg:col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('All');
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-white py-3 px-4 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    <RotateCcwIcon className="h-3.5 w-3.5" />
                    Reset Search
                  </button>
                </div>
              </div>

              {/* City Filter Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-ink-muted mr-1">Region:</span>
                {cityList.map((city) => {
                  const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCity(city)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'border border-teal-100 bg-white text-ink-soft hover:bg-teal-50 shadow-2xs'
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3" />}
                      {city}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Hospitals Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="h-96 rounded-3xl bg-white border border-slate-100 animate-pulse p-6" />
                ))}
              </div>
            ) : filteredClinics.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm max-w-xl mx-auto">
                <BuildingIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">No facilities match your search</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  Try clearing your search terms or view hospitals across all regions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('All');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  <RotateCcwIcon className="h-3.5 w-3.5" /> Show All Hospitals
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClinics.map((clinic) => (
                  <article
                    key={clinic.id}
                    className="flex flex-col overflow-hidden rounded-3xl border border-teal-100/80 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={clinic.image}
                        alt={`${clinic.name} building`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        width={900}
                        height={600}
                      />
                      <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-bold text-ink shadow-sm">
                        <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {clinic.rating}
                        <span className="text-[11px] font-normal text-ink-muted">({clinic.reviews})</span>
                      </span>

                      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-teal-700/90 text-white px-3 py-1 text-[11px] font-bold shadow-sm backdrop-blur">
                        <ShieldCheckIcon className="h-3 w-3" /> Accredited Center
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h2 className="font-display text-lg font-bold text-ink hover:text-teal-700 transition-colors">
                          {clinic.name}
                        </h2>

                        <div className="mt-2.5 space-y-1.5 text-xs text-ink-soft">
                          <p className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                            <span>{clinic.location || clinic.address}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                            <span>{clinic.phone || '+1 (617) 555-0199'}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                            <span>{clinic.doctors}</span>
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {clinic.specialties.map((spec: string) => (
                            <span
                              key={spec}
                              className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedClinic(clinic)}
                          className="text-xs font-bold text-teal-700 hover:text-teal-800 transition"
                        >
                          Facility Details
                        </button>
                        <Link
                          href={`/doctors?location=${encodeURIComponent(clinic.name)}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                        >
                          View Doctors
                          <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Details Modal */}
      <ClinicDetailsModal
        clinic={selectedClinic}
        isOpen={!!selectedClinic}
        onClose={() => setSelectedClinic(null)}
        onViewDoctors={(clinicId) => {
          setSelectedClinic(null);
          router.push(`/doctors?clinic=${clinicId}`);
        }}
      />
    </div>
  );
}
