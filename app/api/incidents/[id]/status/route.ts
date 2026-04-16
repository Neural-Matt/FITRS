import { NextResponse } from "next/server";
import { INCIDENT_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type StatusPayload = {
  status?: string;
};

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const body = (await request.json()) as StatusPayload;
  const status = body.status?.trim() ?? "";

  if (!INCIDENT_STATUSES.includes(status as (typeof INCIDENT_STATUSES)[number])) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const existing = await prisma.incident.findUnique({
    where: { id: params.id },
    select: {
      dispatchedAt: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ message: "Incident not found." }, { status: 404 });
  }

  await prisma.incident.update({
    where: { id: params.id },
    data: {
      status,
      dispatchedAt:
        status === "dispatched" || status === "enroute" || status === "on_scene" || status === "resolved"
          ? existing.dispatchedAt ?? new Date()
          : existing.dispatchedAt,
      resolvedAt: status === "resolved" ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true });
}
