import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "1 business page",
      "Up to 50 bookings/month",
      "3 services",
      "2 staff members",
      "Basic templates",
    ],
    limits: {
      bookings: 50,
      services: 3,
      staff: 2,
    },
  },
  PRO: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "1 business page",
      "Unlimited bookings",
      "Unlimited services",
      "Unlimited staff",
      "All templates",
      "Email notifications",
      "Custom domain",
    ],
    limits: {
      bookings: Infinity,
      services: Infinity,
      staff: Infinity,
    },
  },
  BUSINESS: {
    name: "Business",
    price: 49,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      "Everything in Pro",
      "Priority support",
      "Analytics dashboard",
      "Remove PageNest branding",
      "API access",
    ],
    limits: {
      bookings: Infinity,
      services: Infinity,
      staff: Infinity,
    },
  },
};
