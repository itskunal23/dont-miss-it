'use client'

import { format } from 'date-fns'

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

interface OneTileCardProps {
  tile: Tile
  onStart: () => void
  onSnooze: (duration: '30m' | '2h' | 'tomorrow') => void
  onMakeSmaller: () => void
  onDone: () => void
  onSwap?: (option: string) => void
}

export default function OneTileCard({
  tile,
  onStart,
  onSnooze,
  onMakeSmaller,
  onDone,
  onSwap,
}: OneTileCardProps) {
  const difficultyColors = {
    low: 'bg-green-100 text-green-800',
    med: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
  }

  const dueDate = tile.due_at ? new Date(tile.due_at) : null
  const isToday = dueDate && format(dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  const isTomorrow = dueDate && format(dueDate, 'yyyy-MM-dd') === format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-light text-slate-900">{tile.title}</h2>
          <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[tile.difficulty]}`}>
            {tile.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="px-2 py-1 bg-slate-100 rounded">{tile.minutes} min</span>
          {dueDate && (
            <span className={`px-2 py-1 rounded ${
              isToday ? 'bg-red-100 text-red-800' : 
              isTomorrow ? 'bg-orange-100 text-orange-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(dueDate, 'MMM d')}
            </span>
          )}
          <span className="text-slate-400">{tile.category}</span>
        </div>
      </div>

      {/* Next Step */}
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-slate-700 leading-relaxed">{tile.next_step}</p>
      </div>

      {/* Swap Options (if available) */}
      {tile.swap_options && onSwap && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">Or choose a different tiny step:</p>
          {tile.swap_options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSwap(option)}
              className="w-full text-left px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onStart}
          className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition shadow-sm"
        >
          Start
        </button>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onSnooze('30m')}
            className="py-2 px-3 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Snooze 30m
          </button>
          <button
            onClick={onMakeSmaller}
            className="py-2 px-3 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Make smaller
          </button>
          <button
            onClick={onDone}
            className="py-2 px-3 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
