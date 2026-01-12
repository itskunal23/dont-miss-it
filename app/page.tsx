import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-light text-slate-900">QuietDeadline</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6">
            One calm step at a time
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Anti-planner for Type-B people. Dump what's on your mind. Get a tiny next step you can do in 10–20 minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 border-2 border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-white transition"
            >
              See pricing
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">One tile focus</h3>
            <p className="text-slate-600 text-sm">
              No long lists. No guilt. Just one tiny step you can actually do.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Smart but simple</h3>
            <p className="text-slate-600 text-sm">
              Rules-based engine that understands deadlines, categories, and your energy.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Shame-free</h3>
            <p className="text-slate-600 text-sm">
              Showing up counts. No judgment. Just calm progress.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
          <h2 className="text-3xl font-light text-slate-900 mb-4">Ready to get started?</h2>
          <p className="text-slate-600 mb-6">Create your first calm step in under 2 minutes.</p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            Sign up free
          </Link>
        </div>
      </main>
    </div>
  )
}
