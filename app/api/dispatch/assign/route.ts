import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type AssignPayload = {
  incidentId?: string;
  unitId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AssignPayload;
  const incidentId = body.incidentId?.trim() ?? "";
  const unitId = body.unitId?.trim() ?? "";

  if (!incidentId || !unitId) {
    return NextResponse.json({ message: "incidentId and unitId are required." }, { status: 400 });
  }

  const [incident, unit] = await Promise.all([
    prisma.incident.findUnique({ where: { id: incidentId } }),
    prisma.unit.findUnique({ where: { id: unitId } }),
  ]);

  if (!incident || !unit) {
    return NextResponse.json({ message: "Incident or unit not found." }, { status: 404 });
  }

  if (incident.status === "resolved") {
    return NextResponse.json({ message: "Cannot assign to resolved incidents." }, { status: 400 });
  }

  if (unit.status !== "available") {
    return NextResponse.json({ message: "Unit is not available." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.assignment.create({
      data: {
        incidentId,
        unitId,
      },
    }),
    prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: "dispatched",
        dispatchedAt: incident.dispatchedAt ?? new Date(),
      },
    }),
    prisma.unit.update({
      where: { id: unitId },
      data: { status: "busy" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
