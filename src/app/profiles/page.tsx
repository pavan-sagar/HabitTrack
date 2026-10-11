"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, User, Trash2, ArrowLeft, Lock } from "lucide-react";
import { PinModal } from "@/components/PinModal";
import { isProfileUnlocked, setProfileUnlocked } from "@/lib/pinAuth";

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

function Avatar({
  name,
  colorIndex,
  isProtected,
}: {
  name: string;
  colorIndex: number;
  isProtected?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="relative">
      <div
        className={
          "h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold text-base sm:text-lg shadow-sm flex-shrink-0 " +
          COLORS[colorIndex % COLORS.length]
        }
      >
        {initials}
      </div>
      {isProtected && (
        <div
          className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-sm border-2 border-white"
          title="Protected with PIN"
        >
          <Lock className="h-3 w-3 stroke-[2.5]" />
        </div>
      )}
    </div>
  );
}

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [enablePin, setEnablePin] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Pin Unlock Modal state
  const [activeLockedProfile, setActiveLockedProfile] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isCreating) return;
    if (enablePin && pinValue.length !== 4) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          pin: enablePin ? pinValue : undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setNewName("");
        setEnablePin(false);
        setPinValue("");
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

  const handleProfileClick = (profile: any) => {
    if (profile.isProtected) {
      setActiveLockedProfile({ id: profile.id, name: profile.name });
    } else {
      router.push(`/profile/${profile.id}`);
    }
  };

  const deleteProfile = async (id: string, isProtected: boolean) => {
    let pin: string | undefined = undefined;
    if (isProtected) {
      const entered = prompt("Enter the 4-digit PIN to delete this profile:");
      if (!entered) return;
      pin = entered;
    } else {
      if (!confirm("Are you sure you want to delete this profile and all its habits?")) return;
    }

    try {
      const res = await fetch("/api/profiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin }),
      });
      if (res.ok) {
        setProfiles((prev) => prev.filter((p: any) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete profile");
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
              Profiles let you keep habits organized individually. You can also protect them with a PIN.
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
                    <button
                      type="button"
                      onClick={() => handleProfileClick(profile)}
                      className="flex items-center gap-3.5 flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <Avatar
                        name={profile.name}
                        colorIndex={index}
                        isProtected={profile.isProtected}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-apple-ink truncate text-apple-body-strong group-hover:text-apple-blue transition-colors">
                            {profile.name}
                          </h3>
                          {profile.isProtected && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <Lock className="h-2.5 w-2.5" />
                              PIN
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-apple-ink-muted-48 mt-0.5">
                          Created {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteProfile(profile.id, profile.isProtected)}
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
                  Enter a profile name and optional PIN protection.
                </p>
                <form onSubmit={createProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-apple-ink-muted-80 mb-1">
                      Profile Name *
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. John Doe, Fitness, Work"
                      className="w-full border border-apple-hairline rounded-apple px-3.5 py-2.5 text-sm text-apple-ink focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                      autoFocus
                      required
                    />
                  </div>

                  {/* PIN Protection Option */}
                  <div className="pt-2 border-t border-apple-hairline">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={enablePin}
                        onChange={(e) => {
                          setEnablePin(e.target.checked);
                          if (!e.target.checked) setPinValue("");
                        }}
                        className="rounded border-apple-divider text-apple-blue focus:ring-apple-blue h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-apple-ink flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        Protect profile with 4-digit PIN
                      </span>
                    </label>

                    {enablePin && (
                      <div className="mt-3 bg-apple-parchment p-3 rounded-apple border border-apple-hairline">
                        <label className="block text-xs text-apple-ink-muted-80 mb-1 font-medium">
                          Set 4-Digit Numeric PIN
                        </label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={pinValue}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setPinValue(val);
                          }}
                          placeholder="••••"
                          className="w-32 tracking-widest text-center text-lg font-bold border border-apple-divider bg-white rounded-apple py-1.5 px-3 focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none"
                          required={enablePin}
                        />
                        <p className="text-[11px] text-apple-ink-muted-48 mt-1">
                          You will need this PIN to view habits and analytics.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 rounded-apple text-sm font-medium text-apple-ink-muted-80 hover:bg-apple-pearl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !newName.trim() ||
                        isCreating ||
                        (enablePin && pinValue.length !== 4)
                      }
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

        {/* PIN Verification Modal */}
        {activeLockedProfile && (
          <PinModal
            isOpen={Boolean(activeLockedProfile)}
            profileId={activeLockedProfile.id}
            profileName={activeLockedProfile.name}
            onSuccess={() => {
              setProfileUnlocked(activeLockedProfile.id);
              const targetId = activeLockedProfile.id;
              setActiveLockedProfile(null);
              router.push(`/profile/${targetId}`);
            }}
            onCancel={() => setActiveLockedProfile(null)}
          />
        )}
      </main>
    </div>
  );
}
