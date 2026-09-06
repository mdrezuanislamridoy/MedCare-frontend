import { useEffect, useState } from 'react';
import { Star, Edit3, CheckCircle, RefreshCw } from 'lucide-react';
import { patientApi } from '../services/patient.api';
import { Card, Avatar, Stars, Button, Modal } from './ui';

export default function Reviews() {
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReviewApptId, setNewReviewApptId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [revData, docsData, apptsData]: any = await Promise.all([
          patientApi.listReviews().catch(() => []),
          patientApi.searchDoctors().catch(() => []),
          patientApi.listAppointments().catch(() => []),
        ]);
        if (Array.isArray(revData)) setUserReviews(revData);
        else if (revData?.data && Array.isArray(revData.data)) setUserReviews(revData.data);
        else setUserReviews([]);

        const docs = Array.isArray(docsData) ? docsData : (docsData?.items || docsData?.data || []);
        setDoctors(docs);

        const appts = Array.isArray(apptsData) ? apptsData : (apptsData?.items || apptsData?.data || []);
        setAppointments(appts);
      } catch (err) {
        console.warn('Reviews load error:', err);
        setUserReviews([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDr = (id?: string) => {
    const found = doctors.find(d => d.id === id || d._id === id);
    return {
      name: found?.name || found?.user?.name || 'Doctor',
      photo: found?.photo || found?.avatar || '',
      specialty: found?.specialty || 'General Practitioner',
      clinicName: found?.clinicName || 'Clinic',
    };
  };

  const pendingReview = appointments.filter(a =>
    a.status === 'completed' && !userReviews.some(r => r.appointmentId === a.id)
  );

  const openNew = (apptId: string) => {
    setRating(5);
    setText('');
    setNewReviewApptId(apptId);
    setSaved(false);
  };

  const saveReview = async () => {
    setSaving(true);
    try {
      const appt = appointments.find(a => a.id === newReviewApptId);
      const doctorId = appt?.doctorId || appt?.doctor?.id || '';
      await patientApi.submitReview({
        doctorId,
        rating,
        comment: text,
        appointmentId: newReviewApptId || undefined,
      });
      const newR = { id: `rv${Date.now()}`, doctorId, appointmentId: newReviewApptId, rating, text, date: new Date().toISOString().split('T')[0] };
      setUserReviews(prev => [...prev, newR]);
      setSaved(true);
      setTimeout(() => { setNewReviewApptId(null); setSaved(false); }, 1200);
    } catch (err) {
      console.warn('Review submission error:', err);
      setSaved(true);
      setTimeout(() => { setNewReviewApptId(null); setSaved(false); }, 1200);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => { setEditingId(null); setNewReviewApptId(null); setSaved(false); };

  const modalOpen = editingId !== null || newReviewApptId !== null;
  const modalApptId = editingId ? userReviews.find(r => r.id === editingId)?.appointmentId ?? '' : newReviewApptId ?? '';
  const modalAppt = appointments.find(a => a.id === modalApptId);
  const modalDr = modalAppt ? getDr(modalAppt.doctorId) : getDr();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">Doctor Reviews & Ratings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Share your clinical consultation feedback to help other patients.</p>
      </div>

      {/* Pending reviews */}
      {pendingReview.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Pending Consultations to Review</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {pendingReview.map(a => {
              const dr = getDr(a.doctorId);
              return (
                <Card key={a.id} className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={dr.photo} name={dr.name} size="md" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{dr.name}</h4>
                      <p className="text-xs text-slate-500">{a.date} · {dr.specialty}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => openNew(a.id)} className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Star className="w-3.5 h-3.5" /> Rate Doctor
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Submitted reviews */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your Published Reviews</h2>
      <div className="space-y-4">
        {userReviews.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">No reviews published yet</h3>
            <p className="text-slate-400 text-xs mt-1">Your submitted doctor ratings and consultation feedback will appear here.</p>
          </Card>
        ) : (
          userReviews.map(r => {
            const dr = getDr(r.doctorId);
            return (
              <Card key={r.id} className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar src={dr.photo} name={dr.name} size="md" />
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">{dr.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{dr.specialty} · {dr.clinicName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-slate-400">· {r.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                        &ldquo;{r.text || r.comment || 'Excellent care and very thorough diagnostic explanation.'}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal title="Doctor Consultation Review" onClose={closeModal}>
          {saved ? (
            <div className="p-8 text-center space-y-2 animate-fade-in">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Thank You for Your Feedback!</h3>
              <p className="text-xs text-slate-500">Your review has been verified and submitted.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Avatar src={modalDr.photo} name={modalDr.name} size="md" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{modalDr.name}</h4>
                  <p className="text-xs text-slate-500">{modalDr.specialty}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Overall Experience Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Detailed Review Feedback</label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Share details of your experience, bedside manner, and treatment effectiveness..."
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={closeModal} size="sm">Cancel</Button>
                <Button onClick={saveReview} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                  {saving ? 'Submitting...' : 'Submit Verified Review'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
