import React from 'react';
import {
  CalendarCheckIcon,
  ClockIcon,
  TrendingUpIcon,
  FileTextIcon,
  WalletIcon,
  Building2Icon } from
'lucide-react';

const benefits = [
{ icon: CalendarCheckIcon, title: 'Manage appointments', description: 'One calendar for clinic, video and follow-up visits.' },
{ icon: ClockIcon, title: 'Manage availability', description: 'Set recurring hours, breaks and leave in seconds.' },
{ icon: TrendingUpIcon, title: 'Reach more patients', description: 'Get discovered by patients searching your specialty.' },
{ icon: FileTextIcon, title: 'Digital prescriptions', description: 'Issue and share compliant e-prescriptions instantly.' },
{ icon: WalletIcon, title: 'Earnings tracking', description: 'Transparent payouts, invoices and monthly reporting.' },
{ icon: Building2Icon, title: 'Clinic management', description: 'Add rooms, staff and multiple locations under one roof.' }];


export function ForProviders() {
  return (
    <section id="for-doctors" className="bg-teal-800 py-20 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:grid lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100">
            For Doctors &amp; Clinics
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Grow Your Practice With Us
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-teal-100">
            Join 10,000+ practitioners and 100+ clinics using MediBook to fill their schedule, cut
            no-shows and run the admin side of care from a single dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#for-doctors"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50">
              
              Join as a Doctor
            </a>
            <a
              href="#for-doctors"
              className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              
              Register Your Clinic
            </a>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:mt-0">
          {benefits.map(({ icon: Icon, title, description }) =>
          <li key={title} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-teal-100">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-teal-100/90">{description}</p>
            </li>
          )}
        </ul>
      </div>
    </section>);

}