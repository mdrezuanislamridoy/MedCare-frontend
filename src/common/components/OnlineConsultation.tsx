"use client";

import React from 'react';
import {
  VideoIcon,
  ShieldCheckIcon,
  FileTextIcon,
  FolderLockIcon,
  BellRingIcon,
  ArrowRightIcon,
} from 'lucide-react';

const features = [
  {
    icon: VideoIcon,
    title: 'Video consultation',
    description: 'HD video visits with the same doctors you would see in clinic.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure communication',
    description: 'End-to-end encrypted calls and messages, HIPAA compliant.',
  },
  {
    icon: FileTextIcon,
    title: 'Digital prescriptions',
    description: 'Issued during the call and sent straight to your pharmacy.',
  },
  {
    icon: FolderLockIcon,
    title: 'Medical records',
    description: 'Reports, notes and history in one private, portable place.',
  },
  {
    icon: BellRingIcon,
    title: 'Appointment reminders',
    description: 'Timely email and SMS nudges so nothing gets missed.',
  },
];

interface OnlineConsultationProps {
  onStartOnlineConsult?: () => void;
}

export function OnlineConsultation({ onStartOnlineConsult }: OnlineConsultationProps) {
  const handleClick = () => {
    if (onStartOnlineConsult) {
      onStartOnlineConsult();
    } else {
      const docSection = document.getElementById('doctors');
      if (docSection) docSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="online" className="bg-white py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        <div className="overflow-hidden rounded-4xl border border-teal-100 bg-canvas lg:grid lg:grid-cols-12 shadow-sm">
          <div className="p-8 sm:p-14 lg:col-span-7">
            <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-teal-700 ring-1 ring-teal-200">
              Online Consultation
            </span>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
              See a doctor from home, in under 15 minutes
            </h2>
            <p className="mt-5 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-ink-soft">
              For advice, follow-ups, repeat prescriptions and second opinions, a video visit saves
              you the trip — with the same verified specialists and the same medical record.
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-3.5 rounded-2xl bg-white p-5 ring-1 ring-teal-100/80 shadow-2xs">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink">{title}</h3>
                    <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-ink-soft">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleClick}
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-teal-600 px-8 py-4 text-base sm:text-lg font-bold text-white transition-colors hover:bg-teal-700 shadow-md shadow-teal-600/20"
            >
              Consult a Doctor Online
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative lg:col-span-5">
            <img
              src="/be932736-dff1-48d1-9783-fa63b8babb6f.jpg"
              alt="A patient at home having a video consultation with a doctor on a tablet"
              className="h-64 w-full object-cover lg:h-full"
              width={1200}
              height={900}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
