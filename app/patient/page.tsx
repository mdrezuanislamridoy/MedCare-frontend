"use client";

import { RoleGuard } from "../../src/common/guards/RoleGuard";
import PatientApp from "../../src/roles/patient/App";

export default function PatientPortalPage() {
  return (
    <RoleGuard allowedRoles={["patient", "admin", "super-admin"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <PatientApp />
      </div>
    </RoleGuard>
  );
}
