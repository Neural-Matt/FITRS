import { UnitsManagement } from "@/components/units-management";
import { getUnitsWithAssignments } from "@/lib/incidents";

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
  const units = await getUnitsWithAssignments();

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Stations and Units</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          Resource management dashboard for status control and incident allocations.
        </p>
      </div>

      <UnitsManagement units={units} />
    </section>
  );
}
