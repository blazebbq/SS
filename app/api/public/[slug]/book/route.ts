import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkSlotAvailability } from "@/lib/availability";
import {
  sendBookingConfirmationToCustomer,
  sendBookingNotificationToOwner,
} from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: { owner: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { serviceId, staffId, startTime, customerName, email, phone, notes } =
    await req.json();

  if (!serviceId || !staffId || !startTime || !customerName || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId: business.id, isActive: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const staff = await prisma.staff.findFirst({
    where: { id: staffId, businessId: business.id, isActive: true },
  });

  if (!staff) {
    return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  }

  const bookingStart = new Date(startTime);
  const bookingEnd = new Date(bookingStart.getTime() + service.duration * 60000);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const isAvailable = await checkSlotAvailability(
        staffId,
        bookingStart,
        bookingEnd
      );

      if (!isAvailable) {
        throw new Error("TIME_SLOT_UNAVAILABLE");
      }

      return tx.booking.create({
        data: {
          businessId: business.id,
          serviceId,
          staffId,
          startTime: bookingStart,
          endTime: bookingEnd,
          customerName,
          email,
          phone,
          notes,
          status: "CONFIRMED",
        },
        include: { service: true, staff: true },
      });
    });

    await Promise.all([
      sendBookingConfirmationToCustomer({
        customerName,
        customerEmail: email,
        businessName: business.name,
        businessEmail: business.email || business.owner.email,
        serviceName: service.name,
        staffName: staff.name,
        startTime: bookingStart,
        endTime: bookingEnd,
      }),
      sendBookingNotificationToOwner({
        customerName,
        customerEmail: email,
        businessName: business.name,
        businessEmail: business.email || business.owner.email,
        serviceName: service.name,
        staffName: staff.name,
        startTime: bookingStart,
        endTime: bookingEnd,
      }),
    ]);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "TIME_SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another time." },
        { status: 409 }
      );
    }
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
