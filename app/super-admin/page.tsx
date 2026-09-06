"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import SuperAdminApp from "../../src/roles/super-admin/App";

export default function SuperAdminPortalPage() {
  return (
    <RoleGuard allowedRoles={["super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <SuperAdminApp />
      </div>
    </RoleGuard>
  );
}
