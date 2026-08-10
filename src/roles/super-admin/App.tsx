import { useState, useMemo } from "react";
import {
  LayoutDashboard, BarChart2, ShieldCheck, Stethoscope, UserCheck,
  Building2, Lock, CalendarDays, CreditCard, Star, Bell,
  ClipboardList, Shield, Settings, LogOut, Search, ChevronDown,
  AlertTriangle, CheckCircle2, XCircle, Clock, Eye, Edit2, Ban,
  RefreshCw, FileText, TrendingUp, TrendingDown, DollarSign,
  Activity, Database, Zap, Mail, MessageSquare, HardDrive,
  Download, Plus, MoreHorizontal, UserX, Globe, ArrowUpRight,
  ArrowDownRight, X, Menu, Cpu, ArrowUpDown, ChevronUp,
  CheckSquare, MapPin, Phone, Filter, Users
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
type PageId =
  | "dashboard" | "analytics"
  | "administrators" | "doctors" | "patients" | "clinics"
  | "roles" | "verification" | "appointments" | "payments"
  | "reviews" | "notifications" | "audit" | "security" | "system" | "settings";

type SystemStatus = "healthy" | "warning" | "down";
type Severity = "low" | "medium" | "high" | "critical";
type SortDir = "asc" | "desc" | null;

// ─── Mock data ────────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 48200, commission: 7230, payouts: 38000, refunds: 1200 },
  { month: "Feb", revenue: 52400, commission: 7860, payouts: 41200, refunds: 980 },
  { month: "Mar", revenue: 61800, commission: 9270, payouts: 48800, refunds: 1540 },
  { month: "Apr", revenue: 58900, commission: 8835, payouts: 46400, refunds: 1120 },
  { month: "May", revenue: 67300, commission: 10095, payouts: 53000, refunds: 1890 },
  { month: "Jun", revenue: 73100, commission: 10965, payouts: 57600, refunds: 2100 },
  { month: "Jul", revenue: 69800, commission: 10470, payouts: 55000, refunds: 1760 },
  { month: "Aug", revenue: 81400, commission: 12210, payouts: 64200, refunds: 2340 },
];

const weeklyAppts = [
  { day: "Mon", completed: 142, cancelled: 18, noShow: 9, pending: 34 },
  { day: "Tue", completed: 168, cancelled: 12, noShow: 5, pending: 41 },
  { day: "Wed", completed: 155, cancelled: 22, noShow: 11, pending: 28 },
  { day: "Thu", completed: 189, cancelled: 15, noShow: 7, pending: 52 },
  { day: "Fri", completed: 174, cancelled: 28, noShow: 13, pending: 37 },
  { day: "Sat", completed: 98, cancelled: 8, noShow: 4, pending: 19 },
  { day: "Sun", completed: 54, cancelled: 5, noShow: 2, pending: 11 },
];

const userGrowthData = [
  { month: "Mar", doctors: 320, patients: 2140, clinics: 148 },
  { month: "Apr", doctors: 368, patients: 2580, clinics: 156 },
  { month: "May", doctors: 412, patients: 3120, clinics: 163 },
  { month: "Jun", doctors: 445, patients: 3690, clinics: 170 },
  { month: "Jul", doctors: 498, patients: 4340, clinics: 177 },
  { month: "Aug", doctors: 541, patients: 5180, clinics: 183 },
];

const apptStatusPie = [
  { name: "Completed", value: 780, color: "#0d9488" },
  { name: "Pending", value: 222, color: "#f59e0b" },
  { name: "Cancelled", value: 108, color: "#ef4444" },
  { name: "No Show", value: 51, color: "#94a3b8" },
];

const topDoctors = [
  { name: "Dr. Aisha Patel", specialty: "Cardiology", appts: 184, rating: 4.9 },
  { name: "Dr. Marcus Chen", specialty: "Neurology", appts: 162, rating: 4.8 },
  { name: "Dr. Sofia Rodriguez", specialty: "Pediatrics", appts: 149, rating: 4.9 },
  { name: "Dr. James Okonkwo", specialty: "Orthopedics", appts: 131, rating: 4.7 },
  { name: "Dr. Priya Nair", specialty: "Dermatology", appts: 118, rating: 4.8 },
];

const revenueByClinic = [
  { name: "City Heart", revenue: 24800 },
  { name: "NeuroHealth", revenue: 19200 },
  { name: "KidsCare", revenue: 16400 },
  { name: "BoneWell", revenue: 14100 },
  { name: "DermaCare", revenue: 11900 },
  { name: "EyeVision", revenue: 9800 },
];

const pendingDoctors = [
  { id: "D-001", name: "Dr. Aisha Patel", specialty: "Cardiology", license: "MED-2024-7821", submitted: "2024-08-07", status: "pending", docs: 3, clinic: "City Heart Clinic" },
  { id: "D-002", name: "Dr. Marcus Chen", specialty: "Neurology", license: "MED-2024-6540", submitted: "2024-08-06", status: "pending", docs: 4, clinic: "NeuroHealth Center" },
  { id: "D-003", name: "Dr. Sofia Rodriguez", specialty: "Pediatrics", license: "MED-2024-8902", submitted: "2024-08-05", status: "docs_requested", docs: 2, clinic: "KidsCare Hub" },
  { id: "D-004", name: "Dr. James Okonkwo", specialty: "Orthopedics", license: "MED-2024-5134", submitted: "2024-08-04", status: "pending", docs: 5, clinic: "BoneWell Clinic" },
  { id: "D-005", name: "Dr. Priya Nair", specialty: "Dermatology", license: "MED-2024-9213", submitted: "2024-08-03", status: "under_review", docs: 3, clinic: "DermaCare Studio" },
  { id: "D-006", name: "Dr. Lena Kovacs", specialty: "Ophthalmology", license: "MED-2024-4401", submitted: "2024-08-02", status: "pending", docs: 4, clinic: "EyeVision Plus" },
];

const appointments = [
  { id: "APT-8821", patient: "Elena Morrison", doctor: "Dr. Aisha Patel", clinic: "City Heart", date: "2024-08-10", time: "09:30", payment: "paid", status: "confirmed", amount: 180 },
  { id: "APT-8820", patient: "Robert Kim", doctor: "Dr. Marcus Chen", clinic: "NeuroHealth", date: "2024-08-10", time: "10:00", payment: "paid", status: "completed", amount: 250 },
  { id: "APT-8819", patient: "Fatima Al-Hassan", doctor: "Dr. James Okonkwo", clinic: "BoneWell", date: "2024-08-10", time: "11:15", payment: "pending", status: "confirmed", amount: 195 },
  { id: "APT-8818", patient: "David Park", doctor: "Dr. Priya Nair", clinic: "DermaCare", date: "2024-08-09", time: "14:00", payment: "refunded", status: "cancelled", amount: 120 },
  { id: "APT-8817", patient: "Sarah Thompson", doctor: "Dr. Sofia Rodriguez", clinic: "KidsCare", date: "2024-08-09", time: "15:30", payment: "paid", status: "completed", amount: 95 },
  { id: "APT-8816", patient: "Ahmed Khalil", doctor: "Dr. Aisha Patel", clinic: "City Heart", date: "2024-08-09", time: "16:00", payment: "paid", status: "completed", amount: 180 },
  { id: "APT-8815", patient: "Linda Chen", doctor: "Dr. Marcus Chen", clinic: "NeuroHealth", date: "2024-08-08", time: "09:00", payment: "pending", status: "no_show", amount: 250 },
  { id: "APT-8814", patient: "Carlos Mendez", doctor: "Dr. Priya Nair", clinic: "DermaCare", date: "2024-08-08", time: "10:30", payment: "paid", status: "completed", amount: 120 },
  { id: "APT-8813", patient: "Yuki Tanaka", doctor: "Dr. Sofia Rodriguez", clinic: "KidsCare", date: "2024-08-07", time: "08:45", payment: "paid", status: "completed", amount: 95 },
  { id: "APT-8812", patient: "Grace Obi", doctor: "Dr. Lena Kovacs", clinic: "EyeVision", date: "2024-08-07", time: "13:00", payment: "paid", status: "confirmed", amount: 160 },
];

