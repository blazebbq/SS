import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, businessName } = await req.json();

    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let slug = slugify(businessName);
    const existingSlug = await prisma.business.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        business: {
          create: {
            name: businessName,
            slug,
            email,
            templateId: 1,
            openingHours: {
              createMany: {
                data: [
                  { dayOfWeek: 0, isOpen: false, openTime: "09:00", closeTime: "17:00" },
                  { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "17:00" },
                  { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "17:00" },
                  { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "17:00" },
                  { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "17:00" },
                  { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "17:00" },
                  { dayOfWeek: 6, isOpen: false, openTime: "09:00", closeTime: "17:00" },
                ],
              },
            },
          },
        },
      },
      include: { business: true },
    });

    return NextResponse.json({
      message: "Account created successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
