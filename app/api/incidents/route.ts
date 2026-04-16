import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { INCIDENT_STATUSES, INCIDENT_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type IncidentPayload = {
  title?: string;
  type?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as IncidentPayload;

  const title = body.title?.trim() ?? "";
  const type = body.type?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  if (!title || !description) {
    return NextResponse.json({ message: "Title and description are required." }, { status: 400 });
  }

  if (!INCIDENT_TYPES.includes(type as (typeof INCIDENT_TYPES)[number])) {
    return NextResponse.json({ message: "Invalid incident type." }, { status: 400 });
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json({ message: "Latitude and longitude are required." }, { status: 400 });
  }

  const incident = await prisma.incident.create({
    data: {
      title,
      type,
      description,
      latitude,
      longitude,
      status: INCIDENT_STATUSES[0],
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dispatch");
  revalidatePath("/map");

  return NextResponse.json({ id: incident.id }, { status: 201 });
}
