import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, PhoneIcon } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="bg-canvas pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="rounded-4xl border border-teal-100 bg-white px-8 py-14 text-center shadow-card sm:px-12">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Your Health, One Appointment Away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Search verified doctors, check today's availability, and book in minutes — with no fees
            and free cancellation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700">
              
              Get started
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
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
