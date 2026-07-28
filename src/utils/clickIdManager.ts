import { PAYMENT_CONFIG } from "@/lib/config";

const STORAGE_PREFIX = "myastrosutra";

const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateClickId = () => `0000${generateUUID()}`;

export const validateClickId = (clickId: string | null) => {
  if (
    !clickId ||
    clickId === "null" ||
    clickId === "undefined" ||
    clickId === "NaN" ||
    clickId === ""
  ) {
    return false;
  }
  return true;
};

export const getOrGenerateClickId = (portalId: string) => {
  const storageKey = `${STORAGE_PREFIX}_clickid_${portalId}`;
  const storedClickId = localStorage.getItem(storageKey);
  if (storedClickId && validateClickId(storedClickId)) {
    return storedClickId;
  }
  const newClickId = generateClickId();
  localStorage.setItem(storageKey, newClickId);
  return newClickId;
};

export const getClickIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("clickid");
};

export const getPortalIdFromParams = (searchParams?: URLSearchParams) => {
  const params = searchParams ?? new URLSearchParams(window.location.search);
  return params.get("id") || params.get("portalId");
};

export const getPortalIdFromUrl = () => {
  const fromUrl = getPortalIdFromParams();
  if (fromUrl) {
    localStorage.setItem(`${STORAGE_PREFIX}_portal_id`, fromUrl);
    return fromUrl;
  }

  const defaultId = PAYMENT_CONFIG.DEFAULT_PORTAL_ID;
  localStorage.setItem(`${STORAGE_PREFIX}_portal_id`, defaultId);
  return defaultId;
};

export const getMsisdnFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("msisdn");
};

export const updateUrlWithClickId = (clickId: string, portalId: string) => {
  const url = new URL(window.location.href);
  const existingMsisdn = url.searchParams.get("msisdn");

  url.searchParams.delete("clickid");
  url.searchParams.delete("id");
  url.searchParams.delete("portalId");
  if (existingMsisdn) {
    url.searchParams.set("msisdn", existingMsisdn);
  }

  window.history.replaceState({}, "", url.toString());
};

export const initializeClickId = () => {
  const url = new URL(window.location.href);
  const portalId = getPortalIdFromParams(url.searchParams) || PAYMENT_CONFIG.DEFAULT_PORTAL_ID;
  const clickId = url.searchParams.get("clickid");
  const msisdn = url.searchParams.get("msisdn");

  const storageKey = `${STORAGE_PREFIX}_clickid_${portalId}`;

  if (validateClickId(clickId)) {
    localStorage.setItem(storageKey, clickId!);
  }

  localStorage.setItem(`${STORAGE_PREFIX}_portal_id`, portalId);
  url.searchParams.delete("clickid");
  url.searchParams.delete("id");
  url.searchParams.delete("portalId");
  if (msisdn) url.searchParams.set("msisdn", msisdn);
  window.history.replaceState({}, "", url.toString());

  if (validateClickId(clickId)) {
    return { clickId: clickId!, portalId };
  }

  const storedClickId = localStorage.getItem(storageKey);
  if (validateClickId(storedClickId)) {
    return { clickId: storedClickId!, portalId };
  }

  const newClickId = generateClickId();
  localStorage.setItem(storageKey, newClickId);
  return { clickId: newClickId, portalId };
};
