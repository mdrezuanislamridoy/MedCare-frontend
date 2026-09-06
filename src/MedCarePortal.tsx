"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
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
import {
  useAuth,
  Role,
  normalizeBackendRole,
  getRoleRoute,
} from "./common/context/AuthContext";
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

export function roleLabel(role: Role) {
  return roles.find((item) => item.id === role)?.label ?? role;
}

export function DashboardForRole({ role }: { role: Role }) {
  if (role === "super-admin") return <SuperAdminApp />;
  if (role === "admin") return <AdminApp />;
  if (role === "clinic-manager") return <ClinicManagerApp />;
  if (role === "receptionist") return <ReceptionistApp />;
  if (role === "support-staff") return <SupportStaffApp />;
  if (role === "doctor") return <DoctorApp />;
  return <PatientApp />;
}

export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
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
              <Link
                href={getRoleRoute(role)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 transition hover:bg-teal-500/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Workspace ({roleLabel(role)})</span>
              </Link>
              <div className="hidden text-right sm:block">
                <div className="text-xs font-semibold text-white">{user.name || user.email}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-teal-400">
                  {roleLabel(role)}
                </div>
              </div>
              <button
                type="button"
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

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect");
  const { login, googleAuth, switchDemoRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const user = await login({ email: email.trim(), password });
      const target = redirectTarget || getRoleRoute(normalizeBackendRole(user.role));
      router.push(target);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Invalid credentials. Please verify your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setInfoMessage(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setInfoMessage(
        "Google OAuth is not configured in this environment (NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing). Please use standard email/password or demo mode.",
      );
      return;
    }

    setGoogleLoading(true);
    try {
      // If client ID is present, we would invoke google.accounts.id.prompt or OAuth popup
      setInfoMessage("Connecting to Google OAuth...");
    } catch (err: any) {
      setErrorMessage(err?.message || "Google authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = (targetRole: Role) => {
    switchDemoRole(targetRole);
    const target = redirectTarget || getRoleRoute(targetRole);
    router.push(target);
  };

  const autofill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setErrorMessage(null);
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

          {infoMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-200">
              <Sparkles className="h-4 w-4 shrink-0 text-teal-400 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
          >
            {googleLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
            ) : (
              <GoogleIcon />
            )}
            <span>Continue with Google SSO</span>
          </button>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase">
              Or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-200">Email Address</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => autofill("doctor@medcare.com")}
                    className="text-[10px] text-teal-400 hover:text-teal-300 underline"
                  >
                    Demo Doctor
                  </button>
                  <span className="text-[10px] text-slate-500">•</span>
                  <button
                    type="button"
                    onClick={() => autofill("patient@medcare.com")}
                    className="text-[10px] text-teal-400 hover:text-teal-300 underline"
                  >
                    Demo Patient
                  </button>
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@medcare.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-200">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-teal-400 transition hover:text-teal-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
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

export function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-400" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const { register, switchDemoRole } = useAuth();
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      // Backend RegisterDto only takes email, password, and name.
      // Newly registered accounts start as PATIENT.
      const user = await register({
        name: name.trim() || undefined,
        email: email.trim(),
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        const target = getRoleRoute(normalizeBackendRole(user.role));
        router.push(target);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Registration failed. Please verify your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoInstant = (demoRole: Role) => {
    switchDemoRole(demoRole);
    router.push(getRoleRoute(demoRole));
  };

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_460px] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-300 ring-1 ring-teal-500/30">
            <UserCheck className="h-3.5 w-3.5" /> Account Registration
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Create your MedCare healthcare account.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            All new user accounts start with Patient access. Clinical and administrative role elevations (Doctor, Clinic Manager, Admin) are granted by platform administrators.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Explore Portals in Demo Mode
              </span>
              <span className="text-[11px] text-slate-400">Instant Access</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {roles.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleDemoInstant(item.id)}
                    className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-teal-500/40 hover:bg-teal-500/10"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-white">{item.label}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signup Form Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 shadow-md shadow-teal-500/20">
              <SelectedIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Register Account</h2>
              <p className="text-xs text-slate-400">Join the MedCare unified healthcare network.</p>
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
                  placeholder="Sarah Mitchell"
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
                  placeholder="sarah@example.com"
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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

export function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-400" /></div>}>
      <SignupPageContent />
    </Suspense>
  );
}

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams?.get("email") || "";

  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      setSuccessMessage(
        res?.message || "Password reset code sent! Please check your email inbox.",
      );
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to issue password reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <Link
            href="/login"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter your registered email address to receive a 6-digit verification code.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Reset Code Sent!</div>
                  <div className="mt-1 leading-relaxed">{successMessage}</div>
                </div>
              </div>

              <Link
                href={`/reset-password?email=${encodeURIComponent(email.trim())}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
              >
                Enter 6-Digit Code <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Sending Code...
                  </>
                ) : (
                  <>
                    Send Verification Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already have a reset code?{" "}
              <Link
                href={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="font-semibold text-teal-400 hover:text-teal-300"
              >
                Reset Password Here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-400" /></div>}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams?.get("email") || "";

  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Password reset failed. Please check the verification code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <Link
            href="/login"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-teal-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create New Password</h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter your 6-digit verification code and set your new password.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Password Updated!</div>
                <div className="mt-1">Your password has been reset. Redirecting to Sign In...</div>
              </div>
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
              <label className="block text-xs font-medium text-slate-200">6-Digit Verification Code</label>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full tracking-widest font-mono rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200">New Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200">Confirm New Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
                  <RefreshCw className="h-4 w-4 animate-spin" /> Resetting Password...
                </>
              ) : (
                <>
                  Update Password <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Need a new code?{" "}
              <Link href="/forgot-password" className="font-semibold text-teal-400 hover:text-teal-300">
                Request Code Again
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-400" /></div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated } = useAuth();

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
                href="/login?redirect=/dashboard"
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
