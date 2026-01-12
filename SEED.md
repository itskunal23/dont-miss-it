# Quick Start / Seed Data

## Creating Your First Tile

After setting up the app and creating an account, you can quickly create your first tile by:

1. **Sign up** at `/signup`
2. **Complete onboarding** (choose your preferences)
3. **Go to `/app`** and use the brain dump box

Example brain dumps to try:
- "Reply to Sarah's email about the meeting"
- "Pay the electric bill by Friday"
- "Study for the chemistry exam next week"
- "Call mom tomorrow"
- "Clean the kitchen today"

## Testing Stripe (Development)

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

## Testing Ollama (Optional)

1. Install Ollama locally
2. Pull model: `ollama pull llama3.1:8b-instruct`
3. Set `ENABLE_OLLAMA_ASSIST=true` in `.env.local`
4. Upgrade a test user to Pro
5. Create a capture with messy/unclear text
6. If confidence < 0.6, Smart Assist will be used

## PWA Icons

You need to create two icon files:
- `/public/icon-192.png` (192x192)
- `/public/icon-512.png` (512x512)

You can use any image editor or online tool to create these. The icons should represent the QuietDeadline brand (calm, minimal, focused).
