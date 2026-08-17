"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Sparkles,
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
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
    icon: UserCheck,
    route: "/patient",
  },
  doctor: {
    label: "Doctor",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    icon: Stethoscope,
    route: "/doctor",
  },
  receptionist: {
    label: "Receptionist",
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    icon: UserCheck,
    route: "/receptionist",
  },
  "support-staff": {
    label: "Support Staff",
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
    border: "border-indigo-500/30",
    icon: Users,
    route: "/support-staff",
  },
  "clinic-manager": {
    label: "Clinic Manager",
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    icon: Users,
    route: "/clinic-manager",
  },
  admin: {
    label: "Admin",
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    icon: Activity,
    route: "/admin",
  },
  "super-admin": {
    label: "Super Admin",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    icon: ShieldCheck,
    route: "/super-admin",
  },
};

const allRoles: Role[] = [
  "patient",
  "doctor",
  "receptionist",
  "support-staff",
  "clinic-manager",
  "admin",
  "super-admin",
];

export function AuthHeader({ currentRole }: { currentRole?: Role }) {
  const router = useRouter();
  const { user, role, logout, switchDemoRole } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeRole = currentRole || role;
  const meta = roleMeta[activeRole] || roleMeta.patient;
  const RoleIcon = meta.icon;

  const handleRoleSwitch = (target: Role) => {
    switchDemoRole(target);
    setDropdownOpen(false);
    router.push(roleMeta[target].route);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand + Active Role Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 dark:bg-teal-500 text-white shadow-md shadow-teal-500/20">
              <Stethoscope className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">MedCare</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color} border ${meta.border}`}
          >
            <RoleIcon className="h-3 w-3" />
            <span>{meta.label} Portal</span>
          </div>
        </div>

        {/* Right: Role Switcher & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <Sparkles className="h-3 w-3 text-teal-500 dark:text-teal-400" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-semibold">{meta.label}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-fade-in">
                  <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Workspace Role
                  </div>
                  <div className="space-y-1">
                    {allRoles.map((r) => {
                      const rMeta = roleMeta[r];
                      const Icon = rMeta.icon;
                      const isCurrent = r === activeRole;
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                            isCurrent
                              ? "bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg ${rMeta.bg} ${rMeta.color}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="flex-1 text-left">{rMeta.label}</span>
                          {isCurrent && <span className="text-[10px]">● Active</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill */}
          {user && (
            <div className="hidden md:flex items-center gap-2 pl-2 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-[11px]">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-tight">
                <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user.name || user.email.split("@")[0]}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  {user.email}
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={logout}
            title="Sign out of MedCare"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 hover:border-red-200 dark:hover:border-red-500/30"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
