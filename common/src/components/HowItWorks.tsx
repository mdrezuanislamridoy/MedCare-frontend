import React from 'react';
import { SearchIcon, CalendarDaysIcon, CheckCircle2Icon } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const steps = [
{
  icon: SearchIcon,
  title: 'Find a Doctor',
  description:
  'Search by specialty, location, experience or availability, and narrow results down to the doctors that fit you.'
},
{
  icon: CalendarDaysIcon,
  title: 'Choose a Time',
  description:
  "View the doctor's live schedule and select a slot that works around your day — mornings, evenings or weekends."
},
{
  icon: CheckCircle2Icon,
  title: 'Book & Consult',
  description:
  'Confirm your appointment and meet the doctor online by secure video or in person at the clinic.'
}];


export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Three steps from symptom to specialist"
          description="No queues, no paperwork, no guesswork — booking care should be as simple as booking anything else." />
        

        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) =>
          <li
            key={title}
            className="relative rounded-3xl border border-teal-100/80 bg-canvas p-8">
            
              <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-teal-100">
                {index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}