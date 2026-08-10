import { useState, useMemo, type ReactNode, type ElementType } from "react";
import {
  LayoutDashboard, Users, UserCheck, Building2, Calendar, CreditCard,
  Star, Bell, Activity, Shield, Search, LogOut, Eye, Edit, Check,
  AlertTriangle, Download, Plus, TrendingUp, TrendingDown, ChevronLeft,
  Menu, CheckCircle, XCircle, AlertCircle, RefreshCw, Send, Flag,
  Lock, Unlock, DollarSign, FileText, Clock, MapPin, Phone, Mail,
  User, Info
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast, Toaster } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────
type ViewId =
  | "dashboard" | "doctors" | "verification" | "patients"
  | "clinics" | "appointments" | "finance" | "reviews"
  | "notifications" | "activity" | "audit";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const appointmentTrends = [
  { day: "Mon", completed: 45, cancelled: 8, pending: 32 },
  { day: "Tue", completed: 52, cancelled: 5, pending: 28 },
  { day: "Wed", completed: 61, cancelled: 12, pending: 35 },
  { day: "Thu", completed: 48, cancelled: 7, pending: 41 },
  { day: "Fri", completed: 73, cancelled: 9, pending: 29 },
  { day: "Sat", completed: 38, cancelled: 4, pending: 15 },
  { day: "Sun", completed: 21, cancelled: 3, pending: 9 },
];

const revenueTrends = [
  { month: "Mar", revenue: 48200, refunds: 3200 },
  { month: "Apr", revenue: 52800, refunds: 2900 },
  { month: "May", revenue: 61400, refunds: 4100 },
  { month: "Jun", revenue: 58700, refunds: 3800 },
  { month: "Jul", revenue: 67300, refunds: 2600 },
  { month: "Aug", revenue: 71200, refunds: 3400 },
];

const newUsersData = [
  { week: "W1", patients: 124, doctors: 8 },
  { week: "W2", patients: 98, doctors: 11 },
  { week: "W3", patients: 143, doctors: 7 },
  { week: "W4", patients: 167, doctors: 14 },
];

const doctors = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Cardiology", clinic: "HeartCare Center", rating: 4.9, verificationStatus: "approved", accountStatus: "active", joinedDate: "Jan 15, 2023", appointments: 892 },
  { id: 2, name: "Dr. James Okafor", specialty: "Neurology", clinic: "BrainHealth Clinic", rating: 4.7, verificationStatus: "approved", accountStatus: "active", joinedDate: "Nov 8, 2022", appointments: 634 },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", clinic: "Little Stars Medical", rating: 4.8, verificationStatus: "pending", accountStatus: "active", joinedDate: "Feb 20, 2024", appointments: 156 },
  { id: 4, name: "Dr. Michael Thompson", specialty: "Orthopedics", clinic: "BoneJoint Specialists", rating: 4.6, verificationStatus: "approved", accountStatus: "suspended", joinedDate: "Jun 30, 2022", appointments: 1203 },
  { id: 5, name: "Dr. Priya Patel", specialty: "Dermatology", clinic: "SkinCare Plus", rating: 4.5, verificationStatus: "pending", accountStatus: "active", joinedDate: "Mar 10, 2024", appointments: 89 },
  { id: 6, name: "Dr. David Kim", specialty: "Psychiatry", clinic: "MindWell Institute", rating: 4.8, verificationStatus: "approved", accountStatus: "active", joinedDate: "May 22, 2023", appointments: 445 },
  { id: 7, name: "Dr. Linda Osei", specialty: "Gynecology", clinic: "Women's Health Hub", rating: 4.9, verificationStatus: "approved", accountStatus: "active", joinedDate: "Sep 14, 2022", appointments: 721 },
  { id: 8, name: "Dr. Robert Walsh", specialty: "General Practice", clinic: "FamilyCare Medical", rating: 4.4, verificationStatus: "rejected", accountStatus: "inactive", joinedDate: "Jan 5, 2024", appointments: 0 },
  { id: 9, name: "Dr. Amara Diallo", specialty: "Endocrinology", clinic: "MetabolicCare Center", rating: 4.7, verificationStatus: "pending", accountStatus: "active", joinedDate: "Jul 18, 2024", appointments: 12 },
  { id: 10, name: "Dr. Hassan Khalid", specialty: "Gastroenterology", clinic: "DigestiveCare Clinic", rating: 4.6, verificationStatus: "documents_requested", accountStatus: "inactive", joinedDate: "Jun 5, 2024", appointments: 0 },
];

const verificationQueue = [
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", license: "MED-IL-294851", documents: 4, submitted: "Feb 20, 2024", status: "pending" },
  { id: 5, name: "Dr. Priya Patel", specialty: "Dermatology", license: "MED-CA-847293", documents: 3, submitted: "Mar 10, 2024", status: "pending" },
  { id: 9, name: "Dr. Amara Diallo", specialty: "Endocrinology", license: "MED-NY-562841", documents: 5, submitted: "Jul 18, 2024", status: "pending" },
  { id: 10, name: "Dr. Hassan Khalid", specialty: "Gastroenterology", license: "MED-TX-193847", documents: 2, submitted: "Jun 5, 2024", status: "documents_requested" },
];

