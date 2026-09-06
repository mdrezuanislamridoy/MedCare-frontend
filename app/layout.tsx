import type { Metadata } from "next";
import ThemeProvider from "../src/ThemeProvider";
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
    <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
