/**
 * Anti-avoidance: rewrites steps when user has snoozed multiple times
 */

import { StepResult } from './steps'

export function applyAntiAvoidance(
  stepResult: StepResult,
  snoozeCount: number
): StepResult {
  if (snoozeCount < 2) {
    return stepResult
  }

  let { next_step, minutes, difficulty } = stepResult

  // After 2 snoozes: reduce time and make step setup-only
  if (snoozeCount >= 2 && snoozeCount < 4) {
    minutes = Math.max(5, minutes - 5)
    
    // Rewrite to setup-only actions
    if (!next_step.toLowerCase().includes('open') && 
        !next_step.toLowerCase().includes('find') &&
        !next_step.toLowerCase().includes('locate')) {
      // Extract the main action and make it setup-only
      if (next_step.includes('write')) {
        next_step = 'Open a blank document and draft 2 bullet points.'
      } else if (next_step.includes('review') || next_step.includes('study')) {
        next_step = 'Open notes and locate the section you need.'
      } else if (next_step.includes('do') || next_step.includes('complete')) {
        next_step = 'Open the thing and find where to start.'
      } else {
        next_step = `Open the thing and find what you need.`
      }
    }
    
    difficulty = 'low'
  }

  // After 4 snoozes: minimal setup step
  if (snoozeCount >= 4) {
    minutes = 5
    next_step = 'Open the thing. Just open it. That\'s enough for now.'
    difficulty = 'low'
  }

  return {
    next_step,
    minutes,
    difficulty,
  }
}

export function generateSwapOptions(
  originalStep: string,
  category: string
): [string, string] {
  // Generate two alternative tiny steps
  const options: Record<string, [string, string]> = {
    default: [
      'Open the thing and look at it for 2 minutes.',
      'Find where you left off last time.',
    ],
    job: [
      'Open your email and read the subject line.',
      'Open the document and read the first paragraph.',
    ],
    school: [
      'Open your notes and read the first heading.',
      'Open the textbook and find the page number.',
    ],
    finance: [
      'Open the website and log in.',
      'Find the account balance page.',
    ],
    home: [
      'Look at the space and pick one tiny thing.',
      'Set a 5-minute timer and start.',
    ],
  }

  return options[category] || options.default
}
