"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Operations",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { href: "/dispatch", label: "Dispatch", icon: "dispatch" },
      { href: "/map", label: "Map", icon: "map" },
    ],
  },
  {
    label: "Management",
    links: [
      { href: "/incidents", label: "Incidents", icon: "incidents" },
      { href: "/units", label: "Units", icon: "units" },
    ],
  },
  {
    label: "Insights",
    links: [{ href: "/analytics", label: "Analytics", icon: "analytics" }],
  },
  {
    label: "System",
    links: [{ href: "/settings", label: "Settings", icon: "settings" }],
  },
] as const;

function NavIcon({ name }: { name: (typeof navGroups)[number]["links"][number]["icon"] }) {
  if (name === "dashboard") {
    return <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />;
  }

  if (name === "dispatch") {
    return <path d="M4 6h16l-3 6v6l-5-2-5 2v-6z" />;
  }

  if (name === "map") {
    return <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />;
  }

  if (name === "incidents") {
    return <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />;
  }

  if (name === "units") {
    return <path d="M4 18h16M7 18V8h4v10M13 18V5h4v13" />;
  }

  if (name === "analytics") {
    return <path d="M4 18h16M7 14l3-3 3 2 4-5" />;
  }

  return <path d="M12 3l7 4v10l-7 4-7-4V7zM12 9v4M12 16h.01" />;
}

type SidebarNavProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Navbar({ collapsed, mobileOpen, onCloseMobile }: SidebarNavProps) {
  const pathname = usePathname();

  const navWidth = collapsed ? "w-[84px]" : "w-[250px]";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex ${navWidth} transform flex-col border-r border-[color:var(--line)] bg-[#f8fafc] px-3 py-5 transition-all duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="mb-6 border-b border-[color:var(--line)] pb-4">
          {!collapsed ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-[color:var(--brand)]">F</span>
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-primary)]">
                  ITRS
                </span>
                <span
                  title="Zambia"
                  className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-400"
                >
                  🇿🇲
                </span>
              </div>
              <p className="text-[10px] font-medium leading-tight text-[color:var(--text-muted)]">
                Zambia Fire Brigade
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg font-black text-[color:var(--brand)]">F</span>
            </div>
          )}
        </div>

        <div className="space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <section key={group.label}>
              {!collapsed ? (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)] opacity-60">
                  {group.label}
                </p>
              ) : (
                <div className="mb-2 border-t border-[color:var(--line)]" />
              )}

              <nav className="space-y-0.5">
                {group.links.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onCloseMobile}
                      title={link.label}
                      className={`group relative flex items-center rounded-lg py-2 text-sm font-medium transition-colors ${
                        collapsed ? "justify-center px-2" : "gap-3 px-2"
                      } ${
                        active
                          ? "bg-[color:var(--brand-soft)] text-[color:var(--brand)]"
                          : "text-[color:var(--text-muted)] hover:bg-white hover:text-[color:var(--text-primary)]"
                      }`}
                    >
                      {/* Left accent bar */}
                      {active && (
                        <span
                          className="absolute inset-y-1 left-0 w-[3px] rounded-r-full bg-[color:var(--brand)]"
                          aria-hidden
                        />
                      )}

                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          active
                            ? "bg-white text-[color:var(--brand)] shadow-sm"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.7]">
                          <NavIcon name={link.icon} />
                        </svg>
                      </span>

                      {!collapsed ? (
                        <span className={active ? "font-semibold" : ""}>{link.label}</span>
                      ) : (
                        /* Tooltip when collapsed */
                        <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-md border border-[color:var(--line)] bg-white px-2 py-1 text-xs font-medium text-[color:var(--text-primary)] shadow-md group-hover:block">
                          {link.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}
