import { DispatchBoard } from "@/components/dispatch-board";
import { RoleNotice } from "@/components/role-notice";
import { getActiveIncidents, getAvailableUnits } from "@/lib/incidents";

export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const [incidents, units] = await Promise.all([getActiveIncidents(), getAvailableUnits()]);

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Dispatch Command</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          Assign fire, police, and ambulance units to active incidents from one command-center view.
        </p>
      </div>

      <RoleNotice allowed={["dispatcher", "commander"]} action="assign units" />
      <DispatchBoard initialIncidents={incidents} initialUnits={units} />
    </section>
  );
}
