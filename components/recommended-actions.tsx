

type RecommendedActionsProps = {
  incidentType: string;
  priority: string;
  hasNearestHydrant: boolean;
  hydrantStatus?: string;
};

function getRecommendations(
  incidentType: string,
  priority: string,
  hasNearestHydrant: boolean,
): { units: number; ambulance: boolean; hydrant: string }[] {
  const recommendations = [];

  // Critical incidents get max resources
  if (priority === "critical") {
    recommendations.push({
      units: 4,
      ambulance: true,
      hydrant: hasNearestHydrant ? "Deploy nearby hydrant" : "Alert for water shortage",
    });
  }

  // High priority incidents
  if (priority === "high") {
    recommendations.push({
      units: 3,
      ambulance: incidentType === "house_fire" || incidentType === "electrical_fire",
      hydrant: hasNearestHydrant
        ? "Establish primary water source"
        : "Prepare alternative water access",
    });
  }

  // Medium/low priority
  recommendations.push({
    units: 2,
    ambulance: false,
    hydrant: hasNearestHydrant ? "Use nearby hydrant" : "Prepare tanker truck if needed",
  });

  return recommendations;
}

export function RecommendedActions({
  incidentType,
  priority,
  hasNearestHydrant,
  hydrantStatus,
}: RecommendedActionsProps) {
  const recommendations = getRecommendations(incidentType, priority, hasNearestHydrant);
  const primary = recommendations[0];

  return (
    <div className="space-y-3 rounded-xl border-l-4 border-[color:var(--brand)] bg-red-50 p-4">
      <div>
        <h4 className="font-semibold text-[color:var(--text-primary)]">Recommended Actions</h4>
        <p className="text-xs text-[color:var(--text-muted)]">Based on incident type & priority</p>
      </div>

      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2 text-[color:var(--text-primary)]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--brand)] text-xs font-bold text-white">
            1
          </span>
          <span>
            Dispatch <strong>{primary.units} units</strong> to scene
          </span>
        </li>

        {primary.ambulance && (
          <li className="flex items-center gap-2 text-[color:var(--text-primary)]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              2
            </span>
            <span>
              Request <strong>ambulance</strong> — potential casualties
            </span>
          </li>
        )}

        <li className="flex items-center gap-2 text-[color:var(--text-primary)]">
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${
              hydrantStatus === "faulty" ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {primary.ambulance ? "3" : "2"}
          </span>
          <span>{primary.hydrant}</span>
        </li>
      </ul>

      {hydrantStatus === "faulty" && (
        <div className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700">
          ⚠ Limited water access in this area — consider tanker truck
        </div>
      )}
    </div>
  );
}
