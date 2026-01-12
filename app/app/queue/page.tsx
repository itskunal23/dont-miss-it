'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Tile {
  id: string
  title: string
  next_step: string
  minutes: number
  category: string
  due_at: string | null
  created_at: string
}

export default function QueuePage() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/tiles/queue')
      const data = await response.json()
      setTiles(data.tiles || [])
    } catch (error) {
      console.error('Error fetching queue:', error)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light text-slate-900 mb-2">Your queue</h1>
        <p className="text-slate-600">These steps are waiting for you. No rush.</p>
      </div>

      {tiles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-100">
          <p className="text-slate-600">Your queue is empty.</p>
          <p className="text-sm text-slate-500 mt-2">New steps will appear here when you have an active tile.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tiles.map((tile) => {
            const dueDate = tile.due_at ? new Date(tile.due_at) : null
            return (
              <div
                key={tile.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-light text-slate-900">{tile.title}</h3>
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                    {tile.minutes} min
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3">{tile.next_step}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{tile.category}</span>
                  {dueDate && (
                    <>
                      <span>•</span>
                      <span>Due {format(dueDate, 'MMM d')}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Added {format(new Date(tile.created_at), 'MMM d')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
