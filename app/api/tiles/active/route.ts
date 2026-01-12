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

    const { data: tile, error } = await supabase
      .from('tiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching active tile:', error)
      return NextResponse.json({ error: 'Failed to fetch tile' }, { status: 500 })
    }

    return NextResponse.json({ tile: tile || null })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
