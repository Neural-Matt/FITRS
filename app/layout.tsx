import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/app-shell";
import { RoleProvider } from "@/components/role-provider";
import { SystemPreferencesProvider } from "@/components/system-preferences-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FITRS - Fire Incident Tracking System",
  description: "Demo-ready fire incident tracking with dispatch and map views.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RoleProvider>
          <SystemPreferencesProvider>
            <AppShell>{children}</AppShell>
          </SystemPreferencesProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
