/**
 * Volunteer identity without an account: registration returns `{ id, token }`,
 * kept in localStorage. The token is sent as `X-Volunteer-Token` to join
 * groups and unlock member contact details. Trust-based by design.
 */

const STORAGE_KEY = "najda_volunteer";

export interface VolunteerIdentity {
  id: number;
  token: string;
  firstName: string;
}

export function getVolunteer(): VolunteerIdentity | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VolunteerIdentity;
    return typeof parsed.token === "string" && parsed.token ? parsed : null;
  } catch {
    return null;
  }
}

export function saveVolunteer(identity: VolunteerIdentity): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

/** Headers to attach to requests that may unlock member-only data. */
export function volunteerHeaders(): Record<string, string> {
  const identity = getVolunteer();
  return identity ? { "X-Volunteer-Token": identity.token } : {};
}
