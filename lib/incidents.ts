import { INCIDENT_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getIncidentArea } from "@/lib/zambia";

export async function getIncidents() {
  return prisma.incident.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUnits() {
  return prisma.unit.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getHydrants() {
  return prisma.hydrant.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getUnitsWithAssignments() {
  return prisma.unit.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      assignments: {
        include: {
          incident: true,
        },
        orderBy: {
          assignedAt: "desc",
        },
      },
    },
  });
}

export async function getActiveIncidents() {
  return prisma.incident.findMany({
    where: {
      status: {
        not: "resolved",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAvailableUnits() {
  return prisma.unit.findMany({
    where: {
      status: "available",
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getIncidentStats() {
  const incidents = await prisma.incident.findMany({
    select: {
      status: true,
    },
  });

  const stats = {
    total: incidents.length,
    active: incidents.filter((incident) => incident.status !== "resolved")
      .length,
    resolved: incidents.filter((incident) => incident.status === "resolved").length,
  };

  // Keep a lightweight runtime sanity check for future status additions.
  incidents.forEach((incident) => {
    if (!INCIDENT_STATUSES.includes(incident.status as (typeof INCIDENT_STATUSES)[number])) {
      throw new Error(`Unexpected incident status: ${incident.status}`);
    }
  });

  return stats;
}

export async function getIncidentById(id: string) {
  return prisma.incident.findUnique({
    where: { id },
    include: {
      assignments: {
        include: {
          unit: true,
        },
      },
    },
  });
}

function minutesBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / (1000 * 60);
}

export async function getResponseTimeAnalytics() {
  const incidents = await prisma.incident.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const dispatchDurations = incidents
    .filter((incident) => incident.dispatchedAt)
    .map((incident) => minutesBetween(incident.createdAt, incident.dispatchedAt as Date));

  const resolveDurations = incidents
    .filter((incident) => incident.dispatchedAt && incident.resolvedAt)
    .map((incident) => minutesBetween(incident.dispatchedAt as Date, incident.resolvedAt as Date));

  const averageDispatchMinutes =
    dispatchDurations.length > 0
      ? dispatchDurations.reduce((sum, value) => sum + value, 0) / dispatchDurations.length
      : 0;

  const averageResolutionMinutes =
    resolveDurations.length > 0
      ? resolveDurations.reduce((sum, value) => sum + value, 0) / resolveDurations.length
      : 0;

  const points = incidents.map((incident) => ({
    name: incident.title.length > 14 ? `${incident.title.slice(0, 14)}...` : incident.title,
    createdAt: incident.createdAt.toISOString(),
    dispatchMinutes: incident.dispatchedAt
      ? Math.max(0, Number(minutesBetween(incident.createdAt, incident.dispatchedAt).toFixed(1)))
      : 0,
    resolveMinutes:
      incident.dispatchedAt && incident.resolvedAt
        ? Math.max(0, Number(minutesBetween(incident.dispatchedAt, incident.resolvedAt).toFixed(1)))
        : 0,
  }));

  return {
    averageDispatchMinutes,
    averageResolutionMinutes,
    points,
  };
}

export async function getAnalyticsSnapshot() {
  const incidents = await getIncidents();

  const areaCounts = new Map<string, number>();
  const typeCounts = new Map<string, number>();

  incidents.forEach((incident) => {
    const area = getIncidentArea(incident);
    areaCounts.set(area, (areaCounts.get(area) ?? 0) + 1);
    typeCounts.set(incident.type, (typeCounts.get(incident.type) ?? 0) + 1);
  });

  const heatmap = incidents.map((incident) => ({
    x: Number(incident.longitude.toFixed(4)),
    y: Number(incident.latitude.toFixed(4)),
    area: getIncidentArea(incident),
    title: incident.title,
    status: incident.status,
  }));

  const typeDistribution = Array.from(typeCounts.entries()).map(([type, count]) => ({
    type,
    count,
  }));

  const topAreas = Array.from(areaCounts.entries())
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    heatmap,
    typeDistribution,
    topAreas,
  };
}
