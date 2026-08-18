"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MenuIcon,
  XIcon,
  ActivityIcon,
  UserIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  ChevronDownIcon,
  ShieldIcon,
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';

const links = [
  { label: 'Find Doctors', href: '#doctors' },
  { label: 'Specialties', href: '#specialties' },
  { label: 'Clinics', href: '#clinics' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About Us', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, isAuthenticated, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getDashboardPath = () => {
    switch (role) {
      case 'doctor':
        return '/doctor';
      case 'admin':
        return '/admin';
      case 'super-admin':
        return '/super-admin';
      case 'clinic-manager':
        return '/clinic-manager';
      case 'receptionist':
        return '/receptionist';
      case 'support-staff':
        return '/support-staff';
      case 'patient':
      default:
        return '/patient';
    }
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case 'super-admin':
        return 'Super Admin';
      case 'clinic-manager':
        return 'Clinic Manager';
      case 'support-staff':
        return 'Support';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-teal-100/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="MedCare home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <ActivityIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Med<span className="text-teal-600">Care</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-teal-200/80 bg-teal-50/50 py-1.5 pl-2.5 pr-4 text-sm font-semibold text-ink hover:bg-teal-100/60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white uppercase">
                  {user.name ? user.name.slice(0, 2) : 'MC'}
                </span>
                <span className="truncate max-w-[120px] text-xs font-bold">{user.name || 'User'}</span>
                <span className="rounded-full bg-teal-600/10 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                  {getRoleDisplayName()}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-ink-muted" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-teal-100 bg-white p-2 shadow-xl ring-1 ring-black/5"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="border-b border-teal-50 px-3 py-2">
                    <p className="text-xs font-bold text-ink">{user.name}</p>
                    <p className="text-[11px] text-ink-muted truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      <LayoutDashboardIcon className="h-4 w-4 text-teal-600" />
                      {getRoleDisplayName()} Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-teal-50 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOutIcon className="h-4 w-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-teal-50 hover:text-teal-700"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-teal-700"
              >
                Signup
              </Link>
            </>
          )}

          {isAuthenticated && (
            <Link
              href={getDashboardPath()}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-card hover:bg-teal-700 transition-colors"
            >
              <LayoutDashboardIcon className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-teal-100 bg-white px-5 py-4 lg:hidden">
          {isAuthenticated && user && (
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-teal-50 p-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'MC'}
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">{user.name}</p>
                  <p className="text-[11px] text-teal-700 font-semibold">{getRoleDisplayName()}</p>
                </div>
              </div>
              <Link
                href={getDashboardPath()}
                onClick={() => setOpen(false)}
                className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Dashboard
              </Link>
            </div>
          )}

          <nav aria-label="Mobile" className="flex flex-col space-y-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-teal-50 hover:text-teal-700"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 border-t border-teal-50 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-sm font-semibold text-rose-700"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-teal-200 px-4 py-2.5 text-center text-sm font-semibold text-ink"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
