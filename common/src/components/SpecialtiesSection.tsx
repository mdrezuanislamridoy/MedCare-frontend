import React from "react";
import { HeartPulseIcon, SparklesIcon, BrainIcon, BoneIcon, BabyIcon, Flower2Icon, SmileIcon, StethoscopeIcon, ArrowRightIcon, BoxIcon } from "lucide-react";
import { specialties } from "../data/specialties";
import { SectionHeading } from "./SectionHeading";
const iconMap: Record<string, BoxIcon> = {
  HeartPulse: HeartPulseIcon,
  Sparkles: SparklesIcon,
  Brain: BrainIcon,
  Bone: BoneIcon,
  Baby: BabyIcon,
  Flower2: Flower2Icon,
  Smile: SmileIcon,
  Stethoscope: StethoscopeIcon
};
export function SpecialtiesSection() {
  return <section id="specialties" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Specialties" title="Care for every need, from routine to complex" description="Browse the specialties patients search for most, or explore the full directory of over forty medical fields." />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {specialties.map((specialty) => {
          const Icon = iconMap[specialty.icon] ?? StethoscopeIcon;
          return <a key={specialty.name} href="#doctors" className="group rounded-3xl border border-teal-100/80 bg-canvas p-6 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 ring-1 ring-teal-100 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink">{specialty.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{specialty.doctors}</p>
              </a>;
        })}
        </div>

        <div className="mt-10 flex justify-center">
          <a href="#specialties" className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-6 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50">
            View All Specialties
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>;
}