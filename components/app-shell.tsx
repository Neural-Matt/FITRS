"use client";

import { useState, type ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { PageFab } from "@/components/page-fab";
import { useRole } from "@/components/role-provider";
import { RoleSwitcher } from "@/components/role-switcher";

export function AppShell({ children }: { children: ReactNode }) {
  const { role } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarWidth = sidebarCollapsed ? "lg:pl-[84px]" : "lg:pl-[250px]";

  return (
    <div className="min-h-screen">
      <Navbar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={`min-h-screen transition-all duration-200 ${sidebarWidth}`}>
        <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="crm-btn-secondary inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm lg:hidden"
                aria-label="Toggle navigation"
              >
                =
              </button>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="crm-btn-secondary hidden h-10 w-10 items-center justify-center rounded-xl lg:inline-flex"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {sidebarCollapsed ? (
                    <path d="M9 18l6-6-6-6M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M15 18l-6-6 6-6M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <RoleSwitcher />
              <span className="inline-flex rounded-full border border-red-200 bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)]">
                {role}
              </span>
            </div>
          </div>
        </header>

        <main className="page-transition mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <PageFab />
    </div>
  );
}
