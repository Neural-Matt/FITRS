"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { StatusBadge } from "@/components/status-badge";
import { useSystemPreferences } from "@/components/system-preferences-provider";

type IncidentLivePanelProps = {
  incidentId: string;
  initialStatus: string;
};

const quickActions = ["enroute", "on_scene", "resolved"] as const;

export function IncidentLivePanel({ incidentId, initialStatus }: IncidentLivePanelProps) {
  const router = useRouter();
  const { autoRefresh } = useSystemPreferences();
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(timer);
  }, [autoRefresh, router]);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const updateStatus = (nextStatus: (typeof quickActions)[number]) => {
    const previous = status;
    setStatus(nextStatus);

    startTransition(async () => {
      const response = await fetch(`/api/incidents/${incidentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        setStatus(previous);
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="soft-inset space-y-3 rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Live Status Controls</p>
        <StatusBadge status={status} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {quickActions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => updateStatus(action)}
            disabled={isPending}
            className="crm-btn-secondary rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            Mark {action.replace("_", " ")}
          </button>
        ))}
      </div>
      <p className="text-xs text-[color:var(--text-muted)]">
        {autoRefresh ? "Auto-refresh every 5 seconds." : "Auto-refresh is disabled in settings."}
      </p>
    </div>
  );
}
