"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatDuration, formatPrice, formatTime } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: string;
  description: string | null;
}

interface StaffMember {
  id: string;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface BookingWidgetProps {
  businessId: string;
  businessSlug: string;
  services: Service[];
  staff: StaffMember[];

}

type BookingStep = "service" | "staff" | "datetime" | "details" | "confirmation";

export default function BookingWidget({
  businessId,
  businessSlug,
  services,
  staff,
}: BookingWidgetProps) {
  const [step, setStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const loadSlots = async (date: string, staffId: string, serviceId: string) => {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);

    const res = await fetch(
      `/api/availability?businessId=${businessId}&serviceId=${serviceId}&staffId=${staffId}&date=${date}`
    );
    const data = await res.json();
    setSlots(data);
    setLoadingSlots(false);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (selectedStaff && selectedService) {
      loadSlots(date, selectedStaff.id, selectedService.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedStaff || !selectedSlot) return;

    setBooking(true);
    setBookingError("");

    const res = await fetch(`/api/public/${businessSlug}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        startTime: selectedSlot.startTime,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
      }),
    });

    if (res.ok) {
      setBookingComplete(true);
      setStep("confirmation");
    } else {
      const data = await res.json();
      setBookingError(data.error || "Booking failed. Please try again.");
    }
    setBooking(false);
  };

  if (bookingComplete) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h3>
        <p className="text-gray-600 mb-2">
          We&apos;ve sent a confirmation email to{" "}
          <strong>{form.email}</strong>
        </p>
        <p className="text-gray-500 text-sm mb-6">
          {selectedService?.name} with {selectedStaff?.name}
          <br />
          {selectedDate} at{" "}
          {selectedSlot && formatTime(new Date(selectedSlot.startTime))}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setBookingComplete(false);
            setStep("service");
            setSelectedService(null);
            setSelectedStaff(null);
            setSelectedDate("");
            setSelectedSlot(null);
            setForm({ customerName: "", email: "", phone: "", notes: "" });
          }}
        >
          Book Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2 text-sm">
        {(["service", "staff", "datetime", "details"] as BookingStep[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s
                    ? "bg-indigo-600 text-white"
                    : ["service", "staff", "datetime", "details"].indexOf(step) >
                      i
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {["service", "staff", "datetime", "details"].indexOf(step) > i
                  ? "✓"
                  : i + 1}
              </span>
              <span className="hidden sm:block text-gray-500 capitalize">
                {s === "datetime" ? "Date & Time" : s}
              </span>
              {i < 3 && <span className="text-gray-300">›</span>}
            </div>
          )
        )}
      </div>

      {/* Step 1: Service */}
      {step === "service" && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Choose a Service</h3>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setStep("staff");
              }}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 text-left transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-indigo-600">
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {service.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">
                    {formatDuration(service.duration)}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice(service.price)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Staff */}
      {step === "staff" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep("service")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h3 className="font-semibold text-gray-900">Choose a Team Member</h3>
          </div>
          {staff.map((member) => (
            <button
              key={member.id}
              onClick={() => {
                setSelectedStaff(member);
                setStep("datetime");
              }}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium text-gray-900 group-hover:text-indigo-600">
                  {member.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === "datetime" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep("staff")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h3 className="font-semibold text-gray-900">Pick a Date & Time</h3>
          </div>

          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          {loadingSlots && (
            <p className="text-sm text-gray-500 text-center py-4">
              Loading available times...
            </p>
          )}

          {!loadingSlots && selectedDate && slots.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No available slots on this day. Please try another date.
            </p>
          )}

          {slots.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">Available slots:</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots
                  .filter((s) => s.available)
                  .map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep("details");
                      }}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {formatTime(new Date(slot.startTime))}
                    </button>
                  ))}
              </div>
              {slots.filter((s) => s.available).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  All slots are booked for this day.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Details */}
      {step === "details" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep("datetime")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h3 className="font-semibold text-gray-900">Your Details</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <p>
              <strong>Service:</strong> {selectedService?.name}
            </p>
            <p>
              <strong>With:</strong> {selectedStaff?.name}
            </p>
            <p>
              <strong>Date:</strong> {selectedDate}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {selectedSlot && formatTime(new Date(selectedSlot.startTime))}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {selectedService && formatPrice(selectedService.price)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name *
              </label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="+44 7700 900000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Anything we should know?"
              />
            </div>

            {bookingError && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {bookingError}
              </div>
            )}

            <Button type="submit" className="w-full" loading={booking} size="lg">
              Confirm Booking
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
