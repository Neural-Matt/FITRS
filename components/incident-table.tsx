import Link from "next/link";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { getIncidentArea, toDisplayType } from "@/lib/zambia";

type IncidentRow = {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
};

export function IncidentTable({ incidents }: { incidents: IncidentRow[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-[4px_4px_16px_rgba(15,23,42,0.06),-2px_-2px_10px_rgba(255,255,255,0.9)]">
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-[color:var(--text-primary)]">
            Incident Feed
          </h2>
          <p className="text-[11px] text-[color:var(--text-muted)]">Lusaka &amp; region — Zambia Fire Brigade</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {incidents.length} logged
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 sm:px-6">Incident</th>
              <th className="px-4 py-3 sm:px-6">Priority</th>
              <th className="px-4 py-3 sm:px-6">Type</th>
              <th className="px-4 py-3 sm:px-6">Location</th>
              <th className="px-4 py-3 sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-[color:var(--text-muted)] sm:px-6"
                  colSpan={5}
                >
                  No incidents logged. Report one from the Fire Brigade operations centre.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="border-t border-[color:var(--line)] transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium sm:px-6">
                    <Link
                      className="text-[color:var(--brand)] hover:underline"
                      href={`/incidents/${incident.id}`}
                    >
                      {incident.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <PriorityBadge priority={incident.priority as "critical" | "high" | "medium" | "low"} />
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <span className="capitalize text-[color:var(--text-muted)]">
                      {toDisplayType(incident.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)]">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[2]">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {getIncidentArea(incident)}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <StatusBadge status={incident.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
