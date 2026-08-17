import { useEffect, useState } from "react";
import { Star, MessageSquare, ThumbsUp, RefreshCw } from "lucide-react";
import { reviews as mockReviews } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

const ratingDist = [
  { stars: 5, count: 248, pct: 79 },
  { stars: 4, count: 44, pct: 14 },
  { stars: 3, count: 12, pct: 4 },
  { stars: 2, count: 5, pct: 1.5 },
  { stars: 1, count: 3, pct: 1 },
];

export default function Reviews({ onToast }: { onToast?: (msg: string) => void }) {
  const [reviewList, setReviewList] = useState<any[]>(mockReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data: any = await doctorApi.listReviews();
        if (data && (Array.isArray(data) && data.length > 0)) {
          setReviewList(data);
        }
      } catch (err) {
        console.warn("Using offline doctor reviews fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSendReply = (id: string) => {
    if (onToast) onToast("Doctor reply published to patient!");
    else alert("Doctor reply published to patient!");
    setReplyingTo(null);
    setReply("");
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Reviews & Clinical Ratings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Verified patient feedback and clinical bedside manner scoring.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
          <div className="font-doctor text-6xl font-bold text-slate-900 dark:text-white mb-1">4.8</div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < 5 ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
            ))}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Based on 312 verified reviews</div>
          <div className="w-full mt-6 space-y-2">
            {ratingDist.map((r) => (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-8 text-right font-medium">{r.stars}★</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-8">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 w-full grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
              <div className="font-bold text-slate-900 dark:text-white text-base">98%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Would recommend</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
              <div className="font-bold text-slate-900 dark:text-white text-base">4.9</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Bedside manner</div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="xl:col-span-2 space-y-3">
          {reviewList.map((r) => (
            <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img src={r.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format"} alt={r.patient} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{r.patient || "Verified Patient"}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{r.treatment || "General Consultation"} · {r.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{r.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                &ldquo;{r.comment || r.text || 'Dr. Mitchell is very compassionate and took the time to explain everything thoroughly.'}&rdquo;
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
          ))}
        </div>
      </div>
    </div>
  );
}
