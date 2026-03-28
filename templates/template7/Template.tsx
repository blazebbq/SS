import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template7({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-800 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{business.name}</h1>
            <p className="text-blue-300 text-xs">Professional Service</p>
          </div>
          <a href="#book" className="bg-yellow-400 text-blue-900 px-6 py-2.5 rounded font-bold text-sm hover:bg-yellow-300 transition-colors">
            Get a Quote
          </a>
        </div>
      </header>

      <section className="bg-blue-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">{business.name}</h2>
          {business.description && <p className="text-blue-100 text-lg max-w-2xl">{business.description}</p>}
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#book" className="bg-yellow-400 text-blue-900 px-8 py-3 rounded font-bold hover:bg-yellow-300 transition-colors">
              Book Now
            </a>
            {business.phone && (
              <a href={`tel:${business.phone}`} className="border border-white text-white px-8 py-3 rounded font-bold hover:bg-blue-600 transition-colors">
                Call: {business.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-lg p-5 border border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  {s.description && <p className="text-gray-500 text-sm">{s.description}</p>}
                  <p className="text-gray-400 text-xs mt-1">{formatDuration(s.duration)}</p>
                </div>
                <p className="text-blue-700 font-bold text-lg ml-4">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Team</h2>
            <div className="flex flex-wrap gap-4">
              {staff.map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-blue-50 rounded-lg px-5 py-4 border border-blue-100">
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <p className="font-medium text-gray-900">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-16 px-6 bg-blue-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Book a Job</h2>
          <div className="bg-white rounded-xl p-8 border border-blue-100 shadow-sm">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Call us to arrange your booking.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {business.phone && <div><p className="text-yellow-400 text-xs font-bold mb-1">PHONE</p><p className="text-gray-300">{business.phone}</p></div>}
          {business.address && <div><p className="text-yellow-400 text-xs font-bold mb-1">BASED IN</p><p className="text-gray-300">{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-yellow-400 text-xs font-bold mb-1">AVAILABLE</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-gray-400 text-xs">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Closed"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="bg-blue-900 py-4 px-6 text-center"><p className="text-blue-700 text-xs">© {new Date().getFullYear()} {business.name} · Powered by PageNest</p></footer>
    </div>
  );
}
