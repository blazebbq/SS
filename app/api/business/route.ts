import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: {
      services: { orderBy: { createdAt: "asc" } },
      staff: { orderBy: { createdAt: "asc" } },
      openingHours: { orderBy: { dayOfWeek: "asc" } },
      blockedTimes: { orderBy: { startTime: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  return NextResponse.json(business);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { name, description, phone, email, address, templateId } = data;

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) {
    updateData.name = name;
    const newSlug = slugify(name);
    const existing = await prisma.business.findFirst({
      where: { slug: newSlug, id: { not: business.id } },
    });
    updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
  }
  if (description !== undefined) updateData.description = description;
  if (phone !== undefined) updateData.phone = phone;
  if (email !== undefined) updateData.email = email;
  if (address !== undefined) updateData.address = address;
  if (templateId !== undefined) updateData.templateId = templateId;

  const updated = await prisma.business.update({
    where: { id: business.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
