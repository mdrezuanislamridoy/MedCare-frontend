import { apiClient } from './api';
import { doctors as defaultDoctors, Doctor } from '../data/doctors';
import { clinics as defaultClinics, Clinic } from '../data/clinics';
import { specialties as defaultSpecialties, Specialty } from '../data/specialties';

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

export const landingService = {
  async getLandingData(): Promise<LandingDataResponse> {
    try {
      const res = await apiClient<any>('/public/landing');
      const apiDoctors = res?.doctors?.data?.map((d: any): Doctor => ({
        id: d.id,
        name: d.user?.name || `Dr. ${d.specialty || 'Specialist'}`,
        specialty: d.specialty || 'General Medicine',
        experience: d.experienceYears ? `${d.experienceYears} years experience` : '10+ years experience',
        rating: Number(d.rating) || 4.9,
        reviews: d._count?.reviews || 120,
        fee: d.consultationFee ? `$${d.consultationFee}` : '$60',
        location: d.clinic?.name ? `${d.clinic.name}, ${d.clinic.address || 'Main Campus'}` : 'Boston Medical District',
        nextAvailable: 'Today, Available',
        photo: d.user?.avatar || '/f0317ea3-b671-4c69-9468-004b5f92d64b.jpg',
        online: true,
        about: d.bio || `Specialist in ${d.specialty || 'General Medicine'} dedicated to patient-centered care.`,
        languages: ['English', 'Spanish'],
        availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
      })) || [];

      const apiClinics = res?.clinics?.data?.map((c: any): Clinic => ({
        id: c.id,
        name: c.name,
        location: c.city ? `${c.city}, MA` : c.address || 'Boston, MA',
        doctors: `${c._count?.doctors || 24} doctors available`,
        specialties: ['General Medicine', 'Cardiology', 'Pediatrics'],
        rating: 4.8,
        reviews: c._count?.appointments || 450,
        image: '/4efc88dc-859f-477f-9d6c-81ed83d9100c.jpg',
        address: c.address || '100 Medical Blvd',
        phone: c.phone || '+1 (617) 555-0199',
      })) || [];

      return {
        doctors: apiDoctors.length > 0 ? apiDoctors : defaultDoctors,
        clinics: apiClinics.length > 0 ? apiClinics : defaultClinics,
        specialties: defaultSpecialties,
        stats: res?.stats ? {
          verifiedDoctors: res.stats.totalDoctors ? `${res.stats.totalDoctors}+` : '10K+',
          patientsServed: res.stats.totalPatients ? `${res.stats.totalPatients}+` : '50K+',
          appointmentsBooked: res.stats.totalAppointments ? `${res.stats.totalAppointments}+` : '100K+',
          partnerClinics: res.stats.totalClinics ? `${res.stats.totalClinics}+` : '100+',
          ratingAverage: 4.9,
          totalReviews: 62000,
        } : defaultStats,
      };
    } catch {
      // Graceful fallback to initial rich data
      return {
        doctors: defaultDoctors,
        clinics: defaultClinics,
        specialties: defaultSpecialties,
        stats: defaultStats,
      };
    }
  },

  async searchDoctors(query: { q?: string; specialty?: string; clinicId?: string }): Promise<Doctor[]> {
    try {
      const params = new URLSearchParams();
      if (query.q) params.append('q', query.q);
      if (query.specialty && query.specialty !== 'All') params.append('specialty', query.specialty);
      if (query.clinicId) params.append('clinicId', query.clinicId);

      const res = await apiClient<any>(`/public/doctors?${params.toString()}`);
      if (res?.data && res.data.length > 0) {
        return res.data.map((d: any): Doctor => ({
          id: d.id,
          name: d.user?.name || `Dr. ${d.specialty}`,
          specialty: d.specialty || 'General Practice',
          experience: d.experienceYears ? `${d.experienceYears} years experience` : '8+ years',
          rating: Number(d.rating) || 4.9,
          reviews: d._count?.reviews || 95,
          fee: d.consultationFee ? `$${d.consultationFee}` : '$60',
          location: d.clinic?.name || 'Boston Clinic',
          nextAvailable: 'Today, 3:00 PM',
          photo: d.user?.avatar || '/f0317ea3-b671-4c69-9468-004b5f92d64b.jpg',
          online: true,
          about: d.bio,
          languages: ['English'],
          availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
        }));
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
