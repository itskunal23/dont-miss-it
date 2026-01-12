// Type definitions for Dont Miss It
// Note: DashboardClient.tsx appears to be from a different project
// These types are stubs to resolve import errors

export interface Deadline {
  id: string
  title: string
  dueDate: Date
  category: DeadlineCategory
  recurrence?: DeadlineRecurrence
}

export type DeadlineCategory = 
  | 'job'
  | 'school'
  | 'life admin'
  | 'health'
  | 'finance'
  | 'relationships'
  | 'home'
  | 'errands'
  | 'other'

export type DeadlineRecurrence = 
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'

// Re-export database types
export * from './database.types'
