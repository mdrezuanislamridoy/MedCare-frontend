"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import AdminApp from "../../src/roles/admin/App";

export default function AdminPortalPage() {
  return (
    <RoleGuard allowedRoles={["admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AdminApp />
      </div>
    </RoleGuard>
  );
}
