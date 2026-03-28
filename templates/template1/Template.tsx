import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template1({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight uppercase">
            {business.name}
          </h1>
          <a
            href="#book"
            className="bg-yellow-400 text-black px-6 py-2 rounded font-bold text-sm uppercase tracking-wide hover:bg-yellow-300 transition-colors"
          >
            Book Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">
            Premium Service
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            {business.name}
          </h2>
          {business.description && (
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              {business.description}
            </p>
          )}
          <div className="mt-10">
            <a
              href="#book"
              className="bg-yellow-400 text-black px-10 py-4 rounded font-black text-lg uppercase tracking-wide hover:bg-yellow-300 transition-colors inline-block"
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tight text-yellow-400 mb-10">
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="border border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-white">{s.name}</h3>
                    {s.description && (
                      <p className="text-gray-400 text-sm mt-1">{s.description}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2">
                      {formatDuration(s.duration)}
                    </p>
                  </div>
                  <span className="text-yellow-400 font-bold text-xl">
                    {formatPrice(s.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {staff.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase tracking-tight text-yellow-400 mb-10">
              Our Team
            </h2>
            <div className="flex flex-wrap gap-4">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center w-40"
                >
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black text-2xl font-black mx-auto mb-3">
                    {member.name.charAt(0)}
                  </div>
                  <p className="font-bold text-white">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking */}
      <section id="book" className="py-20 px-4 bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tight text-yellow-400 mb-8">
            Book Now
          </h2>
          <div className="bg-gray-950 border border-gray-700 rounded-xl p-6">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Booking not yet available. Please call us to book.
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

      {/* Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {business.phone && (
            <div>
              <h3 className="text-yellow-400 font-bold uppercase text-sm mb-2">Phone</h3>
              <p className="text-gray-300">{business.phone}</p>
            </div>
          )}
          {business.address && (
            <div>
              <h3 className="text-yellow-400 font-bold uppercase text-sm mb-2">Address</h3>
              <p className="text-gray-300">{business.address}</p>
            </div>
          )}
          {openingHours.length > 0 && (
            <div>
              <h3 className="text-yellow-400 font-bold uppercase text-sm mb-2">Hours</h3>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-gray-400 text-sm">
                  {DAYS_OF_WEEK[h.dayOfWeek]}:{" "}
                  {h.isOpen ? `${h.openTime} – ${h.closeTime}` : "Closed"}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-black py-6 px-4 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} {business.name} · Powered by{" "}
          <span className="text-yellow-400">PageNest</span>
        </p>
      </footer>
    </div>
  );
}
