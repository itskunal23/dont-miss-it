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
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Dump what's on your mind..."
        disabled={disabled || loading}
        rows={3}
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading || disabled}
        className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating step...' : 'Turn into next step'}
      </button>
    </form>
  )
}
