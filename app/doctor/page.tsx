"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import { AuthHeader } from "../../src/common/components/AuthHeader";
import DoctorApp from "../../src/roles/doctor/App";

export default function DoctorPortalPage() {
  return (
    <RoleGuard allowedRoles={["doctor", "admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AuthHeader currentRole="doctor" />
        <DoctorApp />
      </div>
    </RoleGuard>
  );
}
