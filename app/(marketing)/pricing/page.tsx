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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-900 mb-4">Simple pricing</h1>
          <p className="text-slate-600">Choose what works for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-light text-slate-900 mb-2">Free</h2>
            <div className="mb-6">
              <span className="text-4xl font-light">$0</span>
              <span className="text-slate-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>25 captures per month</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>1 active tile at a time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Rules-based engine</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Basic insights</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center py-3 px-4 border-2 border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Get started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-slate-900 rounded-2xl shadow-lg p-8 border-2 border-slate-900 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-light">Pro</h2>
              <span className="px-2 py-1 bg-white text-slate-900 text-xs rounded">Popular</span>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-light">$9.99</span>
              <span className="text-slate-300">/month</span>
              <span className="text-sm text-slate-400 ml-2">or $79/year</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Unlimited captures</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Smart Assist (Ollama) for messy inputs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Advanced anti-avoidance insights</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>More reminder options</span>
              </li>
            </ul>
            <button
              onClick={() => handleCheckout(PRICE_IDS.monthly)}
              disabled={loading !== null}
              className="w-full py-3 px-4 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === PRICE_IDS.monthly ? 'Loading...' : 'Start Pro trial'}
            </button>
            <button
              onClick={() => handleCheckout(PRICE_IDS.yearly)}
              disabled={loading !== null}
              className="w-full mt-2 py-2 px-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading === PRICE_IDS.yearly ? 'Loading...' : 'Save with yearly ($79/yr)'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
