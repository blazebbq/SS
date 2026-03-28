import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template3({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-wide">{business.name}</h1>
          <a href="#book" className="bg-white text-orange-500 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors">
            Book Session
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-bold uppercase tracking-widest text-orange-100 mb-4 text-sm">
            Transform Your Body
          </p>
          <h2 className="text-6xl font-black uppercase mb-6">{business.name}</h2>
          {business.description && (
            <p className="text-orange-100 text-xl max-w-2xl mx-auto">{business.description}</p>
          )}
          <a href="#book" className="mt-10 inline-block bg-white text-orange-500 px-10 py-4 rounded-full font-black text-lg hover:bg-orange-50 transition-colors">
            Book a Session
          </a>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center uppercase text-gray-900 mb-12">Training Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="border-2 border-orange-200 rounded-2xl p-6 hover:border-orange-400 transition-colors">
                <h3 className="font-black text-gray-900 text-lg mb-2">{s.name}</h3>
                {s.description && <p className="text-gray-500 text-sm mb-3">{s.description}</p>}
                <p className="text-gray-400 text-sm mb-4">{formatDuration(s.duration)}</p>
                <p className="text-orange-500 font-black text-2xl">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-center uppercase text-gray-900 mb-12">Your Trainers</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {staff.map((m) => (
                <div key={m.id} className="text-center bg-white rounded-2xl p-8 shadow-sm w-48">
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
                    {m.name.charAt(0)}
                  </div>
                  <p className="font-bold text-gray-900">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-20 px-4 bg-orange-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-center uppercase text-gray-900 mb-8">Book a Session</h2>
          <div className="bg-white rounded-3xl p-8 shadow-md">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Contact us to book your session.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {business.phone && <div><p className="text-orange-400 text-xs uppercase font-bold mb-2">Call</p><p>{business.phone}</p></div>}
          {business.address && <div><p className="text-orange-400 text-xs uppercase font-bold mb-2">Location</p><p>{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-orange-400 text-xs uppercase font-bold mb-2">Hours</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-gray-400 text-sm">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Closed"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="bg-black py-5 px-4 text-center"><p className="text-gray-600 text-sm">© {new Date().getFullYear()} {business.name} · Powered by PageNest</p></footer>
    </div>
  );
}
