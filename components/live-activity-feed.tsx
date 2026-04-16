"use client";

import { useCallback, useEffect, useState } from "react";

type Activity = {
  id: string;
  type: "incident_created" | "unit_dispatched" | "incident_resolved";
  incidentTitle: string;
  unitName?: string;
  timestamp: string;
};

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/activities");
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    const id = setInterval(fetchActivities, 5000);
    return () => clearInterval(id);
  }, [fetchActivities]);

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "incident_created":
        return "🚨";
      case "unit_dispatched":
        return "🚗";
      case "incident_resolved":
        return "✅";
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "incident_created":
        return `New incident: ${activity.incidentTitle}`;
      case "unit_dispatched":
        return `${activity.unitName} dispatched to ${activity.incidentTitle}`;
      case "incident_resolved":
        return `Incident resolved: ${activity.incidentTitle}`;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "incident_created":
        return "border-l-red-500 bg-red-50";
      case "unit_dispatched":
        return "border-l-blue-500 bg-blue-50";
      case "incident_resolved":
        return "border-l-emerald-500 bg-emerald-50";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--line)] bg-slate-50 p-4 text-center text-sm text-[color:var(--text-muted)]">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`flex items-start gap-3 border-l-2 p-3 ${getActivityColor(activity.type)}`}
        >
          <span className="mt-0.5 text-lg">{getActivityIcon(activity.type)}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[color:var(--text-primary)]">
              {getActivityText(activity)}
            </p>
            <p className="text-xs text-[color:var(--text-muted)]">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
