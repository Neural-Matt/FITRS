"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type FabAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  onClick: () => void;
};

// ── Icon building blocks ─────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M4 12a8 8 0 0 1 14.93-3H16M20 12a8 8 0 0 1-14.93 3H8" strokeLinecap="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PageFab() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { pageLabel, actions } = useMemo<{
    pageLabel: string;
    actions: FabAction[];
  }>(() => {
    if (pathname === "/dashboard") {
      return {
        pageLabel: "Dashboard",
        actions: [
          {
            id: "new-incident",
            label: "New Incident",
            icon: <PlusIcon />,
            accent: "bg-red-100 text-red-700",
            onClick: () => router.push("/incidents/new"),
          },
          {
            id: "view-map",
            label: "View Map",
            icon: <MapPinIcon />,
            accent: "bg-blue-100 text-blue-700",
            onClick: () => router.push("/map"),
          },
        ],
      };
    }

    if (pathname === "/dispatch") {
      return {
        pageLabel: "Dispatch",
        actions: [
          {
            id: "assign-unit",
            label: "Assign Unit",
            icon: <CheckIcon />,
            accent: "bg-amber-100 text-amber-700",
            onClick: () =>
              document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" }),
          },
          {
            id: "refresh",
            label: "Refresh Data",
            icon: <RefreshIcon />,
            accent: "bg-slate-100 text-slate-700",
            onClick: () => router.refresh(),
          },
        ],
      };
    }

    if (pathname === "/map") {
      return {
        pageLabel: "Map",
        actions: [
          {
            id: "toggle-layers",
            label: "Toggle Layers",
            icon: <LayersIcon />,
            accent: "bg-emerald-100 text-emerald-700",
            onClick: () =>
              window.dispatchEvent(new Event("fitrs-map-toggle-layers")),
          },
          {
            id: "center-me",
            label: "My Location",
            icon: <CrosshairIcon />,
            accent: "bg-blue-100 text-blue-700",
            onClick: () =>
              window.dispatchEvent(new Event("fitrs-map-center-me")),
          },
        ],
      };
    }

    if (pathname.startsWith("/incidents")) {
      return {
        pageLabel: "Incidents",
        actions: [
          {
            id: "create-incident",
            label: "New Incident",
            icon: <PlusIcon />,
            accent: "bg-red-100 text-red-700",
            onClick: () => router.push("/incidents/new"),
          },
          {
            id: "filter-incidents",
            label: "Filter Active",
            icon: <FilterIcon />,
            accent: "bg-amber-100 text-amber-700",
            onClick: () => router.push("/incidents?status=reported"),
          },
        ],
      };
    }

    return { pageLabel: "", actions: [] };
  }, [pathname, router]);

  if (actions.length === 0) return null;

  return (
    <div className="fab-wrap">
      {/* Expanded menu */}
      <div className={`fab-menu ${open ? "fab-menu-open" : ""}`} aria-hidden={!open}>
        {/* Page context pill */}
        <span className="fab-context-pill">{pageLabel}</span>

        {actions.map((action, i) => (
          <button
            key={action.id}
            type="button"
            className="fab-action"
            style={{ animationDelay: `${i * 45}ms` }}
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
          >
            <span className={`fab-action-icon ${action.accent}`}>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Primary button */}
      <button
        type="button"
        className={`fab-primary ${open ? "fab-primary-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        aria-expanded={open}
      >
        {open ? <XIcon /> : <BoltIcon />}
      </button>
    </div>
  );
}
