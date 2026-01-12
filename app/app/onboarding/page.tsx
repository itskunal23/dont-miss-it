'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

const OVERWHELM_OPTIONS = [
  { id: 'too-many-things', label: 'Too many things to remember', emoji: '🧠', color: '#FCA5A5' },
  { id: 'procrastination', label: 'I keep putting things off', emoji: '⏰', color: '#FDE68A' },
  { id: 'perfectionism', label: 'I want everything perfect', emoji: '✨', color: '#A5B4FC' },
  { id: 'other', label: 'Something else', emoji: '💭', color: '#E5E7EB' },
]

const TIME_OPTIONS = [
  { id: 'morning', label: 'Morning', emoji: '🌅', time: '6am - 12pm' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '12pm - 5pm' },
  { id: 'night', label: 'Night', emoji: '🌙', time: '5pm - 12am' },
  { id: 'varies', label: 'It varies', emoji: '🔄', time: 'Changes daily' },
]

const STEP_SIZE_OPTIONS = [
  { id: 10, label: '10 minutes', description: 'Quick wins', emoji: '⚡' },
  { id: 15, label: '15 minutes', description: 'Balanced', emoji: '⚖️' },
  { id: 20, label: '20 minutes', description: 'Deep focus', emoji: '🎯' },
]

// Animated Character Component
function AnimatedCharacter({ emotion = 'calm', step = 1 }: { emotion?: 'overwhelmed' | 'calm' | 'focused' | 'success'; step?: number }) {
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Trigger re-render for animation by changing key
    const timer = setTimeout(() => setKey(prev => prev + 1), 50)
    return () => clearTimeout(timer)
  }, [step])

  const getCharacterState = () => {
    switch (emotion) {
      case 'overwhelmed':
        return {
          face: '😰',
          bg: '#FCA5A5',
          animation: 'animate-bounce'
        }
      case 'calm':
        return {
          face: '😌',
          bg: '#86EFAC',
          animation: 'animate-gentle-float'
        }
      case 'focused':
        return {
          face: '🧘',
          bg: '#4F46E5',
          animation: 'animate-soft-pulse'
        }
      case 'success':
        return {
          face: '✨',
          bg: '#FACC15',
          animation: 'animate-gentle-float'
        }
      default:
        return {
          face: '😊',
          bg: '#E5E7EB',
          animation: 'animate-gentle-float'
        }
    }
  }

  const state = getCharacterState()

  return (
    <div key={key} className={`relative w-32 h-32 mx-auto ${state.animation}`}>
      <div 
        className="w-full h-full rounded-full flex items-center justify-center text-6xl transition-all duration-500"
        style={{ backgroundColor: `${state.bg}20` }}
      >
        <div className="relative">
          <span className="block">{state.face}</span>
          {emotion === 'success' && (
            <div className="absolute -top-2 -right-2 text-2xl animate-spin">⭐</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Animated Demo Component
function AnimatedDemo({ step }: { step: number }) {
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowDemo(true), 300)
    return () => clearTimeout(timer)
  }, [step])

  if (step === 1) {
    return (
      <div className="bg-[#FAFAF9] rounded-xl p-6 border border-[#E5E7EB] min-h-[200px] flex items-center justify-center">
        <div className={`space-y-4 w-full transition-all duration-500 ${showDemo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Before: Overwhelmed state */}
          <div className="space-y-2">
            <div className="text-xs text-[#6B7280] mb-2">Before: Your brain right now</div>
            <div className="flex gap-2 flex-wrap">
              {['Email', 'Bills', 'Study', 'Call', 'Clean', 'Work', 'Gym', '...'].map((task, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-[#FCA5A5]/30 border border-[#FCA5A5]/50 rounded-lg text-xs text-[#6B7280] animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {task}
                </div>
              ))}
            </div>
          </div>
          {/* Arrow */}
          <div className="flex justify-center text-[#4F46E5] text-xl animate-gentle-float">↓</div>
          {/* After: One tile */}
          <div className="space-y-2">
            <div className="text-xs text-[#6B7280] mb-2">After: One calm step</div>
            <div className="bg-white rounded-lg border-2 border-[#4F46E5] p-4 shadow-md animate-gentle-float">
              <div className="text-xs font-semibold text-[#4F46E5] mb-1">ONE TILE</div>
              <div className="text-sm font-medium text-[#1F2933]">Reply to email</div>
              <div className="text-xs text-[#6B7280] mt-1">Next: write 1 line</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="bg-[#FAFAF9] rounded-xl p-6 border border-[#E5E7EB] min-h-[200px]">
        <div className={`space-y-4 transition-all duration-500 ${showDemo ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-xs text-[#6B7280] mb-3">Visual: When you&apos;re most productive</div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_OPTIONS.map((option, i) => {
              const isActive = option.id === 'morning' // Demo default
              return (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                    isActive
                      ? 'border-[#4F46E5] bg-[#4F46E5]/10 scale-105'
                      : 'border-[#E5E7EB] bg-white opacity-50'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium text-[#1F2933]">{option.label}</div>
                  <div className="text-xs text-[#6B7280] mt-1">{option.time}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="bg-[#FAFAF9] rounded-xl p-6 border border-[#E5E7EB] min-h-[200px]">
        <div className={`space-y-4 transition-all duration-500 ${showDemo ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-xs text-[#6B7280] mb-3">Visual: Your perfect step size</div>
          <div className="space-y-3">
            {STEP_SIZE_OPTIONS.map((option, i) => {
              const isActive = option.id === 15 // Demo default
              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-[#4F46E5] bg-[#4F46E5]/10 scale-105'
                      : 'border-[#E5E7EB] bg-white'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{option.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#1F2933]">{option.label}</div>
                      <div className="text-xs text-[#6B7280]">{option.description}</div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return null
}

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
          } as never)
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

  const getCharacterEmotion = () => {
    if (step === 1) return 'overwhelmed'
    if (step === 2) return 'calm'
    if (step === 3) return 'focused'
    return 'calm'
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#6B7280]">Step {step} of 3</span>
            <span className="text-sm font-medium text-[#6B7280]">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4F46E5] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Character & Demo */}
          <div className="space-y-6">
            <AnimatedCharacter emotion={getCharacterEmotion()} step={step} />
            <AnimatedDemo step={step} />
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#E5E7EB] space-y-6">
            {/* Step 1: What overwhelms you? */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1F2933] mb-2">What overwhelms you most?</h2>
                  <p className="text-sm text-[#6B7280]">We&apos;ll help you turn this into calm steps</p>
                </div>
                <div className="space-y-3">
                  {OVERWHELM_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setOverwhelm(option.id)}
                      className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                        overwhelm === option.id
                          ? 'border-[#4F46E5] bg-[#4F46E5]/10 shadow-md scale-[1.02]'
                          : 'border-[#E5E7EB] hover:border-[#4F46E5]/30 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-medium text-[#1F2933]">{option.label}</span>
                        {overwhelm === option.id && (
                          <span className="ml-auto text-[#4F46E5]">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: When do you get things done? */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1F2933] mb-2">When do you usually get things done?</h2>
                  <p className="text-sm text-[#6B7280]">We&apos;ll show your steps at the right time</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {TIME_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTimeOfDay(option.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                        timeOfDay === option.id
                          ? 'border-[#4F46E5] bg-[#4F46E5]/10 shadow-md scale-105'
                          : 'border-[#E5E7EB] hover:border-[#4F46E5]/30 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="font-semibold text-[#1F2933] text-sm mb-1">{option.label}</div>
                      <div className="text-xs text-[#6B7280]">{option.time}</div>
                      {timeOfDay === option.id && (
                        <div className="mt-2 text-[#4F46E5] text-xs">✓ Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Step size */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1F2933] mb-2">Pick your default step size</h2>
                  <p className="text-sm text-[#6B7280]">You can always change this later</p>
                </div>
                <div className="space-y-3">
                  {STEP_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setStepSize(option.id)}
                      className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                        stepSize === option.id
                          ? 'border-[#4F46E5] bg-[#4F46E5]/10 shadow-md scale-[1.02]'
                          : 'border-[#E5E7EB] hover:border-[#4F46E5]/30 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{option.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-[#1F2933]">{option.label}</div>
                          <div className="text-sm text-[#6B7280]">{option.description}</div>
                        </div>
                        {stepSize === option.id && (
                          <span className="text-[#4F46E5] text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors"
                >
                  ← Back
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4F46E5]"
              >
                {loading ? 'Saving...' : step === 3 ? 'Get started ✨' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
