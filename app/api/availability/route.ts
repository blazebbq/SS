import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");
  const serviceId = searchParams.get("serviceId");
  const staffId = searchParams.get("staffId");
  const dateStr = searchParams.get("date");

  if (!businessId || !serviceId || !staffId || !dateStr) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const slots = await getAvailableSlots({
    businessId,
    serviceId,
    staffId,
    date,
  });

  return NextResponse.json(slots);
}
