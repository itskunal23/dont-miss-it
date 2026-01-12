<div align="center">

# 🧘 QuietDeadline

### **The Anti-Planner for Type-B People**

*One calm step at a time. No guilt. No noise. Just progress.*

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)

[Features](#-features) • [Use Cases](#-who-is-this-for) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Deployment](#-deployment)

---

</div>

## 🎯 The Problem

Traditional productivity apps are built for Type-A personalities. They overwhelm Type-B people with:
- ❌ Endless to-do lists that never shrink
- ❌ Complex project management tools
- ❌ Guilt-inducing notifications
- ❌ Perfectionist expectations
- ❌ Decision paralysis from too many options

**Result:** People avoid their tasks, feel overwhelmed, and give up.

## ✨ The Solution

QuietDeadline is a **calm, focused PWA** that breaks the cycle:

```
┌─────────────────────────────────────────────────────────┐
│                    USER BRAIN DUMP                       │
│  "I need to reply to Sarah's email, pay the electric    │
│   bill by Friday, and study for my chemistry exam"      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              CONTEXT ENGINE PROCESSES                   │
│  • Detects: email, bill payment, exam deadline          │
│  • Classifies: job, finance, school                     │
│  • Extracts: "by Friday" → due date                     │
│  • Generates: One tiny 10-15 min step                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    ONE TILE APPEARS                      │
│  ┌──────────────────────────────────────────────┐     │
│  │ 📧 Reply to Sarah's email                      │     │
│  │                                                │     │
│  │ Next step: Open the thread and write          │     │
│  │ 1 sentence reply.                              │     │
│  │                                                │     │
│  │ ⏱️ 10 min  |  📅 Due Friday  |  🟢 Low         │     │
│  │                                                │     │
│  │ [Start] [Snooze 30m] [Make smaller] [Done]    │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
│  Other items → Queued (hidden, no pressure)           │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Features

### 🎯 One Tile Focus
**The core philosophy:** Only one active step visible at a time.

```
┌─────────────────────────────────────┐
│  Active Tile (1)                    │
│  ┌───────────────────────────────┐ │
│  │ Your current focus             │ │
│  └───────────────────────────────┘ │
│                                     │
│  Queue (hidden, calm)               │
│  ┌───────────────────────────────┐ │
│  │ Item 2 (waiting)              │ │
│  │ Item 3 (waiting)              │ │
│  │ Item 4 (waiting)              │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Benefits:**
- ✅ No decision paralysis
- ✅ Reduced cognitive load
- ✅ Clear next action
- ✅ Shame-free progress

### 🧠 Intelligent Context Engine

**Rules-based processing** (no AI required, works offline):

```
Input: "Pay electric bill by Friday"
         │
         ├─→ Category Detection → "finance"
         ├─→ Deadline Extraction → "Friday" → 2024-01-19
         ├─→ Step Generation → "Open website and find payment page"
         └─→ Time Estimation → 10 minutes (low energy)
```

**Pattern Recognition:**
- 📧 Email/Message → "Open thread, write 1 sentence"
- 📚 Study/Exam → "Open notes, review one section"
- 💳 Pay/Bill → "Open website, find payment page"
- 📅 Schedule → "Open calendar, find 2 slots"
- 🧹 Clean/Organize → "Set 10 min timer, do easiest chunk"

### 🛡️ Anti-Avoidance System

**Automatic step shrinking** when you keep snoozing:

```
Snooze Count: 0  → 15 min step
Snooze Count: 2  → 10 min step (setup-only)
Snooze Count: 4+ → 5 min step ("Just open it")
```

**Philosophy:** "Let's make it smaller" instead of "You failed"

### 📅 Deadline Radar

**Natural language deadline detection:**

| Input | Detected Deadline |
|-------|------------------|
| "today" | End of today |
| "tomorrow" | End of tomorrow |
| "by Friday" | End of this Friday |
| "by 1/15" | January 15th |
| "this week" | End of this week |

### 🤖 Smart Assist (Pro Only)

**Optional Ollama integration** for messy, unclear inputs:

```
Confidence Score < 0.6?
         │
         ├─→ Yes → Check if Pro user
         │         ├─→ Yes → Use Ollama (30/day limit)
         │         └─→ No → Use rules-based fallback
         │
         └─→ No → Use rules-based engine
```

**Features:**
- Server-side only (users never install Ollama)
- Cached responses (hash-based)
- Rate limited (30 requests/day per Pro user)
- Feature flag controlled

### 📊 Personal Insights

**Learn what works for you:**

```
┌─────────────────────────────────────┐
│  Your Best Time: Morning            │
│  Average Step Size: 12 minutes      │
│  Most Common: Life Admin (40%)      │
│  Completion Rate: 78%               │
└─────────────────────────────────────┘
```

## 👥 Who Is This For?

### Primary Use Cases

#### 1. **The Overwhelmed Professional**
> *"I have 47 emails, 12 meetings, and 3 projects due. Where do I even start?"*

**QuietDeadline helps by:**
- Breaking down the chaos into one tiny step
- Prioritizing automatically based on deadlines
- Reducing anxiety with "just one thing" focus

#### 2. **The Procrastinating Student**
> *"I have a 20-page paper due Friday. I've been avoiding it for weeks."*

**QuietDeadline helps by:**
- Starting with "Open notes and review one section" (15 min)
- Shrinking steps if you keep avoiding
- No judgment, just progress

#### 3. **The Perfectionist**
> *"I can't start because I need to plan everything perfectly first."*

**QuietDeadline helps by:**
- Forcing "just start" mentality
- Making steps so small they're impossible to fail
- Celebrating "showing up" over perfect completion

#### 4. **The Life Admin Overwhelmed**
> *"I need to renew my license, pay bills, call the dentist, and organize my closet."*

**QuietDeadline helps by:**
- Converting brain dumps into actionable steps
- Detecting deadlines automatically
- Queuing items so you don't forget

### User Personas

```
┌─────────────────────────────────────────────────────────┐
│  Persona: "Overwhelmed Olivia"                          │
│  • Age: 28-45                                           │
│  • Job: Knowledge worker, parent                        │
│  • Pain: Too many things, decision fatigue              │
│  • Goal: Just get one thing done without guilt          │
│  • Solution: One tile, no lists, calm progress         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Persona: "Procrastinating Pete"                       │
│  • Age: 18-30                                           │
│  • Job: Student or early career                        │
│  • Pain: Avoids starting, perfectionism paralysis       │
│  • Goal: Build momentum with tiny wins                  │
│  • Solution: Anti-avoidance, step shrinking           │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Stripe account created (for payments)
- [ ] (Optional) Ollama installed (for Smart Assist)

### Installation in 5 Minutes

```bash
# 1. Clone and install
git clone <your-repo>
cd dont-miss-it
npm install

# 2. Set up Supabase
# → Create project at supabase.com
# → Run migration: supabase/migrations/001_initial_schema.sql
# → Get URL, anon key, service role key

# 3. Set up Stripe
# → Create products: Monthly ($9.99) and Yearly ($79)
# → Get Price IDs and webhook secret

# 4. Configure environment
cp .env.example .env.local
# Fill in your keys

# 5. Run!
npm run dev
```

**🎉 Open http://localhost:3000**

### First User Journey

```
Sign Up (30s)
    ↓
Onboarding (90s)
  • What overwhelms you?
  • When do you get things done?
  • Default step size?
    ↓
Brain Dump
  "I need to reply to my boss's email"
    ↓
One Tile Appears
  "Open the thread and write 1 sentence reply"
    ↓
Start Timer → Complete → Next tile activates
```

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React UI   │  │   PWA SW     │  │  Offline     │  │
│  │  Components  │  │   Cache      │  │  Support     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER (Vercel)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ API Routes   │  │ Context      │  │ Ollama       │  │
│  │ /capture     │  │ Engine       │  │ (Optional)   │  │
│  │ /tiles       │  │ (Rules)      │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────┬──────────────────────┬───────────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│   Supabase       │    │   Stripe         │
│   • Postgres     │    │   • Checkout     │
│   • Auth         │    │   • Webhooks     │
│   • RLS          │    │   • Subscriptions│
└──────────────────┘    └──────────────────┘
```

### Data Flow

```
User Input: "Pay bill by Friday"
    │
    ├─→ POST /api/capture
    │       │
    │       ├─→ Create capture record
    │       ├─→ Context Engine processes
    │       │   ├─→ Classify category
    │       │   ├─→ Extract deadline
    │       │   ├─→ Generate step
    │       │   └─→ Calculate confidence
    │       │
    │       ├─→ (If Pro + low confidence)
    │       │   └─→ Call Ollama Smart Assist
    │       │
    │       └─→ Create tile (active or queued)
    │
    └─→ Return tile to client
            │
            └─→ Display One Tile Card
```

### Database Schema

```
┌─────────────┐
│  profiles   │  ← User preferences, plan (free/pro)
└──────┬──────┘
       │
       ├─→ ┌─────────────┐
       │   │  captures   │  ← Raw brain dumps
       │   └──────┬──────┘
       │          │
       │          └─→ ┌─────────────┐
       │              │   tiles     │  ← Processed steps
       │              └──────┬──────┘
       │                     │
       │                     └─→ ┌─────────────┐
       │                         │   events     │  ← Analytics
       │                         └─────────────┘
       │
       └─→ ┌─────────────┐
           │subscriptions │  ← Stripe billing
           └─────────────┘
```

## 💰 Monetization Model

### Pricing Tiers

```
┌─────────────────────────────────────────────────────────┐
│                    FREE TIER                            │
│  ✓ 25 captures/month                                    │
│  ✓ 1 active tile                                        │
│  ✓ Rules-based engine                                    │
│  ✓ Basic insights                                       │
│  ✓ Queue management                                     │
│                                                          │
│  Price: $0/month                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    PRO TIER                             │
│  ✓ Unlimited captures                                   │
│  ✓ Smart Assist (Ollama)                                │
│  ✓ Advanced anti-avoidance insights                     │
│  ✓ More reminder options                                │
│  ✓ Priority support                                     │
│                                                          │
│  Price: $9.99/month or $79/year (save 34%)             │
└─────────────────────────────────────────────────────────┘
```

### Conversion Funnel

```
Free User (25 captures)
    │
    ├─→ Hits limit → Upgrade prompt
    │
    ├─→ Low confidence step → "Try Smart Assist" (Pro only)
    │
    └─→ Sees value → Upgrades to Pro
```

## 🔒 Security & Privacy

### Data Protection

- ✅ **Row Level Security (RLS)** on all Supabase tables
- ✅ **Server-side validation** with Zod
- ✅ **Stripe webhook signature** verification
- ✅ **No third-party analytics** in v1
- ✅ **User data export/deletion** available

### Privacy Philosophy

> "We collect only what's necessary. Your brain dumps stay yours."

## 📦 Deployment

### Vercel Deployment (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import in Vercel
# → Connect GitHub repo
# → Auto-detect Next.js
# → Add environment variables

# 3. Configure Stripe Webhook
# → URL: https://your-app.vercel.app/api/stripe/webhook
# → Events: checkout.session.completed, customer.subscription.*

# 4. Deploy!
```

### Environment Variables Checklist

```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
✅ NEXT_PUBLIC_STRIPE_PRICE_YEARLY
✅ NEXT_PUBLIC_APP_URL
✅ (Optional) OLLAMA_BASE_URL
✅ (Optional) OLLAMA_MODEL
✅ (Optional) ENABLE_OLLAMA_ASSIST
```

## 🧪 Testing

```bash
# Run context engine tests
npm test

# Test coverage includes:
# ✓ Category classification
# ✓ Deadline detection
# ✓ Step generation
# ✓ Anti-avoidance logic
```

## 📚 Project Structure

```
dont-miss-it/
├── app/
│   ├── (marketing)/      # Landing & pricing pages
│   ├── (auth)/           # Login & signup
│   ├── app/              # Main app (protected)
│   │   ├── onboarding/   # First-run experience
│   │   ├── queue/        # Queued tiles view
│   │   ├── insights/     # User analytics
│   │   └── settings/     # Preferences & billing
│   └── api/              # API routes
│       ├── capture/       # Create captures & tiles
│       ├── tiles/         # Tile operations
│       ├── stripe/        # Payment integration
│       └── ai/            # Ollama Smart Assist
├── components/            # React components
│   ├── OneTileCard.tsx
│   ├── BrainDumpBox.tsx
│   ├── TimerModal.tsx
│   └── PWAInstallPrompt.tsx
├── lib/
│   ├── contextEngine/     # Rules-based engine
│   │   ├── classify.ts
│   │   ├── deadline.ts
│   │   ├── steps.ts
│   │   └── antiAvoidance.ts
│   ├── supabaseClient.ts # Browser client
│   └── supabaseServer.ts # Server client
└── supabase/
    └── migrations/       # SQL migrations
```

## 🎓 Key Concepts

### Context Engine Confidence Score

```
High Confidence (0.8-1.0)
  → Clear patterns matched
  → Category identified
  → Deadline detected
  → Uses rules-based engine

Low Confidence (< 0.6)
  → Unclear input
  → Pro users → Try Ollama
  → Free users → Use best guess
```

### Single Active Tile Enforcement

```sql
-- Database constraint ensures only one active tile per user
CREATE UNIQUE INDEX tiles_one_active_per_user 
ON tiles(user_id) 
WHERE status = 'active';
```

## 🤝 Contributing

This is a private project, but we welcome feedback and suggestions!

## 📄 License

Private - All rights reserved

---

<div align="center">

**Built with calm intention. One step at a time.** ✨

[Get Started](#-quick-start) • [View Features](#-features) • [Read Docs](#-architecture)

Made with ❤️ for Type-B people everywhere

</div>
