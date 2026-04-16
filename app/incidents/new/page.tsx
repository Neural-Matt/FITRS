import { RoleNotice } from "@/components/role-notice";
import { NewIncidentForm } from "@/components/new-incident-form";

export default function NewIncidentPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Rapid Incident Intake</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          Fast incident intake form for Fire Brigade dispatch logging.
        </p>
      </div>

      <RoleNotice allowed={["firefighter", "commander"]} action="create incidents" />
      <NewIncidentForm />
    </section>
  );
}
