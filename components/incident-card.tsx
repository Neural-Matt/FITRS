import { StatusBadge } from "@/components/status-badge";

type Incident = {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
};

type IncidentCardProps = {
  incident: Incident;
  action?: React.ReactNode;
};

export function IncidentCard({ incident, action }: IncidentCardProps) {
  return (
    <article className="panel rounded-xl p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{incident.title}</h3>
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
            {incident.type.replace("_", " ")}
          </p>
        </div>
        <StatusBadge status={incident.status} />
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-[color:var(--text-muted)]">{incident.description}</p>
      {action}
    </article>
  );
}
