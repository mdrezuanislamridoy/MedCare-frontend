"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  StarIcon,
  MapPinIcon,
  VideoIcon,
  BuildingIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  ArrowLeftIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  AwardIcon,
  LanguagesIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Navbar } from '@/src/common/components/Navbar';
import { Footer } from '@/src/common/components/Footer';
import { DoctorBookingModal } from '@/src/common/components/DoctorBookingModal';
import { Doctor, doctors as defaultDoctors } from '@/src/common/data/doctors';
import { landingService } from '@/src/common/services/landing.service';

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [mode, setMode] = useState<'in_person' | 'video'>('video');

  useEffect(() => {
    let mounted = true;
    async function loadDoctor() {
      try {
        const data = await landingService.getLandingData();
        const allDocs = (data.doctors && data.doctors.length > 0) ? data.doctors : defaultDoctors;
        const matched = allDocs.find((d: Doctor) => d.id === resolvedParams.id);
        if (mounted) {
          setDoctor(matched || defaultDoctors[0]);
          if (matched && matched.availableSlots && matched.availableSlots.length > 0) {
            setSelectedSlot(matched.availableSlots[0]);
          }
        }
      } catch {
        if (mounted) {
          const matched = defaultDoctors.find((d: Doctor) => d.id === resolvedParams.id);
          setDoctor(matched || defaultDoctors[0]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDoctor();
    return () => {
      mounted = false;
    };
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircleIcon className="h-12 w-12 text-slate-400" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Doctor Profile Not Found</h1>
          <p className="mt-2 text-sm text-slate-500">The physician you requested does not exist or is no longer listed.</p>
          <Link href="/doctors" className="mt-4 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white">
            Return to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 lg:py-14">
        <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center justify-between mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-ink-muted">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/doctors" className="hover:text-teal-600 transition-colors">
                Doctors
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-semibold truncate max-w-[200px]">{doctor.name}</span>
            </nav>

            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to Directory
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Doctor Profile Info */}
            <div className="space-y-6 lg:col-span-8">
              {/* Doctor Card Hero */}
              <div className="rounded-3xl border border-teal-100/80 bg-white p-6 sm:p-8 shadow-card">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-3xl border border-teal-100 bg-teal-50 shadow-xs">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                      width={240}
                      height={240}
                    />
                    {doctor.online && (
                      <span
                        title="Available for telehealth visit"
                        className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-xs"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                        <ShieldCheckIcon className="h-3.5 w-3.5 text-teal-600" />
                        Verified Licence & Board Certified
                      </span>
                      {doctor.online && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          <VideoIcon className="h-3 w-3 text-emerald-600" />
                          Telehealth Ready
                        </span>
                      )}
                    </div>

                    <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-ink">
                      {doctor.name}
                    </h1>
                    <p className="text-sm font-semibold text-teal-700">{doctor.specialty}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
                      <span className="flex items-center gap-1 font-bold text-ink">
                        <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {doctor.rating}
                        <span className="font-normal text-ink-muted">({doctor.reviews} patient reviews)</span>
                      </span>
                      <span>•</span>
                      <span>{doctor.experience}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-3.5 w-3.5 text-teal-600" />
                        {doctor.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* About & Clinical Focus */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h2 className="text-base font-bold text-ink">About {doctor.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {doctor.about ||
                      `${doctor.name} is a board-certified specialist with extensive clinical background in ${doctor.specialty}. Dedicated to compassionate, evidence-based care, tailored to every patient's wellness goals.`}
                  </p>
                </div>

                {/* Badges and Highlights */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
                    <GraduationCapIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-ink">Qualifications</h3>
                      <p className="text-[11px] text-ink-soft mt-0.5">MD, Board Certified in {doctor.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
                    <LanguagesIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-ink">Languages</h3>
                      <p className="text-[11px] text-ink-soft mt-0.5">{doctor.languages?.join(', ') || 'English, Spanish'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
                    <AwardIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-ink">Hospital Affiliation</h3>
                      <p className="text-[11px] text-ink-soft mt-0.5">Boston General & MedCare Health</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Reviews Section */}
              <div className="rounded-3xl border border-teal-100/80 bg-white p-6 sm:p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-ink">Verified Patient Reviews</h2>
                    <p className="text-xs text-ink-muted mt-0.5">Ratings verified after completed consultations.</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 px-3 py-1.5 border border-amber-200 text-xs font-bold text-amber-900">
                    <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {doctor.rating} / 5.0
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: 'David K.',
                      date: '2 weeks ago',
                      rating: 5,
                      comment:
                        'Extremely thorough and attentive. Dr. took the time to explain my lab results clearly and answered all questions.',
                    },
                    {
                      name: 'Maria R.',
                      date: 'Last month',
                      rating: 5,
                      comment:
                        'Seamless video consultation. The prescription was sent directly to my local pharmacy within ten minutes.',
                    },
                  ].map((review, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">{review.name}</span>
                        <span className="text-[11px] text-ink-muted">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarIcon key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-ink-soft">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Appointment Booking Widget */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl border border-teal-200/90 bg-white p-6 shadow-lift">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-ink-muted">Consultation Fee</span>
                    <p className="text-2xl font-black text-teal-700">{doctor.fee}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
                    Free Cancellation
                  </span>
                </div>

                {/* Mode Selector */}
                <div className="mt-5">
                  <label className="block text-xs font-bold text-ink mb-2">Select Consultation Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('video')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                        mode === 'video'
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-600'
                          : 'border-slate-200 bg-white text-ink-soft hover:bg-slate-50'
                      }`}
                    >
                      <VideoIcon className="h-4 w-4 text-teal-600" />
                      Video Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('in_person')}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                        mode === 'in_person'
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-600'
                          : 'border-slate-200 bg-white text-ink-soft hover:bg-slate-50'
                      }`}
                    >
                      <BuildingIcon className="h-4 w-4 text-teal-600" />
                      In-Clinic Visit
                    </button>
                  </div>
                </div>

                {/* Available Slots */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-ink">Next Available Slots</label>
                    <span className="text-[11px] text-teal-700 font-semibold">{doctor.nextAvailable}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(doctor.availableSlots || ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']).map((slot: string) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl border py-2 text-xs font-semibold transition ${
                          selectedSlot === slot
                            ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 text-ink-soft hover:border-teal-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Book CTA */}
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Book with {doctor.name.split(' ')[0] || 'Doctor'}
                </button>

                <div className="mt-4 space-y-2 text-[11px] text-ink-muted text-center">
                  <p>✓ Instant confirmation sent to your email & SMS</p>
                  <p>✓ Encrypted HIPAA-compliant medical chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <DoctorBookingModal
        doctor={doctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialMode={mode}
      />
    </div>
  );
}
