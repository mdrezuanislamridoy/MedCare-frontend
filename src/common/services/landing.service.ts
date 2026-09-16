import { apiClient } from './api';
import { doctors as defaultDoctors, Doctor } from '../data/doctors';
import { clinics as defaultClinics, Clinic } from '../data/clinics';
import { specialties as defaultSpecialties, Specialty } from '../data/specialties';
import { testimonials as defaultTestimonials, Testimonial } from '../data/testimonials';

export interface LandingStats {
  verifiedDoctors: string;
  patientsServed: string;
  appointmentsBooked: string;
  partnerClinics: string;
  ratingAverage: number;
  totalReviews: number;
}

export interface LandingDataResponse {
  doctors: Doctor[];
  clinics: Clinic[];
  specialties: Specialty[];
  testimonials: Testimonial[];
  stats: LandingStats;
}

export const defaultStats: LandingStats = {
  verifiedDoctors: '10K+',
  patientsServed: '50K+',
  appointmentsBooked: '100K+',
  partnerClinics: '100+',
  ratingAverage: 4.9,
  totalReviews: 62000,
};

const DEFAULT_AVATAR = '/f0317ea3-b671-4c69-9468-004b5f92d64b.jpg';
const DEFAULT_CLINIC_IMAGE = '/4efc88dc-859f-477f-9d6c-81ed83d9100c.jpg';

const SPECIALTY_ICON_MATCHERS: Array<[string, string]> = [
  ['cardio', 'HeartPulse'],
  ['derma', 'Sparkles'],
  ['neuro', 'Brain'],
  ['ortho', 'Bone'],
  ['bone', 'Bone'],
  ['pediatr', 'Baby'],
  ['gynec', 'Flower2'],
  ['obstetric', 'Flower2'],
  ['dental', 'Smile'],
  ['dentist', 'Smile'],
];

function iconForSpecialty(name: string): string {
  const key = (name || '').toLowerCase();
  const match = SPECIALTY_ICON_MATCHERS.find(([needle]) => key.includes(needle));
  return match ? match[1] : 'Stethoscope';
}

function mapDoctor(d: any, clinicMap: Map<string, any>): Doctor {
  const clinic = d.clinicId ? clinicMap.get(d.clinicId) : undefined;
  return {
    id: d.id,
    name: d.name || `Dr. ${d.specialty || 'Specialist'}`,
    specialty: d.specialty || 'General Medicine',
    experience: d.experienceYears
      ? `${d.experienceYears}+ years experience`
      : '5+ years experience',
    rating: Number(d.rating) || 4.8,
    reviews: Number(d.reviewCount) || 0,
    fee: d.consultationFee ? `$${d.consultationFee}` : '$60',
    location: clinic
      ? `${clinic.name}, ${clinic.city || clinic.address || ''}`.replace(/,\s*$/, '')
      : 'Boston Medical District',
    nextAvailable: d.isAvailableToday ? 'Today, Available' : 'Next available slot',
    photo: d.avatarUrl || DEFAULT_AVATAR,
    online: true,
    about:
      d.bio || `Specialist in ${d.specialty || 'General Medicine'} dedicated to patient-centered care.`,
    languages: ['English'],
    availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
    clinicId: d.clinicId || undefined,
  };
}

function mapClinic(c: any, doctorCountMap: Map<string, number>): Clinic {
  const count = doctorCountMap.get(c.id) || 0;
  return {
    id: c.id,
    name: c.name,
    location: c.city ? `${c.city}, ${c.state || 'MA'}` : c.location || c.address || 'Boston, MA',
    address: c.address || c.location,
    phone: c.phone || '+1 (617) 555-0199',
    doctors: count > 0 ? `${count} doctor${count === 1 ? '' : 's'} available` : 'Doctors available',
    specialties: ['General Medicine'],
    rating: 4.8,
    reviews: 0,
    image: DEFAULT_CLINIC_IMAGE,
  };
}

function mapSpecialty(s: any): Specialty {
  const count = Number(s.doctorCount) || 0;
  return {
    name: s.name,
    icon: iconForSpecialty(s.name),
    doctors: `${count} doctor${count === 1 ? '' : 's'}`,
  };
}

