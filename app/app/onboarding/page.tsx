'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

const OVERWHELM_OPTIONS = [
  { id: 'too-many-things', label: 'Too many things to remember' },
  { id: 'procrastination', label: 'I keep putting things off' },
  { id: 'perfectionism', label: 'I want everything perfect' },
  { id: 'other', label: 'Something else' },
]

const TIME_OPTIONS = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'night', label: 'Night' },
  { id: 'varies', label: 'It varies' },
]

const STEP_SIZE_OPTIONS = [
  { id: 10, label: '10 minutes' },
  { id: 15, label: '15 minutes' },
  { id: 20, label: '20 minutes' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [overwhelm, setOverwhelm] = useState<string | null>(null)
  const [timeOfDay, setTimeOfDay] = useState<string | null>(null)
  const [stepSize, setStepSize] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleNext = async () => {
    if (step === 3) {
      // Save preferences and finish onboarding
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        await supabase
          .from('profiles')
          .update({
            preferred_time_of_day: timeOfDay,
            preferred_minutes_default: stepSize || 15,
          })
          .eq('id', user.id)

        router.push('/app')
        router.refresh()
      } catch (error) {
        console.error('Error saving preferences:', error)
        alert('Failed to save preferences')
      } finally {
        setLoading(false)
      }
    } else {
      setStep(step + 1)
    }
  }

  const canProceed = () => {
    if (step === 1) return overwhelm !== null
    if (step === 2) return timeOfDay !== null
    if (step === 3) return stepSize !== null
    return false
  }

  return (
    <div className="max-w-lg mx-auto space-y-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-[#1F2933] mb-2">Welcome to Dont Miss It</h1>
        <p className="text-slate-600">Let's set you up in under 90 seconds</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Step 1: What overwhelms you? */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-light text-slate-900">What overwhelms you most?</h2>
            <div className="space-y-2">
              {OVERWHELM_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setOverwhelm(option.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    overwhelm === option.id
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: When do you get things done? */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-light text-slate-900">When do you usually get things done?</h2>
            <div className="space-y-2">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTimeOfDay(option.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    timeOfDay === option.id
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Step size */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-light text-slate-900">Pick your default step size</h2>
            <p className="text-sm text-slate-600">You can always change this later</p>
            <div className="space-y-2">
              {STEP_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setStepSize(option.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    stepSize === option.id
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : step === 3 ? 'Get started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
