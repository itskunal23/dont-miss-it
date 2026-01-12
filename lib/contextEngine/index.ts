/**
 * Main Context Engine: converts raw capture text into structured tile
 */

import { classifyCategory } from './classify'
import { detectDeadline } from './deadline'
import { generateStep, StepResult } from './steps'
import { applyAntiAvoidance, generateSwapOptions } from './antiAvoidance'

export interface TileInput {
  raw_text: string
  user_id: string
  preferred_minutes?: number
  energy_mode?: 'low' | 'normal' | 'high'
  timezone?: string
  snooze_count?: number
}

export interface TileOutput {
  title: string
  next_step: string
  minutes: number
  difficulty: 'low' | 'med' | 'high'
  category: string
  due_at: Date | null
  confidence: number
  swap_options?: [string, string]
}

export function generateTitle(text: string, category: string): string {
  // Extract a short title (first 50 chars or first sentence)
  const firstSentence = text.split(/[.!?]/)[0].trim()
  if (firstSentence.length <= 50) {
    return firstSentence
  }
  
  // Take first 50 chars and add ellipsis
  return text.substring(0, 47).trim() + '...'
}

export function processCapture(input: TileInput): TileOutput {
  const {
    raw_text,
    preferred_minutes = 15,
    energy_mode = 'normal',
    timezone = 'UTC',
    snooze_count = 0,
  } = input

  // Step 1: Classify category
  const category = classifyCategory(raw_text)

  // Step 2: Detect deadline
  const { due_at, confidence: deadlineConfidence } = detectDeadline(raw_text, timezone)

  // Step 3: Generate step
  let stepResult = generateStep(raw_text, preferred_minutes, energy_mode)

  // Step 4: Apply anti-avoidance if needed
  stepResult = applyAntiAvoidance(stepResult, snooze_count)

  // Step 5: Generate title
  const title = generateTitle(raw_text, category)

  // Step 6: Calculate overall confidence
  // Base confidence from step matching
  let confidence = stepResult.next_step.includes('Open the thing') ? 0.5 : 0.8
  
  // Boost if deadline detected
  if (deadlineConfidence > 0) {
    confidence = Math.min(1.0, confidence + 0.1)
  }
  
  // Boost if category matched
  if (category !== 'other') {
    confidence = Math.min(1.0, confidence + 0.1)
  }

  // Step 7: Generate swap options if heavily snoozed
  let swap_options: [string, string] | undefined
  if (snooze_count >= 4) {
    swap_options = generateSwapOptions(stepResult.next_step, category)
  }

  return {
    title,
    next_step: stepResult.next_step,
    minutes: stepResult.minutes,
    difficulty: stepResult.difficulty,
    category,
    due_at,
    confidence,
    swap_options,
  }
}
