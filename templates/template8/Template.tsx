import { TemplateProps } from "@/lib/template-types";
import BookingWidget from "@/components/booking/BookingWidget";
import { formatPrice, formatDuration, DAYS_OF_WEEK } from "@/lib/utils";

export default function Template8({ business, services, staff, openingHours, gallery }: TemplateProps) {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900/90 backdrop-blur border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-light tracking-[0.3em] uppercase">{business.name}</h1>
          <a href="#book" className="text-stone-400 hover:text-white text-sm tracking-widest uppercase transition-colors">
            Book →
          </a>
        </div>
      </header>

      <section className="pt-24 pb-32 px-6 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-500 text-xs tracking-[0.5em] uppercase mb-6">Photography</p>
          <h2 className="text-7xl md:text-9xl font-thin tracking-tight leading-none mb-8 text-stone-100">
            {business.name}
          </h2>
          {business.description && (
            <p className="text-stone-400 text-xl max-w-xl leading-relaxed">{business.description}</p>
          )}
          <a href="#book" className="mt-12 inline-block border border-stone-600 text-stone-300 px-10 py-4 text-sm tracking-widest uppercase hover:bg-stone-800 transition-colors">
            Book a Shoot
          </a>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-8">Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="aspect-square bg-stone-800 rounded-lg overflow-hidden">
                  <img src={img.url} alt={img.alt || "Gallery"} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-stone-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-12">Packages</h2>
          <div className="space-y-4">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-6 border-b border-stone-800">
                <div>
                  <p className="text-stone-200 font-light text-lg tracking-wide">{s.name}</p>
                  {s.description && <p className="text-stone-500 text-sm mt-1">{s.description}</p>}
                  <p className="text-stone-600 text-xs mt-2">{formatDuration(s.duration)}</p>
                </div>
                <p className="text-stone-300 font-light text-xl">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-12">Photographers</h2>
            <div className="flex flex-wrap gap-6">
              {staff.map((m) => (
                <div key={m.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 text-lg font-thin">
                    {m.name.charAt(0)}
                  </div>
                  <p className="text-stone-300 font-light tracking-wide">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="book" className="py-20 px-6 bg-stone-950">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xs tracking-[0.5em] uppercase text-stone-600 mb-12">Book a Shoot</h2>
          <div className="border border-stone-800 rounded-lg p-8">
            {services.length === 0 || staff.length === 0 ? (
              <p className="text-stone-500 text-center py-8 text-sm">Please contact us to book.</p>
            ) : (
              <BookingWidget businessId={business.id} businessSlug={business.slug} services={services} staff={staff} />
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {business.phone && <div><p className="text-stone-600 text-xs tracking-widest uppercase mb-2">Contact</p><p className="text-stone-400">{business.phone}</p></div>}
          {business.address && <div><p className="text-stone-600 text-xs tracking-widest uppercase mb-2">Studio</p><p className="text-stone-400">{business.address}</p></div>}
          {openingHours.length > 0 && (
            <div>
              <p className="text-stone-600 text-xs tracking-widest uppercase mb-2">Available</p>
              {openingHours.map((h) => (
                <p key={h.dayOfWeek} className="text-stone-500 text-xs">{DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3)}: {h.isOpen ? `${h.openTime}–${h.closeTime}` : "Unavailable"}</p>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="border-t border-stone-900 py-5 text-center"><p className="text-stone-700 text-xs tracking-widest">© {new Date().getFullYear()} {business.name} · PAGENEST</p></footer>
    </div>
  );
}
