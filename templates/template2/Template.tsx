import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template2({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white font-light">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-widest text-gray-800">
            {business.name.toUpperCase()}
          </h1>
          <a
            href="#book"
            className="bg-rose-400 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-rose-500 transition-colors"
          >
            Book Appointment
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-rose-400 tracking-widest text-xs uppercase mb-6">
            Welcome
          </p>
          <h2 className="text-5xl font-light text-gray-800 leading-tight mb-6">
            {business.name}
          </h2>
          {business.description && (
            <p className="text-gray-500 text-lg leading-relaxed">
              {business.description}
            </p>
          )}
          <a
            href="#book"
            className="mt-10 inline-block bg-rose-400 text-white px-10 py-4 rounded-full font-medium hover:bg-rose-500 transition-colors"
          >
            Book Your Appointment
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-800 tracking-widest uppercase mb-2">
            Services
          </h2>
          <div className="w-16 h-px bg-rose-300 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s.id} className="text-center p-6 rounded-2xl bg-rose-50">
                <h3 className="font-medium text-gray-800 text-lg mb-2">{s.name}</h3>
                {s.description && (
                  <p className="text-gray-500 text-sm mb-3">{s.description}</p>
                )}
                <p className="text-gray-400 text-xs mb-4">
                  {formatDuration(s.duration)}
                </p>
                <p className="text-rose-500 font-semibold text-xl">
                  {formatPrice(s.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {staff.length > 0 && (
        <section className="py-20 px-6 bg-rose-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-center text-gray-800 tracking-widest uppercase mb-2">
              Our Team
            </h2>
            <div className="w-16 h-px bg-rose-300 mx-auto mb-12" />
            <div className="flex flex-wrap justify-center gap-8">
              {staff.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-2xl font-medium mx-auto mb-3">
                    {member.name.charAt(0)}
                  </div>
                  <p className="text-gray-700 font-medium">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking */}
      <section id="book" className="py-20 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-800 tracking-widest uppercase mb-2">
            Book Now
          </h2>
          <div className="w-16 h-px bg-rose-300 mx-auto mb-10" />
          <div className="bg-rose-50 rounded-3xl p-8">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Please contact us to make a booking.
              </p>
            ) : (
              <BookingWidget
                businessId={business.id}
                businessSlug={business.slug}
                services={services}
                staff={staff}
              />
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {business.phone && (
            <div>
              <p className="text-rose-400 text-xs uppercase tracking-widest mb-2">Call Us</p>
              <p className="text-gray-300">{business.phone}</p>
            </div>
          )}
          {business.address && (
            <div>
              <p className="text-rose-400 text-xs uppercase tracking-widest mb-2">Visit Us</p>
              <p className="text-gray-300">{business.address}</p>
            </div>
          )}
          {openingHours.length > 0 && (
            <div>
              <p className="text-rose-400 text-xs uppercase tracking-widest mb-2">Hours</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-gray-400 text-sm">
                  {DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}:{" "}
                  {h.isOpen ? `${h.openTime} – ${h.closeTime}` : "Closed"}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 py-5 px-6 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} {business.name} · Powered by PageNest
        </p>
      </footer>
    </div>
  );
}
