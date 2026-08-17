"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import { AuthHeader } from "../../src/common/components/AuthHeader";
import SuperAdminApp from "../../src/roles/super-admin/App";

export default function SuperAdminPortalPage() {
  return (
    <RoleGuard allowedRoles={["super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AuthHeader currentRole="super-admin" />
        <SuperAdminApp />
      </div>
    </RoleGuard>
  );
}
