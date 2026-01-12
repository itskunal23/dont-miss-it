'use client'

import { useEffect, useState } from 'react'
import OneTileCard from '@/components/OneTileCard'
import BrainDumpBox from '@/components/BrainDumpBox'
import TimerModal from '@/components/TimerModal'
import { createClient } from '@/lib/supabaseClient'
import '@/app/app/sw-register'

interface Tile {
  id: string
  title: string
  next_step: string
  minutes: number
  difficulty: 'low' | 'med' | 'high'
  category: string
  due_at: string | null
  snooze_count: number
  swap_options?: [string, string]
}

export default function AppPage() {
  const [tile, setTile] = useState<Tile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTimer, setShowTimer] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(15)

  const supabase = createClient()

  const fetchActiveTile = async () => {
    try {
      const response = await fetch('/api/tiles/active')
      const data = await response.json()
      setTile(data.tile)
    } catch (error) {
      console.error('Error fetching tile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveTile()
  }, [])

  const handleCapture = async (text: string) => {
    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: text, source: 'text' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create capture')
      }

      const data = await response.json()
      setTile(data.tile)
    } catch (error: any) {
      alert(error.message || 'Failed to create step')
    }
  }

  const handleStart = () => {
    if (tile) {
      setTimerMinutes(tile.minutes)
      setShowTimer(true)
    }
  }

  const handleSnooze = async (duration: '30m' | '2h' | 'tomorrow') => {
    if (!tile) return

    try {
      const response = await fetch(`/api/tile/${tile.id}/snooze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      })

      if (!response.ok) throw new Error('Failed to snooze')

      // Tile stays active but is snoozed
      await fetchActiveTile()
    } catch (error) {
      alert('Failed to snooze')
    }
  }

  const handleMakeSmaller = async () => {
    if (!tile) return

    try {
      const response = await fetch(`/api/tile/${tile.id}/shrink`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to shrink tile')

      const data = await response.json()
      setTile(data.tile)
    } catch (error) {
      alert('Failed to make smaller')
    }
  }

  const handleDone = async () => {
    if (!tile) return

    try {
      const response = await fetch(`/api/tile/${tile.id}/done`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to complete tile')

      const data = await response.json()
      setTile(data.next_tile || null)
    } catch (error) {
      alert('Failed to complete tile')
    }
  }

  const handleTimerComplete = async () => {
    setShowTimer(false)
    await handleDone()
  }

  const handleTimerContinue = () => {
    setTimerMinutes(10)
    setShowTimer(true)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 min-h-screen bg-[#FAFAF9] -m-4 p-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1F2933] mb-2">
          Your next step
        </h1>
        <p className="text-[#6B7280]">One thing at a time. No guilt. Just progress.</p>
      </div>

      {tile ? (
        <OneTileCard
          tile={tile}
          onStart={handleStart}
          onSnooze={handleSnooze}
          onMakeSmaller={handleMakeSmaller}
          onDone={handleDone}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-[#E5E7EB]">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-lg text-[#1F2933] font-semibold mb-2">No active step right now.</p>
          <p className="text-[#6B7280]">Dump what's on your mind below to get started.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
        <h2 className="text-xl font-semibold text-[#1F2933] mb-2">Brain dump</h2>
        <p className="text-sm text-[#6B7280] mb-4">Type anything. Messy is totally fine.</p>
        <BrainDumpBox onSubmit={handleCapture} />
      </div>

      {showTimer && (
        <TimerModal
          minutes={timerMinutes}
          onComplete={handleTimerComplete}
          onContinue={handleTimerContinue}
          onCancel={() => setShowTimer(false)}
        />
      )}
    </div>
  )
}
