import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID, createHash } from 'crypto';

const dbPath = path.join(process.cwd(), 'habits.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function hashPin(pin: string): string {
  return createHash('sha256').update(pin + '_salt_habittrack').digest('hex');
}

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (\n      id TEXT PRIMARY KEY,\n      name TEXT NOT NULL,\n      createdAt TEXT NOT NULL,\n      pin TEXT\n    );

    CREATE TABLE IF NOT EXISTS habits (\n      id TEXT PRIMARY KEY,\n      profileId TEXT NOT NULL,\n      title TEXT NOT NULL,\n      description TEXT,\n      createdAt TEXT NOT NULL,\n      FOREIGN KEY (profileId) REFERENCES profiles(id) ON DELETE CASCADE\n    );

    CREATE TABLE IF NOT EXISTS logs (\n      id TEXT PRIMARY KEY,\n      habitId TEXT NOT NULL,\n      completedAt TEXT NOT NULL,\n      FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE\n    );

    CREATE INDEX IF NOT EXISTS idx_habits_profileId ON habits(profileId);
    CREATE INDEX IF NOT EXISTS idx_logs_habitId ON logs(habitId);
    CREATE INDEX IF NOT EXISTS idx_logs_completedAt ON logs(completedAt);
  `);

  try {
    db.exec(`ALTER TABLE profiles ADD COLUMN pin TEXT;`);
  } catch (e) {
    // Column already exists
  }
}

export function createProfile(name: string, pin?: string) {
  const id = randomUUID();
  const hashedPin = pin && pin.trim().length === 4 ? hashPin(pin.trim()) : null;
  const stmt = db.prepare('INSERT INTO profiles (id, name, createdAt, pin) VALUES (?, ?, ?, ?)');
  stmt.run(id, name, new Date().toISOString(), hashedPin);
  return getProfile(id);
}

export function getProfiles() {
  const stmt = db.prepare(`
    SELECT id, name, createdAt,
      CASE WHEN pin IS NOT NULL AND pin != '' THEN 1 ELSE 0 END as isProtected
    FROM profiles
    ORDER BY createdAt DESC
  `);
  const rows = stmt.all() as any[];
  return rows.map((r) => ({ ...r, isProtected: Boolean(r.isProtected) }));
}

export function getProfile(id: string) {
  const stmt = db.prepare(`
    SELECT id, name, createdAt,
      CASE WHEN pin IS NOT NULL AND pin != '' THEN 1 ELSE 0 END as isProtected
    FROM profiles
    WHERE id = ?
  `);
  const profile = stmt.get(id) as any;
  if (!profile) return null;
  return { ...profile, isProtected: Boolean(profile.isProtected) };
}

export function verifyProfilePin(id: string, pin: string): boolean {
  const stmt = db.prepare('SELECT pin FROM profiles WHERE id = ?');
  const row = stmt.get(id) as any;
  if (!row) return false;
  if (!row.pin) return true; // not protected
  return row.pin === hashPin(pin.trim());
}

export function deleteProfile(id: string) {
  const stmt = db.prepare('DELETE FROM profiles WHERE id = ?');
  stmt.run(id);
}

export function createHabit(profileId: string, title: string, description?: string) {
  const id = randomUUID();
  const stmt = db.prepare('INSERT INTO habits (id, profileId, title, description, createdAt) VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, profileId, title, description || null, new Date().toISOString());
  return getHabit(id);
}

export function getHabits(profileId: string) {
  const stmt = db.prepare(`
    SELECT h.*, 
      COUNT(l.id) as streak,
      MAX(CAST(l.completedAt as DATE)) as lastCompleted
    FROM habits h
    LEFT JOIN logs l ON h.id = l.habitId
    WHERE h.profileId = ?
    GROUP BY h.id
    ORDER BY h.createdAt DESC
  `);
  const habits = stmt.all(profileId) as any[];
  return habits.map(h => ({
    ...h,
    longestStreak: h.streak || 0,
    streak: h.streak || 0
  }));
}

export function getHabit(id: string) {
  const stmt = db.prepare(`
    SELECT h.*, 
      COUNT(l.id) as streak,
      MAX(CAST(l.completedAt as DATE)) as lastCompleted
    FROM habits h
    LEFT JOIN logs l ON h.id = l.habitId
    WHERE h.id = ?
    GROUP BY h.id
  `);
  const habit = stmt.get(id) as any;
  return habit ? {
    ...habit,
    longestStreak: habit.streak || 0,
    streak: habit.streak || 0
  } : null;
}

export function deleteHabit(id: string) {
  const stmt = db.prepare('DELETE FROM habits WHERE id = ?');
  stmt.run(id);
}

export function toggleLog(habitId: string, date: string) {
  const datePattern = `${date}%`;
  
  const checkStmt = db.prepare('SELECT id FROM logs WHERE habitId = ? AND completedAt LIKE ?');
  const existing = checkStmt.get(habitId, datePattern) as any;
  
  if (existing) {
    const deleteStmt = db.prepare('DELETE FROM logs WHERE id = ?');
    deleteStmt.run(existing.id);
    return null;
  } else {
    const id = randomUUID();
    const timePart = new Date().toISOString().split('T')[1] || '12:00:00.000Z';
    const completedAt = `${date}T${timePart}`;
    const insertStmt = db.prepare('INSERT INTO logs (id, habitId, completedAt) VALUES (?, ?, ?)');
    insertStmt.run(id, habitId, completedAt);
    return { id, habitId, completedAt };
  }
}

export function getLogsByProfileAndDate(profileId: string, date: string) {
  const datePattern = `${date}%`;
  
  const stmt = db.prepare(`
    SELECT l.* FROM logs l
    JOIN habits h ON l.habitId = h.id
    WHERE h.profileId = ? AND l.completedAt LIKE ?
  `);
  return stmt.all(profileId, datePattern);
}

export function getProfileAnalytics(profileId: string, year: number, month: number) {
  const monthStr = String(month).padStart(2, '0');
  const datePattern = `${year}-${monthStr}-%`;
  
  const completionsStmt = db.prepare(`
    SELECT COUNT(*) as total
    FROM logs l
    JOIN habits h ON l.habitId = h.id
    WHERE h.profileId = ? AND l.completedAt LIKE ?
  `);
  
  const dailyStmt = db.prepare(`
    SELECT DATE(l.completedAt) as date, COUNT(*) as completed
    FROM logs l
    JOIN habits h ON l.habitId = h.id
    WHERE h.profileId = ? AND l.completedAt LIKE ?
    GROUP BY DATE(l.completedAt)
    ORDER BY date
  `);
  
  const habitStatsStmt = db.prepare(`
    SELECT h.title as name, COUNT(l.id) as completions
    FROM habits h
    LEFT JOIN logs l ON h.id = l.habitId AND l.completedAt LIKE ?
    WHERE h.profileId = ?
    GROUP BY h.id
  `);
  
  const totalResult = completionsStmt.get(profileId, datePattern) as any;
  const totalCompletions = totalResult?.total || 0;
  const dailyData = dailyStmt.all(profileId, datePattern) as any[];
  const habitStats = habitStatsStmt.all(datePattern, profileId) as any[];
  
  const totalHabitsResult = db.prepare('SELECT COUNT(*) as count FROM habits WHERE profileId = ?').get(profileId) as any;
  const totalHabits = totalHabitsResult?.count || 0;
  const completionRate = totalHabits > 0 ? Math.round((totalCompletions / (totalHabits * 30)) * 100) : 0;
  
  return {
    totalCompletions,
    dailyData,
    habitStats: habitStats.filter(h => h.completions > 0),
    completionRate,
  };
}

initializeDatabase();
