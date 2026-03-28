import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const blocked = await prisma.blockedTime.findFirst({
    where: { id, business: { ownerId: session.user.id } },
  });
  if (!blocked) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.blockedTime.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
