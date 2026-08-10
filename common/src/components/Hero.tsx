import React from 'react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  StethoscopeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CalendarCheckIcon,
  StarIcon } from
'lucide-react';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-teal-50" />
      
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 lg:grid lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-6">
          
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
            onSubmit={(e) => e.preventDefault()}
            aria-label="Search for a doctor">
            
            <div className="grid gap-2 lg:grid-cols-3">
              <Field
                id="search-doctor"
                label="Doctor"
                placeholder="Search doctor name"
                icon={<SearchIcon className="h-4 w-4" aria-hidden="true" />} />
              
              <Field
                id="search-specialty"
                label="Specialty"
                placeholder="e.g. Cardiology"
                icon={<StethoscopeIcon className="h-4 w-4" aria-hidden="true" />}
                divider />
              
              <Field
                id="search-location"
                label="Location"
                placeholder="City or postcode"
                icon={<MapPinIcon className="h-4 w-4" aria-hidden="true" />}
                divider />
              
            </div>
            <button
              type="submit"
              className="mt-3 w-full rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2">
              
              Find Doctors
            </button>
          </form>

          <p className="mt-5 text-sm text-ink-muted">
            Popular:{' '}
            {['Cardiology', 'Dentistry', 'Pediatrics'].map((item, i) =>
            <span key={item}>
                {i > 0 && ' · '}
                <a href="#specialties" className="font-medium text-teal-700 hover:underline">
                  {item}
                </a>
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="relative mt-14 lg:col-span-6 lg:mt-0">
          
          <div className="overflow-hidden rounded-4xl border border-teal-100 bg-canvas shadow-lift">
            <img
              src="/c33bc54f-5822-40aa-a492-5a072799d232.jpg"
              alt="A doctor in a white coat speaking with a patient in a bright clinic consultation room"
              className="h-full w-full object-cover"
              width={1200}
              height={900} />
            
          </div>

          <div className="absolute -bottom-6 left-4 hidden items-center gap-3 rounded-2xl border border-teal-100 bg-white p-4 shadow-lift sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <CalendarCheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Appointment confirmed</p>
              <p className="text-xs text-ink-muted">Dr. Anjali Sharma · Today, 4:30 PM</p>
            </div>
          </div>

          <div className="absolute -top-5 right-4 hidden items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-lift sm:flex">
            <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink">
              4.9 <span className="font-normal text-ink-muted">· 62K reviews</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>);

}

type FieldProps = {
  id: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  divider?: boolean;
};

function Field({ id, label, placeholder, icon, divider }: FieldProps) {
  return (
    <div className={`px-3 py-2 ${divider ? 'lg:border-l lg:border-teal-100' : ''}`}>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-teal-600">{icon}</span>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          className="w-full border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-0" />
        
      </div>
    </div>);

}