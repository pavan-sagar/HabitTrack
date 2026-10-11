export function isProfileUnlocked(id: string): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(`unlocked_${id}`) === 'true';
}

export function setProfileUnlocked(id: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`unlocked_${id}`, 'true');
}

export function lockProfile(id: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(`unlocked_${id}`);
}
