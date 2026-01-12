# Environment Variables Setup

Copy this content to create your `.env.local` file:

```bash
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/frevfwjyyydorwqvwjmo/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://frevfwjyyydorwqvwjmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_secret_ACvmsg0KqwG-2kJprYi9kA_t4jshB6n
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_NC4Xb5S-XIAAV6HtagDjkw_yWrNUTt2

# Stripe Configuration (Optional - for payments)
# Get these from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_monthly_id
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_yearly_id

# Ollama Configuration (Optional - for Smart Assist feature)
# Only needed if you want to enable AI-powered step generation for Pro users
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b-instruct
ENABLE_OLLAMA_ASSIST=false

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Quick Setup

1. Create `.env.local` in the root directory
2. Copy the variables above
3. Replace the placeholder values with your actual keys:
   - **Supabase keys**: Get from https://supabase.com/dashboard/project/frevfwjyyydorwqvwjmo/settings/api
   - **Stripe keys**: Get from https://dashboard.stripe.com/apikeys
   - **Ollama**: Only if enabling Smart Assist feature

## Required for Middleware

The middleware.ts file requires these two variables:
- `NEXT_PUBLIC_SUPABASE_URL` (already set: https://frevfwjyyydorwqvwjmo.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (get from Supabase dashboard)
