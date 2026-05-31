const DONATION_HISTORY_API_BASE = "http://localhost:5000/api/donations/history";
const DONATIONS_API_URL = "http://localhost:5000/api/donations";

const logDonationHistoryApi = (label, payload) => {
  console.log(`[Donation History API] ${label}`, payload);
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

export const fetchDonationHistory = async (userId) => {
  if (!userId) {
    console.error("Failed to fetch donation history: missing userId");
    return [];
  }

  try {
    const url = `${DONATION_HISTORY_API_BASE}/${userId}`;
    logDonationHistoryApi("fetch request", { url, userId });

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      logDonationHistoryApi("fetch error response", { status: res.status, errorText });
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    logDonationHistoryApi("fetch response", payload);

    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (err) {
    console.error("Failed to fetch donation history:", err);
    return [];
  }
};

export const createDonation = async (formData) => {
  try {
    logDonationHistoryApi("create request", { url: DONATIONS_API_URL });

    const res = await fetch(DONATIONS_API_URL, {
      method: "POST",
      body: formData,
    });

    const responseText = await res.text();
    const responsePayload = parseJsonSafely(responseText);

    if (!res.ok) {
      logDonationHistoryApi("create error response", { status: res.status, responsePayload });
      throw new Error(responsePayload?.message || `Error: ${res.status}`);
    }

    logDonationHistoryApi("create response", responsePayload);
    return responsePayload;
  } catch (err) {
    console.error("Failed to create donation:", err);
    throw err;
  }
};
