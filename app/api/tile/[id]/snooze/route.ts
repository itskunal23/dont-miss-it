import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { z } from 'zod'

const snoozeSchema = z.object({
  duration: z.enum(['30m', '2h', 'tomorrow']),
})

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

    const tileData = tile as { 
      status: string
      snooze_count: number
    } | null
    if (!tileData) {
      return NextResponse.json({ error: 'Tile not found' }, { status: 404 })
    }

    if (tileData.status !== 'active') {
      return NextResponse.json({ error: 'Tile is not active' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const validated = snoozeSchema.parse(body)

    // Calculate next presentation time
    const now = new Date()
    let nextPresentAt: Date

    switch (validated.duration) {
      case '30m':
        nextPresentAt = new Date(now.getTime() + 30 * 60 * 1000)
        break
      case '2h':
        nextPresentAt = new Date(now.getTime() + 2 * 60 * 60 * 1000)
        break
      case 'tomorrow':
        nextPresentAt = new Date(now)
        nextPresentAt.setDate(nextPresentAt.getDate() + 1)
        nextPresentAt.setHours(9, 0, 0, 0) // 9 AM tomorrow
        break
    }

    const { data: updatedTile, error: updateError } = await supabase
      .from('tiles')
      .update({
        snooze_count: tileData.snooze_count + 1,
        last_presented_at: nextPresentAt.toISOString(),
      } as never)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating tile:', updateError)
      return NextResponse.json({ error: 'Failed to snooze tile' }, { status: 500 })
    }

    // Log event
    const updatedTileData = updatedTile as { snooze_count: number } | null
    if (updatedTileData) {
      await supabase.from('events').insert({
        user_id: user.id,
        event_name: 'tile_snoozed',
        metadata: {
          tile_id: id,
          duration: validated.duration,
          snooze_count: updatedTileData.snooze_count,
        },
      } as never)
    }

    return NextResponse.json({ tile: updatedTile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
