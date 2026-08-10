import { useState } from 'react';
import { Search, MapPin, Clock, Filter, ChevronDown, Star, Video, Building2, SlidersHorizontal } from 'lucide-react';
import { doctors, specialties } from '../data/mockData';
import type { Doctor } from '../data/mockData';
import { Badge, Card, Stars, Button, Avatar } from './ui';

export default function FindDoctors({ onBookDoctor }: { onBookDoctor: (doctorId: string) => void }) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [gender, setGender] = useState('all');
  const [consultType, setConsultType] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxFee, setMaxFee] = useState(2000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const filtered = doctors.filter(d => {
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) &&
      !d.specialty.toLowerCase().includes(query.toLowerCase())) return false;
    if (specialty !== 'All Specialties' && d.specialty !== specialty) return false;
    if (gender !== 'all' && d.gender !== gender) return false;
    if (consultType === 'online' && !d.availableOnline) return false;
    if (d.rating < minRating) return false;
    if (d.fee > maxFee) return false;
    return true;
  });

  if (selectedDoctor) {
    return <DoctorProfile doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} onBook={() => { setSelectedDoctor(null); onBookDoctor(selectedDoctor.id); }} />;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>Find Doctors</h1>
        <p className="text-slate-500 text-sm mt-0.5">Discover and book appointments with top specialists near you.</p>
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
            />
          </div>
          <div className="relative">
            <select
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 bg-white text-slate-700 transition min-w-[180px]"
            >
              {specialties.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${filtersOpen ? 'bg-sky-50 border-sky-300 text-sky-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Gender</label>
              <div className="flex gap-2">
                {['all', 'male', 'female'].map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${gender === g ? 'bg-sky-600 text-white border-sky-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {g === 'all' ? 'Any' : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Consultation</label>
              <div className="flex gap-2">
                {['all', 'online', 'clinic'].map(t => (
                  <button key={t} onClick={() => setConsultType(t)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${consultType === t ? 'bg-sky-600 text-white border-sky-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {t === 'all' ? 'Any' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}</label>
              <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(+e.target.value)}
                className="w-full accent-sky-600" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Max Fee: ₹{maxFee}</label>
              <input type="range" min={200} max={2000} step={100} value={maxFee} onChange={e => setMaxFee(+e.target.value)}
                className="w-full accent-sky-600" />
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500 mb-4">
        <span className="font-medium text-slate-800">{filtered.length}</span> doctors found
      </p>

      {/* Doctor cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(dr => (
          <DoctorCard key={dr.id} doctor={dr} onView={() => setSelectedDoctor(dr)} onBook={() => onBookDoctor(dr.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600">No doctors found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doctor: dr, onView, onBook }: { doctor: Doctor; onView: () => void; onBook: () => void }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar src={dr.photo} name={dr.name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>{dr.name}</h3>
                <p className="text-xs text-sky-600 font-medium mt-0.5">{dr.specialty}</p>
              </div>
              {dr.availableOnline && <Badge variant="online" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">{dr.experience} yrs experience</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Stars rating={dr.rating} />
              <span className="text-xs font-semibold text-slate-700">{dr.rating}</span>
              <span className="text-xs text-slate-400">({dr.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{dr.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${dr.nextSlot.startsWith('Today') ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              Next: {dr.nextSlot}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Consultation fee</span>
            <span className="font-semibold text-emerald-700">₹{dr.fee}</span>
          </div>
        </div>

        {/* Qualifications */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {dr.qualifications.slice(0, 3).map(q => (
            <span key={q} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{q}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto px-5 pb-5 flex gap-2">
        <Button variant="secondary" size="sm" onClick={onView} className="flex-1">View Profile</Button>
        <Button variant="primary" size="sm" onClick={onBook} className="flex-1">Book Now</Button>
      </div>
    </Card>
  );
}

function DoctorProfile({ doctor: dr, onBack, onBook }: { doctor: Doctor; onBack: () => void; onBook: () => void }) {
  const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM', '11:30 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:30 PM', '6:00 PM'];
  const [selectedSlot, setSelectedSlot] = useState('');

  return (
    <div className="p-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to results
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <Card className="p-6">
            <div className="flex items-start gap-5">
              <Avatar src={dr.photo} name={dr.name} size="xl" />
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>{dr.name}</h2>
                    <p className="text-sky-600 font-medium">{dr.specialty}</p>
                  </div>
                  <div className="flex gap-2">
                    {dr.availableOnline && <Badge variant="online" />}
                    <Badge variant="clinic" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={dr.rating} size="md" />
                  <span className="font-semibold text-slate-700">{dr.rating}</span>
                  <span className="text-slate-400 text-sm">({dr.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" />{dr.clinicName}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />{dr.location}</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-700">₹{dr.fee} / visit</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{dr.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {dr.qualifications.map(q => (
                <span key={q} className="text-xs px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-100">{q}</span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Languages</p>
                <p className="text-slate-700">{dr.languages.join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Experience</p>
                <p className="text-slate-700">{dr.experience} years</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Clinic Address</p>
                <p className="text-slate-700">{dr.clinicAddress}</p>
              </div>
            </div>
          </Card>

          {/* Placeholder reviews */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Patient Reviews</h3>
            {[
              { author: 'Ananya P.', rating: 5, text: 'Exceptional doctor, very thorough and caring. Took the time to explain everything clearly.', ago: '2 weeks ago' },
              { author: 'Rohan K.', rating: 5, text: 'Highly professional. Diagnosed my condition accurately on the first visit. Highly recommended.', ago: '1 month ago' },
              { author: 'Meena S.', rating: 4, text: 'Good experience overall. Very knowledgeable doctor. Slight wait time at the clinic.', ago: '2 months ago' },
            ].map((r, i) => (
              <div key={i} className={`py-4 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {r.author[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{r.author}</span>
                  </div>
                  <span className="text-xs text-slate-400">{r.ago}</span>
                </div>
                <Stars rating={r.rating} />
                <p className="text-sm text-slate-600 mt-1.5">{r.text}</p>
              </div>
            ))}
          </Card>
        </div>

        {/* Booking sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Book Appointment</h3>
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-600 mb-2">Select a time slot</p>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                      selectedSlot === slot
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-slate-100 text-sm">
              <span className="text-slate-500">Consultation fee</span>
              <span className="font-semibold text-slate-800">₹{dr.fee}</span>
            </div>
            <Button variant="primary" onClick={onBook} className="w-full justify-center mt-2" disabled={!selectedSlot}>
              Book Appointment
            </Button>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">Next Available</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dr.nextSlot.startsWith('Today') ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <p className="text-sm font-medium text-slate-800">{dr.nextSlot}</p>
            </div>
            {dr.availableOnline && (
              <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2 border border-teal-100">
                <Video className="w-3.5 h-3.5" />
                Online consultation available
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
