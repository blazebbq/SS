"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string | null;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  service: { name: string; price: string };
  staff: { name: string };
}

const statusColors: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "info",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFilter) params.set("date", dateFilter);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/bookings?${params}`);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [dateFilter, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchBookings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">View and manage all your bookings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {(dateFilter || statusFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFilter("");
                  setStatusFilter("");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No bookings found.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {booking.customerName}
                        </p>
                        <Badge variant={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{booking.email}</p>
                      {booking.phone && (
                        <p className="text-sm text-gray-500">{booking.phone}</p>
                      )}
                      <p className="text-sm text-gray-700">
                        <strong>{booking.service.name}</strong> with{" "}
                        {booking.staff.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(new Date(booking.startTime))} ·{" "}
                        {formatTime(new Date(booking.startTime))} –{" "}
                        {formatTime(new Date(booking.endTime))}
                      </p>
                      {booking.notes && (
                        <p className="text-sm text-gray-400 italic">
                          &ldquo;{booking.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(booking.service.price)}
                      </span>
                      <div className="flex gap-2">
                        {booking.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatus(booking.id, "CONFIRMED")
                            }
                          >
                            Confirm
                          </Button>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              updateStatus(booking.id, "COMPLETED")
                            }
                          >
                            Complete
                          </Button>
                        )}
                        {["PENDING", "CONFIRMED"].includes(booking.status) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              updateStatus(booking.id, "CANCELLED")
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
