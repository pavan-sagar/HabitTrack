"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, TrendingUp, Flame, Target, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0066cc", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

interface Habit {
  id: string;
  title: string;
  streak: number;
  longestStreak: number;
}

interface Profile {
  id: string;
  name: string;
}

interface AnalyticsData {
  totalCompletions: number;
  dailyData: Array<{ date: string; completed: number }>;
  habitStats: Array<{ name: string; completions: number }>;
  completionRate: number;
}

export default function StatsPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) =>
        setProfile(data.find((p: Profile) => p.id === id) || null)
      )
      .catch(console.error);

    fetch("/api/habits?profileId=" + id)
      .then((r) => r.json())
      .then(setHabits)
      .catch(console.error);

    const today = new Date();
    fetch(
      "/api/analytics?profileId=" +
        id +
        "&year=" +
        today.getFullYear() +
        "&month=" +
        (today.getMonth() + 1)
    )
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(console.error);
  }, [id]);

  if (!profile) {
    return (
      <div className="min-h-full bg-apple-parchment flex items-center justify-center p-8">
        <div className="text-apple-ink-muted-48">Loading analytics...</div>
      </div>
    );
  }

  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.longestStreak), 0) : 0;
  const totalCompletions = analytics?.totalCompletions || 0;
  const activeHabits = habits.length;
  const completionRate = analytics?.completionRate || 0;

  return (
    <div className="min-h-full bg-apple-parchment pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-apple-hairline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/profile/${id}`}
              className="flex items-center gap-1.5 text-apple-blue hover:text-apple-blue-focus text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Habits</span>
            </Link>
          </div>
          <span className="font-semibold text-apple-ink text-sm truncate">
            Analytics &bull; {profile.name}
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-apple-ink tracking-tight">Performance Analytics</h1>
          <p className="text-sm text-apple-ink-muted-80 mt-0.5">
            Insights and completion statistics for {profile.name}
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Total Completions */}
          <div className="bg-white rounded-apple p-4 sm:p-5 border border-apple-hairline shadow-apple-subtle">
            <div className="flex items-center justify-between text-apple-ink-muted-80 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
              <CheckCircle2 className="h-4 w-4 text-apple-blue" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-apple-ink mb-1">
              {totalCompletions}
            </p>
            <p className="text-xs text-apple-ink-muted-48">Logged completions</p>
          </div>

          {/* Best Streak */}
          <div className="bg-white rounded-apple p-4 sm:p-5 border border-apple-hairline shadow-apple-subtle">
            <div className="flex items-center justify-between text-apple-ink-muted-80 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Best Streak</span>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-apple-ink mb-1">
              {bestStreak} <span className="text-sm font-normal text-apple-ink-muted-48">days</span>
            </p>
            <p className="text-xs text-apple-ink-muted-48">Top record</p>
          </div>

          {/* Active Habits */}
          <div className="bg-white rounded-apple p-4 sm:p-5 border border-apple-hairline shadow-apple-subtle">
            <div className="flex items-center justify-between text-apple-ink-muted-80 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
              <Target className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-apple-ink mb-1">
              {activeHabits}
            </p>
            <p className="text-xs text-apple-ink-muted-48">Habits created</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-apple p-4 sm:p-5 border border-apple-hairline shadow-apple-subtle">
            <div className="flex items-center justify-between text-apple-ink-muted-80 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Rate</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-apple-ink mb-1">
              {completionRate}%
            </p>
            <p className="text-xs text-apple-ink-muted-48">This month</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Daily Completions Chart */}
          <div className="bg-white rounded-apple-lg p-4 sm:p-6 border border-apple-hairline shadow-apple-subtle">
            <h2 className="font-semibold text-apple-ink text-base mb-4">
              Daily Activity (This Month)
            </h2>
            {analytics && analytics.dailyData && analytics.dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#8e8e93" fontSize={11} />
                  <YAxis stroke="#8e8e93" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="completed" fill="#0066cc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-sm text-apple-ink-muted-48">
                No activity recorded this month yet
              </div>
            )}
          </div>

          {/* Habit Breakdown Chart */}
          <div className="bg-white rounded-apple-lg p-4 sm:p-6 border border-apple-hairline shadow-apple-subtle">
            <h2 className="font-semibold text-apple-ink text-base mb-4">
              Habit Breakdown
            </h2>
            {analytics && analytics.habitStats && analytics.habitStats.some(s => s.completions > 0) ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={analytics.habitStats.filter(s => s.completions > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#0066cc"
                    dataKey="completions"
                  >
                    {analytics.habitStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-sm text-apple-ink-muted-48">
                Complete habits to see distribution breakdown
              </div>
            )}
          </div>
        </div>

        {/* All Habits Table */}
        <div className="bg-white rounded-apple-lg border border-apple-hairline shadow-apple-subtle overflow-hidden">
          <div className="px-5 py-4 border-b border-apple-divider">
            <h2 className="font-semibold text-apple-ink text-base">Habits Summary</h2>
          </div>
          {habits.length === 0 ? (
            <div className="p-8 text-center text-sm text-apple-ink-muted-48">
              No habits created for this profile yet.
            </div>
          ) : (
            <div className="divide-y divide-apple-hairline">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="px-5 py-3.5 hover:bg-apple-parchment/60 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-apple-ink text-sm truncate">
                      {habit.title}
                    </h3>
                    <p className="text-xs text-apple-ink-muted-80 mt-0.5">
                      Current streak: <strong className="text-apple-ink">{habit.streak}</strong> days
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-apple-blue text-sm">
                      {habit.longestStreak}
                    </p>
                    <p className="text-xs text-apple-ink-muted-48">
                      longest streak
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
