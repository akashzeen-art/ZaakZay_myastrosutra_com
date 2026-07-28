import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from "@/lib/config";
import { normalizeMobile } from "@/lib/subscription";

export interface BirthProfile {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  mobile: string;
  email?: string;
  maritalStatus?: string;
  occupation?: string;
  timezone: string;
  updatedAt: string;
}

export type BirthProfileInput = Omit<BirthProfile, "updatedAt">;

const PROFILE_STORAGE_KEY = "myastrosutra_birth_profile";

export function loadBirthProfile(): BirthProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BirthProfile;
  } catch {
    return null;
  }
}

export function hasCompleteBirthProfile(profile = loadBirthProfile()): boolean {
  return Boolean(
    profile?.fullName.trim() &&
      profile.birthDate &&
      profile.birthTime &&
      profile.birthPlace.trim() &&
      profile.gender &&
      normalizeMobile(profile.mobile).length === 10,
  );
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Saves immediately on-device, then syncs to the configured backend profile API.
 * The backend should accept PATCH /auth/me/ with the User fields below.
 */
export async function saveBirthProfile(
  input: BirthProfileInput,
): Promise<{ profile: BirthProfile; synced: boolean }> {
  const profile: BirthProfile = {
    ...input,
    mobile: normalizeMobile(input.mobile),
    fullName: input.fullName.trim(),
    birthPlace: input.birthPlace.trim(),
    email: input.email?.trim() || undefined,
    occupation: input.occupation?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (storedUser) {
      const user = JSON.parse(storedUser) as Record<string, unknown>;
      const [firstName, ...lastParts] = profile.fullName.split(/\s+/);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify({
          ...user,
          first_name: firstName,
          last_name: lastParts.join(" "),
          phone_number: profile.mobile,
          birth_date: profile.birthDate,
          birth_time: profile.birthTime,
          birth_place: profile.birthPlace,
          gender: profile.gender,
          timezone: profile.timezone,
        }),
      );
    }
  } catch {
    // Keep the dedicated birth profile even if legacy user data is malformed.
  }
  window.dispatchEvent(new CustomEvent("birth-profile-updated", { detail: profile }));

  const [firstName, ...lastParts] = profile.fullName.split(/\s+/);
  const payload = {
    first_name: firstName,
    last_name: lastParts.join(" "),
    phone_number: profile.mobile,
    birth_date: profile.birthDate,
    birth_time: profile.birthTime,
    birth_place: profile.birthPlace,
    gender: profile.gender,
    email: profile.email || undefined,
    marital_status: profile.maritalStatus || undefined,
    occupation: profile.occupation || undefined,
    timezone: profile.timezone,
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Profile sync failed (${response.status})`);
    return { profile, synced: true };
  } catch (error) {
    console.warn("Profile saved locally; backend sync is pending:", error);
    return { profile, synced: false };
  }
}

export function zodiacSignFromBirthDate(birthDate: string): string {
  const [, monthText, dayText] = birthDate.split("-");
  const month = Number(monthText);
  const day = Number(dayText);
  const cutoffs = [20, 19, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20];
  const signs = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius",
  ];
  if (!month || !day) return "";
  return day <= cutoffs[month - 1] ? signs[month - 1] : signs[month % 12];
}
