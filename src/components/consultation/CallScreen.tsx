import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldCheck, Radio,
} from "lucide-react";
import Timer from "./Timer";
import RechargeModal from "./RechargeModal";
import { cn } from "@/lib/utils";

interface CallScreenProps {
  sessionId: string;
  minutes: number;
  panditStatus: "online" | "busy" | "offline";
  onEnd: () => void;
  onRecharge: (newMinutes: number) => void;
  panditName?: string;
  panditTitle?: string;
  panditSpecialty?: string;
  panditImage?: string;
}

type CallState = "connecting" | "waiting" | "connected";

const IVR_MESSAGES = [
  "Namaste. Pandit Ji will join shortly. Please stay on the line.",
  "Aapka swagat hai. Kripya prateeksha karein — connecting you now.",
  "Thank you for your patience. Your consultation will begin shortly.",
];

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const CallScreen = ({
  sessionId,
  minutes,
  panditStatus,
  onEnd,
  onRecharge,
  panditName = "Pandit Shiv Tripathi Ji",
  panditTitle = "Vedic Acharya",
  panditSpecialty = "Vedic Astrology · Palm Reading",
  panditImage,
}: CallScreenProps) => {
  const [callState, setCallState] = useState<CallState>("connecting");
  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [ivrIndex, setIvrIndex] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(minutes * 60);
  const [currentMinutes, setCurrentMinutes] = useState(minutes);
  const [connectPhase, setConnectPhase] = useState(0);
  const ivrRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const phaseTimer = window.setInterval(() => {
      setConnectPhase((p) => (p + 1) % 3);
    }, 700);

    const t = window.setTimeout(() => {
      if (panditStatus === "online") {
        setCallState("connected");
      } else {
        setCallState("waiting");
        ivrRef.current = setInterval(
          () => setIvrIndex((i) => (i + 1) % IVR_MESSAGES.length),
          12000,
        );
      }
    }, 2200);

    return () => {
      window.clearTimeout(t);
      window.clearInterval(phaseTimer);
    };
  }, [panditStatus]);

  useEffect(() => {
    if (callState !== "waiting") return;
    const t = window.setTimeout(() => {
      if (ivrRef.current) clearInterval(ivrRef.current);
      setCallState("connected");
    }, 7000);
    return () => window.clearTimeout(t);
  }, [callState]);

  useEffect(() => {
    if (callState !== "connected") return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [callState]);

  const handleEndCall = () => {
    if (ivrRef.current) clearInterval(ivrRef.current);
    onEnd();
  };

  const handleRecharge = async () => {
    setShowWarning(false);
    setShowExpired(false);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentMinutes(12);
    setElapsed(0);
    setRemaining(12 * 60);
    onRecharge(12);
  };

  const statusLabel =
    callState === "connecting"
      ? "Connecting…"
      : callState === "waiting"
        ? "On hold…"
        : "Connected";

  const connectHints = ["Finding Pandit Ji", "Securing line", "Almost there"];

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(120,53,15,0.45),transparent_55%),linear-gradient(180deg,#0c0908_0%,#1a0f0c_45%,#0b0d12_100%)]">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            callState === "connected"
              ? "radial-gradient(circle at 50% 28%, rgba(34,197,94,0.18), transparent 42%)"
              : "radial-gradient(circle at 50% 28%, rgba(251,146,60,0.16), transparent 42%)",
        }}
        aria-hidden
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-orange-200/40">
            Live Consultation
          </p>
          <p className="truncate font-mono text-[11px] text-orange-100/35">
            {sessionId}
          </p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md",
            callState === "connected"
              ? "border-green-400/35 bg-green-500/15 text-green-200"
              : callState === "waiting"
                ? "border-amber-400/35 bg-amber-500/15 text-amber-200"
                : "border-yellow-400/35 bg-yellow-500/15 text-yellow-200",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              callState === "connected" && "bg-green-400 animate-pulse",
              callState === "waiting" && "bg-amber-400 animate-pulse",
              callState === "connecting" && "bg-yellow-400 animate-pulse",
            )}
          />
          {statusLabel}
        </div>
      </div>

      {/* Main stage */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-4">
        {/* Avatar with rings */}
        <div className="relative mb-6">
          {callState === "connected" && (
            <>
              <span
                className="absolute inset-[-18px] rounded-full border border-green-400/25"
                style={{ animation: "live-pulse-ring 2.4s ease-out infinite" }}
                aria-hidden
              />
              <span
                className="absolute inset-[-34px] rounded-full border border-green-400/15"
                style={{ animation: "live-pulse-ring 2.4s ease-out infinite 0.7s" }}
                aria-hidden
              />
            </>
          )}
          {callState === "connecting" && (
            <span
              className="absolute inset-[-22px] rounded-full border border-amber-400/30"
              style={{ animation: "live-pulse-ring 1.6s ease-out infinite" }}
              aria-hidden
            />
          )}

          <div
            className={cn(
              "relative h-36 w-36 overflow-hidden rounded-full border-4 shadow-2xl sm:h-40 sm:w-40",
              callState === "connected"
                ? "border-green-400/50 shadow-green-500/20"
                : "border-amber-400/40 shadow-orange-500/20",
            )}
          >
            {panditImage ? (
              <img
                src={panditImage}
                alt={panditName}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-5xl">
                🧘
              </div>
            )}
          </div>

          {callState === "connected" && (
            <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#0c0908] bg-green-500 shadow-lg">
              <Radio className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Identity — name once only */}
        <div className="mb-6 max-w-sm text-center">
          <h1 className="font-display text-2xl font-bold leading-snug text-amber-50 sm:text-[1.7rem]">
            {panditName}
          </h1>
          {panditTitle && panditTitle !== panditName && (
            <p className="mt-1 text-sm font-medium text-amber-300/80">{panditTitle}</p>
          )}
          {panditSpecialty &&
            panditSpecialty !== panditName &&
            panditSpecialty !== panditTitle && (
              <p className="mt-1 text-sm text-orange-100/45">{panditSpecialty}</p>
            )}
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-teal-300/70">
            <ShieldCheck className="h-3.5 w-3.5" />
            Private encrypted voice session
          </p>
        </div>

        {callState === "connecting" && (
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full bg-amber-400 transition-all duration-300",
                    connectPhase === i ? "scale-125 opacity-100" : "opacity-30",
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-orange-100/55 animate-pulse">
              {connectHints[connectPhase]}
            </p>
          </div>
        )}

        {callState === "waiting" && (
          <div className="mb-8 max-w-xs rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-center backdrop-blur-sm">
            <Volume2 className="mx-auto mb-2 h-5 w-5 text-amber-300" />
            <p className="text-sm leading-relaxed text-orange-100/70">
              {IVR_MESSAGES[ivrIndex]}
            </p>
          </div>
        )}

        {callState === "connected" && (
          <div className="mb-6 w-full max-w-sm">
            <Timer
              totalSeconds={currentMinutes * 60}
              onWarning={() => setShowWarning(true)}
              onExpired={() => setShowExpired(true)}
              warningAt={120}
              onTick={setRemaining}
            />

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-orange-100/35">
                  Elapsed
                </p>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-amber-100">
                  {formatClock(elapsed)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-orange-100/35">
                  Remaining
                </p>
                <p
                  className={cn(
                    "mt-0.5 font-mono text-lg font-semibold tabular-nums",
                    remaining <= 60
                      ? "text-red-300 animate-pulse"
                      : remaining <= 120
                        ? "text-amber-300"
                        : "text-green-300",
                  )}
                >
                  {formatClock(remaining)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {(callState === "waiting" || callState === "connected") && (
        <div className="relative z-10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
          <div className="mx-auto flex max-w-sm items-center justify-center gap-5">
            <Button
              type="button"
              onClick={() => setMuted((m) => !m)}
              variant="outline"
              className={cn(
                "h-14 w-14 rounded-full border-2",
                muted
                  ? "border-red-400/50 bg-red-500/20 text-red-300"
                  : "border-white/15 bg-white/10 text-white hover:bg-white/15",
              )}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              type="button"
              onClick={handleEndCall}
              className="h-[4.25rem] w-[4.25rem] rounded-full bg-red-500 text-white shadow-xl shadow-red-500/40 hover:bg-red-600"
              aria-label="End call"
            >
              <PhoneOff className="h-7 w-7" />
            </Button>

            <Button
              type="button"
              onClick={() => setSpeakerOff((s) => !s)}
              variant="outline"
              className={cn(
                "h-14 w-14 rounded-full border-2",
                speakerOff
                  ? "border-amber-400/50 bg-amber-500/15 text-amber-200"
                  : "border-white/15 bg-white/10 text-white hover:bg-white/15",
              )}
              aria-label={speakerOff ? "Speaker on" : "Speaker off"}
            >
              {speakerOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>

          <div className="mt-4 flex justify-center gap-4 text-[11px] text-orange-100/35">
            <span>{muted ? "Muted" : "Mic on"}</span>
            <span>·</span>
            <span>End</span>
            <span>·</span>
            <span>{speakerOff ? "Earpiece" : "Speaker"}</span>
          </div>
        </div>
      )}

      <RechargeModal
        open={showWarning}
        type="warning"
        onRecharge={handleRecharge}
        onClose={() => setShowWarning(false)}
      />
      <RechargeModal
        open={showExpired}
        type="expired"
        onRecharge={handleRecharge}
        onClose={handleEndCall}
      />
    </div>
  );
};

export default CallScreen;
