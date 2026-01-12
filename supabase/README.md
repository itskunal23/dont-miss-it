# Supabase Setup Instructions

## Prerequisites
1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration

## Environment Variables
Add these to your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Testing RLS
After running migrations, verify Row Level Security is working:
- Try querying data without authentication (should fail)
- Create a test user and verify they can only see their own data
