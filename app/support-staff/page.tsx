"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import SupportStaffApp from "../../src/roles/support-staff/App";

export default function SupportStaffPortalPage() {
  return (
    <RoleGuard allowedRoles={["support-staff", "admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <SupportStaffApp />
      </div>
    </RoleGuard>
  );
}
