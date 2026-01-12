'use client'

import { useState, useEffect } from 'react'

interface TimerModalProps {
  minutes: number
  onComplete: () => void
  onContinue: () => void
  onCancel: () => void
}

export default function TimerModal({ minutes, onComplete, onContinue, onCancel }: TimerModalProps) {
  const [seconds, setSeconds] = useState(minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds <= 0 && !isFinished) {
        setIsFinished(true)
        setIsRunning(false)
      }
      return
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsFinished(true)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, seconds, isFinished])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((minutes * 60 - seconds) / (minutes * 60)) * 100

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
          <div className="text-6xl">✨</div>
          <div>
            <h3 className="text-2xl font-light text-slate-900 mb-2">Time's up!</h3>
            <p className="text-slate-600">You showed up. That's what counts.</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={onComplete}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
            >
              I'm done
            </button>
            <button
              onClick={onContinue}
              className="w-full py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Continue for 10 more minutes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
        <div>
          <div className="text-5xl font-light text-slate-900 mb-2">{formatTime(seconds)}</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-slate-900 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
            >
              Start timer
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="w-full py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Pause
            </button>
          )}
          <button
            onClick={onCancel}
            className="w-full py-2 px-4 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
