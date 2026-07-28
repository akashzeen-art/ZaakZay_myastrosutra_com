import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ReadingsProvider } from "@/contexts/ReadingsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";
import LoadingOverlay from "./components/LoadingOverlay";
import CosmicBackground from "./components/CosmicBackground";
import SubscriptionGateModal from "@/components/SubscriptionGateModal";
import ServiceGateRoute from "@/components/ServiceGateRoute";
import { handleLoggedInUserPageLoad } from "@/utils/loginSuccessHandler";
import { initializeClickId, getMsisdnFromUrl } from "@/utils/clickIdManager";
import { checkUserStatus, isUserSubscribed } from "@/services/userStatusApi";
import { syncSubscriptionFromApi } from "@/lib/subscription";
import { FEATURES } from "@/lib/config";
import { hasCompleteBirthProfile } from "@/services/userProfileApi";

import Index from "./pages/Index";
// TEMPORARY: Palm scanning disabled — uncomment to re-enable
// import PalmAnalysis from "./pages/PalmAnalysis";
import Numerology from "./pages/Numerology";
import AstrologyReading from "./pages/AstrologyReading";
import Horoscope from "./pages/Horoscope";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import VideoBackgroundDemo from "./pages/VideoBackgroundDemo";
import KidsBoxPortal from "./pages/KidsBoxPortal";
import VideoTest from "./pages/VideoTest";
import Checkout from "./pages/Checkout";
import LiveConsultation from "./pages/LiveConsultation";
import Consultation from "./pages/Consultation";
import AdminPanel from "./pages/AdminPanel";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MyAccount from "./pages/MyAccount";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProfileSetup from "./pages/ProfileSetup";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PaymentInitializer() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!FEATURES.PAYMENTS) return;

    const { portalId } = initializeClickId();
    const msisdn = getMsisdnFromUrl();

    if (msisdn && portalId) {
      checkUserStatus(msisdn, portalId)
        .then((statusData) => {
          if (isUserSubscribed(statusData)) {
            localStorage.setItem("isSubscribed", "true");
            localStorage.setItem("userMobile", msisdn);
            localStorage.setItem("subscriptionData", JSON.stringify(statusData));
            syncSubscriptionFromApi(msisdn, statusData.packType);
            if (!hasCompleteBirthProfile()) {
              navigate("/profile/setup", { replace: true });
            }
          } else {
            localStorage.removeItem("isSubscribed");
            localStorage.removeItem("subscriptionData");
          }
        })
        .catch(() => {
          localStorage.removeItem("isSubscribed");
          localStorage.removeItem("subscriptionData");
        });
    } else {
      handleLoggedInUserPageLoad().then((wasRedirected) => {
        if (!wasRedirected) {
          const storedMobile = localStorage.getItem("userMobile");
          if (storedMobile && portalId) {
            checkUserStatus(storedMobile, portalId)
              .then((statusData) => {
                if (isUserSubscribed(statusData)) {
                  localStorage.setItem("isSubscribed", "true");
                  localStorage.setItem("subscriptionData", JSON.stringify(statusData));
                  syncSubscriptionFromApi(storedMobile, statusData.packType);
                  if (!hasCompleteBirthProfile()) {
                    navigate("/profile/setup", { replace: true });
                  }
                }
              })
              .catch(() => {});
          }
        }
      });
    }
  }, [navigate]);

  return null;
}

function AppRoutes() {
  const { setUserFromSubscription } = useAuth();

  return (
    <SubscriptionProvider onUserActivated={setUserFromSubscription}>
      <PaymentInitializer />
      <SubscriptionGateModal />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        {/* TEMPORARY: Palm scanning disabled — uncomment to re-enable
        <Route path="/palm-analysis" element={<ServiceGateRoute><PalmAnalysis /></ServiceGateRoute>} />
        */}
        <Route path="/numerology" element={<ServiceGateRoute><Numerology /></ServiceGateRoute>} />
        <Route path="/astrology" element={<ServiceGateRoute><AstrologyReading /></ServiceGateRoute>} />
        <Route path="/horoscope" element={<ServiceGateRoute><Horoscope /></ServiceGateRoute>} />
        <Route path="/dashboard" element={<ServiceGateRoute><Dashboard /></ServiceGateRoute>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/live-consultation" element={<ServiceGateRoute><LiveConsultation /></ServiceGateRoute>} />
        <Route path="/consultation" element={<ServiceGateRoute><Consultation /></ServiceGateRoute>} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/video-demo" element={<VideoBackgroundDemo />} />
        <Route path="/kids-portal" element={<KidsBoxPortal />} />
        <Route path="/video-test" element={<VideoTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SubscriptionProvider>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <>
    <CosmicBackground />
    <LoadingOverlay />
    <div className="relative z-[1]">
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ReadingsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </ReadingsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
    </div>
  </>
);

export default App;
