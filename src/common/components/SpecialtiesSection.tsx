"use client";

import React, { useState } from "react";
import {
  HeartPulseIcon,
  SparklesIcon,
  BrainIcon,
  BoneIcon,
  BabyIcon,
  Flower2Icon,
  SmileIcon,
  StethoscopeIcon,
  ArrowRightIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { specialties } from "../data/specialties";
import { SectionHeading } from "./SectionHeading";

const iconMap: Record<string, typeof BoxIcon> = {
  HeartPulse: HeartPulseIcon,
  Sparkles: SparklesIcon,
  Brain: BrainIcon,
  Bone: BoneIcon,
  Baby: BabyIcon,
  Flower2: Flower2Icon,
  Smile: SmileIcon,
  Stethoscope: StethoscopeIcon,
};

interface SpecialtiesSectionProps {
  onSelectSpecialty?: (specialty: string) => void;
}

export function SpecialtiesSection({ onSelectSpecialty }: SpecialtiesSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const handleCardClick = (specialtyName: string) => {
    if (onSelectSpecialty) {
      onSelectSpecialty(specialtyName);
    }
    const doctorsElem = document.getElementById("doctors");
    if (doctorsElem) {
      doctorsElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayedSpecialties = showAll ? specialties : specialties.slice(0, 8);

  return (
    <section id="specialties" className="bg-white py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Specialties"
          title="Care for every need, from routine to complex"
          description="Browse the specialties patients search for most, or explore the full directory of over forty medical fields."
        />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {displayedSpecialties.map((specialty) => {
            const Icon = iconMap[specialty.icon] ?? StethoscopeIcon;
            return (
              <button
                key={specialty.name}
                type="button"
                onClick={() => handleCardClick(specialty.name)}
                className="group flex flex-col text-left rounded-3xl border border-teal-100/90 bg-canvas p-7 transition-all hover:-translate-y-1 hover:border-teal-300 hover:bg-white hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-600 ring-1 ring-teal-100 transition-colors group-hover:bg-teal-600 group-hover:text-white shadow-xs">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg sm:text-xl font-bold text-ink group-hover:text-teal-700 transition-colors">
                  {specialty.name}
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-ink-muted">{specialty.doctors}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
                  Find Specialists <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (onSelectSpecialty) onSelectSpecialty("All");
              const doctorsElem = document.getElementById("doctors");
              if (doctorsElem) doctorsElem.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-200 bg-white px-8 py-3.5 text-base font-bold text-teal-700 shadow-xs transition-colors hover:bg-teal-50"
          >
            Browse All Doctor Specialists
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
