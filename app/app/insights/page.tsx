'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

interface Insights {
  bestTimeOfDay: string | null
  totalCompleted: number
  averageMinutes: number
  topCategory: string | null
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get completed tiles
      const { data: completedTiles } = await supabase
        .from('tiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'done')

      // Get events for time-of-day analysis
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_name', 'tile_completed')

      // Simple heuristic: count completions by hour
      const hourCounts: Record<number, number> = {}
      events?.forEach((event: any) => {
        const hour = new Date(event.created_at).getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      })

      const bestHour = Object.entries(hourCounts).reduce(
        (a, b) => (hourCounts[Number(b[0])] > hourCounts[Number(a[0])] ? b : a),
        ['12', 0]
      )[0]

      let bestTimeOfDay: string | null = null
      if (bestHour) {
        const hour = Number(bestHour)
        if (hour >= 5 && hour < 12) bestTimeOfDay = 'morning'
        else if (hour >= 12 && hour < 17) bestTimeOfDay = 'afternoon'
        else if (hour >= 17 && hour < 22) bestTimeOfDay = 'night'
        else bestTimeOfDay = 'varies'
      }

      // Category analysis
      const categoryCounts: Record<string, number> = {}
      completedTiles?.forEach((tile: any) => {
        categoryCounts[tile.category] = (categoryCounts[tile.category] || 0) + 1
      })

      const topCategory = Object.entries(categoryCounts).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ['none', 0]
      )[0]

      const averageMinutes =
        completedTiles && completedTiles.length > 0
          ? Math.round(
              completedTiles.reduce((sum: number, tile: any) => sum + tile.minutes, 0) /
                completedTiles.length
            )
          : 0

      setInsights({
        bestTimeOfDay,
        totalCompleted: completedTiles?.length || 0,
        averageMinutes,
        topCategory: topCategory !== 'none' ? topCategory : null,
      })
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!insights || insights.totalCompleted === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-light text-slate-900 mb-2">Insights</h1>
          <p className="text-slate-600">What works for you</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-100">
          <p className="text-slate-600">Complete a few steps to see insights.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light text-slate-900 mb-2">Insights</h1>
        <p className="text-slate-600">What works for you</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Total steps completed</h3>
          <p className="text-3xl font-light text-slate-900">{insights.totalCompleted}</p>
        </div>

        {insights.bestTimeOfDay && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Your best time</h3>
            <p className="text-2xl font-light text-slate-900 capitalize">{insights.bestTimeOfDay}</p>
            <p className="text-xs text-slate-500 mt-1">When you usually get things done</p>
          </div>
        )}

        {insights.averageMinutes > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Average step size</h3>
            <p className="text-2xl font-light text-slate-900">{insights.averageMinutes} minutes</p>
          </div>
        )}

        {insights.topCategory && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Most common category</h3>
            <p className="text-2xl font-light text-slate-900 capitalize">{insights.topCategory}</p>
          </div>
        )}
      </div>
    </div>
  )
}
