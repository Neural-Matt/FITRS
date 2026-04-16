import { StatusBadge } from "@/components/status-badge";

type Unit = {
  id: string;
  name: string;
  type: string;
  status: string;
  currentLat: number;
  currentLng: number;
};

type UnitCardProps = {
  unit: Unit;
  action?: React.ReactNode;
};

export function UnitCard({ unit, action }: UnitCardProps) {
  const agencyTone =
    unit.type === "fire"
      ? "text-red-600"
      : unit.type === "police"
        ? "text-blue-600"
        : unit.type === "ambulance"
          ? "text-emerald-600"
          : "text-slate-600";

  return (
    <article className="panel rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{unit.name}</h3>
        <StatusBadge status={unit.status} />
      </div>
      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${agencyTone}`}>Agency: {unit.type}</p>
      <p className="mb-3 text-xs text-[color:var(--text-muted)]">
        Lat {unit.currentLat.toFixed(4)} / Lng {unit.currentLng.toFixed(4)}
      </p>
      {action}
    </article>
  );
}