const transactions = [
  { id: "TXN-45501", patient: "Elena Morrison", doctor: "Dr. Aisha Patel", amount: 180, commission: 27, provider: "Stripe", status: "completed", date: "2024-08-10" },
  { id: "TXN-45500", patient: "Robert Kim", doctor: "Dr. Marcus Chen", amount: 250, commission: 37.5, provider: "Stripe", status: "completed", date: "2024-08-10" },
  { id: "TXN-45499", patient: "David Park", doctor: "Dr. Priya Nair", amount: 120, commission: 18, provider: "PayPal", status: "refunded", date: "2024-08-09" },
  { id: "TXN-45498", patient: "Sarah Thompson", doctor: "Dr. Sofia Rodriguez", amount: 95, commission: 14.25, provider: "Stripe", status: "completed", date: "2024-08-09" },
  { id: "TXN-45497", patient: "Ahmed Khalil", doctor: "Dr. Aisha Patel", amount: 180, commission: 27, provider: "Stripe", status: "completed", date: "2024-08-09" },
  { id: "TXN-45496", patient: "Linda Chen", doctor: "Dr. Marcus Chen", amount: 250, commission: 0, provider: "Stripe", status: "failed", date: "2024-08-08" },
  { id: "TXN-45495", patient: "Carlos Mendez", doctor: "Dr. Priya Nair", amount: 120, commission: 18, provider: "PayPal", status: "completed", date: "2024-08-08" },
];

const allUsers = [
  { id: "U-001", name: "Patricia Walsh", email: "p.walsh@platform.com", role: "Administrator", status: "active", joined: "2023-04-12", lastActive: "2024-08-10", roleType: "administrators" },
  { id: "U-002", name: "Benjamin Osei", email: "b.osei@platform.com", role: "Administrator", status: "active", joined: "2023-09-01", lastActive: "2024-08-09", roleType: "administrators" },
  { id: "U-003", name: "Dr. Aisha Patel", email: "a.patel@cityheartclinic.com", role: "Doctor", status: "active", joined: "2024-01-15", lastActive: "2024-08-10", roleType: "doctors" },
  { id: "U-004", name: "Dr. Marcus Chen", email: "m.chen@neurohealth.com", role: "Doctor", status: "active", joined: "2024-01-30", lastActive: "2024-08-10", roleType: "doctors" },
  { id: "U-005", name: "Dr. Sofia Rodriguez", email: "s.rodriguez@kidscare.com", role: "Doctor", status: "active", joined: "2024-02-08", lastActive: "2024-08-09", roleType: "doctors" },
  { id: "U-006", name: "Elena Morrison", email: "elena.m@gmail.com", role: "Patient", status: "active", joined: "2024-03-22", lastActive: "2024-08-10", roleType: "patients" },
  { id: "U-007", name: "Robert Kim", email: "robert.k@outlook.com", role: "Patient", status: "active", joined: "2024-04-05", lastActive: "2024-08-10", roleType: "patients" },
  { id: "U-008", name: "Natalie Cruz", email: "n.cruz@support.platform.com", role: "Support Staff", status: "suspended", joined: "2024-02-14", lastActive: "2024-07-28", roleType: "administrators" },
  { id: "U-009", name: "Richard Hammons", email: "r.hammons@cityheartclinic.com", role: "Clinic Manager", status: "active", joined: "2023-11-08", lastActive: "2024-08-09", roleType: "clinics" },
  { id: "U-010", name: "Brenda Walsh", email: "b.walsh@neurohealth.com", role: "Receptionist", status: "active", joined: "2024-04-11", lastActive: "2024-08-08", roleType: "clinics" },
];

const clinicsData = [
  { id: "CLN-01", name: "City Heart Clinic", manager: "Richard Hammons", city: "New York", doctors: 12, patients: 1840, status: "active", rating: 4.8 },
  { id: "CLN-02", name: "NeuroHealth Center", manager: "Sarah Kim", city: "Boston", doctors: 8, patients: 1120, status: "active", rating: 4.7 },
  { id: "CLN-03", name: "KidsCare Hub", manager: "James Park", city: "Chicago", doctors: 9, patients: 1340, status: "active", rating: 4.9 },
  { id: "CLN-04", name: "BoneWell Clinic", manager: "Maria Santos", city: "Houston", doctors: 6, patients: 880, status: "active", rating: 4.6 },
  { id: "CLN-05", name: "DermaCare Studio", manager: "Ali Hassan", city: "Miami", doctors: 5, patients: 760, status: "active", rating: 4.8 },
  { id: "CLN-06", name: "EyeVision Plus", manager: "Chen Wei", city: "Seattle", doctors: 4, patients: 520, status: "suspended", rating: 3.9 },
];

const auditLogs = [
  { actor: "admin@platform.com", action: "ROLE_ASSIGNED", resource: "User: Dr. Aisha Patel", timestamp: "2024-08-10 09:14:22", ip: "192.168.1.42", severity: "medium" as Severity },
  { actor: "superadmin@platform.com", action: "DOCTOR_APPROVED", resource: "Doctor: D-001", timestamp: "2024-08-10 09:02:11", ip: "10.0.0.5", severity: "low" as Severity },
  { actor: "r.hammons@cityheartclinic.com", action: "APPOINTMENT_CANCELLED", resource: "APT-8818", timestamp: "2024-08-09 17:45:03", ip: "203.0.113.8", severity: "low" as Severity },
  { actor: "superadmin@platform.com", action: "USER_SUSPENDED", resource: "User: Natalie Cruz", timestamp: "2024-08-09 15:22:40", ip: "10.0.0.5", severity: "high" as Severity },
  { actor: "unknown", action: "FAILED_LOGIN_BURST", resource: "Auth Service", timestamp: "2024-08-09 03:18:55", ip: "185.220.101.55", severity: "critical" as Severity },
  { actor: "n.cruz@support.platform.com", action: "SENSITIVE_DATA_ACCESS", resource: "Patient Records (bulk)", timestamp: "2024-08-08 22:09:13", ip: "198.51.100.22", severity: "high" as Severity },
  { actor: "admin@platform.com", action: "PERMISSION_CHANGED", resource: "Role: Receptionist", timestamp: "2024-08-08 14:30:07", ip: "192.168.1.42", severity: "medium" as Severity },
  { actor: "superadmin@platform.com", action: "CLINIC_SUSPENDED", resource: "Clinic: EyeVision Plus", timestamp: "2024-08-07 11:55:29", ip: "10.0.0.5", severity: "high" as Severity },
];

const securityEvents = [
  { id: 1, type: "Failed Login Burst", source: "185.220.101.55", target: "Auth Service", time: "Today 03:18", count: 47, severity: "critical" as Severity, resolved: false },
  { id: 2, type: "Bulk Data Access", source: "n.cruz@support.platform.com", target: "Patient Records", time: "Yesterday 22:09", count: 1, severity: "high" as Severity, resolved: false },
  { id: 3, type: "Permission Escalation Attempt", source: "r.hammons@cityheartclinic.com", target: "Admin Panel", time: "Yesterday 16:33", count: 3, severity: "high" as Severity, resolved: true },
  { id: 4, type: "Off-hours Admin Login", source: "admin2@platform.com", target: "Dashboard", time: "Yesterday 02:41", count: 1, severity: "medium" as Severity, resolved: true },
];

const failedLoginChart = [
  { hour: "00:00", count: 2 }, { hour: "03:00", count: 47 }, { hour: "06:00", count: 3 },
  { hour: "09:00", count: 1 }, { hour: "12:00", count: 4 }, { hour: "15:00", count: 2 },
  { hour: "18:00", count: 6 }, { hour: "21:00", count: 3 },
];

