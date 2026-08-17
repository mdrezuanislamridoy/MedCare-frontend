import type { Metadata } from "next";
import ThemeProvider from "../src/ThemeProvider";
import ThemeToggle from "../src/ThemeToggle";
import { AuthProvider } from "../src/common/context/AuthContext";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "MedCare Unified Healthcare Portal",
  description: "Enterprise healthcare portal for patients, doctors, receptionists, clinic managers, and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <ThemeToggle />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