function mapTestimonial(t: any): Testimonial {
  return {
    id: t.id,
    name: t.patientName || 'Verified Patient',
    detail: t.doctorName ? `Visited ${t.doctorName}` : t.doctorSpecialty || 'Verified booking',
    rating: Number(t.rating) || 5,
    quote: t.comment || '',
    photo: DEFAULT_AVATAR,
  };
}

export const landingService = {
  async getLandingData(): Promise<LandingDataResponse> {
    const [statsRes, doctorsRes, clinicsRes, specialtiesRes, testimonialsRes] =
      await Promise.allSettled([
        apiClient<any>('/public/stats'),
        apiClient<any>('/public/doctors?limit=50'),
        apiClient<any>('/public/clinics?limit=50'),
        apiClient<any>('/public/specialties'),
        apiClient<any>('/public/testimonials?limit=9'),
      ]);

    const rawClinics =
      clinicsRes.status === 'fulfilled' && Array.isArray(clinicsRes.value?.data)
        ? clinicsRes.value.data
        : [];
    const rawDoctors =
      doctorsRes.status === 'fulfilled' && Array.isArray(doctorsRes.value?.data)
        ? doctorsRes.value.data
        : [];

    const doctorCountMap = new Map<string, number>();
    for (const d of rawDoctors) {
      if (d.clinicId) {
        doctorCountMap.set(d.clinicId, (doctorCountMap.get(d.clinicId) || 0) + 1);
      }
    }
    const clinicMap = new Map(rawClinics.map((c: any) => [c.id, c]));

    const apiDoctors = rawDoctors.map((d: any) => mapDoctor(d, clinicMap));
    const apiClinics = rawClinics.map((c: any) => mapClinic(c, doctorCountMap));

    const apiSpecialties =
      specialtiesRes.status === 'fulfilled' && Array.isArray(specialtiesRes.value)
        ? specialtiesRes.value.map(mapSpecialty)
        : [];

    const apiTestimonials =
      testimonialsRes.status === 'fulfilled' && Array.isArray(testimonialsRes.value)
        ? testimonialsRes.value.map(mapTestimonial)
        : [];

    const stats =
      statsRes.status === 'fulfilled' && statsRes.value
        ? {
            verifiedDoctors: statsRes.value.totalDoctors
              ? `${statsRes.value.totalDoctors}+`
              : defaultStats.verifiedDoctors,
            patientsServed: statsRes.value.totalPatients
              ? `${statsRes.value.totalPatients}+`
              : defaultStats.patientsServed,
            appointmentsBooked: statsRes.value.totalAppointments
              ? `${statsRes.value.totalAppointments}+`
              : defaultStats.appointmentsBooked,
            partnerClinics: statsRes.value.totalClinics
              ? `${statsRes.value.totalClinics}+`
              : defaultStats.partnerClinics,
            ratingAverage: statsRes.value.ratingAverage ?? defaultStats.ratingAverage,
            totalReviews: statsRes.value.totalReviews ?? defaultStats.totalReviews,
          }
        : defaultStats;

    return {
      doctors: apiDoctors.length > 0 ? apiDoctors : defaultDoctors,
      clinics: apiClinics.length > 0 ? apiClinics : defaultClinics,
      specialties: apiSpecialties.length > 0 ? apiSpecialties : defaultSpecialties,
      testimonials: apiTestimonials.length > 0 ? apiTestimonials : defaultTestimonials,
      stats,
    };
  },

  async searchDoctors(query: { q?: string; specialty?: string; clinicId?: string }): Promise<Doctor[]> {
    try {
      const params = new URLSearchParams();
      if (query.q) params.append('q', query.q);
      if (query.specialty && query.specialty !== 'All') params.append('specialty', query.specialty);
      if (query.clinicId) params.append('clinicId', query.clinicId);

      const res = await apiClient<any>(`/public/doctors?${params.toString()}`);
      if (res?.data && res.data.length > 0) {
        return res.data.map((d: any) => mapDoctor(d, new Map()));
      }
    } catch {
      // Local filter fallback
    }

    return defaultDoctors.filter((doc) => {
      const matchesQ = !query.q ||
        doc.name.toLowerCase().includes(query.q.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(query.q.toLowerCase()) ||
        doc.location.toLowerCase().includes(query.q.toLowerCase());
      const matchesSpecialty = !query.specialty || query.specialty === 'All' ||
        doc.specialty.toLowerCase() === query.specialty.toLowerCase();
      return matchesQ && matchesSpecialty;
    });
  },
};
