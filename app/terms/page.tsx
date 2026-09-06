"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldAlertIcon, FileTextIcon, ArrowLeftIcon, CheckCircle2Icon } from 'lucide-react';
import { Navbar } from '@/src/common/components/Navbar';
import { Footer } from '@/src/common/components/Footer';

export default function TermsPage() {
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
            <span className="text-teal-700 font-semibold">Terms & Conditions</span>
          </nav>

          {/* Header */}
          <div className="rounded-3xl border border-teal-100 bg-white p-8 sm:p-10 shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <FileTextIcon className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Legal Agreement</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-xs text-ink-muted">Last Updated: September 2026 • Version 2.4</p>

            {/* Medical Emergency Alert */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900 leading-relaxed">
              <ShieldAlertIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>MEDICAL EMERGENCY NOTICE:</strong> If you are experiencing a life-threatening medical emergency, chest pains, severe bleeding, or difficulty breathing, please immediately call <strong>911</strong> or proceed to the nearest hospital emergency room. Do not rely on MedCare for urgent life-saving interventions.
              </div>
            </div>

            {/* Document Body */}
            <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft border-t border-slate-100 pt-8">
              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">1. Acceptance of Terms</h2>
                <p>
                  By registering an account, booking an appointment, or using the MedCare platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all terms, you may not access or use our services.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">2. Telehealth & Medical Disclaimer</h2>
                <p>
                  MedCare provides a technology infrastructure connecting licensed medical practitioners with patients. While doctors on MedCare are board-certified and licence-verified, the platform itself does not practice medicine. Clinical diagnoses, medical prescriptions, and treatment decisions are made solely at the professional discretion of the attending physician.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">3. User Accounts & Security</h2>
                <p>
                  To access patient charts and book consultations, you must provide accurate, current, and complete information. You are responsible for safeguarding your login credentials and for any activities that occur under your authenticated session.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">4. Appointment Booking & Cancellation Policy</h2>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li>Appointments can be rescheduled or cancelled up to <strong>2 hours</strong> before the scheduled visit time without penalty.</li>
                  <li>No-shows or cancellations within 2 hours of visit time may be subject to a nominal missed appointment fee in accordance with clinic rules.</li>
                  <li>In the event an attending doctor must reschedule due to clinical emergency, you will be given top priority for the next available slot or offered an immediate full refund.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">5. Fees, Billing & Insurance Superbills</h2>
                <p>
                  Consultation fees are displayed transparently prior to confirmation. Payments are securely processed through encrypted PCI-DSS compliant gateways. Patients utilizing private insurance will receive an itemized receipt (superbill) containing ICD-10 and CPT codes for claims submission.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">6. Electronic Prescriptions</h2>
                <p>
                  Doctors may prescribe medications deemed medically appropriate during consultation. DEA regulations strictly govern controlled substances, and prescriptions for Schedule II drugs cannot be filled via initial telehealth consultations in compliance with federal guidelines.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-lg font-bold text-ink">7. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, MedCare and its officers, employees, and agents shall not be liable for any indirect, punitive, incidental, special, or consequential damages resulting from platform downtime, technical transmission errors, or clinical outcomes.
                </p>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-6">
                <h2 className="font-display text-lg font-bold text-ink">8. Contact Information</h2>
                <p>
                  If you have questions regarding these Terms & Conditions, please reach our legal and compliance department at:
                </p>
                <div className="rounded-2xl bg-slate-50 p-4 text-xs space-y-1">
                  <p><strong>MedCare Health Platform Legal Dept.</strong></p>
                  <p>180 Commonwealth Ave, Boston, MA 02116</p>
                  <p>Email: <a href="mailto:legal@medcare.health" className="text-teal-700 font-semibold hover:underline">legal@medcare.health</a></p>
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
