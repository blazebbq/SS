import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  const user1 = await prisma.user.upsert({
    where: { email: "demo@pagenest.uk" },
    update: {},
    create: {
      name: "Demo Owner",
      email: "demo@pagenest.uk",
      password,
      business: {
        create: {
          name: "Sally's Hair Studio",
          slug: "sallys-hair-studio",
          description: "Premium hair services in the heart of the city.",
          phone: "+44 20 7123 4567",
          email: "demo@pagenest.uk",
          address: "123 High Street, London, UK",
          templateId: 2,
          services: {
            createMany: {
              data: [
                { name: "Cut & Blow Dry", duration: 60, price: 45, description: "Full cut and professional blow dry" },
                { name: "Highlights", duration: 90, price: 85, description: "Full or half head highlights" },
                { name: "Colour", duration: 120, price: 110, description: "Full colour treatment" },
                { name: "Trim", duration: 30, price: 25, description: "Quick trim and tidy" },
              ],
            },
          },
          staff: {
            createMany: {
              data: [
                { name: "Sally Jones" },
                { name: "Emma Wilson" },
                { name: "Priya Patel" },
              ],
            },
          },
          openingHours: {
            createMany: {
              data: [
                { dayOfWeek: 0, isOpen: false, openTime: "10:00", closeTime: "18:00" },
                { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "20:00" },
                { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "20:00" },
                { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 6, isOpen: true, openTime: "10:00", closeTime: "16:00" },
              ],
            },
          },
        },
      },
    },
    include: { business: true },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "barber@pagenest.uk" },
    update: {},
    create: {
      name: "Mike the Barber",
      email: "barber@pagenest.uk",
      password,
      business: {
        create: {
          name: "Mike's Barbershop",
          slug: "mikes-barbershop",
          description: "Classic cuts, hot towel shaves, and beard grooming.",
          phone: "+44 20 7987 6543",
          email: "barber@pagenest.uk",
          address: "45 Barbican Road, London, UK",
          templateId: 1,
          services: {
            createMany: {
              data: [
                { name: "Classic Cut", duration: 30, price: 20 },
                { name: "Cut & Beard Trim", duration: 45, price: 30 },
                { name: "Hot Towel Shave", duration: 30, price: 25 },
                { name: "Student Cut", duration: 30, price: 15 },
              ],
            },
          },
          staff: {
            createMany: {
              data: [
                { name: "Mike Taylor" },
                { name: "Danny Khan" },
              ],
            },
          },
          openingHours: {
            createMany: {
              data: [
                { dayOfWeek: 0, isOpen: false, openTime: "09:00", closeTime: "17:00" },
                { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" },
                { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "17:00" },
                { dayOfWeek: 6, isOpen: true, openTime: "10:00", closeTime: "15:00" },
              ],
            },
          },
        },
      },
    },
  });

  console.log(`✅ Created users: ${user1.email}, ${user2.email}`);
  console.log("✅ Seeding complete!");
  console.log("\n📋 Demo credentials:");
  console.log("  Email: demo@pagenest.uk");
  console.log("  Password: password123");
  console.log("\n  Email: barber@pagenest.uk");
  console.log("  Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
