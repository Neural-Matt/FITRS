"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { UNIT_STATUSES } from "@/lib/constants";
import { StatusBadge } from "@/components/status-badge";

type UnitWithAssignment = {
  id: string;
  name: string;
  type: string;
  status: string;
  currentLat: number;
  currentLng: number;
  assignments: Array<{
    id: string;
    assignedAt: Date;
    incident: {
      id: string;
      title: string;
      status: string;
    };
  }>;
};

type UnitsManagementProps = {
  units: UnitWithAssignment[];
};

export function UnitsManagement({ units }: UnitsManagementProps) {
  const [rows, setRows] = useState(units);
  const [isPending, startTransition] = useTransition();

  const summary = useMemo(() => {
    return {
      total: rows.length,
      available: rows.filter((row) => row.status === "available").length,
      busy: rows.filter((row) => row.status === "busy").length,
      fire: rows.filter((row) => row.type === "fire").length,
      police: rows.filter((row) => row.type === "police").length,
      ambulance: rows.filter((row) => row.type === "ambulance").length,
    };
  }, [rows]);

  const updateStatus = (unitId: string, nextStatus: string) => {
    startTransition(async () => {
      const response = await fetch(`/api/units/${unitId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        return;
      }

      setRows((prev) => prev.map((unit) => (unit.id === unitId ? { ...unit, status: nextStatus } : unit)));
    });
  };

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <article className="panel p-4 transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Total Stations</p>
          <p className="mt-2 text-3xl font-semibold text-[color:var(--brand)]">{summary.total}</p>
        </article>
        <article className="panel p-4 transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Available</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{summary.available}</p>
        </article>
        <article className="panel p-4 transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Busy</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{summary.busy}</p>
        </article>
        <article className="panel p-4 transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Fire Units</p>
          <p className="mt-2 text-3xl font-semibold text-red-600">{summary.fire}</p>
        </article>
        <article className="panel p-4 transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Police Units</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{summary.police}</p>
        </article>
        <article className="panel p-4 transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Ambulance Units</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{summary.ambulance}</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {rows.map((unit) => {
          const assigned = unit.assignments[0]?.incident;

          return (
            <article key={unit.id} className="panel p-4 transition hover:-translate-y-0.5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold">{unit.name}</h3>
                <StatusBadge status={unit.status} />
              </div>

              <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Agency: {unit.type}</p>

              <p className="text-xs text-[color:var(--text-muted)]">
                Lat {unit.currentLat.toFixed(4)} / Lng {unit.currentLng.toFixed(4)}
              </p>

              <p className="mt-3 text-sm">
                <span className="text-[color:var(--text-muted)]">Assigned incident:</span>{" "}
                {assigned ? (
                  <Link href={`/incidents/${assigned.id}`} className="text-[color:var(--brand)] hover:underline">
                    {assigned.title}
                  </Link>
                ) : (
                  "None"
                )}
              </p>

              <div className="mt-4">
                <label className="mb-1 block text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                  Update Status
                </label>
                <select
                  value={unit.status}
                  onChange={(event) => updateStatus(unit.id, event.target.value)}
                  disabled={isPending}
                  className="soft-inset w-full rounded-xl px-3 py-2 text-sm outline-none"
                >
                  {UNIT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          );
        })}
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-[color:var(--line)] px-4 py-3 sm:px-6">
          <h3 className="text-lg font-semibold">Resource Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 sm:px-6">Station</th>
                <th className="px-4 py-3 sm:px-6">Agency</th>
                <th className="px-4 py-3 sm:px-6">Status</th>
                <th className="px-4 py-3 sm:px-6">Location</th>
                <th className="px-4 py-3 sm:px-6">Assigned Incident</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((unit) => {
                const assigned = unit.assignments[0]?.incident;

                return (
                  <tr key={unit.id} className="border-t border-[color:var(--line)]">
                    <td className="px-4 py-3 font-medium sm:px-6">{unit.name}</td>
                    <td className="px-4 py-3 uppercase text-[color:var(--text-muted)] sm:px-6">{unit.type}</td>
                    <td className="px-4 py-3 sm:px-6">
                      <StatusBadge status={unit.status} />
                    </td>
                    <td className="px-4 py-3 text-[color:var(--text-muted)] sm:px-6">
                      {unit.currentLat.toFixed(4)}, {unit.currentLng.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      {assigned ? (
                        <Link href={`/incidents/${assigned.id}`} className="text-[color:var(--brand)] hover:underline">
                          {assigned.title}
                        </Link>
                      ) : (
                        <span className="text-[color:var(--text-muted)]">None</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
