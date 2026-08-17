"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import { AuthHeader } from "../../src/common/components/AuthHeader";
import AdminApp from "../../src/roles/admin/App";

export default function AdminPortalPage() {
  return (
    <RoleGuard allowedRoles={["admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AuthHeader currentRole="admin" />
        <AdminApp />
      </div>
    </RoleGuard>
  );
}