const patients = [
  { id: 1, name: "Alice Martinez", email: "alice.m@email.com", phone: "+1 (555) 014-2847", appointments: 12, status: "active", joinedDate: "Mar 15, 2023", lastActivity: "Aug 9, 2024" },
  { id: 2, name: "Benjamin Okafor", email: "ben.okafor@email.com", phone: "+1 (555) 028-7143", appointments: 3, status: "active", joinedDate: "Jan 20, 2024", lastActivity: "Aug 8, 2024" },
  { id: 3, name: "Catherine Liu", email: "c.liu@email.com", phone: "+1 (555) 039-1827", appointments: 8, status: "suspended", joinedDate: "Jul 11, 2023", lastActivity: "Jul 22, 2024" },
  { id: 4, name: "Daniel Foster", email: "dfoster@email.com", phone: "+1 (555) 045-6912", appointments: 21, status: "active", joinedDate: "Nov 30, 2022", lastActivity: "Aug 10, 2024" },
  { id: 5, name: "Elena Vasquez", email: "e.vasquez@email.com", phone: "+1 (555) 051-2847", appointments: 5, status: "active", joinedDate: "Apr 8, 2024", lastActivity: "Aug 7, 2024" },
  { id: 6, name: "Frank Nguyen", email: "f.nguyen@email.com", phone: "+1 (555) 063-4918", appointments: 0, status: "inactive", joinedDate: "Jun 1, 2024", lastActivity: "Jun 15, 2024" },
  { id: 7, name: "Grace Park", email: "g.park@email.com", phone: "+1 (555) 077-8234", appointments: 15, status: "active", joinedDate: "Jan 25, 2023", lastActivity: "Aug 9, 2024" },
  { id: 8, name: "Henry Morgan", email: "h.morgan@email.com", phone: "+1 (555) 084-2916", appointments: 7, status: "active", joinedDate: "Sep 17, 2023", lastActivity: "Aug 6, 2024" },
];

const clinics = [
  { id: 1, name: "HeartCare Center", location: "New York, NY", doctors: 12, appointments: 2840, manager: "Dr. Sarah Chen", status: "active" },
  { id: 2, name: "BrainHealth Clinic", location: "Boston, MA", doctors: 8, appointments: 1923, manager: "John Patterson", status: "active" },
  { id: 3, name: "Little Stars Medical", location: "Chicago, IL", doctors: 15, appointments: 3102, manager: "Maria Santos", status: "active" },
  { id: 4, name: "BoneJoint Specialists", location: "Houston, TX", doctors: 6, appointments: 1456, manager: "Tom Bradley", status: "suspended" },
  { id: 5, name: "SkinCare Plus", location: "Los Angeles, CA", doctors: 9, appointments: 2218, manager: "Dr. Priya Patel", status: "active" },
  { id: 6, name: "MindWell Institute", location: "Seattle, WA", doctors: 11, appointments: 1678, manager: "Rachel Foster", status: "active" },
  { id: 7, name: "Women's Health Hub", location: "Atlanta, GA", doctors: 7, appointments: 2094, manager: "Dr. Linda Osei", status: "active" },
];

const appointments = [
  { id: "APT-20849", patient: "Alice Martinez", doctor: "Dr. Sarah Chen", clinic: "HeartCare Center", date: "Aug 10, 2024", time: "09:00 AM", type: "In-Person", paymentStatus: "paid", status: "completed" },
  { id: "APT-20850", patient: "Benjamin Okafor", doctor: "Dr. David Kim", clinic: "MindWell Institute", date: "Aug 10, 2024", time: "10:30 AM", type: "Video", paymentStatus: "paid", status: "in-progress" },
  { id: "APT-20851", patient: "Daniel Foster", doctor: "Dr. Linda Osei", clinic: "Women's Health Hub", date: "Aug 10, 2024", time: "11:00 AM", type: "In-Person", paymentStatus: "paid", status: "checked-in" },
  { id: "APT-20852", patient: "Elena Vasquez", doctor: "Dr. James Okafor", clinic: "BrainHealth Clinic", date: "Aug 10, 2024", time: "02:00 PM", type: "In-Person", paymentStatus: "pending", status: "confirmed" },
  { id: "APT-20853", patient: "Grace Park", doctor: "Dr. Priya Patel", clinic: "SkinCare Plus", date: "Aug 11, 2024", time: "09:30 AM", type: "In-Person", paymentStatus: "paid", status: "confirmed" },
  { id: "APT-20854", patient: "Henry Morgan", doctor: "Dr. Sarah Chen", clinic: "HeartCare Center", date: "Aug 11, 2024", time: "11:00 AM", type: "Video", paymentStatus: "paid", status: "pending" },
  { id: "APT-20848", patient: "Catherine Liu", doctor: "Dr. Emily Rodriguez", clinic: "Little Stars Medical", date: "Aug 9, 2024", time: "03:00 PM", type: "In-Person", paymentStatus: "refunded", status: "cancelled" },
  { id: "APT-20847", patient: "Frank Nguyen", doctor: "Dr. Michael Thompson", clinic: "BoneJoint Specialists", date: "Aug 9, 2024", time: "04:00 PM", type: "In-Person", paymentStatus: "pending", status: "no-show" },
];