const systemServices: { name: string; status: SystemStatus; latency: string; uptime: string; icon: React.ElementType }[] = [
  { name: "API Gateway", status: "healthy", latency: "42ms", uptime: "99.98", icon: Globe },
  { name: "PostgreSQL Primary", status: "healthy", latency: "8ms", uptime: "99.99", icon: Database },
  { name: "Redis Cache", status: "warning", latency: "145ms", uptime: "99.71", icon: Zap },
  { name: "Job Queue (Bull)", status: "healthy", latency: "—", uptime: "99.95", icon: Activity },
  { name: "Payment Gateway", status: "healthy", latency: "312ms", uptime: "99.87", icon: CreditCard },
  { name: "Email (SendGrid)", status: "healthy", latency: "—", uptime: "99.93", icon: Mail },
  { name: "SMS (Twilio)", status: "down", latency: "—", uptime: "97.40", icon: MessageSquare },
  { name: "Object Storage (S3)", status: "healthy", latency: "61ms", uptime: "99.99", icon: HardDrive },
];

const permissionGroups = [
  { id: "users", label: "Users", perms: ["view", "create", "edit", "suspend", "delete"] },
  { id: "doctors", label: "Doctors", perms: ["view", "verify", "suspend", "delete"] },
  { id: "patients", label: "Patients", perms: ["view", "edit", "suspend"] },
  { id: "clinics", label: "Clinics", perms: ["view", "create", "edit", "delete"] },
  { id: "appointments", label: "Appointments", perms: ["view", "manage", "cancel"] },
  { id: "payments", label: "Payments", perms: ["view", "refund", "export"] },
  { id: "reports", label: "Reports", perms: ["view", "export"] },
  { id: "security", label: "Security", perms: ["view", "manage"] },
  { id: "settings", label: "Settings", perms: ["view", "edit"] },
];

const rolesData = [
  { name: "Super Admin", users: 2, color: "bg-purple-100 text-purple-700 border-purple-200", desc: "Full unrestricted platform access" },
  { name: "Administrator", users: 8, color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Manage users, content, reports" },
  { name: "Doctor", users: 541, color: "bg-teal-100 text-teal-700 border-teal-200", desc: "Appointments and patient notes" },
  { name: "Clinic Manager", users: 34, color: "bg-cyan-100 text-cyan-700 border-cyan-200", desc: "Clinic staff and schedules" },
  { name: "Receptionist", users: 89, color: "bg-amber-100 text-amber-700 border-amber-200", desc: "View and book appointments" },
  { name: "Support Staff", users: 23, color: "bg-rose-100 text-rose-700 border-rose-200", desc: "Patient support queries" },
];

const defaultPerms: Record<string, Record<string, boolean>> = {
  "Super Admin": { "users.view": true, "users.create": true, "users.edit": true, "users.suspend": true, "users.delete": true, "doctors.view": true, "doctors.verify": true, "doctors.suspend": true, "doctors.delete": true, "patients.view": true, "patients.edit": true, "patients.suspend": true, "clinics.view": true, "clinics.create": true, "clinics.edit": true, "clinics.delete": true, "appointments.view": true, "appointments.manage": true, "appointments.cancel": true, "payments.view": true, "payments.refund": true, "payments.export": true, "reports.view": true, "reports.export": true, "security.view": true, "security.manage": true, "settings.view": true, "settings.edit": true },
  "Administrator": { "users.view": true, "users.create": true, "users.edit": true, "users.suspend": true, "users.delete": false, "doctors.view": true, "doctors.verify": true, "doctors.suspend": true, "doctors.delete": false, "patients.view": true, "patients.edit": true, "patients.suspend": false, "clinics.view": true, "clinics.create": true, "clinics.edit": true, "clinics.delete": false, "appointments.view": true, "appointments.manage": true, "appointments.cancel": true, "payments.view": true, "payments.refund": true, "payments.export": true, "reports.view": true, "reports.export": true, "security.view": true, "security.manage": false, "settings.view": true, "settings.edit": false },
  "Doctor": { "users.view": false, "patients.view": true, "appointments.view": true, "appointments.manage": true, "appointments.cancel": true, "payments.view": true, "reports.view": false, "security.view": false, "settings.view": false },
  "Clinic Manager": { "users.view": true, "users.create": false, "doctors.view": true, "patients.view": true, "clinics.view": true, "clinics.edit": true, "appointments.view": true, "appointments.manage": true, "payments.view": true, "reports.view": true },
  "Receptionist": { "patients.view": true, "appointments.view": true, "appointments.manage": true },
  "Support Staff": { "patients.view": true, "appointments.view": true },
};

// ─── Shared primitives ────────────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  active: "bg-teal-50 text-teal-700 ring-teal-200",
  suspended: "bg-red-50 text-red-700 ring-red-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  under_review: "bg-blue-50 text-blue-700 ring-blue-200",
  docs_requested: "bg-violet-50 text-violet-700 ring-violet-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-teal-50 text-teal-700 ring-teal-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  no_show: "bg-slate-100 text-slate-500 ring-slate-200",
  paid: "bg-teal-50 text-teal-700 ring-teal-200",
  refunded: "bg-violet-50 text-violet-700 ring-violet-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  healthy: "bg-teal-50 text-teal-700 ring-teal-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  down: "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels: Record<string, string> = {
  docs_requested: "Docs Requested",
  under_review: "Under Review",
  no_show: "No Show",
};

function Badge({ status, mono = false }: { status: string; mono?: boolean }) {
  const styles = statusStyles[status] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  const label = statusLabels[status] ?? status.replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ring-1 ring-inset ${mono ? "font-mono tracking-wide uppercase" : ""} ${styles}`}>
      {label}
    </span>
  );
}

function SeverityChip({ s }: { s: Severity }) {
  const map: Record<Severity, string> = {
    low: "bg-slate-100 text-slate-500 ring-slate-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    high: "bg-orange-50 text-orange-700 ring-orange-200",
    critical: "bg-red-50 text-red-700 ring-red-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium ring-1 ring-inset uppercase tracking-wide ${map[s]}`}>{s}</span>;
}

function KpiCard({ label, value, sub, change, up, icon: Icon, accent }: {
  label: string; value: string; sub?: string; change: string; up: boolean;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-md transition-shadow duration-200">
      <div className={`h-0.5 w-full ${accent}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">{label}</span>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent} bg-opacity-10`}>
            <Icon size={14} className={accent.replace("bg-", "text-").split(" ")[0]} />
          </div>
        </div>
        <div className="text-[22px] font-bold text-foreground leading-none">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        <div className={`mt-2.5 flex items-center gap-1 text-[11px] font-medium ${up ? "text-teal-600" : "text-red-500"}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{change}</span>
          <span className="text-muted-foreground font-normal">vs last month</span>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card rounded-xl border border-border ${className}`}>{children}</div>;
}

function CardHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
      <div>
        <div className="text-[13px] font-semibold text-foreground">{title}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

function Th({ ch, sortKey, sortBy, sortDir, onSort }: {
  ch: React.ReactNode; sortKey?: string; sortBy?: string | null; sortDir?: SortDir; onSort?: (k: string) => void;
}) {
  const active = sortKey && sortBy === sortKey;
  return (
    <th
      onClick={() => sortKey && onSort?.(sortKey)}
      className={`px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-slate-50/60 ${sortKey ? "cursor-pointer select-none hover:text-foreground" : ""} ${active ? "text-foreground" : ""}`}
    >
      <span className="inline-flex items-center gap-1">
        {ch}
        {sortKey && (
          active && sortDir
            ? sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
            : <ArrowUpDown size={10} className="opacity-30" />
        )}
      </span>
    </th>
  );
}

function Td({ children, mono = false, muted = false, className = "" }: {
  children: React.ReactNode; mono?: boolean; muted?: boolean; className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm border-b border-border/60 ${mono ? "font-mono text-xs" : ""} ${muted ? "text-muted-foreground" : "text-foreground"} ${className}`}>
      {children}
    </td>
  );
}

function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick} className="hover:bg-slate-50/60 transition-colors duration-100">
      {children}
    </tr>
  );
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["from-teal-400 to-teal-600", "from-blue-400 to-blue-600", "from-violet-400 to-violet-600", "from-rose-400 to-rose-600", "from-amber-400 to-amber-600"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-[13px]";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-semibold shrink-0`}>
      {initials}
    </div>
  );
}

