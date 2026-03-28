import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template5({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)" }}>
      <header className="bg-white/80 backdrop-blur border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-wide text-pink-700">{business.name}</h1>
          <a href="#book" className="bg-pink-400 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-pink-500 transition-colors">
            Book Now ✨
          </a>
        </div>
      </header>

      <section className="py-24 px-6 text-center">
        <div className="text-4xl mb-4">💅</div>
        <h2 className="text-5xl font-bold text-pink-700 mb-4">{business.name}</h2>
        {business.description && (
          <p className="text-pink-500 text-lg max-w-xl mx-auto leading-relaxed">{business.description}</p>
        )}
        <a href="#book" className="mt-10 inline-block bg-pink-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-pink-600 transition-colors shadow-lg">
          Book Your Treatment
        </a>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-pink-700 mb-10">Our Treatments 💕</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-pink-100 text-center">
                <h3 className="font-semibold text-pink-800 text-lg mb-2">{s.name}</h3>
                {s.description && <p className="text-pink-500 text-sm mb-3">{s.description}</p>}
                <p className="text-pink-400 text-xs mb-4">⏱ {formatDuration(s.duration)}</p>
                <p className="text-pink-600 font-bold text-2xl">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-10">Meet Our Artists 👑</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {staff.map((m) => (
                <div key={m.id} className="bg-white/80 rounded-2xl p-6 text-center shadow-sm border border-pink-100 w-40">
                  <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 text-2xl font-bold mx-auto mb-3">
                    {m.name.charAt(0)}
                  </div>
                  <p className="font-medium text-pink-800">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-pink-700 mb-8">Book Your Spot 🌸</h2>
          <div className="bg-white/90 rounded-3xl p-8 shadow-md border border-pink-100">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-pink-400 text-center py-8">Contact us to book! 💕</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white/60">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {business.phone && <div><p className="text-pink-400 text-xs mb-1">📞 Call Us</p><p className="text-pink-700">{business.phone}</p></div>}
          {business.address && <div><p className="text-pink-400 text-xs mb-1">�� Find Us</p><p className="text-pink-700">{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-pink-400 text-xs mb-1">🕐 Hours</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-pink-600 text-xs">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Closed"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="py-5 text-center"><p className="text-pink-300 text-sm">© {new Date().getFullYear()} {business.name} · Powered by PageNest 💅</p></footer>
    </div>
  );
}
