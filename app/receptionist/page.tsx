"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import { AuthHeader } from "../../src/common/components/AuthHeader";
import ReceptionistApp from "../../src/roles/receptionist/App";

export default function ReceptionistPortalPage() {
  return (
    <RoleGuard allowedRoles={["receptionist", "admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AuthHeader currentRole="receptionist" />
        <ReceptionistApp />
      </div>
    </RoleGuard>
  );
}
