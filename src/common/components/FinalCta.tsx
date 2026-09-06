import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, PhoneIcon } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="bg-canvas pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        <div className="rounded-4xl border border-teal-100 bg-white px-8 py-16 text-center shadow-lift sm:px-16">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
            Your Health, One Appointment Away.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed text-ink-soft">
            Search verified doctors, check today's availability, and book in minutes — with no fees
            and free cancellation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 rounded-full bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-md shadow-teal-600/20 transition-colors hover:bg-teal-700">
              
              Get started
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-7 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50">
              
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              Talk to support
            </a>
          </div>
        </div>
      </div>
    </section>);

}
