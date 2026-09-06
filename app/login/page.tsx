"use client";

import { LoginPage } from "../../src/MedCarePortal";
import { GuestGuard } from "../../src/common/guards/GuestGuard";

export default function LoginRoute() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}
