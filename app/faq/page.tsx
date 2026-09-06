"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  SearchIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  CalendarClockIcon,
  VideoIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  MailIcon,
  PhoneIcon,
  CheckIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Navbar } from '@/src/common/components/Navbar';
import { Footer } from '@/src/common/components/Footer';

interface FaqItem {
  id: string;
  category: 'Appointments' | 'Telehealth' | 'Billing' | 'Security' | 'Doctors';
  question: string;
  answer: string;
}

const faqList: FaqItem[] = [
  {
    id: 'f1',
    category: 'Appointments',
    question: 'How do I book an appointment with a doctor?',
    answer:
      'You can search for verified doctors by specialty, location, or name directly on our Doctors Directory. Once you pick a doctor, choose your preferred date and time slot, select in-person or video consultation, and confirm. Your appointment confirmation is generated instantly with calendar invites and reminders.',
  },
  {
    id: 'f2',
    category: 'Appointments',
    question: 'Can I cancel or reschedule my appointment?',
    answer:
      'Yes. You can cancel or reschedule any appointment up to 2 hours before the scheduled time free of charge through your Patient Portal dashboard or via the confirmation link in your email/SMS.',
  },
  {
    id: 'f3',
    category: 'Appointments',
    question: 'What is the clinic check-in token queue?',
    answer:
      'When arriving at partner hospitals or clinics, receptionists check you in via our unified desk system. You receive a digital token number on your mobile phone indicating your position in queue and live estimated consultation time.',
  },
  {
    id: 'f4',
    category: 'Telehealth',
    question: 'How do video consultations work?',
    answer:
      'Video visits are conducted in a secure, browser-based telehealth room encrypted with WebRTC. No downloads or installations are required. Ten minutes before your visit, a join link is sent to you via SMS and displayed in your patient portal.',
  },
  {
    id: 'f5',
    category: 'Telehealth',
    question: 'Can doctors issue prescriptions during telehealth visits?',
    answer:
      'Yes. Licensed physicians on MedCare can generate electronic prescriptions (e-Rx) directly into your patient portal and transmit them immediately to partner pharmacies for home delivery or convenient pickup.',
  },
  {
    id: 'f6',
    category: 'Billing',
    question: 'What payment methods are accepted?',
    answer:
      'We support all major credit/debit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), and direct insurance co-pay billing at participating hospital facilities.',
  },
  {
    id: 'f7',
    category: 'Billing',
    question: 'Do you accept health insurance?',
    answer:
      'Many partner clinics and doctors accept in-network insurance. For telehealth visits, we provide automated, itemized superbills with diagnosis codes (ICD-10) and procedure codes (CPT) that you can easily submit to your insurer for full or partial reimbursement.',
  },
  {
    id: 'f8',
    category: 'Security',
    question: 'Is my health data and medical history secure?',
    answer:
      'Yes. MedCare is strictly HIPAA-compliant. All patient records, consultation notes, and prescriptions are protected with AES-256 encryption at rest and TLS 1.3 in transit. Only you and authorized physicians assigned to your care have access.',
  },
  {
    id: 'f9',
    category: 'Doctors',
    question: 'How are doctors verified before appearing on the platform?',
    answer:
      'Every physician must submit their state medical board license, DEA registration, hospital credentials, and government ID. Our compliance team cross-checks each credential against national databases before activating clinical permissions.',
  },
];

const categories = ['All', 'Appointments', 'Telehealth', 'Billing', 'Security', 'Doctors'] as const;

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ f1: true, f4: true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-teal-100/80 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-semibold">Help & FAQ</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200">
                <HelpCircleIcon className="h-4 w-4 text-teal-600" />
                Frequently Asked Questions
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                How Can We Help You?
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-ink-soft">
                Find clear answers to common questions about doctor bookings, telehealth consultations, payments, insurance, and medical data security.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-8 rounded-2xl border border-teal-100/80 bg-white p-4 shadow-sm max-w-4xl">
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions by keyword (e.g., insurance, cancellation, video visit)..."
                  className="w-full rounded-xl border border-teal-100 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Category Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-ink-muted mr-1">Categories:</span>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'border border-teal-100 bg-white text-ink-soft hover:bg-teal-50 shadow-2xs'
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <HelpCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">No questions found</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  Try searching with different terms or select "All" categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  <RotateCcwIcon className="h-3.5 w-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-teal-100/90 bg-white shadow-card overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50/70"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-ink">{item.question}</span>
                        </div>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-teal-600 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-canvas/60 px-5 py-4 text-xs sm:text-sm leading-relaxed text-ink-soft">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Still have questions? Banner */}
            <div className="mt-12 rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-card">
              <h3 className="font-display text-lg font-bold text-ink">Still have questions?</h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft">
                Our clinical support team is available 24/7 to assist you with booking or technical queries.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:care@medcare.health"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                >
                  <MailIcon className="h-4 w-4" /> Email Support
                </a>
                <a
                  href="tel:+18005551234"
                  className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-2.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition"
                >
                  <PhoneIcon className="h-4 w-4" /> +1 (800) 555-1234
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
