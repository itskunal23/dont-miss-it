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
    low: 'bg-[#86EFAC]/20 text-[#059669] border-[#86EFAC]/40',
    med: 'bg-[#FDE68A]/20 text-[#D97706] border-[#FDE68A]/40',
    high: 'bg-[#FCA5A5]/20 text-[#DC2626] border-[#FCA5A5]/40',
  }

  const dueDate = tile.due_at ? new Date(tile.due_at) : null
  const isToday = dueDate && format(dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  const isTomorrow = dueDate && format(dueDate, 'yyyy-MM-dd') === format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 border border-[#E5E7EB] hover:border-[#4F46E5]/30 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-semibold text-[#1F2933] group-hover:text-[#4F46E5] transition-colors">{tile.title}</h2>
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${difficultyColors[tile.difficulty]}`}>
            {tile.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="px-2.5 py-1 bg-[#4F46E5]/10 text-[#4F46E5] rounded-md font-medium">{tile.minutes} min</span>
          {dueDate && (
            <span className={`px-2.5 py-1 rounded-md font-medium ${
              isToday ? 'bg-red-50 text-red-700 border border-red-200' : 
              isTomorrow ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
              'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20'
            }`}>
              {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(dueDate, 'MMM d')}
            </span>
          )}
          <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#6B7280] rounded-md font-medium">{tile.category}</span>
        </div>
      </div>

      {/* Next Step */}
      <div className="bg-[#FAFAF9] rounded-xl p-5 border border-[#E5E7EB]">
        <p className="text-[#1F2933] leading-relaxed font-medium">{tile.next_step}</p>
      </div>

      {/* Swap Options (if available) */}
      {tile.swap_options && onSwap && (
        <div className="space-y-2">
          <p className="text-sm text-[#6B7280]">Or choose a different tiny step:</p>
          {tile.swap_options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSwap(option)}
              className="w-full text-left px-4 py-2 bg-[#F8FAFC] hover:bg-[#E5E7EB] rounded-lg text-sm text-[#1F2933] transition"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onStart}
          className="w-full py-3 px-4 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors shadow-sm hover:shadow-md"
        >
          Start
        </button>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onSnooze('30m')}
            className="py-2 px-3 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#FAFAF9] hover:border-[#4F46E5]/30 transition-all font-medium text-[#6B7280] hover:text-[#1F2933]"
          >
            Snooze 30m
          </button>
          <button
            onClick={onMakeSmaller}
            className="py-2 px-3 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#FAFAF9] hover:border-[#4F46E5]/30 transition-all font-medium text-[#6B7280] hover:text-[#1F2933]"
          >
            Make smaller
          </button>
          <button
            onClick={onDone}
            className="py-2 px-3 text-sm border border-[#86EFAC] bg-[#86EFAC]/10 text-[#059669] rounded-lg hover:bg-[#86EFAC]/20 transition-all font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