const transactions = [
  { id: "TXN-84921", patient: "Alice Martinez", doctor: "Dr. Sarah Chen", amount: 280, provider: "Stripe", status: "completed", date: "Aug 10, 2024" },
  { id: "TXN-84920", patient: "Daniel Foster", doctor: "Dr. Linda Osei", amount: 195, provider: "PayPal", status: "completed", date: "Aug 10, 2024" },
  { id: "TXN-84919", patient: "Henry Morgan", doctor: "Dr. Sarah Chen", amount: 280, provider: "Stripe", status: "pending", date: "Aug 10, 2024" },
  { id: "TXN-84918", patient: "Grace Park", doctor: "Dr. Priya Patel", amount: 150, provider: "Stripe", status: "completed", date: "Aug 10, 2024" },
  { id: "TXN-84917", patient: "Catherine Liu", doctor: "Dr. Emily Rodriguez", amount: 120, provider: "Stripe", status: "refunded", date: "Aug 9, 2024" },
  { id: "TXN-84916", patient: "Elena Vasquez", doctor: "Dr. James Okafor", amount: 340, provider: "PayPal", status: "pending", date: "Aug 9, 2024" },
  { id: "TXN-84915", patient: "Frank Nguyen", doctor: "Dr. Michael Thompson", amount: 220, provider: "Stripe", status: "failed", date: "Aug 9, 2024" },
  { id: "TXN-84914", patient: "Benjamin Okafor", doctor: "Dr. David Kim", amount: 175, provider: "Stripe", status: "completed", date: "Aug 8, 2024" },
];

const reviews = [
  { id: 1, patient: "Alice Martinez", doctor: "Dr. Sarah Chen", rating: 5, content: "Excellent consultation, very thorough and professional. Highly recommend.", status: "published", flagged: false, date: "Aug 8, 2024" },
  { id: 2, patient: "Anonymous", doctor: "Dr. Michael Thompson", rating: 1, content: "Inappropriate behavior and dismissive attitude. Felt very uncomfortable during the visit.", status: "flagged", flagged: true, date: "Aug 7, 2024" },
  { id: 3, patient: "Daniel Foster", doctor: "Dr. Linda Osei", rating: 4, content: "Great experience overall. Doctor was knowledgeable and genuinely caring.", status: "published", flagged: false, date: "Aug 6, 2024" },
  { id: 4, patient: "Elena Vasquez", doctor: "Dr. James Okafor", rating: 2, content: "Waited over 45 minutes past my appointment time. Very poor scheduling.", status: "under-review", flagged: true, date: "Aug 5, 2024" },
  { id: 5, patient: "Benjamin Okafor", doctor: "Dr. David Kim", rating: 5, content: "Life-changing consultation. Empathetic, knowledgeable, and thorough.", status: "published", flagged: false, date: "Aug 4, 2024" },
  { id: 6, patient: "Grace Park", doctor: "Dr. Priya Patel", rating: 3, content: "Decent experience but the waiting area and facility need significant improvement.", status: "under-review", flagged: true, date: "Aug 3, 2024" },
];

const auditLogs = [
  { id: 1, actor: "Admin Sarah K.", action: "Doctor Approved", resource: "Dr. Emily Rodriguez (ID: 3)", timestamp: "Aug 10, 2024 09:14:22", ip: "192.168.1.45", result: "success" },
  { id: 2, actor: "Admin Marcus L.", action: "Account Suspended", resource: "Dr. Michael Thompson (ID: 4)", timestamp: "Aug 10, 2024 08:52:11", ip: "192.168.1.67", result: "success" },
  { id: 3, actor: "Admin Sarah K.", action: "Refund Processed", resource: "Transaction TXN-84917", timestamp: "Aug 9, 2024 16:33:08", ip: "192.168.1.45", result: "success" },
  { id: 4, actor: "Admin Tom B.", action: "Clinic Suspended", resource: "BoneJoint Specialists (ID: 4)", timestamp: "Aug 9, 2024 14:21:55", ip: "192.168.1.89", result: "success" },
  { id: 5, actor: "Admin Marcus L.", action: "Review Hidden", resource: "Review #2 — Dr. Thompson", timestamp: "Aug 9, 2024 11:07:43", ip: "192.168.1.67", result: "success" },
  { id: 6, actor: "Admin Sarah K.", action: "Doctor Rejected", resource: "Dr. Robert Walsh (ID: 8)", timestamp: "Aug 8, 2024 15:44:31", ip: "192.168.1.45", result: "success" },
  { id: 7, actor: "Admin Tom B.", action: "Login Attempt", resource: "Admin Dashboard", timestamp: "Aug 8, 2024 09:12:04", ip: "10.0.0.1", result: "failed" },
  { id: 8, actor: "Admin Sarah K.", action: "Patient Suspended", resource: "Catherine Liu (ID: 3)", timestamp: "Aug 7, 2024 13:28:17", ip: "192.168.1.45", result: "success" },
];

// ─── Shared Components ───────────────────────────────────────────────────────

const badgeStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  published: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  "under-review": "bg-amber-50 text-amber-700 border border-amber-200",
  "in-progress": "bg-violet-50 text-violet-700 border border-violet-200",
  "checked-in": "bg-sky-50 text-sky-700 border border-sky-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  documents_requested: "bg-blue-50 text-blue-700 border border-blue-200",
  suspended: "bg-red-50 text-red-700 border border-red-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  failed: "bg-red-50 text-red-700 border border-red-200",
  flagged: "bg-red-50 text-red-700 border border-red-200",
  inactive: "bg-slate-100 text-slate-500 border border-slate-200",
  refunded: "bg-orange-50 text-orange-700 border border-orange-200",
  "no-show": "bg-slate-100 text-slate-500 border border-slate-200",
};

