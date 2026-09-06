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
  useAuthStore,
  Role,
  normalizeBackendRole,
  toBackendRole,
  getRoleRoute,
} from "./common/context/AuthContext";
import { useToast } from "./common/context/ToastContext";
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
}[] = [
  {
    id: "patient",
    label: "Patient",
    description: "Book appointments, telehealth consults, view lab results, and prescriptions.",
    icon: User,
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Manage clinical chart workspace, consultation notes, prescriptions, and schedule.",
    icon: Stethoscope,
  },
  {
    id: "receptionist",
    label: "Receptionist",
    description: "Handle front desk check-in wizard, token queues, walk-in visits, and doctor schedules.",
    icon: UserCheck,
  },
  {
    id: "support-staff",
    label: "Support Staff",
    description: "Resolve support tickets, complaints, appointment disputes, and live chat messages.",
    icon: Users,
  },
  {
    id: "clinic-manager",
    label: "Clinic Manager",
    description: "Manage clinic branches, doctor rosters, rooms, staff accounts, and revenue.",
    icon: Users,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Operate doctor verification queue, patients, clinics, finance, and reviews.",
    icon: Activity,
  },
  {
    id: "super-admin",
    label: "Super Admin",
    description: "Control platform RBAC matrix, access approvals, system health, and backups.",
    icon: ShieldCheck,
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-[1536px] items-center gap-4 px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 shadow-sm text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900">MedCare</div>
              <div className="text-xs font-semibold text-teal-700">Unified Healthcare Platform</div>
            </div>
          </Link>

          <div className="flex-1" />

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getRoleRoute(role)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>Workspace ({roleLabel(role)})</span>
              </Link>
              <div className="hidden text-right sm:block">
                <div className="text-xs font-semibold text-slate-900">{user.name || user.email}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {roleLabel(role)}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700"
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
  const login = useAuthStore((s) => s.login);

  const [selectedRole, setSelectedRole] = useState<Role | null>(() => {
    if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role") as Role;
      if (urlRole && roles.some((r) => r.id === urlRole)) return urlRole;
      const saved = localStorage.getItem("medcare.selected_role") as Role;
      if (saved && roles.some((r) => r.id === saved)) return saved;
    }
    return null;
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleSelect = (roleId: Role) => {
    setSelectedRole(roleId);
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("medcare.selected_role", roleId);
        const url = new URL(window.location.href);
        url.searchParams.set("role", roleId);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Safe fallback
      }
    }
  };

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      const msg = "Please select a role on the left before signing in.";
      setErrorMessage(msg);
      toast.warning(msg, "Role Required");
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await login({ email: email.trim(), password });
      toast.success(`Signed in successfully as ${user.name || user.email}`, "Welcome Back");
      const target =
        redirectTarget || getRoleRoute(normalizeBackendRole(user.role));
      router.push(target);
    } catch (err: any) {
      const msg =
        err?.message ||
        "Invalid credentials. Please verify your email and password.";
      setErrorMessage(msg);
      toast.error(msg, "Sign In Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1536px] gap-8 px-6 py-8 lg:grid-cols-[1.2fr_470px] lg:items-center lg:px-12">
        {/* Left Side: Role Selector */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Portal Role Selection
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Choose Your Portal Role
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600">
            Select the role you wish to sign in as. The login form on the right is locked until a role is selected. Default seeded credentials will be filled automatically.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Available Roles (Click to Select)
              </span>
              {selectedRole ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                  <CheckCircle2 className="h-3 w-3" /> Selected: {roleLabel(selectedRole)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                  <AlertCircle className="h-3 w-3" /> Select a role below
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-600/30"
                        : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50/80"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isSelected ? "text-teal-950" : "text-slate-900"
                          }`}
                        >
                          {r.label}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-teal-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Login Card (Disabled until role selected) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-7">
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedRole || ""}
                  onChange={(e) => handleRoleSelect(e.target.value as Role)}
                  aria-label="Select Role"
                  className="rounded-lg border border-teal-300 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-900 outline-none transition focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
                >
                  <option value="" disabled>-- Select Role --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {selectedRole
                ? `Enter credentials to access the ${roleLabel(selectedRole)} portal.`
                : "Form is locked. Select your role on the left to continue."}
            </p>
          </div>

          {!selectedRole && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Role selection required:</strong> Click a role card on the left (e.g. Doctor, Patient, Admin) to unlock this form.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {selectedRole && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-teal-200 bg-teal-50/80 p-3 text-xs text-teal-800">
              <Sparkles className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
              <span>
                Selected role: <strong className="font-semibold text-teal-950">{roleLabel(selectedRole)}</strong>. Enter your authorized credentials below.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={!selectedRole} className="space-y-4 disabled:opacity-50">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole
                        ? "name@example.com"
                        : "Select role on the left..."
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-teal-700 transition hover:text-teal-800 hover:underline"
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
                    placeholder={
                      selectedRole
                        ? "Enter your password"
                        : "Select role on the left..."
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedRole || loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In as {selectedRole ? roleLabel(selectedRole) : "Selected Role"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </fieldset>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-3 text-center">
            <p className="text-xs text-slate-500">
              Need an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-teal-700 hover:underline"
              >
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <RefreshCw className="h-7 w-7 animate-spin text-teal-600" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [selectedRole, setSelectedRole] = useState<Role | null>(() => {
    if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role") as Role;
      if (urlRole && roles.some((r) => r.id === urlRole)) return urlRole;
      const saved = localStorage.getItem("medcare.selected_role") as Role;
      if (saved && roles.some((r) => r.id === saved)) return saved;
    }
    return null;
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (roleId: Role) => {
    setSelectedRole(roleId);
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("medcare.selected_role", roleId);
        const url = new URL(window.location.href);
        url.searchParams.set("role", roleId);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Safe fallback
      }
    }
  };

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      const msg = "Please select a role on the left before registering.";
      setErrorMessage(msg);
      toast.warning(msg, "Role Required");
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await register({
        name: name.trim() || undefined,
        email: email.trim(),
        password,
        role: toBackendRole(selectedRole),
      });

      setSuccess(true);
      toast.success(
        `Account created successfully for ${roleLabel(selectedRole)}! Redirecting to workspace...`,
        "Registration Successful",
      );
      setTimeout(() => {
        const target = getRoleRoute(normalizeBackendRole(user.role));
        router.push(target);
      }, 1200);
    } catch (err: any) {
      const msg =
        err?.message || "Registration failed. Please verify your details.";
      setErrorMessage(msg);
      toast.error(msg, "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1536px] gap-8 px-6 py-8 lg:grid-cols-[1.2fr_470px] lg:items-center lg:px-12">
        {/* Left Side: Role Selector */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200">
            <UserCheck className="h-3.5 w-3.5" /> Portal Role Registration
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Choose Your Registration Role
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600">
            Select the role you are registering for. The registration form on the right is unlocked once you select a role.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Available Roles (Click to Select)
              </span>
              {selectedRole ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                  <CheckCircle2 className="h-3 w-3" /> Registering as: {roleLabel(selectedRole)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                  <AlertCircle className="h-3 w-3" /> Select a role below
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-600/30"
                        : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50/80"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isSelected ? "text-teal-950" : "text-slate-900"
                          }`}
                        >
                          {r.label}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-teal-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form Card (Disabled until role selected) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-7">
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">Register Account</h2>
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedRole || ""}
                  onChange={(e) => handleRoleSelect(e.target.value as Role)}
                  aria-label="Select Role"
                  className="rounded-lg border border-teal-300 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-900 outline-none transition focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
                >
                  <option value="" disabled>-- Select Role --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {selectedRole
                ? `Creating a verified ${roleLabel(selectedRole)} account.`
                : "Form is locked. Select a role on the left to continue."}
            </p>
          </div>

          {!selectedRole && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Role selection required:</strong> Click a role on the left to unlock this registration form.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                Account created as {selectedRole ? roleLabel(selectedRole) : "user"}! Redirecting to workspace...
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={!selectedRole || success} className="space-y-4 disabled:opacity-50">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      selectedRole === "doctor"
                        ? "Dr. Sarah Mitchell"
                        : "Full Name"
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedRole || loading || success}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Create {selectedRole ? roleLabel(selectedRole) : ""} Account{" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </fieldset>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-3 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-teal-700 hover:underline"
              >
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-600" /></div>}>
      <SignupPageContent />
    </Suspense>
  );
}

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams?.get("email") || "";

  const { forgotPassword } = useAuth();
  const toast = useToast();
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
      const msg = res?.message || "Password reset code issued. Please check your email inbox for your 6-digit code.";
      setSuccessMessage(msg);
      toast.success(msg, "Reset Code Sent");
    } catch (err: any) {
      const msg = err?.message || "Failed to issue password reset code. Please check the email address.";
      setErrorMessage(msg);
      toast.error(msg, "Reset Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <Link
            href="/login"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your verified email address to receive a 6-digit verification code.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>

              <Link
                href={`/reset-password?email=${encodeURIComponent(email.trim())}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
              >
                Enter 6-Digit Code <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-50"
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

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Already have a reset code?{" "}
              <Link
                href={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="font-semibold text-teal-700 hover:underline"
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-600" /></div>}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams?.get("email") || "";

  const { resetPassword } = useAuth();
  const toast = useToast();
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
      const msg = "Password must be at least 8 characters long.";
      setErrorMessage(msg);
      toast.warning(msg, "Password Policy");
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match. Please re-enter.";
      setErrorMessage(msg);
      toast.warning(msg, "Mismatch");
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
      toast.success("Password reset successfully! Redirecting to login...", "Success");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const msg = err?.message || "Password reset failed. Please verify the code and try again.";
      setErrorMessage(msg);
      toast.error(msg, "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <Link
            href="/login"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your 6-digit verification code and choose a new secure password.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900">Password Updated</div>
                <div className="mt-1">Your password has been changed. Redirecting to Sign In...</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full tracking-widest font-mono rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Updating Password...
                </>
              ) : (
                <>
                  Update Password <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Need a new code?{" "}
              <Link href="/forgot-password" className="font-semibold text-teal-700 hover:underline">
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><RefreshCw className="h-7 w-7 animate-spin text-teal-600" /></div>}>
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
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-teal-600" />
            <p className="mt-3 text-sm text-slate-600">Verifying session...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Shell>
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-8 text-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-200">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Authentication Required</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Please sign in with verified credentials to access your designated healthcare workspace.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/login?redirect=/dashboard"
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
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
