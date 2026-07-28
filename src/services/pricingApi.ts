// import { PAYMENT_CONFIG } from "@/lib/config"; // TEMPORARY: re-enable with live fetch below

/**
 * TEMPORARY: live pricing/portal API disabled.
 * Returns local demo plans. Uncomment fetch below to re-enable.
 */
export const fetchPricingData = async (_portalId: string, _clickId: string) => {
  console.warn(
    "[pricingApi] fetchPricingData is temporarily disabled — using demo plans.",
  );

  return {
    portalId: Number(_portalId) || 1002,
    currencyCode: "INR",
    multiplePackType: {
      weekly: "51",
      monthly: "101",
    },
  };

  // --- LIVE PRICING API (commented for now) ---
  // const apiUrl = `${PAYMENT_CONFIG.BASE_URL}/portal/${_portalId}?clickid=${_clickId}`;
  //
  // const response = await fetch(apiUrl, {
  //   method: "GET",
  // });
  //
  // if (!response.ok) {
  //   throw new Error(`API request failed: ${response.status}`);
  // }
  //
  // return response.json();
};

export const parsePricingForUI = (apiData: {
  portalId?: number;
  currencyCode?: string;
  multiplePackType?: Record<string, string>;
}) => {
  const { multiplePackType } = apiData;
  const plans: Record<string, { packType: string; discountedPrice: number }> = {};

  if (multiplePackType && typeof multiplePackType === "object") {
    Object.entries(multiplePackType).forEach(([key, value]) => {
      plans[key] = {
        packType: key,
        discountedPrice: parseInt(value as string),
      };
    });
  }

  return {
    portalId: apiData.portalId,
    currencyCode: apiData.currencyCode || "INR",
    plans,
  };
};
