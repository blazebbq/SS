import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { hours } = await req.json();

  await prisma.$transaction(
    hours.map((h: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }) =>
      prisma.openingHours.upsert({
        where: {
          businessId_dayOfWeek: {
            businessId: business.id,
            dayOfWeek: h.dayOfWeek,
          },
        },
        update: {
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime,
        },
        create: {
          businessId: business.id,
          dayOfWeek: h.dayOfWeek,
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime,
        },
      })
    )
  );

  const updated = await prisma.openingHours.findMany({
    where: { businessId: business.id },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json(updated);
}
