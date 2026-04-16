import { INCIDENT_STATUSES } from "@/lib/constants";
import { updateIncidentStatus } from "@/lib/actions";

type DispatchIncident = {
  id: string;
  title: string;
  type: string;
  status: string;
};

export function DispatchTable({ incidents }: { incidents: DispatchIncident[] }) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-[color:var(--line)] px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold">Dispatch Queue</h2>
      </div>
      <div className="space-y-3 p-4 sm:p-6">
        {incidents.length === 0 ? (
          <p className="text-sm text-[color:var(--text-muted)]">No incidents waiting for dispatch.</p>
        ) : (
          incidents.map((incident) => (
            <article
              key={incident.id}
              className="panel rounded-xl p-4"
            >
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold">{incident.title}</h3>
                  <p className="text-sm text-[color:var(--text-muted)] uppercase">
                    {incident.type.replace("_", " ")}
                  </p>
                </div>
                <span className="text-xs uppercase text-[color:var(--brand)]">
                  Current: {incident.status.replace("_", " ")}
                </span>
              </div>
              <form action={updateIncidentStatus} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input type="hidden" name="id" value={incident.id} />
                <select
                  name="status"
                  defaultValue={incident.status}
                  className="soft-inset rounded-lg px-3 py-2 text-sm"
                >
                  {INCIDENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="crm-btn rounded-lg px-4 py-2 text-sm font-medium transition"
                >
                  Update Status
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
