"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const TEMPLATES = [
  { id: 1, name: "Barber", desc: "Dark, bold – perfect for barbershops" },
  { id: 2, name: "Hair Salon", desc: "Clean, feminine – ideal for salons" },
  { id: 3, name: "PT / Fitness", desc: "Energetic – great for personal trainers" },
  { id: 4, name: "Tattoo Studio", desc: "Dark minimal – for tattoo artists" },
  { id: 5, name: "Beauty / Nails", desc: "Soft pastel – for beauty studios" },
  { id: 6, name: "Clinic / Aesthetic", desc: "Clinical clean – for clinics" },
  { id: 7, name: "Tradesperson", desc: "Simple & practical – for tradespeople" },
  { id: 8, name: "Photographer", desc: "Image-heavy – for photographers" },
  { id: 9, name: "Restaurant", desc: "Menu style – for restaurants" },
  { id: 10, name: "Generic Business", desc: "Versatile fallback template" },
];

interface Business {
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  templateId: number;
  slug: string;
}

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    templateId: 1,
  });

  useEffect(() => {
    fetch("/api/business")
      .then((r) => r.json())
      .then((data) => {
        setBusiness(data);
        setForm({
          name: data.name || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          templateId: data.templateId || 1,
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/business", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      setBusiness(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your business profile and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Business Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Business name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Tell customers about your business..."
              />
            </div>
            <Input
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+44 7700 900000"
            />
            <Input
              label="Business email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 High Street, London, UK"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Choose Template</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm({ ...form, templateId: t.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    form.templateId === t.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">
                    {t.id}. {t.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" loading={saving} size="lg">
            {saved ? "Saved!" : "Save Settings"}
          </Button>
          {business?.slug && (
            <a
              href={`/${business.slug}`}
              target="_blank"
              className="text-sm text-indigo-600 hover:underline"
            >
              Preview page →
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
