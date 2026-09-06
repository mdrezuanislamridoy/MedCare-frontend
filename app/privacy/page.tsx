"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, LockIcon, DatabaseIcon, EyeOffIcon, FileTextIcon } from 'lucide-react';
import { Navbar } from '@/src/common/components/Navbar';
import { Footer } from '@/src/common/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-teal-700 font-semibold">Privacy Policy</span>
          </nav>

          {/* Header Card */}
          <div className="rounded-3xl border border-teal-100 bg-white p-8 sm:p-10 shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <ShieldCheckIcon className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">HIPAA & Data Protection</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Privacy Policy & HIPAA Notice
            </h1>
            <p className="mt-2 text-xs text-ink-muted">Effective Date: September 2026 • Compliant with US HIPAA & HITECH</p>

            {/* Quick Security Pillars */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3 border-y border-slate-100 py-6">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <LockIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-ink">AES-256 Encryption</h3>
                  <p className="text-[11px] text-ink-muted mt-0.5">Encrypted electronic health records at rest and in transit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <EyeOffIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-ink">Zero Data Selling</h3>
                  <p className="text-[11px] text-ink-muted mt-0.5">We never monetize, rent, or sell your health records.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <DatabaseIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-ink">Role-Based Access</h3>
                  <p className="text-[11px] text-ink-muted mt-0.5">Only treating doctors assigned to your care have access.</p>
                </div>
              </div>
            </div>

            {/* Body Sections */}
            <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">
              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">1. Information We Collect</h2>
                <p>
                  To deliver healthcare services, we collect information you provide directly:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>Account Data</strong>: Name, email address, phone number, and encrypted password.</li>
                  <li><strong>Protected Health Information (PHI)</strong>: Medical intake questionnaires, consultation notes, diagnoses, allergies, and prescription histories.</li>
                  <li><strong>Transaction Details</strong>: Payment card tokens, receipts, and insurance billing codes.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">2. How We Use Protected Health Information</h2>
                <p>
                  Under the Health Insurance Portability and Accountability Act (HIPAA), your PHI is strictly used for treatment, payment, and healthcare operations (TPO). Specifically:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li>Enabling licensed physicians to review medical records and conduct clinical evaluations.</li>
                  <li>Issuing prescriptions to verified pharmacies chosen by you.</li>
                  <li>Providing automated appointment reminders via SMS and email.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">3. Data Security & Storage Architecture</h2>
                <p>
                  MedCare utilizes microservices architecture hosted in SOC-2 Type II certified cloud environments. Database-per-service isolation ensures that medical records, financial billing data, and authentication tokens reside in segregated, encrypted partitions.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">4. Patient Rights Under HIPAA</h2>
                <p>
                  You possess clear legal rights regarding your health data:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>Right to Inspect & Export</strong>: You can download complete clinical summaries of all visits in PDF format from your patient dashboard.</li>
                  <li><strong>Right to Amend</strong>: You may request corrections to demographic or medical history items.</li>
                  <li><strong>Right to Accounting of Disclosures</strong>: You may request an audit log of all healthcare providers who accessed your chart.</li>
                </ul>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-6">
                <h2 className="font-display text-lg font-bold text-ink">5. Data Privacy Officer Contact</h2>
                <div className="rounded-2xl bg-slate-50 p-4 text-xs space-y-1">
                  <p><strong>MedCare Health Privacy Office</strong></p>
                  <p>180 Commonwealth Ave, Boston, MA 02116</p>
                  <p>Email: <a href="mailto:privacy@medcare.health" className="text-teal-700 font-semibold hover:underline">privacy@medcare.health</a></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
