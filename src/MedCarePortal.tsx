"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth, Role, normalizeBackendRole } from "./common/context/AuthContext";
import SuperAdminApp from "./roles/super-admin/App";
import AdminApp from "./roles/admin/App";
import ClinicManagerApp from "./roles/clinic-manager/App";
import DoctorApp from "./roles/doctor/App";
import PatientApp from "./roles/patient/App";
import ReceptionistApp from "./roles/receptionist/App";
import SupportStaffApp from "./roles/support-staff/App";

export const roles: {
  id: Role;
  label: string;
  description: string;
  icon: typeof Users;
  demoEmail: string;
}[] = [
  {
    id: "patient",
    label: "Patient",
    description: "Book appointments, manage medical records, prescriptions, and video visits.",
    icon: UserCheck,
    demoEmail: "patient@medcare.com",
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Manage clinical chart workspace, consultation notes, prescriptions, and schedule.",
    icon: Stethoscope,
    demoEmail: "doctor@medcare.com",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    description: "Handle front desk check-in wizard, token queues, walk-in visits, and doctor schedules.",
    icon: UserCheck,
    demoEmail: "receptionist@medcare.com",
  },
  {
    id: "support-staff",
    label: "Support Staff",
    description: "Resolve support tickets, complaints, appointment disputes, and live chat messages.",
    icon: Users,
    demoEmail: "support@medcare.com",
  },
  {
    id: "clinic-manager",
    label: "Clinic Manager",
    description: "Manage clinic branches, doctor rosters, rooms, staff accounts, and revenue.",
    icon: Users,
    demoEmail: "manager@medcare.com",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Operate doctor verification queue, patients, clinics, finance, and reviews.",
    icon: Activity,
    demoEmail: "admin@medcare.com",
  },
  {
    id: "super-admin",
    label: "Super Admin",
    description: "Control platform RBAC matrix, access approvals, system health, and backups.",
    icon: ShieldCheck,
    demoEmail: "superadmin@medcare.com",
  },
];

function roleLabel(role: Role) {
  return roles.find((item) => item.id === role)?.label ?? role;
}

function DashboardForRole({ role }: { role: Role }) {
  if (role === "super-admin") return <SuperAdminApp />;
  if (role === "admin") return <AdminApp />;
  if (role === "clinic-manager") return <ClinicManagerApp />;
  if (role === "receptionist") return <ReceptionistApp />;
  if (role === "support-staff") return <SupportStaffApp />;
  if (role === "doctor") return <DoctorApp />;
  return <PatientApp />;
}

export function Shell({
  children,
  onSignOut,
}: {
  children: React.ReactNode;
  onSignOut?: () => void;
}) {
  const { user, role, logout } = useAuth();
  const handleSignOut = onSignOut || logout;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 shadow-md shadow-teal-500/20">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white">MedCare</div>
              <div className="text-[11px] text-teal-300">Unified Healthcare Platform</div>
            </div>
          </Link>

          <div className="flex-1" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-xs font-semibold text-white">{user.name || user.email}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-teal-400">
                  {roleLabel(role)}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-600"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>
      {children}
    </main>
  );
}

export function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("doctor@medcare.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Invalid credentials. Please verify your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (targetRole: Role) => {
    switchDemoRole(targetRole);
    router.push("/dashboard");
  };

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_450px] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-300 ring-1 ring-teal-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Secure Authentication
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Welcome back to the MedCare Portal.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Access your unified clinical dashboard, consultations, appointments, medical records, or administrative control room.
          </p>

          {/* Quick Demo Role Switcher */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                ⚡ Instant One-Click Demo Access
              </span>
              <span className="text-[11px] text-slate-400">No password required</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Click any role below to enter the portal workspace instantly:
            </p>

            <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleDemoLogin(r.id)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2.5 text-left text-xs font-medium text-slate-200 transition hover:border-teal-400/50 hover:bg-teal-500/15 hover:text-white"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal-500/20 text-teal-300">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Sign In</h2>
            <p className="mt-1 text-xs text-slate-400">
              Enter your verified MedCare credentials below.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-200">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@medcare.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-200">Password</label>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{" "}
              <Link href="/signup" className="font-semibold text-teal-400 hover:text-teal-300">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedRole = roles.find((r) => r.id === role)!;
  const SelectedIcon = selectedRole.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await register({
        name: name.trim() || `${selectedRole.label} User`,
        email: email.trim(),
        password,
        role: selectedRole.id,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Registration failed. Please verify your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_460px] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-300 ring-1 ring-teal-500/30">
            <UserCheck className="h-3.5 w-3.5" /> Role Registration
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Choose your role & create your MedCare account.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Select your clinical, administrative, or patient role to receive the tailored workspace and tool suite.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {roles.map((item) => {
              const Icon = item.icon;
              const active = item.id === role;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`rounded-xl border p-3.5 text-left transition ${
                    active
                      ? "border-teal-400 bg-teal-500/20 shadow-md shadow-teal-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        active ? "bg-teal-500 text-white" : "bg-white/10 text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-semibold text-sm text-white">{item.label}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Signup Form Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 shadow-md shadow-teal-500/20">
              <SelectedIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">{selectedRole.label} Registration</h2>
              <p className="text-xs text-slate-400">Join the MedCare healthcare network.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>Account created successfully! Redirecting to workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-200">Full Name</label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Sarah Mitchell"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@medcare.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-teal-400" />
            <p className="mt-3 text-sm text-slate-400">Loading your MedCare workspace...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Shell>
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-8 text-center">
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Authentication Required</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Please sign in to access your designated healthcare role workspace.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/20 hover:bg-teal-600"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  return <DashboardForRole role={role} />;
}
