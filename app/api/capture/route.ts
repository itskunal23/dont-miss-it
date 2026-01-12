import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { processCapture } from '@/lib/contextEngine'
import { z } from 'zod'

const captureSchema = z.object({
  raw_text: z.string().min(1).max(2000),
  source: z.enum(['text', 'voice']).default('text'),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const profileData = profile as { 
      plan: 'free' | 'pro'
      preferred_minutes_default: number
      energy_default: 'low' | 'normal' | 'high'
      timezone: string | null
    } | null
    if (!profileData) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check free tier limit (25 captures/month)
    if (profileData.plan === 'free') {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('captures')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if (count && count >= 25) {
        return NextResponse.json(
          { error: 'Monthly capture limit reached. Upgrade to Pro for unlimited captures.' },
          { status: 403 }
        )
      }
    }

    // Parse and validate request body
    const body = await request.json()
    const validated = captureSchema.parse(body)

    // Create capture
    const { data: capture, error: captureError } = await supabase
      .from('captures')
      .insert({
        user_id: user.id,
        raw_text: validated.raw_text,
        source: validated.source,
      } as never)
      .select()
      .single()

    if (captureError || !capture) {
      console.error('Capture creation error:', captureError)
      return NextResponse.json({ error: 'Failed to create capture' }, { status: 500 })
    }

    const captureData = capture as { id: string } | null
    if (!captureData) {
      return NextResponse.json({ error: 'Failed to create capture' }, { status: 500 })
    }

    // Check if user has active tile
    const { data: activeTile } = await supabase
      .from('tiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    // Process capture with context engine
    let tileData = processCapture({
      raw_text: validated.raw_text,
      user_id: user.id,
      preferred_minutes: profileData.preferred_minutes_default,
      energy_mode: profileData.energy_default,
      timezone: profileData.timezone || 'UTC',
      snooze_count: 0,
    })

    // If confidence is low and user is Pro, try Ollama Smart Assist
    if (
      tileData.confidence < 0.6 &&
      profileData.plan === 'pro' &&
      process.env.ENABLE_OLLAMA_ASSIST === 'true'
    ) {
      try {
        const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/assist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw_text: validated.raw_text }),
        })

        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          // Merge AI response with context engine data
          tileData = {
            ...tileData,
            title: aiData.title || tileData.title,
            next_step: aiData.next_step || tileData.next_step,
            minutes: aiData.minutes || tileData.minutes,
            difficulty: aiData.difficulty || tileData.difficulty,
            category: aiData.category || tileData.category,
            due_at: aiData.due_at ? new Date(aiData.due_at) : tileData.due_at,
            confidence: 0.85, // Higher confidence from AI
          }
        }
      } catch (error) {
        // Fall back to rules-based result if AI fails
        console.error('AI assist failed, using rules-based result:', error)
      }
    }

    // Determine status: active if no active tile, otherwise queued
    const status = activeTile ? 'queued' : 'active'

    // Create tile
    const { data: tile, error: tileError } = await supabase
      .from('tiles')
      .insert({
        user_id: user.id,
        capture_id: captureData.id,
        title: tileData.title,
        next_step: tileData.next_step,
        minutes: tileData.minutes,
        difficulty: tileData.difficulty,
        category: tileData.category,
        due_at: tileData.due_at?.toISOString() || null,
        status,
        snooze_count: 0,
        last_presented_at: status === 'active' ? new Date().toISOString() : null,
      } as never)
      .select()
      .single()

    if (tileError) {
      console.error('Tile creation error:', tileError)
      return NextResponse.json({ error: 'Failed to create tile' }, { status: 500 })
    }

    // Log event
    const tileData2 = tile as { id: string } | null
    if (tileData2) {
      await supabase.from('events').insert({
        user_id: user.id,
        event_name: 'capture_created',
        metadata: {
          capture_id: captureData.id,
          tile_id: tileData2.id,
          status,
          confidence: tileData.confidence,
        },
      } as never)
    }

    const tileResponse = tile as { id: string; [key: string]: any } | null
    return NextResponse.json({
      capture: captureData,
      tile: tileResponse ? {
        ...tileResponse,
        swap_options: tileData.swap_options,
      } : null,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
