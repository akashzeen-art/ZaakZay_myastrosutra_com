import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CallScreen from "@/components/consultation/CallScreen";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { loadBirthProfile } from "@/services/userProfileApi";

const generateSessionId = () =>
  "CALL" + Math.random().toString(36).substring(2, 8).toUpperCase();

type SelectedPandit = {
  id: string;
  name: string;
  title: string;
  image: string;
  specialty: string;
};

function loadSelectedPandit(): SelectedPandit | null {
  try {
    const raw = localStorage.getItem("selected_pandit");
    return raw ? (JSON.parse(raw) as SelectedPandit) : null;
  } catch {
    return null;
  }
}

const Consultation = () => {
  const navigate = useNavigate();
  const [sessionId] = useState(generateSessionId);
  const [minutes, setMinutes] = useState(12);
  const [selectedPandit] = useState(() => loadSelectedPandit());
  const [panditStatus, setPanditStatus] = useState<"online" | "busy" | "offline">(
    () =>
      selectedPandit
        ? "online"
        : (localStorage.getItem("pandit_status") as "online" | "busy" | "offline") ||
          "busy",
  );
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setPanditStatus((e as CustomEvent).detail);
    };
    window.addEventListener("pandit-status-change", handler);
    return () => window.removeEventListener("pandit-status-change", handler);
  }, []);

  useEffect(() => {
    const profile = loadBirthProfile();
    const session = {
      sessionId,
      startTime: new Date().toISOString(),
      minutes,
      amount: 551,
      status: "active",
      pandit: selectedPandit,
      customer: profile
        ? {
            fullName: profile.fullName,
            birthDate: profile.birthDate,
            birthTime: profile.birthTime,
            birthPlace: profile.birthPlace,
            gender: profile.gender,
            mobile: profile.mobile,
          }
        : null,
    };
    try {
      const stored = JSON.parse(localStorage.getItem("call_sessions") || "[]");
      if (Array.isArray(stored)) {
        stored.push(session);
        localStorage.setItem("call_sessions", JSON.stringify(stored));
      }
    } catch {
      localStorage.setItem("call_sessions", JSON.stringify([session]));
    }
  }, [sessionId, selectedPandit, minutes]);

  const handleEnd = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("call_sessions") || "[]");
      if (Array.isArray(stored)) {
        const updated = stored.map((s: { sessionId?: string }) =>
          s.sessionId === sessionId
            ? { ...s, status: "completed", endTime: new Date().toISOString() }
            : s,
        );
        localStorage.setItem("call_sessions", JSON.stringify(updated));
      }
    } catch {
      // ignore corrupt session store
    }
    setEnded(true);
  };

  const handleRecharge = (newMinutes: number) => {
    setMinutes(newMinutes);
    setEnded(false);
  };

  if (panditStatus === "offline") {
    return (
      <Layout fullBleed noMobileFabPad>
        <div className="flex min-h-[70vh] items-center justify-center p-4">
          <div className="sutra-panel max-w-sm space-y-4 p-8 text-center">
            <div className="text-5xl">🧘</div>
            <h2 className="font-display text-xl font-bold text-amber-50">
              Pandit Ji is Offline
            </h2>
            <p className="text-sm text-orange-100/50">
              Pandit Ji is not available right now. Please try again later.
            </p>
            <Button
              onClick={() => navigate("/live-consultation")}
              variant="outline"
              className="sutra-btn-outline"
            >
              Back to Pandits
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (ended) {
    return (
      <Layout fullBleed noMobileFabPad>
        <div className="flex min-h-[70vh] items-center justify-center p-4">
          <div className="sutra-panel max-w-sm space-y-5 p-8 text-center">
            {selectedPandit?.image ? (
              <img
                src={selectedPandit.image}
                alt=""
                className="mx-auto h-20 w-20 rounded-full object-cover object-top border-2 border-amber-400/40"
              />
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400/50 bg-orange-500/20">
                <Phone className="h-10 w-10 text-amber-400" />
              </div>
            )}
            <h2 className="font-display text-xl font-bold text-amber-50">
              Consultation Ended
            </h2>
            <p className="text-sm text-orange-100/50">
              Thank you for consulting with {selectedPandit?.name || "Pandit Ji"}.
            </p>
            <p className="text-sm text-orange-100/50">
              Session ID:{" "}
              <span className="font-mono text-amber-300">{sessionId}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setMinutes(12);
                  setEnded(false);
                }}
                className="sutra-btn-primary font-bold"
              >
                <Phone className="mr-2 h-4 w-4" /> Recharge & Talk Again — ₹551
              </Button>
              <Button
                onClick={() => navigate("/live-consultation")}
                variant="outline"
                className="sutra-btn-outline"
              >
                Choose Another Pandit
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <CallScreen
      sessionId={sessionId}
      minutes={minutes}
      panditStatus={panditStatus}
      onEnd={handleEnd}
      onRecharge={handleRecharge}
      panditName={selectedPandit?.name}
      panditTitle={selectedPandit?.title}
      panditSpecialty={selectedPandit?.specialty}
      panditImage={selectedPandit?.image}
    />
  );
};

export default Consultation;
