export type Clinic = {
  id: string;
  name: string;
  location: string;
  doctors: string;
  specialties: string[];
  rating: number;
  reviews: number;
  image: string;
};

export const clinics: Clinic[] = [
{
  id: 'riverside',
  name: 'Riverside Medical Center',
  location: 'Back Bay, Boston',
  doctors: '48 doctors available',
  specialties: ['Cardiology', 'General Medicine', 'Radiology'],
  rating: 4.8,
  reviews: 1240,
  image: "/4efc88dc-859f-477f-9d6c-81ed83d9100c.jpg"

},
{
  id: 'northbridge',
  name: 'Northbridge Hospital',
  location: 'Cambridge, MA',
  doctors: '112 doctors available',
  specialties: ['Neurology', 'Orthopedics', 'Emergency'],
  rating: 4.7,
  reviews: 2085,
  image: "/9e415a07-7a37-45bc-bc31-318f410ab766.jpg"

},
{
  id: 'clearview',
  name: 'Clearview Specialty Clinic',
  location: 'Quincy, MA',
  doctors: '26 doctors available',
  specialties: ['Dentistry', 'Dermatology', 'Pediatrics'],
  rating: 4.9,
  reviews: 730,
  image: "/f5076135-84ec-4cfd-a41d-9f3f20dd01f4.jpg"

}];