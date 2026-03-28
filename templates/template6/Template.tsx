import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template6({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{business.name}</h1>
            <p className="text-xs text-teal-600 tracking-wide">Medical Aesthetics</p>
          </div>
          <a href="#book" className="bg-teal-600 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-teal-700 transition-colors">
            Book Consultation
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-teal-200 text-sm font-medium mb-3">Trusted. Professional. Results-Driven.</p>
          <h2 className="text-4xl font-semibold mb-4">{business.name}</h2>
          {business.description && (
            <p className="text-teal-100 text-lg max-w-2xl leading-relaxed">{business.description}</p>
          )}
          <a href="#book" className="mt-8 inline-block bg-white text-teal-700 px-8 py-3 rounded font-semibold hover:bg-teal-50 transition-colors">
            Schedule a Consultation
          </a>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-teal-600 rounded-full" />
            <h2 className="text-2xl font-semibold text-gray-900">Treatments & Procedures</h2>
          </div>
          <div className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-lg p-5 border border-gray-100 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-medium text-gray-900">{s.name}</h3>
                  {s.description && <p className="text-gray-500 text-sm mt-0.5">{s.description}</p>}
                  <p className="text-gray-400 text-xs mt-1">{formatDuration(s.duration)}</p>
                </div>
                <div className="text-right">
                  <p className="text-teal-700 font-semibold">{formatPrice(s.price)}</p>
                  <p className="text-gray-400 text-xs">from</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 px-6 bg-teal-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-teal-600 rounded-full" />
              <h2 className="text-2xl font-semibold text-gray-900">Our Practitioners</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {staff.map((m) => (
                <div key={m.id} className="bg-white rounded-lg p-5 border border-teal-100 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-teal-600 text-xs">Practitioner</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-teal-600 rounded-full" />
            <h2 className="text-2xl font-semibold text-gray-900">Book a Consultation</h2>
          </div>
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Please call us to arrange a consultation.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {business.phone && <div><p className="text-teal-400 text-xs font-medium mb-1">Phone</p><p className="text-gray-300 text-sm">{business.phone}</p></div>}
          {business.address && <div><p className="text-teal-400 text-xs font-medium mb-1">Address</p><p className="text-gray-300 text-sm">{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-teal-400 text-xs font-medium mb-1">Opening Hours</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-gray-400 text-xs">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Closed"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="bg-black py-4 px-6 text-center"><p className="text-gray-600 text-xs">© {new Date().getFullYear()} {business.name} · Powered by PageNest</p></footer>
    </div>
  );
}
