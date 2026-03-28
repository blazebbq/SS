"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { DAYS_OF_WEEK } from "@/lib/utils";

interface OpeningHour {
  id: string;
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const defaultHours = DAYS_OF_WEEK.map((_, i) => ({
  dayOfWeek: i,
  isOpen: i >= 1 && i <= 5,
  openTime: "09:00",
  closeTime: "17:00",
}));

export default function HoursPage() {
  const [hours, setHours] = useState(defaultHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/business")
      .then((r) => r.json())
      .then((data) => {
        if (data.openingHours && data.openingHours.length > 0) {
          setHours(
            DAYS_OF_WEEK.map((_, i) => {
              const existing = data.openingHours.find(
                (h: OpeningHour) => h.dayOfWeek === i
              );
              return existing || defaultHours[i];
            })
          );
        }
        setLoading(false);
      });
  }, []);

  const updateHour = (
    dayOfWeek: number,
    field: string,
    value: string | boolean
  ) => {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/business/hours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opening Hours</h1>
          <p className="text-gray-500 mt-1">
            Set your business hours for each day of the week
          </p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          {saved ? "Saved!" : "Save Hours"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-4 text-sm font-medium text-gray-500">
            <span>Day</span>
            <span>Status</span>
            <span>Open</span>
            <span>Close</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {hours.map((hour) => (
              <div
                key={hour.dayOfWeek}
                className="px-6 py-4 grid grid-cols-4 items-center gap-4"
              >
                <span className="font-medium text-gray-900">
                  {DAYS_OF_WEEK[hour.dayOfWeek]}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={hour.isOpen}
                      onChange={(e) =>
                        updateHour(hour.dayOfWeek, "isOpen", e.target.checked)
                      }
                    />
                    <div
                      className={`w-10 h-5 rounded-full transition-colors ${
                        hour.isOpen ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        hour.isOpen ? "translate-x-5 left-0.5" : "left-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {hour.isOpen ? "Open" : "Closed"}
                  </span>
                </label>
                <input
                  type="time"
                  value={hour.openTime}
                  onChange={(e) =>
                    updateHour(hour.dayOfWeek, "openTime", e.target.value)
                  }
                  disabled={!hour.isOpen}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
                />
                <input
                  type="time"
                  value={hour.closeTime}
                  onChange={(e) =>
                    updateHour(hour.dayOfWeek, "closeTime", e.target.value)
                  }
                  disabled={!hour.isOpen}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
