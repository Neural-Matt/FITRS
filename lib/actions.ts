"use server";

import { revalidatePath } from "next/cache";
import { INCIDENT_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function updateIncidentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status"));

  if (!id) {
    throw new Error("Invalid incident id.");
  }

  if (!INCIDENT_STATUSES.includes(status as (typeof INCIDENT_STATUSES)[number])) {
    throw new Error("Invalid status value.");
  }

  const existing = await prisma.incident.findUnique({
    where: { id },
    select: { dispatchedAt: true },
  });

  if (!existing) {
    throw new Error("Incident not found.");
  }

  await prisma.incident.update({
    where: { id },
    data: {
      status,
      dispatchedAt:
        status === "dispatched" || status === "enroute" || status === "on_scene" || status === "resolved"
          ? existing.dispatchedAt ?? new Date()
          : existing.dispatchedAt,
      resolvedAt: status === "resolved" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dispatch");
  revalidatePath("/map");
}
