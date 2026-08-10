import React from 'react';
import { StarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { clinics } from '../data/clinics';
import { SectionHeading } from './SectionHeading';

export function ClinicsSection() {
  return (
    <section id="clinics" className="bg-canvas py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Clinics"
          title="Accredited clinics and hospitals near you"
          description="Every partner facility is inspected for accreditation, equipment standards and patient safety records." />
        

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {clinics.map((clinic) =>
          <article
            key={clinic.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-teal-100/80 bg-white shadow-card transition-shadow hover:shadow-lift">
            
              <img
              src={clinic.image}
              alt={`${clinic.name} facility`}
              className="h-48 w-full object-cover"
              width={900}
              height={600} />
            
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">{clinic.name}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                    <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {clinic.rating}
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                  <MapPinIcon className="h-4 w-4 text-teal-500" aria-hidden="true" />
                  {clinic.location}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-soft">
                  <UsersIcon className="h-4 w-4 text-teal-500" aria-hidden="true" />
                  {clinic.doctors}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {clinic.specialties.map((item) =>
                <li
                  key={item}
                  className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-teal-100">
                  
                      {item}
                    </li>
                )}
                </ul>

                <p className="mt-3 text-xs text-ink-muted">{clinic.reviews} patient reviews</p>

                <button
                type="button"
                className="mt-6 w-full rounded-2xl border border-teal-200 px-4 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2">
                
                  View Clinic
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}