function Badge({ variant, children }: { variant: string; children?: ReactNode }) {
  const label = children ?? variant.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeStyles[variant] ?? badgeStyles.inactive}`}>
      {label}
    </span>
  );
}

function ConfirmModal({
  open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger",
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; variant?: "danger" | "warning" | "primary";
}) {
  if (!open) return null;
  const btnCls = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
  }[variant];
  const iconCls = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
    primary: "bg-blue-100 text-blue-600",
  }[variant];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconCls}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${btnCls}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ count, total }: { count: number; total: number }) {
  return (
    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
      <span className="text-xs text-slate-400">Showing {count} of {total} results</span>
      <div className="flex items-center gap-2">
        <button disabled className="px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-400 cursor-not-allowed">Previous</button>
        <span className="text-xs text-slate-600 px-2">Page 1 of 1</span>
        <button disabled className="px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-400 cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}

// ─── Dashboard View ──────────────────────────────────────────────────────────
function DashboardView() {
  const kpis = [
    { label: "Total Doctors", value: "284", change: "+12", up: true, icon: Users, bg: "bg-blue-50", ic: "text-blue-600" },
    { label: "Total Patients", value: "12,847", change: "+234", up: true, icon: User, bg: "bg-indigo-50", ic: "text-indigo-600" },
    { label: "Total Clinics", value: "47", change: "+2", up: true, icon: Building2, bg: "bg-violet-50", ic: "text-violet-600" },
    { label: "Today's Appointments", value: "183", change: "+18", up: true, icon: Calendar, bg: "bg-emerald-50", ic: "text-emerald-600" },
    { label: "Upcoming Appointments", value: "412", change: "-8", up: false, icon: Clock, bg: "bg-sky-50", ic: "text-sky-600" },
    { label: "Completed Total", value: "8,934", change: "+156", up: true, icon: CheckCircle, bg: "bg-teal-50", ic: "text-teal-600" },
    { label: "Pending Verifications", value: "23", change: "+4", up: false, icon: AlertCircle, bg: "bg-amber-50", ic: "text-amber-600" },
    { label: "Today's Revenue", value: "$24,680", change: "+$3,210", up: true, icon: DollarSign, bg: "bg-green-50", ic: "text-green-600" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-400 mt-0.5">Platform overview — August 10, 2024</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{k.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 leading-none">{k.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${k.bg}`}>
                  <Icon className={`w-4 h-4 ${k.ic}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2.5">
                {k.up
                  ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                  : <TrendingDown className="w-3 h-3 text-red-500" />}
                <span className={`text-xs font-medium ${k.up ? "text-emerald-600" : "text-red-600"}`}>{k.change}</span>
                <span className="text-xs text-slate-400">vs yesterday</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Appointment Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Completed</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Pending</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Cancelled</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={appointmentTrends}>
              <defs>
                <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)" }} />
              <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#gCompleted)" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="cancelled" stroke="#f87171" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Revenue Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-300 inline-block" />Refunds</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={revenueTrends} barSize={16} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} width={36} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="refunds" fill="#fca5a5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">New Registrations</h3>
              <p className="text-xs text-slate-400 mt-0.5">This month by week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={newUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="patients" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }} name="Patients" />
              <Line type="monotone" dataKey="doctors" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: "#0ea5e9", r: 3, strokeWidth: 0 }} name="Doctors" strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-indigo-500 inline-block rounded" />Patients</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-sky-500 inline-block rounded" />Doctors</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pending Verifications</h3>
          <div className="space-y-2">
            {verificationQueue.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {doc.name.split(" ")[1]?.[0]}{doc.name.split(" ")[2]?.[0] ?? ""}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.specialty} · {doc.submitted}</p>
                  </div>
                </div>
                <Badge variant={doc.status}>{doc.status === "documents_requested" ? "Docs Needed" : "Pending"}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Doctors View ────────────────────────────────────────────────────────────
function DoctorsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState("all");
  const [modal, setModal] = useState<{ open: boolean; type: string; name: string }>({ open: false, type: "", name: "" });

  const filtered = useMemo(() =>
    doctors.filter((d) => {
      const q = search.toLowerCase();
      return (
        (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.clinic.toLowerCase().includes(q)) &&
        (statusFilter === "all" || d.accountStatus === statusFilter) &&
        (verifyFilter === "all" || d.verificationStatus === verifyFilter)
      );
    }), [search, statusFilter, verifyFilter]);

  const actionCfg: Record<string, { title: string; message: string; label: string; variant: "danger" | "warning" | "primary" }> = {
    Suspend: { title: "Suspend Account", message: "Suspending this account will prevent the doctor from accepting new appointments and alert existing patients.", label: "Suspend", variant: "danger" },
    Reactivate: { title: "Reactivate Account", message: "This will restore the doctor's platform access and allow them to accept new appointments.", label: "Reactivate", variant: "primary" },
    Approve: { title: "Approve Doctor", message: "This doctor will be granted full verified status and can begin accepting appointments.", label: "Approve", variant: "primary" },
    Reject: { title: "Reject Application", message: "The doctor's verification application will be rejected and they will be notified by email.", label: "Reject", variant: "danger" },
  };

  const cfg = modal.type in actionCfg ? actionCfg[modal.type] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Doctors</h1>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {doctors.length} doctors</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Doctor
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors, specialty, clinic..." className="text-sm bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={verifyFilter} onChange={(e) => setVerifyFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer">
          <option value="all">All Verifications</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="documents_requested">Docs Requested</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Doctor", "Specialty", "Clinic", "Rating", "Verification", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                        {doc.name.split(" ")[1]?.[0]}{doc.name.split(" ")[2]?.[0] ?? ""}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{doc.name}</p>
                        <p className="text-[11px] text-slate-400">{doc.appointments.toLocaleString()} appts</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{doc.specialty}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{doc.clinic}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-slate-700">{doc.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={doc.verificationStatus}>{doc.verificationStatus === "documents_requested" ? "Docs Needed" : doc.verificationStatus.charAt(0).toUpperCase() + doc.verificationStatus.slice(1)}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={doc.accountStatus}>{doc.accountStatus.charAt(0).toUpperCase() + doc.accountStatus.slice(1)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{doc.joinedDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      {doc.verificationStatus === "pending" && (
                        <>
                          <button onClick={() => setModal({ open: true, type: "Approve", name: doc.name })} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Approve"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setModal({ open: true, type: "Reject", name: doc.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                      {doc.accountStatus === "active"
                        ? <button onClick={() => setModal({ open: true, type: "Suspend", name: doc.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Suspend"><Lock className="w-3.5 h-3.5" /></button>
                        : doc.accountStatus === "suspended"
                          ? <button onClick={() => setModal({ open: true, type: "Reactivate", name: doc.name })} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Reactivate"><Unlock className="w-3.5 h-3.5" /></button>
                          : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">No doctors match your filters</p>
            </div>
          )}
        </div>
        <Pagination count={filtered.length} total={doctors.length} />
      </div>

      {cfg && (
        <ConfirmModal
          open={modal.open}
          onClose={() => setModal({ open: false, type: "", name: "" })}
          onConfirm={() => toast.success(`${modal.type} completed for ${modal.name}`)}
          title={cfg.title}
          message={`${cfg.message}\n\nDoctor: ${modal.name}`}
          confirmLabel={cfg.label}
          variant={cfg.variant}
        />
      )}
    </div>
  );
}

// ─── Doctor Verification View ─────────────────────────────────────────────────
function VerificationView() {
  const [modal, setModal] = useState<{ open: boolean; type: string; name: string }>({ open: false, type: "", name: "" });
  const pending = verificationQueue.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Doctor Verification</h1>
          <p className="text-xs text-slate-400 mt-0.5">{verificationQueue.length} in queue</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-700">{pending} awaiting review</span>
        </div>
      </div>

      <div className="space-y-3">
        {verificationQueue.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">
                  {doc.name.split(" ")[1]?.[0]}{doc.name.split(" ")[2]?.[0] ?? ""}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{doc.specialty}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      License: <span className="font-mono text-slate-700 ml-0.5">{doc.license}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />{doc.documents} documents uploaded
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />Submitted {doc.submitted}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant={doc.status}>{doc.status === "documents_requested" ? "Documents Requested" : "Pending Review"}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Review Documents
              </button>
              <button onClick={() => setModal({ open: true, type: "Approve", name: doc.name })} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={() => setModal({ open: true, type: "Reject", name: doc.name })} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
              <button onClick={() => setModal({ open: true, type: "Request Documents", name: doc.name })} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors">
                <Send className="w-3.5 h-3.5" /> Request More Docs
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, type: "", name: "" })}
        onConfirm={() => toast.success(`${modal.type} action completed for ${modal.name}`)}
        title={`${modal.type} Doctor`}
        message={`Proceed with "${modal.type}" for ${modal.name}? The doctor will be notified by email.`}
        confirmLabel={modal.type}
        variant={modal.type === "Approve" ? "primary" : modal.type === "Reject" ? "danger" : "warning"}
      />
    </div>
  );
}

// ─── Patients View ───────────────────────────────────────────────────────────
function PatientsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<{ open: boolean; type: string; name: string }>({ open: false, type: "", name: "" });

  const filtered = useMemo(() =>
    patients.filter((p) => {
      const q = search.toLowerCase();
      return (
        (p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)) &&
        (statusFilter === "all" || p.status === statusFilter)
      );
    }), [search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {patients.length} patients</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients by name or email..." className="text-sm bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Patient", "Contact", "Appointments", "Status", "Joined", "Last Active", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                        {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600"><Mail className="w-3 h-3 text-slate-400" />{p.email}</p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500"><Phone className="w-3 h-3 text-slate-400" />{p.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-slate-700">{p.appointments}</td>
                  <td className="px-4 py-3"><Badge variant={p.status}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.joinedDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.lastActivity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Appointments"><Calendar className="w-3.5 h-3.5" /></button>
                      {p.status === "active"
                        ? <button onClick={() => setModal({ open: true, type: "Suspend", name: p.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Suspend"><Lock className="w-3.5 h-3.5" /></button>
                        : p.status === "suspended"
                          ? <button onClick={() => setModal({ open: true, type: "Reactivate", name: p.name })} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Reactivate"><Unlock className="w-3.5 h-3.5" /></button>
                          : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <User className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">No patients match your filters</p>
            </div>
          )}
        </div>
        <Pagination count={filtered.length} total={patients.length} />
      </div>

      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, type: "", name: "" })}
        onConfirm={() => toast.success(`Patient ${modal.name} has been ${modal.type === "Suspend" ? "suspended" : "reactivated"}`)}
        title={`${modal.type} Patient`}
        message={`Are you sure you want to ${modal.type.toLowerCase()} ${modal.name}? ${modal.type === "Suspend" ? "They will lose access to the platform." : "They will regain access to book appointments."}`}
        confirmLabel={modal.type}
        variant={modal.type === "Suspend" ? "danger" : "primary"}
      />
    </div>
  );
}

// ─── Clinics View ────────────────────────────────────────────────────────────
function ClinicsView() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() =>
    clinics.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())),
    [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clinics</h1>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} registered clinics</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Clinic
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clinics or location..." className="text-sm bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((clinic) => (
          <div key={clinic.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{clinic.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{clinic.location}</p>
                </div>
              </div>
              <Badge variant={clinic.status}>{clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 py-3 border-t border-slate-50">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">{clinic.doctors}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Doctors</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">{clinic.appointments.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Appointments</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-700 truncate">{clinic.manager}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><Eye className="w-3.5 h-3.5" />View</button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><Edit className="w-3.5 h-3.5" />Edit</button>
              {clinic.status === "active"
                ? <button onClick={() => toast.error(`${clinic.name} suspended`)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><Lock className="w-3.5 h-3.5" />Suspend</button>
                : <button onClick={() => toast.success(`${clinic.name} approved`)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"><Check className="w-3.5 h-3.5" />Approve</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Appointments View ───────────────────────────────────────────────────────
function AppointmentsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() =>
    appointments.filter((a) => {
      const q = search.toLowerCase();
      return (
        (a.patient.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)) &&
        (statusFilter === "all" || a.status === statusFilter) &&
        (typeFilter === "all" || a.type === typeFilter)
      );
    }), [search, statusFilter, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Appointments</h1>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {appointments.length} appointments</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient, doctor, or appointment ID..." className="text-sm bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer">
          <option value="all">All Types</option>
          <option value="In-Person">In-Person</option>
          <option value="Video">Video</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["ID", "Patient", "Doctor", "Date & Time", "Type", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{apt.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{apt.patient}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{apt.doctor}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-slate-700">{apt.date}</p>
                    <p className="text-xs text-slate-400">{apt.time}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded ${apt.type === "Video" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                      {apt.type}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge variant={apt.paymentStatus}>{apt.paymentStatus.charAt(0).toUpperCase() + apt.paymentStatus.slice(1)}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={apt.status}>{apt.status.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">No appointments match your filters</p>
            </div>
          )}
        </div>
        <Pagination count={filtered.length} total={appointments.length} />
      </div>
    </div>
  );
}

// ─── Finance View ─────────────────────────────────────────────────────────────
function FinanceView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() =>
    transactions.filter((t) => {
      const q = search.toLowerCase();
      return (
        (t.patient.toLowerCase().includes(q) || t.doctor.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
        (statusFilter === "all" || t.status === statusFilter)
      );
    }), [search, statusFilter]);

  const completed = transactions.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const refunded = transactions.filter((t) => t.status === "refunded").reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  const finKpis = [
    { label: "Total Revenue", value: `$${completed.toLocaleString()}`, icon: DollarSign, bg: "bg-emerald-50", ic: "text-emerald-600" },
    { label: "Commission (15%)", value: `$${Math.round(completed * 0.15).toLocaleString()}`, icon: TrendingUp, bg: "bg-blue-50", ic: "text-blue-600" },
    { label: "Total Refunds", value: `$${refunded.toLocaleString()}`, icon: RefreshCw, bg: "bg-red-50", ic: "text-red-600" },
    { label: "Pending Payouts", value: `$${pending.toLocaleString()}`, icon: Clock, bg: "bg-amber-50", ic: "text-amber-600" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Payments & Refunds</h1>
        <p className="text-xs text-slate-400 mt-0.5">Transaction overview and financial management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {finKpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{k.label}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.bg}`}>
                  <Icon className={`w-4 h-4 ${k.ic}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className="text-sm bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Transaction ID", "Patient", "Doctor", "Amount", "Provider", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{txn.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{txn.patient}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{txn.doctor}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">${txn.amount}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold">{txn.provider}</span>
                  </td>
                  <td className="px-4 py-3"><Badge variant={txn.status}>{txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{txn.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      {(txn.status === "completed" || txn.status === "pending") && (
                        <button onClick={() => toast.info(`Refund initiated for ${txn.id}`)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Process Refund">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination count={filtered.length} total={transactions.length} />
      </div>
    </div>
  );
}

// ─── Reviews & Complaints View ───────────────────────────────────────────────
function ReviewsView() {
  const [modal, setModal] = useState<{ open: boolean; label: string }>({ open: false, label: "" });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Reviews & Complaints</h1>
        <p className="text-xs text-slate-400 mt-0.5">{reviews.filter((r) => r.flagged).length} flagged items require attention</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <Flag className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold text-red-700">{reviews.filter((r) => r.flagged).length} Flagged</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">{reviews.filter((r) => r.status === "under-review").length} Under Review</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-700">{reviews.filter((r) => r.status === "published").length} Published</span>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl border p-4 ${review.flagged ? "border-red-200 shadow-red-50/50 shadow-sm" : "border-slate-200"}`}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {review.patient.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 text-sm">{review.patient}</span>
                    <span className="text-slate-300 text-sm">→</span>
                    <span className="text-sm text-slate-600">{review.doctor}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{review.content}</p>
                  <p className="text-xs text-slate-400 mt-1">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={review.status}>{review.status.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}</Badge>
                {review.flagged && <Flag className="w-4 h-4 text-red-400" />}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-50">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><Eye className="w-3.5 h-3.5" />Investigate</button>
              <button onClick={() => toast.success("Review resolved")} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"><Check className="w-3.5 h-3.5" />Resolve</button>
              <button onClick={() => toast.info("Review hidden from public")} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><XCircle className="w-3.5 h-3.5" />Hide</button>
              <button onClick={() => setModal({ open: true, label: `Review #${review.id}` })} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"><AlertTriangle className="w-3.5 h-3.5" />Escalate</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={modal.open}
        onClose={() => setModal({ open: false, label: "" })}
        onConfirm={() => toast.warning(`${modal.label} escalated to Super Admin`)}
        title="Escalate to Super Admin"
        message={`Escalating ${modal.label} will flag it as urgent and notify the Super Admin for immediate review. Continue?`}
        confirmLabel="Escalate"
        variant="warning"
      />
    </div>
  );
}

