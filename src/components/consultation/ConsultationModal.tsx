import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, Star, Shield, BadgeCheck, Languages } from "lucide-react";
import type { PanditProfile } from "@/data/pandits";

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  pandit?: Pick<
    PanditProfile,
    "name" | "title" | "image" | "specialty" | "rating" | "sessions" | "experienceYears"
  > | null;
}

const ConsultationModal = ({
  open,
  onClose,
  onProceed,
  pandit,
}: ConsultationModalProps) => {
  const [loading, setLoading] = useState(false);
  const name = pandit?.name || "Pandit Shiv Tripathi Ji";
  const title = pandit?.title || "Vedic Acharya";
  const specialty = pandit?.specialty || "Vedic Astrology · Palm Reading · Numerology";
  const rating = pandit?.rating ?? 4.9;
  const sessions = pandit?.sessions ?? 2300;
  const years = pandit?.experienceYears ?? 20;

  const handleRecharge = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onProceed();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto overflow-hidden border-orange-500/30 bg-[hsl(16_32%_8%)] p-0 text-white sm:rounded-2xl">
        <div className="relative h-36 overflow-hidden">
          {pandit?.image ? (
            <img
              src={pandit.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top opacity-50 blur-[2px] scale-110"
              aria-hidden
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[hsl(16_32%_8%/0.65)] to-[hsl(16_32%_8%)]" />
          <DialogHeader className="relative z-10 px-6 pt-5">
            <DialogTitle className="text-center text-lg font-bold tracking-wide">
              Confirm Live Consultation
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="relative z-10 -mt-14 space-y-5 px-5 pb-6">
          <div className="rounded-2xl border border-amber-400/25 bg-[hsl(16_28%_10%/0.92)] p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              {pandit?.image ? (
                <img
                  src={pandit.image}
                  alt={name}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top border-2 border-amber-400/35 shadow-lg"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-2xl">
                  🧘
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-teal-400/25 bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-200">
                  <BadgeCheck className="h-3 w-3" />
                  Verified · Available
                </div>
                <p className="font-semibold text-white leading-snug">{name}</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">{title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-orange-100/55">
                  <span className="inline-flex items-center gap-0.5 text-amber-200">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span>{sessions.toLocaleString()}+ sessions</span>
                  <span>·</span>
                  <span>{years}+ yrs</span>
                </div>
                <p className="mt-1 text-[11px] text-orange-100/45 line-clamp-1">{specialty}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-orange-950/50 to-amber-950/20 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-orange-100/70">
                <Clock className="w-4 h-4 text-amber-300" />
                Session duration
              </div>
              <Badge className="bg-orange-500/20 text-orange-100 border-amber-400/30">
                12 Minutes
              </Badge>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-orange-100/45">Consultation fee</p>
                <p className="text-3xl font-bold text-white leading-none mt-1">₹551</p>
              </div>
              <p className="text-xs text-orange-100/40">₹45.9 / min</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-orange-100/45">
              <Languages className="h-3.5 w-3.5" />
              Hindi & English guidance
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-orange-100/65">
            {["Private voice call", "Instant connect", "Secure session", "Expert remedies"].map(
              (f) => (
                <div
                  key={f}
                  className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {f}
                </div>
              ),
            )}
          </div>

          <Button
            onClick={handleRecharge}
            disabled={loading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-base font-bold text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-red-600"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Connecting to Pandit Ji...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Recharge & Talk — ₹551
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-orange-100/35">
            <Shield className="h-3 w-3" />
            Demo mode — no real payment processed
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
