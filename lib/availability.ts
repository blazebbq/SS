import { prisma } from "@/lib/prisma";

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

interface GetAvailabilityParams {
  businessId: string;
  serviceId: string;
  staffId: string;
  date: Date;
}

export async function getAvailableSlots({
  businessId,
  serviceId,
  staffId,
  date,
}: GetAvailabilityParams): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay();

  const [service, openingHours, existingBookings, blockedTimes] =
    await Promise.all([
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.openingHours.findUnique({
        where: { businessId_dayOfWeek: { businessId, dayOfWeek } },
      }),
      prisma.booking.findMany({
        where: {
          staffId,
          status: { in: ["PENDING", "CONFIRMED"] },
          startTime: {
            gte: new Date(date.toDateString()),
            lt: new Date(new Date(date.toDateString()).getTime() + 86400000),
          },
        },
      }),
      prisma.blockedTime.findMany({
        where: {
          businessId,
          OR: [{ staffId }, { staffId: null }],
          startTime: {
            gte: new Date(date.toDateString()),
            lt: new Date(new Date(date.toDateString()).getTime() + 86400000),
          },
        },
      }),
    ]);

  if (!service || !openingHours || !openingHours.isOpen) return [];

  const [openHour, openMin] = openingHours.openTime.split(":").map(Number);
  const [closeHour, closeMin] = openingHours.closeTime.split(":").map(Number);

  const dayStart = new Date(date);
  dayStart.setHours(openHour, openMin, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(closeHour, closeMin, 0, 0);

  const slots: TimeSlot[] = [];
  const slotInterval = 30; // minutes
  const serviceDuration = service.duration;

  let current = new Date(dayStart);

  while (current.getTime() + serviceDuration * 60000 <= dayEnd.getTime()) {
    const slotEnd = new Date(current.getTime() + serviceDuration * 60000);

    const isBooked = existingBookings.some(
      (b) =>
        (current >= b.startTime && current < b.endTime) ||
        (slotEnd > b.startTime && slotEnd <= b.endTime) ||
        (current <= b.startTime && slotEnd >= b.endTime)
    );

    const isBlocked = blockedTimes.some(
      (bt) =>
        (current >= bt.startTime && current < bt.endTime) ||
        (slotEnd > bt.startTime && slotEnd <= bt.endTime) ||
        (current <= bt.startTime && slotEnd >= bt.endTime)
    );

    const isPast = current <= new Date();

    slots.push({
      startTime: new Date(current),
      endTime: slotEnd,
      available: !isBooked && !isBlocked && !isPast,
    });

    current = new Date(current.getTime() + slotInterval * 60000);
  }

  return slots;
}

export async function checkSlotAvailability(
  staffId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const conflict = await prisma.booking.findFirst({
    where: {
      staffId,
      status: { in: ["PENDING", "CONFIRMED"] },
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      OR: [
        { startTime: { gte: startTime, lt: endTime } },
        { endTime: { gt: startTime, lte: endTime } },
        { startTime: { lte: startTime }, endTime: { gte: endTime } },
      ],
    },
  });

  return !conflict;
}
