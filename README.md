# FITRS

Fire Incident Tracking and Response System demo built with Next.js 14 App Router.

## Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Leaflet + OpenStreetMap

## Features

- Incident creation form
- Incident dashboard with stat cards
- Dispatch queue with status updates
- Map view with incident markers
- Simple role simulation: firefighter, dispatcher, commander

## Project Structure

- app: Routes and pages (dashboard, new incident, dispatch, map)
- components: Reusable UI and map components
- lib: Prisma client, server actions, constants, data helpers
- prisma: Prisma schema and migrations

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create/update the SQLite database:

```bash
npm run prisma:migrate
```

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Useful Commands

```bash
npm run lint
npm run build
npm run db:studio
```

## Vercel Deployment (GitHub)

This project is deployment-ready for demo usage with SQLite.

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare FITRS for Vercel deployment"
git push origin main
```

### 2. Import in Vercel

1. Open Vercel dashboard.
2. Click Add New Project.
3. Import your GitHub repository.
4. Framework preset should auto-detect as Next.js.

### 3. Set Environment Variables

In Project Settings -> Environment Variables, add:

- `DATABASE_URL` = `file:./dev.db`

### 4. Deploy

Click Deploy.

Build uses:

- `prisma generate && next build`

The app is configured with standalone output for optimized deployment bundles.

### 5. Important SQLite Demo Note

Vercel serverless filesystem is ephemeral/non-persistent between deployments and can reset across function instances. This is fine for demos, but not production data persistence.

For production persistence, switch Prisma datasource to a hosted database (for example Vercel Postgres, Neon, Supabase, or PlanetScale).
