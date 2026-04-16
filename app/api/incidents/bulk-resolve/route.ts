import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type BulkResolvePayload = {
  incidentIds?: string[];
};

export async function PATCH(request: Request) {
  const body = (await request.json()) as BulkResolvePayload;
  const incidentIds = (body.incidentIds ?? []).filter(Boolean);

  if (incidentIds.length === 0) {
    return NextResponse.json({ message: "No incidents selected." }, { status: 400 });
  }

  const incidents = await prisma.incident.findMany({
    where: {
      id: {
        in: incidentIds,
      },
    },
    select: {
      id: true,
      dispatchedAt: true,
    },
  });

  await prisma.$transaction(
    incidents.map((incident) =>
      prisma.incident.update({
        where: { id: incident.id },
        data: {
          status: "resolved",
          dispatchedAt: incident.dispatchedAt ?? new Date(),
          resolvedAt: new Date(),
        },
      }),
    ),
  );

  revalidatePath("/dashboard");
  revalidatePath("/incidents");
  revalidatePath("/dispatch");
  revalidatePath("/map");
  revalidatePath("/analytics");

  return NextResponse.json({ ok: true, updated: incidents.length });
}
