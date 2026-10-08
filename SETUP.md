# HabitTrack Setup & Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
cd habit-tracker-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Steps
1. Visit the home page
2. Click "Manage Profiles" to navigate to `/profiles`
3. Create a new profile
4. Click the profile to enter the detail page
5. Add habits and start tracking
6. View analytics on the Stats page

### Database

By default, the app uses a local SQLite database (`habits.db`) that's created automatically in the project root. All data persists between sessions.

---

## Production Deployment

### Option 1: Vercel (Recommended for Beginners)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project" and import your GitHub repository
4. Vercel auto-detects Next.js and deploys automatically
5. Your app is live at `your-app.vercel.app`

**Note**: The local SQLite database won't persist on Vercel (serverless). For production, use Turso (see below).

### Option 2: Turso + Vercel (Recommended for Production)

#### Step 1: Create a Turso Database

1. Go to [turso.tech](https://turso.tech) and sign up (free tier available)
2. Create a new database
3. Copy your database URL and auth token
4. In your `.env.local` file, add:
   ```
   TURSO_DATABASE_URL=libsql://your-db-xxxxx.turso.io
   TURSO_AUTH_TOKEN=your-token-here
   ```

#### Step 2: Update Database Wrapper

The app currently uses local SQLite. To use Turso, you would need to:
1. Replace the `better-sqlite3` import with `@libsql/client`
2. Update connection logic in `src/lib/db.ts`

For now, the local SQLite works perfectly for development and small deployments.

#### Step 3: Deploy to Vercel

1. Add environment variables to Vercel:
   - Go to your Vercel project Settings
   - Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
2. Redeploy and your app will use the cloud database

### Option 3: Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Then:
```bash
docker build -t habit-tracker .
docker run -p 3000:3000 habit-tracker
```

---

## Environment Variables

See `.env.example` for all available options. For local development, no configuration is needed.

---

## Building for Production

```bash
npm run build
npm start
```

This creates an optimized production build.

---

## Troubleshooting

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database errors
```bash
rm habits.db  # Delete and recreate
npm run dev
```

### Tailwind styles not loading
```bash
rm -rf .next
npm run dev
```