function Btn({ children, onClick, variant = "ghost", size = "sm", className = "" }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md"; className?: string;
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-teal-700",
    secondary: "bg-slate-100 text-foreground hover:bg-slate-200",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-slate-100",
    danger: "text-red-600 hover:bg-red-50",
    outline: "border border-border text-foreground hover:bg-slate-50",
  };
  const sizes = { xs: "px-2 py-1 text-xs", sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

function IconBtn({ icon: Icon, onClick, variant = "ghost" }: {
  icon: React.ElementType; onClick?: () => void; variant?: "ghost" | "danger" | "success";
}) {
  const v = { ghost: "text-muted-foreground hover:text-foreground hover:bg-slate-100", danger: "text-red-500 hover:bg-red-50", success: "text-teal-600 hover:bg-teal-50" };
  return (
    <button onClick={onClick} className={`p-1.5 rounded-md transition-colors duration-150 ${v[variant]}`}>
      <Icon size={14} />
    </button>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────
type ConfirmState = { open: boolean; title: string; body: string; onConfirm: () => void; danger?: boolean };

function ConfirmModal({ state, onCancel }: { state: ConfirmState; onCancel: () => void }) {
  if (!state.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,0.45)" }}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-5">
          <div className="flex gap-3 items-start">
            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${state.danger ? "bg-red-100" : "bg-teal-100"}`}>
              {state.danger ? <AlertTriangle size={16} className="text-red-600" /> : <CheckCircle2 size={16} className="text-teal-600" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-[15px]">{state.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{state.body}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
          <Btn variant={state.danger ? "danger" : "primary"} onClick={() => { state.onConfirm(); onCancel(); }}>
            {state.danger ? "Confirm" : "Proceed"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastItem = { id: number; msg: string; type: "success" | "error" | "info" | "warning" };

function ToastStack({ items, remove }: { items: ToastItem[]; remove: (id: number) => void }) {
  if (!items.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 min-w-[280px]">
      {items.map(t => {
        const cfg = {
          success: { bg: "bg-teal-50 border-teal-200 text-teal-800", icon: CheckCircle2 },
          error: { bg: "bg-red-50 border-red-200 text-red-800", icon: XCircle },
          info: { bg: "bg-blue-50 border-blue-200 text-blue-800", icon: Bell },
          warning: { bg: "bg-amber-50 border-amber-200 text-amber-800", icon: AlertTriangle },
        }[t.type];
        return (
          <div key={t.id} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border shadow-lg text-[13px] font-medium ${cfg.bg}`}>
            <cfg.icon size={15} className="shrink-0" />
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100 transition-opacity ml-1">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, prefix = "" }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; prefix?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl p-3 text-xs min-w-[140px]">
      <div className="font-semibold text-foreground mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-foreground">{prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page: Dashboard ─────────────────────────────────────────────────────────
function DashboardPage() {
  const kpis = [
    { label: "Total Users", value: "12,847", change: "+8.2%", up: true, icon: Users, accent: "bg-blue-500", sub: "across all roles" },
    { label: "Doctors", value: "541", change: "+4.1%", up: true, icon: Stethoscope, accent: "bg-violet-500", sub: "541 verified active" },
    { label: "Patients", value: "11,320", change: "+9.7%", up: true, icon: UserCheck, accent: "bg-teal-500", sub: "registered this platform" },
    { label: "Clinics", value: "183", change: "+2.8%", up: true, icon: Building2, accent: "bg-cyan-500", sub: "6 new pending" },
    { label: "Today's Appointments", value: "284", change: "+12.4%", up: true, icon: CalendarDays, accent: "bg-amber-500", sub: "142 completed so far" },
    { label: "Monthly Revenue", value: "$81,400", change: "+16.7%", up: true, icon: DollarSign, accent: "bg-teal-600", sub: "August 2024" },
    { label: "Platform Commission", value: "$12,210", change: "+16.7%", up: true, icon: TrendingUp, accent: "bg-indigo-500", sub: "15% avg rate" },
    { label: "Pending Verifications", value: "6", change: "−2", up: false, icon: Clock, accent: "bg-orange-500", sub: "requires attention" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Platform overview — Sunday, August 10, 2024</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <CardHeader title="Revenue & Payouts" sub="Monthly breakdown — last 8 months" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  {[{ id: "r", c: "#0d9488" }, { id: "p", c: "#3b82f6" }].map(g => (
                    <linearGradient key={g.id} id={`g${g.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.c} stopOpacity={0.12} />
                      <stop offset="95%" stopColor={g.c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip prefix="$" />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0d9488" fill="url(#ggr)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="payouts" name="Doctor Payouts" stroke="#3b82f6" fill="url(#ggp)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Appointment Status" sub="This week total: 1,161" />
          <div className="p-5 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={apptStatusPie} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                  {apptStatusPie.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v.toLocaleString(), ""]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
              {apptStatusPie.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-muted-foreground flex-1">{d.name}</span>
                  <span className="font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="User Growth" sub="Cumulative registrations" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey="patients" name="Patients" stroke="#0d9488" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="doctors" name="Doctors" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clinics" name="Clinics" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader title="Weekly Appointments" sub="By status — current week" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={weeklyAppts} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="completed" name="Completed" fill="#0d9488" radius={[2, 2, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Page: Analytics ─────────────────────────────────────────────────────────
function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Analytics</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Deep platform performance insights</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Appointments This Week", value: "1,161", change: "+18%", up: true, icon: CalendarDays },
          { label: "Avg Doctor Rating", value: "4.78 ★", change: "+0.06", up: true, icon: Star },
          { label: "Completion Rate", value: "67.2%", change: "+2.1%", up: true, icon: CheckCircle2 },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon size={15} className="text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className={`text-[11px] font-medium mt-1.5 flex items-center gap-0.5 ${s.up ? "text-teal-600" : "text-red-500"}`}>
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{s.change} vs last week
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Revenue by Clinic" sub="This month — top 6 clinics" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByClinic} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#0d9488" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Doctors by Appointments" sub="August 2024" />
          <div className="divide-y divide-border">
            {topDoctors.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-[13px] font-bold text-muted-foreground w-5 shrink-0">{i + 1}</span>
                <Avatar name={d.name} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-foreground truncate">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.specialty}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-foreground">{d.appts}</div>
                  <div className="text-[11px] text-amber-600">★ {d.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Full Revenue Breakdown" sub="January – August 2024" />
        <div className="p-5">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip prefix="$" />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="revenue" name="Gross Revenue" fill="#0d9488" radius={[2, 2, 0, 0]} />
              <Bar dataKey="payouts" name="Doctor Payouts" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="commission" name="Commission" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="refunds" name="Refunds" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─── Page: Doctor Verification ────────────────────────────────────────────────
function VerificationPage({ toast, confirm }: { toast: (m: string, t: ToastItem["type"]) => void; confirm: (s: Omit<ConfirmState, "open">) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Doctor Verification</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Review and approve pending doctor applications</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Pending Review", v: 4, cls: "border-l-amber-400" },
          { label: "Under Review", v: 1, cls: "border-l-blue-400" },
          { label: "Docs Requested", v: 1, cls: "border-l-violet-400" },
          { label: "Approved This Month", v: 24, cls: "border-l-teal-400" },
        ].map(s => (
          <Card key={s.label} className={`p-4 border-l-4 ${s.cls}`}>
            <div className="text-2xl font-bold text-foreground">{s.v}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Pending Applications"
          sub={`${pendingDoctors.length} applications awaiting review`}
          action={
            <Btn variant="outline"><Filter size={12} />Filter</Btn>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th ch="Doctor" />
                <Th ch="Specialty" />
                <Th ch="License #" />
                <Th ch="Clinic" />
                <Th ch="Submitted" />
                <Th ch="Documents" />
                <Th ch="Status" />
                <Th ch="Actions" />
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map(d => (
                <Tr key={d.id}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={d.name} />
                      <div>
                        <div className="font-semibold text-foreground text-[13px]">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{d.id}</div>
                      </div>
                    </div>
                  </Td>
                  <Td muted>{d.specialty}</Td>
                  <Td mono muted>{d.license}</Td>
                  <Td muted>{d.clinic}</Td>
                  <Td muted>{d.submitted}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 text-[12px] text-blue-600 font-medium">
                      <FileText size={12} /> {d.docs} files
                    </span>
                  </Td>
                  <Td><Badge status={d.status} /></Td>
                  <Td>
                    <div className="flex items-center gap-0.5">
                      <IconBtn icon={Eye} />
                      <IconBtn icon={CheckCircle2} variant="success" onClick={() => confirm({ title: "Approve Doctor", body: `Approve ${d.name} as a verified platform doctor?`, onConfirm: () => toast(`${d.name} approved successfully`, "success") })} />
                      <IconBtn icon={XCircle} variant="danger" onClick={() => confirm({ title: "Reject Application", body: `Reject ${d.name}'s application? The applicant will be notified via email.`, onConfirm: () => toast(`${d.name}'s application rejected`, "error"), danger: true })} />
                      <IconBtn icon={FileText} onClick={() => toast(`Document request sent to ${d.name}`, "info")} />
                      <IconBtn icon={Ban} variant="danger" onClick={() => confirm({ title: "Suspend Account", body: `Suspend ${d.name}'s account? They will lose platform access immediately.`, onConfirm: () => toast(`${d.name} suspended`, "warning"), danger: true })} />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Page: Appointments ───────────────────────────────────────────────────────
function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [sortBy, setSortBy] = useState<string | null>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let r = appointments.filter(a => {
      const q = search.toLowerCase();
      return (!q || [a.id, a.patient, a.doctor, a.clinic].some(s => s.toLowerCase().includes(q)))
        && (statusF === "all" || a.status === statusF);
    });
    if (sortBy) r = [...r].sort((a, b) => {
      const va = (a as Record<string, string | number>)[sortBy];
      const vb = (b as Record<string, string | number>)[sortBy];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "desc" ? -cmp : cmp;
    });
    return r;
  }, [search, statusF, sortBy, sortDir]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Appointments</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">{filtered.length} appointments found</p>
        </div>
        <Btn variant="outline" size="sm"><Download size={12} />Export CSV</Btn>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search ID, patient, doctor, clinic…"
            className="w-full pl-8.5 pr-8 py-2 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
          {search && <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={13} /></button>}
        </div>
        <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }}
          className="px-3 py-2 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
          {["all", "confirmed", "completed", "cancelled", "no_show"].map(s => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <Th ch="ID" sortKey="id" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Patient" sortKey="patient" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Doctor" sortKey="doctor" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Clinic" />
                <Th ch="Date" sortKey="date" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Time" />
                <Th ch="Amount" sortKey="amount" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Payment" />
                <Th ch="Status" />
                <Th ch="" />
              </tr>
            </thead>
            <tbody>
              {paged.map(a => (
                <Tr key={a.id}>
                  <Td mono muted>{a.id}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.patient} size="sm" />
                      <span className="font-medium text-[13px]">{a.patient}</span>
                    </div>
                  </Td>
                  <Td muted>{a.doctor}</Td>
                  <Td muted>{a.clinic}</Td>
                  <Td>
                    <span className="font-medium text-[13px]">{a.date}</span>
                  </Td>
                  <Td mono muted>{a.time}</Td>
                  <Td><span className="font-semibold">${a.amount}</span></Td>
                  <Td><Badge status={a.payment} /></Td>
                  <Td><Badge status={a.status} /></Td>
                  <Td>
                    <button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                      <MoreHorizontal size={14} className="text-muted-foreground" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground">
          <span>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-2.5 py-1 border border-border rounded-md hover:bg-slate-50 disabled:opacity-40 transition-colors font-medium">← Prev</button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-md text-[12px] font-medium transition-colors ${page === i + 1 ? "bg-primary text-white" : "border border-border hover:bg-slate-50"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-2.5 py-1 border border-border rounded-md hover:bg-slate-50 disabled:opacity-40 transition-colors font-medium">Next →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Page: Payments ───────────────────────────────────────────────────────────
function PaymentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Payments & Revenue</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Financial overview and transaction management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Gross Revenue", value: "$81,400", change: "+16.7%", up: true, icon: DollarSign, accent: "bg-teal-500" },
          { label: "Platform Commission", value: "$12,210", change: "+16.7%", up: true, icon: TrendingUp, accent: "bg-violet-500" },
          { label: "Doctor Payouts", value: "$64,200", change: "+14.2%", up: true, icon: CreditCard, accent: "bg-blue-500" },
          { label: "Refunds Issued", value: "$2,340", change: "+11.4%", up: false, icon: TrendingDown, accent: "bg-red-400" },
        ].map(c => <KpiCard key={c.label} {...c} sub="" />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Monthly Revenue Trend" sub="Gross revenue vs. commission vs. refunds" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  {[{ id: "rev", c: "#0d9488" }, { id: "com", c: "#8b5cf6" }, { id: "ref", c: "#ef4444" }].map(g => (
                    <linearGradient key={g.id} id={`pay_${g.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.c} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={g.c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip prefix="$" />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0d9488" fill="url(#pay_rev)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="commission" name="Commission" stroke="#8b5cf6" fill="url(#pay_com)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="refunds" name="Refunds" stroke="#ef4444" fill="url(#pay_ref)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Payment Providers" sub="Volume split" />
          <div className="p-5 flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={[{ name: "Stripe", value: 68 }, { name: "PayPal", value: 24 }, { name: "Other", value: 8 }]}
                  cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                  <Cell fill="#0d9488" strokeWidth={0} />
                  <Cell fill="#3b82f6" strokeWidth={0} />
                  <Cell fill="#94a3b8" strokeWidth={0} />
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            {[{ name: "Stripe", pct: "68%", color: "bg-teal-500" }, { name: "PayPal", pct: "24%", color: "bg-blue-500" }, { name: "Other", pct: "8%", color: "bg-slate-400" }].map(p => (
              <div key={p.name} className="w-full flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${p.color}`} /><span className="text-muted-foreground">{p.name}</span></span>
                <span className="font-semibold text-foreground">{p.pct}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Transactions" sub="Last 7 transactions"
          action={<Btn variant="outline" size="xs"><Download size={11} />Export</Btn>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><Th ch="ID" /><Th ch="Patient" /><Th ch="Doctor" /><Th ch="Amount" /><Th ch="Commission" /><Th ch="Provider" /><Th ch="Status" /><Th ch="Date" /><Th ch="" /></tr></thead>
            <tbody>
              {transactions.map(t => (
                <Tr key={t.id}>
                  <Td mono muted>{t.id}</Td>
                  <Td>
                    <div className="flex items-center gap-2"><Avatar name={t.patient} /><span className="font-medium text-[13px]">{t.patient}</span></div>
                  </Td>
                  <Td muted>{t.doctor}</Td>
                  <Td><span className="font-bold">${t.amount}</span></Td>
                  <Td><span className={`font-medium ${t.status === "completed" ? "text-teal-600" : "text-muted-foreground"}`}>${t.status === "completed" ? t.commission.toFixed(2) : "—"}</span></Td>
                  <Td><span className="inline-flex items-center gap-1 text-[12px] bg-slate-100 px-2 py-0.5 rounded-md text-muted-foreground font-medium">{t.provider}</span></Td>
                  <Td><Badge status={t.status} /></Td>
                  <Td mono muted>{t.date}</Td>
                  <Td><button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"><MoreHorizontal size={14} className="text-muted-foreground" /></button></Td>
                </Tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Page: Users / Clinics ────────────────────────────────────────────────────
function UsersPage({ active, toast, confirm }: { active: PageId; toast: (m: string, t: ToastItem["type"]) => void; confirm: (s: Omit<ConfirmState, "open">) => void }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("asc"); }
  };

  const isClinics = active === "clinics";

  const userRows = useMemo(() => {
    let r = isClinics
      ? clinicsData.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.manager.toLowerCase().includes(search.toLowerCase()))
      : allUsers.filter(u => {
        const roleMap: Record<PageId, string> = { administrators: "administrators", doctors: "doctors", patients: "patients", clinics: "clinics" } as Record<PageId, string>;
        const roleType = roleMap[active] ?? "";
        const matchRole = !roleType || u.roleType === roleType;
        const q = search.toLowerCase();
        return matchRole && (!q || [u.name, u.email, u.role].some(s => s.toLowerCase().includes(q)));
      });
    return r;
  }, [search, active, isClinics]);

  const tabs = [
    { id: "administrators" as PageId, label: "Administrators", count: 10 },
    { id: "doctors" as PageId, label: "Doctors", count: 541 },
    { id: "patients" as PageId, label: "Patients", count: 11320 },
    { id: "clinics" as PageId, label: "Clinics", count: 183 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage platform users, roles, and access</p>
        </div>
        <Btn variant="primary" size="sm"><Plus size={13} />Add User</Btn>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { }} className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors duration-150 flex items-center gap-1.5 ${active === t.id ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active === t.id ? "bg-primary text-white" : "bg-slate-200 text-slate-500"}`}>{t.count.toLocaleString()}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${isClinics ? "clinics" : "users"}…`}
            className="w-full pl-8.5 pr-3 py-2 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground" />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {isClinics ? (
            <table className="w-full">
              <thead><tr>
                <Th ch="Clinic" sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Manager" />
                <Th ch="City" />
                <Th ch="Doctors" sortKey="doctors" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Patients" sortKey="patients" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Rating" sortKey="rating" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Status" />
                <Th ch="Actions" />
              </tr></thead>
              <tbody>
                {(userRows as typeof clinicsData).map(c => (
                  <Tr key={c.id}>
                    <Td>
                      <div>
                        <div className="font-semibold text-[13px]">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{c.id}</div>
                      </div>
                    </Td>
                    <Td muted>{c.manager}</Td>
                    <Td>
                      <span className="flex items-center gap-1 text-muted-foreground text-[12px]">
                        <MapPin size={11} />{c.city}
                      </span>
                    </Td>
                    <Td><span className="font-semibold">{c.doctors}</span></Td>
                    <Td><span className="font-semibold">{c.patients.toLocaleString()}</span></Td>
                    <Td><span className="text-amber-600 font-semibold">★ {c.rating}</span></Td>
                    <Td><Badge status={c.status} /></Td>
                    <Td>
                      <div className="flex items-center gap-0.5">
                        <IconBtn icon={Eye} />
                        <IconBtn icon={Edit2} />
                        <IconBtn icon={Ban} variant="danger" onClick={() => confirm({ title: "Suspend Clinic", body: `Suspend ${c.name}? All appointments will be cancelled.`, onConfirm: () => toast(`${c.name} suspended`, "warning"), danger: true })} />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead><tr>
                <Th ch="User" sortKey="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Role" />
                <Th ch="Status" />
                <Th ch="Joined" sortKey="joined" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Last Active" sortKey="lastActive" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                <Th ch="Actions" />
              </tr></thead>
              <tbody>
                {(userRows as typeof allUsers).map(u => (
                  <Tr key={u.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} />
                        <div>
                          <div className="font-semibold text-[13px]">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td><span className="text-[12px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{u.role}</span></Td>
                    <Td><Badge status={u.status} /></Td>
                    <Td mono muted>{u.joined}</Td>
                    <Td mono muted>{u.lastActive}</Td>
                    <Td>
                      <div className="flex items-center gap-0.5">
                        <IconBtn icon={Eye} />
                        <IconBtn icon={Edit2} />
                        {u.status === "active"
                          ? <IconBtn icon={Ban} variant="danger" onClick={() => confirm({ title: "Suspend User", body: `Suspend ${u.name}? They will lose platform access immediately.`, onConfirm: () => toast(`${u.name} suspended`, "warning"), danger: true })} />
                          : <IconBtn icon={RefreshCw} variant="success" onClick={() => toast(`${u.name} reactivated`, "success")} />
                        }
                        <IconBtn icon={Activity} />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Page: RBAC ───────────────────────────────────────────────────────────────
function RolesPage({ toast }: { toast: (m: string, t: ToastItem["type"]) => void }) {
  const [selected, setSelected] = useState("Administrator");
  const [perms, setPerms] = useState(defaultPerms);

  const toggle = (group: string, perm: string) => {
    const key = `${group}.${perm}`;
    setPerms(p => ({
      ...p,
      [selected]: { ...p[selected], [key]: !p[selected]?.[key] },
    }));
    toast(`Permission updated for ${selected}`, "info");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Roles & Permissions</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Define role-based access control across all platform resources</p>
        </div>
        <Btn variant="primary" size="sm"><Plus size={13} />New Role</Btn>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Platform Roles</div>
          {rolesData.map(r => (
            <button key={r.name} onClick={() => setSelected(r.name)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 ${selected === r.name ? "border-primary/40 bg-teal-50/50 shadow-sm" : "border-border bg-card hover:bg-slate-50"}`}>
              <div className="flex items-center gap-2.5 mb-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${r.color}`}>{r.name}</span>
                <span className="text-[11px] text-muted-foreground ml-auto">{r.users} users</span>
              </div>
              <div className="text-[12px] text-muted-foreground">{r.desc}</div>
            </button>
          ))}
        </div>

        <Card className="xl:col-span-3 overflow-hidden">
          <CardHeader
            title={`Permissions — ${selected}`}
            sub="Click toggles to grant or revoke individual permissions"
            action={<Btn variant="outline" size="xs"><Download size={11} />Export Role</Btn>}
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-slate-50/60 w-32">Resource</th>
                  {["view", "create", "edit", "suspend", "delete", "verify", "manage", "cancel", "refund", "export"].map(p => (
                    <th key={p} className="px-2 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-slate-50/60">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionGroups.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-[12px] text-foreground border-b border-border/60">{g.label}</td>
                    {["view", "create", "edit", "suspend", "delete", "verify", "manage", "cancel", "refund", "export"].map(p => {
                      const applicable = g.perms.includes(p);
                      const key = `${g.id}.${p}`;
                      const on = perms[selected]?.[key] ?? false;
                      return (
                        <td key={p} className="px-2 py-3 text-center border-b border-border/60">
                          {applicable ? (
                            <button onClick={() => toggle(g.id, p)}
                              className={`w-8 h-4.5 rounded-full transition-all duration-200 mx-auto flex items-center relative ${on ? "bg-primary" : "bg-slate-200"}`}
                              style={{ width: 32, height: 18 }}>
                              <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-200 ${on ? "right-0.5" : "left-0.5"}`} />
                            </button>
                          ) : (
                            <span className="block w-4 h-4 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Page: Security ───────────────────────────────────────────────────────────
function SecurityPage({ toast, confirm }: { toast: (m: string, t: ToastItem["type"]) => void; confirm: (s: Omit<ConfirmState, "open">) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Security Center</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Threat monitoring, access control, and anomaly detection</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Failed Logins (24h)", v: "47", cls: "border-l-red-400", icon: XCircle, iconCls: "text-red-500" },
          { label: "Active Threats", v: "2", cls: "border-l-orange-400", icon: AlertTriangle, iconCls: "text-orange-500" },
          { label: "Blocked IPs", v: "12", cls: "border-l-amber-400", icon: Ban, iconCls: "text-amber-500" },
          { label: "Active Sessions", v: "3", cls: "border-l-teal-400", icon: Shield, iconCls: "text-teal-500" },
        ].map(s => (
          <Card key={s.label} className={`p-4 border-l-4 ${s.cls}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon size={16} className={s.iconCls} />
            </div>
            <div className="text-2xl font-bold text-foreground">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Failed Login Attempts" sub="Today — hourly distribution" />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={failedLoginChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="count" name="Failed Logins" stroke="#ef4444" fill="url(#failGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Active Admin Sessions" sub="Currently logged in" />
          <div className="divide-y divide-border">
            {[
              { user: "superadmin@platform.com", ip: "10.0.0.5", loc: "New York, US", since: "08:30 AM", device: "Chrome · macOS" },
              { user: "admin@platform.com", ip: "203.0.113.44", loc: "London, UK", since: "07:15 AM", device: "Firefox · Windows" },
              { user: "admin2@platform.com", ip: "198.51.100.7", loc: "Singapore", since: "06:02 AM", device: "Safari · iOS" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[12px] font-medium text-foreground">{s.user}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.ip} · {s.loc} · {s.device}</div>
                </div>
                <div className="text-[11px] text-muted-foreground shrink-0">{s.since}</div>
                <IconBtn icon={UserX} variant="danger" onClick={() => confirm({ title: "Terminate Session", body: `Force-logout ${s.user}?`, onConfirm: () => toast(`Session terminated for ${s.user}`, "warning"), danger: true })} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Security Events" sub="Last 48 hours — unresolved first"
          action={<Btn variant="outline" size="xs"><Filter size={11} />Filter</Btn>} />
        <div className="divide-y divide-border">
          {securityEvents.map(e => (
            <div key={e.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors ${!e.resolved ? "" : "opacity-60"}`}>
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${e.severity === "critical" ? "bg-red-500" : e.severity === "high" ? "bg-orange-500" : e.severity === "medium" ? "bg-amber-400" : "bg-slate-300"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-[13px] text-foreground">{e.type}</span>
                  <SeverityChip s={e.severity} />
                  {e.count > 1 && <span className="text-[11px] text-muted-foreground">×{e.count} attempts</span>}
                  {e.resolved && <span className="text-[11px] text-teal-600 font-medium">✓ Resolved</span>}
                </div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">{e.source} → {e.target}</div>
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0">{e.time}</div>
              {!e.resolved && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <IconBtn icon={Eye} />
                  <IconBtn icon={Ban} variant="danger" onClick={() => confirm({ title: "Block Source", body: `Block IP / account "${e.source}"? This will prevent further access.`, onConfirm: () => toast(`${e.source} blocked`, "success"), danger: true })} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Page: Audit Logs ─────────────────────────────────────────────────────────
function AuditPage() {
  const [sev, setSev] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = auditLogs.filter(l =>
    (sev === "all" || l.severity === sev) &&
    (!search || [l.actor, l.action, l.resource].some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Audit Logs</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Immutable trail of all platform actions and events</p>
        </div>
        <Btn variant="outline" size="sm"><Download size={12} />Export Logs</Btn>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actor, action, resource…"
            className="w-full pl-8.5 pr-3 py-2 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground" />
        </div>
        <select value={sev} onChange={e => setSev(e.target.value)}
          className="px-3 py-2 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
          {["all", "low", "medium", "high", "critical"].map(s => (
            <option key={s} value={s}>{s === "all" ? "All Severities" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr>
              <Th ch="Actor" />
              <Th ch="Action" />
              <Th ch="Resource" />
              <Th ch="Timestamp" />
              <Th ch="IP Address" />
              <Th ch="Severity" />
            </tr></thead>
            <tbody>
              {filtered.map((l, i) => (
                <Tr key={i}>
                  <Td mono muted>{l.actor}</Td>
                  <Td>
                    <span className="inline-flex items-center text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{l.action}</span>
                  </Td>
                  <Td muted>{l.resource}</Td>
                  <Td mono muted>{l.timestamp}</Td>
                  <Td mono muted>{l.ip}</Td>
                  <Td><SeverityChip s={l.severity} /></Td>
                </Tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-[13px]">No logs match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Page: System Health ──────────────────────────────────────────────────────
function SystemPage() {
  const h = systemServices.filter(s => s.status === "healthy").length;
  const w = systemServices.filter(s => s.status === "warning").length;
  const d = systemServices.filter(s => s.status === "down").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">System Health</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Real-time status of all infrastructure services</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Healthy", v: h, cls: "border-l-teal-400 bg-teal-50/40", vCls: "text-teal-700" },
          { label: "Degraded", v: w, cls: "border-l-amber-400 bg-amber-50/30", vCls: "text-amber-700" },
          { label: "Down", v: d, cls: "border-l-red-400 bg-red-50/30", vCls: "text-red-700" },
        ].map(s => (
          <Card key={s.label} className={`p-4 border-l-4 ${s.cls}`}>
            <div className="text-2xl font-bold ${s.vCls}">{s.v}</div>
            <div className={`text-xs font-semibold mt-0.5 ${s.vCls}`}>{s.label} Services</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {systemServices.map(s => {
          const upNum = parseFloat(s.uptime);
          return (
            <Card key={s.name} className={`overflow-hidden ${s.status === "down" ? "border-red-200" : s.status === "warning" ? "border-amber-200" : ""}`}>
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.status === "healthy" ? "bg-teal-100" : s.status === "warning" ? "bg-amber-100" : "bg-red-100"}`}>
                  <s.icon size={18} className={s.status === "healthy" ? "text-teal-700" : s.status === "warning" ? "text-amber-700" : "text-red-700"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-[13px] text-foreground">{s.name}</span>
                    <Badge status={s.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${s.status === "healthy" ? "bg-teal-500" : s.status === "warning" ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(upNum, 100)}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">{s.uptime}%</span>
                  </div>
                </div>
                {s.latency !== "—" && (
                  <div className="shrink-0 text-right">
                    <div className="text-[11px] text-muted-foreground">Latency</div>
                    <div className={`text-[13px] font-bold font-mono ${s.status === "warning" ? "text-amber-600" : "text-foreground"}`}>{s.latency}</div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Placeholder page ─────────────────────────────────────────────────────────
function PlaceholderPage({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-muted-foreground" />
      </div>
      <h2 className="text-[15px] font-bold text-foreground">{title}</h2>
      <p className="text-[13px] text-muted-foreground mt-1.5 max-w-xs">{sub}</p>
      <Btn variant="outline" size="md" className="mt-5">Configure</Btn>
    </div>
  );
}

// ─── Navigation config ────────────────────────────────────────────────────────
const navConfig = [
  {
    section: "Overview",
    items: [
      { id: "dashboard" as PageId, label: "Dashboard", icon: LayoutDashboard },
      { id: "analytics" as PageId, label: "Analytics", icon: BarChart2 },
    ],
  },
  {
    section: "Users",
    items: [
      { id: "administrators" as PageId, label: "Administrators", icon: ShieldCheck },
      { id: "doctors" as PageId, label: "Doctors", icon: Stethoscope },
      { id: "patients" as PageId, label: "Patients", icon: UserCheck },
      { id: "clinics" as PageId, label: "Clinics", icon: Building2 },
    ],
  },
  {
    section: "Operations",
    items: [
      { id: "roles" as PageId, label: "Roles & Permissions", icon: Lock },
      { id: "verification" as PageId, label: "Doctor Verification", icon: CheckCircle2, badge: 6 },
      { id: "appointments" as PageId, label: "Appointments", icon: CalendarDays },
      { id: "payments" as PageId, label: "Payments & Revenue", icon: DollarSign },
    ],
  },
  {
    section: "Platform",
    items: [
      { id: "reviews" as PageId, label: "Reviews & Reports", icon: Star },
      { id: "notifications" as PageId, label: "Notifications", icon: Bell },
      { id: "audit" as PageId, label: "Audit Logs", icon: ClipboardList },
      { id: "security" as PageId, label: "Security", icon: Shield, badge: 2 },
      { id: "system" as PageId, label: "System Health", icon: Cpu },
      { id: "settings" as PageId, label: "Platform Settings", icon: Settings },
    ],
  },
];

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [toastId, setToastId] = useState(0);
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, title: "", body: "", onConfirm: () => {} });

  const addToast = (msg: string, type: ToastItem["type"] = "info") => {
    const id = toastId + 1;
    setToastId(id);
    setToasts(ts => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 4500);
  };

  const removeToast = (id: number) => setToasts(ts => ts.filter(t => t.id !== id));

  const askConfirm = (s: Omit<ConfirmState, "open">) => setConfirm({ ...s, open: true });
  const closeConfirm = () => setConfirm(c => ({ ...c, open: false }));

  const navTo = (id: PageId) => { setPage(id); setNotifOpen(false); setProfileOpen(false); };

  const currentLabel = navConfig.flatMap(s => s.items).find(i => i.id === page)?.label ?? "Dashboard";

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage />;
      case "analytics": return <AnalyticsPage />;
      case "administrators":
      case "doctors":
      case "patients":
      case "clinics": return <UsersPage active={page} toast={addToast} confirm={askConfirm} />;
      case "roles": return <RolesPage toast={addToast} />;
      case "verification": return <VerificationPage toast={addToast} confirm={askConfirm} />;
      case "appointments": return <AppointmentsPage />;
      case "payments": return <PaymentsPage />;
      case "security": return <SecurityPage toast={addToast} confirm={askConfirm} />;
      case "audit": return <AuditPage />;
      case "system": return <SystemPage />;
      case "reviews": return <PlaceholderPage icon={Star} title="Reviews & Reports" sub="Patient feedback, doctor ratings, and platform review management" />;
      case "notifications": return <PlaceholderPage icon={Bell} title="Notifications" sub="Manage push, email, and SMS notification templates and delivery rules" />;
      case "settings": return <PlaceholderPage icon={Settings} title="Platform Settings" sub="Configure global platform settings, integrations, and feature flags" />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`flex flex-col shrink-0 bg-sidebar transition-all duration-200 ease-in-out ${collapsed ? "w-[60px]" : "w-[220px]"} border-r border-sidebar-border`}
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #0d1529 100%)" }}>

        {/* Logo */}
        <div className={`flex items-center h-[57px] border-b border-sidebar-border shrink-0 ${collapsed ? "justify-center px-0" : "px-4 gap-3"}`}>
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Stethoscope size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">MedAdmin</div>
              <div className="text-[10px] text-sidebar-foreground/50 leading-tight">Super Admin</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5" style={{ scrollbarWidth: "none" }}>
          {navConfig.map(group => (
            <div key={group.section}>
              {!collapsed && (
                <div className="px-2 mb-1.5 text-[9px] font-bold text-sidebar-foreground/35 uppercase tracking-widest">{group.section}</div>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = page === item.id;
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => navTo(item.id)}
                      className={`w-full flex items-center transition-all duration-150 rounded-lg relative group
                        ${collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"}
                        ${active
                          ? "bg-sidebar-accent text-white"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground/90 hover:bg-sidebar-accent/50"
                        }`}>
                      {active && !collapsed && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />}
                      <Icon size={15} className={`shrink-0 ${active ? "text-primary" : ""}`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-[12.5px] font-medium truncate">{item.label}</span>
                          {(item as { badge?: number }).badge && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-primary/30 text-primary" : "bg-red-500/90 text-white"}`}>
                              {(item as { badge?: number }).badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && (item as { badge?: number }).badge && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: profile + collapse */}
        <div className="border-t border-sidebar-border p-2 shrink-0 space-y-1">
          <button onClick={() => setCollapsed(c => !c)}
            className={`w-full flex items-center text-sidebar-foreground/50 hover:text-sidebar-foreground/80 hover:bg-sidebar-accent/50 rounded-lg transition-colors p-2 ${collapsed ? "justify-center" : "gap-2 px-3"}`}>
            <Menu size={14} />
            {!collapsed && <span className="text-[11px] font-medium">Collapse</span>}
          </button>
          <div className={`flex items-center hover:bg-sidebar-accent/50 rounded-lg cursor-pointer transition-colors ${collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">SA</div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-white/90 truncate">Super Admin</div>
                  <div className="text-[10px] text-sidebar-foreground/40 truncate">superadmin@platform</div>
                </div>
                <LogOut size={13} className="text-sidebar-foreground/40 hover:text-sidebar-foreground/80 shrink-0" />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-[57px] bg-card border-b border-border flex items-center gap-3 px-5 shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium shrink-0">
            <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navTo("dashboard")}>Platform</span>
            <span>/</span>
            <span className="text-foreground font-semibold">{currentLabel}</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md mx-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search anything…"
              className="w-full pl-8.5 pr-16 py-1.5 text-[13px] bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground" />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-slate-100 border border-border rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </div>

          <div className="flex-1" />

          {/* Security alert pill */}
          <button onClick={() => navTo("security")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-red-50 border border-red-200 text-red-700 rounded-full hover:bg-red-100 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            2 alerts
          </button>

          {/* System health */}
          <button onClick={() => navTo("system")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded-full hover:bg-amber-100 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            1 degraded
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-40 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-[13px] text-foreground">Notifications</span>
                  <div className="flex items-center gap-2">
                    <button className="text-[11px] text-primary font-medium hover:underline">Mark all read</button>
                    <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                  </div>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  {[
                    { icon: Clock, msg: "6 doctor verifications pending review", time: "2 min ago", type: "warning", unread: true },
                    { icon: Shield, msg: "Suspicious login from 185.220.101.55 blocked", time: "1 hr ago", type: "error", unread: true },
                    { icon: TrendingUp, msg: "Monthly revenue report is ready for download", time: "3 hrs ago", type: "info", unread: false },
                    { icon: CheckCircle2, msg: "Dr. Aisha Patel completed 100 appointments", time: "5 hrs ago", type: "success", unread: false },
                    { icon: AlertTriangle, msg: "Redis cache latency above threshold (145ms)", time: "6 hrs ago", type: "warning", unread: false },
                  ].map((n, i) => (
                    <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? "bg-teal-50/30" : ""}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.type === "error" ? "bg-red-100 text-red-600" : n.type === "warning" ? "bg-amber-100 text-amber-600" : n.type === "success" ? "bg-teal-100 text-teal-600" : "bg-blue-100 text-blue-600"}`}>
                        <n.icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-foreground leading-snug">{n.msg}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick action */}
          <Btn variant="primary" size="sm"><Plus size={13} />Quick Action</Btn>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-3 border-l border-border hover:bg-slate-50 rounded-lg pr-2 py-1.5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-[11px] font-bold">SA</div>
              <div className="hidden sm:block">
                <div className="text-[12px] font-semibold text-foreground leading-tight">Super Admin</div>
              </div>
              <ChevronDown size={13} className="text-muted-foreground" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-40 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-[13px] font-bold text-foreground">Super Admin</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">superadmin@platform.com</div>
                </div>
                {[
                  { icon: Settings, label: "Platform Settings", id: "settings" as PageId },
                  { icon: Shield, label: "Security Center", id: "security" as PageId },
                  { icon: ClipboardList, label: "Audit Logs", id: "audit" as PageId },
                ].map(m => (
                  <button key={m.id} onClick={() => { navTo(m.id); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-foreground hover:bg-slate-50 transition-colors">
                    <m.icon size={14} className="text-muted-foreground" />{m.label}
                  </button>
                ))}
                <div className="border-t border-border">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={14} />Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page */}
        <main key={page} className="flex-1 overflow-y-auto p-5 lg:p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          {renderPage()}
        </main>
      </div>

      {/* Modals & toasts */}
      <ConfirmModal state={confirm} onCancel={closeConfirm} />
      <ToastStack items={toasts} remove={removeToast} />

      {/* Click-outside overlay for dropdowns */}
      {(profileOpen || notifOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}

      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: #ccfbf1; color: #0f766e; }
        input[type=search]::-webkit-search-cancel-button { display: none; }
        .pl-8\\.5 { padding-left: 2.125rem; }
      `}</style>
    </div>
  );
}
