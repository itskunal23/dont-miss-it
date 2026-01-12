'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  plan: 'free' | 'pro'
  preferred_minutes_default: number
  preferred_time_of_day: string | null
  energy_default: 'low' | 'normal' | 'high'
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleUpdate = async (field: keyof Profile, value: string | number) => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', profile.id)

      if (error) throw error

      setProfile({ ...profile, [field]: value as never })
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update')
    } finally {
      setSaving(false)
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
        <h1 className="text-3xl font-light text-slate-900 mb-2">Settings</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-slate-100">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Default step size (minutes)
          </label>
          <select
            value={profile?.preferred_minutes_default || 15}
            onChange={(e) => handleUpdate('preferred_minutes_default', Number(e.target.value))}
            disabled={saving}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preferred time of day
          </label>
          <select
            value={profile?.preferred_time_of_day || 'varies'}
            onChange={(e) => handleUpdate('preferred_time_of_day', e.target.value)}
            disabled={saving}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
            <option value="varies">It varies</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Energy mode
          </label>
          <select
            value={profile?.energy_default || 'normal'}
            onChange={(e) => handleUpdate('energy_default', e.target.value)}
            disabled={saving}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-2">Plan: <span className="font-medium capitalize">{profile?.plan || 'free'}</span></p>
          {profile?.plan === 'free' && (
            <a
              href="/pricing"
              className="text-sm text-slate-900 hover:underline"
            >
              Upgrade to Pro →
            </a>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
