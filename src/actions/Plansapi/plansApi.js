const PLANS_API_URL = "http://localhost:5000/api/plans";
const PLAN_PURCHASE_API_URL = "http://localhost:5000/api/plans/purchase";
const PLAN_HISTORY_API_BASE_URL = "http://localhost:5000/api/plans/history";
const PLAN_STATUS_API_BASE_URL = "http://localhost:5000/api/plans/status";

const logPlansApi = (label, payload) => {
  console.log(`[Plans API] ${label}`, payload);
};

const parseJsonSafely = (text) => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const fetchPlans = async () => {
  try {
    logPlansApi("fetch request", { url: PLANS_API_URL });

    const res = await fetch(PLANS_API_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      logPlansApi("fetch error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    logPlansApi("fetch response", payload);

    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (err) {
    console.error("Failed to fetch plans:", err);
    return [];
  }
};

const createPurchaseIdempotencyKey = ({ userId, planId, durationMonths }) => {
  const uniquePart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `purchase-${String(planId || '').slice(0, 8)}-${durationMonths}m-${uniquePart}`;
};

export const purchasePlan = async ({ userId, planId, durationMonths, provider = "PROMPTPAY" }) => {
  const payload = {
    userId,
    planId,
    durationMonths,
    provider,
    idempotencyKey: createPurchaseIdempotencyKey({ userId, planId, durationMonths }),
  };

  try {
    logPlansApi("purchase request", { url: PLAN_PURCHASE_API_URL, payload });

    const res = await fetch(PLAN_PURCHASE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    const responsePayload = parseJsonSafely(responseText);

    if (!res.ok) {
      logPlansApi("purchase error response", { status: res.status, responsePayload });
      throw new Error(responsePayload?.message || `Error: ${res.status}`);
    }

    logPlansApi("purchase response", responsePayload);
    return responsePayload;
  } catch (err) {
    console.error("Failed to purchase plan:", err);
    throw err;
  }
};

export const fetchPlanHistory = async (userId) => {
  if (!userId) {
    console.error("Failed to fetch plan history: missing userId");
    return [];
  }

  try {
    const url = `${PLAN_HISTORY_API_BASE_URL}/${userId}`;
    logPlansApi("history request", { url, userId });

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      logPlansApi("history error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    logPlansApi("history response", payload);

    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (err) {
    console.error("Failed to fetch plan history:", err);
    return [];
  }
};

export const fetchPlanStatus = async (userId) => {
  if (!userId) {
    console.error("Failed to fetch plan status: missing userId");
    return null;
  }

  try {
    const url = `${PLAN_STATUS_API_BASE_URL}/${userId}`;
    logPlansApi("status request", { url, userId });

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      logPlansApi("status error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    logPlansApi("status response", payload);

    return payload?.data || null;
  } catch (err) {
    console.error("Failed to fetch plan status:", err);
    return null;
  }
};
