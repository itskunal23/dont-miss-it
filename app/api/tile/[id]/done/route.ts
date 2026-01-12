import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify tile belongs to user
    const { data: tile, error: fetchError } = await supabase
      .from('tiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !tile) {
      return NextResponse.json({ error: 'Tile not found' }, { status: 404 })
    }

    // Mark tile as done
    const { data: updatedTile, error: updateError } = await supabase
      .from('tiles')
      .update({
        status: 'done',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating tile:', updateError)
      return NextResponse.json({ error: 'Failed to complete tile' }, { status: 500 })
    }

    // Activate next queued tile if exists
    const { data: nextTile } = await supabase
      .from('tiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (nextTile) {
      await supabase
        .from('tiles')
        .update({
          status: 'active',
          last_presented_at: new Date().toISOString(),
        })
        .eq('id', nextTile.id)
    }

    // Log event
    await supabase.from('events').insert({
      user_id: user.id,
      event_name: 'tile_completed',
      metadata: {
        tile_id: id,
        minutes: tile.minutes,
        category: tile.category,
      },
    })

    return NextResponse.json({
      tile: updatedTile,
      next_tile: nextTile || null,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
