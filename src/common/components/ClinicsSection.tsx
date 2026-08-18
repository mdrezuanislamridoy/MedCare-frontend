"use client";

import React, { useState } from 'react';
import { StarIcon, MapPinIcon, UsersIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { Clinic, clinics as defaultClinics } from '../data/clinics';
import { SectionHeading } from './SectionHeading';
import { ClinicDetailsModal } from './ClinicDetailsModal';

interface ClinicsSectionProps {
  clinics?: Clinic[];
  onViewClinicDoctors?: (clinicId: string, clinicName: string) => void;
}

export function ClinicsSection({
  clinics = defaultClinics,
  onViewClinicDoctors,
}: ClinicsSectionProps) {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const handleViewDoctors = (clinicId: string, clinicName: string) => {
    if (onViewClinicDoctors) {
      onViewClinicDoctors(clinicId, clinicName);
    }
  };

  return (
    <section id="clinics" className="bg-canvas py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Clinics"
          title="Accredited clinics and hospitals near you"
          description="Every partner facility is inspected for accreditation, equipment standards and patient safety records."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <article
              key={clinic.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-teal-100/80 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={clinic.image}
                  alt={`${clinic.name} facility`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  width={900}
                  height={600}
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-bold text-ink shadow-sm">
                  <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {clinic.rating}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">{clinic.name}</h3>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                  <MapPinIcon className="h-4 w-4 text-teal-500 shrink-0" aria-hidden="true" />
                  {clinic.location}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
                  <UsersIcon className="h-4 w-4 text-teal-500 shrink-0" aria-hidden="true" />
                  {clinic.doctors}
                </p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {clinic.specialties.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-teal-100"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-xs text-ink-muted">{clinic.reviews} patient reviews</p>

                <div className="mt-6 flex gap-2 pt-2 border-t border-teal-50">
                  <button
                    type="button"
                    onClick={() => setSelectedClinic(clinic)}
                    className="flex-1 rounded-2xl border border-teal-200 px-4 py-2.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewDoctors(clinic.id, clinic.name)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    See Doctors
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ClinicDetailsModal
        clinic={selectedClinic}
        isOpen={!!selectedClinic}
        onClose={() => setSelectedClinic(null)}
        onViewDoctors={handleViewDoctors}
      />
    </section>
  );
}