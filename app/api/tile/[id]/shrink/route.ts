import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { applyAntiAvoidance } from '@/lib/contextEngine/antiAvoidance'

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

    if (tile.status !== 'active') {
      return NextResponse.json({ error: 'Tile is not active' }, { status: 400 })
    }

    // Apply anti-avoidance to make step smaller
    const smallerStep = applyAntiAvoidance(
      {
        next_step: tile.next_step,
        minutes: tile.minutes,
        difficulty: tile.difficulty,
      },
      tile.snooze_count + 1 // Treat as if snoozed once more
    )

    // Update tile
    const { data: updatedTile, error: updateError } = await supabase
      .from('tiles')
      .update({
        next_step: smallerStep.next_step,
        minutes: smallerStep.minutes,
        difficulty: smallerStep.difficulty,
        snooze_count: tile.snooze_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating tile:', updateError)
      return NextResponse.json({ error: 'Failed to shrink tile' }, { status: 500 })
    }

    // Log event
    await supabase.from('events').insert({
      user_id: user.id,
      event_name: 'tile_shrunk',
      metadata: {
        tile_id: id,
        old_minutes: tile.minutes,
        new_minutes: smallerStep.minutes,
      },
    })

    return NextResponse.json({ tile: updatedTile })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
