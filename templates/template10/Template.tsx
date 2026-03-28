import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template10({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{business.name}</h1>
          <a href="#book" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Book Now
          </a>
        </div>
      </header>

      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{business.name}</h2>
          {business.description && (
            <p className="text-gray-600 text-xl max-w-2xl leading-relaxed">{business.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#book" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Book an Appointment
            </a>
            {business.phone && (
              <a href={`tel:${business.phone}`} className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                {business.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                    {s.description && <p className="text-gray-500 text-sm mt-1">{s.description}</p>}
                    <p className="text-gray-400 text-xs mt-2">{formatDuration(s.duration)}</p>
                  </div>
                  <span className="text-indigo-600 font-bold text-lg">{formatPrice(s.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
            <div className="flex flex-wrap gap-4">
              {staff.map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-indigo-50 rounded-xl px-5 py-4 border border-indigo-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <p className="font-medium text-gray-900">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-16 px-6 bg-indigo-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
          <div className="bg-white rounded-2xl p-8 border border-indigo-100 shadow-sm">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Please contact us to make a booking.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {business.phone && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-600">{business.phone}</p>
            </div>
          )}
          {business.address && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600">{business.address}</p>
            </div>
          )}
          {openingHours.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Opening Hours</h3>
              <div className="space-y-1">
                {openingHours.map((h) => (
                  <div key={h.dayOfWeek} className="flex justify-between text-sm">
                    <span className="text-gray-600">{DAYS_OF_WEEK[h.dayOfWeek]}</span>
                    <span className={h.isOpen ? "text-gray-900" : "text-gray-400"}>
                      {h.isOpen ? `${h.openTime} – ${h.closeTime}` : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <footer className="bg-gray-900 py-5 px-6 text-center"><p className="text-gray-600 text-sm">© {new Date().getFullYear()} {business.name} · Powered by PageNest</p></footer>
    </div>
  );
}
