-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  timezone TEXT DEFAULT 'UTC',
  preferred_minutes_default INTEGER DEFAULT 15 CHECK (preferred_minutes_default >= 5 AND preferred_minutes_default <= 60),
  preferred_time_of_day TEXT CHECK (preferred_time_of_day IN ('morning', 'afternoon', 'night', 'varies')),
  energy_default TEXT DEFAULT 'normal' CHECK (energy_default IN ('low', 'normal', 'high'))
);

-- Captures table
CREATE TABLE captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'text' CHECK (source IN ('text', 'voice')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tiles table
CREATE TABLE tiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  capture_id UUID REFERENCES captures(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  next_step TEXT NOT NULL,
  minutes INTEGER NOT NULL CHECK (minutes >= 5 AND minutes <= 60),
  difficulty TEXT NOT NULL DEFAULT 'med' CHECK (difficulty IN ('low', 'med', 'high')),
  category TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('active', 'queued', 'done', 'archived')),
  snooze_count INTEGER DEFAULT 0 CHECK (snooze_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_presented_at TIMESTAMPTZ
);

-- Unique constraint: only one active tile per user
CREATE UNIQUE INDEX tiles_one_active_per_user ON tiles(user_id) WHERE status = 'active';

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_captures_user_id ON captures(user_id);
CREATE INDEX idx_captures_created_at ON captures(created_at);
CREATE INDEX idx_tiles_user_id ON tiles(user_id);
CREATE INDEX idx_tiles_status ON tiles(status);
CREATE INDEX idx_tiles_user_status ON tiles(user_id, status);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_name ON events(event_name);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Captures RLS
CREATE POLICY "Users can view own captures" ON captures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own captures" ON captures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tiles RLS
CREATE POLICY "Users can view own tiles" ON tiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tiles" ON tiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tiles" ON tiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Events RLS
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions RLS
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_tiles_updated_at BEFORE UPDATE ON tiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
