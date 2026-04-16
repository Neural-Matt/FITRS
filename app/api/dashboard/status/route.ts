import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [incidents, assignments] = await Promise.all([
    prisma.incident.findMany({ select: { status: true } }),
    prisma.assignment.findMany({
      where: {
        incident: { status: { in: ["dispatched", "enroute", "on_scene"] } },
      },
      include: { unit: { select: { type: true } } },
    }),
  ]);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved").length;
  const unitsDeployed = assignments.length;
  const agencyTypes = assignments.map((a) => a.unit.type);
  const agencies = agencyTypes.filter((t, i) => agencyTypes.indexOf(t) === i);

  return NextResponse.json({
    activeIncidents,
    unitsDeployed,
    agencies: agencies,
    fetchedAt: new Date().toISOString(),
  });
}
