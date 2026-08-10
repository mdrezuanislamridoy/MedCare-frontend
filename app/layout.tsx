import type { Metadata } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "MedCare Role Portals",
  description: "MedCare role dashboards for super admin, admin, doctor, and patient users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
