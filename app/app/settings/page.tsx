'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
    
    // Handle Stripe redirect success
    if (searchParams.get('success') === 'true') {
      // Show success message or refresh profile
      setTimeout(() => {
        fetchProfile()
      }, 1000)
    }
  }, [searchParams])

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
        .update({ [field]: value } as never)
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
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#1F2933] mb-2">Settings</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 border border-[#E5E7EB]">
        <div>
          <label className="block text-sm font-medium text-[#1F2933] mb-2">
            Default step size (minutes)
          </label>
          <select
            value={profile?.preferred_minutes_default || 15}
            onChange={(e) => handleUpdate('preferred_minutes_default', Number(e.target.value))}
            disabled={saving}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white text-[#1F2933]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2933] mb-2">
            Preferred time of day
          </label>
          <select
            value={profile?.preferred_time_of_day || 'varies'}
            onChange={(e) => handleUpdate('preferred_time_of_day', e.target.value)}
            disabled={saving}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white text-[#1F2933]"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
            <option value="varies">It varies</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2933] mb-2">
            Energy mode
          </label>
          <select
            value={profile?.energy_default || 'normal'}
            onChange={(e) => handleUpdate('energy_default', e.target.value)}
            disabled={saving}
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white text-[#1F2933]"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-2">Plan: <span className="font-semibold capitalize text-[#1F2933]">{profile?.plan || 'free'}</span></p>
          {profile?.plan === 'free' && (
            <a
              href="/pricing"
              className="text-sm text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
            >
              Upgrade to Pro →
            </a>
          )}
        </div>

        <div className="pt-4 border-t border-[#E5E7EB]">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
