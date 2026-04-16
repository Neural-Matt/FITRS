"use client";

import { useMemo, useState, useTransition } from "react";
import { IncidentCard } from "@/components/incident-card";
import { UnitCard } from "@/components/unit-card";
import { getSuggestedAgencies } from "@/lib/command-intelligence";
import { getDispatchRouteSuggestion } from "@/lib/smart-city";

type Incident = {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
};

type Unit = {
  id: string;
  name: string;
  type: string;
  status: string;
  currentLat: number;
  currentLng: number;
};

type DispatchBoardProps = {
  initialIncidents: Incident[];
  initialUnits: Unit[];
};

export function DispatchBoard({ initialIncidents, initialUnits }: DispatchBoardProps) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [units, setUnits] = useState(initialUnits);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    initialIncidents[0]?.id ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId);
  const groupedUnits = useMemo(() => {
    return {
      fire: units.filter((unit) => unit.type === "fire"),
      police: units.filter((unit) => unit.type === "police"),
      ambulance: units.filter((unit) => unit.type === "ambulance"),
    };
  }, [units]);

  const agencySuggestions = selectedIncident ? getSuggestedAgencies(selectedIncident.type) : [];
  const routeSuggestion = selectedIncident
    ? getDispatchRouteSuggestion(selectedIncident.latitude, selectedIncident.longitude)
    : null;

  const assignUnit = (unitId: string) => {
    if (!selectedIncidentId) {
      setError("Select an incident first.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/dispatch/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incidentId: selectedIncidentId,
          unitId,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "Failed to assign unit.");
        return;
      }

      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === selectedIncidentId ? { ...incident, status: "dispatched" } : incident,
        ),
      );
      setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
    });
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-4">
        <h3 className="mb-3 text-lg font-semibold">Active Incidents</h3>
        <div className="space-y-3">
          {incidents.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No active incidents.</p>
          ) : (
            incidents.map((incident) => (
              <button
                key={incident.id}
                type="button"
                onClick={() => setSelectedIncidentId(incident.id)}
                className={`block w-full rounded-xl text-left transition ${
                  selectedIncidentId === incident.id
                    ? "ring-2 ring-[color:var(--brand)]"
                    : "ring-1 ring-transparent hover:ring-slate-300"
                }`}
              >
                <IncidentCard incident={incident} />
              </button>
            ))
          )}
        </div>
      </div>

      <div className="panel p-4">
        <h3 className="mb-3 text-lg font-semibold">Available Stations</h3>
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {selectedIncident ? (
          <div className="mb-3 rounded-xl border border-[color:var(--line)] bg-slate-50 p-3 text-xs">
            <p className="font-semibold text-[color:var(--text-primary)]">Smart Suggestions</p>
            <p className="mt-1 text-[color:var(--text-muted)]">
              Suggested agencies: {agencySuggestions.length > 0 ? agencySuggestions.join(", ") : "fire"}
            </p>
            {routeSuggestion ? (
              <p className="mt-1 text-[color:var(--text-muted)]">
                Route: <span className="font-semibold text-[color:var(--text-primary)]">{routeSuggestion.title}</span> - {routeSuggestion.message}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="space-y-3">
          {units.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No stations currently available.</p>
          ) : (
            (["fire", "police", "ambulance"] as const).map((type) => {
              const group = groupedUnits[type];
              if (group.length === 0) {
                return null;
              }

              const icon = type === "fire" ? "F" : type === "police" ? "P" : "A";
              const tone = type === "fire" ? "text-red-600" : type === "police" ? "text-blue-600" : "text-emerald-600";

              return (
                <div key={type} className="space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${tone}`}>
                    {icon} {type}
                  </p>
                  {group.map((unit) => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      action={
                        <button
                          type="button"
                          onClick={() => assignUnit(unit.id)}
                          disabled={isPending || !selectedIncidentId}
                          className="crm-btn w-full rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isPending ? "Assigning..." : "Assign Unit"}
                        </button>
                      }
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
