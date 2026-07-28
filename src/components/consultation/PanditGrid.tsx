import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Phone,
  Star,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Languages,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getShuffledRoster,
  type PanditProfile,
  type PanditStatus,
} from "@/data/pandits";

type RosterItem = PanditProfile & { status: PanditStatus };
type FilterMode = "all" | "available";

interface PanditGridProps {
  onCall: (pandit: RosterItem) => void;
}

const PanditGrid = ({ onCall }: PanditGridProps) => {
  const [tick, setTick] = useState(() => Date.now());
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const roster = useMemo(() => getShuffledRoster(tick), [tick]);
  const availableCount = roster.filter((p) => p.status === "available").length;
  const busyCount = roster.length - availableCount;

  const featured =
    roster.find((p) => p.featured && p.status === "available") ||
    roster.find((p) => p.status === "available") ||
    roster.find((p) => p.featured) ||
    roster[0];

  const gridList = useMemo(() => {
    const withoutDup = featured
      ? roster.filter((p) => p.id !== featured.id)
      : roster;
    const list =
      filter === "available"
        ? withoutDup.filter((p) => p.status === "available")
        : withoutDup;
    // Available first, then busy — still shuffled within groups via roster seed
    return [...list].sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "available" ? -1 : 1;
    });
  }, [roster, featured, filter]);

  return (
    <div className="space-y-6">
      {/* Compact stats row */}
      <div className="flex flex-wrap items-center gap-2">
        <StatChip icon={<Users className="h-3.5 w-3.5" />} label={`${roster.length} Gurus`} />
        <StatChip
          tone="green"
          icon={<span className="h-2 w-2 rounded-full bg-green-400" />}
          label={`${availableCount} free`}
        />
        <StatChip
          tone="red"
          icon={<span className="h-2 w-2 rounded-full bg-red-500" />}
          label={`${busyCount} busy`}
        />
        <span className="ml-auto hidden text-[11px] text-orange-100/35 sm:inline">
          Roster refreshes every 5 min
        </span>
      </div>

      {featured && (
        <FeaturedCard pandit={featured} onCall={() => onCall(featured)} />
      )}

      <div className="sticky top-[4.25rem] z-20 -mx-1 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[hsl(16_28%_8%/0.82)] px-2 py-2 backdrop-blur-xl sm:mx-0 sm:px-3">
        <div className="flex rounded-full bg-black/25 p-1">
          {(
            [
              { id: "all", label: "All" },
              { id: "available", label: "Available" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                filter === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow"
                  : "text-orange-100/45 hover:text-amber-100",
              )}
            >
              {tab.label}
              {tab.id === "available" ? ` (${availableCount})` : ""}
            </button>
          ))}
        </div>
        <p className="pr-1 text-[11px] text-orange-100/35">
          {gridList.length} shown
        </p>
      </div>

      {gridList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
          <Clock className="mx-auto mb-3 h-8 w-8 text-orange-100/30" />
          <p className="font-display text-lg text-amber-100/80">No one free right now</p>
          <p className="mt-1 text-sm text-orange-100/40">
            Availability updates every few minutes.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 border-white/15 text-amber-100"
            onClick={() => setFilter("all")}
          >
            Show all Gurus
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
          {gridList.map((pandit, index) => (
            <PanditCard
              key={pandit.id}
              pandit={pandit}
              onCall={() => onCall(pandit)}
              style={{ animationDelay: `${Math.min(index, 14) * 35}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function StatChip({
  label,
  icon,
  tone = "neutral",
}: {
  label: string;
  icon: ReactNode;
  tone?: "neutral" | "green" | "red";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
        tone === "green" && "border-green-500/25 bg-green-500/10 text-green-300",
        tone === "red" && "border-red-500/25 bg-red-500/10 text-red-300/90",
        tone === "neutral" && "border-white/10 bg-white/5 text-orange-100/65",
      )}
    >
      {icon}
      {label}
    </span>
  );
}

function FeaturedCard({
  pandit,
  onCall,
}: {
  pandit: RosterItem;
  onCall: () => void;
}) {
  const isAvailable = pandit.status === "available";

  return (
    <article className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-[linear-gradient(120deg,rgba(90,35,12,0.72),rgba(28,16,12,0.82)_55%,rgba(12,18,28,0.75))] shadow-[0_24px_70px_-28px_rgba(0,0,0,0.75)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(251,191,36,0.2), transparent 38%), radial-gradient(circle at 90% 80%, rgba(249,115,22,0.12), transparent 34%)",
        }}
        aria-hidden
      />

      <div className="relative grid gap-0 lg:grid-cols-[220px_1fr]">
        <div className="relative">
          <img
            src={pandit.image}
            alt=""
            className="h-72 w-full object-cover object-[center_15%] sm:h-80 lg:h-full lg:min-h-[420px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-[rgba(20,12,8,0.7)]" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-amber-300/45 bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-50 backdrop-blur-md">
              ★ Top pick
            </span>
            <StatusPill status={pandit.status} />
          </div>
        </div>

        <div className="flex flex-col justify-center p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-400/25 bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-200">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-orange-100/60">
              <Languages className="h-3 w-3" />
              Hindi · English
            </span>
          </div>

          <h2 className="font-display text-xl font-bold leading-none text-amber-50 sm:text-2xl">
            {pandit.name}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-amber-300/85">{pandit.title}</p>
          <p className="mt-1 max-w-xl text-xs leading-snug text-orange-100/55">
            {pandit.specialty} · private live voice guidance
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <MetaBadge>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {pandit.rating.toFixed(1)}
            </MetaBadge>
            <MetaBadge>{pandit.sessions.toLocaleString()}+ sessions</MetaBadge>
            <MetaBadge>{pandit.experienceYears}+ yrs</MetaBadge>
            <MetaBadge>
              <ShieldCheck className="h-3 w-3 text-teal-300" />
              Trusted
            </MetaBadge>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              onClick={onCall}
              disabled={!isAvailable}
              className={cn(
                "h-11 min-w-[200px] rounded-full px-6 text-sm font-bold shadow-lg",
                isAvailable
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/30 hover:from-orange-600 hover:to-red-600"
                  : "cursor-not-allowed bg-white/10 text-orange-100/40 shadow-none",
              )}
            >
              <Phone className="mr-2 h-4 w-4" />
              {isAvailable ? "Click to Call · ₹551" : "Currently Busy"}
            </Button>
            <p className="text-[11px] text-orange-100/40">12 min · instant connect</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function PanditCard({
  pandit,
  onCall,
  style,
}: {
  pandit: RosterItem;
  onCall: () => void;
  style?: CSSProperties;
}) {
  const isAvailable = pandit.status === "available";

  return (
    <button
      type="button"
      onClick={() => {
        if (isAvailable) onCall();
      }}
      disabled={!isAvailable}
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300",
        "bg-white/[0.03] shadow-[0_12px_36px_-20px_rgba(0,0,0,0.8)] animate-[fadeUp_0.45s_ease_both]",
        isAvailable
          ? "border-green-500/25 hover:-translate-y-1.5 hover:border-green-400/50 hover:shadow-[0_20px_44px_-16px_rgba(34,197,94,0.35)] cursor-pointer"
          : "border-white/[0.08] opacity-75 cursor-not-allowed",
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={pandit.image}
          alt=""
          className={cn(
            "h-full w-full object-cover object-top transition-transform duration-500",
            isAvailable && "group-hover:scale-[1.05]",
            !isAvailable && "grayscale-[45%] brightness-[0.7]",
          )}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

        <div className="absolute left-2 top-2">
          <StatusPill status={pandit.status} compact />
        </div>
        <div className="absolute right-2 top-2 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-amber-100 backdrop-blur-sm">
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            {pandit.rating.toFixed(1)}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 space-y-0.5 p-2.5">
          <p className="font-display text-[12px] font-semibold leading-tight text-white line-clamp-2 sm:text-[13px]">
            {pandit.name}
          </p>
          <p className="text-[10px] leading-tight text-amber-100/65 line-clamp-1">
            {pandit.title}
          </p>
          <div className="flex items-center justify-between gap-2 text-[10px] text-white/45">
            <span>{pandit.experienceYears}+ yrs</span>
            <span>
              {pandit.sessions >= 1000
                ? `${(pandit.sessions / 1000).toFixed(1)}k`
                : pandit.sessions}
              +
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 p-2.5">
        {isAvailable ? (
          <span className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-[11px] font-bold text-white shadow-md shadow-orange-500/25 transition group-hover:from-orange-400 group-hover:to-red-500">
            <Phone className="h-3.5 w-3.5" />
            Click to Call
          </span>
        ) : (
          <span className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] text-[11px] font-medium text-orange-100/35">
            <Clock className="h-3.5 w-3.5" />
            Busy
          </span>
        )}
      </div>
    </button>
  );
}

function StatusPill({
  status,
  compact = false,
}: {
  status: PanditStatus;
  compact?: boolean;
}) {
  const available = status === "available";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold backdrop-blur-md shadow",
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        available
          ? "border-green-400/40 bg-green-500/25 text-green-50"
          : "border-red-400/40 bg-red-500/25 text-red-50",
      )}
    >
      <span
        className={cn(
          "rounded-full",
          compact ? "h-1.5 w-1.5" : "h-2 w-2",
          available ? "bg-green-400 animate-pulse" : "bg-red-400",
        )}
      />
      {available ? "Available" : "Busy"}
    </span>
  );
}

function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-orange-100/70 backdrop-blur-sm">
      {children}
    </span>
  );
}

export default PanditGrid;
export type { RosterItem };
