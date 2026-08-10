export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
{
  question: 'How do I book an appointment?',
  answer:
  'Search by doctor, specialty, or location, open the profile you like, pick an open time slot, and confirm. You will receive a confirmation by email and SMS within seconds.'
},
{
  question: 'Can I cancel or reschedule?',
  answer:
  'Yes. Appointments can be cancelled or moved free of charge up to 4 hours before the scheduled time from your dashboard or the confirmation email.'
},
{
  question: 'Can I consult online?',
  answer:
  'Most doctors offer secure video consultations. Look for the "Online" badge on a profile and choose "Video visit" when selecting your slot.'
},
{
  question: 'Are doctors verified?',
  answer:
  'Every doctor is manually reviewed. We check medical licences, board registrations, clinic affiliation, and malpractice history before a profile goes live.'
},
{
  question: 'How does payment work?',
  answer:
  'You can pay online at booking or directly at the clinic. Consultation fees are always shown up front, with no booking fees or hidden charges.'
},
{
  question: 'Can I access my prescriptions online?',
  answer:
  'Yes. Digital prescriptions, lab reports, and visit summaries are stored in your encrypted medical records and can be downloaded or shared anytime.'
}];