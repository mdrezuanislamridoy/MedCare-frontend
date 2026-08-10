export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  fee: string;
  location: string;
  nextAvailable: string;
  photo: string;
  online: boolean;
};

export const doctors: Doctor[] = [
{
  id: 'anjali-sharma',
  name: 'Dr. Anjali Sharma',
  specialty: 'Cardiologist',
  experience: '14 years experience',
  rating: 4.9,
  reviews: 486,
  fee: '$75',
  location: 'Riverside Heart Institute, Boston',
  nextAvailable: 'Today, 4:30 PM',
  photo: "/f0317ea3-b671-4c69-9468-004b5f92d64b.jpg",

  online: true
},
{
  id: 'marcus-bell',
  name: 'Dr. Marcus Bell',
  specialty: 'Dermatologist',
  experience: '11 years experience',
  rating: 4.8,
  reviews: 372,
  fee: '$60',
  location: 'Clearskin Clinic, Cambridge',
  nextAvailable: 'Tomorrow, 9:00 AM',
  photo: "/d60ecb42-9185-499d-aa67-2ceaf99932f4.jpg",

  online: true
},
{
  id: 'kenji-tanaka',
  name: 'Dr. Kenji Tanaka',
  specialty: 'Neurologist',
  experience: '19 years experience',
  rating: 4.9,
  reviews: 291,
  fee: '$95',
  location: 'Northbridge Neuro Center, Boston',
  nextAvailable: 'Wed, 11:15 AM',
  photo: "/5911a02b-02dd-4775-8e5d-c00dd6fc58d6.jpg",

  online: false
},
{
  id: 'emily-carter',
  name: 'Dr. Emily Carter',
  specialty: 'Pediatrician',
  experience: '9 years experience',
  rating: 5.0,
  reviews: 654,
  fee: '$55',
  location: 'Little Steps Family Clinic, Quincy',
  nextAvailable: 'Today, 6:00 PM',
  photo: "/c96f4173-06a3-4181-b4f4-608dcc73d1f0.jpg",

  online: true
}];