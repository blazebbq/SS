import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { businessId: business.id };

  if (dateStr) {
    const date = new Date(dateStr);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    where.startTime = { gte: date, lt: nextDay };
  }

  if (status) {
    where.status = status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      service: true,
      staff: true,
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(bookings);
}
