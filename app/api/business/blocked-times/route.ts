import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

  const blockedTimes = await prisma.blockedTime.findMany({
    where: { businessId: business.id },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(blockedTimes);
}

export async function POST(req: NextRequest) {
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

  const { startTime, endTime, reason, staffId } = await req.json();

  const blocked = await prisma.blockedTime.create({
    data: {
      businessId: business.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      reason,
      staffId,
    },
  });

  return NextResponse.json(blocked);
}
