"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import { AuthHeader } from "../../src/common/components/AuthHeader";
import ClinicManagerApp from "../../src/roles/clinic-manager/App";

export default function ClinicManagerPortalPage() {
  return (
    <RoleGuard allowedRoles={["clinic-manager", "admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AuthHeader currentRole="clinic-manager" />
        <ClinicManagerApp />
      </div>
    </RoleGuard>
  );
}
