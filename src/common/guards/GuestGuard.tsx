"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";
import { useAuthStore, getRoleRoute } from "../stores/auth.store";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { user, role, isAuthenticated, isLoading, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-teal-600" />
          <p className="mt-3 text-xs text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show redirect prompt or auto-redirect
  if (isAuthenticated && user) {
    const roleRoute = getRoleRoute(role);

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-200">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Already Signed In</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            You are currently signed in as <span className="font-semibold text-teal-700">{user.name || user.email}</span> ({role.toUpperCase()}).
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={roleRoute}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
            >
              Continue to My Workspace <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => logout()}
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
