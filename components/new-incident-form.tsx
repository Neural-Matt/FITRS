"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { INCIDENT_TYPES } from "@/lib/constants";

type FormState = {
  title: string;
  type: string;
  description: string;
  latitude: string;
  longitude: string;
};

const initialState: FormState = {
  title: "",
  type: "market_fire",
  description: "",
  latitude: "",
  longitude: "",
};

export function NewIncidentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialState);

  const fillLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) {
        setError("Geolocation is not supported in this browser.");
      }
      return;
    }

    if (!silent) {
      setError(null);
    }
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
        setIsLocating(false);
      },
      () => {
        if (!silent) {
          setError("Unable to read location. Enter coordinates manually.");
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    fillLocation(true);
    // Intentionally run once for initial auto-fill.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setError(data.message ?? "Failed to submit incident.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="panel space-y-3 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          required
          autoFocus
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Incident title"
          className="soft-inset h-12 rounded-xl px-3 text-base outline-none focus:border-red-300"
        />
        <select
          value={form.type}
          onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
          className="soft-inset h-12 rounded-xl px-3 text-sm uppercase outline-none focus:border-red-300"
        >
          {INCIDENT_TYPES.map((incidentType) => (
            <option key={incidentType} value={incidentType}>
              {incidentType.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <textarea
        required
        rows={3}
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="Brief field notes for dispatch station"
        className="soft-inset w-full rounded-xl px-3 py-2 outline-none focus:border-red-300"
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          required
          type="number"
          step="any"
          value={form.latitude}
          onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))}
          placeholder="Latitude"
          className="soft-inset h-12 rounded-xl px-3 outline-none focus:border-red-300"
        />
        <input
          required
          type="number"
          step="any"
          value={form.longitude}
          onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))}
          placeholder="Longitude"
          className="soft-inset h-12 rounded-xl px-3 outline-none focus:border-red-300"
        />
        <button
          type="button"
          onClick={() => fillLocation(false)}
          disabled={isLocating || isPending}
          className="crm-btn-secondary h-12 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLocating ? "Locating..." : "Use GPS"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending || isLocating}
        className="crm-btn h-12 w-full rounded-xl text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Submitting..." : "Submit Incident"}
      </button>
    </form>
  );
}
