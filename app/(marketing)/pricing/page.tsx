'use client'

import { useState } from 'react'
import Link from 'next/link'

// These should be your actual Stripe Price IDs
const PRICE_IDS = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to start checkout')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1F2933] mb-4">
            Simple pricing
          </h1>
          <p className="text-lg text-[#6B7280]">Choose what works for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#E5E7EB] hover:border-[#4F46E5]/30 hover:shadow-md transition-all">
            <h2 className="text-2xl font-semibold text-[#1F2933] mb-2">Free</h2>
            <div className="mb-6">
              <span className="text-4xl font-semibold text-[#1F2933]">$0</span>
              <span className="text-[#6B7280]">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-[#6B7280]">
              <li className="flex items-start">
                <span className="mr-2 text-[#86EFAC] font-semibold">✓</span>
                <span>25 captures per month</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#86EFAC] font-semibold">✓</span>
                <span>1 active tile at a time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#86EFAC] font-semibold">✓</span>
                <span>Rules-based engine</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#86EFAC] font-semibold">✓</span>
                <span>Basic insights</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center py-3 px-4 border border-[#E5E7EB] text-[#1F2933] rounded-lg font-semibold hover:bg-[#FAFAF9] hover:border-[#4F46E5]/30 transition-all"
            >
              Get started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#4F46E5] rounded-2xl shadow-md p-8 border border-[#4338CA] text-white relative">
            <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-md">
              Popular
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-semibold">Pro</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-semibold">$9.99</span>
              <span className="text-white/80">/month</span>
              <span className="text-sm text-white/70 ml-2 block mt-1">or $79/year (save 34%)</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-white/90">
              <li className="flex items-start">
                <span className="mr-2 text-[#FACC15] font-semibold">✓</span>
                <span>Unlimited captures</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#FACC15] font-semibold">✓</span>
                <span>Smart Assist (AI) for messy inputs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#FACC15] font-semibold">✓</span>
                <span>Advanced anti-avoidance insights</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#FACC15] font-semibold">✓</span>
                <span>More reminder options</span>
              </li>
            </ul>
            <button
              onClick={() => handleCheckout(PRICE_IDS.monthly)}
              disabled={loading !== null}
              className="w-full py-3 px-4 bg-white text-[#4F46E5] rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === PRICE_IDS.monthly ? 'Loading...' : 'Start Pro trial'}
            </button>
            <button
              onClick={() => handleCheckout(PRICE_IDS.yearly)}
              disabled={loading !== null}
              className="w-full mt-3 py-2.5 px-4 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading === PRICE_IDS.yearly ? 'Loading...' : 'Save with yearly ($79/yr)'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
