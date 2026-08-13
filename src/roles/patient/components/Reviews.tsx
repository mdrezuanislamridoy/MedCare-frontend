import { useState } from 'react';
import { Star, Edit3, CheckCircle } from 'lucide-react';
import { reviews, appointments, doctors } from '../data/mockData';
import { Card, Avatar, Stars, Button, Modal } from './ui';

export default function Reviews() {
  const [userReviews, setUserReviews] = useState(reviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReviewApptId, setNewReviewApptId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const getDr = (id: string) => doctors.find(d => d.id === id)!;

  const pendingReview = appointments.filter(a =>
    a.status === 'completed' && !userReviews.some(r => r.appointmentId === a.id)
  );

  const openEdit = (id: string) => {
    const r = userReviews.find(x => x.id === id);
    if (!r) return;
    setRating(r.rating);
    setText(r.text);
    setEditingId(id);
    setSaved(false);
  };

  const openNew = (apptId: string) => {
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) return;
    setRating(5);
    setText('');
    setNewReviewApptId(apptId);
    setSaved(false);
  };

  const saveReview = () => {
    if (editingId) {
      setUserReviews(prev => prev.map(r => r.id === editingId ? { ...r, rating, text, edited: true } : r));
      setSaved(true);
      setTimeout(() => { setEditingId(null); setSaved(false); }, 1200);
    } else if (newReviewApptId) {
      const appt = appointments.find(a => a.id === newReviewApptId)!;
      const newR = { id: `rv${Date.now()}`, doctorId: appt.doctorId, appointmentId: newReviewApptId, rating, text, date: '2026-08-10' };
      setUserReviews(prev => [...prev, newR]);
      setSaved(true);
      setTimeout(() => { setNewReviewApptId(null); setSaved(false); }, 1200);
    }
  };

  const closeModal = () => { setEditingId(null); setNewReviewApptId(null); setSaved(false); };

  const modalOpen = editingId !== null || newReviewApptId !== null;
  const modalApptId = editingId ? userReviews.find(r => r.id === editingId)?.appointmentId ?? '' : newReviewApptId ?? '';
  const modalAppt = appointments.find(a => a.id === modalApptId);
  const modalDr = modalAppt ? getDr(modalAppt.doctorId) : null;

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-semibold text-slate-800">Reviews</h1>
        <p className="text-slate-500 text-sm mt-0.5">Share your experience to help other patients find the right doctor.</p>
      </div>

      {/* Pending reviews */}
      {pendingReview.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Awaiting Your Review</h2>
          <div className="space-y-3">
            {pendingReview.map(appt => {
              const dr = getDr(appt.doctorId);
              return (
                <Card key={appt.id} className="p-4 border-amber-200 bg-amber-50">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Avatar src={dr.photo} name={dr.name} size="md" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{dr.name}</p>
                        <p className="text-xs text-slate-500">{dr.specialty} · {appt.date}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => openNew(appt.id)}>
                      <Star className="w-3.5 h-3.5" /> Write Review
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* My reviews */}
      <h2 className="text-sm font-semibold text-slate-700 mb-3">My Reviews</h2>
      {userReviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600">No reviews yet</p>
          <p className="text-sm text-slate-400 mt-1">Complete an appointment to leave a review.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {userReviews.map(rv => {
            const dr = getDr(rv.doctorId);
            return (
              <Card key={rv.id} className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar src={dr.photo} name={dr.name} size="md" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <p className="font-patient font-semibold text-slate-800 text-sm">{dr.name}</p>
                        <p className="text-xs text-teal-600">{dr.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {rv.edited && <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Edited</span>}
                        <Button size="sm" variant="ghost" onClick={() => openEdit(rv.id)}>
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Stars rating={rv.rating} />
                      <span className="text-sm font-semibold text-slate-700">{rv.rating}.0</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{rv.text}</p>
                    <p className="text-xs text-slate-400 mt-2">{rv.date}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review modal */}
      {modalOpen && modalDr && (
        <Modal onClose={closeModal} title={editingId ? 'Edit Review' : 'Write a Review'} size="md">
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Avatar src={modalDr.photo} name={modalDr.name} size="md" />
              <div>
                <p className="font-medium text-slate-800 text-sm">{modalDr.name}</p>
                <p className="text-xs text-teal-600">{modalDr.specialty}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 ${i <= (hoverRating || rating) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoverRating || rating]}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Your Review</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                placeholder="Share your experience with this doctor..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none transition placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{text.length}/500</p>
            </div>

            {saved ? (
              <div className="flex items-center justify-center gap-2 py-3 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Review saved!</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="secondary" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
                <Button onClick={saveReview} disabled={!text.trim()} className="flex-1 justify-center">
                  {editingId ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
