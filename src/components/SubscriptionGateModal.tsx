import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  ChevronLeft,
  Crown,
  Loader2,
  Phone,
  Sparkles,
  Zap,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  isValidIndianMobile,
  normalizeMobile,
  SUBSCRIPTION_PLANS,
} from "@/lib/subscription";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Mobile", "Plan"] as const;

const SubscriptionGateModal = () => {
  const {
    isModalOpen,
    closeModal,
    modalStep,
    setModalStep,
    pendingPath,
    subscribe,
  } = useSubscription();

  const [mobile, setMobile] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("weekly");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    setError(null);
    setSelectedPlan("weekly");
  }, [isModalOpen]);

  const resetAndClose = () => {
    setError(null);
    setLoading(false);
    setMobile("");
    setSelectedPlan("weekly");
    setModalStep(1);
    closeModal();
  };

  const handleMobileContinue = () => {
    setError(null);
    if (!isValidIndianMobile(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setModalStep(2);
  };

  const selected = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);
  const selectedPrice = selected?.price ?? 0;

  /** After plan is chosen — local unlock (payment initiate API disabled) */
  const handleChoosePlan = async () => {
    setError(null);

    if (!selected) {
      setError("Please select a plan.");
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem("userMobile", normalizeMobile(mobile));
      await subscribe(normalizeMobile(mobile), selected.id);
      setMobile("");
      setSelectedPlan("weekly");
      setModalStep(1);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const serviceLabel =
    pendingPath === "/palm-analysis"
      ? "Palm Reading"
      : pendingPath === "/numerology"
        ? "Numerology"
        : pendingPath === "/astrology"
          ? "Astrology"
          : pendingPath === "/dashboard"
            ? "Dashboard"
            : pendingPath === "/consultation" || pendingPath === "/live-consultation"
              ? "Live Consultation"
              : "Cosmic Services";

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-md border-amber-500/30 bg-slate-950/95 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Unlock {serviceLabel}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {modalStep === 1
              ? "Enter your mobile number to continue"
              : "Choose a plan to continue"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-2">
          {STEP_LABELS.map((label, i) => {
            const step = (i + 1) as 1 | 2;
            const active = modalStep === step;
            const done = modalStep > step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done && "bg-green-500/20 text-green-400 border border-green-400/40",
                    active && "bg-amber-500/30 text-amber-200 border border-amber-400/50",
                    !done && !active && "bg-white/5 text-gray-500 border border-white/10",
                  )}
                >
                  {done ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs hidden sm:inline",
                    active ? "text-amber-300" : "text-gray-500",
                  )}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className="w-6 h-px bg-white/10 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Step 1: Enter mobile number */}
        {modalStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sub-mobile" className="text-gray-300">
                Enter mobile number
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-amber-300">
                  <Phone className="h-3.5 w-3.5 text-amber-400/80" />
                  +91
                </div>
                <Input
                  id="sub-mobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleMobileContinue();
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  autoFocus
                />
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-black font-semibold"
              onClick={handleMobileContinue}
              disabled={mobile.length !== 10}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Choose ₹51 or ₹101 → open payment */}
        {modalStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 text-center">
              +91 {normalizeMobile(mobile)}
            </p>

            <div className="grid gap-3">
              {SUBSCRIPTION_PLANS.map((p) => {
                const Icon = p.id === "monthly" ? Crown : Zap;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={cn(
                      "relative text-left rounded-xl border-2 p-4 transition-all",
                      selectedPlan === p.id
                        ? "border-amber-400 bg-amber-500/15 scale-[1.01]"
                        : "border-white/10 bg-white/5 hover:border-white/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                          <Icon className="h-5 w-5 text-amber-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-xs text-gray-400">per {p.period}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">₹{p.price}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-amber-400">₹{selectedPrice}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white/10 text-gray-300"
                onClick={() => setModalStep(1)}
                disabled={loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-black font-semibold"
                onClick={handleChoosePlan}
                disabled={loading || !selectedPlan}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Continuing...
                  </>
                ) : (
                  `Continue · ₹${selectedPrice}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionGateModal;
