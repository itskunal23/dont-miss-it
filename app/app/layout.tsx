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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/app" className="text-xl font-light text-slate-900">
            QuietDeadline
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/app/queue"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Queue
            </Link>
            <Link
              href="/app/insights"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Insights
            </Link>
            <Link
              href="/app/settings"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Settings
            </Link>
            {profile?.plan === 'free' && (
              <Link
                href="/pricing"
                className="text-sm px-3 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
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
