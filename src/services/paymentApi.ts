// import { PAYMENT_CONFIG } from "@/lib/config"; // TEMPORARY: re-enable with live initiate

/**
 * TEMPORARY: payment initiate API disabled.
 * Do not call https://myastrosutra.com/api/payment/initiate (or /api/payment/initiate).
 * Uncomment the live body below when gateway is ready again.
 */
export const initiatePayment = (orderData: {
  portalId: string;
  clickId: string;
  mobile: string;
  packType: string;
  price: number;
}) => {
  console.warn(
    "[paymentApi] initiatePayment disabled — not calling /api/payment/initiate",
    orderData,
  );
  return;

  // --- LIVE PAYMENT API (disabled for now) ---
  // const { portalId, clickId, mobile, packType, price } = orderData;
  // const apiUrl = `${PAYMENT_CONFIG.BASE_URL}/initiate`;
  // const form = document.createElement("form");
  // form.method = "POST";
  // form.action = apiUrl;
  // const payload = {
  //   portalId: parseInt(portalId),
  //   mobile: mobile,
  //   email: "",
  //   clickId: clickId,
  //   servicePack: packType,
  //   amount: parseFloat(price.toString()),
  // };
  // Object.keys(payload).forEach((key) => {
  //   const input = document.createElement("input");
  //   input.type = "hidden";
  //   input.name = key;
  //   input.value = String((payload as Record<string, string | number>)[key]);
  //   form.appendChild(input);
  // });
  // document.body.appendChild(form);
  // form.submit();
};

export const getPackTypeFromPlan = (selectedPlan: string) => selectedPlan;

export const getPriceForPlan = (
  pricingData: { plans?: Record<string, { discountedPrice: number }> },
  selectedPlan: string,
) => {
  if (!pricingData?.plans) return 0;
  const plan = pricingData.plans[selectedPlan];
  return plan ? plan.discountedPrice : 0;
};
