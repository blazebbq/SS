export interface TemplateService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
}

export interface TemplateStaff {
  id: string;
  name: string;
}

export interface TemplateOpeningHour {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface TemplateGalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

export interface TemplateBusiness {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logoUrl: string | null;
}

export interface TemplateProps {
  business: TemplateBusiness;
  services: TemplateService[];
  staff: TemplateStaff[];
  openingHours: TemplateOpeningHour[];
  gallery: TemplateGalleryImage[];
}
