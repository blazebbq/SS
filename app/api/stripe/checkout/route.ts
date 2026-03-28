import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();
  const planKey = plan as "PRO" | "BUSINESS";

  if (!PLANS[planKey] || !PLANS[planKey].priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: { owner: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  let customerId = business.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: business.owner.email,
      name: business.owner.name || business.name,
      metadata: { businessId: business.id, userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.business.update({
      where: { id: business.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PLANS[planKey].priceId!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    metadata: { businessId: business.id, plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
