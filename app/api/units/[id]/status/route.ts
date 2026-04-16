import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { UNIT_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type UnitStatusPayload = {
  status?: string;
};

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const body = (await request.json()) as UnitStatusPayload;
  const status = body.status?.trim() ?? "";

  if (!UNIT_STATUSES.includes(status as (typeof UNIT_STATUSES)[number])) {
    return NextResponse.json({ message: "Invalid unit status." }, { status: 400 });
  }

  const existing = await prisma.unit.findUnique({ where: { id: params.id } });

  if (!existing) {
    return NextResponse.json({ message: "Unit not found." }, { status: 404 });
  }

  await prisma.unit.update({
    where: { id: params.id },
    data: {
      status,
    },
  });

  revalidatePath("/units");
  revalidatePath("/dispatch");
  revalidatePath("/map");

  return NextResponse.json({ ok: true });
}
