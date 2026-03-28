import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import UpgradePlanButton from "@/components/dashboard/UpgradePlanButton";

export default async function BillingPage() {
  const session = await auth();
  const business = await prisma.business.findUnique({
    where: { ownerId: session!.user!.id! },
  });

  if (!business) return null;

  const currentPlan = business.plan;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Manage your subscription plan</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Current Plan</h2>
            <Badge variant={currentPlan === "FREE" ? "default" : "success"}>
              {PLANS[currentPlan].name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            You are currently on the{" "}
            <strong>{PLANS[currentPlan].name}</strong> plan.
          </p>
          {business.stripeCurrentPeriodEnd && (
            <p className="text-sm text-gray-500 mt-1">
              Renews on{" "}
              {business.stripeCurrentPeriodEnd.toLocaleDateString("en-GB")}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrent = currentPlan === planKey;

          return (
            <Card
              key={planKey}
              className={isCurrent ? "border-indigo-300 ring-2 ring-indigo-100" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  {isCurrent && <Badge variant="info">Current</Badge>}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    £{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isCurrent && planKey !== "FREE" && (
                  <UpgradePlanButton plan={planKey} planName={plan.name} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
