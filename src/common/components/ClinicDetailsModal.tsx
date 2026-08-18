"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckIcon,
} from 'lucide-react';
import { Clinic } from '../data/clinics';

interface ClinicDetailsModalProps {
  clinic: Clinic | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDoctors: (clinicId: string, clinicName: string) => void;
}

export function ClinicDetailsModal({
  clinic,
  isOpen,
  onClose,
  onViewDoctors,
}: ClinicDetailsModalProps) {
  if (!isOpen || !clinic) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 z-10 my-8"
        >
          {/* Cover image header */}
          <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
            <img
              src={clinic.image}
              alt={clinic.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-white/80 p-2 text-slate-800 backdrop-blur hover:bg-white transition-colors focus:outline-none"
              aria-label="Close dialog"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600/90 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
                  <ShieldCheckIcon className="h-3.5 w-3.5" />
                  Accredited Facility
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  {clinic.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-ink">
                <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                {clinic.rating} ({clinic.reviews})
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Quick Details List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 rounded-2xl border border-teal-100/80 bg-canvas p-3.5">
                <MapPinIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase">Address</p>
                  <p className="text-sm font-medium text-ink mt-0.5">
                    {clinic.address || clinic.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-teal-100/80 bg-canvas p-3.5">
                <ClockIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase">Working Hours</p>
                  <p className="text-sm font-medium text-ink mt-0.5">
                    {clinic.hours || 'Mon - Sat: 8:00 AM - 8:00 PM'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-teal-100/80 bg-canvas p-3.5">
                <PhoneIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase">Helpline & Reception</p>
                  <p className="text-sm font-medium text-ink mt-0.5">
                    {clinic.phone || '+1 (617) 555-0100'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-teal-100/80 bg-canvas p-3.5">
                <UsersIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase">Medical Staff</p>
                  <p className="text-sm font-medium text-ink mt-0.5">{clinic.doctors}</p>
                </div>
              </div>
            </div>

            {/* Specialties offered */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
                Key Departments & Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                {clinic.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 ring-1 ring-teal-200/70"
                  >
                    <CheckIcon className="h-3.5 w-3.5 text-teal-600" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Facility Highlights */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 text-xs text-ink-soft space-y-1.5">
              <p className="font-semibold text-ink">Facility Features:</p>
              <ul className="grid grid-cols-2 gap-2 text-ink-soft">
                <li>• Electronic Health Records</li>
                <li>• On-Site Diagnostic Laboratory</li>
                <li>• Wheelchair Accessible</li>
                <li>• Pharmacy & Emergency Bay</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-teal-100 px-5 py-3 text-sm font-semibold text-ink-soft hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onViewDoctors(clinic.id, clinic.name);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-card hover:bg-teal-700 transition-colors"
              >
                View Doctors at this Clinic
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
