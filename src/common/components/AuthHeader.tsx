"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  LogOut,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuthStore, Role } from "../stores/auth.store";

const roleMeta: Record<
  Role,
  { label: string; color: string; bg: string; border: string; icon: any; route: string }
> = {
  patient: {
    label: "Patient",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: UserCheck,
    route: "/patient",
  },
  doctor: {
    label: "Doctor",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: Stethoscope,
    route: "/doctor",
  },
  receptionist: {
    label: "Receptionist",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: UserCheck,
    route: "/receptionist",
  },
  "support-staff": {
    label: "Support Staff",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: Users,
    route: "/support-staff",
  },
  "clinic-manager": {
    label: "Clinic Manager",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    icon: Users,
    route: "/clinic-manager",
  },
  admin: {
    label: "Admin",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: Activity,
    route: "/admin",
  },
  "super-admin": {
    label: "Super Admin",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: ShieldCheck,
    route: "/super-admin",
  },
};

export function AuthHeader({ currentRole }: { currentRole?: Role }) {
  const router = useRouter();
  const { user, role, logout } = useAuthStore();

  const activeRole = currentRole || role;
  const meta = roleMeta[activeRole] || roleMeta.patient;
  const RoleIcon = meta.icon;

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand + Verified Role Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
              <Stethoscope className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">MedCare</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200" />

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color} border ${meta.border}`}
          >
            <RoleIcon className="h-3 w-3" />
            <span>{meta.label} Portal</span>
          </div>
        </div>

        {/* Right: User Profile & Sign Out */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs shadow-xs">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="font-semibold text-slate-900 truncate max-w-[140px]">
                  {user.name || user.email.split("@")[0]}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  {user.email}
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            title="Sign out of MedCare"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
