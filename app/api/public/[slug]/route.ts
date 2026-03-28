import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
      staff: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
      openingHours: { orderBy: { dayOfWeek: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { ownerId, stripeCustomerId, stripeSubscriptionId, stripePriceId, ...publicBusiness } = business;
  void ownerId; void stripeCustomerId; void stripeSubscriptionId; void stripePriceId;

  return NextResponse.json(publicBusiness);
}
