const WEBHOOKS_API_BASE = "http://localhost:5000/api/webhooks";

const logWebhooksApi = (label, payload) => {
  console.log(`[Webhooks API] ${label}`, payload);
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

const flattenValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") {
    return "";
  }

  const fieldErrors = errors.fieldErrors && typeof errors.fieldErrors === "object"
    ? Object.entries(errors.fieldErrors)
        .flatMap(([field, messages]) =>
          Array.isArray(messages)
            ? messages.filter(Boolean).map((message) => `${field}: ${message}`)
            : []
        )
    : [];

  const formErrors = Array.isArray(errors.formErrors)
    ? errors.formErrors.filter(Boolean)
    : [];

  return [...fieldErrors, ...formErrors].join(", ");
};

const requestJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const responseText = await res.text();
  const payload = parseJsonSafely(responseText);

  if (!res.ok) {
    const validationDetails = flattenValidationErrors(payload?.errors);
    const message = validationDetails
      ? `${payload?.message || "Validation failed"}: ${validationDetails}`
      : payload?.message || `Error: ${res.status}`;

    throw new Error(message);
  }

  return payload;
};

export const fetchWebhookProfile = async (userId) => {
  if (!userId) {
    return null;
  }

  const url = `${WEBHOOKS_API_BASE}/profile/${encodeURIComponent(userId)}`;
  logWebhooksApi("fetch profile request", { url, userId });

  const payload = await requestJson(url, {
    method: "GET",
    cache: "no-store",
  });

  logWebhooksApi("fetch profile response", payload);
  return payload?.data || null;
};

export const regenerateWebhookSecret = async (userId) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  const url = `${WEBHOOKS_API_BASE}/profile/${encodeURIComponent(userId)}/regenerate-secret`;
  logWebhooksApi("regenerate secret request", { url, userId });

  const payload = await requestJson(url, {
    method: "POST",
  });

  logWebhooksApi("regenerate secret response", payload);
  return payload?.data || null;
};

export const fetchWebhookEndpoints = async (userId) => {
  if (!userId) {
    return [];
  }

  const url = `${WEBHOOKS_API_BASE}/users/${encodeURIComponent(userId)}`;
  logWebhooksApi("fetch endpoints request", { url, userId });

  const payload = await requestJson(url, {
    method: "GET",
    cache: "no-store",
  });

  logWebhooksApi("fetch endpoints response", payload);
  return Array.isArray(payload?.data) ? payload.data : [];
};

export const fetchWebhookDeliveryHistory = async (userId, limit = 25) => {
  if (!userId) {
    return [];
  }

  const params = new URLSearchParams({ limit: String(limit) });
  const url = `${WEBHOOKS_API_BASE}/history/${encodeURIComponent(userId)}?${params.toString()}`;
  logWebhooksApi("fetch delivery history request", { url, userId, limit });

  const payload = await requestJson(url, {
    method: "GET",
    cache: "no-store",
  });

  logWebhooksApi("fetch delivery history response", payload);
  return Array.isArray(payload?.data) ? payload.data : [];
};

export const resendWebhookDelivery = async (deliveryId, userId) => {
  if (!deliveryId || !userId) {
    throw new Error("Missing delivery id or userId");
  }

  const url = `${WEBHOOKS_API_BASE}/history/${encodeURIComponent(deliveryId)}/resend`;
  logWebhooksApi("resend delivery request", { url, deliveryId, userId });

  const payload = await requestJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  logWebhooksApi("resend delivery response", payload);
  return payload?.data || null;
};

export const createWebhookEndpoint = async (input) => {
  logWebhooksApi("create endpoint request", input);

  const payload = await requestJson(WEBHOOKS_API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  logWebhooksApi("create endpoint response", payload);
  return payload?.data || null;
};

export const updateWebhookEndpoint = async (id, input) => {
  if (!id) {
    throw new Error("Missing webhook id");
  }

  const url = `${WEBHOOKS_API_BASE}/${encodeURIComponent(id)}`;
  logWebhooksApi("update endpoint request", { url, id, input });

  const payload = await requestJson(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  logWebhooksApi("update endpoint response", payload);
  return payload?.data || null;
};

export const deleteWebhookEndpoint = async (id, userId) => {
  if (!id || !userId) {
    throw new Error("Missing webhook id or userId");
  }

  const params = new URLSearchParams({ userId });
  const url = `${WEBHOOKS_API_BASE}/${encodeURIComponent(id)}?${params.toString()}`;
  logWebhooksApi("delete endpoint request", { url, id, userId });

  const payload = await requestJson(url, {
    method: "DELETE",
  });

  logWebhooksApi("delete endpoint response", payload);
  return payload?.data || null;
};
