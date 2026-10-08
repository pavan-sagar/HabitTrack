"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, User, Trash2, ArrowLeft } from "lucide-react";

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
        "h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold text-base sm:text-lg shadow-sm flex-shrink-0 " +
        COLORS[colorIndex % COLORS.length]
      }
    >
      {initials}
    </div>
  );
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        setNewName("");
        setShowCreate(false);
        const refetch = await fetch("/api/profiles");
        if (refetch.ok) setProfiles(await refetch.json());
      }
    } catch (err) {
      console.error("Error creating profile:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile and all its habits?")) return;
    try {
      const res = await fetch("/api/profiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setProfiles((prev) => prev.filter((p: any) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
    }
  };

  return (
    <div className="min-h-full bg-apple-parchment pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-apple-hairline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-apple-blue hover:text-apple-blue-focus text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <span className="font-semibold text-apple-ink text-sm">Select Profile</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {profiles.length === 0 && !showCreate ? (
          <div className="bg-white rounded-apple-lg border border-apple-hairline p-8 sm:p-12 text-center max-w-lg mx-auto shadow-apple-subtle">
            <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-apple-parchment text-apple-ink-muted-48">
              <User className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-apple-ink mb-2 tracking-tight">
              Create your first profile
            </h2>
            <p className="text-sm text-apple-ink-muted-80 mb-6 leading-relaxed">
              Profiles let you keep habits organized individually. Start by creating a profile to begin tracking.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-apple bg-apple-blue text-white px-5 py-2.5 text-sm font-medium hover:bg-apple-blue-focus transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Profile</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-apple-ink tracking-tight">Profiles</h1>
                <p className="text-sm text-apple-ink-muted-80 mt-0.5">
                  Choose a profile to manage and track daily habits
                </p>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-1.5 rounded-apple bg-apple-blue text-white px-3.5 py-2 text-sm font-medium hover:bg-apple-blue-focus transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>New Profile</span>
              </button>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {profiles.map((profile: any, index: number) => (
                <div
                  key={profile.id}
                  className="group bg-white border border-apple-hairline rounded-apple p-4 sm:p-5 transition-all hover:shadow-apple-subtle hover:border-apple-divider"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/profile/${profile.id}`}
                      className="flex items-center gap-3.5 flex-1 min-w-0"
                    >
                      <Avatar name={profile.name} colorIndex={index} />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-apple-ink truncate text-apple-body-strong group-hover:text-apple-blue transition-colors">
                          {profile.name}
                        </h3>
                        <p className="text-xs text-apple-ink-muted-48 mt-0.5">
                          Created {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => deleteProfile(profile.id)}
                      className="p-2 rounded-apple text-apple-ink-muted-48 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 cursor-pointer"
                      title="Delete profile"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Profile Modal */}
        {showCreate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowCreate(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-apple-lg shadow-apple-elevated overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-apple-ink mb-1">Create Profile</h3>
                <p className="text-sm text-apple-ink-muted-80 mb-5">
                  Enter a name for the new profile.
                </p>
                <form onSubmit={createProfile}>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe, Fitness, Work"
                    className="w-full border border-apple-hairline rounded-apple px-3.5 py-2.5 text-sm text-apple-ink focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                    autoFocus
                    required
                  />
                  <div className="flex gap-2.5 mt-6 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 rounded-apple text-sm font-medium text-apple-ink-muted-80 hover:bg-apple-pearl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newName.trim() || isCreating}
                      className="px-4 py-2 rounded-apple bg-apple-blue text-white text-sm font-medium hover:bg-apple-blue-focus disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isCreating ? "Creating..." : "Create"}
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
