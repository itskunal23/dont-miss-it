/**
 * Category classification via keyword maps
 */

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  job: [
    'work', 'job', 'career', 'boss', 'manager', 'colleague', 'meeting', 'deadline',
    'project', 'task', 'report', 'presentation', 'client', 'email', 'office'
  ],
  school: [
    'school', 'class', 'homework', 'assignment', 'exam', 'test', 'quiz', 'study',
    'professor', 'teacher', 'essay', 'paper', 'due', 'semester', 'course', 'lecture'
  ],
  'life admin': [
    'insurance', 'tax', 'document', 'form', 'application', 'renew', 'license',
    'registration', 'paperwork', 'bureaucracy', 'government', 'legal'
  ],
  health: [
    'doctor', 'appointment', 'dentist', 'medical', 'health', 'exercise', 'gym',
    'workout', 'therapy', 'medication', 'prescription', 'checkup'
  ],
  finance: [
    'bill', 'payment', 'pay', 'money', 'budget', 'bank', 'account', 'credit',
    'debit', 'invoice', 'expense', 'refund', 'subscription', 'renewal'
  ],
  relationships: [
    'friend', 'family', 'call', 'text', 'message', 'birthday', 'anniversary',
    'visit', 'dinner', 'lunch', 'coffee', 'hangout', 'catch up'
  ],
  home: [
    'clean', 'laundry', 'dishes', 'organize', 'declutter', 'repair', 'fix',
    'maintenance', 'furniture', 'move', 'pack', 'unpack'
  ],
  errands: [
    'grocery', 'shopping', 'store', 'pickup', 'delivery', 'post office',
    'pharmacy', 'dry cleaner', 'car', 'gas', 'oil change'
  ],
}

export function classifyCategory(text: string): string {
  const lowerText = text.toLowerCase()
  const scores: Record<string, number> = {}

  // Count keyword matches
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = keywords.reduce((count, keyword) => {
      return count + (lowerText.includes(keyword) ? 1 : 0)
    }, 0)
  }

  // Find category with highest score
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) {
    return 'other'
  }

  const topCategory = Object.entries(scores).find(
    ([, score]) => score === maxScore
  )?.[0]

  return topCategory || 'other'
}
