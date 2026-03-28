"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDuration } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "60",
    price: "0",
  });

  const fetchServices = async () => {
    const res = await fetch("/api/business");
    const data = await res.json();
    setServices(data.services || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editingId
      ? `/api/business/services/${editingId}`
      : "/api/business/services";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await fetchServices();
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", description: "", duration: "60", price: "0" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/business/services/${id}`, { method: "DELETE" });
    await fetchServices();
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || "",
      duration: String(service.duration),
      price: service.price,
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1">
            Manage the services you offer to customers
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({ name: "", description: "", duration: "60", price: "0" });
          }}
        >
          {showForm ? "Cancel" : "+ Add Service"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">
              {editingId ? "Edit Service" : "New Service"}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Service name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Haircut & Blow Dry"
                required
              />
              <Input
                label="Description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  type="number"
                  min="5"
                  step="5"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  required
                />
                <Input
                  label="Price (£)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={saving}>
                  {editingId ? "Save Changes" : "Add Service"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {services.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No services yet. Add your first service to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      {!service.isActive && (
                        <Badge variant="warning">Inactive</Badge>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-500">{service.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-400">
                        {formatDuration(service.duration)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
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
