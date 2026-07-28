// import { PAYMENT_CONFIG } from "@/lib/config"; // TEMPORARY: re-enable with live subStatus below

export type SubscriptionStatus = "ACTIVE" | "INACTIVE";

export interface UserStatusData {
  active: boolean;
  status: SubscriptionStatus;
  mobile: string;
  portalName?: string;
  packType?: string;
  startDate?: string;
  endDate?: string;
}

// TEMPORARY: unused while live API is commented — keep for re-enable
// const parseSubscriptionStatus = (raw: string): SubscriptionStatus => {
//   const normalized = raw.trim().toUpperCase();
//   return normalized === "ACTIVE" ? "ACTIVE" : "INACTIVE";
// };

/**
 * TEMPORARY: live subStatus API disabled.
 * Returns INACTIVE so the app uses local/demo subscription. Uncomment fetch to re-enable.
 */
export const checkUserStatus = async (
  mobile: string,
  _portalId: string,
): Promise<UserStatusData> => {
  if (!mobile || mobile === "" || mobile === "undefined" || mobile === "null") {
    throw new Error("Invalid mobile number");
  }

  console.warn(
    "[userStatusApi] checkUserStatus is temporarily disabled — returning INACTIVE.",
  );

  return {
    active: false,
    status: "INACTIVE",
    mobile,
  };

  // --- LIVE STATUS API (commented for now) ---
  // const apiUrl = `${PAYMENT_CONFIG.BASE_URL}/subStatus?mobile=${encodeURIComponent(mobile)}&portalId=${encodeURIComponent(_portalId)}`;
  //
  // const response = await fetch(apiUrl, {
  //   method: "GET",
  // });
  //
  // if (!response.ok) {
  //   throw new Error(`Status check failed: ${response.status}`);
  // }
  //
  // const text = (await response.text()).trim();
  // let status: SubscriptionStatus = "INACTIVE";
  //
  // try {
  //   const json = JSON.parse(text);
  //   const rawStatus =
  //     typeof json === "string"
  //       ? json
  //       : (json.status ?? json.subStatus ?? json.subscriptionStatus ?? "");
  //   status = parseSubscriptionStatus(String(rawStatus));
  // } catch {
  //   status = parseSubscriptionStatus(text);
  // }
  //
  // return {
  //   active: status === "ACTIVE",
  //   status,
  //   mobile,
  // };
};

export const isUserSubscribed = (
  statusData: UserStatusData | null | undefined,
) => {
  if (!statusData) return false;
  return statusData.active === true || statusData.status === "ACTIVE";
};

export const getSubscriptionDetails = (
  statusData: UserStatusData | null,
) => {
  if (!statusData) return null;

  return {
    portalName: statusData.portalName,
    mobile: statusData.mobile,
    packType: statusData.packType,
    startDate: statusData.startDate,
    endDate: statusData.endDate,
    active: statusData.active,
    status: statusData.status,
  };
};
