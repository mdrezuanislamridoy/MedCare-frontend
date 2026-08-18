"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  MapPinIcon,
  BriefcaseMedicalIcon,
  ClockIcon,
  VideoIcon,
  BuildingIcon,
  SearchIcon,
  FilterIcon,
  CheckIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Doctor } from '../data/doctors';
import { SectionHeading } from './SectionHeading';

interface FeaturedDoctorsProps {
  doctors: Doctor[];
  selectedSpecialty?: string;
  onSpecialtyChange?: (specialty: string) => void;
  searchQuery?: string;
  onBookDoctor: (doctor: Doctor) => void;
}

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
];

export function FeaturedDoctors({
  doctors,
  selectedSpecialty = 'All',
  onSpecialtyChange,
  searchQuery = '',
  onBookDoctor,
}: FeaturedDoctorsProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [consultMode, setConsultMode] = useState<'ALL' | 'ONLINE' | 'IN_PERSON'>('ALL');
  const [minRating, setMinRating] = useState<number>(0);

  // Sync external search query
  React.useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Specialty filter
      const matchesSpecialty =
        !selectedSpecialty ||
        selectedSpecialty === 'All' ||
        doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      // Search text filter
      const q = localSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q) ||
        (doc.about && doc.about.toLowerCase().includes(q));

      // Mode filter
      const matchesMode =
        consultMode === 'ALL' ||
        (consultMode === 'ONLINE' && doc.online) ||
        (consultMode === 'IN_PERSON' && !doc.online);

      // Rating filter
      const matchesRating = !minRating || doc.rating >= minRating;

      return matchesSpecialty && matchesQuery && matchesMode && matchesRating;
    });
  }, [doctors, selectedSpecialty, localSearch, consultMode, minRating]);

  const handleSpecialtyClick = (spec: string) => {
    if (onSpecialtyChange) {
      onSpecialtyChange(spec);
    }
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setConsultMode('ALL');
    setMinRating(0);
    if (onSpecialtyChange) {
      onSpecialtyChange('All');
    }
  };

  return (
    <section id="doctors" className="bg-canvas py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Find a Doctor"
          title="Featured doctors accepting patients this week"
          description="Compare experience, patient ratings, consultation fees and the next open slot — all before you book."
        />

        {/* Dynamic Controls Bar */}
        <div className="mt-8 space-y-4">
          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {specialtiesList.map((spec) => {
              const isActive = (selectedSpecialty || 'All').toLowerCase() === spec.toLowerCase();
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleSpecialtyClick(spec)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'border border-teal-100 bg-white text-ink-soft hover:border-teal-200 hover:bg-teal-50/50'
                  }`}
                >
                  {isActive && <CheckIcon className="h-3.5 w-3.5" />}
                  {spec}
                </button>
              );
            })}
          </div>

          {/* Search and Secondary Filter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-teal-100/80 bg-white p-3 shadow-sm">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter by name or keyword..."
                className="w-full rounded-xl border border-teal-100 bg-canvas py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Consultation Mode Filter */}
              <div className="inline-flex rounded-xl border border-teal-100 bg-canvas p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setConsultMode('ALL')}
                  className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                    consultMode === 'ALL' ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  All Modes
                </button>
                <button
                  type="button"
                  onClick={() => setConsultMode('ONLINE')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    consultMode === 'ONLINE' ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <VideoIcon className="h-3 w-3" />
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setConsultMode('IN_PERSON')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    consultMode === 'IN_PERSON' ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <BuildingIcon className="h-3 w-3" />
                  In-Clinic
                </button>
              </div>

              <span className="text-xs text-ink-muted hidden md:inline">
                Showing <strong className="text-ink">{filteredDoctors.length}</strong> doctors
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="mt-8">
          {filteredDoctors.length > 0 ? (
            <motion.div
              layout
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              <AnimatePresence>
                {filteredDoctors.map((doctor) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={doctor.id}
                    className="flex flex-col rounded-3xl border border-teal-100/80 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift group"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={doctor.photo}
                        alt={`Portrait of ${doctor.name}`}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-teal-100"
                        width={128}
                        height={128}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-bold text-ink truncate group-hover:text-teal-700 transition-colors">
                          {doctor.name}
                        </h3>
                        <p className="text-sm font-semibold text-teal-700">{doctor.specialty}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                          <span className="text-sm font-bold text-ink">{doctor.rating.toFixed(1)}</span>
                          <span className="text-xs text-ink-muted">({doctor.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <dl className="mt-5 space-y-2.5 text-sm text-ink-soft flex-1">
                      <Row icon={<BriefcaseMedicalIcon className="h-4 w-4" />} label="Experience">
                        {doctor.experience}
                      </Row>
                      <Row icon={<MapPinIcon className="h-4 w-4" />} label="Location">
                        <span className="line-clamp-1">{doctor.location}</span>
                      </Row>
                      <Row icon={<ClockIcon className="h-4 w-4" />} label="Next available">
                        <span className="font-semibold text-teal-700">{doctor.nextAvailable}</span>
                      </Row>
                    </dl>

                    <div className="mt-5 flex items-center justify-between border-t border-teal-50 pt-4">
                      <div>
                        <p className="font-display text-lg font-bold text-ink">{doctor.fee}</p>
                        <p className="text-[11px] text-ink-muted">per consultation</p>
                      </div>
                      {doctor.online ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                          <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          Online Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          <BuildingIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          In-Clinic
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookDoctor(doctor)}
                      className="mt-4 block w-full rounded-2xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                    >
                      Book Appointment
                    </button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-teal-200 bg-white p-12 text-center">
              <FilterIcon className="h-10 w-10 text-teal-300 mb-3" />
              <h4 className="font-display text-lg font-bold text-ink">No doctors match your filter</h4>
              <p className="mt-1 text-sm text-ink-soft max-w-sm">
                Try searching for a different specialty or clearing your search criteria.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                <RotateCcwIcon className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-teal-500 shrink-0">{icon}</span>
      <dt className="sr-only">{label}</dt>
      <dd className="leading-snug">{children}</dd>
    </div>
  );
}
