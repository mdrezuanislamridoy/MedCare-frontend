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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-teal-400" />
          <p className="mt-3 text-xs text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show redirect prompt or auto-redirect
  if (isAuthenticated && user) {
    const roleRoute = getRoleRoute(role);

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Already Signed In</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            You are currently signed in as <span className="font-semibold text-teal-400">{user.name || user.email}</span> ({role.toUpperCase()}).
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={roleRoute}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
            >
              Continue to My Workspace <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => logout()}
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
