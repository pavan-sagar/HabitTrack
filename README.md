# HabitTrack - Personal Habit Tracker

A modern, mobile-first habit tracking web application built with Next.js, TypeScript, and SQLite.

## Features

- **Multiple Profiles** - Create separate profiles for different people or purposes
- **Daily Habit Tracking** - Mark habits as completed with a simple checkbox
- **Streak Analytics** - Track current and longest streaks for each habit
- **Activity Heatmap** - Visual monthly calendar showing your completion history
- **Progress Charts** - Bar charts and pie charts showing your habit statistics
- **Persistent Storage** - SQLite database for reliable data storage

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

1. Navigate to the project direct1. Navigate to the project direct1. Navigate to the project direct1. Navipm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project S## Project S## Project S## Project S## Project S## Project S## Project S## Proje ├── api/          # API routes (profiles, habits, logs, analytics)
│   │   ├── profiles/     # Profile management page
│   │   ├── profile/[id]/ # Profile detail with habit tracking
│   │   └── stats/[id]/   # Analytics and charts
│   ├── lib/
│   │   └── db.ts         # SQLite database wrapper
│   └── app.tsx           # Root app component
├── habits.db             # SQLite database (auto-created)
└── package.json
```

## API Endpoints

- `GET /api/prof- `GET /api/prof- `GET /api/`POS- `GET /api/prof- `GET /e a new profile
- `DELETE /api/profiles` -- `DELETE /api/profiles` -- `Dhab- `DELETE /api/xx` - List habits for a profile
- `POST /api/habits` - Create a new habit
- `DELETE /api/habits` - Delete a habit
- `GET- api- `GET- api- `GET- &date=xxx` -- `GETogs for a date
- `POST /api/logs` - Toggle habit completion
- `GET /api/analytics?profileId=xxx&year=xxx&month=xxx` - Get analytics data

## Deployment

### Vercel

1. Push your code to a GitHub repository
2. Import the repository into Vercel
3. The app wil3. The app wil3. The app wil3. The app wil3. The app wil3. T consider using a hosted SQLite service like Turso or Neon instead of the local file-based database.

### Cloudflare Workers

The app can be adapted for Cloudflare Workers with a SQLite adapter like `@cloudflare/kv-sqlite`.

## License

MIT
