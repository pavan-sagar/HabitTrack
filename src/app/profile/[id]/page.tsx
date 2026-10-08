"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Check, Calendar, BarChart3, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "from-pink-400 to-pink-600",
  "from-purple-400 to-purple-600",
  "from-indigo-400 to-indigo-600",
  "from-blue-400 to-blue-600",
  "from-cyan-400 to-cyan-600",
  "from-teal-400 to-teal-600",
  "from-green-400 to-green-600",
  "from-yellow-400 to-yellow-600",
  "from-orange-400 to-orange-600",
  "from-red-400 to-red-600",
];

function Avatar({ name, colorIndex }: { name: string; colorIndex: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      className={
        "h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold text-lg sm:text-xl shadow-sm flex-shrink-0 " +
        COLORS[colorIndex % COLORS.length]
      }
    >
      {initials}
    </div>
  );
}

interface Habit {
  id: string;
  profileId: string;
  title: string;
  description?: string;
  streak: number;
  longestStreak: number;
}

interface Log {
  id: string;
  habitId: string;
  completedAt: string;
}

interface Profile {
  id: string;
  name: string;
  createdAt: string;
}

function HabitCard({
  habit,
  logs,
  todayStr,
  toggleLog,
  deleteHabit,
}: {
  habit: Habit;
  logs: Log[];
  todayStr: string;
  toggleLog: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}) {
  const completedToday = logs.some((log) => {
    if (log.habitId !== habit.id) return false;
    const logDate = log.completedAt.split("T")[0];
    return logDate === todayStr;
  });

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white border rounded-apple p-4 transition-all duration-200 ${
        completedToday
          ? "border-emerald-200 bg-emerald-50/20 shadow-apple-subtle"
          : "border-apple-hairline hover:border-apple-divider shadow-apple-subtle"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {/* Tick Button with Spring Animation */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.86 }}
            onClick={() => toggleLog(habit.id)}
            className={`relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer ${
              completedToday
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-white border-2 border-apple-divider text-transparent hover:border-emerald-500 hover:text-emerald-500/40"
            }`}
            title={completedToday ? "Mark as uncompleted" : "Mark as completed"}
          >
            <AnimatePresence mode="wait">
              {completedToday ? (
                <motion.div
                  key="checked"
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 20 }}
                >
                  <Check className="h-5 w-5 stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="unchecked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle Expanding Ripple Effect on Active */}
            {completedToday && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-emerald-500 pointer-events-none"
              />
            )}
          </motion.button>

          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold text-sm truncate transition-colors duration-200 ${
                completedToday
                  ? "line-through text-apple-ink-muted-48 decoration-emerald-600/60"
                  : "text-apple-ink"
              }`}
            >
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-xs text-apple-ink-muted-80 truncate mt-0.5">
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-apple-ink-muted-48 mt-1">
              <span className="inline-flex items-center gap-1 font-medium">
                <span className={habit.streak > 0 ? "text-orange-500 font-semibold" : ""}>
                  🔥 {habit.streak} day streak
                </span>
              </span>
              <span>&bull;</span>
              <span>Best: {habit.longestStreak}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={isDeleting}
          onClick={async () => {
            setIsDeleting(true);
            await deleteHabit(habit.id);
          }}
          className="p-1.5 rounded-apple text-apple-ink-muted-48 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0 cursor-pointer"
          title="Delete habit"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [pRes, hRes, lRes] = await Promise.all([
        fetch(`/api/profiles?id=${id}`),
        fetch(`/api/habits?profileId=${id}`),
        fetch(`/api/logs?profileId=${id}&date=${todayStr}`),
      ]);

      const [pData, hData, lData] = await Promise.all([
        pRes.ok ? pRes.json() : null,
        hRes.ok ? hRes.json() : [],
        lRes.ok ? lRes.json() : [],
      ]);

      if (pData && !pData.error) {
        setProfile(pData);
      }
      setHabits(Array.isArray(hData) ? hData : []);
      setLogs(Array.isArray(lData) ? lData : []);
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, todayStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleLog = async (habitId: string) => {
    const isCurrentlyDone = logs.some(
      (l) => l.habitId === habitId && l.completedAt.split("T")[0] === todayStr
    );

    // Optimistic UI update
    if (isCurrentlyDone) {
      setLogs((prev) =>
        prev.filter(
          (l) => !(l.habitId === habitId && l.completedAt.split("T")[0] === todayStr)
        )
      );
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, streak: Math.max(0, h.streak - 1) } : h
        )
      );
    } else {
      setLogs((prev) => [
        ...prev,
        {
          id: "temp-" + Date.now(),
          habitId,
          completedAt: new Date().toISOString(),
        },
      ]);
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                streak: h.streak + 1,
                longestStreak: Math.max(h.longestStreak, h.streak + 1),
              }
            : h
        )
      );
    }

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: todayStr }),
      });
      if (res.ok) {
        // Background sync to ensure server truth
        const [hRes, lRes] = await Promise.all([
          fetch(`/api/habits?profileId=${id}`),
          fetch(`/api/logs?profileId=${id}&date=${todayStr}`),
        ]);
        if (hRes.ok) setHabits(await hRes.json());
        if (lRes.ok) setLogs(await lRes.json());
      }
    } catch (err) {
      console.error("Error toggling habit:", err);
      // Revert if error
      loadData();
    }
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: id,
          title: newTitle.trim(),
          description: newDesc.trim() || undefined,
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewDesc("");
        setShowAddHabit(false);
        const refetch = await fetch(`/api/habits?profileId=${id}`);
        if (refetch.ok) setHabits(await refetch.json());
      }
    } catch (err) {
      console.error("Error adding habit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      const res = await fetch("/api/habits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: habitId }),
      });
      if (res.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        setLogs((prev) => prev.filter((l) => l.habitId !== habitId));
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-full bg-apple-parchment pb-12">
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-apple-hairline">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
            <div className="h-4 w-16 bg-apple-hairline rounded animate-pulse" />
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-white border border-apple-hairline rounded-apple p-5 mb-6 flex items-center gap-4 animate-pulse">
            <div className="h-14 w-14 rounded-full bg-apple-divider" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 bg-apple-divider rounded" />
              <div className="h-3 w-20 bg-apple-hairline rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-apple-parchment flex flex-col items-center justify-center p-8">
        <p className="text-apple-ink-muted-80 mb-4">Profile not found</p>
        <Link
          href="/profiles"
          className="text-apple-blue hover:text-apple-blue-focus text-sm font-medium"
        >
          Return to Profiles
        </Link>
      </div>
    );
  }

  const completedCount = habits.filter((h) =>
    logs.some((l) => l.habitId === h.id && l.completedAt.split("T")[0] === todayStr)
  ).length;

  const completionPercent =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-full bg-apple-parchment pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-apple-hairline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link
            href="/profiles"
            className="flex items-center gap-1.5 text-apple-blue hover:text-apple-blue-focus text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Profiles</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/stats/${id}`}
              className="inline-flex items-center gap-1.5 text-apple-ink hover:text-apple-blue text-sm font-medium transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Stats</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Profile Card Header */}
        <div className="bg-white border border-apple-hairline rounded-apple p-4 sm:p-5 shadow-apple-subtle mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar name={profile.name} colorIndex={0} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-apple-ink tracking-tight">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-apple-ink-muted-48 mt-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Today &bull;{" "}
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Progress Indicator */}
            {habits.length > 0 && (
              <div className="sm:text-right bg-apple-parchment px-3.5 py-2 rounded-apple border border-apple-hairline">
                <div className="text-xs text-apple-ink-muted-80 font-medium">
                  Progress Today
                </div>
                <div className="text-sm font-bold text-apple-ink">
                  {completedCount} / {habits.length}{" "}
                  <span className="font-normal text-apple-ink-muted-48">
                    ({completionPercent}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {habits.length > 0 && (
            <div className="w-full bg-apple-divider rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Habits Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-apple-ink tracking-tight">Daily Habits</h2>
            <p className="text-xs text-apple-ink-muted-80">
              Tap the circle to mark completion for today
            </p>
          </div>
          <button
            onClick={() => setShowAddHabit(true)}
            className="inline-flex items-center gap-1.5 rounded-apple bg-apple-blue text-white px-3 py-1.5 text-sm font-medium hover:bg-apple-blue-focus transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Habit</span>
          </button>
        </div>

        {/* Habits List */}
        {habits.length === 0 && !showAddHabit ? (
          <div className="bg-white rounded-apple border border-apple-hairline p-8 text-center shadow-apple-subtle">
            <p className="text-sm text-apple-ink-muted-80 mb-4">
              No habits created yet. Add your first habit to begin tracking!
            </p>
            <button
              onClick={() => setShowAddHabit(true)}
              className="inline-flex items-center gap-1.5 rounded-apple bg-apple-blue text-white px-4 py-2 text-sm font-medium hover:bg-apple-blue-focus transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Habit</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  logs={logs}
                  todayStr={todayStr}
                  toggleLog={toggleLog}
                  deleteHabit={deleteHabit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add Habit Modal */}
        {showAddHabit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowAddHabit(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-apple-lg shadow-apple-elevated overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-apple-ink mb-1">Add New Habit</h3>
                <p className="text-sm text-apple-ink-muted-80 mb-4">
                  What daily routine do you want to build?
                </p>
                <form onSubmit={addHabit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-apple-ink-muted-80 mb-1">
                      Habit Title *
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Read 20 pages, 30 min workout"
                      className="w-full border border-apple-hairline rounded-apple px-3.5 py-2 text-sm text-apple-ink focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                      autoFocus
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-apple-ink-muted-80 mb-1">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="e.g. In the morning before coffee"
                      className="w-full border border-apple-hairline rounded-apple px-3.5 py-2 text-sm text-apple-ink focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-2.5 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddHabit(false)}
                      className="px-4 py-2 rounded-apple text-sm font-medium text-apple-ink-muted-80 hover:bg-apple-pearl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newTitle.trim() || isSubmitting}
                      className="px-4 py-2 rounded-apple bg-apple-blue text-white text-sm font-medium hover:bg-apple-blue-focus disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isSubmitting ? "Adding..." : "Add Habit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
