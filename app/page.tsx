import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
      <header className="px-6 py-5 max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">PageNest</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-indigo-200 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-white text-indigo-900 px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-indigo-700/50 text-indigo-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
          🚀 Launch your business page in minutes
        </div>
        <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
          Your business.
          <br />
          <span className="text-indigo-300">Online in minutes.</span>
        </h2>
        <p className="text-indigo-200 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          PageNest gives small businesses a professional booking page with
          online appointments, availability management, and automated
          confirmations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Create Your Page – Free
          </Link>
          <Link
            href="/login"
            className="border border-indigo-500 text-indigo-200 px-8 py-4 rounded-xl font-medium text-lg hover:bg-indigo-800 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: "🎨",
              title: "10 Beautiful Templates",
              desc: "Choose from 10 professionally designed templates for every type of business.",
            },
            {
              icon: "📅",
              title: "Smart Booking System",
              desc: "Customers book appointments online. No double-bookings, ever.",
            },
            {
              icon: "✉️",
              title: "Automatic Confirmations",
              desc: "Customers and your team get instant email confirmations.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-indigo-200 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-indigo-400 text-sm">
        © {new Date().getFullYear()} PageNest · All rights reserved
      </footer>
    </div>
  );
}
