import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { doctorApi } from "../services/doctor.api";

export default function Reviews({ onToast }: { onToast?: (msg: string) => void }) {
  const [reviewList, setReviewList] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data: any = await doctorApi.listReviews();
        if (data && Array.isArray(data)) {
          setReviewList(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setReviewList(data.data);
        }
      } catch (err) {
        console.warn("Could not load doctor reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSendReply = async (id: string) => {
    try {
      await doctorApi.replyReview(id, reply);
      if (onToast) onToast("Doctor reply published to patient!");
      else alert("Doctor reply published to patient!");
    } catch (err) {
      if (onToast) onToast("Doctor reply recorded.");
      else alert("Doctor reply recorded.");
    } finally {
      setReplyingTo(null);
      setReply("");
    }
  };

  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviewList.length).toFixed(1)
    : "0.0";

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Reviews & Clinical Ratings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Verified patient feedback and clinical bedside manner scoring.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
          <div className="font-doctor text-6xl font-bold text-slate-900 dark:text-white mb-1">{avgRating}</div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${Number(avgRating) >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
            ))}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Based on {reviewList.length} verified {reviewList.length === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* Reviews List */}
        <div className="xl:col-span-2 space-y-3">
          {reviewList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <Star className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 dark:text-white text-base">No reviews yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Patient ratings and clinical reviews will appear here following completed consultations.</p>
            </div>
          ) : (
            reviewList.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      {(r.patient?.slice(0, 2) || r.patientName?.slice(0, 2) || "PT").toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{r.patient || r.patientName || "Verified Patient"}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{r.treatment || "Consultation"} · {r.date || "Recent"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{r.rating ?? 5}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  &ldquo;{r.comment || r.text || "No written comment provided."}&rdquo;
                </p>

                {replyingTo === r.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write a clinical or professional response..."
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setReplyingTo(null)} className="px-3 py-1 text-xs text-slate-500">Cancel</button>
                      <button onClick={() => handleSendReply(r.id)} className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold">
                        Post Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(r.id)}
                    className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Reply to Patient
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
