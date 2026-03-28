import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template9({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-red-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">{business.name}</h1>
            <p className="text-red-300 text-xs tracking-wide">Reserve a Table</p>
          </div>
          <a href="#book" className="border border-amber-400 text-amber-400 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-400 hover:text-red-900 transition-colors">
            Reserve Now
          </a>
        </div>
      </header>

      <section className="bg-red-900 text-white py-24 px-6 text-center" style={{ backgroundImage: "radial-gradient(ellipse at center, #7f1d1d 0%, #450a0a 100%)" }}>
        <p className="text-amber-400 tracking-widest text-xs uppercase mb-4">Restaurant & Dining</p>
        <h2 className="text-5xl font-serif font-bold mb-6">{business.name}</h2>
        {business.description && (
          <p className="text-red-200 text-lg max-w-xl mx-auto leading-relaxed">{business.description}</p>
        )}
        <a href="#book" className="mt-10 inline-block bg-amber-400 text-red-900 px-10 py-4 rounded-full font-bold hover:bg-amber-300 transition-colors">
          Reserve a Table
        </a>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-red-900 text-center mb-2">The Menu</h2>
          <div className="w-24 h-px bg-amber-400 mx-auto mb-12" />
          <div className="space-y-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-6 flex items-center justify-between shadow-sm border border-amber-100">
                <div>
                  <h3 className="font-serif font-semibold text-gray-900 text-lg">{s.name}</h3>
                  {s.description && <p className="text-gray-500 mt-1">{s.description}</p>}
                  <p className="text-gray-400 text-xs mt-2">Duration: {formatDuration(s.duration)}</p>
                </div>
                <p className="text-red-700 font-bold text-xl ml-6">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 px-6 bg-red-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-bold text-red-900 mb-8">Our Team</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {staff.map((m) => (
                <div key={m.id} className="bg-white rounded-xl p-6 text-center shadow-sm border border-red-100 w-40">
                  <div className="w-14 h-14 rounded-full bg-red-800 flex items-center justify-center text-white text-xl font-serif font-bold mx-auto mb-3">
                    {m.name.charAt(0)}
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-20 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-red-900 text-center mb-2">Reserve a Table</h2>
          <div className="w-24 h-px bg-amber-400 mx-auto mb-10" />
          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Please call us to make a reservation.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-red-900 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {business.phone && <div><p className="text-amber-400 text-xs mb-1">Reservations</p><p className="text-red-200">{business.phone}</p></div>}
          {business.address && <div><p className="text-amber-400 text-xs mb-1">Location</p><p className="text-red-200">{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-amber-400 text-xs mb-1">Opening Times</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-red-300 text-xs">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Closed"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="bg-red-950 py-5 text-center"><p className="text-red-900 text-xs">© {new Date().getFullYear()} {business.name} · Powered by PageNest</p></footer>
    </div>
  );
}
