import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: tiles, error } = await supabase
      .from('tiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'queued')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching queued tiles:', error)
      return NextResponse.json({ error: 'Failed to fetch tiles' }, { status: 500 })
    }

    return NextResponse.json({ tiles: tiles || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
