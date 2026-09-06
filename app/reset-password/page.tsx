"use client";

import { ResetPasswordPage } from "../../src/MedCarePortal";
import { GuestGuard } from "../../src/common/guards/GuestGuard";

export default function ResetPasswordRoute() {
  return (
    <GuestGuard>
      <ResetPasswordPage />
    </GuestGuard>
  );
}
