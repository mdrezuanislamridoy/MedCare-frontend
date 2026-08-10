export type Testimonial = {
  id: string;
  name: string;
  detail: string;
  rating: number;
  quote: string;
  photo: string;
};

export const testimonials: Testimonial[] = [
{
  id: 'sara',
  name: 'Sara Whitfield',
  detail: 'Booked a dermatology visit',
  rating: 5,
  quote:
  'I found a verified specialist and had an appointment confirmed in under three minutes. The reminders meant I actually showed up on time.',
  photo: "/46c3379e-3c90-41e0-9fa7-f5f754774e2d.jpg"

},
{
  id: 'daniel',
  name: 'Daniel Okafor',
  detail: 'Online consultation patient',
  rating: 5,
  quote:
  'The video consult felt exactly like being in the room. My prescription was in my records before the call even ended.',
  photo: "/064be6a3-12bc-49ab-ad1f-ac8b24e8e9fc.jpg"

},
{
  id: 'margaret',
  name: 'Margaret Ellis',
  detail: 'Cardiology follow-up',
  rating: 4,
  quote:
  'Comparing doctors by experience and fees took the guesswork out of it. My whole family now books their check-ups here.',
  photo: "/d7e6a116-0e54-4d57-945c-f4f14ba1345d.jpg"

}];