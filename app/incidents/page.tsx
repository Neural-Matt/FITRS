import Link from "next/link";
import { IncidentsManagementTable } from "@/components/incidents-management-table";
import { getIncidents } from "@/lib/incidents";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Incidents</h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            Full Fire Brigade incident register across active and historical records.
          </p>
        </div>
        <Link href="/incidents/new" className="crm-btn rounded-xl px-4 py-2 text-sm font-semibold">
          Log New Incident
        </Link>
      </div>

      <IncidentsManagementTable incidents={incidents} />
    </section>
  );
}
