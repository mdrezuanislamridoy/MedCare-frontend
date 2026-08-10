import React from 'react';
import { StarIcon, QuoteIcon } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import { SectionHeading } from './SectionHeading';

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-canvas py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Trusted by patients and families every day"
          description="Reviews are collected only from patients who completed a booking through MedCare." />
        

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) =>
          <figure
            key={testimonial.id}
            className="flex flex-col rounded-3xl border border-teal-100/80 bg-white p-7 shadow-card">
            
              <QuoteIcon className="h-7 w-7 text-teal-100" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-soft">
                “{testimonial.quote}”
              </blockquote>
              <div
              className="mt-5 flex items-center gap-1"
              aria-label={`Rated ${testimonial.rating} out of 5`}>
              
                {Array.from({ length: 5 }).map((_, i) =>
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-teal-100'}`}
                aria-hidden="true" />

              )}
              </div>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-teal-50 pt-5">
                <img
                src={testimonial.photo}
                alt={`Portrait of ${testimonial.name}`}
                className="h-11 w-11 rounded-full object-cover"
                width={96}
                height={96} />
              
                <div>
                  <p className="text-sm font-bold text-ink">{testimonial.name}</p>
                  <p className="text-xs text-ink-muted">{testimonial.detail}</p>
                </div>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>);

}