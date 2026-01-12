import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { z } from 'zod'
import { createHash } from 'crypto'

const assistSchema = z.object({
  raw_text: z.string().min(1).max(2000),
})

interface OllamaResponse {
  category: string
  title: string
  next_step: string
  minutes: number
  difficulty: 'low' | 'med' | 'high'
  due_at: string | null
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if Ollama is enabled
    if (process.env.ENABLE_OLLAMA_ASSIST !== 'true') {
      return NextResponse.json(
        { error: 'Smart Assist is not enabled' },
        { status: 503 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Pro
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const profileData = profile as { plan: 'free' | 'pro' } | null
    if (!profileData || profileData.plan !== 'pro') {
      return NextResponse.json(
        { error: 'Smart Assist is only available for Pro users' },
        { status: 403 }
      )
    }

    // Check rate limit (30/day for Pro)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('event_name', 'ai_assist_used')
      .gte('created_at', today.toISOString())

    if (count && count >= 30) {
      return NextResponse.json(
        { error: 'Daily rate limit reached (30/day)' },
        { status: 429 }
      )
    }

    // Parse request
    const body = await request.json()
    const validated = assistSchema.parse(body)

    // Check cache (hash of text + user_id + day)
    const day = today.toISOString().split('T')[0]
    const cacheKey = createHash('sha256')
      .update(`${validated.raw_text}:${user.id}:${day}`)
      .digest('hex')

    const { data: cached } = await supabase
      .from('events')
      .select('metadata')
      .eq('user_id', user.id)
      .eq('event_name', 'ai_assist_cached')
      .eq('metadata->>cache_key', cacheKey)
      .single()

    const cachedData = cached as { metadata?: { cache_key?: string; response?: OllamaResponse } } | null
    if (cachedData && cachedData.metadata && cachedData.metadata.response) {
      return NextResponse.json(cachedData.metadata.response)
    }

    // Call Ollama
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    const model = process.env.OLLAMA_MODEL || 'llama3.1:8b-instruct'

    const prompt = `You are a helpful assistant that converts user brain dumps into structured next steps.

User input: "${validated.raw_text}"

Return ONLY valid JSON matching this exact schema (no extra text, no markdown):
{
  "category": "job|school|life admin|health|finance|relationships|home|errands|other",
  "title": "Short title (max 50 chars)",
  "next_step": "One specific micro-step the user can do in 10-20 minutes",
  "minutes": 15,
  "difficulty": "low|med|high",
  "due_at": "ISO date string or null",
  "notes": "Optional brief note"
}`

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    let parsed: OllamaResponse

    try {
      // Extract JSON from response
      const responseText = data.response || ''
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsed = JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse Ollama response:', error)
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Validate response structure
    if (!parsed.category || !parsed.title || !parsed.next_step || !parsed.minutes) {
      return NextResponse.json(
        { error: 'Invalid response structure from AI' },
        { status: 500 }
      )
    }

    // Cache the response
    await supabase.from('events').insert({
      user_id: user.id,
      event_name: 'ai_assist_cached',
      metadata: {
        cache_key: cacheKey,
        response: parsed,
      },
    } as never)

    // Log usage
    await supabase.from('events').insert({
      user_id: user.id,
      event_name: 'ai_assist_used',
      metadata: {
        raw_text_length: validated.raw_text.length,
      },
    } as never)

    return NextResponse.json(parsed)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('AI assist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
