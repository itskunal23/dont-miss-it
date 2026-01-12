/**
 * Step generator: creates micro-steps based on capture content
 */

export interface StepResult {
  next_step: string
  minutes: number
  difficulty: 'low' | 'med' | 'high'
}

const STEP_RULES: Array<{
  pattern: RegExp
  step: string
  minutes: number
  difficulty: 'low' | 'med' | 'high'
}> = [
  {
    pattern: /\b(email|reply|message|respond|text|dm)\b/i,
    step: 'Open the thread and write 1 sentence reply.',
    minutes: 10,
    difficulty: 'low',
  },
  {
    pattern: /\b(study|exam|test|quiz|review|notes|read|chapter)\b/i,
    step: 'Open notes and review one section for 15 minutes.',
    minutes: 15,
    difficulty: 'med',
  },
  {
    pattern: /\b(pay|bill|renew|payment|invoice|subscription)\b/i,
    step: 'Open the website/app and find the payment/renewal page.',
    minutes: 10,
    difficulty: 'low',
  },
  {
    pattern: /\b(schedule|book|appointment|meeting|calendar|reserve)\b/i,
    step: 'Open calendar and find 2 possible slots.',
    minutes: 10,
    difficulty: 'low',
  },
  {
    pattern: /\b(clean|laundry|organize|declutter|tidy|wash|dishes)\b/i,
    step: 'Set a 10 min timer and do the easiest visible chunk.',
    minutes: 10,
    difficulty: 'low',
  },
  {
    pattern: /\b(call|phone|ring|dial)\b/i,
    step: 'Open contacts and dial the number.',
    minutes: 5,
    difficulty: 'low',
  },
  {
    pattern: /\b(write|draft|create|make|build)\b/i,
    step: 'Open a blank document and write 2-3 bullet points.',
    minutes: 15,
    difficulty: 'med',
  },
  {
    pattern: /\b(research|look up|find|search|google)\b/i,
    step: 'Open browser and search for one specific question.',
    minutes: 10,
    difficulty: 'low',
  },
]

export function generateStep(
  text: string,
  preferredMinutes: number = 15,
  energyMode: 'low' | 'normal' | 'high' = 'normal'
): StepResult {
  const lowerText = text.toLowerCase()

  // Find matching rule
  for (const rule of STEP_RULES) {
    if (rule.pattern.test(lowerText)) {
      let minutes = rule.minutes
      let difficulty = rule.difficulty

      // Adjust based on energy mode
      if (energyMode === 'low') {
        minutes = Math.max(5, minutes - 5)
        difficulty = difficulty === 'high' ? 'med' : 'low'
      } else if (energyMode === 'high') {
        minutes = Math.min(30, minutes + 5)
      }

      // Respect preferred minutes if close
      if (Math.abs(minutes - preferredMinutes) <= 5) {
        minutes = preferredMinutes
      }

      return {
        next_step: rule.step,
        minutes,
        difficulty,
      }
    }
  }

  // Default step
  let minutes = preferredMinutes
  if (energyMode === 'low') {
    minutes = Math.max(5, minutes - 5)
  } else if (energyMode === 'high') {
    minutes = Math.min(30, minutes + 5)
  }

  return {
    next_step: 'Open the thing and do the smallest possible action for 10 minutes.',
    minutes,
    difficulty: 'low',
  }
}
