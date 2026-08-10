interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "checked-in": { label: "Checked In", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  "in-progress": { label: "In Progress", bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  completed: { label: "Completed", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  "no-show": { label: "No Show", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  active: { label: "Active", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  inactive: { label: "Inactive", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  paid: { label: "Paid", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  refunded: { label: "Refunded", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  online: { label: "Online", bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  "in-person": { label: "In-Person", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  unread: { label: "Unread", bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = statusConfig[status] || { label: status, bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
