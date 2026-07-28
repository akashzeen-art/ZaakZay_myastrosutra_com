import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { hasCompleteBirthProfile } from "@/services/userProfileApi";

interface ServiceGateRouteProps {
  children: ReactNode;
}

/**
 * Subscription overlay remains disabled. Active subscribers with no saved birth
 * profile are sent to the one-time profile form before using personalized tools.
 */
const ServiceGateRoute = ({ children }: ServiceGateRouteProps) => {
  const { hasAccess } = useSubscription();
  const location = useLocation();

  if (hasAccess && !hasCompleteBirthProfile()) {
    localStorage.setItem("postProfilePath", location.pathname);
    return <Navigate to="/profile/setup" replace />;
  }

  return <>{children}</>;
};

export default ServiceGateRoute;
