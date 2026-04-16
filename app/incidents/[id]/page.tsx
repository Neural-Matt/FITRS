import Link from "next/link";
import { notFound } from "next/navigation";
import { getIncidentRiskAssessment, getNearestWorkingHydrant, getRecommendedUnit } from "@/lib/command-intelligence";
import { ElapsedTime } from "@/components/elapsed-time";
import { IncidentLivePanel } from "@/components/incident-live-panel";
import { PriorityBadge } from "@/components/priority-badge";
import { RecommendedActions } from "@/components/recommended-actions";
import { StatusBadge } from "@/components/status-badge";
import { getHydrants, getIncidentById, getUnits } from "@/lib/incidents";
import { toDisplayType } from "@/lib/zambia";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function IncidentDetailPage({ params }: Props) {
  const [incident, units, hydrants] = await Promise.all([
    getIncidentById(params.id),
    getUnits(),
    getHydrants(),
  ]);

  if (!incident) {
    notFound();
  }

  const nearestHydrant = getNearestWorkingHydrant(
    { latitude: incident.latitude, longitude: incident.longitude },
    hydrants,
  );

  const recommendedUnit = getRecommendedUnit(
    {
      latitude: incident.latitude,
      longitude: incident.longitude,
      type: incident.type,
    },
    units,
  );

  const risk = getIncidentRiskAssessment({
    type: incident.type,
    latitude: incident.latitude,
    longitude: incident.longitude,
  });

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Incident Detail</h2>
        <Link href="/dashboard" className="text-sm text-[color:var(--brand)] hover:underline">
          Back to dashboard
        </Link>
      </div>

      <article className="space-y-4">
        {/* Priority banner for critical incidents */}
        {incident.priority === "critical" && (
          <PriorityBadge priority="critical" showBanner={true} />
        )}

        <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-[4px_4px_16px_rgba(15,23,42,0.06),-2px_-2px_10px_rgba(255,255,255,0.9)]">
          <div className="px-5 py-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">{incident.title}</h3>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={incident.priority as "critical" | "high" | "medium" | "low"} />
                <StatusBadge status={incident.status} className="text-sm" />
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <ElapsedTime createdAt={incident.createdAt} />
              <span className="text-xs text-[color:var(--text-muted)]">
                {incident.createdAt.toLocaleString("en-ZM")}
              </span>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-3 mb-4">
              <p>
                <span className="text-[color:var(--text-muted)]">Type:</span> {toDisplayType(incident.type)}
              </p>
              <p>
                <span className="text-[color:var(--text-muted)]">Latitude:</span> {incident.latitude}
              </p>
              <p>
                <span className="text-[color:var(--text-muted)]">Longitude:</span> {incident.longitude}
              </p>
            </div>

            <p className="text-sm text-[color:var(--text-muted)] mb-4">{incident.description}</p>

            <IncidentLivePanel incidentId={incident.id} initialStatus={incident.status} />

            <div className="border-t border-[color:var(--line)] pt-4 mt-4">
              <p className="mb-3 text-sm font-semibold">Assigned Agencies</p>
              {incident.assignments.length === 0 ? (
                <p className="text-sm text-[color:var(--text-muted)]">No units assigned yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {incident.assignments.map(
                    (assignment: { id: string; unit: { name: string; type: string; status: string } }) => (
                    <li key={assignment.id} className="flex justify-between gap-2">
                      <span>
                        {assignment.unit.name}
                        <span className="ml-2 text-xs uppercase text-[color:var(--text-muted)]">
                          ({assignment.unit.type})
                        </span>
                      </span>
                      <span className="text-[color:var(--text-muted)] uppercase">{assignment.unit.status}</span>
                    </li>
                  ),
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence grid: Recommended unit, Hydrant, Risk */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-sm p-4">
            <p className="mb-1 text-xs uppercase tracking-wide font-semibold text-[color:var(--text-muted)]">
              Recommended Unit
            </p>
            {recommendedUnit ? (
              <>
                <p className="text-base font-semibold text-[color:var(--text-primary)]">
                  {recommendedUnit.unit.name}
                </p>
                <p className="text-xs text-[color:var(--text-muted)]">
                  {recommendedUnit.unit.type} · {recommendedUnit.distanceKm.toFixed(2)} km away
                </p>
              </>
            ) : (
              <p className="text-sm text-[color:var(--text-muted)]">No available unit</p>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-sm p-4">
            <p className="mb-1 text-xs uppercase tracking-wide font-semibold text-[color:var(--text-muted)]">
              Nearest Hydrant & Water Access
            </p>
            {nearestHydrant ? (
              <>
                <p className="text-base font-semibold text-[color:var(--text-primary)]">
                  {nearestHydrant.hydrant.name}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      nearestHydrant.hydrant.status === "working"
                        ? "bg-emerald-500"
                        : nearestHydrant.hydrant.status === "low_pressure"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs text-[color:var(--text-muted)]">
                    {nearestHydrant.distanceKm.toFixed(2)} km ·{" "}
                    {nearestHydrant.hydrant.status === "working"
                      ? "✓ Good"
                      : nearestHydrant.hydrant.status === "low_pressure"
                        ? "⚠ Low pressure"
                        : "✗ Unavailable"}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-red-600 font-semibold">⚠ No working hydrant nearby</p>
            )}
          </div>
        </div>

        {/* Recommended Actions */}
        <RecommendedActions
          incidentType={incident.type}
          priority={incident.priority}
          hasNearestHydrant={!!nearestHydrant}
          hydrantStatus={nearestHydrant?.hydrant.status}
        />

        {/* Risk Score */}
        <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-sm p-4">
          <p className="mb-1 text-xs uppercase tracking-wide font-semibold text-[color:var(--text-muted)]">
            Incident Risk Assessment
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-[color:var(--text-primary)]">
              Risk level: <span className="font-bold">{risk.level}</span>
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all ${
                  risk.score > 75
                    ? "bg-red-500"
                    : risk.score > 45
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${risk.score}%` }}
              />
            </div>
            <p className="text-xs text-[color:var(--text-muted)]">Score: {risk.score}/100</p>
          </div>
        </div>
      </article>
    </section>
  );
}
