"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  Clock,
  LogOut,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import SuperAdminApp from "./roles/super-admin/App";
import AdminApp from "./roles/admin/App";
import ClinicManagerApp from "./roles/clinic-manager/App";
import DoctorApp from "./roles/doctor/App";
import PatientApp from "./roles/patient/App";
import ReceptionistApp from "./roles/receptionist/App";

type Role = "super-admin" | "admin" | "clinic-manager" | "receptionist" | "doctor" | "patient";
type RequestStatus = "pending" | "approved";

interface SignupRequest {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: RequestStatus;
  createdAt: string;
}

interface Session {
  email: string;
  role: Role;
  status: RequestStatus;
}

const REQUESTS_KEY = "medcare.signupRequests";
const SESSION_KEY = "medcare.session";

const roles: {
  id: Role;
  label: string;
  description: string;
  icon: typeof Users;
}[] = [
  {
    id: "patient",
    label: "Patient",
    description: "Book appointments, manage medical records, payments, prescriptions, and reviews.",
    icon: UserCheck,
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Manage patients, appointments, consultations, schedules, and clinical notes.",
    icon: Stethoscope,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Operate doctor verification, patients, clinics, appointments, finance, and reviews.",
    icon: Activity,
  },
  {
    id: "clinic-manager",
    label: "Clinic Manager",
    description: "Manage clinic profile, doctors, staff, schedules, rooms, queues, appointments, and payments.",
    icon: Users,
  },
  {
    id: "receptionist",
    label: "Receptionist",
    description: "Handle front desk appointments, patient check-in, queues, rooms, schedules, and activity.",
    icon: UserCheck,
  },
  {
    id: "super-admin",
    label: "Super Admin",
    description: "Approve access requests and control the complete platform workspace.",
    icon: ShieldCheck,
  },
];

