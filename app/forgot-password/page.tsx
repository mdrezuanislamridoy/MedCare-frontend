"use client";

import { ForgotPasswordPage } from "../../src/MedCarePortal";
import { GuestGuard } from "../../src/common/guards/GuestGuard";

export default function ForgotPasswordRoute() {
  return (
    <GuestGuard>
      <ForgotPasswordPage />
    </GuestGuard>
  );
}
