"use client";

import { useCallback, useEffect, useState } from "react";

type LiveStatus = {
  activeIncidents: number;
  unitsDeployed: number;
  agencies: string[];
  fetchedAt: string;
};

const AGENCY_LABELS: Record<string, string> = {
  fire: "Fire Brigade",
  police: "Zambia Police",
  ambulance: "ZRCS Ambulance",
};

function useSecondsAgo(isoDate: string | null): string {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isoDate) return;
    const update = () =>
      setSeconds(Math.round((Date.now() - new Date(isoDate).getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [isoDate]);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function LiveStatusBar() {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/dashboard/status");
      if (res.ok) setStatus(await res.json());
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  const lastUpdated = useSecondsAgo(status?.fetchedAt ?? null);
  const isAlert = (status?.activeIncidents ?? 0) > 0;

  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 shadow-sm">
      {/* Live pulsing dot + label */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className={`absolute inset-0 animate-ping rounded-full opacity-70 ${
              isAlert ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
          <span
            className={`relative h-2.5 w-2.5 rounded-full ${
              isAlert ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
          Live
        </span>
      </div>

      <div className="h-4 w-px bg-[color:var(--line)]" />

      {/* Active incidents */}
      <div className="flex items-center gap-1.5">
        <span
          className={`text-xl font-bold tabular-nums leading-none ${
            isAlert ? "text-[color:var(--brand)]" : "text-emerald-600"
          }`}
        >
          {status?.activeIncidents ?? "—"}
        </span>
        <span className="text-xs text-[color:var(--text-muted)]">Active Incidents</span>
      </div>

      <div className="h-4 w-px bg-[color:var(--line)]" />

      {/* Units deployed */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold tabular-nums leading-none text-[color:var(--text-primary)]">
          {status?.unitsDeployed ?? "—"}
        </span>
        <span className="text-xs text-[color:var(--text-muted)]">Units Deployed</span>
      </div>

      {/* Agencies on duty */}
      {status?.agencies && status.agencies.length > 0 && (
        <>
          <div className="h-4 w-px bg-[color:var(--line)]" />
          <div className="flex flex-wrap items-center gap-1.5">
            {status.agencies.map((a) => (
              <span
                key={a}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
              >
                {AGENCY_LABELS[a] ?? a}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Last updated — pushed to right */}
      <div className="ml-auto flex items-center gap-2">
        {isRefreshing && (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
        )}
        <span className="text-[11px] text-[color:var(--text-muted)]">Updated {lastUpdated}</span>
      </div>
    </div>
  );
}
