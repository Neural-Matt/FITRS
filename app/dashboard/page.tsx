import { IncidentTable } from "@/components/incident-table";
import { LiveActivityFeed } from "@/components/live-activity-feed";
import { LiveStatusBar } from "@/components/live-status-bar";
import { ResponseTimeAnalytics } from "@/components/response-time-analytics";
import { StatCards } from "@/components/stat-cards";
import { getIncidents, getIncidentStats, getResponseTimeAnalytics } from "@/lib/incidents";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [incidents, stats, analytics] = await Promise.all([
    getIncidents(),
    getIncidentStats(),
    getResponseTimeAnalytics(),
  ]);

  // Sort by priority: critical > high > medium > low
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedIncidents = [...incidents].sort(
    (a, b) =>
      (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3),
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--text-primary)]">
          Command Center
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Real-time operational dashboard — Zambia Fire Brigade
        </p>
      </div>

      {/* Live Status Bar */}
      <LiveStatusBar />

      {/* Key Metrics - Horizontal */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
            Operational Overview
          </h3>
          <div className="h-px flex-1 bg-[color:var(--line)]" />
        </div>
        <StatCards stats={stats} />
      </section>

      {/* Main operational area: Left incidents, Right activity */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left: Active incidents (scrollable) */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              Incident Queue
            </h3>
            <div className="h-px flex-1 bg-[color:var(--line)]" />
          </div>
          <IncidentTable incidents={sortedIncidents} />
        </div>

        {/* Right: Live activity feed */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              Activity Log
            </h3>
            <div className="h-px flex-1 bg-[color:var(--line)]" />
          </div>
          <LiveActivityFeed />
        </div>
      </section>

      {/* Bottom: Analytics (compact) */}
      <section className="max-h-96 lg:max-h-none">
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
            Response Times
          </h3>
          <div className="h-px flex-1 bg-[color:var(--line)]" />
        </div>
        <ResponseTimeAnalytics
          averageDispatchMinutes={analytics.averageDispatchMinutes}
          averageResolutionMinutes={analytics.averageResolutionMinutes}
          points={analytics.points}
        />
      </section>
    </div>
  );
}
