"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { INCIDENT_STATUSES, INCIDENT_TYPES } from "@/lib/constants";
import { getIncidentArea, toDisplayType } from "@/lib/zambia";
import { StatusBadge } from "@/components/status-badge";

type IncidentRecord = {
  id: string;
  title: string;
  type: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
};

type IncidentsManagementTableProps = {
  incidents: IncidentRecord[];
};

export function IncidentsManagementTable({ incidents }: IncidentsManagementTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const locationOptions = useMemo(() => {
    return Array.from(new Set(incidents.map((incident) => getIncidentArea(incident)))).sort();
  }, [incidents]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return incidents.filter((incident) => {
      const area = getIncidentArea(incident);
      const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
      const matchesType = typeFilter === "all" || incident.type === typeFilter;
      const matchesLocation = locationFilter === "all" || area === locationFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        incident.title.toLowerCase().includes(normalizedQuery) ||
        area.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesType && matchesLocation && matchesQuery;
    });
  }, [incidents, query, statusFilter, typeFilter, locationFilter]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((incident) => selectedIds.includes(incident.id));

  const toggleOne = (incidentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(incidentId) ? prev.filter((id) => id !== incidentId) : [...prev, incidentId],
    );
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(filtered.map((incident) => incident.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...filtered.map((incident) => incident.id)])));
  };

  const bulkResolve = () => {
    if (selectedIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/incidents/bulk-resolve", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ incidentIds: selectedIds }),
      });

      if (!response.ok) {
        return;
      }

      setSelectedIds([]);
      router.refresh();
    });
  };

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-[color:var(--line)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Incident Registry</h3>
            <p className="text-sm text-[color:var(--text-muted)]">
              CRM-style operations table with filtering, search, and bulk updates.
            </p>
          </div>
          <button
            type="button"
            onClick={bulkResolve}
            disabled={selectedIds.length === 0 || isPending}
            className="crm-btn rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Updating..." : `Mark Selected as Resolved (${selectedIds.length})`}
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or area"
            className="soft-inset rounded-xl px-3 py-2 text-sm outline-none"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="soft-inset rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="all">All Statuses</option>
            {INCIDENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="soft-inset rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="all">All Types</option>
            {INCIDENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {toDisplayType(type)}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="soft-inset rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="all">All Locations</option>
            {locationOptions.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  aria-label="Select all visible incidents"
                />
              </th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[color:var(--text-muted)]">
                  No incidents match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((incident) => {
                const area = getIncidentArea(incident);
                const isSelected = selectedIds.includes(incident.id);

                return (
                  <tr
                    key={incident.id}
                    className="cursor-pointer border-t border-[color:var(--line)] transition hover:bg-slate-50"
                    onClick={() => router.push(`/incidents/${incident.id}`)}
                  >
                    <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(incident.id)}
                        aria-label={`Select ${incident.title}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-[color:var(--brand)]">{incident.title}</td>
                    <td className="px-4 py-3 uppercase">{toDisplayType(incident.type)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-4 py-3">{area}</td>
                    <td className="px-4 py-3 text-[color:var(--text-muted)]">
                      {new Date(incident.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
