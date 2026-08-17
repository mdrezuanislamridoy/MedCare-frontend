import { useEffect, useState } from 'react';
import { Check, ChevronRight, Calendar, Clock, Video, Building2, CreditCard, User, MapPin, RefreshCw } from 'lucide-react';
import { doctors, patient } from '../data/mockData';
import { Avatar, Button, Badge, Card } from './ui';
import { patientApi } from '../services/patient.api';

const STEPS = ['Doctor', 'Date & Slot', 'Type', 'Details', 'Payment', 'Confirmation'];

const fallbackSlots: Record<string, string[]> = {
  '2026-08-12': ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:00 PM', '5:00 PM'],
  '2026-08-13': ['9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM'],
  '2026-08-14': ['10:00 AM', '10:30 AM', '3:30 PM', '5:30 PM'],
  '2026-08-15': ['9:00 AM', '11:00 AM', '2:00 PM'],
};

export default function BookAppointment({ doctorId, onDone }: { doctorId: string; onDone: () => void }) {
  const doctor = doctors.find(d => d.id === doctorId) ?? doctors[0];
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('2026-08-12');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultType, setConsultType] = useState<'clinic' | 'online'>('clinic');
  const [symptoms, setSymptoms] = useState('');
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dynamicSlots, setDynamicSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const dates = ['2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15'];

  useEffect(() => {
    async function loadDoctorLiveSlots() {
      if (!selectedDate) return;
      setLoadingSlots(true);
      try {
        const res: any = await patientApi.getDoctorSlots(doctor.id || doctorId, selectedDate);
        if (res && Array.isArray(res) && res.length > 0) {
          setDynamicSlots(res.map((s: any) => s.time || s));
        } else {
          setDynamicSlots(fallbackSlots[selectedDate] || fallbackSlots['2026-08-12']);
        }
      } catch (err) {
        setDynamicSlots(fallbackSlots[selectedDate] || fallbackSlots['2026-08-12']);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadDoctorLiveSlots();
  }, [selectedDate, doctorId, doctor.id]);

  const slots = dynamicSlots.length > 0 ? dynamicSlots : (fallbackSlots[selectedDate] ?? []);
  const booked = selectedDate === '2026-08-12' ? ['10:00 AM', '3:00 PM'] : [];

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await patientApi.bookAppointment({
        doctorId: doctor.id || doctorId,
        date: selectedDate || '2026-08-12',
        timeSlot: selectedSlot || '10:00 AM',
        type: consultType === 'online' ? 'VIDEO' : 'IN_PERSON',
        reason: symptoms || 'General Consultation',
      }).catch((e) => console.warn('Book appointment fallback:', e));
    } finally {
      setProcessing(false);
      setStep(6);
      setConfirmed(true);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto py-2">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={s} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              done ? 'bg-emerald-100 text-emerald-700' :
              active ? 'bg-teal-600 text-white shadow-sm' :
              'bg-slate-100 text-slate-400'
            }`}>
              {done ? <Check className="w-3 h-3" /> : <span className="w-4 text-center">{n}</span>}
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-semibold text-slate-800">Book Appointment</h1>
        <p className="text-slate-500 text-sm mt-0.5">Complete the steps below to confirm your appointment.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <StepIndicator />

        {/* Step 1 – Doctor */}
        {step === 1 && (
          <Card className="p-4 sm:p-6 animate-fade-in">
            <h2 className="font-patient font-semibold text-slate-800 mb-4">Your Doctor</h2>
            <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <Avatar src={doctor.photo} name={doctor.name} size="lg" />
              <div className="flex-1">
                <p className="font-patient font-semibold text-slate-800">{doctor.name}</p>
                <p className="text-teal-600 text-sm">{doctor.specialty}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{doctor.experience} yrs exp</span>
                  <span>·</span>
                  <span className="font-medium text-emerald-700">₹{doctor.fee}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              {doctor.clinicAddress}
            </div>
            <Button onClick={() => setStep(2)} className="w-full justify-center mt-6">Continue</Button>
          </Card>
        )}

        {/* Step 2 – Date & Slot */}
        {step === 2 && (
          <Card className="p-4 sm:p-6 animate-fade-in">
            <h2 className="font-patient font-semibold text-slate-800 mb-4">Select Date & Time</h2>

            <p className="text-sm font-medium text-slate-600 mb-2">Available Dates</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {dates.map(d => (
                <button
                  key={d}
                  onClick={() => { setSelectedDate(d); setSelectedSlot(''); }}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    selectedDate === d
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <p className={`text-xs font-medium ${selectedDate === d ? 'text-teal-100' : 'text-slate-500'}`}>
                    {new Date(d).toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                  <p className={`text-sm font-semibold mt-0.5 ${selectedDate === d ? 'text-white' : 'text-slate-800'}`}>
                    {new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </p>
                </button>
              ))}
            </div>

            {selectedDate && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium text-slate-600 mb-2">Available Slots</p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(slot => {
                    const isBooked = booked.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 text-xs font-medium rounded-lg border transition-all ${
                          isBooked ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through' :
                          isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-sm' :
                          'border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300'
                        }`}
                      >
                        {slot}
                        {isBooked && <span className="block text-[9px] text-slate-300 mt-0.5">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 justify-center">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedSlot} className="flex-1 justify-center">Continue</Button>
            </div>
          </Card>
        )}

        {/* Step 3 – Type */}
        {step === 3 && (
          <Card className="p-4 sm:p-6 animate-fade-in">
            <h2 className="font-patient font-semibold text-slate-800 mb-4">Consultation Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {(['clinic', 'online'] as const).map(type => {
                const isOnlineUnavailable = type === 'online' && !doctor.availableOnline;
                return (
                  <button
                    key={type}
                    disabled={isOnlineUnavailable}
                    onClick={() => setConsultType(type)}
                    className={`p-5 rounded-xl border-2 text-center transition-all ${
                      isOnlineUnavailable ? 'opacity-40 cursor-not-allowed border-slate-100' :
                      consultType === type ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-teal-200'
                    }`}
                  >
                    {type === 'clinic'
                      ? <Building2 className={`w-8 h-8 mx-auto mb-2 ${consultType === 'clinic' ? 'text-teal-600' : 'text-slate-400'}`} />
                      : <Video className={`w-8 h-8 mx-auto mb-2 ${consultType === 'online' ? 'text-teal-600' : 'text-slate-400'}`} />
                    }
                    <p className={`font-medium text-sm ${consultType === type && !isOnlineUnavailable ? 'text-teal-700' : 'text-slate-700'}`}>
                      {type === 'clinic' ? 'In-Clinic' : 'Online'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {type === 'clinic' ? 'Visit the clinic' : isOnlineUnavailable ? 'Not available' : 'Video consultation'}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 justify-center">Back</Button>
              <Button onClick={() => setStep(4)} className="flex-1 justify-center">Continue</Button>
            </div>
          </Card>
        )}

        {/* Step 4 – Patient Details */}
        {step === 4 && (
          <Card className="p-4 sm:p-6 animate-fade-in">
            <h2 className="font-patient font-semibold text-slate-800 mb-4">Patient Details</h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">{patient.name}</p>
                <p className="text-xs text-slate-500">{patient.email} · {patient.phone}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Symptoms / Reason for visit</label>
              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms or reason for the appointment..."
                rows={4}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none transition placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep(3)} className="flex-1 justify-center">Back</Button>
              <Button onClick={() => setStep(5)} className="flex-1 justify-center">Continue</Button>
            </div>
          </Card>
        )}

        {/* Step 5 – Payment */}
        {step === 5 && (
          <Card className="p-4 sm:p-6 animate-fade-in">
            <h2 className="font-patient font-semibold text-slate-800 mb-4">Payment</h2>

            {/* Booking summary */}
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor</span>
                <span className="font-medium text-slate-800">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-800">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <Badge variant={consultType} />
              </div>
              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                <span className="font-patient font-semibold text-slate-700">Total</span>
                <span className="font-semibold text-emerald-700">₹{doctor.fee}</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-600 mb-3">Payment Method</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {(['card', 'upi', 'wallet'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPayMethod(method)}
                  className={`p-3 rounded-xl border-2 text-center transition-colors ${payMethod === method ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-teal-200'}`}
                >
                  <CreditCard className={`w-5 h-5 mx-auto mb-1 ${payMethod === method ? 'text-teal-600' : 'text-slate-400'}`} />
                  <p className={`text-xs font-medium capitalize ${payMethod === method ? 'text-teal-700' : 'text-slate-600'}`}>
                    {method === 'upi' ? 'UPI' : method.charAt(0).toUpperCase() + method.slice(1)}
                  </p>
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="space-y-3 mb-5 animate-fade-in">
                <input type="text" placeholder="Card number" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM / YY" className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition" />
                  <input type="text" placeholder="CVV" className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition" />
                </div>
              </div>
            )}

            {payMethod === 'upi' && (
              <div className="mb-5 animate-fade-in">
                <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition" />
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(4)} className="flex-1 justify-center">Back</Button>
              <Button onClick={handlePayment} disabled={processing} className="flex-1 justify-center">
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : `Pay ₹${doctor.fee}`}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 6 – Confirmation */}
        {step === 6 && confirmed && (
          <Card className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="font-patient text-xl font-semibold text-slate-800 mb-2">Appointment Confirmed!</h2>
            <p className="text-slate-500 text-sm mb-6">Your appointment has been successfully booked. A confirmation has been sent to your email.</p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor</span>
                <span className="font-medium text-slate-800">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-800">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <Badge variant={consultType} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-semibold text-emerald-700">₹{doctor.fee}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={onDone} className="flex-1 justify-center">Back to Dashboard</Button>
              <Button onClick={onDone} className="flex-1 justify-center">
                <Calendar className="w-4 h-4" /> View Appointments
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
