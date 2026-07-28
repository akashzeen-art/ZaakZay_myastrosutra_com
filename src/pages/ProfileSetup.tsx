import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loadBirthProfile,
  saveBirthProfile,
  type BirthProfileInput,
} from "@/services/userProfileApi";
import { normalizeMobile } from "@/lib/subscription";
import { CheckCircle2, Loader2, UserRound } from "lucide-react";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const existing = useMemo(() => loadBirthProfile(), []);
  const storedMobile = normalizeMobile(
    existing?.mobile || localStorage.getItem("userMobile") || "",
  );
  const [form, setForm] = useState<BirthProfileInput>({
    fullName: existing?.fullName || "",
    birthDate: existing?.birthDate || "",
    birthTime: existing?.birthTime || "",
    birthPlace: existing?.birthPlace || "",
    gender: existing?.gender || "",
    mobile: storedMobile,
    email: existing?.email || "",
    maritalStatus: existing?.maritalStatus || "",
    occupation: existing?.occupation || "",
    timezone: existing?.timezone || "Asia/Kolkata",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [syncPending, setSyncPending] = useState(false);

  const update = (field: keyof BirthProfileInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const mobile = normalizeMobile(form.mobile);
    if (
      !form.fullName.trim() ||
      !form.birthDate ||
      !form.birthTime ||
      !form.birthPlace.trim() ||
      !form.gender ||
      mobile.length !== 10
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setSaving(true);
    const { synced } = await saveBirthProfile({ ...form, mobile });
    setSyncPending(!synced);
    localStorage.setItem("userMobile", mobile);
    localStorage.setItem("profileSetupComplete", "true");
    const destination = localStorage.getItem("postProfilePath") || "/";
    localStorage.removeItem("postProfilePath");
    setSaving(false);

    if (synced) {
      navigate(destination, { replace: true });
    } else {
      window.setTimeout(() => navigate(destination, { replace: true }), 1400);
    }
  };

  return (
    <Layout>
      <div className="sutra-page mx-auto max-w-2xl px-4 py-8">
        <div className="sutra-panel p-5 sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10">
              <UserRound className="h-7 w-7 text-amber-300" />
            </div>
            <h1 className="font-display text-2xl font-bold text-amber-50">
              Complete Your Birth Profile
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-orange-100/55">
              These details personalize Pandit guidance, numerology, Kundli, and horoscope predictions.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 bg-white/5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Date of birth *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={form.birthDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => update("birthDate", e.target.value)}
                  className="mt-2 bg-white/5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthTime">Time of birth *</Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={form.birthTime}
                  onChange={(e) => update("birthTime", e.target.value)}
                  className="mt-2 bg-white/5"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="birthPlace">Place of birth *</Label>
                <Input
                  id="birthPlace"
                  value={form.birthPlace}
                  onChange={(e) => update("birthPlace", e.target.value)}
                  placeholder="City, State, Country"
                  className="mt-2 bg-white/5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-sm text-foreground"
                  required
                >
                  <option value="" className="bg-slate-950">Select gender</option>
                  <option value="male" className="bg-slate-950">Male</option>
                  <option value="female" className="bg-slate-950">Female</option>
                  <option value="other" className="bg-slate-950">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="mobile">Mobile number *</Label>
                <div className="mt-2 flex">
                  <span className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-white/5 px-3 text-sm text-amber-300">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    inputMode="numeric"
                    value={form.mobile}
                    onChange={(e) =>
                      update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="rounded-l-none bg-white/5"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Optional"
                  className="mt-2 bg-white/5"
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={form.occupation}
                  onChange={(e) => update("occupation", e.target.value)}
                  placeholder="Optional"
                  className="mt-2 bg-white/5"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="maritalStatus">Marital status</Label>
                <select
                  id="maritalStatus"
                  value={form.maritalStatus}
                  onChange={(e) => update("maritalStatus", e.target.value)}
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-sm text-foreground"
                >
                  <option value="" className="bg-slate-950">Prefer not to say</option>
                  <option value="single" className="bg-slate-950">Single</option>
                  <option value="married" className="bg-slate-950">Married</option>
                  <option value="divorced" className="bg-slate-950">Divorced</option>
                  <option value="widowed" className="bg-slate-950">Widowed</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            {syncPending && (
              <p className="flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                <CheckCircle2 className="h-4 w-4" />
                Profile saved. Backend sync will retry when the API is available.
              </p>
            )}

            <Button
              type="submit"
              disabled={saving}
              className="h-12 w-full bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Saving Profile..." : "Save and Continue"}
            </Button>
            <p className="text-center text-xs text-orange-100/35">
              Your birth details are private and used only to personalize your readings.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
