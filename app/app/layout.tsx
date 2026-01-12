import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/app" className="text-lg font-semibold text-[#1F2933] hover:text-[#4F46E5] transition-colors">
            Dont Miss It
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/app/queue"
              className="text-sm text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors"
            >
              Queue
            </Link>
            <Link
              href="/app/insights"
              className="text-sm text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/app/settings"
              className="text-sm text-[#6B7280] hover:text-[#1F2933] font-medium transition-colors"
            >
              Settings
            </Link>
            {profile?.plan === 'free' && (
              <Link
                href="/pricing"
                className="text-sm px-3 py-1.5 bg-[#4F46E5] text-white rounded-lg font-medium hover:bg-[#4338CA] transition-colors"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      <PWAInstallPrompt />
    </div>
  )
}
