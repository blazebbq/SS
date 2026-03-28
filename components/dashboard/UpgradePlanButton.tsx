"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface UpgradePlanButtonProps {
  plan: string;
  planName: string;
}

export default function UpgradePlanButton({ plan, planName }: UpgradePlanButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" loading={loading} onClick={handleUpgrade}>
      Upgrade to {planName}
    </Button>
  );
}
