"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, QuoteIcon, CheckCircle2Icon } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import { SectionHeading } from './SectionHeading';

export function Testimonials() {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filtered = filterRating
    ? testimonials.filter((t) => t.rating >= filterRating)
    : testimonials;

  return (
    <section id="testimonials" className="bg-canvas py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Trusted by patients and families every day"
          description="Reviews are collected only from patients who completed a verified booking through MedCare."
        />

        {/* Rating Filter Tabs */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterRating(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filterRating === null
                ? 'bg-teal-600 text-white shadow-sm'
                : 'border border-teal-100 bg-white text-ink-soft hover:bg-teal-50'
            }`}
          >
            All Verified Stories
          </button>
          <button
            type="button"
            onClick={() => setFilterRating(5)}
            className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              filterRating === 5
                ? 'bg-teal-600 text-white shadow-sm'
                : 'border border-teal-100 bg-white text-ink-soft hover:bg-teal-50'
            }`}
          >
            <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            5-Star Reviews Only
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((testimonial) => (
              <motion.figure
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={testimonial.id}
                className="flex flex-col rounded-3xl border border-teal-100/80 bg-white p-7 shadow-card hover:shadow-lift transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <QuoteIcon className="h-7 w-7 text-teal-200" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2Icon className="h-3 w-3" />
                    Verified Patient
                  </span>
                </div>

                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-soft">
                  “{testimonial.quote}”
                </blockquote>

                <div
                  className="mt-5 flex items-center gap-1"
                  aria-label={`Rated ${testimonial.rating} out of 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-teal-100'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-teal-50 pt-5">
                  <img
                    src={testimonial.photo}
                    alt={`Portrait of ${testimonial.name}`}
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-teal-100"
                    width={96}
                    height={96}
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">{testimonial.name}</p>
                    <p className="text-xs text-ink-muted">{testimonial.detail}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}