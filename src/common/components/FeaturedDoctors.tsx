import React from 'react';
import Link from 'next/link';
import {
  StarIcon,
  MapPinIcon,
  BriefcaseMedicalIcon,
  ClockIcon,
  VideoIcon,
  ArrowRightIcon } from
'lucide-react';
import { doctors } from '../data/doctors';
import { SectionHeading } from './SectionHeading';

export function FeaturedDoctors() {
  return (
    <section id="doctors" className="bg-canvas py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Find a Doctor"
          title="Featured doctors accepting patients this week"
          description="Compare experience, patient ratings, consultation fees and the next open slot — all before you book."
          action={
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50">
            
              Browse all doctors
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          } />
        

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {doctors.map((doctor) =>
          <article
            key={doctor.id}
            className="flex flex-col rounded-3xl border border-teal-100/80 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
            
              <div className="flex items-start gap-4">
                <img
                src={doctor.photo}
                alt={`Portrait of ${doctor.name}`}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                width={128}
                height={128} />
              
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold text-ink">{doctor.name}</h3>
                  <p className="text-sm font-medium text-teal-700">{doctor.specialty}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">{doctor.rating.toFixed(1)}</span>
                    <span className="text-xs text-ink-muted">({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <dl className="mt-5 space-y-2.5 text-sm text-ink-soft">
                <Row icon={<BriefcaseMedicalIcon className="h-4 w-4" aria-hidden="true" />} label="Experience">
                  {doctor.experience}
                </Row>
                <Row icon={<MapPinIcon className="h-4 w-4" aria-hidden="true" />} label="Location">
                  {doctor.location}
                </Row>
                <Row icon={<ClockIcon className="h-4 w-4" aria-hidden="true" />} label="Next available">
                  <span className="font-semibold text-teal-700">{doctor.nextAvailable}</span>
                </Row>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t border-teal-50 pt-4">
                <div>
                  <p className="font-display text-lg font-bold text-ink">{doctor.fee}</p>
                  <p className="text-xs text-ink-muted">per consultation</p>
                </div>
                {doctor.online &&
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                    <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Online
                  </span>
              }
              </div>

              <Link
              href="/signup"
              className="mt-4 block w-full rounded-2xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2">
              
                Book Appointment
              </Link>
            </article>
          )}
        </div>
      </div>
    </section>);

}

function Row({
  icon,
  label,
  children




}: {icon: React.ReactNode;label: string;children: React.ReactNode;}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-teal-500">{icon}</span>
      <dt className="sr-only">{label}</dt>
      <dd className="leading-snug">{children}</dd>
    </div>);

}
