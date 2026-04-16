import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [incidents, assignments] = await Promise.all([
    prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, title: true, status: true, createdAt: true, resolvedAt: true },
    }),
    prisma.assignment.findMany({
      orderBy: { assignedAt: "desc" },
      take: 50,
      include: { unit: { select: { name: true } }, incident: { select: { title: true } } },
    }),
  ]);

  // Merge and sort by timestamp
  const activities: Array<{
    id: string;
    type: string;
    incidentTitle: string;
    unitName?: string;
    timestamp: string;
  }> = [];

  incidents.forEach((i) => {
    activities.push({
      id: `i-${i.id}`,
      type: i.status === "resolved" ? "incident_resolved" : "incident_created",
      incidentTitle: i.title,
      timestamp: (i.resolvedAt ?? i.createdAt).toISOString(),
    });
  });

  assignments.forEach((a) => {
    activities.push({
      id: `a-${a.id}`,
      type: "unit_dispatched",
      incidentTitle: a.incident.title,
      unitName: a.unit.name,
      timestamp: a.assignedAt.toISOString(),
    });
  });

  // Sort by timestamp descending and take top 10
  const sorted = activities.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10);

  return NextResponse.json(sorted);
}
