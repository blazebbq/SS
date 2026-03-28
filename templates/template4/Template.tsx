import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template4({ business, services, staff, openingHours }: TemplateProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-light tracking-[0.3em] uppercase text-white">{business.name}</h1>
          <a href="#book" className="border border-zinc-600 text-zinc-300 px-5 py-2 text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors">
            Inquire
          </a>
        </div>
      </header>

      <section className="py-32 px-6 text-center">
        <p className="text-zinc-600 text-xs tracking-[0.5em] uppercase mb-8">Bespoke Tattoo Art</p>
        <h2 className="text-6xl md:text-8xl font-thin tracking-widest uppercase text-white mb-8">{business.name}</h2>
        {business.description && (
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">{business.description}</p>
        )}
        <a href="#book" className="mt-12 inline-block border border-zinc-600 text-zinc-300 px-12 py-4 text-sm tracking-widest uppercase hover:bg-zinc-800 transition-colors">
          Book a Consultation
        </a>
      </section>

      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-light tracking-[0.5em] uppercase text-zinc-500 mb-12 text-center">Services</h2>
          <div className="space-y-1">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-5 border-b border-zinc-800">
                <div>
                  <p className="text-white font-light tracking-wide">{s.name}</p>
                  {s.description && <p className="text-zinc-500 text-sm mt-0.5">{s.description}</p>}
                  <p className="text-zinc-600 text-xs mt-1">{formatDuration(s.duration)}</p>
                </div>
                <p className="text-zinc-300 font-light">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs font-light tracking-[0.5em] uppercase text-zinc-500 mb-12 text-center">Artists</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {staff.map((m) => (
                <div key={m.id} className="text-center">
                  <div className="w-16 h-16 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 text-xl font-thin mx-auto mb-3">
                    {m.name.charAt(0)}
                  </div>
                  <p className="text-zinc-300 text-sm tracking-widest uppercase font-light">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-20 px-6 bg-zinc-900">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xs font-light tracking-[0.5em] uppercase text-zinc-500 mb-12 text-center">Book a Consultation</h2>
          <div className="border border-zinc-800 rounded-lg p-8">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-zinc-500 text-center py-8 text-sm">Please contact us directly to book.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {business.phone && <div><p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">Phone</p><p className="text-zinc-400">{business.phone}</p></div>}
          {business.address && <div><p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">Location</p><p className="text-zinc-400">{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">Hours</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-zinc-500 text-xs">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Closed"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="border-t border-zinc-900 py-5 px-6 text-center"><p className="text-zinc-700 text-xs tracking-widest">© {new Date().getFullYear()} {business.name} · PAGENEST</p></footer>
    </div>
  );
}
