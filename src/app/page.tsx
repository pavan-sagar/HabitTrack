'use client';

import Link from 'next/link';
import { Check, TrendingUp, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-full bg-apple-parchment flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-apple-hairline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center shadow-sm">
              <Check className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-semibold text-apple-ink text-lg tracking-tight">HabitTrack</span>
          </div>
          <Link
            href="/profiles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-apple bg-apple-blue hover:bg-apple-blue-focus text-white text-sm font-medium transition-colors cursor-pointer shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple & Focused Daily Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-apple-ink tracking-tight mb-3">
            Build habits that actually stick.
          </h1>
          <p className="text-base sm:text-lg text-apple-ink-muted-80 max-w-xl mx-auto">
            A clean, minimal habit tracker designed to help you stay consistent and build momentum every day.
          </p>
        </div>

        {/* Progress Preview Card */}
        <div className="bg-white rounded-apple-lg p-6 sm:p-8 border border-apple-hairline shadow-apple-subtle mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-apple-ink-muted-48">Daily Overview</span>
              <h2 className="text-xl sm:text-2xl font-semibold text-apple-ink tracking-tight mt-0.5">Today's Progress</h2>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-apple text-sm font-medium self-start sm:self-auto border border-green-200">
              <TrendingUp className="h-4 w-4" />
              <span>Great momentum</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-apple-ink mb-1.5">
                <span>Completed</span>
                <span>4 of 5 habits (80%)</span>
              </div>
              <div className="w-full bg-apple-divider rounded-full h-2.5 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full w-[80%] transition-all duration-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-apple bg-apple-parchment border border-apple-hairline">
                <div className="h-7 w-7 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-apple-ink truncate">Morning Meditation</p>
                  <p className="text-xs text-apple-ink-muted-48">14 day streak</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-apple bg-apple-parchment border border-apple-hairline">
                <div className="h-7 w-7 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-apple-ink truncate">Read 20 Pages</p>
                  <p className="text-xs text-apple-ink-muted-48">8 day streak</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-apple bg-apple-parchment border border-apple-hairline">
                <div className="h-7 w-7 rounded-full bg-white border border-apple-divider text-apple-ink-muted-48 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-apple-ink truncate">Evening Workout</p>
                  <p className="text-xs text-apple-ink-muted-48">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white rounded-apple-lg p-5 sm:p-6 border border-apple-hairline shadow-apple-subtle">
            <div className="w-10 h-10 rounded-apple bg-blue-50 text-apple-blue flex items-center justify-center mb-3.5">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-apple-ink text-base mb-1">Multiple Profiles</h3>
            <p className="text-sm text-apple-ink-muted-80 leading-relaxed">
              Create individual profiles for yourself, family members, or different life areas (Work, Health, Learning).
            </p>
          </div>

          <div className="bg-white rounded-apple-lg p-5 sm:p-6 border border-apple-hairline shadow-apple-subtle">
            <div className="w-10 h-10 rounded-apple bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>
            <h3 className="font-semibold text-apple-ink text-base mb-1">Instant 1-Click Logging</h3>
            <p className="text-sm text-apple-ink-muted-80 leading-relaxed">
              Tick and untick habits with instant feedback. Easily keep your daily streaks going without clutter.
            </p>
          </div>

          <div className="bg-white rounded-apple-lg p-5 sm:p-6 border border-apple-hairline shadow-apple-subtle">
            <div className="w-10 h-10 rounded-apple bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-apple-ink text-base mb-1">Visual Analytics</h3>
            <p className="text-sm text-apple-ink-muted-80 leading-relaxed">
              Track monthly trends, completion rates, and historical streaks with interactive charts and breakdowns.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-apple-lg p-6 sm:p-8 border border-apple-hairline shadow-apple-subtle">
          <h2 className="text-xl sm:text-2xl font-bold text-apple-ink tracking-tight mb-2">
            Ready to track your habits?
          </h2>
          <p className="text-sm text-apple-ink-muted-80 max-w-md mx-auto mb-5">
            Select or create a profile to start logging your daily progress.
          </p>
          <Link
            href="/profiles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-apple bg-apple-blue hover:bg-apple-blue-focus text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <span>Open Habit Tracker</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-apple-hairline bg-white py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-apple-ink-muted-48">
          HabitTrack &copy; {new Date().getFullYear()} &mdash; Simple &amp; Effective Habit Tracker
        </div>
      </footer>
    </div>
  );
}
