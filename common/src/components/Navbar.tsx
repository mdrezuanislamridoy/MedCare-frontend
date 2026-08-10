import React, { useState } from 'react';
import { MenuIcon, XIcon, ActivityIcon } from 'lucide-react';

const links = [
{ label: 'Find Doctors', href: '#doctors' },
{ label: 'Specialties', href: '#specialties' },
{ label: 'Clinics', href: '#clinics' },
{ label: 'How It Works', href: '#how-it-works' },
{ label: 'About Us', href: '#about' },
{ label: 'Contact', href: '#contact' }];


export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-teal-100/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="MediBook home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
            <ActivityIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Medi<span className="text-teal-600">Book</span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
          {links.map((link) =>
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded">
            
              {link.label}
            </a>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-teal-50 hover:text-teal-700">
            
            Login
          </a>
          <a
            href="#doctors"
            className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-teal-700">
            
            Book an Appointment
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}>
          
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open &&
      <div id="mobile-nav" className="border-t border-teal-100 bg-white px-5 py-4 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((link) =>
          <a
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-3 text-sm font-medium text-ink-soft hover:bg-teal-50 hover:text-teal-700">
            
                {link.label}
              </a>
          )}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <a
            href="#login"
            onClick={() => setOpen(false)}
            className="rounded-full border border-teal-200 px-4 py-2.5 text-center text-sm font-semibold text-ink">
            
              Login
            </a>
            <a
            href="#doctors"
            onClick={() => setOpen(false)}
            className="rounded-full bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
            
              Book an Appointment
            </a>
          </div>
        </div>
      }
    </header>);

}