"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  Lock,
} from "lucide-react";
import { useAuthStore, Role, getRoleRoute } from "../stores/auth.store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

const roleMeta: Record<
  Role,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  patient: {
    label: "Patient",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: UserCheck,
  },
  doctor: {
    label: "Doctor",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: Stethoscope,
  },
  receptionist: {
    label: "Receptionist",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: UserCheck,
  },
  "support-staff": {
    label: "Support Staff",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: Users,
  },
  "clinic-manager": {
    label: "Clinic Manager",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    icon: Users,
  },
  admin: {
    label: "Admin",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: Activity,
  },
  "super-admin": {
    label: "Super Admin",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: ShieldCheck,
  },
};

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isAuthenticated, isLoading, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-200">
            <RefreshCw className="h-7 w-7 animate-spin" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            Verifying security credentials & backend authorization...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    const loginHref = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-200">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Authentication Required</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            You must be signed in with valid credentials to access this healthcare workspace.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
            >
              Sign In <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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
    const myDashboardRoute = getRoleRoute(role);

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                403 Access Restricted
              </span>
              <h2 className="text-xl font-bold text-slate-900">Role Permission Mismatch</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm leading-relaxed text-slate-600">
              You are signed in as{" "}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${currentMeta.bg} ${currentMeta.color} border ${currentMeta.border}`}
              >
                {currentMeta.label}
              </span>
              . This workspace requires{" "}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${targetMeta.bg} ${targetMeta.color} border ${targetMeta.border}`}
              >
                {targetMeta.label}
              </span>{" "}
              or Administrative privileges.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">Authenticated Account:</div>
              <div className="mt-0.5 text-slate-600">
                {user.name || user.email} ({user.email})
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={myDashboardRoute}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
            >
              Go to My {currentMeta.label} Workspace <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-700 hover:border-red-200"
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
