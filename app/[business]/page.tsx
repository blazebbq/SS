import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Template1 from "@/templates/template1/Template";
import Template2 from "@/templates/template2/Template";
import Template3 from "@/templates/template3/Template";
import Template4 from "@/templates/template4/Template";
import Template5 from "@/templates/template5/Template";
import Template6 from "@/templates/template6/Template";
import Template7 from "@/templates/template7/Template";
import Template8 from "@/templates/template8/Template";
import Template9 from "@/templates/template9/Template";
import Template10 from "@/templates/template10/Template";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ business: string }>;
}) {
  const { business: slug } = await params;
  const biz = await prisma.business.findUnique({ where: { slug } });
  if (!biz) return { title: "Not Found" };
  return {
    title: biz.name,
    description: biz.description || `Book appointments with ${biz.name}`,
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ business: string }>;
}) {
  const { business: slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      staff: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      openingHours: { orderBy: { dayOfWeek: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });

  if (!business) notFound();

  const templateProps = {
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      description: business.description,
      phone: business.phone,
      email: business.email,
      address: business.address,
      logoUrl: business.logoUrl,
    },
    services: business.services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      duration: s.duration,
      price: s.price.toString(),
    })),
    staff: business.staff.map((st) => ({
      id: st.id,
      name: st.name,
    })),
    openingHours: business.openingHours,
    gallery: business.gallery,
  };

  const templates: Record<number, React.ComponentType<typeof templateProps>> = {
    1: Template1,
    2: Template2,
    3: Template3,
    4: Template4,
    5: Template5,
    6: Template6,
    7: Template7,
    8: Template8,
    9: Template9,
    10: Template10,
  };

  const TemplateComponent = templates[business.templateId] || Template10;

  return <TemplateComponent {...templateProps} />;
}
