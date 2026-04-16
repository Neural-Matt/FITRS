# FITRS Deployment Guide

## Project Overview
FITRS (Fire Incident Response & Tracking System) - A Next.js 14 application for Zambia Fire Brigade incident management.

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma 5 with SQLite
- **Styling**: Tailwind CSS
- **UI Components**: React Server Components + Client Components
- **Maps**: Leaflet.js with React Leaflet
- **Charts**: Recharts

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (creates/updates database)
npx prisma migrate dev

# Seed test data
npx prisma db seed

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment to Vercel

### 1. Connect Repository
- Push code to GitHub/GitLab/Bitbucket
- Connect repo to Vercel at vercel.com
- Vercel auto-detects Next.js

### 2. Environment Variables
Set in Vercel project settings:

```
DATABASE_URL=file:./prisma/prod.db
```

**Note**: SQLite works on Vercel but resets on deployment. For data persistence, migrate to PostgreSQL:
- Change `prisma/schema.prisma` datasource provider to `"postgresql"`
- Update `DATABASE_URL` to PostgreSQL connection string
- Run `npx prisma db push` in Vercel

### 3. Build & Deploy
Vercel automatically:
- Runs `npm install`
- Runs `npm run build` (includes `prisma generate`)
- Deploys `.next` directory

### 4. Post-Deployment
After first deploy, run Prisma migrations and seed:

```bash
# Via Vercel CLI
vercel env add DATABASE_URL
vercel exec npx prisma db push
vercel exec npx prisma db seed
```

Or use a seed endpoint:
```bash
curl https://your-deployment.vercel.app/api/seed
```

## Production Considerations

### Database
- **Current**: SQLite (ephemeral on Vercel)
- **Recommended**: PostgreSQL (Neon, Supabase, Railway, Render)

### Environment
- Set `NODE_ENV=production` (automatic on Vercel)
- Use `.env.production` for production-specific vars
- Keep sensitive keys in Vercel secrets, not repo

### Caching & Performance
- Next.js caches static routes by default
- API routes use `export const dynamic = "force-dynamic"` for real-time data
- Incremental Static Regeneration (ISR) available for dashboard

### Monitoring
- Enable Vercel Analytics for performance tracking
- Use Vercel Web Vitals dashboard
- Set up error tracking (Sentry recommended)

## Troubleshooting

### Build Fails
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma: `npx prisma generate`
- Check Node version: requires 18+

### Database Connection
- Verify `DATABASE_URL` in Vercel env vars
- Ensure Prisma schema was applied: `npx prisma db push`
- Check db file permissions (relevant for SQLite)

### Styles Not Loading
- Clear Tailwind cache: `rm -rf .next`
- Rebuild: `npm run build`

## File Structure
```
/workspaces/FITRS
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utilities & helpers
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
├── .env                    # Local development
├── .env.production         # Production vars
├── next.config.mjs         # Next.js config
├── package.json            # Dependencies
├── prisma/schema.prisma    # Data models
├── tailwind.config.ts      # Tailwind setup
└── tsconfig.json           # TypeScript config
```

## Deployment Checklist
- [ ] All environment variables set in Vercel
- [ ] Database connection verified
- [ ] Prisma migrations applied
- [ ] Test data seeded
- [ ] Lint passing: `npm run lint`
- [ ] Build passing locally: `npm run build`
- [ ] Tested on staging/preview deployment
- [ ] Analytics endpoint configured (optional)
- [ ] Error tracking enabled (optional)
- [ ] CI/CD pipeline set up (optional)

## Support
For issues or questions, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
