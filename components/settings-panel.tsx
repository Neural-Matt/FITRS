"use client";

import { useRole } from "@/components/role-provider";
import { useSystemPreferences } from "@/components/system-preferences-provider";

export function SettingsPanel() {
  const { role } = useRole();
  const { autoRefresh, mapClustering, setAutoRefresh, setMapClustering } = useSystemPreferences();

  return (
    <section className="space-y-4">
      <article className="panel p-5">
        <h3 className="mb-2 text-base font-semibold">Role Simulation</h3>
        <p className="text-sm text-[color:var(--text-muted)]">
          Current simulated role is <strong className="text-[color:var(--text-primary)]">{role}</strong>.
          Dispatch, incident updates, and command workflows can be evaluated by switching roles.
        </p>
      </article>

      <article className="panel p-5">
        <h3 className="mb-2 text-base font-semibold">System Information</h3>
        <p className="text-sm text-[color:var(--text-muted)]">
          Demo mode is enabled. This environment is configured for stakeholder walkthroughs and training.
        </p>
      </article>

      <article className="panel p-5">
        <h3 className="mb-3 text-base font-semibold">Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--line)] px-3 py-2">
            <span className="text-sm">Auto-refresh</span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
              className="h-4 w-4 accent-[color:var(--brand)]"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--line)] px-3 py-2">
            <span className="text-sm">Map clustering (optional)</span>
            <input
              type="checkbox"
              checked={mapClustering}
              onChange={(event) => setMapClustering(event.target.checked)}
              className="h-4 w-4 accent-[color:var(--brand)]"
            />
          </label>

          <p className="text-xs text-[color:var(--text-muted)]">
            Clustering toggle is saved for map behavior simulation and can be expanded in future versions.
          </p>
        </div>
      </article>
    </section>
  );
}
