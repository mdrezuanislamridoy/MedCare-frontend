import React from 'react';
import {
  VideoIcon,
  ShieldCheckIcon,
  FileTextIcon,
  FolderLockIcon,
  BellRingIcon,
  ArrowRightIcon } from
'lucide-react';

const features = [
{
  icon: VideoIcon,
  title: 'Video consultation',
  description: 'HD video visits with the same doctors you would see in clinic.'
},
{
  icon: ShieldCheckIcon,
  title: 'Secure communication',
  description: 'End-to-end encrypted calls and messages, HIPAA compliant.'
},
{
  icon: FileTextIcon,
  title: 'Digital prescriptions',
  description: 'Issued during the call and sent straight to your pharmacy.'
},
{
  icon: FolderLockIcon,
  title: 'Medical records',
  description: 'Reports, notes and history in one private, portable place.'
},
{
  icon: BellRingIcon,
  title: 'Appointment reminders',
  description: 'Timely email and SMS nudges so nothing gets missed.'
}];


export function OnlineConsultation() {
  return (
    <section id="online" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="overflow-hidden rounded-4xl border border-teal-100 bg-canvas lg:grid lg:grid-cols-12">
          <div className="p-8 sm:p-12 lg:col-span-7">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700 ring-1 ring-teal-100">
              Online Consultation
            </span>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              See a doctor from home, in under 15 minutes
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
              For advice, follow-ups, repeat prescriptions and second opinions, a video visit saves
              you the trip — with the same verified specialists and the same medical record.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) =>
              <li key={title} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-teal-100/80">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-snug text-ink-soft">{description}</p>
                  </div>
                </li>
              )}
            </ul>

            <a
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700">
              
              Consult a Doctor Online
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="relative lg:col-span-5">
            <img
              src="/be932736-dff1-48d1-9783-fa63b8babb6f.jpg"
              alt="A patient at home having a video consultation with a doctor on a tablet"
              className="h-64 w-full object-cover lg:h-full"
              width={1200}
              height={900} />
            
          </div>
        </div>
      </div>
    </section>);

}