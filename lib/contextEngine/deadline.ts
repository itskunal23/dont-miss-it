/**
 * Deadline radar: detects and parses deadline mentions
 */

import { parse, addDays, startOfDay, endOfDay, nextFriday, isFriday, addWeeks } from 'date-fns'

export interface DeadlineResult {
  due_at: Date | null
  confidence: number
}

const TODAY_PATTERNS = [
  /\btoday\b/i,
  /\btonight\b/i,
  /\bthis evening\b/i,
]

const TOMORROW_PATTERNS = [
  /\btomorrow\b/i,
  /\btomorrow night\b/i,
]

const THIS_WEEK_PATTERNS = [
  /\bthis week\b/i,
  /\bby end of week\b/i,
]

const FRIDAY_PATTERNS = [
  /\bby friday\b/i,
  /\bfriday\b/i,
  /\bthis friday\b/i,
]

const DATE_PATTERNS = [
  /\bby (\d{1,2}\/\d{1,2})\b/i, // by 1/15
  /\bby (\d{1,2}\/\d{1,2}\/\d{2,4})\b/i, // by 1/15/2024
  /\b(\w+ \d{1,2})\b/i, // Jan 15
  /\b(\w+ \d{1,2},? \d{4})\b/i, // Jan 15, 2024
]

export function detectDeadline(text: string, userTimezone: string = 'UTC'): DeadlineResult {
  const now = new Date()
  const today = startOfDay(now)
  let due_at: Date | null = null
  let confidence = 0

  // Check for "today" patterns
  if (TODAY_PATTERNS.some(pattern => pattern.test(text))) {
    due_at = endOfDay(today)
    confidence = 0.9
    return { due_at, confidence }
  }

  // Check for "tomorrow" patterns
  if (TOMORROW_PATTERNS.some(pattern => pattern.test(text))) {
    due_at = endOfDay(addDays(today, 1))
    confidence = 0.9
    return { due_at, confidence }
  }

  // Check for "this week" patterns
  if (THIS_WEEK_PATTERNS.some(pattern => pattern.test(text))) {
    const thisFriday = isFriday(today) ? today : nextFriday(today)
    due_at = endOfDay(thisFriday)
    confidence = 0.7
    return { due_at, confidence }
  }

  // Check for "Friday" patterns
  if (FRIDAY_PATTERNS.some(pattern => pattern.test(text))) {
    const thisFriday = isFriday(today) ? today : nextFriday(today)
    due_at = endOfDay(thisFriday)
    confidence = 0.8
    return { due_at, confidence }
  }

  // Check for explicit dates
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      try {
        const dateStr = match[1]
        // Try parsing with current year if year not provided
        let parsedDate = parse(dateStr, 'M/d', now)
        if (isNaN(parsedDate.getTime())) {
          parsedDate = parse(dateStr, 'M/d/yyyy', now)
        }
        if (isNaN(parsedDate.getTime())) {
          parsedDate = parse(dateStr, 'MMM d', now)
        }
        if (isNaN(parsedDate.getTime())) {
          parsedDate = parse(dateStr, 'MMM d, yyyy', now)
        }

        if (!isNaN(parsedDate.getTime())) {
          // If date is in the past, assume next year
          if (parsedDate < today) {
            parsedDate = addWeeks(parsedDate, 52)
          }
          due_at = endOfDay(parsedDate)
          confidence = 0.85
          return { due_at, confidence }
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }

  return { due_at: null, confidence: 0 }
}
