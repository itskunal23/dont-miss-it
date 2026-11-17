# dont-miss-it

Deadline & opportunity tracker for ML/AI conferences, paper submissions, and career events. TypeScript + notification system.

## Problem
ML/AI researchers and practitioners miss critical deadlines: conference submissions (NeurIPS, ICML, ICLR), journal submissions, fellowship applications, job application windows, workshop registrations. Existing calendars are scattered, incomplete, or require manual maintenance.

## Solution
dont-miss-it aggregates deadlines from authoritative sources, normalizes them into a unified schema, and delivers personalized notifications via email, Slack, Discord, or in-app. Users subscribe to tracks (conferences, journals, careers, fellowships) and receive timely reminders with context.

## Tech Stack
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 20+ (ESM)
- **Scheduler**: node-cron / Bree (distributed scheduling)
- **Scraping**: Playwright (dynamic sites), Cheerio (static)
- **Notifications**: Nodemailer (email), @slack/web-api, discord.js
- **Database**: SQLite (local) / PostgreSQL (production) + Prisma ORM
- **API**: Fastify (REST) + GraphQL (optional)
- **Frontend**: React + Vite (dashboard)
- **Deployment**: Docker, Fly.io / Railway, GitHub Actions
- **Monitoring**: Prometheus + Grafana, Sentry

## Installation
```bash
git clone https://github.com/itskunal23/dont-miss-it.git
cd dont-miss-it

# Install dependencies
npm install
# or
pnpm install
```

## Usage
```bash
# Development
npm run dev

# Run scraper manually
npm run scrape -- --source=neurips,icml,iclr

# Run notification check
npm run notify

# Build
npm run build

# Type check
npm run typecheck

# Test
npm run test
```

## Architecture
```
src/
├── scrapers/           # Source-specific deadline extractors
│   ├── conference/     # NeurIPS, ICML, ICLR, CVPR, etc.
│   ├── journal/        # JMLR, TPAMI, Nature ML, etc.
│   ├── fellowship/     # NSF, NDSEG, Hertz, etc.
│   └── career/         # Company hiring windows, bootcamps
├── processors/         # Normalization, deduplication
│   ├── normalize.ts    # Unified schema conversion
│   ├── dedupe.ts       # Cross-source deduplication
│   └── enrich.ts       # Add context (link, description, tags)
├── notifiers/          # Delivery channels
│   ├── email.ts        # Nodemailer + templates
│   ├── slack.ts        # Slack webhook/API
│   ├── discord.ts      # Discord webhook
│   └── push.ts         # Web Push API
├── storage/            # Database layer
│   ├── prisma.ts       # Prisma client
│   └── migrations/     # Schema migrations
├── api/                # REST/GraphQL endpoints
│   ├── routes/
│   └── schema.graphql
├── scheduler/          # Cron jobs
│   ├── scrape.ts       # Daily at 6 AM UTC
│   ├── notify.ts       # Every hour
│   └── cleanup.ts      # Weekly (expire old)
└── cli.ts              # Commander.js CLI
```

## Data Schema
```typescript
// Unified deadline schema
interface Deadline {
  id: string;                    // UUID
  title: string;                 // "NeurIPS 2025 Paper Submission"
  source: "conference" | "journal" | "fellowship" | "career" | "workshop";
  category: string;              // "ml", "nlp", "cv", "rl", "systems"
  deadline: Date;                // UTC
  timezone: string;              // "AoE" / "UTC-12" / "Local"
  url: string;                   // Official submission page
  description?: string;          // Context, requirements
  tags: string[];                // ["top-tier", "virtual-option", "student-friendly"]
  importance: 1 | 2 | 3;         // 3 = must-not-miss (NeurIPS/ICML/ICLR)
  recurring: boolean;            // Annual conference
  year?: number;                 // For recurring events
  createdAt: Date;
  updatedAt: Date;
}
```

## Tracked Sources (v1)
| Category | Sources | Count |
|----------|---------|-------|
| **Top-Tier Conferences** | NeurIPS, ICML, ICLR, CVPR, ICCV, ECCV, ACL, EMNLP, NAACL | 9 |
| **Specialized Conferences** | ICRA, IROS, CoRL, RSS, ISRR, ICAPS, AAAI, IJCAI | 12 |
| **Journals** | JMLR, TPAMI, Nature ML, Machine Learning, JAIR | 8 |
| **Fellowships** | NSF GRFP, NDSEG, Hertz, Ford, GEM, Knight-Hennessy | 15 |
| **Career** | FAANG new grad, quant firms, AI labs, startup programs | 20+ |

## Notification Rules
- **T-30 days**: Initial awareness (email + in-app)
- **T-14 days**: Preparation reminder (email + Slack/Discord)
- **T-7 days**: Final push (all channels)
- **T-1 day**: Urgent (all channels, high priority)
- **Day-of**: Last chance (push + SMS if configured)

## Configuration
```typescript
// config.ts
export const config = {
  scraper: {
    concurrency: 3,
    timeout: 30000,
    retryAttempts: 3,
    userAgent: "dont-miss-it/1.0 (+https://github.com/itskunal23/dont-miss-it)",
  },
  scheduler: {
    scrape: "0 6 * * *",      // Daily 6 AM UTC
    notify: "0 * * * *",       // Hourly
    cleanup: "0 2 * * 0",      // Weekly Sunday 2 AM
  },
  notifications: {
    defaultChannels: ["email", "in-app"],
    email: {
      from: "noreply@dont-miss-it.dev",
      templateDir: "./templates/email",
    },
    slack: {
      botToken: process.env.SLACK_BOT_TOKEN,
      defaultChannel: "#deadlines",
    },
  },
};
```

## Extending Scrapers
```typescript
// src/scrapers/conference/neurips.ts
import { BaseScraper } from "../base";

export class NeurIPSScraper extends BaseScraper {
  source = "neurips";
  baseUrl = "https://neurips.cc";

  async extract(): Promise<Deadline[]> {
    const $ = await this.fetch(this.baseUrl + "/Conferences/2025");
    // Parse deadline tables...
    return deadlines.map(this.normalize);
  }
}
```

## Contributing
PRs welcome for new sources, notification channels, or UI improvements. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
MIT © Kunal Goenka