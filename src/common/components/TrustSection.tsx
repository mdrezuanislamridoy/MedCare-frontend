"use client";

import React from 'react';
import {
  BadgeCheckIcon,
  CalendarClockIcon,
  LockKeyholeIcon,
  BuildingIcon,
  HeadphonesIcon,
} from 'lucide-react';
import { LandingStats, defaultStats } from '../services/landing.service';

const benefits = [
  {
    icon: BadgeCheckIcon,
    title: 'Verified Doctors',
    description: 'Licences, registrations and clinic affiliations checked before any profile goes live.',
  },
  {
    icon: CalendarClockIcon,
    title: 'Easy Online Booking',
    description: 'Real-time availability with instant confirmation — no phone calls, no waiting.',
  },
  {
    icon: LockKeyholeIcon,
    title: 'Secure Medical Records',
    description: 'Prescriptions, reports and visit history encrypted and available only to you.',
  },
  {
    icon: BuildingIcon,
    title: 'Trusted Providers',
    description: 'Top-rated hospitals and accredited clinics reviewed by thousands of real patients.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'A care team on hand any hour to help with bookings, changes and questions.',
  },
];

interface TrustSectionProps {
  stats?: LandingStats;
}

export function TrustSection({ stats = defaultStats }: TrustSectionProps) {
  const dynamicStats = [
    { value: stats.verifiedDoctors, label: 'Verified doctors' },
    { value: stats.patientsServed, label: 'Patients served' },
    { value: stats.appointmentsBooked, label: 'Appointments booked' },
    { value: stats.partnerClinics, label: 'Partner clinics' },
  ];

  return (
    <section id="about" className="bg-canvas py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-teal-100/90 bg-white p-6 shadow-card hover:shadow-lift transition-all hover:-translate-y-0.5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-xs">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-teal-100/80 bg-teal-100/70 sm:grid-cols-2 lg:grid-cols-4 shadow-sm">
          {dynamicStats.map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-7 text-center">
              <p className="font-display text-3xl font-extrabold tracking-tight text-teal-700 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}