// ─── Notifications View ──────────────────────────────────────────────────────
function NotificationsView() {
  const [recipient, setRecipient] = useState("all-patients");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState("now");

  const sent = [
    { id: 1, title: "Platform Maintenance Notice", recipient: "All Users", sent: "Aug 9, 2024 08:00 AM", delivered: 13124 },
    { id: 2, title: "New Feature: Video Consultations", recipient: "All Patients", sent: "Aug 7, 2024 10:00 AM", delivered: 12847 },
    { id: 3, title: "License Renewal Reminder", recipient: "All Doctors", sent: "Aug 6, 2024 09:00 AM", delivered: 267 },
    { id: 4, title: "Appointment Reminder — Tomorrow", recipient: "Selected Patients", sent: "Aug 5, 2024 06:00 PM", delivered: 183 },
  ];

  const handleSend = () => {
    if (!title || !message) { toast.error("Please fill in both title and message"); return; }
    toast.success(`Notification "${title}" queued for ${recipient}`);
    setTitle(""); setMessage("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
        <p className="text-xs text-slate-400 mt-0.5">Send platform notifications and track delivery status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Compose Notification</h2>
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Recipients</label>
              <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                <option value="all-patients">All Patients (12,847)</option>
                <option value="all-doctors">All Doctors (284)</option>
                <option value="all-clinics">All Clinic Managers (47)</option>
                <option value="all-users">All Platform Users</option>
                <option value="selected">Selected Users</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. System Maintenance on Aug 15" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your notification message..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Schedule</label>
              <select value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                <option value="now">Send Immediately</option>
                <option value="scheduled">Schedule for Later</option>
              </select>
            </div>
            <button onClick={handleSend} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all">
              <Send className="w-4 h-4" /> Send Notification
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Sent History</h2>
          <div className="space-y-2.5">
            {sent.map((n) => (
              <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.recipient} · {n.sent}</p>
                  </div>
                  <Badge variant="delivered">Delivered</Badge>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-slate-500">{n.delivered.toLocaleString()} recipients reached</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Activity View ──────────────────────────────────────────────────────
function ActivityView() {
  const activities = [
    { id: 1, actor: "Admin Sarah K.", initials: "SK", action: "Approved verification", resource: "Dr. Emily Rodriguez", type: "verification", timestamp: "Aug 10, 2024 09:14", result: "success" },
    { id: 2, actor: "Admin Marcus L.", initials: "ML", action: "Suspended account", resource: "Dr. Michael Thompson", type: "account", timestamp: "Aug 10, 2024 08:52", result: "success" },
    { id: 3, actor: "Admin Sarah K.", initials: "SK", action: "Processed refund", resource: "TXN-84917 ($120)", type: "finance", timestamp: "Aug 9, 2024 16:33", result: "success" },
    { id: 4, actor: "Admin Tom B.", initials: "TB", action: "Suspended clinic", resource: "BoneJoint Specialists", type: "clinic", timestamp: "Aug 9, 2024 14:21", result: "success" },
    { id: 5, actor: "Admin Marcus L.", initials: "ML", action: "Hidden review", resource: "Review #2 — Dr. Thompson", type: "moderation", timestamp: "Aug 9, 2024 11:07", result: "success" },
    { id: 6, actor: "Admin Sarah K.", initials: "SK", action: "Rejected application", resource: "Dr. Robert Walsh", type: "verification", timestamp: "Aug 8, 2024 15:44", result: "success" },
    { id: 7, actor: "Admin Tom B.", initials: "TB", action: "Failed login attempt", resource: "Admin Dashboard", type: "security", timestamp: "Aug 8, 2024 09:12", result: "failed" },
    { id: 8, actor: "Admin Sarah K.", initials: "SK", action: "Suspended patient", resource: "Catherine Liu", type: "account", timestamp: "Aug 7, 2024 13:28", result: "success" },
  ];

  const typeBadge: Record<string, string> = {
    verification: "bg-blue-100 text-blue-700",
    account: "bg-amber-100 text-amber-700",
    finance: "bg-emerald-100 text-emerald-700",
    clinic: "bg-violet-100 text-violet-700",
    moderation: "bg-rose-100 text-rose-700",
    security: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin Activity</h1>
          <p className="text-xs text-slate-400 mt-0.5">Recent administrative actions across the platform</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {activities.map((act) => (
            <div key={act.id} className={`flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50/50 transition-colors ${act.result === "failed" ? "bg-red-50/30" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                {act.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">{act.actor}</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="text-slate-600">{act.action}</span>
                  <span className="text-slate-400 mx-1.5">·</span>
                  <span className="font-medium text-slate-700">{act.resource}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{act.timestamp}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${typeBadge[act.type] ?? "bg-slate-100 text-slate-600"}`}>{act.type}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${act.result === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {act.result === "success" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {act.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Audit Logs View ──────────────────────────────────────────────────────────
function AuditView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-0.5">Complete system audit trail — actor, action, resource, result</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Actor", "Action", "Resource", "Timestamp", "IP Address", "Result"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.map((log) => (
                <tr key={log.id} className={`hover:bg-slate-50/60 transition-colors ${log.result === "failed" ? "bg-red-50/40" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 flex-shrink-0">
                        {log.actor.split(" ")[1]?.[0]}{log.actor.split(" ")[2]?.[0] ?? ""}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">{log.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">{log.resource}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${log.result === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {log.result === "success" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {log.result.charAt(0).toUpperCase() + log.result.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination count={auditLogs.length} total={auditLogs.length} />
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems: { id: ViewId; label: string; icon: ElementType; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "doctors", label: "Doctors", icon: Users },
  { id: "verification", label: "Doctor Verification", icon: UserCheck, badge: 4 },
  { id: "patients", label: "Patients", icon: User },
  { id: "clinics", label: "Clinics", icon: Building2 },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "finance", label: "Payments & Refunds", icon: CreditCard },
  { id: "reviews", label: "Reviews & Complaints", icon: Star, badge: 3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "activity", label: "Admin Activity", icon: Activity },
  { id: "audit", label: "Audit Logs", icon: Shield },
];

function Sidebar({ active, onNav, collapsed, onToggle }: {
  active: ViewId; onNav: (v: ViewId) => void; collapsed: boolean; onToggle: () => void;
}) {
  return (
    <aside style={{ width: collapsed ? 64 : 240 }} className="bg-[#0F172A] flex flex-col h-full flex-shrink-0 transition-all duration-200 overflow-hidden">
      <div className="flex items-center h-14 px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-2.5 flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-none">MediAdmin</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Healthcare Platform</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} className="ml-auto p-1 text-slate-600 hover:text-slate-300 rounded transition-colors flex-shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-lg text-sm transition-all duration-150 ${collapsed ? "justify-center p-2.5" : "px-3 py-2.5"} ${isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                {!collapsed && item.badge && !isActive && (
                  <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">SK</div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">SK</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Sarah Kim</p>
              <p className="text-[11px] text-slate-500 truncate">Platform Admin</p>
            </div>
            <LogOut className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ collapsed, onToggleSidebar }: { collapsed: boolean; onToggleSidebar: () => void }) {
  const [showAlerts, setShowAlerts] = useState(false);

  const alerts = [
    { id: 1, type: "warning" as const, text: "4 doctors pending verification review", time: "2h ago" },
    { id: 2, type: "error" as const, text: "Flagged review requires immediate action", time: "4h ago" },
    { id: 3, type: "info" as const, text: "System maintenance scheduled Aug 15", time: "1d ago" },
  ];

  const alertIcon = { warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />, error: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />, info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" /> };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 flex-shrink-0">
      {collapsed && (
        <button onClick={onToggleSidebar} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
          <Menu className="w-5 h-5" />
        </button>
      )}

      <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-72">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input placeholder="Quick search patients, doctors, IDs..." className="text-sm bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="relative">
          <button onClick={() => setShowAlerts(!showAlerts)} className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          {showAlerts && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAlerts(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Alerts</h3>
                  <span className="text-xs text-slate-400">{alerts.length} new</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {alerts.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                      {alertIcon[a.type]}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{a.text}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                  <button onClick={() => setShowAlerts(false)} className="w-full text-xs text-center text-blue-600 hover:text-blue-700 py-1 font-medium">View all alerts</button>
                </div>
              </div>
            </>
          )}
        </div>

        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Quick Add
        </button>

        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ml-1">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">SK</div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-slate-800 leading-none">Sarah Kim</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const viewMap: Record<ViewId, ReactNode> = {
    dashboard: <DashboardView />,
    doctors: <DoctorsView />,
    verification: <VerificationView />,
    patients: <PatientsView />,
    clinics: <ClinicsView />,
    appointments: <AppointmentsView />,
    finance: <FinanceView />,
    reviews: <ReviewsView />,
    notifications: <NotificationsView />,
    activity: <ActivityView />,
    audit: <AuditView />,
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Toaster position="top-right" richColors closeButton />
      <Sidebar active={view} onNav={setView} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header collapsed={collapsed} onToggleSidebar={() => setCollapsed(false)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {viewMap[view]}
        </main>
      </div>
    </div>
  );
}
