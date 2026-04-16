import { AnalyticsOverview } from "@/components/analytics-overview";
import { getAnalyticsSnapshot, getIncidentStats, getResponseTimeAnalytics } from "@/lib/incidents";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [stats, analytics, snapshot] = await Promise.all([
    getIncidentStats(),
    getResponseTimeAnalytics(),
    getAnalyticsSnapshot(),
  ]);

  const nonZeroDispatch = analytics.points.map((point) => point.dispatchMinutes).filter((value) => value > 0);
  const midpoint = Math.floor(nonZeroDispatch.length / 2);
  const older = nonZeroDispatch.slice(0, midpoint);
  const recent = nonZeroDispatch.slice(midpoint);

  const olderAverage =
    older.length > 0 ? older.reduce((sum, value) => sum + value, 0) / older.length : analytics.averageDispatchMinutes;
  const recentAverage =
    recent.length > 0
      ? recent.reduce((sum, value) => sum + value, 0) / recent.length
      : analytics.averageDispatchMinutes;

  const improving = recentAverage <= olderAverage;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          Dispatch and resolution performance for Zambia Fire Brigade operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Total Incidents</p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--brand)]">{stats.total}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Active</p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">{stats.active}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Resolved</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{stats.resolved}</p>
        </article>
      </div>

      <AnalyticsOverview
        heatmap={snapshot.heatmap}
        typeDistribution={snapshot.typeDistribution}
        responseTrend={analytics.points}
        topAreas={snapshot.topAreas}
        averageDispatchMinutes={analytics.averageDispatchMinutes}
        improving={improving}
      />
    </section>
  );
}
