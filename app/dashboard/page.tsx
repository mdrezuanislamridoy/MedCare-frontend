"use client";

import DashboardPage from "../../src/MedCarePortal";
import { RoleGuard } from "../../src/common/guards/RoleGuard";

export default function DashboardRoute() {
  return (
    <RoleGuard
      allowedRoles={[
        "patient",
        "doctor",
        "receptionist",
        "support-staff",
        "clinic-manager",
        "admin",
        "super-admin",
      ]}
    >
      <DashboardPage />
    </RoleGuard>
  );
}
