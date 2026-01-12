'use client'

import { useState } from 'react'

interface BrainDumpBoxProps {
  onSubmit: (text: string) => Promise<void>
  disabled?: boolean
}

export default function BrainDumpBox({ onSubmit, disabled }: BrainDumpBoxProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || loading || disabled) return

    setLoading(true)
    try {
      await onSubmit(text.trim())
      setText('')
    } catch (error) {
      console.error('Error submitting capture:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type anything... 'Reply to Sarah, pay bill by Friday, study for exam'"
        disabled={disabled || loading}
        rows={4}
        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none disabled:opacity-50 disabled:cursor-not-allowed bg-white text-[#1F2933] placeholder:text-[#6B7280] transition-all"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading || disabled}
        className="w-full py-3 px-4 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating your step...' : 'Turn into next step'}
      </button>
    </form>
  )
}
