import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  getMobileForVerification,
  getPortalIdForVerification,
} from "@/utils/accessControlGuard";
import {
  checkUserStatus,
  isUserSubscribed,
} from "@/services/userStatusApi";
import {
  hasActiveSubscription,
  loadSubscription,
  normalizeMobile,
  syncSubscriptionFromApi,
  clearSubscription,
} from "@/lib/subscription";
import { LogOut, Phone, RefreshCw, ShieldCheck, ShieldOff, User } from "lucide-react";

type StatusState = "loading" | "active" | "inactive" | "unknown";

const MyAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { subscription, hasAccess, openSubscribeModal } = useSubscription();
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<StatusState>("loading");
  const [checking, setChecking] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const resolveMobile = useCallback(() => {
    const fromUrlOrStore = getMobileForVerification();
    const fromSub = subscription?.mobile || loadSubscription()?.mobile;
    const stored = localStorage.getItem("userMobile");
    return normalizeMobile(fromUrlOrStore || fromSub || stored || "");
  }, [subscription]);

  const refreshStatus = useCallback(async () => {
    const currentMobile = resolveMobile();
    setMobile(currentMobile);
    setError("");

    if (!currentMobile || currentMobile.length !== 10) {
      setStatus("unknown");
      return;
    }

    setChecking(true);
    try {
      const portalId = getPortalIdForVerification();
      const data = await checkUserStatus(currentMobile, portalId);

      if (isUserSubscribed(data)) {
        setStatus("active");
        syncSubscriptionFromApi(currentMobile, data.packType);
        localStorage.setItem("isSubscribed", "true");
        localStorage.setItem("userMobile", currentMobile);
        localStorage.setItem("subscriptionData", JSON.stringify(data));
        window.dispatchEvent(new CustomEvent("subscription-updated"));
      } else {
        setStatus("inactive");
        localStorage.removeItem("isSubscribed");
        localStorage.setItem("userMobile", currentMobile);
        clearSubscription();
        window.dispatchEvent(new CustomEvent("subscription-updated"));
      }
    } catch {
      if (hasAccess || hasActiveSubscription()) {
        setStatus("active");
      } else {
        setStatus("inactive");
      }
      setError("Could not refresh status from server. Showing local status.");
    } finally {
      setChecking(false);
    }
  }, [resolveMobile, hasAccess]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    const onActivated = () => refreshStatus();
    window.addEventListener("subscription-activated", onActivated);
    return () => window.removeEventListener("subscription-activated", onActivated);
  }, [refreshStatus]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      clearSubscription();
      setMobile("");
      setStatus("unknown");
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const displayMobile = mobile
    ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`
    : "Not linked";

  const isActive = status === "active";
  const canLogout = Boolean(mobile || isActive || hasAccess);

  return (
    <Layout>
      <div className="sutra-page max-w-lg mx-auto">
        <div className="sutra-panel p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10">
              <User className="h-8 w-8 text-amber-300" />
            </div>
            <h1 className="font-display text-2xl font-bold text-amber-50 mb-1">
              My Account
            </h1>
            <p className="text-orange-100/50 text-sm">
              Subscription &amp; profile details
            </p>
          </div>

          {status === "loading" ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3 mb-1">
                  <Phone className="h-4 w-4 text-amber-400" />
                  <span className="text-xs uppercase tracking-wider text-orange-100/40">
                    Mobile Number
                  </span>
                </div>
                <p className="text-xl font-semibold text-white pl-7">
                  {displayMobile}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <ShieldCheck className="h-4 w-4 text-green-400" />
                    ) : (
                      <ShieldOff className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-xs uppercase tracking-wider text-orange-100/40">
                      Subscription Status
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      isActive
                        ? "bg-green-500/20 text-green-300 border border-green-400/40"
                        : status === "inactive"
                          ? "bg-red-500/20 text-red-300 border border-red-400/40"
                          : "bg-white/10 text-gray-300 border border-white/20"
                    }`}
                  >
                    {isActive ? "Active" : status === "inactive" ? "Inactive" : "Unknown"}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-xs text-amber-300/70 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 pt-2">
                {isActive && (
                  <button
                    type="button"
                    onClick={() => navigate("/profile/setup")}
                    className="w-full sutra-btn-outline py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Edit Birth Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={refreshStatus}
                  disabled={checking}
                  className="w-full sutra-btn-outline py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
                  {checking ? "Checking..." : "Refresh Status"}
                </button>

                {!isActive && (
                  <button
                    type="button"
                    onClick={() => openSubscribeModal("/my-account")}
                    className="w-full sutra-btn-primary py-3 rounded-xl font-semibold text-sm uppercase tracking-widest"
                  >
                    {mobile ? "Subscribe Now" : "Sign In / Subscribe"}
                  </button>
                )}

                {isActive && (
                  <p className="text-center text-green-300/80 text-sm">
                    Your subscription is active. Enjoy full access to all services.
                  </p>
                )}

                {canLogout && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-red-400/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyAccount;
