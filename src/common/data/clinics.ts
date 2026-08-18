export type Clinic = {
  id: string;
  name: string;
  location: string;
  address?: string;
  phone?: string;
  doctors: string;
  specialties: string[];
  rating: number;
  reviews: number;
  image: string;
  hours?: string;
  emergency24_7?: boolean;
};

export const clinics: Clinic[] = [
  {
    id: 'riverside',
    name: 'Riverside Medical Center',
    location: 'Back Bay, Boston',
    address: '450 Commonwealth Ave, Boston, MA 02215',
    phone: '+1 (617) 555-0144',
    doctors: '48 doctors available',
    specialties: ['Cardiology', 'General Medicine', 'Gynecology', 'Radiology'],
    rating: 4.8,
    reviews: 1240,
    image: '/4efc88dc-859f-477f-9d6c-81ed83d9100c.jpg',
    hours: 'Mon - Sun: 7:00 AM - 10:00 PM',
    emergency24_7: true,
  },
  {
    id: 'northbridge',
    name: 'Northbridge Hospital',
    location: 'Cambridge, MA',
    address: '880 Main Street, Cambridge, MA 02139',
    phone: '+1 (617) 555-0288',
    doctors: '112 doctors available',
    specialties: ['Neurology', 'Orthopedics', 'Emergency', 'Cardiology'],
    rating: 4.7,
    reviews: 2085,
    image: '/9e415a07-7a37-45bc-bc31-318f410ab766.jpg',
    hours: '24 Hours / 7 Days',
    emergency24_7: true,
  },
  {
    id: 'clearview',
    name: 'Clearview Specialty Clinic',
    location: 'Quincy, MA',
    address: '124 Hancock St, Quincy, MA 02169',
    phone: '+1 (617) 555-0399',
    doctors: '26 doctors available',
    specialties: ['Dentistry', 'Dermatology', 'Pediatrics'],
    rating: 4.9,
    reviews: 730,
    image: '/f5076135-84ec-4cfd-a41d-9f3f20dd01f4.jpg',
    hours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    emergency24_7: false,
  },
];