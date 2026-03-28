import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const business = await prisma.business.findUnique({
    where: { ownerId: session!.user!.id! },
    include: {
      services: { where: { isActive: true } },
      staff: { where: { isActive: true } },
      bookings: {
        where: {
          startTime: { gte: new Date() },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        include: { service: true, staff: true },
        orderBy: { startTime: "asc" },
        take: 5,
      },
    },
  });

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No business found. Please contact support.</p>
      </div>
    );
  }

  const statusColors: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
    PENDING: "warning",
    CONFIRMED: "success",
    CANCELLED: "danger",
    COMPLETED: "info",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your business{" "}
          <Link
            href={`/${business.slug}`}
            target="_blank"
            className="text-indigo-600 hover:underline"
          >
            {business.name}
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900">
              {business.services.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Active Services</div>
            <Link
              href="/dashboard/services"
              className="text-xs text-indigo-600 hover:underline mt-2 block"
            >
              Manage →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900">
              {business.staff.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Staff Members</div>
            <Link
              href="/dashboard/staff"
              className="text-xs text-indigo-600 hover:underline mt-2 block"
            >
              Manage →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900">
              {business.bookings.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">Upcoming Bookings</div>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-indigo-600 hover:underline mt-2 block"
            >
              View all →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Upcoming Bookings</h2>
            <Link
              href="/dashboard/bookings"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {business.bookings.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              No upcoming bookings yet.
              <br />
              <Link
                href={`/${business.slug}`}
                target="_blank"
                className="text-indigo-600 hover:underline text-sm mt-2 block"
              >
                Share your business page to get started
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {business.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.service.name} with {booking.staff.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDate(booking.startTime)} at{" "}
                      {formatTime(booking.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">
                      {formatPrice(booking.service.price.toString())}
                    </span>
                    <Badge variant={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-indigo-900">Your Public Page</h3>
        <p className="text-sm text-indigo-700 mt-1">
          Share this link with your customers:
        </p>
        <div className="flex items-center gap-3 mt-3">
          <code className="bg-white px-4 py-2 rounded-lg text-sm border border-indigo-200 flex-1 text-indigo-800">
            {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/
            {business.slug}
          </code>
          <Link
            href={`/${business.slug}`}
            target="_blank"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View Page
          </Link>
        </div>
      </div>
    </div>
  );
}
