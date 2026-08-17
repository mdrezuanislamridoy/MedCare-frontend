"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Users,
  Activity,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuthStore, Role } from "../stores/auth.store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

const roleRoutes: Record<Role, string> = {
  patient: "/patient",
  doctor: "/doctor",
  receptionist: "/receptionist",
  "support-staff": "/support-staff",
  "clinic-manager": "/clinic-manager",
  admin: "/admin",
  "super-admin": "/super-admin",
};

const roleMeta: Record<
  Role,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  patient: {
    label: "Patient",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    icon: UserCheck,
  },
  doctor: {
    label: "Doctor",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: Stethoscope,
  },
  receptionist: {
    label: "Receptionist",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: UserCheck,
  },
  "support-staff": {
    label: "Support Staff",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    icon: Users,
  },
  "clinic-manager": {
    label: "Clinic Manager",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    icon: Users,
  },
  admin: {
    label: "Admin",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    icon: Activity,
  },
  "super-admin": {
    label: "Super Admin",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: ShieldCheck,
  },
};

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, role, isAuthenticated, isLoading, switchDemoRole, logout } =
    useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-300">
            Verifying security credentials & RBAC permissions...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">Authentication Required</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Please log in to your MedCare account to access this role portal.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
            >
              Sign In <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check role authorization (Super Admin always has super-user override access)
  const isAuthorized =
    allowedRoles.includes(role) || role === "super-admin";

  if (!isAuthorized) {
    if (fallback) return <>{fallback}</>;

    const currentMeta = roleMeta[role] || roleMeta.patient;
    const targetMeta = roleMeta[allowedRoles[0]] || roleMeta.patient;
    const myDashboardRoute = roleRoutes[role] || "/dashboard";

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                403 Access Restricted
              </span>
              <h2 className="text-xl font-bold text-white">Role Permission Mismatch</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm leading-relaxed text-slate-300">
              You are currently signed in as a{" "}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${currentMeta.bg} ${currentMeta.color} border ${currentMeta.border}`}
              >
                {currentMeta.label}
              </span>
              . However, this workspace requires{" "}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${targetMeta.bg} ${targetMeta.color} border ${targetMeta.border}`}
              >
                {targetMeta.label}
              </span>{" "}
              or Administrative authorization.
            </p>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400">
              <div className="font-semibold text-slate-200">Current User:</div>
              <div className="mt-0.5 text-slate-300">
                {user.name || user.email} ({user.email})
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={myDashboardRoute}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
            >
              Go to My {currentMeta.label} Workspace <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Quick Demo Role Switcher to Required Role */}
            <button
              type="button"
              onClick={() => {
                switchDemoRole(allowedRoles[0]);
                router.refresh();
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/10 py-2.5 text-xs font-semibold text-teal-300 transition hover:bg-teal-500/20"
            >
              <Sparkles className="h-4 w-4" /> Switch to {targetMeta.label} Role (Demo Mode)
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
