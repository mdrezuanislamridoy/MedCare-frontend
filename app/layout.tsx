import type { Metadata } from "next";
import ThemeProvider from "../src/ThemeProvider";
import ThemeToggle from "../src/ThemeToggle";
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
