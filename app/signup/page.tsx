"use client";

import { SignupPage } from "../../src/MedCarePortal";
import { GuestGuard } from "../../src/common/guards/GuestGuard";

export default function SignupRoute() {
  return (
    <GuestGuard>
      <SignupPage />
    </GuestGuard>
  );
}
