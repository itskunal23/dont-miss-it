export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          plan: 'free' | 'pro'
          timezone: string | null
          preferred_minutes_default: number
          preferred_time_of_day: string | null
          energy_default: 'low' | 'normal' | 'high'
        }
        Insert: {
          id: string
          created_at?: string
          plan?: 'free' | 'pro'
          timezone?: string | null
          preferred_minutes_default?: number
          preferred_time_of_day?: string | null
          energy_default?: 'low' | 'normal' | 'high'
        }
        Update: {
          id?: string
          created_at?: string
          plan?: 'free' | 'pro'
          timezone?: string | null
          preferred_minutes_default?: number
          preferred_time_of_day?: string | null
          energy_default?: 'low' | 'normal' | 'high'
        }
      }
      captures: {
        Row: {
          id: string
          user_id: string
          raw_text: string
          source: 'text' | 'voice'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          raw_text: string
          source?: 'text' | 'voice'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          raw_text?: string
          source?: 'text' | 'voice'
          created_at?: string
        }
      }
      tiles: {
        Row: {
          id: string
          user_id: string
          capture_id: string | null
          title: string
          next_step: string
          minutes: number
          difficulty: 'low' | 'med' | 'high'
          category: string
          due_at: string | null
          status: 'active' | 'queued' | 'done' | 'archived'
          snooze_count: number
          created_at: string
          updated_at: string
          last_presented_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          capture_id?: string | null
          title: string
          next_step: string
          minutes: number
          difficulty?: 'low' | 'med' | 'high'
          category: string
          due_at?: string | null
          status?: 'active' | 'queued' | 'done' | 'archived'
          snooze_count?: number
          created_at?: string
          updated_at?: string
          last_presented_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          capture_id?: string | null
          title?: string
          next_step?: string
          minutes?: number
          difficulty?: 'low' | 'med' | 'high'
          category?: string
          due_at?: string | null
          status?: 'active' | 'queued' | 'done' | 'archived'
          snooze_count?: number
          created_at?: string
          updated_at?: string
          last_presented_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          event_name: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_name: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_name?: string
          metadata?: Json
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          status?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