function loadRequests(): SignupRequest[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(REQUESTS_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function saveRequests(requests: SignupRequest[]) {
  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function saveSession(session: Session | null) {
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function roleLabel(role: Role) {
  return roles.find((item) => item.id === role)?.label ?? role;
}

function DashboardForRole({ role }: { role: Role }) {
  if (role === "super-admin") return <SuperAdminApp />;
  if (role === "admin") return <AdminApp />;
  if (role === "clinic-manager") return <ClinicManagerApp />;
  if (role === "receptionist") return <ReceptionistApp />;
  if (role === "doctor") return <DoctorApp />;
  return <PatientApp />;
}

function Shell({
  children,
  session,
  onSignOut,
}: {
  children: React.ReactNode;
  session?: Session | null;
  onSignOut?: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">MedCare</div>
            <div className="text-xs text-slate-400">Unified role access</div>
          </div>
          <div className="flex-1" />
          {session && onSignOut && (
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </div>
      </header>
      {children}
    </main>
  );
}

function SignupView({
  onSignup,
}: {
  onSignup: (request: Omit<SignupRequest, "id" | "status" | "createdAt">) => void;
}) {
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const selected = roles.find((item) => item.id === role)!;
  const SelectedIcon = selected.icon;

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_440px] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">Access request</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Sign up with your role before entering MedCare.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            New users request access by role. Super Admin approval unlocks the matching dashboard. Backend auth can replace this local demo store later without changing the role flow.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {roles.map((item) => {
              const Icon = item.icon;
              const active = item.id === role;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`rounded-lg border p-4 text-left transition ${
                    active ? "border-teal-300 bg-teal-500/15" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-teal-500" : "bg-white/10"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSignup({ name: name.trim() || "New User", email: email.trim() || `${role}@medcare.local`, role });
          }}
          className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-2xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500">
              <SelectedIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">{selected.label} signup</h2>
              <p className="text-sm text-slate-400">Approval required before workspace access.</p>
            </div>
          </div>

          <label className="block text-sm font-medium text-slate-200">
            Full name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              placeholder="Sarah Mitchell"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              placeholder="name@medcare.com"
            />
          </label>

          <button className="mt-6 w-full rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600">
            Request access
          </button>
          <Link href="/login" className="mt-3 block text-center text-sm font-medium text-teal-200 hover:text-white">
            Already approved? Login
          </Link>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Demo note: Super Admin accounts are approved immediately so there is always someone who can review new requests.
          </p>
        </form>
      </section>
    </Shell>
  );
}

function LoginView({
  requests,
  onLogin,
}: {
  requests: SignupRequest[];
  onLogin: (session: Session) => void;
}) {
  const router = useRouter();
  const approvedRequests = requests.filter((request) => request.status === "approved");
  const [email, setEmail] = useState(approvedRequests[0]?.email ?? "super-admin@medcare.local");

  const selected = approvedRequests.find((request) => request.email === email);

  return (
    <Shell>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">Login</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Approved users can continue to their dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            This is a frontend-only login placeholder. Later, the backend can validate credentials and return the approved role.
          </p>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
            No approved account yet? Create a role request from signup. A Super Admin can approve it from their approval workspace.
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (selected) {
              onLogin({ email: selected.email, role: selected.role, status: "approved" });
              router.push("/dashboard");
            }
          }}
          className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-2xl"
        >
          <h2 className="text-lg font-semibold">Login to MedCare</h2>
          <p className="mt-1 text-sm text-slate-400">Choose an approved local demo account.</p>

          <label className="mt-5 block text-sm font-medium text-slate-200">
            Approved account
            <select
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
            >
              {approvedRequests.length === 0 && <option value="">No approved accounts</option>}
              {approvedRequests.map((request) => (
                <option key={request.id} value={request.email}>
                  {request.email} - {roleLabel(request.role)}
                </option>
              ))}
            </select>
          </label>

          <button
            disabled={!selected}
            className="mt-6 w-full rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to dashboard
          </button>
          <Link href="/signup" className="mt-3 block text-center text-sm font-medium text-teal-200 hover:text-white">
            Need an account? Signup
          </Link>
        </form>
      </section>
    </Shell>
  );
}

function PendingView({
  session,
  request,
  onRefresh,
  onSignOut,
}: {
  session: Session;
  request?: SignupRequest;
  onRefresh: () => void;
  onSignOut: () => void;
}) {
  return (
    <Shell session={session} onSignOut={onSignOut}>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-8">
        <div className="w-full rounded-lg border border-white/10 bg-white/[0.05] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Waiting for Super Admin approval</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {request?.name ?? session.email} requested {roleLabel(session.role)} access. Once approved, this same app will open the matching role dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={onRefresh} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">
              Check status
            </button>
            <button onClick={onSignOut} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
              Change request
            </button>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function ApprovalWorkspace({
  requests,
  onApprove,
  onOpenDashboard,
  session,
  onSignOut,
}: {
  requests: SignupRequest[];
  onApprove: (id: string) => void;
  onOpenDashboard: () => void;
  session: Session;
  onSignOut: () => void;
}) {
  const pending = requests.filter((request) => request.status === "pending");
  const approved = requests.filter((request) => request.status === "approved");

  return (
    <Shell session={session} onSignOut={onSignOut}>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">Super Admin gate</p>
            <h1 className="mt-3 text-3xl font-semibold">Approve role access before users enter dashboards.</h1>
          </div>
          <button onClick={onOpenDashboard} className="rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
            Open Super Admin dashboard
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.05]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="font-semibold">Pending requests</h2>
              <p className="text-sm text-slate-400">These are local demo records until the backend is added.</p>
            </div>
            {pending.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-slate-400">No pending access requests.</div>
            ) : (
              <div className="divide-y divide-white/10">
                {pending.map((request) => (
                  <div key={request.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="font-semibold">{request.name}</div>
                      <div className="mt-1 text-sm text-slate-400">{request.email}</div>
                    </div>
                    <span className="w-fit rounded-full bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-200">
                      {roleLabel(request.role)}
                    </span>
                    <button
                      onClick={() => onApprove(request.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-600"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
            <h2 className="font-semibold">Access summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2">
                <span className="text-slate-300">Pending</span>
                <span className="font-semibold">{pending.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2">
                <span className="text-slate-300">Approved</span>
                <span className="font-semibold">{approved.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function usePortalState() {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedRequests = loadRequests();
    if (!storedRequests.some((request) => request.email === "super-admin@medcare.local")) {
      storedRequests.unshift({
        id: "seed-super-admin",
        name: "Super Admin",
        email: "super-admin@medcare.local",
        role: "super-admin",
        status: "approved",
        createdAt: new Date().toISOString(),
      });
      saveRequests(storedRequests);
    }
    setRequests(storedRequests);
    setSession(loadSession());
  }, []);

  const updateRequests = (nextRequests: SignupRequest[]) => {
    setRequests(nextRequests);
    saveRequests(nextRequests);
  };

  const updateSession = (nextSession: Session | null) => {
    setSession(nextSession);
    saveSession(nextSession);
  };

  return { requests, session, setRequests, updateRequests, updateSession };
}

export function SignupPage() {
  const router = useRouter();
  const { requests, updateRequests, updateSession } = usePortalState();

  const handleSignup = (input: Omit<SignupRequest, "id" | "status" | "createdAt">) => {
    const status: RequestStatus = input.role === "super-admin" ? "approved" : "pending";
    const request: SignupRequest = {
      ...input,
      id: crypto.randomUUID(),
      status,
      createdAt: new Date().toISOString(),
    };
    updateRequests([request, ...requests]);
    updateSession({ email: request.email, role: request.role, status });
    router.push("/dashboard");
  };

  return <SignupView onSignup={handleSignup} />;
}

export function LoginPage() {
  const { requests, updateSession } = usePortalState();

  return <LoginView requests={requests} onLogin={updateSession} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const { requests, session, setRequests, updateRequests, updateSession } = usePortalState();
  const [superAdminDashboardOpen, setSuperAdminDashboardOpen] = useState(false);

  const activeRequest = useMemo(
    () => requests.find((request) => request.email === session?.email && request.role === session.role),
    [requests, session],
  );

  const handleApprove = (id: string) => {
    const nextRequests = requests.map((request) => (request.id === id ? { ...request, status: "approved" as const } : request));
    updateRequests(nextRequests);

    const approvedRequest = nextRequests.find((request) => request.id === id);
    if (approvedRequest && session?.email === approvedRequest.email && session.role === approvedRequest.role) {
      updateSession({ email: approvedRequest.email, role: approvedRequest.role, status: "approved" });
    }
  };

  const handleRefresh = () => {
    const nextRequests = loadRequests();
    setRequests(nextRequests);
    const request = nextRequests.find((item) => item.email === session?.email && item.role === session.role);
    if (request?.status === "approved") {
      updateSession({ email: request.email, role: request.role, status: "approved" });
    }
  };

  const handleSignOut = () => {
    updateSession(null);
    setSuperAdminDashboardOpen(false);
    router.push("/login");
  };

  if (!session) {
    return (
      <Shell>
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-8 text-center">
          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-6">
            <h1 className="text-2xl font-semibold">Login required</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">Please login with an approved account or signup for a new role request.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">Login</Link>
              <Link href="/signup" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">Signup</Link>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  if (session.role === "super-admin" && !superAdminDashboardOpen) {
    return (
      <ApprovalWorkspace
        requests={requests}
        onApprove={handleApprove}
        onOpenDashboard={() => setSuperAdminDashboardOpen(true)}
        session={session}
        onSignOut={handleSignOut}
      />
    );
  }

  if (session.status !== "approved" && activeRequest?.status !== "approved") {
    return <PendingView session={session} request={activeRequest} onRefresh={handleRefresh} onSignOut={handleSignOut} />;
  }

  const approvedSession: Session = activeRequest?.status === "approved" ? { ...session, status: "approved" } : session;

  return <DashboardForRole role={approvedSession.role} />;
}
