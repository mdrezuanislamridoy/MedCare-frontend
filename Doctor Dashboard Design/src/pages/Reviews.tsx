import { useState } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { reviews } from "../data/mockData";

const ratingDist = [
  { stars: 5, count: 248, pct: 79 },
  { stars: 4, count: 44, pct: 14 },
  { stars: 3, count: 12, pct: 4 },
  { stars: 2, count: 5, pct: 1.5 },
  { stars: 1, count: 3, pct: 1 },
];

export default function Reviews() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  return (
    <div className="animate-fade-in space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center">
          <div className="text-6xl font-bold text-slate-900 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>4.8</div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < 5 ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
            ))}
          </div>
          <div className="text-sm text-slate-500">Based on 312 reviews</div>
          <div className="w-full mt-6 space-y-2">
            {ratingDist.map((r) => (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-8 text-right">{r.stars}★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-8">{r.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-slate-100 w-full grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="font-bold text-slate-900">98%</div>
              <div className="text-xs text-slate-500">Would recommend</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="font-bold text-slate-900">4.9</div>
              <div className="text-xs text-slate-500">Bedside manner</div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="xl:col-span-2 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img src={r.avatar} alt={r.patient} className="w-10 h-10 rounded-full object-cover bg-slate-100 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">{r.patient}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">{r.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Helpful">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">{r.comment}</p>
              {r.replied && r.reply && (
                <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <div className="text-xs font-semibold text-teal-700 mb-1">Dr. Mitchell replied:</div>
                  <p className="text-sm text-teal-800">{r.reply}</p>
                </div>
              )}
              {!r.replied && (
                <div className="mt-3">
                  {replyingTo === r.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setReplyingTo(null)} className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                        <button onClick={() => { setReplyingTo(null); setReply(""); }} className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-teal-700 transition-colors">Post Reply</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyingTo(r.id)} className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium">
                      <MessageSquare className="w-3.5 h-3.5" /> Reply to review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
