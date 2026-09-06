import React from 'react';
import {
  ActivityIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon } from
'lucide-react';

import Link from 'next/link';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'Find Doctors', href: '/doctors' },
      { label: 'Specialties', href: '/#specialties' },
      { label: 'Hospitals & Clinics', href: '/clinics' },
    ],
  },
  {
    title: 'Resources & Help',
    links: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Doctor Registration', href: '/signup' },
      { label: 'Portal Access', href: '/login' },
    ],
  },
  {
    title: 'Legal & Privacy',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact Support', href: '#contact' },
    ],
  },
];

const socials = [
  { label: 'Twitter', icon: TwitterIcon },
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'LinkedIn', icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-teal-100 bg-white">
      <div className="mx-auto max-w-[1536px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5" aria-label="MedCare home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
                <ActivityIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                Med<span className="text-teal-600">Care</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              A trusted healthcare platform connecting patients with verified doctors, top-rated hospitals,
              and accredited clinics — online and in person.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 text-teal-500" aria-hidden="true" />
                <a href="mailto:care@medcare.health" className="hover:text-teal-700">
                  care@medcare.health
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 text-teal-500" aria-hidden="true" />
                <a href="tel:+18005551234" className="hover:text-teal-700">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPinIcon className="h-4 w-4 text-teal-500" aria-hidden="true" />
                180 Commonwealth Ave, Boston, MA
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-soft transition-colors hover:text-teal-700"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-teal-100 pt-8 sm:flex-row">
          <p className="text-sm text-ink-muted">
            © {new Date().getFullYear()} MedCare Health. All rights reserved.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map(({ label, icon: Icon }) =>
            <li key={label}>
                <a
                href="#contact"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-100 text-ink-soft transition-colors hover:bg-teal-50 hover:text-teal-700">
                
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>);

}
