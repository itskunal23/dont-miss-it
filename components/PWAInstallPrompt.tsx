'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowPrompt(false)
    }

    setDeferredPrompt(null)
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-4 z-50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-[#1F2933] mb-1">Install Dont Miss It</h3>
          <p className="text-sm text-[#6B7280]">Add to your home screen for quick access</p>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-[#6B7280] hover:text-[#1F2933]"
        >
          ×
        </button>
      </div>
      <button
        onClick={handleInstall}
        className="w-full mt-3 py-2 px-4 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition"
      >
        Install
      </button>
    </div>
  )
}
