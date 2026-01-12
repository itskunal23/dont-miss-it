'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [demoText, setDemoText] = useState('')
  const [showTile, setShowTile] = useState(false)
  const [chartVisible, setChartVisible] = useState(false)
  const [featureToggle, setFeatureToggle] = useState<'before' | 'after'>('before')
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-demo after 2 seconds if no interaction
    const timer = setTimeout(() => {
      if (!demoText) {
        setDemoText('Reply to email, pay bill, study for exam')
        setTimeout(() => setShowTile(true), 800)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [demoText])

  useEffect(() => {
    // Intersection observer for chart animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setChartVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleDemoInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDemoText(e.target.value)
    if (e.target.value.length > 10) {
      setTimeout(() => setShowTile(true), 500)
    } else {
      setShowTile(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiLz48L2c+PC9zdmc+')] pointer-events-none" />
      
      <nav className="bg-white/60 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#1F2933] tracking-tight">
            Dont Miss It
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-[#4F46E5] text-white rounded-lg font-medium hover:bg-[#4338CA] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* 1. INTERACTIVE HERO */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-[#1F2933] leading-tight">
              One calm step at a time
            </h1>
            <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
              Anti-planner for everyone. Get one tiny step you can actually do.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors shadow-sm hover:shadow-md mb-2"
            >
              Try it once. No commitment.
            </Link>
            <p className="text-xs text-[#6B7280]">Takes ~60 seconds</p>
          </div>

          {/* Right: Interactive Demo */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
              <label className="block text-sm font-medium text-[#6B7280] mb-2">Brain dump</label>
              <textarea
                value={demoText}
                onChange={handleDemoInput}
                placeholder="Reply to email, pay bill, study..."
                rows={3}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none text-[#1F2933] placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* Animated arrow */}
            {showTile && (
              <div className="flex justify-center animate-gentle-float">
                <div className="text-[#4F46E5]">↓</div>
              </div>
            )}

            {/* Tile appears */}
            {showTile && (
              <div className="bg-white rounded-xl p-6 border-2 border-[#4F46E5]/30 shadow-md animate-gentle-float">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">One Tile</span>
                  <span className="px-2 py-1 bg-[#86EFAC]/20 text-[#059669] rounded-md text-xs font-medium">low</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1F2933] mb-2">Reply to email</h3>
                <p className="text-sm text-[#6B7280] mb-4">Next: write 1 line</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 bg-[#4F46E5]/10 text-[#4F46E5] rounded-md text-xs font-medium">⏱️ 10 min</span>
                  <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#6B7280] rounded-md text-xs">work</span>
                </div>
                <button className="w-full py-2.5 px-4 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors text-sm">
                  Start
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 2. ONE-LINE VALUE REINFORCEMENT */}
        <section className="text-center mb-24">
          <p className="text-xl text-[#1F2933] font-medium max-w-2xl mx-auto">
            People don&apos;t buy planners. They buy relief from overwhelm.
          </p>
        </section>

        {/* 3. VISUAL PROOF OF PROBLEM */}
        <section className="mb-24" ref={chartRef}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#1F2933] mb-3">Why this exists</h2>
            <p className="text-[#6B7280]">Focus is broken — and lists make it worse</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Chart 1: Attention Fragmentation */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
              <h3 className="text-sm font-semibold text-[#1F2933] mb-6">Attention Fragmentation</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                    <span>Deep focus time</span>
                    <span className="font-medium">23 min/day</span>
                  </div>
                  <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-[#FCA5A5] rounded-full transition-all duration-1000 ${chartVisible ? 'w-[15%]' : 'w-0'}`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                    <span>Interruptions per day</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-[#FCA5A5] rounded-full transition-all duration-1000 ${chartVisible ? 'w-[85%]' : 'w-0'}`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                    <span>Unfinished tasks</span>
                    <span className="font-medium">12 avg</span>
                  </div>
                  <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-[#FCA5A5] rounded-full transition-all duration-1000 ${chartVisible ? 'w-[70%]' : 'w-0'}`}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mt-4 leading-relaxed">
                Modern work breaks focus into tiny fragments — long task lists increase avoidance.
              </p>
            </div>

            {/* Chart 2: Why People Procrastinate */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
              <h3 className="text-sm font-semibold text-[#1F2933] mb-6">Why people procrastinate</h3>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Donut chart segments */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FCA5A5"
                    strokeWidth="20"
                    strokeDasharray={`${chartVisible ? '62.8' : '0'} 251.2`}
                    strokeDashoffset="0"
                    className="transition-all duration-1000"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FDE68A"
                    strokeWidth="20"
                    strokeDasharray={`${chartVisible ? '50.2' : '0'} 251.2`}
                    strokeDashoffset={chartVisible ? '-62.8' : '0'}
                    className="transition-all duration-1000"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="20"
                    strokeDasharray={`${chartVisible ? '138.2' : '0'} 251.2`}
                    strokeDashoffset={chartVisible ? '-113' : '0'}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#1F2933]">55%</div>
                    <div className="text-xs text-[#6B7280]">Don&apos;t know where to start</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>
                  <span className="text-[#6B7280]">Don&apos;t know where to start (55%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FCA5A5]"></div>
                  <span className="text-[#6B7280]">Overwhelm (25%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FDE68A]"></div>
                  <span className="text-[#6B7280]">Fear of doing it wrong (20%)</span>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mt-4 leading-relaxed">
                Most people don&apos;t procrastinate because they&apos;re lazy — they&apos;re overloaded.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FEATURES AS DOPAMINE LOOPS */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#1F2933] mb-3">How it works</h2>
          </div>

          {/* Feature 1: One Tile Focus */}
          <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🎯</div>
              <h3 className="text-xl font-semibold text-[#1F2933]">One Tile Focus</h3>
            </div>
            <div className="relative h-32 bg-[#FAFAF9] rounded-lg overflow-hidden">
              {/* Multiple blurred tasks */}
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <div className="w-24 h-20 bg-white/50 backdrop-blur-sm rounded-lg border border-[#E5E7EB] opacity-40 transform translate-x-8"></div>
                <div className="w-24 h-20 bg-white/50 backdrop-blur-sm rounded-lg border border-[#E5E7EB] opacity-40 transform -translate-x-8"></div>
              </div>
              {/* One sharp tile */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-24 bg-white rounded-lg border-2 border-[#4F46E5] shadow-md animate-gentle-float">
                  <div className="p-3">
                    <div className="text-xs font-semibold text-[#4F46E5] mb-1">ONE TILE</div>
                    <div className="text-sm font-medium text-[#1F2933]">Reply to email</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[#6B7280] mt-4 leading-relaxed">
              Your brain only sees one thing. That&apos;s the point.
            </p>
          </div>

          {/* Feature 2: Smart but Simple */}
          <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🧠</div>
              <h3 className="text-xl font-semibold text-[#1F2933]">Smart but Simple</h3>
        </div>
            <div className="mb-4">
              <button
                onClick={() => setFeatureToggle(featureToggle === 'before' ? 'after' : 'before')}
                className="px-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#1F2933] hover:bg-white transition-colors"
              >
                {featureToggle === 'before' ? 'Before' : 'After'} →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {featureToggle === 'before' ? (
                <>
                  <div className="space-y-2">
                    <div className="h-16 bg-[#FCA5A5]/20 rounded-lg border border-[#FCA5A5]/30 flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">Messy notes</span>
                    </div>
                    <div className="h-16 bg-[#FCA5A5]/20 rounded-lg border border-[#FCA5A5]/30 flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">Open tabs</span>
                    </div>
                    <div className="h-16 bg-[#FCA5A5]/20 rounded-lg border border-[#FCA5A5]/30 flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">😰 Anxiety</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-[#FCA5A5]/20 rounded-lg border border-[#FCA5A5]/30 flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">Decisions</span>
                    </div>
                    <div className="h-16 bg-[#FCA5A5]/20 rounded-lg border border-[#FCA5A5]/30 flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">Pressure</span>
                    </div>
                    <div className="h-16 bg-[#FCA5A5]/20 rounded-lg border border-[#FCA5A5]/30 flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">Overwhelm</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="h-16 bg-white rounded-lg border-2 border-[#4F46E5] flex items-center justify-center shadow-sm">
                      <span className="text-xs font-semibold text-[#4F46E5]">One tile</span>
                    </div>
                    <div className="h-16 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">⏱️ Timer</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-[#86EFAC]/20 rounded-lg border border-[#86EFAC]/30 flex items-center justify-center">
                      <span className="text-xs text-[#059669]">✓ Calm</span>
                    </div>
                    <div className="h-16 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-center">
                      <span className="text-xs text-[#6B7280]">Progress</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <p className="text-[#6B7280] mt-4 leading-relaxed">
              We remove decisions. You keep control.
            </p>
          </div>

          {/* Feature 3: Shame-free */}
          <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">✨</div>
              <h3 className="text-xl font-semibold text-[#1F2933]">Shame-free</h3>
            </div>
            <div className="bg-[#FAFAF9] rounded-lg p-6 border border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1F2933]">Reply to email</div>
                  <div className="text-xs text-[#6B7280]">Missed yesterday</div>
                </div>
                <div className="text-sm text-[#6B7280]">→</div>
                <div className="px-3 py-1.5 bg-[#86EFAC]/20 border border-[#86EFAC]/30 rounded-lg">
                  <span className="text-xs font-medium text-[#059669]">Let&apos;s make it smaller</span>
                </div>
              </div>
              <div className="animate-soft-pulse">
                <div className="h-1 bg-[#86EFAC] rounded-full w-3/4"></div>
              </div>
            </div>
            <p className="text-[#6B7280] mt-4 leading-relaxed">
              Showing up counts. Even for 5 minutes.
            </p>
          </div>
        </section>

        {/* 5. BEHAVIORAL PROOF */}
        <section className="mb-24">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#1F2933] mb-2">What usually happens</h2>
            <p className="text-[#6B7280]">Real behavior, not testimonials</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm text-center">
              <div className="text-3xl font-semibold text-[#4F46E5] mb-2">12 min</div>
              <p className="text-sm text-[#6B7280]">Most first steps take under 12 minutes</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm text-center">
              <div className="text-3xl font-semibold text-[#4F46E5] mb-2">2 min</div>
              <p className="text-sm text-[#6B7280]">People finish their first tile in under 2 minutes</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm text-center">
              <div className="text-3xl font-semibold text-[#4F46E5] mb-2">Auto</div>
              <p className="text-sm text-[#6B7280]">Avoided tasks shrink automatically</p>
            </div>
          </div>
        </section>

        {/* 6. LOW-PRESSURE CTA */}
        <section className="bg-white rounded-2xl p-12 border border-[#E5E7EB] shadow-sm text-center">
          <h2 className="text-3xl font-semibold text-[#1F2933] mb-4">Create one calm step</h2>
          <p className="text-lg text-[#6B7280] mb-6">No card. No pressure.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors shadow-sm hover:shadow-md mb-2"
          >
            Try it once. No commitment.
          </Link>
          <p className="text-xs text-[#6B7280]">Takes ~60 seconds</p>
        </section>
      </main>
    </div>
  )
}
